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


export const ProcessText = () => {
    const hushSelected = document.getElementById("flexRadioDefault2")?.checked;
    return hushSelected ? "_" : "";
};

export const Proc = () => {
    const procField = document.getElementById("proc");
    if (!procField || !globalEditor) return;

    const procText = procField.value || "";
    const replacedText = procText.replaceAll("<p1_Radio>", ProcessText());
    globalEditor.setCode(replacedText);
};

export const ProcAndPlay = async () => {
    try {
        await initAudioOnFirstClick();

        if (!globalEditor) {
            console.warn("Strudel editor not initialised yet.");
            return;
        }

        Proc();

        if (!globalEditor.repl.state.started) {
            await globalEditor.evaluate();
            console.log("Started Strudel playback for the first time");
        } else {

            globalEditor.evaluate();
            console.log("Replayed Strudel");
        }

    } catch (err) {
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

export const setGlobalVolume = (value) => {
    const ctx = getAudioContext();
    if (!masterGainNode) {
        masterGainNode = ctx.createGain();
        masterGainNode.connect(ctx.destination);
    }
    masterGainNode.gain.value = value;
};


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


