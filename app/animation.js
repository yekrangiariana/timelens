function animateScore(element, targetScore, duration) {
  const startTimestamp = performance.now()
  const startScore = 0

  function step(currentTime) {
    const elapsed = currentTime - startTimestamp
    const progress = Math.min(elapsed / duration, 1)

    // Calculate the score based on the easing function (quadratic ease out)
    const score =
      startScore +
      (targetScore - startScore) * (1 - (1 - progress) * (1 - progress))
    element.textContent = Math.round(score)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

document.addEventListener("DOMContentLoaded", () => {
  const finalScoreElement = document.getElementById("final-score")
  const finalScore = parseInt(sessionStorage.getItem("score")) || 0
  animateScore(finalScoreElement, finalScore, 2000) // 2000 ms = 2 seconds
})
