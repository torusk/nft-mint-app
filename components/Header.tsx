"use client"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-mint/50">
      <div className="w-full bg-brand-mint">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">MintLight</span>
          </Link>
          <nav className="flex items-center gap-2">
            <a className="bg-white text-slate-900 rounded-full px-4 py-2 text-sm font-semibold shadow" href="#">イベントグループ</a>
            <a className="bg-white text-slate-900 rounded-full px-4 py-2 text-sm font-semibold shadow" href="#">イベント一覧</a>
            <a className="bg-brand-yellow text-slate-900 rounded-full px-4 py-2 text-sm font-bold shadow" href="#flow">はじめる</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
