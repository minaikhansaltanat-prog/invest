// Қарапайым жылжымалы терезе (sliding window) шектеуі: формалар мен кіру әрекеттері үшін (ТТ 14.1).
// Жад ішінде жұмыс істейді (бір процесс). Көп инстансты өндіріс үшін Redis/PG негізді шектеуге ауыстырылады (9-кезең ескертпесі).

const hits = new Map<string, number[]>()

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterMs: number }

export function rateLimit(
  key: string,
  { limit, windowMs, now = Date.now() }: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const fresh = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
  if (fresh.length >= limit) {
    hits.set(key, fresh)
    return { ok: false, remaining: 0, retryAfterMs: Math.max(0, windowMs - (now - fresh[0])) }
  }
  fresh.push(now)
  hits.set(key, fresh)
  // жадты тазалау: 5000 кілттен асса, ескілерін алып тастаймыз
  if (hits.size > 5000) for (const [k, list] of hits) if (list.every((time) => now - time >= windowMs)) hits.delete(k)
  return { ok: true, remaining: limit - fresh.length, retryAfterMs: 0 }
}

export const resetRateLimits = () => hits.clear()
