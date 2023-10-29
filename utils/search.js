
import debounce from 'lodash.debounce'

export function initsearch({elementId, defaultParams, onChange}) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like')
  }
  // set defaut query params
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 1000)
  searchInput.addEventListener('input', debounceSearch)
}
