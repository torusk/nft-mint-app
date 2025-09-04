import { NextResponse } from 'next/server'
import { JsonRpcProvider, Wallet } from 'ethers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology'
    const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ''

    // Mock mode if not configured
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
      return NextResponse.json({ ok: true, mock: true, chainId: 80002, address: '0xDEMO', contract: 'DEMO' })
    }

    const provider = new JsonRpcProvider(RPC_URL)
    const net = await provider.getNetwork()
    const address = new Wallet(PRIVATE_KEY).address
    return NextResponse.json({ ok: true, chainId: Number(net.chainId), address, contract: CONTRACT_ADDRESS })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 })
  }
}
