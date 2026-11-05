import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { NoBreak } from './typography'

/** Басты жаңалық: бүкіл карточка сурет, төменгі қара градиент және мәтін */
export function NewsFeatured({
  href,
  meta,
  title,
  image,
  className,
}: {
  href: string
  /** Күні мен санаты: «28 ҚАЗАН 2026 · СТРАТЕГИЯ» */
  meta: string
  title: string
  image: { src: string; alt: string }
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[360px] cursor-pointer items-end overflow-hidden rounded-block bg-navy-900 text-white shadow-card lg:min-h-[470px]',
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1080px) 700px, 100vw"
        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-navy-800/20 mix-blend-multiply" />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/25 to-transparent" />
      <span className="relative grid gap-3 p-7 lg:p-9">
        <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-gold-300">{meta}</span>
        <span className="t-h3 max-w-[560px] text-[28px] leading-[1.08] lg:text-4xl">
          <NoBreak text={title} />
        </span>
      </span>
    </Link>
  )
}

/** Жаңалық тізімінің бір жолы */
export function NewsItem({ href, meta, title }: { href: string; meta: string; title: string }) {
  return (
    <Link
      href={href}
      className="group grid cursor-pointer gap-1.5 border-b border-line py-[22px] last:border-b-0"
    >
      <span className="text-[12.5px] font-semibold uppercase tracking-[0.05em] text-gold-700">{meta}</span>
      <span className="text-[17px] font-semibold leading-snug text-navy-900 underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover:decoration-gold-500">
        <NoBreak text={title} />
      </span>
    </Link>
  )
}
