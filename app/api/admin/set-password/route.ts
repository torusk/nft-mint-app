import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const dataDir = path.join(process.cwd(), '.data')
const configPath = path.join(dataDir, 'config.json')

function readJson<T>(p: string, def: T): T {
  try { return JSON.parse(readFileSync(p, 'utf-8')) as T } catch { return def }
}
function writeJson<T>(p: string, v: T) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  writeFileSync(p, JSON.stringify(v, null, 2))
}

export async function POST(req: Request) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!ADMIN_SECRET || token !== ADMIN_SECRET) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(()=>({})) as { password?: string }
  const password = (body?.password || '').trim()
  if (!password) return NextResponse.json({ error: 'invalid password' }, { status: 400 })

  const envPassword = process.env.MINT_PASSWORD || ''
  const cfg = readJson(configPath, { password: envPassword }) as { password: string }
  cfg.password = password
  writeJson(configPath, cfg)
  return NextResponse.json({ ok: true })
}

