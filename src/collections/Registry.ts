import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { l } from '@/lib/labels'

const group = l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块')

// Меморандумдар мен шарттар (ТТ 10.2: 8-модуль). Жариялауға рұқсат белгісі қолмен қойылады; мемлекеттік орган туралы мәтін «келісім бар» белгісінсіз жарияланбайды (ТТ 14.3).
export const Agreements: CollectionConfig = {
  slug: 'agreements',
  labels: { singular: l('Келісім', 'Соглашение', 'Agreement', '协议'), plural: l('Келісімдер', 'Соглашения', 'Agreements', '协议') },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'type', 'signedAt', 'validUntil', 'publishPermission'], group },
  access: { read: withRoles('secretariat', 'chair', 'auditor', 'compliance'), create: withRoles('secretariat', 'chair'), update: withRoles('secretariat', 'chair'), delete: withRoles('chair') },
  fields: [
    { name: 'title', type: 'text', required: true, label: l('Атауы', 'Название', 'Title', '名称') },
    { name: 'type', type: 'select', required: true, defaultValue: 'memorandum', options: [{ value: 'memorandum', label: l('Меморандум', 'Меморандум', 'Memorandum', '备忘录') }, { value: 'contract', label: l('Шарт', 'Договор', 'Contract', '合同') }], label: l('Түрі', 'Тип', 'Type', '类型') },
    { name: 'partner', type: 'relationship', relationTo: 'partners', label: l('Серіктес', 'Партнёр', 'Partner', '合作伙伴') },
    { name: 'parties', type: 'textarea', label: l('Тараптар', 'Стороны', 'Parties', '各方') },
    { name: 'signedAt', type: 'date', label: l('Күні', 'Дата', 'Date', '日期') },
    { name: 'validUntil', type: 'date', label: l('Мерзімі', 'Срок', 'Valid until', '有效期至') },
    { name: 'obligations', type: 'textarea', label: l('Міндеттемелер', 'Обязательства', 'Obligations', '义务') },
    { name: 'file', type: 'upload', relationTo: 'media', label: l('Файл', 'Файл', 'File', '文件') },
    { name: 'publishPermission', type: 'checkbox', defaultValue: false, label: l('Жариялауға рұқсат бар', 'Есть разрешение на публикацию', 'Permission to publish', '已获公开许可') },
  ],
}

// Мүшелер (ТТ 10.2: 6-модуль): өтініш → тексеру → белсенді → тоқтатылған → аяқталған; санат, жарна, мерзім.
export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: l('Мүше', 'Член', 'Member', '会员'), plural: l('Мүшелер', 'Члены', 'Members', '会员') },
  admin: { useAsTitle: 'id', defaultColumns: ['organization', 'category', 'status', 'validUntil'], group },
  access: { read: withRoles('secretariat', 'chair', 'auditor'), create: withRoles('secretariat', 'chair'), update: withRoles('secretariat', 'chair'), delete: withRoles('chair') },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true, index: true, label: l('Ұйым', 'Организация', 'Organisation', '机构') },
    { name: 'category', type: 'select', required: true, defaultValue: 'foreign-investors', label: l('Санаты', 'Категория', 'Category', '类别'), options: ['foreign-investors', 'institutions', 'industrial', 'professional', 'strategic'].map((value) => ({ value, label: value })) },
    { name: 'status', type: 'select', required: true, defaultValue: 'application', label: l('Мәртебесі', 'Статус', 'Status', '状态'), options: [
      { value: 'application', label: l('Өтініш', 'Заявка', 'Application', '申请') },
      { value: 'vetting', label: l('Тексеру', 'Проверка', 'Vetting', '审核') },
      { value: 'active', label: l('Белсенді', 'Активен', 'Active', '正常') },
      { value: 'suspended', label: l('Тоқтатылған', 'Приостановлен', 'Suspended', '已暂停') },
      { value: 'ended', label: l('Аяқталған', 'Завершён', 'Ended', '已终止') },
    ] },
    { name: 'memberSince', type: 'date', label: l('Мүше болған күні', 'Член с', 'Member since', '入会日期') },
    { name: 'validUntil', type: 'date', label: l('Мерзімі', 'Срок', 'Valid until', '有效期至') },
    { name: 'fees', type: 'array', label: l('Жарналар', 'Взносы', 'Fees', '会费'), fields: [{ name: 'year', type: 'number' }, { name: 'amount', type: 'number', min: 0 }, { name: 'paidAt', type: 'date' }] },
    { name: 'registryConsent', type: 'checkbox', defaultValue: false, label: l('Тізілімде көрсетуге келісім', 'Согласие на показ в реестре', 'Consent to registry listing', '同意在名录公示') },
  ],
}

// Мәселелер тізілімі (ТТ 10.2: 7-модуль): инвестор мен мүшелердің мемлекетке жеткізілетін мәселелері.
export const Issues: CollectionConfig = {
  slug: 'issues',
  labels: { singular: l('Мәселе', 'Вопрос', 'Issue', '问题'), plural: l('Мәселелер тізілімі', 'Реестр вопросов', 'Issue register', '问题登记册') },
  admin: { useAsTitle: 'id', defaultColumns: ['type', 'authority', 'status', 'createdAt'], group },
  access: { read: withRoles('secretariat', 'chair', 'regional-rep', 'auditor'), create: withRoles('secretariat', 'chair', 'regional-rep'), update: withRoles('secretariat', 'chair'), delete: withRoles('chair') },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', label: l('Ұйым', 'Организация', 'Organisation', '机构') },
    { name: 'type', type: 'select', required: true, defaultValue: 'permit', label: l('Түрі', 'Тип', 'Type', '类型'), options: ['land', 'infrastructure', 'permit', 'tax', 'labor', 'migration'].map((value) => ({ value, label: value })) },
    { name: 'description', type: 'textarea', required: true, label: l('Сипаттама', 'Описание', 'Description', '说明') },
    { name: 'authority', type: 'text', label: l('Жіберілген орган', 'Орган, куда направлено', 'Authority', '受理机关') },
    { name: 'status', type: 'select', required: true, defaultValue: 'new', label: l('Мәртебесі', 'Статус', 'Status', '状态'), options: ['new', 'forwarded', 'resolved', 'closed'].map((value) => ({ value, label: value })) },
    { name: 'response', type: 'textarea', label: l('Жауап', 'Ответ', 'Response', '回复') },
  ],
}
