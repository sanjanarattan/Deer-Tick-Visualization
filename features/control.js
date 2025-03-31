const slider = document.getElementById("year_slider")
const label = document.getElementById("Year")
const player = document.getElementById("play")
const legend_select = document.getElementById("legend_select")
var selected

function update1(){
    selected = slider.value
    label.textContent = selected
    filter(selected, legend_select.value)
}

function update2(year){
    slider.value = year
    label.textContent = year
    filter(year, legend_select.value)
}

slider.addEventListener("input", function () {
    update1()
})

player.addEventListener("click", async function () {
    for (let year = 2008; year <= 2023; year++) {
        update2(year)
        await delay(800)
    }
})


legend_select.addEventListener("change", function () {
    update1()
})


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* TODO
- Stop early
- Step
- Start from point
- Switch label start - stop on click
*/