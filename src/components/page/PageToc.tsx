/**
 * Беттің оң жақ мазмұн тізімі: ≥1080 px кезінде сол жақта жабысып тұрады, бөлімдерге якорь сілтемелері.
 * Таза серверлік компонент (JS жоқ), мобильдіде көрсетілмейді (бөлімдер реті бір бағанда қысқа).
 */
export function PageToc({ title, items }: { title: string; items: { id: string; label: string }[] }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label={title} className="sticky top-28 grid gap-4">
        <p className="t-eyebrow text-gold-700">{title}</p>
        <ul className="grid border-l border-line">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="-ml-px block cursor-pointer border-l-2 border-transparent py-2 pl-4 pr-2 text-sm leading-snug text-muted transition-[color,border-color] duration-200 hover:border-gold-500 hover:text-navy-900"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
