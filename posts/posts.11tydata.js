import utilities from '../plugins/utilities.js'

export default {
  layout: 'post',
  // Although Eleventy supports “Last Modified” and “git Last Modified” magic
  // keywords, it only supports them for the `date` field, and it feels a little
  // wrong to me using that field for an *update* date. So we do not actually
  // define the `date` field which lets Eleventy extract it from the file path
  // if ever used. And on our end, we explicitly compute a creation date (which
  // is extracted from the file path) and an udpate date (which is extracted
  // from the git log if available).
  eleventyComputed: {
    // The creation date is *always* extracted from the post’s file path. It
    // doesn’t matter when the file was created, or modified. What matters is
    // the date from the URL. In another world, post URLs wouldn’t contain the
    // date, but coming from Jekyll, they do, and therefore the creation date
    // should respect that.
    creation_date(data) {
      const inputPath = data.page?.inputPath
      return getPostDateFromPath(inputPath) || data.date
    },
    // The update date is extracted from the git log if available. In order to
    // avoid paying a performance penalty with a `git log` call for every post,
    // we build a map of the post paths to their last modified date.
    // See: https://meiert.com/blog/eleventy-git-last-modified/
    update_date(data) {
      const inputPath = data.page?.inputPath
      return data.git?.[inputPath?.replace(/^\.\//, '')]
    },
  },
  permalink(data) {
    // Do not generate a permalink (and thus a page) for posts that are not
    // rendered.
    if (!utilities.isPostRendered(data)) return false

    const inputPath = data.page?.inputPath
    const date = getPostDateFromPath(inputPath)
    if (!date) return false

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `/${year}/${month}/${day}/${data.page.fileSlug}/`
  },
}

const getPostDateFromPath = inputPath => {
  if (!inputPath) return null

  const match = inputPath.match(/\/(\d{4})-(\d{2})-(\d{2})-[^/]+\.md$/)
  if (!match?.[1] || !match[2] || !match[3]) return null

  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`)
}
