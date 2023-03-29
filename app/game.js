function parsePhotos() {
  return new Promise((resolve, reject) => {
    const seenPhotos = JSON.parse(localStorage.getItem("seenPhotos")) || []

    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvData => {
        const photos = []
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            results.data.forEach(row => {
              if (!seenPhotos.includes(row.title)) {
                photos.push({
                  title: row.title,
                  image: row.image,
                  year: parseInt(row.year),
                  clue: row.clue,
                  description: row.description,
                  photographer: row.photographer
                })
              }
            })
            resolve({ photos, totalPhotos: results.data.length })
          },
          error: function (error) {
            reject(error)
          }
        })
      })
      .catch(error => {
        reject(error)
      })
  })
}

checkSeenPhotos()

const photoTitle = document.querySelector("#photo-title")
const hintButton = document.querySelector("#hint-button")
const feedbackMessage = document.querySelector("#feedback-message")
const photoContainer = document.querySelector("#photo-container")
const guessForm = document.querySelector("#guess-form")
const timerDisplay = document.querySelector("#timer-value")
const csvFilePath = "media/photo game - Sheet1.csv"
const submitButton = document.querySelector("#submit-btn")
const correctAnswerMarker = document.createElement("div")
correctAnswerMarker.id = "correct-answer-marker"
const transitionTime = 2000

let currentPhotoIndex = 0
let guessedYears = []
let latestScore = localStorage.getItem("latestScore")
let score = latestScore !== null ? parseInt(latestScore) : 0
let typingSound = new Audio("media/website-assets/typing-sound.mp3")
let stopTyping = false

document.querySelector("#score-value").textContent = score
let streakCount = 0
let seenPhotos = JSON.parse(localStorage.getItem("seenPhotos")) || []
let isHintDisplayed = false

hintButton.addEventListener("click", provideHint)
guessForm.addEventListener("submit", checkGuess)

document.addEventListener("DOMContentLoaded", async () => {
  currentPhotoIndex = 0

  try {
    const { photos: parsedPhotos, totalPhotos } = await parsePhotos()
    sessionStorage.setItem("totalPhotos", totalPhotos)
    photos = parsedPhotos // Assign parsedPhotos to photos
    photos = selectAndShufflePhotos(photos, 10)
    window.photos = photos
    displayPhoto()
    startTimer()
  } catch (error) {
    console.error("Error while parsing photos:", error)
  }
  generateTimelineMarks()
})

function filterUnseenPhotos(photos) {
  return photos.filter(photo => !seenPhotos.includes(photo.title))
}

function selectAndShufflePhotos(photos, num) {
  const selectedPhotos = []
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * photos.length)
    selectedPhotos.push(photos[randomIndex])
    photos.splice(randomIndex, 1)
  }
  return selectedPhotos
}

function getCurrentPhoto() {
  return photos[currentPhotoIndex]
}

function executeWithDelay(callback, delay) {
  setTimeout(function () {
    callback()
  }, delay)
}

function displayPhoto() {
  stopTyping = true
  setTimeout(() => {
    stopTyping = false
  }, 500)
  const photo = getCurrentPhoto()
  if (submitButton.disabled) {
    submitButton.disabled = false
  }

  if (photo) {
    const img = document.createElement("img")
    img.src = photo.image
    img.alt = photo.title

    const photoContainer = document.querySelector("#photo-container")
    photoContainer.innerHTML = ""
    photoContainer.appendChild(img)

    const photoTitle = document.querySelector("#photo-title")
    photoTitle.textContent = photo.title
    hintButton.style.display = "block"
  } else {
    checkGameEnd()
  }

  guessInput.focus()
}

function displayFeedback(correct, currentPhoto) {
  if (correct) {
    feedbackMessage.textContent = "✅ Correct!"
    feedbackMessage.style.backgroundColor = "#121212"
    feedbackMessage.style.borderRadius = "5px"
    feedbackMessage.style.width = "fit-content"
    feedbackMessage.style.color = "white"
    feedbackMessage.style.padding = "5pm"
  } else {
    showCorrectAnswerMarker(currentPhoto.year)
  }

  executeWithDelay(() => {
    feedbackMessage.textContent = ""
    hideCorrectAnswerMarker()
  }, transitionTime)
}

function showCorrectAnswerMarker(year) {
  const valuePercentage =
    ((year - guessInput.min) / (guessInput.max - guessInput.min)) * 100

  const yearLabel = document.createElement("div")
  yearLabel.textContent = `📸 taken in ${year}!`
  yearLabel.style.position = "absolute"
  yearLabel.style.minWidth = "100px"
  yearLabel.style.top = "4.1em"
  yearLabel.style.left = "1em"
  yearLabel.style.transform = "translateX(-50%)"
  yearLabel.style.backgroundColor = "green"
  yearLabel.style.color = "white"
  yearLabel.style.padding = "2px 4px"
  yearLabel.style.borderRadius = "5px"
  yearLabel.style.fontSize = "1rem"
  yearLabel.style.fontWeight = "bold"

  correctAnswerMarker.style.left = `calc(${valuePercentage}% - (${
    valuePercentage / 100
  } * 2em))`
  correctAnswerMarker.style.top = "calc(100% - 2em)"
  correctAnswerMarker.appendChild(yearLabel)
  document
    .querySelector("#guess-input-wrapper")
    .appendChild(correctAnswerMarker)
}

