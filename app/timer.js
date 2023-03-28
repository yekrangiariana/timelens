let timer
let timerValue = 30
let isTimerRunning = false // Add this flag

function startTimer() {
  if (!isTimerRunning) {
    // Check if timer is already running
    isTimerRunning = true // Set flag to true
    timerValue = 30
    timerDisplay.textContent = timerValue

    timer = setInterval(function () {
      timerValue--
      timerDisplay.textContent = timerValue

      if (timerValue <= 0) {
        clearInterval(timer)
        checkGuess(new Event("submit", { cancelable: true }))
      }
    }, 1000)
  }
}

function stopTimer() {
  clearInterval(timer)
  isTimerRunning = false // Reset the flag when timer is stopped
}

function getTimeLeft() {
  return timerValue
}

function decrementTime() {
  if (timeRemaining > 0) {
    timeRemaining--
    timerValue.textContent = timeRemaining
  } else {
    clearInterval(timerInterval)
    timerInterval = null
    displayFeedback(false, getCurrentPhoto())
    checkGameEnd()
  }
}
