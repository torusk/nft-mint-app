import { NextResponse } from 'next/server'
import { JsonRpcProvider, Wallet, Contract, Interface } from 'ethers'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const dataDir = path.join(process.cwd(), '.data')
const mintedPath = path.join(dataDir, 'minted.json')
const configPath = path.join(dataDir, 'config.json')

const isAddress = (addr?: string) => !!addr && /^0x[a-fA-F0-9]{40}$/.test(addr)

function readJson<T>(p: string, def: T): T {
  try { return JSON.parse(readFileSync(p, 'utf-8')) as T } catch { return def }
}
function writeJson<T>(p: string, v: T) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  writeFileSync(p, JSON.stringify(v, null, 2))
}

function getIface() {
  const MINT_FUNCTION_NAME = process.env.MINT_FUNCTION_NAME || 'safeMint'
  const TOKEN_URI = process.env.TOKEN_URI
  const frags = [
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
  ]
  if (TOKEN_URI) frags.push(`function ${MINT_FUNCTION_NAME}(address to, string tokenURI) returns (uint256)`)
  else frags.push(`function ${MINT_FUNCTION_NAME}(address to) returns (uint256)`)
  return new Interface(frags)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const address = body?.address as string
    const password = (body?.password as string) || ''

    if (!isAddress(address)) return NextResponse.json({ error: 'invalid address' }, { status: 400 })

    // Load current password (default demo if unset)
    const envPassword = process.env.MINT_PASSWORD || 'demo'
    const cfg = readJson(configPath, { password: envPassword }) as { password: string }
    const currentPassword = (cfg?.password || '').trim()
    if (!currentPassword || password.trim() !== currentPassword) {
      return NextResponse.json({ error: 'wrong password' }, { status: 403 })
    }

    // One per address
    const minted = readJson<Record<string, any>>(mintedPath, {})
    if (minted[address.toLowerCase()]) {
      return NextResponse.json({ error: 'already minted' }, { status: 400 })
    }

    const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology'
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
    const MINT_FUNCTION_NAME = process.env.MINT_FUNCTION_NAME || 'safeMint'
    const TOKEN_URI = process.env.TOKEN_URI
    // Mock if not configured
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
      // record as minted in demo
      const mockTx = `0x${Math.random().toString(16).slice(2).padEnd(64,'0')}`
      minted[address.toLowerCase()] = { txHash: mockTx, blockNumber: 0, tokenId: '1', mock: true }
      writeJson(mintedPath, minted)
      return NextResponse.json({ txHash: mockTx, tokenId: '1', mock: true })
    }

    const provider = new JsonRpcProvider(RPC_URL)
    const wallet = new Wallet(PRIVATE_KEY, provider)
    const iface = getIface()
    const contract = new Contract(CONTRACT_ADDRESS, iface, wallet)

    let tx
    if (TOKEN_URI) tx = await contract[MINT_FUNCTION_NAME](address, TOKEN_URI)
    else tx = await contract[MINT_FUNCTION_NAME](address)
    const receipt = await tx.wait(1)

    let tokenId: string | null = null
    try {
      for (const log of receipt.logs || []) {
        try {
          const parsed = iface.parseLog(log)
          if (parsed?.name === 'Transfer' && parsed.args?.to?.toLowerCase() === address.toLowerCase()) {
            tokenId = parsed.args.tokenId?.toString?.() || null
            break
          }
        } catch {}
      }
    } catch {}

    minted[address.toLowerCase()] = { txHash: receipt.hash, blockNumber: receipt.blockNumber, tokenId }
    writeJson(mintedPath, minted)

    return NextResponse.json({ txHash: receipt.hash, tokenId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'mint failed' }, { status: 500 })
  }
}
