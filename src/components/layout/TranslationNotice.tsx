'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { useToast } from '@/components/ui/Toast'
import { NOTICE_NO_TRANSLATION, NOTICE_PARAM } from '@/lib/translation-notice'

/**
 * ?notice=no-translation болса, «бұл беттің аудармасы әзірге жоқ» хабарламасын көрсетеді де, параметрді URL-дан алып тастайды
 * (жаңарту немесе бөлісу кезінде хабарлама қайталанбайды). ToastProvider ішінде тұрады.
 */
export function TranslationNotice() {
  const t = useTranslations('lang')
  const { push } = useToast()

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get(NOTICE_PARAM) !== NOTICE_NO_TRANSLATION) return
    push(t('missingTranslation'), 'info')
    url.searchParams.delete(NOTICE_PARAM)
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }, [push, t])

  return null
}
