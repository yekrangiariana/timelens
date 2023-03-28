const carouselPrev = document.querySelector("#carousel-prev")
const carouselNext = document.querySelector("#carousel-next")
const resultsElement = document.querySelector("#results")

// Click event listeners for carouselPrev and carouselNext buttons
carouselPrev.addEventListener("click", () => {
  resultsElement.scrollBy({
    left: -resultsElement.clientWidth,
    behavior: "smooth"
  })
})

carouselNext.addEventListener("click", () => {
  resultsElement.scrollBy({
    left: resultsElement.clientWidth,
    behavior: "smooth"
  })
})

// Keyboard arrow key event listeners
document.addEventListener("keydown", event => {
  if (event.code === "ArrowLeft") {
    carouselPrev.click() // Trigger click event on carouselPrev button
  } else if (event.code === "ArrowRight") {
    carouselNext.click() // Trigger click event on carouselNext button
  }
})