function hideCorrectAnswerMarker() {
  if (document.querySelector("#correct-answer-marker")) {
    document.querySelector("#correct-answer-marker").remove()
  }
}

function playTypingSound() {
  typingSound.onerror = function () {
    console.error("Error: Cannot load the audio file")
  }

  if (typingSound.canPlayType("audio/mpeg") === "") {
    console.error("Error: Audio format not supported")
  }

  typingSound.volume = 0.5

  if (typingSound.paused) {
    typingSound.currentTime = 0
    typingSound.play()
  }
}

function typeMessage(element, message, speed = 20, callback) {
  let index = 0

  function typeChar() {
    if (index < message.length && !stopTyping) {
      element.textContent += message[index]
      index++

      playTypingSound() // Call the playTypingSound function

      setTimeout(typeChar, speed)
    } else {
      // Stop the typing sound
      typingSound.pause()
      typingSound.currentTime = 0

      if (callback) {
        callback()
      }
    }
  }
  typeChar()
}

function provideHint(e) {
  e.preventDefault()
  if (!isHintDisplayed) {
    const currentPhoto = getCurrentPhoto()

    feedbackMessage.textContent = ""
    typeMessage(feedbackMessage, currentPhoto.clue)

    feedbackMessage.style.color = "#121212"
    feedbackMessage.style.backgroundColor = "transparent"
    hintButton.style.display = "none"

    score -= 500
    document.querySelector("#score-value").textContent = score
    isHintDisplayed = true
  }
}

function checkGuess(e) {
  e.preventDefault()
  stopTimer()
  submitButton.disabled = true

  const guess = guessInput.value
  const currentPhoto = getCurrentPhoto()
  const correct = guess == currentPhoto.year
  const usedHint = hintButton.style.display === "none"
  displayFeedback(correct, currentPhoto)
  guessedYears.push(guess)

  updateScore(correct, usedHint)
  isHintDisplayed = false // Reset the isHintDisplayed flag
  currentPhotoIndex++

  guessValue.textContent = guess

  if (currentPhotoIndex < photos.length) {
    executeWithDelay(() => {
      displayPhoto()
      startTimer()
    }, transitionTime)
  } else {
    checkGameEnd()
  }
}

function checkGameEnd() {
  if (currentPhotoIndex === photos.length || timerValue === 0) {
    sessionStorage.setItem("score", score)
    sessionStorage.setItem("photoData", JSON.stringify(photos)) // Make sure the 'photos' array has 'description' and 'photographer'
    sessionStorage.setItem("guessedYears", JSON.stringify(guessedYears))
    updateSeenPhotos()

    setTimeout(() => {
      window.location.href = "results.html"
    }, transitionTime)
  }
}

function updateSeenPhotos() {
  const seenPhotoTitles = photos.map(photo => photo.title)
  seenPhotos = [...seenPhotos, ...seenPhotoTitles]
  localStorage.setItem("seenPhotos", JSON.stringify(seenPhotos))
}

function checkSeenPhotos() {
  const totalPhotos = parseInt(sessionStorage.getItem("totalPhotos"))
  const seenPhotos = JSON.parse(localStorage.getItem("seenPhotos") || "[]")

  if (seenPhotos.length >= totalPhotos) {
    const modal = document.createElement("div")
    modal.className = "custom-confirm-modal"
    modal.innerHTML = `
        <div class="custom-confirm-modal-content">
        <p>Just a reminder, you have seen all images in the gallery.</p>
        <p>We are always adding new photos to the game, but for now, would you like to redo the gallery?</p>
        <button id="ok-button">OK</button>
        </div>`
    document.body.appendChild(modal)

    const okButton = modal.querySelector("#ok-button")
    okButton.addEventListener("click", () => {
      sessionStorage.removeItem("photoData") // Remove the stored photo data
      sessionStorage.removeItem("totalPhotos") // Remove the totalPhotos data
      localStorage.removeItem("seenPhotos") // Remove the seenPhotos data
      localStorage.removeItem("latestScore") // Remove the seenPhotos data
      modal.remove()
      window.location.href = "game.html"
    })
  }
}

if (
  !sessionStorage.getItem("photoData") ||
  !sessionStorage.getItem("score") ||
  !sessionStorage.getItem("guessedYears")
) {
  sessionStorage.setItem("photoData", "[]")
  sessionStorage.setItem("score", JSON.stringify(score))
  sessionStorage.setItem("guessedYears", "[]")
}
