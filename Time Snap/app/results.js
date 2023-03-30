const finalScore = document.querySelector("#final-score")
const resultsContainer = document.querySelector("#results")
const copyButton = document.querySelector("#copy-results")
const photos = JSON.parse(sessionStorage.getItem("photoData"))
const startAgainBtn = document.querySelector("#start-again")
let score = JSON.parse(sessionStorage.getItem("score")) || 0
const guessedYears = JSON.parse(sessionStorage.getItem("guessedYears"))
localStorage.setItem("latestScore", score)
const totalPhotos = parseInt(sessionStorage.getItem("totalPhotos"))
const seenPhotos = JSON.parse(localStorage.getItem("seenPhotos")) || []
let currentRound = parseInt(localStorage.getItem("currentRound")) || 1

document.addEventListener("DOMContentLoaded", () => {
  finalScore.textContent = score

  if (seenPhotos.length >= totalPhotos) {
    startAgainBtn.innerHTML = "Restart Game"
    copyButton.style.display = "block"
  } else {
    copyButton.style.display = "none"
    startAgainBtn.innerHTML = `Start round ${currentRound}/3`
  }
  generatePhotoGrid()
  copyButton.addEventListener("click", copyResults)
})

function copyResults() {
  const resultsText = `📸 I played Time Lens with ${score} points!🚀 \n Can you beat me? yekrangiariana.github.io/timelens 🔍🌟`
  navigator.clipboard.writeText(resultsText).then(() => {
    alert("Results copied to clipboard!")
  })
}

function generatePhotoGrid() {
  photos.forEach((photo, index) => {
    const photoElement = document.createElement("div")
    const moreInfoButton = document.createElement("button")
    moreInfoButton.textContent = "Learn more"
    moreInfoButton.className = "button more-info"
    moreInfoButton.addEventListener("click", () => displayModal(index, photos))

    const yearsOff = Math.abs(photo.year - guessedYears[index])
    const guessedText = yearsOff === 0 ? "correct!" : `${yearsOff} years  off`

    resultsContainer.appendChild(photoElement)
    photoElement.innerHTML = `
    <h3><span class="photo-year-grid">${photo.year}/</span>${photo.title}</h3>    
    <p>📸 ${photo.photographer}</p>
    <p>You answered ${guessedYears[index]}, which was <span style="text-decoration: underline">${guessedText}</span>.</p>
    <img src="${photo.image}" alt="${photo.title}">`
    photoElement.appendChild(moreInfoButton)
  })
}

function displayModal(index, photos) {
  const photo = photos[index]
  const formattedDescription = photo.description.replace(/\n/g, "<br>")
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3><span class="photo-year-grid">${photo.year}/</span>${photo.title}</h3>
      <p>📸 ${photo.photographer}</p>
      <p>By Ariana Yekrangi</p>
      <p>${formattedDescription}</p>
      <img src="${photo.image}" alt="${photo.title}">
      </div>`
  document.body.appendChild(modal)
  const closeButton = modal.querySelector(".close")
  closeButton.addEventListener("click", () => {
    modal.remove()
  })
}

startAgainBtn.addEventListener("click", () => {
  if (seenPhotos.length >= totalPhotos) {
    if (
      confirm("You have seen all images, would you like to redo the gallery?")
    ) {
      sessionStorage.removeItem("photoData") // Remove the stored photo data
      sessionStorage.removeItem("totalPhotos") // Remove the totalPhotos data
      localStorage.removeItem("seenPhotos") // Remove the seenPhotos data
      localStorage.removeItem("latestScore") // Remove the seenPhotos data
      localStorage.removeItem("currentRound")
      window.location.href = "index.html"
    }
  } else {
    window.location.href = "game.html"
  }
})
