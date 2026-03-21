export default {
  layout: 'post',
  permalink(data) {
    // Do not generate a permalink (and thus a page) for external posts
    if (data.external) return false

    const date = data.page?.date || data.date
    if (!date) return false

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `/${year}/${month}/${day}/${data.page.fileSlug}/`
  },
}
