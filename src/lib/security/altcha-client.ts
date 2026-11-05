// Браузер жағы: proof-of-work шешуші (Web Crypto, сыртқы кітапхана жоқ). UI-ды қатырмау үшін бөліктеп жұмыс істейді.

export type ChallengeJson = { algorithm: 'SHA-256'; challenge: string; salt: string; signature: string; maxnumber: number }

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

/** 0..maxnumber аралығынан SHA-256(salt + number) = challenge болатын санды іздейді; base64 JSON қайтарады (серверге жіберуге дайын) */
export async function solveChallenge(challenge: ChallengeJson, signal?: AbortSignal): Promise<string> {
  const encoder = new TextEncoder()
  for (let number = 0; number <= challenge.maxnumber; number++) {
    if (signal?.aborted) throw new DOMException('aborted', 'AbortError')
    const hash = toHex(await crypto.subtle.digest('SHA-256', encoder.encode(`${challenge.salt}${number}`)))
    if (hash === challenge.challenge) {
      const json = JSON.stringify({
        algorithm: challenge.algorithm,
        challenge: challenge.challenge,
        number,
        salt: challenge.salt,
        signature: challenge.signature,
      })
      return btoa(json)
    }
    // әр 500 қадамда браузерге тыныс береміз
    if (number % 500 === 499) await new Promise((resolve) => setTimeout(resolve, 0))
  }
  throw new Error('altcha-unsolved')
}
