const finalScore = document.querySelector("#final-score")
const resultsContainer = document.querySelector("#results")
const copyButton = document.querySelector("#copy-results")
const photos = JSON.parse(sessionStorage.getItem("photoData"))
let score = JSON.parse(sessionStorage.getItem("score")) || 0
const guessedYears = JSON.parse(sessionStorage.getItem("guessedYears"))
localStorage.setItem("latestScore", score)

document.addEventListener("DOMContentLoaded", () => {
  finalScore.textContent = score

  photos.forEach((photo, index) => {
    const photoElement = document.createElement("div")
    const moreInfoButton = document.createElement("button")
    moreInfoButton.textContent = "Learn more"
    moreInfoButton.className = "button more-info"
    moreInfoButton.addEventListener("click", () => displayModal(index, photos)) // Pass photos as an argument

    const yearsOff = Math.abs(photo.year - guessedYears[index]) // Calculate the difference between the guessed year and the actual year
    const guessedText = yearsOff === 0 ? "correct!" : `${yearsOff} years`

    resultsContainer.appendChild(photoElement)
    photoElement.innerHTML = `
    <h3><span class="photo-year-grid">${photo.year}/</span>${photo.title}</h3>    
    <p>By ${photo.photographer}</p>
    <p>You answered ${guessedYears[index]}, which was <span style="text-decoration: underline">${guessedText}</span> off.</p>
    <img src="${photo.image}" alt="${photo.title}">`
    photoElement.appendChild(moreInfoButton)
  })

  copyButton.addEventListener("click", () => {
    const resultsText = `📸 I played Time Lens and scored ${score} points! 🎉🚀 \n Can you beat me? timelens.com 🔍🌟`

    navigator.clipboard.writeText(resultsText).then(
      () => {
        alert("Results copied to clipboard!")
      },
      err => {
        console.error("Could not copy text: ", err)
      }
    )
  })
})

document.getElementById("start-again").addEventListener("click", () => {
  const totalPhotos = parseInt(sessionStorage.getItem("totalPhotos"))
  const seenPhotos = JSON.parse(localStorage.getItem("seenPhotos")) || []

  if (seenPhotos.length >= totalPhotos) {
    if (
      confirm("You have seen all images, would you like to redo the gallery?")
    ) {
      sessionStorage.removeItem("photoData") // Remove the stored photo data
      sessionStorage.removeItem("totalPhotos") // Remove the totalPhotos data
      localStorage.removeItem("seenPhotos") // Remove the seenPhotos data
      localStorage.removeItem("latestScore") // Remove the seenPhotos data
      window.location.href = "index.html"
    }
  } else {
    window.location.href = "game.html"
  }
})

function displayModal(index, photos) {
  const photo = photos[index]
  const formattedDescription = photo.description.replace(/\n/g, "<br>")
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3><span class="photo-year-grid">${photo.year}/</span>${photo.title}</h3>
      <p>By ${photo.photographer}</p>
      <p>${formattedDescription}</p>
      <img src="${photo.image}" alt="${photo.title}">
      </div>`
  document.body.appendChild(modal)
  const closeButton = modal.querySelector(".close")
  closeButton.addEventListener("click", () => {
    modal.remove()
  })
}
