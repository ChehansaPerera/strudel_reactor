import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput, registerSynthSounds } from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import console_monkey_patch from "../console-monkey-patch";

let globalEditor = null;

export const ProcessText = () => {
    let replace = "";
    if (document.getElementById("flexRadioDefault2").checked) {
        replace = "_";
    }
    return replace;
};

export const Proc = () => {
    const procField = document.getElementById("proc");
    if (!procField) return;

    const procText = procField.value || "";
    const procTextReplaced = procText.replaceAll("<p1_Radio>", ProcessText);
    ProcessText(procText);
    if (globalEditor) globalEditor.setCode(procTextReplaced);
};

export const ProcAndPlay = () => {
    if (globalEditor && globalEditor.repl.state.started === true) {
        Proc();
        globalEditor.evaluate();
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
