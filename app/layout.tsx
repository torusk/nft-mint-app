import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NFT発行 (Polygon Amoy)',
  description: 'VS Code Codex で作成された Next.js + TypeScript のNFT発行ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
