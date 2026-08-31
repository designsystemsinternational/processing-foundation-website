let uiText = "25 YEARS OF PROCESSING";
let sliderState = 0;
let debug = false;

const STATE_COUNT = 7;

let textInput;
let debugToggle;
let complexitySlider;

let inputFocused = false;
let sliderDragging = false;
function uiIsActive() {
  return inputFocused || sliderDragging;
}

function buildUI(canvas) {

  textInput = createInput(uiText);
  textInput.id("text-input");
  textInput.parent("sketch-holder");
  textInput.input(onTextChanged);

  debugToggle = createCheckbox(" debug", debug);
  debugToggle.id("debug-toggle");
  debugToggle.parent("sketch-holder");
  debugToggle.changed(onDebugChanged);

  complexitySlider = createSlider(0, STATE_COUNT - 1, 0, 1);
  complexitySlider.id("complexity-slider");
  complexitySlider.parent("sketch-holder");

  textInput.elt.addEventListener("focus", () => inputFocused = true);
  textInput.elt.addEventListener("blur", () => inputFocused = false);
  complexitySlider.elt.addEventListener("pointerdown", () => sliderDragging = true);
  window.addEventListener("pointerup", () => sliderDragging = false);
}

function onTextChanged() {
  uiText = textInput.value();
  rebuildTexture();
}

function onDebugChanged() {
  debug = debugToggle.checked();
  rebuildTexture();
}

function readUI() {
  if (complexitySlider) sliderState = complexitySlider.value();
  return sliderState;
}
