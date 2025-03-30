const slider = document.getElementById("year_slider")
const label = document.getElementById("Year")
const player = document.getElementById("play")


slider.addEventListener("input", function () {
    const selected = slider.value
    label.textContent = selected
    filter(selected)
})

player.addEventListener("click", async function () {
    for (let year = 2008; year <= 2023; year++) {
        slider.value = year
        label.textContent = year
        filter(year)
        await delay(1000)
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}