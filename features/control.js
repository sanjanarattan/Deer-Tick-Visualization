const slider = document.getElementById("year_slider")
const label = document.getElementById("Year")
const player = document.getElementById("play")
const stopper = document.getElementById("stop")
const legend_select = document.getElementById("legend_select")
var selected
let animating = false

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
    animating = true
    for (let year = 2008; year <= 2023; year++) {
        if (!animating){
            break
        }
        update2(year)
        await delay(800)
    }
    animating = false
    console.log(animating)

})

stopper.addEventListener("click", async function () {
    if (animating){
        animating  = false
    }

})



legend_select.addEventListener("change", function () {
    update1()
})


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* TODO
- Step
- Start from point
*/