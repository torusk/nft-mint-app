import { NextResponse } from 'next/server'
import { JsonRpcProvider, Wallet } from 'ethers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology'
    const provider = new JsonRpcProvider(RPC_URL)
    const net = await provider.getNetwork()
    const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
    const address = PRIVATE_KEY ? new Wallet(PRIVATE_KEY).address : null
    const contract = process.env.CONTRACT_ADDRESS || null
    return NextResponse.json({ ok: true, chainId: Number(net.chainId), address, contract })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 })
  }
}

