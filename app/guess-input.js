const guessValue = document.querySelector("#guess-value")
const guessInput = document.querySelector("#guess-input")

const generateTimelineMarks = () => {
  const container = document.querySelector(".timeline-container")
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
      mark.style.height = "1em"
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
  guessValue.style.left = `calc(${valuePercentage}% - (${
    valuePercentage / 100
  } * 1em))`
  guessValue.style.top = "calc(100% - 1.1em)"
}

guessValue.textContent = guessInput.value
updateGuessValuePosition()

guessInput.addEventListener("input", function () {
  guessValue.textContent = this.value
  updateGuessValuePosition()
})
