このプロジェクトは、VS Code の Codex（Codex CLI）で全て作成・構成・編集しました。

NFT Mint App — Next.js + TypeScript + Tailwind（Polygon Amoy）

概要
- 合言葉（パスワード）入力でNFTを受け取れる3ステップのUI。
- ガス代はサーバー側（APIルート）で負担し、1アドレス1回をサーバーで制御。
- Next.js 14 App Router + TypeScript + Tailwind。

クイックスタート（編集不要・すぐ確認）
1) 依存インストール
   npm install

2) 起動（5173番ポート）
   npm run dev   # http://localhost:5173

3) そのまま試せます（デモモード）
   画面上部に「デモモード」が表示され、設定なしでミントの流れを確認できます。
   後から本番接続する場合だけ、`.env.local` を設定してください。

API ルート（Next.js 内蔵）
- `GET /api/health`: RPC/署名者/コントラクト設定の確認
- `POST /api/mint`: { address, password } を受けてミント実行。Transferイベントから tokenId 抽出
- `POST /api/admin/set-password`: 合言葉の動的変更（ヘッダ Authorization: Bearer <ADMIN_SECRET>）

環境変数（.env.local）
- `NEXT_PUBLIC_NETWORK=amoy`
- `RPC_URL=https://rpc-amoy.polygon.technology`
- `PRIVATE_KEY`（サーバー側送信者＝ガス負担アカウント。コントラクトのオーナー推奨）
- `CONTRACT_ADDRESS`（デプロイ済みERC-721のアドレス）
- `MINT_PASSWORD`（初期合言葉。APIで変更可能）
- `ADMIN_SECRET`（管理API用）
- 任意: `MINT_FUNCTION_NAME`（既定: safeMint）, `TOKEN_URI`

未設定時の挙動（デモモード）
- `PRIVATE_KEY` または `CONTRACT_ADDRESS` が未設定なら、自動でデモモードになります。
- `/api/health` は mock=true を返し、`/api/mint` はダミーのトランザクションハッシュを返します。

コントラクト（Hardhat / Amoy）
- 場所: `contracts/`（OpenZeppelin ERC‑721 + `safeMint(address)` オーナー限定）
- 手順:
  cd contracts
  cp .env.example .env   # PRIVATE_KEY=デプロイ鍵
  npm install
  npm run build
  npm run deploy:amoy
  # 表示されたアドレスを .env.local の CONTRACT_ADDRESS に設定

運用メモ
- 合言葉はAPIで都度変更可能。1アドレス1回は `.data/minted.json` で記録。
- 本番はストレージをDBに、レート制限/監査済みコントラクト/CICD等の整備を推奨。

（レガシー）Vite + Express 版
- 旧構成のコードは残置（`src/`, `server/`）。必要に応じて main ブランチを参照。
