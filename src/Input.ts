export function setupUI() {
    const sliderElements = {
        sliderP: document.getElementById("PointSlider") as HTMLInputElement,
        sliderT: document.getElementById("ThetaSlider") as HTMLInputElement,
        sliderPh: document.getElementById("PhiSlider") as HTMLInputElement,
        sliderD: document.getElementById("DeltaSlider") as HTMLInputElement,
    };

    const labelElements = {
        inputLabelP: document.getElementById("inputLabelP"),
        inputLabelT: document.getElementById("inputLabelT"),
        inputLabelPh: document.getElementById("inputLabelPh"),
        inputLabelD: document.getElementById("inputLabelD"),
    };

    return { sliderElements, labelElements };
}