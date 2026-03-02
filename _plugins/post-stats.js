import fs from 'node:fs'

const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
const CONTENT_STATS_CACHE = new Map()
const POPULAR_TAGS_TOP = 20
const EMPTY_COLLECTION = {
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
  years: [],
}

export default function postStatsPlugin(eleventyConfig, options = {}) {
  eleventyConfig.addCollection('postStats', collection => {
    const posts = collection.getFilteredByGlob('_posts/*.md').sort((a, b) => b.date - a.date)
    const postCount = posts.length

    if (postCount === 0) {
      const arr = [EMPTY_COLLECTION]
      Object.assign(arr, EMPTY_COLLECTION)
      return arr
    }

    const firstPostDate = posts[posts.length - 1].date
    const lastPostDate = posts[0].date
    const spanMs = lastPostDate - firstPostDate
    const spanDays = spanMs / (24 * 60 * 60 * 1000)
    const spanWeeks = spanDays / 7
    const spanMonths = spanDays / (365.25 / 12)
    const spanYears = spanDays / 365.25

    const safe = n => (Number.isFinite(n) && n > 0 ? n : 1)

    let totalChars = 0
    let totalWords = 0
    let totalParagraphs = 0
    let contentPostCount = 0

    const yearsMap = new Map()

    for (const post of posts) {
      const year = post.date.getFullYear()
      const isExternal = Boolean(post.data?.external)

      let yearBucket = yearsMap.get(year)
      if (!yearBucket) {
        yearBucket = {
          year,
          postCount: 0,
          contentPostCount: 0,
          totalChars: 0,
          totalWords: 0,
          totalParagraphs: 0,
        }
        yearsMap.set(year, yearBucket)
      }

      yearBucket.postCount += 1

      // There are no content stats to collect for external articles since they
      // do not have content, and are just links to other websites.
      if (isExternal) continue

      const stats = getCachedContentStats(post)
      if (!stats) continue
      totalChars += stats.characters
      totalWords += stats.words
      totalParagraphs += stats.paragraphs

      yearBucket.contentPostCount += 1
      yearBucket.totalChars += stats.characters
      yearBucket.totalWords += stats.words
      yearBucket.totalParagraphs += stats.paragraphs
      contentPostCount += 1
    }

    const avgCharacterCount = contentPostCount
      ? Math.round(totalChars / contentPostCount)
      : 0
    const avgWordCount = contentPostCount
      ? Math.round(totalWords / contentPostCount)
      : 0
    const avgParagraphCount = contentPostCount
      ? Math.round(totalParagraphs / contentPostCount)
      : 0

    const avgPostsPerWeek = Math.round((postCount / safe(spanWeeks)) * 100) / 100
    const avgPostsPerMonth = Math.round((postCount / safe(spanMonths)) * 100) / 100
    const avgPostsPerYear = Math.round((postCount / safe(spanYears)) * 100) / 100
    const avgDaysBetweenPosts = postCount > 1 ? Math.round(spanDays / (postCount - 1)) : 0

    const popularTags = getPopularTags(posts, { top: options.popularTagsTop ?? POPULAR_TAGS_TOP })

    const years = Array.from(yearsMap.values())
      .map(yearBucket => {
        const divisor = yearBucket.contentPostCount || 1

        return {
          year: yearBucket.year,
          postCount: yearBucket.postCount,
          avgCharacterCount: Math.round(yearBucket.totalChars / divisor),
          avgWordCount: Math.round(yearBucket.totalWords / divisor),
          avgParagraphCount: Math.round(yearBucket.totalParagraphs / divisor),
        }
      })
      .sort((a, b) => a.year - b.year)

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
      years,
    }

    const arr = [stats]
    Object.assign(arr, stats)
    return arr
  })
}

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

function getCachedContentStats(post) {
  const inputPath = post.inputPath
  if (!inputPath) return null

  let stat
  try {
    stat = fs.statSync(inputPath)
  } catch {
    return null
  }

  const mtimeMs = stat.mtimeMs
  const cached = CONTENT_STATS_CACHE.get(inputPath)

  if (cached && cached.mtimeMs === mtimeMs) {
    return cached.stats
  }

  let body = ''

  try {
    const raw = fs.readFileSync(inputPath, 'utf8')
    body = stripFrontMatter(raw)
  } catch {
    // If we cannot read the file, skip content stats for this post.
    return null
  }

  const stats = getContentStats(body)
  CONTENT_STATS_CACHE.set(inputPath, { mtimeMs, stats })

  return stats
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
