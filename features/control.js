/**
 * Main controls for filtering logic
 */


/** @type {HTMLInputElement} */
const slider = document.getElementById("year_slider");
/** @type {HTMLElement} */
const label = document.getElementById("Year");
/** @type {HTMLElement} */
const player = document.getElementById("play");
/** @type {HTMLElement} */
const stopper = document.getElementById("stop");
/** @type {HTMLSelectElement} */
const legend_select = document.getElementById("legend_select");
/** @type {HTMLElement} */
const decrease = document.getElementById("decrease_year");
/** @type {HTMLElement} */
const increase = document.getElementById("increase_year");

let selected;
/** @type {boolean} Indicates whether the animation (play) is active */
let animating = false;

/**
 * Decreases the slider year by one and updates the display and data.
 */
decrease.addEventListener("click", async function () {
    update1();
});

/**
 * Increases the slider year by one and updates the display and data.
 */
increase.addEventListener("click", async function () {
    update3();
    console.log(slider.value);
});

/**
 * Starts the animation playing from the current slider value (or 2008 if at max).
 * Loops through years incrementally until 2023 or stopped.
 */
player.addEventListener("click", async function () {
    animating = true;

    if (parseInt(slider.value) === 2023) {
        slider.value = 2008;
    }
    for (let year = slider.value; year <= 2023; year++) {
        if (!animating) {
            break;
        }
        update2(year);
        await delay(800);
    }
    animating = false;
    console.log(animating);
});

/**
 * Stops the animation (playback).
 */
stopper.addEventListener("click", async function () {
    if (animating) {
        animating = false;
    }
});

/**
 * Updates the visualization when the legend selection changes.
 */
legend_select.addEventListener("change", function () {
    update();
});

/**
 * Returns a Promise that resolves after the given number of milliseconds.
 * @param {number} ms - The delay duration in milliseconds
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Updates the slider label and filters visualization based on current slider and legend values.
 */
function update() {
    slider.value = slider.value;
    selected = slider.value;
    label.textContent = selected;
    filter(selected, legend_select.value);
}

/**
 * Decreases the slider year by one and updates label and filter.
 */
function update1() {
    slider.value = slider.value - 1;
    selected = slider.value;
    label.textContent = selected;
    filter(selected, legend_select.value);
}

/**
 * Increases the slider year by one and updates label and filter.
 */
function update3() {
    slider.value = parseInt(slider.value) + 1;
    selected = slider.value;
    label.textContent = selected;
    filter(selected, legend_select.value);
}

/**
 * Updates the slider to a specific year, updates label, and filters visualization.
 * @param {number|string} year - The year to update the slider to
 */
function update2(year) {
    slider.value = year;
    label.textContent = year;
    filter(year, legend_select.value);
}
