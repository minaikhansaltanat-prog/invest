'use client'

import { useCallback, useRef, useState } from 'react'

import { type ChallengeJson, solveChallenge } from '@/lib/security/altcha-client'

export type CaptchaState = 'idle' | 'solving' | 'ready' | 'error'

/**
 * ALTCHA proof-of-work: форманың бірінші әрекетінде challenge алынып, фонда шешіледі, жіберу кезінде дайын болады.
 * Challenge бір рет қана жарайды, сондықтан сәтсіз жіберуден кейін `reset` жаңасын талап етеді.
 */
export function useAltcha() {
  const [state, setState] = useState<CaptchaState>('idle')
  const promise = useRef<Promise<string> | null>(null)

  const start = useCallback(() => {
    if (promise.current) return promise.current
    setState('solving')
    const task = fetch('/api/portal/altcha', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('altcha-challenge')
        return response.json() as Promise<ChallengeJson>
      })
      .then((challenge) => solveChallenge(challenge))
      .then((payload) => {
        setState('ready')
        return payload
      })
      .catch((error: unknown) => {
        setState('error')
        promise.current = null
        throw error
      })
    promise.current = task
    return task
  }, [])

  const reset = useCallback(() => {
    promise.current = null
    setState('idle')
  }, [])

  return { state, start, reset }
}
