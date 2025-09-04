export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-brand-yellow/40 to-transparent" />
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          明るく、かんたん。直感的なNFT受け取り体験
        </h1>
        <p className="mt-3 text-slate-600">
          合言葉を入力するだけ。数クリックでNFTをあなたのウォレットへ。
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="#flow" className="btn btn-primary">今すぐはじめる</a>
          <a href="#about" className="btn btn-secondary">しくみを見る</a>
        </div>
      </div>
    </section>
  )
}

