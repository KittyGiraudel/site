import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const siteDir = path.join(repoRoot, '_site')

export { siteDir }

export async function readText(relativePath: string): Promise<string> {
	const fullPath = path.join(siteDir, relativePath)
	return readFile(fullPath, 'utf8')
}

export async function readJson(relativePath: string): Promise<unknown> {
	const text = await readText(relativePath)
	return JSON.parse(text) as unknown
}
