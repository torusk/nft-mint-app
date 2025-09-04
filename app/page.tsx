"use client"
import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/Hero'
import Stepper from '../components/Stepper'

const isAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr || '')

export default function Page() {
  const network = useMemo(() => process.env.NEXT_PUBLIC_NETWORK || 'amoy', [])
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [health, setHealth] = useState<any>(null)
  const [healthError, setHealthError] = useState('')

  const canNext1 = isAddress(address)
  const canNext2 = password.length > 0

  useEffect(() => { setError('') }, [step])
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setHealthError('')
        const res = await fetch('/api/health')
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setHealth(data)
      } catch (e) {
        setHealth(null)
        setHealthError('バックエンドに接続できません。サーバ設定を確認してください。')
      }
    }
    fetchHealth()
  }, [])

  const connectWallet = async () => {
    setError('')
    try {
      const eth = (window as any).ethereum
      if (!eth) { setError('ウォレット拡張機能が見つかりません'); return }
      const accounts = await eth.request({ method: 'eth_request_accounts' })
      if (accounts && accounts[0]) setAddress(accounts[0])
      else setError('ウォレットアドレスを取得できませんでした')
    } catch {
      setError('ウォレット接続に失敗しました')
    }
  }

  const requestMint = async () => {
    setError(''); setLoading(true); setTxHash(''); setTokenId('')
    try {
      const res = await fetch('/api/mint', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setTxHash(data.txHash || '')
      setTokenId(data.tokenId || '')
      setStep(3)
    } catch (e: any) {
      setError(e?.message || 'ミントリクエスト中にエラーが発生しました')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Hero />
      <div id="flow" className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">NFT発行</h1>
        <p className="text-slate-600">Polygon（{network}）でNFTを発行。ガス代は発行側で負担します。</p>
        {health?.mock && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            デモモード
            <span className="text-[11px]">（設定なしでそのまま試せます）</span>
          </div>
        )}
      </header>

      <section className="card">
        <div className="mb-4">
          <Stepper step={step} />
        </div>
        <div className="font-semibold">接続状況</div>
        {health?.ok ? (
          <div className="mt-2 text-sm space-y-1">
            <div>chainId: <code>{health.chainId}</code></div>
            <div>server signer: <code>{health.address || '未設定'}</code></div>
            <div>contract: <code>{health.contract || '未設定'}</code></div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-amber-600">{healthError || '未接続'}</div>
        )}
      </section>

      {error && (
        <section className="card border-rose-200 text-rose-700">{error}</section>
      )}

      {/* Step 1 */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-300 font-extrabold flex items-center justify-center">1</div>
          <div className="font-semibold">ウォレットアドレスの指定</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" onClick={connectWallet}>MetaMaskに接続</button>
          <span className="text-slate-500">または</span>
          <input className="input max-w-md" placeholder="0x...（宛先アドレス）" value={address} onChange={(e)=>setAddress(e.target.value.trim())} />
        </div>
        {!canNext1 && <div className="text-rose-600 text-sm mt-2">有効なアドレスを入力するか接続してください</div>}
        <div className="mt-4">
          <button className={`btn btn-primary ${!canNext1?'btn-disabled':''}`} disabled={!canNext1} onClick={()=>setStep(2)}>次へ</button>
        </div>
      </section>

      {/* Step 2 */}
      <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-300 font-extrabold flex items-center justify-center">2</div>
            <div className="font-semibold">合言葉（パスワード）の入力</div>
          </div>
          <input className="input max-w-md" type="password" placeholder="合言葉" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {!canNext2 && <div className="text-rose-600 text-sm mt-2">合言葉を入力してください</div>}
          <div className="mt-4 space-x-2">
            <button className="btn btn-danger" onClick={()=>setStep(1)}>戻る</button>
            <button className={`btn btn-primary ${(!canNext2||loading)?'btn-disabled':''}`} disabled={!canNext2||loading} onClick={requestMint}>{loading? '発行中...' : 'NFTを受け取る'}</button>
          </div>
        </section>

      {/* Step 3 */}
      <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-300 font-extrabold flex items-center justify-center">3</div>
            <div className="font-semibold">発行完了</div>
          </div>
          <div className="space-y-2 text-sm">
            {!txHash && (
              <p className="text-slate-600">まだ発行していません。上の入力を済ませて「NFTを受け取る」を押すと、ここに結果が表示されます。</p>
            )}
            {txHash && (
              <>
                <p>NFTの発行を受け付けました。</p>
                {tokenId && <p>Token ID: <strong>#{tokenId}</strong></p>}
                <p>Tx Hash: <code>{txHash}</code></p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
