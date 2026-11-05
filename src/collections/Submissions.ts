import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { l } from '@/lib/labels'

export const submissionKinds = ['contact', 'investor', 'project', 'membership'] as const
export const submissionStatuses = ['new', 'in-review', 'accepted', 'rejected', 'spam'] as const

// Сайт формаларынан түскен өтініштер (ТТ 8.1, 9, 18.2 6-кезең). Жазбаны тек сервер жасайды (`/api/portal/forms/*`: ALTCHA, келісім, шектеу),
// сондықтан REST-пен жасауға болмайды. Қызметкерлер оқиды және мәртебесін өзгертеді; дербес деректер аудитке түседі (8-кезең).
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: {
    singular: l('Өтініш', 'Заявка', 'Submission', '申请'),
    plural: l('Өтініштер', 'Заявки', 'Submissions', '申请'),
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'kind', 'status', 'contactName', 'email', 'createdAt'],
    group: l('Өтініштер', 'Заявки', 'Applications', '申请'),
  },
  access: {
    create: () => false,
    read: withRoles('secretariat', 'chair', 'compliance'),
    update: withRoles('secretariat', 'chair'),
    delete: withRoles('chair'),
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true, label: l('Номері', 'Номер', 'Reference', '编号'), admin: { readOnly: true } },
    {
      name: 'kind',
      type: 'select',
      required: true,
      label: l('Түрі', 'Тип', 'Type', '类型'),
      options: [
        { value: 'contact', label: l('Байланыс', 'Контакт', 'Contact', '联系') },
        { value: 'investor', label: l('Инвестор', 'Инвестор', 'Investor', '投资者') },
        { value: 'project', label: l('Жоба', 'Проект', 'Project', '项目') },
        { value: 'membership', label: l('Мүшелік', 'Членство', 'Membership', '会员') },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: l('Мәртебесі', 'Статус', 'Status', '状态'),
      options: submissionStatuses.map((value) => ({
        value,
        label:
          value === 'new'
            ? l('Жаңа', 'Новая', 'New', '新')
            : value === 'in-review'
              ? l('Қарауда', 'На рассмотрении', 'In review', '审核中')
              : value === 'accepted'
                ? l('Қабылданды', 'Принята', 'Accepted', '已接受')
                : value === 'rejected'
                  ? l('Қабылданбады', 'Отклонена', 'Rejected', '已拒绝')
                  : l('Спам', 'Спам', 'Spam', '垃圾'),
      })),
      admin: { position: 'sidebar' },
    },
    { name: 'contactName', type: 'text', index: true, label: l('Байланыс тұлғасы', 'Контактное лицо', 'Contact person', '联系人'), admin: { readOnly: true } },
    { name: 'email', type: 'email', index: true, label: l('Пошта', 'Почта', 'Email', '邮箱'), admin: { readOnly: true } },
    { name: 'locale', type: 'text', label: l('Тілі', 'Язык', 'Language', '语言'), admin: { readOnly: true, position: 'sidebar' } },
    { name: 'data', type: 'json', required: true, label: l('Форма деректері', 'Данные формы', 'Form data', '表单数据'), admin: { readOnly: true } },
    {
      name: 'consent',
      type: 'group',
      label: l('Келісім (ТТ 14.2)', 'Согласие (ТЗ 14.2)', 'Consent (TZ 14.2)', '同意记录（ТЗ 14.2）'),
      admin: { readOnly: true },
      fields: [
        { name: 'at', type: 'date', required: true },
        { name: 'version', type: 'text', required: true },
        { name: 'ipHash', type: 'text' },
      ],
    },
    { name: 'user', type: 'relationship', relationTo: 'users', label: l('Тіркелген пайдаланушы', 'Зарегистрированный пользователь', 'Registered user', '注册用户'), admin: { readOnly: true } },
    { name: 'notes', type: 'textarea', label: l('Ішкі жазбалар', 'Внутренние заметки', 'Internal notes', '内部备注') },
  ],
}
