import * as yup from 'yup'
import { isValidUrl, setTextContent, upadateBackgroundImageUrl } from '.'

let imgSelected = ''
function getFormValue(form) {
  const formValue = {}
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValue[key] = value === undefined ? '' : value
  }
  return formValue
}

function getPostChema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test('at-least two words', 'Please enter at least 2 words', (value) => {
        return value.trim().split(' ').length >= 2
      }),
    description: yup.string().required('Please enter description for this post'),
    sourceImg: yup
      .string()
      .required('Please enter IMG source')
      .oneOf(['random', 'userFile', 'userUrl'], 'Invalid source!'),
    imageUrl: yup.string().when('sourceImg', {
      is: 'random',
      then: yup
        .string()
        .required('Please enter hero image')
        .url('It is not a Url '),
    }),
    imageFile: yup.mixed().when('sourceImg', {
      is: 'userFile',
      then: yup
        .mixed()
        .test('required', 'Please upload your image', (file) => Boolean(file && file.size > 0)),
    }),
    userImageUrl: yup.string().when('sourceImg', {
      is: 'userUrl',
      then: yup
        .string()
        .required('Please enter hero image')
        .url('It is not a Url '),
    }),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValue) {
  // Check error
  try {
    // reset previous error
    ;['title', 'author', 'description', 'imageUrl', 'imageFile', 'userImageUrl'].forEach((name) => {
      setFieldError(form, name, '')
    })

    const schema = getPostChema()
    await schema.validate(formValue, { abortEarly: false })
  } catch (error) {
    const errorLog = {}
    console.log(error.inner)
    for (const validationError of error.inner) {
      const name = validationError.path
      if (errorLog[name]) continue
      setFieldError(form, name, validationError.message)
      console.log(validationError.message)
      errorLog[name] = true
    }
  }

  // add class .was-valideted for element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function showLoading(form) {
  const submitButton = form.querySelector(`[name="submit"]`)
  if (submitButton) {
    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Saving...'
    submitButton.disabled = true
  }
}
function hideLoading(form) {
  const submitButton = form.querySelector(`[name="submit"]`)
  if (submitButton) {
    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Save'
    submitButton.disabled = false
  }
}
function randomNumber(n) {
  if (n <= 0) return -1
  const random = Math.random() * n

  return Math.round(random)
}
function innitRandomImage(form) {
  const imageButton = form.querySelector('#postChangeImage')
  imageButton.addEventListener('click', (e) => {
    const randomImgUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    const urlInputRandom = document.getElementById('randomImageControl')
    if (!urlInputRandom) return
    urlInputRandom.querySelector(`[name="imageUrl"]`).value = randomImgUrl
    imgSelected = randomImgUrl
    upadateBackgroundImageUrl('postHeroImage', imgSelected)
  })
}

function innitUploadImage(form) {
  const inputImgLink = form.querySelector('#inputLink')
  if (!inputImgLink) return
  inputImgLink.addEventListener('blur', (event) => {
    imgSelected = inputImgLink.value
    const inputImgFile = form.querySelector('#inputFile')
    if (imgSelected === inputImgFile.files[0]?.name) {
      imgSelected = URL.createObjectURL(inputImgFile.files[0])
    } else {
      // inputImgFile.value = ''
    }
    if (Boolean(imgSelected) && !isValidUrl(imgSelected)) {
      imgSelected = URL.createObjectURL(inputImgFile.files[0])
    }
    upadateBackgroundImageUrl('postHeroImage', imgSelected)
  })
  const inputImgFile = form.querySelector('#inputFile')
  if (!inputImgFile) return
  inputImgFile.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      imgSelected = URL.createObjectURL(selectedFile)
      inputImgLink.value = selectedFile.name
      upadateBackgroundImageUrl('postHeroImage', imgSelected)
    }
  })
}
function initImgOption(form) {
  const inputImgElement = form.querySelector('#imgInput')
  if (!inputImgElement) return
  const optionListImg = [...inputImgElement.querySelectorAll('[name="sourceImg"]')]
  const inputImgList = [...inputImgElement.querySelectorAll('[name="sourceImgOption"]')]
  inputImgElement.firstElementChild.addEventListener('click', (e) => {
    if (e.target.type === 'radio') {
      const inputImgElement = inputImgList[optionListImg.indexOf(e.target)]
      inputImgList.forEach((inputElement) => (inputElement.hidden = true))
      inputImgElement.hidden = false
      let imgValue = inputImgElement.getElementsByTagName('input')[0].value
      if (Boolean(imgValue) && !isValidUrl(imgValue)) {
        const inputImgFile = form.querySelector('#inputFile')
        imgValue = URL.createObjectURL(inputImgFile.files[0])
      }
      imgSelected = imgValue
      upadateBackgroundImageUrl('postHeroImage', imgSelected)
    }
  })
}

export function initForm({ formId, defaultValue, onSubmit }) {
  const postFormElement = document.getElementById(formId)

  if (!postFormElement) return
  innitRandomImage(postFormElement)
  innitUploadImage(postFormElement)

  //Update dafault value
  Object.keys(defaultValue).forEach((x) => {
    const elementInputList = postFormElement.querySelectorAll(`[name="${x}"]`)
    if (!elementInputList) return
    for (let element of elementInputList) {
      if (!element) continue
      if (element.type == 'file') continue
      element.value = defaultValue[x]
    }
  })
  upadateBackgroundImageUrl('postHeroImage', defaultValue['imageUrl'])

  initImgOption(postFormElement)
  let isSubmitting = false
  const submitButton = postFormElement.querySelector(`[name="submit"]`)
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    showLoading(postFormElement)
    if (isSubmitting) return
    isSubmitting = true
    const submitedValue = getFormValue(postFormElement)
    const isValid = await validatePostForm(postFormElement, submitedValue)
    // const isValid = validatePostForm(postFormElement, submitedValue)
    submitedValue.id = defaultValue.id
    if (isValid) await onSubmit?.(submitedValue)
    isSubmitting = false
    hideLoading(postFormElement)
  })
}
