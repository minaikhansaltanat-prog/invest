// Әкімшілік панелінің логотипі мен белгішесі (кіру беті мен мәзір). Эмблема растрлық PNG (векторлық нұсқа дизайнерден келгенше).
/* eslint-disable @next/next/no-img-element */

export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src="/icons/icon-192.png" width={72} height={72} alt="" style={{ objectFit: 'contain' }} />
      <div style={{ lineHeight: 1.25 }}>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.06em', color: '#0B1E3F' }}>KFCA</div>
        <div style={{ fontSize: 12, letterSpacing: '0.04em', color: '#7F5F18', fontWeight: 600 }}>
          KAZAKHSTAN ASSOCIATION OF FOREIGN CAPITAL
        </div>
      </div>
    </div>
  )
}

export function AdminIcon() {
  return <img src="/icons/icon-32.png" width={28} height={28} alt="" style={{ objectFit: 'contain' }} />
}
