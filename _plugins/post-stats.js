import fs from 'node:fs'

const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
const POPULAR_TAGS_TOP = 20

function stripFrontMatter(raw) {
  const match = raw.match(FRONT_MATTER_REGEX)
  return match ? match[2].trim() : raw.trim()
}

function countWords(text) {
  return (text.match(/\S+/g) || []).length
}

function countParagraphs(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\n\s*\n/).filter(Boolean).length
}

function getContentStats(body) {
  return {
    characters: body.length,
    words: countWords(body),
    paragraphs: countParagraphs(body),
  }
}

function getPopularTags(posts, options = {}) {
  const top = options.top ?? POPULAR_TAGS_TOP
  const countByTag = new Map()

  for (const post of posts) {
    const tags = post.data?.tags ?? []
    for (const tag of tags) countByTag.set(tag, (countByTag.get(tag) ?? 0) + 1)
  }

  return Array.from(countByTag.entries())
    .map(([name, count]) => ({ name, extra: count }))
    .sort((a, b) => b.extra - a.extra)
    .slice(0, top)
}

export default function postStatsPlugin(eleventyConfig, options = {}) {
  eleventyConfig.addCollection('postStats', (collection) => {
    const posts = collection
      .getFilteredByGlob('_posts/*.md')
      .sort((a, b) => b.date - a.date)

    const postCount = posts.length

    if (postCount === 0) {
      const empty = {
        firstPostDate: null,
        lastPostDate: null,
        postCount: 0,
        avgPostsPerWeek: 0,
        avgPostsPerMonth: 0,
        avgPostsPerYear: 0,
        avgDaysBetweenPosts: 0,
        avgCharacterCount: 0,
        avgWordCount: 0,
        avgParagraphCount: 0,
        popularTags: [],
      }
      const arr = [empty]
      Object.assign(arr, empty)
      return arr
    }

    const firstPostDate = posts[posts.length - 1].date
    const lastPostDate = posts[0].date
    const spanMs = lastPostDate - firstPostDate
    const spanDays = spanMs / (24 * 60 * 60 * 1000)
    const spanWeeks = spanDays / 7
    const spanMonths = spanDays / 30.44
    const spanYears = spanDays / 365.25

    const safe = (n) => (Number.isFinite(n) && n > 0 ? n : 1)

    let totalChars = 0
    let totalWords = 0
    let totalParagraphs = 0

    for (const post of posts) {
      let body = ''

      try {
        const raw = fs.readFileSync(post.inputPath, 'utf8')
        body = stripFrontMatter(raw)
      } catch {
        // skip content stats for this post
      }

      const stats = getContentStats(body)
      totalChars += stats.characters
      totalWords += stats.words
      totalParagraphs += stats.paragraphs
    }

    const avgCharacterCount = Math.round(totalChars / postCount)
    const avgWordCount = Math.round(totalWords / postCount)
    const avgParagraphCount = Math.round(totalParagraphs / postCount)

    const avgPostsPerWeek = Math.round((postCount / safe(spanWeeks)) * 100) / 100
    const avgPostsPerMonth = Math.round((postCount / safe(spanMonths)) * 100) / 100
    const avgPostsPerYear = Math.round((postCount / safe(spanYears)) * 100) / 100
    const avgDaysBetweenPosts =
      postCount > 1 ? Math.round(spanDays / (postCount - 1)) : 0

    const popularTags = getPopularTags(posts, {
      top: options.popularTagsTop ?? POPULAR_TAGS_TOP,
    })

    const stats = {
      firstPostDate,
      lastPostDate,
      postCount,
      avgPostsPerWeek,
      avgPostsPerMonth,
      avgPostsPerYear,
      avgDaysBetweenPosts,
      avgCharacterCount,
      avgWordCount,
      avgParagraphCount,
      popularTags,
    }

    const arr = [stats]
    Object.assign(arr, stats)
    return arr
  })
}
