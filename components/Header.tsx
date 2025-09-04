"use client"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-teal-200/40">
      <div className="w-full bg-brand-mint">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white drop-shadow">mint</span>
            <span className="text-2xl font-black tracking-tight text-white/90 drop-shadow">Rally</span>
          </Link>
          <nav className="flex items-center gap-2">
            <a className="bg-white text-slate-800 rounded-full px-4 py-2 text-sm font-semibold shadow" href="#">イベントグループ</a>
            <a className="bg-white text-slate-800 rounded-full px-4 py-2 text-sm font-semibold shadow" href="#">イベント一覧</a>
            <a className="bg-white text-slate-800 rounded-full px-4 py-2 text-sm font-semibold shadow hidden sm:inline-flex" href="#about">ヘルプ</a>
            <a className="bg-brand-amber text-white rounded-full px-4 py-2 text-sm font-bold shadow" href="#login">ログイン</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
