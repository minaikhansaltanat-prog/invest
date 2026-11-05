import type { CollectionConfig } from 'payload'

import { hasAdminRole, withRoles } from '@/access'
import { roleField } from '@/access/fields'
import { investorRules } from '@/hooks/investment'
import { number, select, text } from '@/fields/helpers'
import { l } from '@/lib/labels'
import { projectModels, regions, sectors, toOptions } from '@/lib/taxonomy'

// Инвесторлар (CRM, ТТ 8.1, 8.2, 10.2). Деңгей мен мәртебені scorecard бекітілгенде сервер есептейді, қолмен өзгертуге болмайды.
// Вето: тек комплаенс қызметкері (ТТ 8.2); баллға қарамастан мәртебе «тоқтатылды», себебі міндетті.
export const Investors: CollectionConfig = {
  slug: 'investors',
  labels: {
    singular: l('Инвестор', 'Инвестор', 'Investor', '投资者'),
    plural: l('Инвесторлар', 'Инвесторы', 'Investors', '投资者'),
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'grade', 'status', 'direction', 'lastAssessedAt'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    // Өңірлік өкіл тек өз өңірін қызықтыратын инвесторларды көреді (ТТ 10: жазбаға қатынас)
    read: ({ req }) => {
      if (hasAdminRole(req, 'secretariat', 'chair', 'compliance', 'auditor', 'expert')) return true
      if (hasAdminRole(req, 'regional-rep')) {
        const region = (req.user as { region?: string } | null)?.region
        return region ? { regions: { contains: region } } : false
      }
      return false
    },
    create: withRoles('secretariat', 'chair'),
    update: withRoles('secretariat', 'chair', 'compliance'),
    delete: withRoles('chair'),
  },
  hooks: { beforeChange: [investorRules] },
  fields: [
    text('displayName', l('Атауы', 'Название', 'Name', '名称'), { required: true, index: true }),
    { name: 'organization', type: 'relationship', relationTo: 'organizations', label: l('Ұйым', 'Организация', 'Organisation', '机构') },
    { name: 'user', type: 'relationship', relationTo: 'users', label: l('Порталдағы аккаунт', 'Аккаунт на портале', 'Portal account', '门户账户'), admin: { description: l('Деректер бөлмесіне кіру осы аккаунт арқылы.', 'Доступ к data room через этот аккаунт.', 'Data room access goes through this account.', '数据室访问通过此账户进行。') } },
    select('kind', l('Түрі', 'Тип', 'Type', '类型'), [
      { value: 'corporate', label: l('Корпорация', 'Корпорация', 'Corporation', '企业') },
      { value: 'fund', label: l('Қор', 'Фонд', 'Fund', '基金') },
      { value: 'institution', label: l('Институт', 'Институт', 'Institution', '机构投资者') },
    ]),
    select('direction', l('Бағыт', 'Направление', 'Direction', '方向'), [
      { value: 'china', label: l('Қытай', 'Китай', 'China', '中国') },
      { value: 'gulf', label: l('Парсы шығанағы', 'Страны Залива', 'Gulf', '海湾') },
      { value: 'global', label: l('Еуропа және Азия', 'Европа и Азия', 'Europe and Asia', '欧洲与亚洲') },
      { value: 'other', label: l('Басқа', 'Другое', 'Other', '其他') },
    ]),
    { name: 'sectors', type: 'select', hasMany: true, options: toOptions(sectors), label: l('Салалар', 'Отрасли', 'Sectors', '行业') },
    { name: 'regions', type: 'select', hasMany: true, options: toOptions(regions), label: l('Өңірлер', 'Регионы', 'Regions', '地区') },
    { name: 'models', type: 'select', hasMany: true, options: toOptions(projectModels), label: l('Модельдер', 'Модели', 'Models', '模式') },
    number('minAmountMusd', l('Көлемі: бастап, млн $', 'Объем: от, млн $', 'Size: from, USD million', '规模：起，百万美元'), { min: 0 }),
    number('maxAmountMusd', l('Көлемі: дейін, млн $', 'Объем: до, млн $', 'Size: to, USD million', '规模：至，百万美元'), { min: 0 }),
    select('riskAppetite', l('Тәуекелге дайындығы', 'Готовность к риску', 'Risk appetite', '风险偏好'), [
      { value: 'low', label: l('Төмен', 'Низкая', 'Low', '低') },
      { value: 'medium', label: l('Орташа', 'Средняя', 'Medium', '中') },
      { value: 'high', label: l('Жоғары', 'Высокая', 'High', '高') },
    ]),
    // Есептелген өрістер: hook әр сақтауда қайта есептейді
    select(
      'status',
      l('Мәртебесі (есептеледі)', 'Статус (вычисляется)', 'Status (computed)', '状态（自动计算）'),
      [
        { value: 'unassessed', label: l('Бағаланбаған', 'Не оценён', 'Not assessed', '未评估') },
        { value: 'stopped', label: l('Тоқтатылды (вето)', 'Остановлен (вето)', 'Stopped (veto)', '已暂停（否决）') },
        { value: 'priority', label: l('Басым серіктес (A)', 'Приоритетный партнёр (A)', 'Priority partner (A)', '优先合作伙伴（A）') },
        { value: 'conditional', label: l('Шартты серіктес (B)', 'Условный партнёр (B)', 'Conditional partner (B)', '有条件合作伙伴（B）') },
        { value: 'watch', label: l('Бақылау тобы (C)', 'Группа наблюдения (C)', 'Watch group (C)', '观察组（C）') },
        { value: 'deferred', label: l('Жіберілмейді (D)', 'Не допускается (D)', 'Deferred (D)', '暂不准入（D）') },
      ],
      { defaultValue: 'unassessed', admin: { readOnly: true, position: 'sidebar' } },
    ),
    select('grade', l('Деңгейі (есептеледі)', 'Уровень (вычисляется)', 'Grade (computed)', '等级（自动计算）'), [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
    ], { admin: { readOnly: true, position: 'sidebar' } }),
    number('totalScore', l('Жалпы балл (есептеледі)', 'Общий балл (вычисляется)', 'Total score (computed)', '总分（自动计算）'), { min: 0, max: 100, admin: { readOnly: true, position: 'sidebar' } }),
    { name: 'lastAssessedAt', type: 'date', label: l('Соңғы бағалау', 'Последняя оценка', 'Last assessed', '最近评估'), admin: { readOnly: true, position: 'sidebar' } },
    // Комплаенс ветосы (ТТ 8.2): тек комплаенс қызметкері өзгертеді
    {
      name: 'veto',
      type: 'group',
      label: l('Комплаенс ветосы', 'Комплаенс-вето', 'Compliance veto', '合规否决'),
      access: { update: roleField('compliance') },
      fields: [
        { name: 'active', type: 'checkbox', defaultValue: false, label: l('Вето белсенді', 'Вето активно', 'Veto active', '否决生效') },
        { name: 'reason', type: 'textarea', label: l('Себебі (міндетті)', 'Причина (обязательно)', 'Reason (required)', '原因（必填）') },
        { name: 'setBy', type: 'relationship', relationTo: 'admins', admin: { readOnly: true } },
        { name: 'setAt', type: 'date', admin: { readOnly: true } },
      ],
    },
    { name: 'sanctionsCheckedAt', type: 'date', label: l('Санкциялық тексеру күні', 'Дата санкционной проверки', 'Sanctions check date', '制裁筛查日期'), access: { update: roleField('compliance') } },
    { name: 'responsibleManager', type: 'relationship', relationTo: 'admins', label: l('Жауапты менеджер', 'Ответственный менеджер', 'Responsible manager', '负责经理') },
    { name: 'notes', type: 'textarea', label: l('Ішкі жазбалар', 'Внутренние заметки', 'Internal notes', '内部备注') },
  ],
}
