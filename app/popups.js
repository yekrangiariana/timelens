const scoringPopup = document.querySelector(".scoring-popup")
const btn = document.querySelector(".rulebook-button")
const span = document.querySelector(".close")

btn.onclick = function () {
  scoringPopup.style.display = "block"
}

span.onclick = function () {
  scoringPopup.style.display = "none"
}

window.onclick = function (event) {
  if (event.target == scoringPopup) {
    scoringPopup.style.display = "none"
  }
}
