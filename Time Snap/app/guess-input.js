const guessValue = document.querySelector("#guess-value")
const guessInput = document.querySelector("#guess-input")
const incrementButton = document.getElementById("increment-button")
const decrementButton = document.getElementById("decrement-button")
const container = document.querySelector(".timeline-container")

const generateTimelineMarks = () => {
  const totalYears = 2023 - 1826
  const majorYearInterval = 25
  const minorYearInterval = 10

  for (let i = 0; i <= totalYears; i++) {
    const mark = document.createElement("div")
    mark.classList.add("timeline-mark")

    if (i % majorYearInterval === 0 || i === totalYears) {
      mark.classList.add("timeline-mark--major")

      const yearLabel = document.createElement("div")
      yearLabel.textContent = 1826 + i
      yearLabel.classList.add("year-label")
      yearLabel.style.left = `${(i / totalYears) * 100}%`

      container.appendChild(yearLabel)
    } else if (i % minorYearInterval === 0) {
      mark.style.height = "1em" //year label mark height
    }

    mark.style.left = `${(i / totalYears) * 100}%`
    container.appendChild(mark)
  }
}

generateTimelineMarks()

const updateGuessValuePosition = () => {
  const valuePercentage =
    ((guessInput.value - guessInput.min) / (guessInput.max - guessInput.min)) *
    100
  const thumbWidth = 1.5
  const halfThumbWidth = thumbWidth / 2

  guessValue.style.left = `calc(${valuePercentage}% - (${halfThumbWidth}em))`
  guessValue.style.top = "calc(100% - 1.1em)"
}

guessValue.textContent = guessInput.value
updateGuessValuePosition()

guessInput.addEventListener("input", function () {
  guessValue.textContent = this.value
  updateGuessValuePosition()
})

document.addEventListener("DOMContentLoaded", function () {
  function updateGuessValue() {
    guessValue.textContent = guessInput.value
  }

  function incrementSlider() {
    const newValue = parseInt(guessInput.value) + 1
    if (newValue <= parseInt(guessInput.max)) {
      guessInput.value = newValue
      updateGuessValue()
    }
    guessInput.focus()
  }

  function decrementSlider() {
    const newValue = parseInt(guessInput.value) - 1
    if (newValue >= parseInt(guessInput.min)) {
      guessInput.value = newValue
      updateGuessValue()
    }
    guessInput.focus()
  }

  guessInput.addEventListener("input", updateGuessValue)
  incrementButton.addEventListener("click", incrementSlider)
  decrementButton.addEventListener("click", decrementSlider)

  updateGuessValue()
})
