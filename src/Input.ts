import { createGeometry } from "./geometry";

const sliderElements = {
    sliderP: document.getElementById("sliderP") as HTMLInputElement,
    sliderT: document.getElementById("sliderT") as HTMLInputElement,
    sliderPh: document.getElementById("sliderPh") as HTMLInputElement,
    sliderAp: document.getElementById("sliderAp") as HTMLInputElement,
};

const labelElements = {
    inputLabelP: document.getElementById("inputLabelP"),
    inputLabelT: document.getElementById("inputLabelT"),
    inputLabelPh: document.getElementById("inputLabelPh"),
    inputLabelAp: document.getElementById("inputLabelAp"),
};

const { sliderP, sliderT, sliderPh, sliderAp } = sliderElements;
const { inputLabelP, inputLabelT, inputLabelPh, inputLabelAp } = labelElements;

const angles = [Number(sliderT.value), Number(sliderPh.value), Number(sliderAp.value)];
let numOfPoints = Number(sliderP.value);

const handleSliderInput = (slider: HTMLInputElement, label: HTMLElement, angleIndex: number) => {
    const value = Number(slider.value);
    label.innerHTML = `${slider.id}: ${value}`;
    angles[angleIndex] = value;
    createGeometry({ scenes, numOfPoints, angles });
};

sliderP.oninput = () => {
    numOfPoints = Number(sliderP.value);
    inputLabelP!.innerHTML = `Points: ${numOfPoints}`;
    createGeometry({ scenes, numOfPoints, angles });
};

sliderT.oninput = () => handleSliderInput(sliderT, inputLabelT!, 0);
sliderPh.oninput = () => handleSliderInput(sliderPh, inputLabelPh!, 1);
sliderAp.oninput = () => handleSliderInput(sliderAp, inputLabelAp!, 2);