import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { l } from '@/lib/labels'

// Деректер бөлмесінің қарау журналы (ТТ 8.6): әр ашу, қарау, жүктеу және бас тарту. Тек сервер жазады, өзгертілмейді және өшірілмейді.
export const DataroomLog: CollectionConfig = {
  slug: 'dataroomLog',
  labels: {
    singular: l('Қарау журналы жазбасы', 'Запись журнала просмотра', 'Access log entry', '访问日志'),
    plural: l('Деректер бөлмесі журналы', 'Журнал data room', 'Data room log', '数据室日志'),
  },
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['at', 'action', 'user', 'project', 'reason'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    read: withRoles('compliance', 'chair', 'auditor'),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  defaultSort: '-at',
  fields: [
    { name: 'at', type: 'date', required: true, index: true },
    { name: 'action', type: 'select', required: true, options: ['open', 'view', 'download', 'denied'].map((value) => ({ value, label: value })) },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'file', type: 'relationship', relationTo: 'dataroomFiles' },
    { name: 'ip', type: 'text' },
    { name: 'reason', type: 'text', admin: { description: l('Бас тарту себебі (инвесторға көрсетілмейді)', 'Причина отказа (инвестору не показывается)', 'Denial reason (not shown to the investor)', '拒绝原因（不向投资者显示）') } },
    { name: 'message', type: 'text' },
  ],
}
