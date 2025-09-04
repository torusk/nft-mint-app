import React, { useMemo, useState, useEffect } from 'react'

const isAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr || '')
const getExplorer = (network) => (network === 'polygon' ? 'https://polygonscan.com' : 'https://www.oklink.com/amoy')

export default function App(){
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [tokenId, setTokenId] = useState('')

  const network = useMemo(() => import.meta.env.VITE_POLYGON_NETWORK || 'amoy', [])
  const explorer = useMemo(() => getExplorer(network), [network])

  const canNext1 = isAddress(address)
  const canNext2 = password.length > 0

  useEffect(() => { setError('') }, [step])

  const connectWallet = async () => {
    setError('')
    try {
      if (!window.ethereum) { setError('ウォレット拡張機能が見つかりません'); return }
      const accounts = await window.ethereum.request({ method: 'eth_request_accounts' })
      if (accounts && accounts[0]) setAddress(accounts[0])
      else setError('ウォレットアドレスを取得できませんでした')
    } catch (e) { setError('ウォレット接続に失敗しました') }
  }

  const requestMint = async () => {
    setError('')
    setLoading(true)
    setTxHash('')
    setTokenId('')
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      })
      if (!res.ok){ throw new Error(await res.text() || 'ミントAPIエラー') }
      const data = await res.json()
      if (data.txHash) setTxHash(data.txHash)
      if (data.tokenId) setTokenId(String(data.tokenId))
      setStep(3)
    } catch (e) {
      setError(e.message || 'ミントリクエスト中にエラーが発生しました')
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <h1>NFT発行</h1>
      <div className="sub">Polygon（{network}）でNFTを発行。ガス代は発行側で負担します。</div>

      {error && <div className="card" style={{borderColor:'#fadbd8'}}><div className="error">{error}</div></div>}

      <div className="flow">
        {/* Step 1 */}
        <div className="item">
          <div className={`step ${step>=1?'active':''}`}>
            <span className="title">STEP</span>
            <span className="no">1</span>
          </div>
          <div className="text" style={{width:'100%'}}>
            <dt>ウォレットアドレスの指定</dt>
            <dd>
              <div className="row">
                <button className="btn primary" onClick={connectWallet}>MetaMaskに接続</button>
                <span>または</span>
                <input type="text" value={address} onChange={e=>setAddress(e.target.value.trim())} placeholder="0x...（宛先アドレス）" />
              </div>
              {!canNext1 && <div className="error">有効なアドレスを入力するか接続してください</div>}
              <div style={{marginTop:12}}>
                <button className="btn primary" disabled={!canNext1} onClick={()=>setStep(2)}>次へ</button>
              </div>
            </dd>
          </div>
        </div>

        {/* Step 2 */}
        {step>=2 && (
          <div className="item">
            <div className={`step ${step>=2?'active':''}`}>
              <span className="title">STEP</span>
              <span className="no">2</span>
            </div>
            <div className="text" style={{width:'100%'}}>
              <dt>合言葉（パスワード）の入力</dt>
              <dd>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="合言葉" />
                {!canNext2 && <div className="error">合言葉を入力してください</div>}
                <div style={{marginTop:12}}>
                  <button className="btn danger" onClick={()=>setStep(1)}>戻る</button>
                  <button className="btn primary" disabled={!canNext2 || loading} onClick={requestMint}>
                    {loading? '発行中...' : 'NFTを受け取る'}
                  </button>
                </div>
              </dd>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step>=3 && (
          <div className="item">
            <div className={`step ${step>=3?'active':''}`}>
              <span className="title">STEP</span>
              <span className="no">3</span>
            </div>
            <div className="text" style={{width:'100%'}}>
              <dt>発行完了</dt>
              <dd>
                <div className="card">
                  <p>NFTの発行を受け付けました。</p>
                  {tokenId && <p>Token ID: <strong>#{tokenId}</strong></p>}
                  {txHash && (
                    <p>
                      Tx Hash: <code>{txHash}</code><br/>
                      <a href={`${explorer}/tx/${txHash}`} target="_blank" rel="noreferrer">ブロックエクスプローラで確認</a>
                    </p>
                  )}
                </div>
              </dd>
            </div>
          </div>
        )}
      </div>

      <div className="note">
        実装メモ: このフロントは <code>POST /api/mint</code> に <code>{`{"address":"0x...","password":"..."}`}</code> を送信します。
        サーバー側で合言葉検証とガス負担のミント（リレー送信）を実施してください。
      </div>
    </div>
  )
}

