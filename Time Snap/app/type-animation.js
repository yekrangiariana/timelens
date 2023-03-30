let typingSound = new Audio("media/website-assets/typing-sound.mp3")
let stopTyping = false

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

      playTypingSound()

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
