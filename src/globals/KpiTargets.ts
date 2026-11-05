import type { GlobalConfig } from 'payload'

import { checkbox, ltextarea, number } from '@/fields/helpers'
import { l } from '@/lib/labels'

// Нәтиже блогының межелері (ТТ 6: KPI жинағы). Нақты сандар 7-8-кезеңде расталған жазбалардан автоматты есептеледі;
// бастапқы кезеңде осы жерде мақсатты көрсеткіш ретінде тұрады.
export const KpiTargets: GlobalConfig = {
  slug: 'kpiTargets',
  label: l('KPI межелері', 'Целевые KPI', 'KPI targets', 'KPI 目标'),
  admin: { group: l('Баптаулар', 'Настройки', 'Settings', '设置') },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
  },
  fields: [
    checkbox('isTarget', l('Сандар мақсатты көрсеткіш', 'Цифры являются целевыми', 'Figures are targets', '数字为目标指标'), {
      defaultValue: true,
    }),
    ltextarea('periodNote', l('Кезең туралы ескертпе', 'Примечание о периоде', 'Period note', '期间说明'), {
      required: true,
    }),
    number('databaseCount', l('Деректер базасы', 'База данных', 'Database', '数据库'), { required: true, min: 0 }),
    number('screenedCount', l('Тексеру', 'Проверка', 'Screening', '审核'), { required: true, min: 0 }),
    number('reviewedCount', l('Сараптама', 'Экспертиза', 'Expert review', '专家评审'), { required: true, min: 0 }),
    number('confirmedCount', l('Расталған', 'Подтверждено', 'Confirmed', '已确认'), { required: true, min: 0 }),
  ],
}
