import { type L4, l } from '@/lib/labels'

// Әкімшілік рөлдері: ТТ 10.1 (жарғыдағы басқару моделіне сәйкес)
export const adminRoles = [
  'super-admin',
  'chair',
  'secretariat',
  'expert',
  'compliance',
  'auditor',
  'content-manager',
  'translator',
  'regional-rep',
  'analyst',
] as const
export type AdminRole = (typeof adminRoles)[number]

export const adminRoleLabels: Record<AdminRole, L4> = {
  'super-admin': l('Супер-администратор', 'Супер-администратор', 'Super administrator', '超级管理员'),
  chair: l(
    'Төраға / Атқарушы директор',
    'Председатель / Исполнительный директор',
    'Chair / Executive Director',
    '主席 / 执行董事',
  ),
  secretariat: l('Хатшылық (модератор)', 'Секретариат (модератор)', 'Secretariat (moderator)', '秘书处（审核员）'),
  expert: l(
    'Инвестициялық комитет мүшесі / сарапшы',
    'Член инвестиционного комитета / эксперт',
    'Investment committee member / expert',
    '投资委员会成员 / 专家',
  ),
  compliance: l('Комплаенс қызметкері', 'Сотрудник комплаенс', 'Compliance officer', '合规专员'),
  auditor: l('Ревизор', 'Ревизор', 'Auditor', '审计员'),
  'content-manager': l('Контент-менеджер', 'Контент-менеджер', 'Content manager', '内容经理'),
  translator: l('Аудармашы', 'Переводчик', 'Translator', '翻译'),
  'regional-rep': l(
    'Өңірлік / шетелдік өкіл',
    'Региональный / зарубежный представитель',
    'Regional / overseas representative',
    '地区 / 海外代表',
  ),
  analyst: l('Аналитик', 'Аналитик', 'Analyst', '分析师'),
}

// Жеке кабинет рөлдері: ТТ 9 (бір аккаунтта бірнеше рөл болуы мүмкін)
export const userRoles = ['investor', 'owner', 'member'] as const
export type UserRole = (typeof userRoles)[number]

export const userRoleLabels: Record<UserRole, L4> = {
  investor: l('Инвестор', 'Инвестор', 'Investor', '投资者'),
  owner: l('Жоба иесі', 'Владелец проекта', 'Project owner', '项目方'),
  member: l('Мүше', 'Член ассоциации', 'Member', '会员'),
}
