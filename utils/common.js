export function truncateText (text, maxLenght) {
    if (text.lenght < maxLenght) return text
    return `${text.slice(0, maxLenght - 1)}…`
}