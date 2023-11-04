import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import { setTextContent, truncateText } from '.'

// extend relatime
dayjs.extend(relativeTime)
export function createPostElement(post) {
  if (!post) return
  try {
    const postTemplate = document.getElementById('postTemplate')
    if (!postTemplate) return

    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return
    // set id content for post
    const postContent = liElement.firstElementChild
    postContent.dataset.idContent = post.id

    // update title , description, author, thumnail
    setTextContent(liElement, '[data-id="title"]', post.title)
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 150))
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

    //Attach event
    // Go post detail when click div.post-item
    const divElement = liElement.firstElementChild
    if (divElement) {
      divElement.addEventListener('click', () => {
        window.location.assign(`/post-detail.html?id=${post.id}`)
      })
    }
    return liElement
  } catch (error) {
    console.log('faile to create post', error)
  }
}
export function renderPostList(postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  // clear current post list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
