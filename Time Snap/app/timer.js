let timer
let timerValue = 30
let isTimerRunning = false // Add this flag

function startTimer() {
  if (!isTimerRunning) {
    // Check if timer is already running
    isTimerRunning = true // Set flag to true
    timerValue = 30
    timerDisplay.textContent = timerValue
    timerDisplay.style.color = "inherit" // Reset the color when the timer restarts

    timer = setInterval(function () {
      timerValue--
      timerDisplay.textContent = timerValue

      if (timerValue <= 9) {
        timerDisplay.style.color = "#c84631"
      }

      if (timerValue <= 0) {
        clearInterval(timer)
        isTimerRunning = false // Reset the flag when the timer reaches 0
        checkGuess(new Event("submit", { cancelable: true }))
      }
    }, 1000)
  }
}

function stopTimer() {
  clearInterval(timer)
  isTimerRunning = false
}

function getTimeLeft() {
  return timerValue
}
