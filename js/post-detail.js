import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent, registerLightbox, upadateBackgroundImageUrl } from './utils'

function createPost(post) {
  if (!post) return

  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="prevLightboxImg"]',
    nextSelector: 'button[data-id="nextLightboxImg"]',
  })

  upadateBackgroundImageUrl('postHeroImage', post.imageUrl)
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  )
  setTextContent(document, '#postDetailDescription', post.description)

  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
  }
}
;(async () => {
  try {
    const searchParam = new URLSearchParams(window.location.search)
    const postId = searchParam.get('id')
    if (!postId) return
    const post = await postApi.getById(postId)
    createPost(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
