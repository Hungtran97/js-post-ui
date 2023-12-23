import postApi from './api/postApi'
import { initForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  console.log(formValues);
  return
  try {
    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    //show toast message
    toast.sucsess('Add/edit sucsess')
    // redirect to post detail
    setTimeout(() => {
      // window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 2000)
  } catch (error) {
    console.log('Faile to fetch Api', error)
    toast.error(`Erorr: ${error}`)
  }
}
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          author: '',
          description: '',
          imageUrl: '',
          title: '',
        }

    initForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('faile to fetch post detail', error)
  }
})()
