const slider = document.getElementById("year_slider")
const label = document.getElementById("Year")
const player = document.getElementById("play")
const stopper = document.getElementById("stop")
const legend_select = document.getElementById("legend_select")
const decrease = document.getElementById("decrease_year")
const increase = document.getElementById("increase_year")


var selected
let animating = false


decrease.addEventListener("click", async function () {
    update1()

})

increase.addEventListener("click", async function () {
    update3()
    console.log(slider.value)

})

player.addEventListener("click", async function () {
    animating = true

    if (parseInt(slider.value) == 2023){
        slider.value = 2008
    }
    for (let year = slider.value; year <= 2023; year++) {
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
    update()
})


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function update(){
    slider.value = slider.value
    selected = slider.value
    label.textContent = selected
    filter(selected, legend_select.value)
}


function update1(){
    slider.value = slider.value - 1
    selected = slider.value
    label.textContent = selected
    filter(selected, legend_select.value)
}
 

function update3(){
    slider.value = parseInt(slider.value) + 1
    selected = slider.value
    label.textContent = selected
    filter(selected, legend_select.value)
}


function update2(year){
    slider.value = year
    label.textContent = year
    filter(year, legend_select.value)
}