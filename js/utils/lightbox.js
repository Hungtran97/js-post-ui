function showModal (modal) {
    const modalElement = new window.bootstrap.Modal(modal)
    if (modalElement) modalElement.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) return


    if (modalElement.dataset.registered) return

    const imgElement = modalElement.querySelector(imgSelector)
    const prevButton = modalElement.querySelector(prevSelector)
    const nextButton = modalElement.querySelector(nextSelector)
    if (!imgElement || !prevButton || !nextButton) return

    let imgList = []
    let currentIndex = 0

    function showImageAtIndex (index) {
        imgElement.src = imgList[index].src
    }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName != 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album=${target.dataset.album}]`)
    currentIndex = [...imgList].findIndex((x) => x == target)

    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })
  prevButton.addEventListener('click', e => {
    if (currentIndex <= 0) {currentIndex = imgList.length - 1
    } else {currentIndex -= 1}
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', e => {
    if (currentIndex >= imgList.length - 1) {currentIndex = 0
    } else {currentIndex += 1}
    showImageAtIndex(currentIndex)
  })

  modalElement.dataset.registered = 'true'

}
