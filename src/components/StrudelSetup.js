import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput, registerSynthSounds } from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import console_monkey_patch from "../console-monkey-patch";

let globalEditor = null;
let masterGainNode = null;
let globalPlaybackRate = 1.0;

// Mute main_arp section if hush option is selected
export const ProcMute = (code) => {
    const hushSelected = document.getElementById("optionHush")?.checked;
    if (hushSelected) {
        code = code.replace(
            /(main_arp:[\s\S]*?\.postgain\()\s*pick\(gain_patterns,\s*pattern\)(\))/,
            "$10$2"
        );
        console.log("HUSH enabled: main_arp muted dynamically");
    }
    return code;
};

export const Proc = () => {
    const procField = document.getElementById("proc");
    if (!procField || !globalEditor) return;

    let procText = procField.value || "";
    // apply hush if hush option has been selected
    procText = ProcMute(procText);
    globalEditor.setCode(procText);
};


export const ProcAndPlay = async (instrument = "all", effects = {}) => {
    try {
        await initAudioOnFirstClick();

        if (!globalEditor) {
            console.warn("Strudel editor not initialised yet.");
            return;
        }

        const procField = document.getElementById("proc");
        if (!procField) return;

        let originalCode = procField.value || "";

        // Inject live performance effects dynamically
        let effectCode = "";
        if (effects.filterSweep)
            effectCode += `\nall(x => x.lpf(${effects.filterSweep}))`;
        if (effects.reverbDepth)
            effectCode += `\nall(x => x.room(${effects.reverbDepth}))`;
        if (effects.autoPan)
            effectCode += `\nall(x => x.pan(sine.range(-1,1)))`;
        if (effects.hpf)
            effectCode += `\nall(x => x.hpf(${effects.hpf}))`;
        if (effects.gainBoost)
            effectCode += `\nall(x => x.gain(${effects.gainBoost}))`;
        if (effects.delay)
            effectCode += `\nall(x => x.delay(${effects.delay}))`;

        // Append effects to tune
        originalCode += `\n${effectCode}\n`;

        // Handle instrument filtering (bass, synth, drum, all)
        if (instrument === "all") {

            try
            {
                if (globalEditor.repl?.state?.started) globalEditor.stop();
            }
            catch (e)
            { }
            globalEditor.setCode(originalCode);
            await globalEditor.evaluate();
            console.log("Playing all instruments");
            return;
        }

        // If an instrument is selected, play the selected instrument only
        const lines = originalCode.split(/\r?\n/);

        const labelRE = /^\s*[A-Za-z0-9_]+\s*:/;
        let firstLabelIndex = lines.findIndex(l => labelRE.test(l));
        if (firstLabelIndex === -1) firstLabelIndex = lines.length;

        const headerLines = lines.slice(0, firstLabelIndex);

        // Find where each instrument section starts
        const labelPositions = [];
        for (let i = firstLabelIndex; i < lines.length; i++) {
            const m = lines[i].match(/^\s*([A-Za-z0-9_]+)\s*:/);
            if (m) labelPositions.push({ name: m[1].trim(), idx: i });
        }

        // Split code into instrument blocks
        const blocks = {};
        for (let j = 0; j < labelPositions.length; j++) {
            const name = labelPositions[j].name;
            const start = labelPositions[j].idx;
            const end = (j + 1 < labelPositions.length) ? labelPositions[j + 1].idx : lines.length;
            blocks[name] = lines.slice(start, end).join("\n");
        }

        // Map instruments to their code sections
        const instrumentMap = {
            bass: ["bassline"],
            synth: ["main_arp"],
            drum: ["drums", "drums2"]
        };

        const wantedBlocks = instrumentMap[instrument] || [];

        // Combine header and selected instrument blocks
        let assembledParts = headerLines.filter(Boolean);
        assembledParts.push("");
        assembledParts = assembledParts.concat(wantedBlocks.filter(n => blocks[n]).map(n => blocks[n]));

        const assembled = assembledParts.join("\n\n");

        const finalCode = assembled.trim().length ? assembled : originalCode;

        try
        {
            if (globalEditor.repl?.state?.started) globalEditor.stop();
        }
        catch (e) { }

        globalEditor.setCode(finalCode);

        await globalEditor.evaluate();

        console.log(`Playing instrument filter: ${instrument}`);
        console.log("Effects applied:", effects);
    }
    catch (err) {
        console.error("ProcAndPlay error:", err);
    }
};


export const setupStrudel = async (stranger_tune, setProcText) => {
    console_monkey_patch();

    const canvas = document.getElementById("roll");
    canvas.width *= 2;
    canvas.height *= 2;
    const ctx = canvas.getContext("2d");
    const drawTime = [-2, 2];

    globalEditor = new StrudelMirror({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
        transpiler,
        root: document.getElementById("editor"),
        drawTime,
        onDraw: (haps, time) =>
            drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
        prebake: async () => {
            initAudioOnFirstClick();
            const loadModules = evalScope(
                import("@strudel/core"),
                import("@strudel/draw"),
                import("@strudel/mini"),
                import("@strudel/tonal"),
                import("@strudel/webaudio")
            );
            await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
        },
    });

    document.getElementById("proc").value = stranger_tune;
    setProcText(stranger_tune);
    Proc();
};

export const handlePlay = () => {
    if (globalEditor) globalEditor.evaluate();
};

export const handleStop = () => {
    if (globalEditor) globalEditor.stop();
};

// Set global volume for playback
export const setGlobalVolume = (value) => {
    const ctx = getAudioContext();
    if (!masterGainNode) {
        masterGainNode = ctx.createGain();
        masterGainNode.connect(ctx.destination);
    }
    masterGainNode.gain.value = value;
};

// Change playback speed (BPM)
export const setPlaybackSpeed = (value, setProcText) => {
    const speed = parseFloat(value);
    if (!isFinite(speed) || speed <= 0) return;

    globalPlaybackRate = speed;
    window.currentPlaybackSpeed = speed;

    const procField = document.getElementById("proc");

    if (procField) {
        let code = procField.value;

        const regex = /setcps\((\d+)\s*\/\s*60\s*\/\s*4\)/;
        const match = code.match(regex);

        // Update setcps() line with new BPM
        if (match) {
            const oldBPM = parseFloat(match[1]);
            const newBPM = 140 * speed;
            code = code.replace(regex, `setcps(${newBPM}/60/4)`);

            procField.value = code;
            if (globalEditor) globalEditor.setCode(code);
            if (setProcText) setProcText(code);

            console.log(`setcps updated - ${newBPM} BPM`);
        }
    }

    console.log("Playback speed set to:", speed);
};


