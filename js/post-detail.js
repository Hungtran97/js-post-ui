import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent } from './utils'

// id = 'goToEditPageLink'
// id = 'postHeroImage'
// id = 'postDetailTitle'
// id = 'postDetailAuthor'
// id = 'postDetailTimeSpan'
// id = 'postDetailDescription'

// author: 'Elaina Wisozk'
// createdAt: 1692522078272
// description: 'magnam ipsa sed unde qui et esse est omnis ut id est adipisci quae odio qui omnis mollitia dolores rerum molestiae illo provident et beatae consequatur aut cum deserunt sit saepe est quibusdam quasi ea fuga veniam ut nobis vel accusamus quos voluptatibus dolor sunt animi praesentium aut adipisci id'
// id: 'lea319jollj7y1q8'
// imageUrl: 'https://picsum.photos/id/805/1368/400'
// title: 'Repudiandae doloribus'
// updatedAt: 1692522078272
function createPost(post) {
  if (!post) return
  
  const heroImage = document.querySelector('#postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url(${post.imageUrl})`
    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage = 'https://dummyimage.com/1368x400/000/9b9e9e.jpg&text=thumbnail'
    })
  }
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.createdAt).format(' - DD/MM/YYYY HH:mm'))
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
    console.log(postId)
    if (!postId) return
    const post = await postApi.getById(postId)
    createPost(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
