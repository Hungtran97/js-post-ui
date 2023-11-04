export function createPageElement(page) {
  if (!page) return
  try {
    const pageTemplate = document.getElementById('pageTemplate')
    if (!pageTemplate) return

    const liElement = pageTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return

    // set id for page element and update page content
    liElement.dataset.idPage = page
    liElement.lastElementChild.textContent = page

    return liElement
  } catch (error) {
    console.log('faile to create page', error)
  }
}
export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  const pageNumberList = ulPagination.firstElementChild.nextElementSibling
  // clear current page list
  pageNumberList.textContent = ''

  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  // create pages element
  for (let i = 1; i <= totalPages; i++) {
    const liElement = createPageElement(i)
    pageNumberList.appendChild(liElement)
  }

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}
export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const ulPageNumber = ulPagination.firstElementChild.nextElementSibling
  if (ulPageNumber) {
    ulPageNumber.addEventListener('click', (e) => {
      e.preventDefault() 
      const page = ulPagination.dataset.page
      const idPage = e.target.parentElement.dataset.idPage
      if (page == idPage) return
      onChange?.(idPage)
    })
  }
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()
      const page = ulPagination.dataset.page
      if (page <= 1) return
      onChange?.(page - 1)
    })
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()
      const page = ulPagination.dataset.page
      const totalPages = ulPagination.dataset.totalPages
      if (page >= totalPages) return
      onChange?.(page - 0 + 1)
    })
  }
}
