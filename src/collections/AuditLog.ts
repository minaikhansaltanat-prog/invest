import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

// Аудит журналы (ТТ 10.2, 14.1): кім, қашан, қандай жазбаны, қалай өзгертті (ескі және жаңа мән). Өшірілмейді және өзгертілмейді (append-only):
// REST арқылы ешкім жаза/өзгерте/өшіре алмайды, жазбаны тек сервер hook-тары жасайды. Оқу: комплаенс, төраға, ревизор. Сақтау: кемінде 3 жыл.
export const AuditLog: CollectionConfig = {
  slug: 'auditLog',
  labels: {
    singular: l('Аудит жазбасы', 'Запись аудита', 'Audit entry', '审计记录'),
    plural: l('Аудит журналы', 'Журнал аудита', 'Audit log', '审计日志'),
  },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['at', 'action', 'collection', 'docId', 'actorEmail', 'ip'],
    group: adminGroups.system,
  },
  access: {
    read: withRoles('compliance', 'chair', 'auditor'),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  defaultSort: '-at',
  timestamps: false,
  fields: [
    { name: 'at', type: 'date', required: true, index: true, label: l('Уақыты', 'Время', 'Time', '时间') },
    {
      name: 'action',
      type: 'select',
      required: true,
      index: true,
      label: l('Әрекет', 'Действие', 'Action', '操作'),
      options: ['create', 'update', 'delete', 'login', 'export'].map((value) => ({ value, label: value })),
    },
    { name: 'collection', type: 'text', index: true, label: l('Жинақ', 'Коллекция', 'Collection', '集合') },
    { name: 'docId', type: 'text', index: true, label: l('Жазба id', 'ID записи', 'Record id', '记录ID') },
    { name: 'actorCollection', type: 'text', label: l('Әрекет иесі (жинақ)', 'Автор (коллекция)', 'Actor (collection)', '操作者（集合）') },
    { name: 'actorId', type: 'text', index: true },
    { name: 'actorEmail', type: 'text', label: l('Әрекет иесі', 'Автор', 'Actor', '操作者') },
    { name: 'ip', type: 'text', label: 'IP' },
    { name: 'changes', type: 'json', label: l('Өзгерістер (ескі / жаңа)', 'Изменения (старое / новое)', 'Changes (old / new)', '变更（旧 / 新）') },
    { name: 'note', type: 'text', label: l('Ескертпе', 'Примечание', 'Note', '备注') },
  ],
}
