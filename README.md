このプロジェクトは、VS Code の Codex（Codex CLI）で全て作成・構成・編集しました。

NFT Mint App — Next.js + TypeScript + Tailwind（Polygon Amoy）

概要
- 合言葉（パスワード）入力でNFTを受け取れる3ステップのUI。
- ガス代はサーバー側（APIルート）で負担し、1アドレス1回をサーバーで制御。
- Next.js 14 App Router + TypeScript + Tailwind。

クイックスタート（Next.js 版）
1) 依存インストールと環境変数
   npm install
   cp .env.local.example .env.local   # RPC_URL/PRIVATE_KEY/CONTRACT_ADDRESS/MINT_PASSWORDなど設定

2) 開発起動（5173番ポート）
   npm run dev   # http://localhost:5173

3) 画面の「接続状況」で server signer/contract が表示されることを確認

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
