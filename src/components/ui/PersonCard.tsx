import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { Icon } from './icons'

export type PersonPhoto = {
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Тұлға карточкасы (басшылық). Фото болса 4:5 қатынасымен көрсетіледі (next/image, AVIF/WebP, бірнеше өлшем),
 * болмаса (немесе жариялауға келісім жоқ болса) монограмма. Фото алтын жиекпен.
 */
export function PersonCard({
  name,
  position,
  linkLabel,
  href,
  photo,
  monogram,
  className,
}: {
  name: string
  position: string
  linkLabel: string
  href: string
  photo?: PersonPhoto | null
  monogram: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[104px_1fr] items-center gap-5 rounded-block border border-line bg-paper p-5 shadow-lift lg:grid-cols-[132px_1fr] lg:gap-6 lg:p-6',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-[4/5] w-full overflow-hidden rounded-[12px] ring-1 ring-gold-400 ring-offset-[3px] ring-offset-paper',
          !photo && 'grid place-items-center bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-700),var(--color-navy-950))]',
        )}
      >
        {photo ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1080px) 132px, 104px"
              quality={82}
              className="size-full object-cover object-[50%_28%]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/25 via-transparent to-transparent" />
          </>
        ) : (
          <span className="font-serif text-4xl font-bold text-gold-300">{monogram}</span>
        )}
      </div>
      <div className="grid gap-1">
        <h4 className="t-h3 text-navy-900 lg:text-[28px]">{name}</h4>
        <p className="text-sm leading-snug text-muted">{position}</p>
        <Link
          href={href}
          className="group mt-2.5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900"
        >
          {linkLabel}
          <Icon name="arrow-right" size={15} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
