function getPostDateFromPath(inputPath) {
  if (!inputPath) return null

  const match = inputPath.match(/\/(\d{4})-(\d{2})-(\d{2})-[^/]+\.md$/)
  if (!match?.[1] || !match[2] || !match[3]) return null

  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`)
}

const config = {
  layout: 'post',
  date: 'Last Modified',
  eleventyComputed: {
    creation_date(data) {
      const inputPath = data.page?.inputPath
      return getPostDateFromPath(inputPath) || data.date
    },
  },
  permalink(data) {
    // Do not generate a permalink (and thus a page) for external posts
    if (data.external) return false

    const date = getPostDateFromPath(data.page?.inputPath)
    if (!date) return false

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `/${year}/${month}/${day}/${data.page.fileSlug}/`
  },
}

if (process.env.NODE_ENV === 'production') {
  config.date = 'git Last Modified'
}

export default config
