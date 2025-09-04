"use client"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="#" className="font-extrabold tracking-tight text-slate-900">Mint Site</Link>
        <nav className="flex items-center gap-3">
          <a href="#flow" className="btn btn-secondary">はじめる</a>
        </nav>
      </div>
    </header>
  )
}

