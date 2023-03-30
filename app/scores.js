const scoreChangeElement = document.querySelector("#score-change")
let streakCount = 0

function calculateScoreChange(correct, usedHint) {
  let scoreChange = 0
  const difference = Math.abs(guessInput.value - getCurrentPhoto().year)
  const timeLeft = getTimeLeft()

  if (correct) {
    scoreChange = 1000

    if (!usedHint) {
      streakCount++
      scoreChange += streakCount * 10
    } else {
      streakCount = 0
    }

    if (timeLeft > 0) {
      scoreChange += Math.floor(timeLeft / 5)
    }
  } else {
    streakCount = 0

    if (difference <= 5) {
      scoreChange = 500 - difference * 10
    } else if (difference <= 10) {
      scoreChange = 450 - (difference - 5) * 15
    } else if (difference <= 20) {
      scoreChange = 300 - (difference - 10) * 10
    } else {
      scoreChange = 0
    }
  }

  // // Hint penalty
  // if (usedHint) {
  //   scoreChange = Math.max(scoreChange - 100, 0)
  // }

  // Quick answer bonus
  if (timeLeft > 30 && difference <= 5) {
    scoreChange += 50
  } else if (timeLeft > 20 && difference <= 5) {
    scoreChange += 25
  }

  return scoreChange
}

function displayScoreChange(scoreChange, correct) {
  if (scoreChange > 0) {
    scoreChangeElement.textContent = `+${scoreChange}`
    scoreChangeElement.style.color = "green"
  } else if (scoreChange < 0) {
    scoreChangeElement.textContent = `${scoreChange}`
    scoreChangeElement.style.color = "red"
  } else {
    scoreChangeElement.textContent = ""
  }

  // Hide score change feedback after 2 seconds
  executeWithDelay(() => {
    scoreChangeElement.textContent = ""
  }, transitionTime)
}

function updateScore(correct, usedHint) {
  const scoreChange = calculateScoreChange(correct, usedHint)
  score += scoreChange
  document.querySelector("#score-value").textContent = score
  displayScoreChange(scoreChange, correct)

  if (!isHintDisplayed) {
    guessedYears.push(guessInput.value)
  }
}
