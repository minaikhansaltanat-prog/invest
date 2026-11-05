import { notFound } from 'next/navigation'

import { isCorporate } from '@/lib/mode'

/**
 * Жеке кабинет беттері (кіру, тіркелу, кабинет, деректер бөлмесі) corporate режимінде жоқ: 404.
 * Әкімшінің 2FA беті бұған кірмейді (ол өз файлында тек әкімші сессиясын қабылдайды).
 */
export function hiddenInCorporate(): void {
  if (isCorporate()) notFound()
}
