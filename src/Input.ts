export function setupUI() {
    const sliderElements = {
        sliderC: document.getElementById("sliderC") as HTMLInputElement,
        sliderP: document.getElementById("sliderP") as HTMLInputElement,
        sliderT: document.getElementById("sliderT") as HTMLInputElement,
        sliderPh: document.getElementById("sliderPh") as HTMLInputElement,
        sliderAp: document.getElementById("sliderAp") as HTMLInputElement,
    };

    const labelElements = {
        inputLabelC: document.getElementById("inputLabelC"),
        inputLabelP: document.getElementById("inputLabelP"),
        inputLabelT: document.getElementById("inputLabelT"),
        inputLabelPh: document.getElementById("inputLabelPh"),
        inputLabelAp: document.getElementById("inputLabelAp"),
    };

    return { sliderElements, labelElements };
}
