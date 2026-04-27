interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
  conclusion?: string
}

export default function Section({ id, title, children, conclusion }: SectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#fafafa] mb-6 pb-3 border-b border-[#27272a]">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
      {conclusion && (
        <div className="mt-8 p-5 bg-[#1e293b]/50 border-l-4 border-[#22c55e] rounded-r-lg">
          <h4 className="text-sm font-semibold text-[#22c55e] uppercase tracking-wide mb-2">
            Висновок до розділу
          </h4>
          <p className="text-[#94a3b8] leading-relaxed text-sm">
            {conclusion}
          </p>
        </div>
      )}
    </section>
  )
}
