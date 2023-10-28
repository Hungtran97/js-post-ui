import postApi from '../js/postApi.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import { truncateText } from './common.js'

// extend relatime
dayjs.extend(relativeTime)

function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

function createPostElement(post) {
  if (!post) return
  try {
    const postTemplate = document.getElementById('postTemplate')
    if (!postTemplate) return

    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return

    // update title , description, author, thumnail
    //   const titleElement = liElement.querySelector('[data-id="title"]')
    //   if (titleElement) titleElement.textContent = post.title
    setTextContent(liElement, '[data-id="title"]', post.title)
    //   const descriptionElement = liElement.querySelector('[data-id="description"]')
    //   if (descriptionElement) descriptionElement.textContent = post.description
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 150))

    //   const authorElement = liElement.querySelector('[data-id="author"]')
    //   if (authorElement) authorElement.textContent = post.author
    setTextContent(liElement, '[data-id="author"]', post.author)

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl
      thumbnailElement.addEventListener('error', () => {
        thumbnailElement.src = 'https://dummyimage.com/1368x400/000/9b9e9e.jpg&text=thumbnail'
      })
    }
    // update time span
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

    return liElement
  } catch (error) {
    console.log('faile to create post', error)
  }
}
// Pagination
function renderPagination(pagination) {
  const ulPagination = document.getElementById('pagination')
  if (!pagination || !ulPagination) return

  const {_page, _limit, _totalRows} = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  console.log('pagination', pagination)

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  // clear current post list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

async function handlefilterChange(filterName, filterValue) {
  //update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  history.pushState({}, '', url)
  //fetch API
  // re-render post list
  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPostList(data)
  renderPagination(pagination)
}
 function handlePrevLink(e) {
  e.preventDefault()
  
  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return
  
  const page = ulPagination.dataset.page
  if (page <= 1) return
  handlefilterChange ('_page', page -1)
  console.log('prevLink')
}
function handleNextLink(e) {
  e.preventDefault()
  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return
  
  const page = ulPagination.dataset.page
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return
  handlefilterChange ('_page', page - 0 + 1)
  console.log('nextLink')
}

function initPagination() {
  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return

  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevLink)
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextLink)
  }
}
function initDefaultUrl() {
  const url = new URL(window.location)

  //Update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  history.pushState({}, '', url)
}

;(async () => {
  try {
    initPagination()
    initDefaultUrl()

    const queryParam = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParam)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
