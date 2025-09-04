type Props = { step: number }

export default function Stepper({ step }: Props) {
  const items = [
    { id: 1, title: 'アドレス' },
    { id: 2, title: '合言葉' },
    { id: 3, title: '完了' },
  ]
  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((it, i) => (
        <div key={it.id} className="relative flex items-center gap-3">
          <div className={`w-16 h-14 pennant flex items-center justify-center font-extrabold ${step>=it.id?'bg-brand-yellow text-slate-900':'bg-slate-200 text-slate-500'}`}>{it.id}</div>
          <div className={`text-sm font-semibold ${step>=it.id?'text-slate-900':'text-slate-400'}`}>{it.title}</div>
          {i<items.length-1 && (
            <div className={`w-12 h-[2px] ${step>it.id?'bg-brand-mint':'bg-slate-300'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
