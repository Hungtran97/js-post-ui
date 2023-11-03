import postApi from '../js/postApi.js'
import { initPagination, initsearch, renderPagination, renderPostList } from '../utils'

async function handleFilterChange(filterName, filterValue) {
  //update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)

  // reset page if needed
  if (filterName === 'title_like') url.searchParams.set('_page', 1)
  history.pushState({}, '', url)
  //fetch API
  // re-render post list
  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPostList(data)
  renderPagination('pagination', pagination)
}

;(async () => {
  try {
    const url = new URL(window.location)

    //Update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)

    const queryParam = url.searchParams
    const { data, pagination } = await postApi.getAll(queryParam)
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParam,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initsearch({
      elementId: 'searchInput',
      defaultParams: queryParam,
      onChange: (value) => handleFilterChange('title_like', value),
    })
    renderPagination('pagination', pagination)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
