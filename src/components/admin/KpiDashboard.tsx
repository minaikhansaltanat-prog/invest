import Link from 'next/link'
import type { Payload } from 'payload'

import { loadDashboard } from '@/lib/kpi/load'

// Басқару дашборды (ТТ 10.2: 1-модуль), Payload админкасының басты бетінің үстінде. Төрт сома бөлек карточкада, ешқашан қосылмайды.
// Көрсету: төраға, ревизор, аналитик, хатшылық (және супер-администратор). Жеке дерек жоқ: тек сандар мен жоба атаулары.

type Lang = 'kk' | 'ru' | 'en' | 'zh'
const t = (lang: Lang, kk: string, ru: string, en: string, zh: string) => ({ kk, ru, en, zh })[lang]

const allowed = ['super-admin', 'chair', 'auditor', 'analyst', 'secretariat']

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 10,
  padding: '14px 16px',
  background: 'var(--theme-elevation-0)',
}
const label: React.CSSProperties = { fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--theme-elevation-600)', fontWeight: 600 }
const value: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: 'var(--theme-elevation-900)', lineHeight: 1.15, marginTop: 4 }

export async function KpiDashboard(props: { payload: Payload; user?: { roles?: string[] } | null; i18n?: { language?: string } }) {
  const roles = props.user?.roles ?? []
  if (!roles.some((role) => allowed.includes(role))) return null
  const lang = (['kk', 'ru', 'en', 'zh'].includes(props.i18n?.language ?? '') ? props.i18n!.language : 'kk') as Lang

  const data = await loadDashboard(props.payload)
  const fmt = new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-GB' : lang === 'ru' ? 'ru-RU' : 'kk-KZ', { maximumFractionDigits: 2 })

  const amounts: [string, number][] = [
    [t(lang, 'Мәлімделген', 'Заявленная', 'Declared', '申报金额'), data.amounts.declared],
    [t(lang, 'Ниет құжаты бойынша', 'По документу о намерениях', 'Per letter of intent', '意向书金额'), data.amounts.loi],
    [t(lang, 'Ресми шарт бойынша', 'По официальному договору', 'Per official contract', '合同金额'), data.amounts.contract],
    [t(lang, 'Нақты түскен (дәлелмен)', 'Фактически поступившая (с доказательством)', 'Actually received (with evidence)', '实际到账（含佐证）'), data.amounts.received],
  ]
  const funnel: [string, number][] = [
    [t(lang, 'Инвесторлар', 'Инвесторы', 'Investors', '投资者'), data.funnel.investors],
    [t(lang, 'Тексеруден өтті (A/B)', 'Прошли проверку (A/B)', 'Vetted (A/B)', '通过审核（A/B）'), data.funnel.screened],
    [t(lang, 'Келіссөзде', 'В переговорах', 'Negotiating', '洽谈中'), data.funnel.negotiating],
    [t(lang, 'Шарт жасалды', 'Договор подписан', 'Contracted', '已签约'), data.funnel.contracted],
    [t(lang, 'Қаражат түсті', 'Средства поступили', 'Funds received', '资金到账'), data.funnel.received],
  ]

  return (
    <section aria-labelledby="kfca-kpi-title" style={{ marginBottom: 32, display: 'grid', gap: 18 }}>
      <div>
        <h2 id="kfca-kpi-title" style={{ margin: 0, fontSize: 22 }}>
          {t(lang, 'Басқару дашборды', 'Панель управления', 'Management dashboard', '管理看板')}
        </h2>
        <p style={{ margin: '6px 0 0', color: 'var(--theme-elevation-600)', maxWidth: 720 }}>
          {t(
            lang,
            'Төрт сома бөлек есептеледі және ешқашан қосылмайды (млн $).',
            'Четыре суммы считаются отдельно и никогда не суммируются (млн $).',
            'The four amounts are counted separately and never summed (USD million).',
            '四项金额分别核算，绝不相加（百万美元）。',
          )}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        {amounts.map(([name, amount]) => (
          <div key={name} style={card}>
            <div style={label}>{name}</div>
            <div style={value}>{fmt.format(amount)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {funnel.map(([name, count], index) => (
          <div key={name} style={card}>
            <div style={{ ...label, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-grid',
                  placeItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: 'var(--theme-elevation-100)',
                  color: 'var(--theme-elevation-800)',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              {name}
            </div>
            <div style={value}>{count}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        <div style={card}>
          <div style={label}>{t(lang, 'Жаңа өтініштер', 'Новые заявки', 'New submissions', '新申请')}</div>
          <div style={value}>{data.newSubmissions}</div>
          <Link href="/admin/collections/submissions" style={{ fontSize: 14 }}>
            {t(lang, 'Өтініштерге өту', 'Перейти к заявкам', 'Open submissions', '查看申请')}
          </Link>
        </div>
        <div style={card}>
          <div style={label}>{t(lang, 'Инвесторлар деңгейі', 'Уровни инвесторов', 'Investor grades', '投资者等级')}</div>
          <div style={{ marginTop: 6 }}>{['A', 'B', 'C', 'D'].map((grade) => `${grade}: ${data.investorsByGrade[grade] ?? 0}`).join('   ')}</div>
        </div>
        <div style={card}>
          <div style={label}>{t(lang, 'Жоба деңгейлері', 'Уровни проектов', 'Project levels', '项目等级')}</div>
          <div style={{ marginTop: 6 }}>{['1', '2', '3', '4'].map((level) => `${level}: ${data.byLevel[level] ?? 0}`).join('   ')}</div>
        </div>
      </div>

      <div style={card}>
        <div style={label}>{t(lang, 'Мерзімі өткен қадамдар', 'Просроченные шаги', 'Overdue steps', '逾期步骤')}</div>
        {data.overdue.length === 0 ? (
          <p style={{ margin: '8px 0 0' }}>{t(lang, 'Мерзімі өткен қадам жоқ.', 'Просроченных шагов нет.', 'No overdue steps.', '暂无逾期步骤。')}</p>
        ) : (
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {data.overdue.slice(0, 8).map((item) => (
              <li key={`${item.projectId}-${item.nextAction}-${item.dueDate}`}>
                <strong>{item.title}</strong>: {item.nextAction} ({item.daysOverdue} {t(lang, 'күн', 'дн.', 'days', '天')})
              </li>
            ))}
          </ul>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 13 }}>
        {t(lang, 'Есептер (CSV)', 'Отчёты (CSV)', 'Reports (CSV)', '报告（CSV）')}:{' '}
        {['projects', 'investors', 'kpi'].map((name, index) => (
          <span key={name}>
            {index > 0 ? ' · ' : ''}
            {/* CSV жүктеу: API маршрут (бет емес), әдеттегі браузер сілтемесі қажет */}
            <a href={`/api/portal/reports/${name}`}>{name}.csv</a>
          </span>
        ))}
      </p>
    </section>
  )
}
