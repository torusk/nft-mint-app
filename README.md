NFT Mint App (Polygon)

概要
- 合言葉（パスワード）入力でNFTを受け取れる3ステップのフロントエンドです。
- ガス代はサーバー側で負担する想定（バックエンドの /api/mint がミントを送信）。
- Vite + React 構成。

起動方法
1) フロントエンド
   cd nft-mint-app
   npm install
   npm run dev

2) バックエンド
   cd nft-mint-app/server
   cp .env.example .env   # 必要な値を設定
   npm install
   npm run dev

3) ビルド（フロント）
   cd nft-mint-app
   npm run build

環境変数（任意）
- VITE_POLYGON_NETWORK: `polygon`（本番）または `amoy`（テスト）。省略時は `amoy`。

バックエンド仕様（例）
- エンドポイント: POST /api/mint
- リクエストJSON:
  { "address": "0x...", "password": "..." }
- レスポンスJSON（例）:
  { "txHash": "0x...", "tokenId": "123" }

サーバー側でやること（参考）
1) 合言葉（パスワード）の安全な検証
2) リレー送信者(署名者)の秘密鍵でPolygonに接続
3) コントラクトの `safeMint(to)` または `mint(to, tokenURI)` を呼ぶ
4) txハッシュと必要ならトークンIDを返却

補足
- 本番運用ではレート制限、1アドレス1回の制限、再入荷対策、監査済みコントラクトの使用を推奨します。

サーバーの環境変数（server/.env）
- `RPC_URL`: Polygon Amoy の RPC（既定: https://rpc-amoy.polygon.technology）
- `PRIVATE_KEY`: ミント送信者（ガス負担側）の秘密鍵
- `CONTRACT_ADDRESS`: 対象 NFT コントラクトのアドレス
- `MINT_FUNCTION_NAME`: ミント関数名（既定: `safeMint`）
- `TOKEN_URI`: 必要な場合のみ（ミント関数が tokenURI を要求する場合）
- `MINT_PASSWORD`: 初期の合言葉（起動後は管理APIで変更可能）
- `ADMIN_SECRET`: 管理API用のシークレット
- `PORT`: バックエンドのポート（既定: 8787）

管理API（任意）
- `POST /api/admin/set-password`
  - ヘッダ: `Authorization: Bearer <ADMIN_SECRET>`
  - ボディ: `{ "password": "..." }`
  - 起動後に合言葉を差し替える用途（「その都度決める」要件対応）
