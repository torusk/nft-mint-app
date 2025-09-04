require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { ethers } = require('ethers')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 8787
const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology'
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ''
const MINT_FUNCTION_NAME = process.env.MINT_FUNCTION_NAME || 'safeMint' // ex) safeMint or mint
const TOKEN_URI = process.env.TOKEN_URI // optional: if your mint function requires tokenURI
const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
let currentPassword = process.env.MINT_PASSWORD || ''

if (!PRIVATE_KEY) console.warn('[WARN] PRIVATE_KEY is not set')
if (!CONTRACT_ADDRESS) console.warn('[WARN] CONTRACT_ADDRESS is not set')

const dataDir = path.join(__dirname, 'data')
const mintedFile = path.join(dataDir, 'minted.json')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(mintedFile)) fs.writeFileSync(mintedFile, JSON.stringify({}), 'utf-8')

const readMinted = () => {
  try { return JSON.parse(fs.readFileSync(mintedFile, 'utf-8') || '{}') } catch { return {} }
}
const writeMinted = (obj) => fs.writeFileSync(mintedFile, JSON.stringify(obj, null, 2))

const isAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr || '')

// Build minimal ABI dynamically (function + Transfer event)
const fragments = [
  `event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)`,
]
if (TOKEN_URI) {
  fragments.push(`function ${MINT_FUNCTION_NAME}(address to, string tokenURI) returns (uint256)`)
} else {
  fragments.push(`function ${MINT_FUNCTION_NAME}(address to) returns (uint256)`)
}

const provider = new ethers.JsonRpcProvider(RPC_URL)
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null
const iface = new ethers.Interface(fragments)
const contract = (CONTRACT_ADDRESS && wallet) ? new ethers.Contract(CONTRACT_ADDRESS, iface, wallet) : null

app.get('/api/health', async (_req, res) => {
  try {
    const net = await provider.getNetwork()
    res.json({ ok: true, chainId: Number(net.chainId), address: wallet ? wallet.address : null, contract: CONTRACT_ADDRESS || null })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

// Admin: set current password dynamically
app.post('/api/admin/set-password', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!ADMIN_SECRET || token !== ADMIN_SECRET) return res.status(401).json({ error: 'unauthorized' })
  const { password } = req.body || {}
  if (typeof password !== 'string' || !password.trim()) return res.status(400).json({ error: 'invalid password' })
  currentPassword = password.trim()
  res.json({ ok: true })
})

// Mint endpoint
app.post('/api/mint', async (req, res) => {
  try {
    const { address, password } = req.body || {}

    if (!isAddress(address)) return res.status(400).json({ error: 'invalid address' })
    if (!password || typeof password !== 'string') return res.status(400).json({ error: 'invalid password' })
    if (!currentPassword || password.trim() !== currentPassword) return res.status(403).json({ error: 'wrong password' })
    if (!contract) return res.status(500).json({ error: 'server not configured' })

    // 1 address 1 mint
    const minted = readMinted()
    if (minted[address.toLowerCase()]) return res.status(400).json({ error: 'already minted' })

    // Send tx
    let tx
    if (TOKEN_URI) tx = await contract[MINT_FUNCTION_NAME](address, TOKEN_URI)
    else tx = await contract[MINT_FUNCTION_NAME](address)

    const receipt = await tx.wait(1)
    let tokenId = null
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

    // Mark minted
    minted[address.toLowerCase()] = { txHash: receipt.hash, blockNumber: receipt.blockNumber, tokenId }
    writeMinted(minted)

    res.json({ txHash: receipt.hash, tokenId })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message || 'mint failed' })
  }
})

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})

