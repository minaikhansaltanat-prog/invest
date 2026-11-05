import type { CollectionConfig, Where } from 'payload'

import { hasAdminRole, isAdminUser } from '@/access'
import { computedField, roleField } from '@/access/fields'
import { checkbox, ltext, ltextarea, number, rows, select, text } from '@/fields/helpers'
import { projectBusinessRules } from '@/hooks/investment'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'
import { projectLevels, projectModels, projectStages, regions, sectors, toOptions } from '@/lib/taxonomy'

export const projectIcons = ['solar', 'port', 'factory', 'wind', 'agro', 'rail'] as const

// Ішкі жоба деректері (иесі, сомалар, тәуекелдер): контент-менеджер мен аудармашыға керек емес, сондықтан көрсетілмейді
const internalRead = roleField('chair', 'secretariat', 'expert', 'compliance', 'auditor', 'analyst', 'regional-rep')
const internalWrite = roleField('chair', 'secretariat', 'expert', 'regional-rep')

// Ашық каталог: тек жариялауға рұқсат берілген және 2-3 деңгейлі жобалар (ТТ 7.4, 8.3)
const publicCatalogWhere: Where = {
  and: [{ publishToCatalog: { equals: true } }, { level: { in: ['2', '3'] } }],
}

// Жобалар (ТТ 8.3, 13.3). Қазір басты беттің каталогына қажет өрістер ғана; 7-кезеңде кезеңдер, тәуекелдер, төрт сома қосылады.
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: l('Жоба', 'Проект', 'Project', '项目'),
    plural: l('Жобалар', 'Проекты', 'Projects', '项目'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'level', 'sector', 'region', 'publishToCatalog'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    read: ({ req }) => {
      if (!isAdminUser(req)) return publicCatalogWhere
      // Өңірлік өкіл тек өз өңірінің жобаларын көреді (ТТ 10)
      if (hasAdminRole(req, 'chair', 'secretariat', 'expert', 'compliance', 'auditor', 'analyst', 'content-manager', 'translator')) return true
      const region = (req.user as { region?: string } | null)?.region
      return region ? { region: { equals: region } } : false
    },
    create: ({ req }) => hasAdminRole(req, 'secretariat', 'chair', 'regional-rep'),
    update: ({ req }) => hasAdminRole(req, 'secretariat', 'chair', 'expert', 'regional-rep'),
    delete: ({ req }) => hasAdminRole(req, 'chair'),
  },
  // Деңгей, кезең, жариялау және сома ережелері (ТТ 8.3, 8.4, 8.7): UI емес, сервер тексереді
  hooks: { beforeChange: [projectBusinessRules] },
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Қысқа сипаттама', 'Краткое описание', 'Short description', '简介')),
    select('sector', l('Сала', 'Отрасль', 'Sector', '行业'), toOptions(sectors), { required: true }),
    ltext('subSector', l('Бағыты (мысалы, Терең өңдеу)', 'Подотрасль (например, Глубокая переработка)', 'Sub-sector (e.g. Deep processing)', '细分领域（例如：深加工）')),
    select('region', l('Өңір', 'Регион', 'Region', '地区'), toOptions(regions), { required: true }),
    number('amountMusd', l('Болжамды көлем, млн $', 'Ориентировочный объём, млн $', 'Estimated size, USD million', '预估规模（百万美元）'), {
      min: 0,
    }),
    select('model', l('Модель', 'Модель', 'Model', '模式'), toOptions(projectModels), { required: true }),
    select('level', l('Деңгей', 'Уровень', 'Level', '等级'), toOptions(projectLevels), {
      required: true,
      defaultValue: '1',
    }),
    select('stage', l('Кезең', 'Этап', 'Stage', '阶段'), toOptions(projectStages), { defaultValue: '1' }),
    select(
      'iconKey',
      l('Иконка (суреті жоқ карточка үшін)', 'Иконка (для карточки без фото)', 'Icon (for cards without a photo)', '图标（无图片的卡片）'),
      projectIcons.map((value) => ({ value, label: value })),
    ),
    { name: 'image', type: 'upload', relationTo: 'media', label: l('Сурет', 'Изображение', 'Image', '图片') },
    checkbox(
      'publishToCatalog',
      l('Ашық каталогқа шығару', 'Опубликовать в открытом каталоге', 'Publish to the public catalogue', '发布到公开目录'),
      {
        defaultValue: false,
        admin: {
          description: l(
            'Тек 2-3 деңгейлі, тексеруден өткен жоба шығады. Тексерілмеген жоба ашық каталогқа түспейді.',
            'Публикуются только проекты 2-3 уровня, прошедшие проверку. Непроверенный проект в открытый каталог не попадает.',
            'Only vetted level 2-3 projects are published. An unvetted project never reaches the public catalogue.',
            '仅发布通过审核的2-3级项目。未经审核的项目不会进入公开目录。',
          ),
        },
      },
    ),
    checkbox('isSample', l('Мысал (нақты дерек емес)', 'Пример (не реальные данные)', 'Example (not real data)', '示例（非真实数据）'), {
      defaultValue: false,
      access: { update: roleField() },
    }),
    // Ішкі деректер: жария API-ға ешқашан шықпайды (өрістік read access), жазуға рөлге байлаулы (ТТ 8.3, 8.4, 8.7, 10.1)
    {
      name: 'internal',
      type: 'group',
      label: l('Ішкі деректер (ашық емес)', 'Внутренние данные (не публикуются)', 'Internal data (not public)', '内部数据（不公开）'),
      access: { read: internalRead, create: internalWrite, update: internalWrite },
      fields: [
        { name: 'ownerOrganization', type: 'relationship', relationTo: 'organizations', label: l('Иесі (ұйым)', 'Владелец (организация)', 'Owner (organisation)', '所有人（机构）') },
        text('ownerName', l('Иесінің аты', 'Имя владельца', 'Owner name', '所有人名称')),
        { name: 'responsibleManager', type: 'relationship', relationTo: 'admins', label: l('Жауапты менеджер', 'Ответственный менеджер', 'Responsible manager', '负责经理') },
        select('riskLevel', l('Тәуекел деңгейі (сәйкестендіру үшін)', 'Уровень риска (для подбора)', 'Risk level (for matching)', '风险等级（用于匹配）'), [
          { value: 'low', label: l('Төмен', 'Низкий', 'Low', '低') },
          { value: 'medium', label: l('Орташа', 'Средний', 'Medium', '中') },
          { value: 'high', label: l('Жоғары', 'Высокий', 'High', '高') },
        ]),
        { name: 'purpose', type: 'textarea', label: l('Мақсаты', 'Цель', 'Purpose', '目标') },
        { name: 'need', type: 'textarea', label: l('Қажеттілігі', 'Потребность', 'Need', '需求') },
        checkbox('documentsVerified', l('Құжаттар тексерілді (2-деңгей)', 'Документы проверены (уровень 2)', 'Documents verified (level 2)', '文件已核验（2级）'), { access: { update: roleField('secretariat', 'chair') } }),
        checkbox('landStatusVerified', l('Жер мәртебесі тексерілді (2-деңгей)', 'Статус земли проверен (уровень 2)', 'Land status verified (level 2)', '土地状态已核验（2级）'), { access: { update: roleField('secretariat', 'chair') } }),
        checkbox('initialRisksVerified', l('Бастапқы тәуекелдер тексерілді (2-деңгей)', 'Первичные риски проверены (уровень 2)', 'Initial risks verified (level 2)', '初步风险已核验（2级）'), { access: { update: roleField('secretariat', 'chair') } }),
        select(
          'committeeDecision',
          l('Комитет шешімі', 'Решение комитета', 'Committee decision', '委员会决定'),
          [
            { value: 'pending', label: l('Күтуде', 'Ожидает', 'Pending', '待定') },
            { value: 'approved', label: l('Бекітті', 'Утверждено', 'Approved', '已批准') },
            { value: 'rejected', label: l('Бас тартты', 'Отклонено', 'Rejected', '已拒绝') },
          ],
          { defaultValue: 'pending', access: { update: roleField('chair', 'expert') } },
        ),
        checkbox('passportReady', l('Паспорт дайын (3-деңгей)', 'Паспорт готов (уровень 3)', 'Passport ready (level 3)', '档案就绪（3级）')),
        checkbox('feasibilityStudyReady', l('Алдын ала ТЭН дайын (3-деңгей)', 'Предварительное ТЭО готово (уровень 3)', 'Pre-feasibility ready (level 3)', '预可研就绪（3级）')),
        checkbox('secretariatChecklistApproved', l('Хатшылық чек-листі бекітілді (2-кезең)', 'Чек-лист секретариата утверждён (этап 2)', 'Secretariat checklist approved (stage 2)', '秘书处清单已批准（阶段2）'), { access: { update: roleField('secretariat', 'chair') } }),
        number('interestedInvestorCount', l('Қызығушылық білдірген инвесторлар', 'Заинтересованных инвесторов', 'Interested investors', '有意向的投资者'), { defaultValue: 0, access: { update: computedField } }),
        checkbox('intentProtocolSigned', l('Ниет хаттамасы (5-кезең)', 'Протокол о намерениях (этап 5)', 'Intent protocol (stage 5)', '意向书（阶段5）')),
        checkbox('termSheetSigned', l('Терм-шит (5-кезең)', 'Терм-шит (этап 5)', 'Term sheet (stage 5)', '条款清单（阶段5）')),
        checkbox('contractSigned', l('Ресми шартқа қол қойылды (6-кезең)', 'Договор подписан (этап 6)', 'Contract signed (stage 6)', '正式合同已签署（阶段6）')),
        checkbox('productionStarted', l('Өндіріс басталды (7-кезең)', 'Производство запущено (этап 7)', 'Production started (stage 7)', '已投产（阶段7）')),
        // ТТ 8.7: төрт сома бөлек, ешқашан қосылмайды; «нақты түскен» тек дәлел файлымен
        {
          name: 'amounts',
          type: 'group',
          label: l('Төрт бөлек сома (қосылмайды), млн $', 'Четыре отдельные суммы (не суммируются), млн $', 'Four separate amounts (never summed), USD million', '四项独立金额（不相加），百万美元'),
          fields: [
            number('declared', l('Мәлімделген', 'Заявленная', 'Declared', '申报金额'), { min: 0 }),
            number('loi', l('Ниет құжаты бойынша', 'По документу о намерениях', 'Per letter of intent', '意向书金额'), { min: 0 }),
            number('contract', l('Ресми шарт бойынша', 'По официальному договору', 'Per official contract', '合同金额'), { min: 0 }),
            number('received', l('Нақты түскен (дәлелмен)', 'Фактически поступившая (с доказательством)', 'Actually received (with evidence)', '实际到账（需佐证）'), { min: 0, access: { update: roleField('secretariat', 'chair') } }),
            {
              name: 'receivedEvidence',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: l('Түскен қаражаттың дәлелі (банк құжаты, аудит)', 'Доказательство поступления (банк, аудит)', 'Evidence of receipt (bank, audit)', '到账佐证（银行、审计）'),
            },
            select('associationContribution', l('Қауымдастықтың үлесі', 'Вклад ассоциации', "Association's contribution", '协会贡献'), [
              { value: 'direct', label: l('Тікелей жәрдемдесті', 'Прямое содействие', 'Direct support', '直接促成') },
              { value: 'indirect', label: l('Жанама қатысты', 'Косвенное участие', 'Indirect involvement', '间接参与') },
            ]),
          ],
        },
        rows(
          'stageHistory',
          l('Кезеңдер тарихы (автоматты)', 'История этапов (автоматически)', 'Stage history (automatic)', '阶段历史（自动）'),
          { singular: l('Жазба', 'Запись', 'Entry', '记录'), plural: l('Жазбалар', 'Записи', 'Entries', '记录') },
          [
            { name: 'stage', type: 'text' },
            { name: 'at', type: 'date' },
            { name: 'by', type: 'text' },
          ],
          // Сервер әр сақтауда қайта құрады (клиент жіберген мән ескерілмейді)
          { admin: { initCollapsed: true, readOnly: true } },
        ),
        rows(
          'risks',
          l('Тәуекелдер тізілімі', 'Реестр рисков', 'Risk register', '风险登记册'),
          { singular: l('Тәуекел', 'Риск', 'Risk', '风险'), plural: l('Тәуекелдер', 'Риски', 'Risks', '风险') },
          [
            select('type', l('Түрі', 'Тип', 'Type', '类型'), [
              { value: 'legal', label: l('Құқықтық', 'Правовой', 'Legal', '法律') },
              { value: 'financial', label: l('Қаржылық', 'Финансовый', 'Financial', '财务') },
              { value: 'technical', label: l('Техникалық', 'Технический', 'Technical', '技术') },
              { value: 'market', label: l('Нарықтық', 'Рыночный', 'Market', '市场') },
              { value: 'ecology', label: l('Экологиялық', 'Экологический', 'Environmental', '环境') },
            ]),
            { name: 'description', type: 'textarea' },
            select('level', l('Деңгейі', 'Уровень', 'Level', '等级'), [
              { value: 'low', label: l('Төмен', 'Низкий', 'Low', '低') },
              { value: 'medium', label: l('Орташа', 'Средний', 'Medium', '中') },
              { value: 'high', label: l('Жоғары', 'Высокий', 'High', '高') },
            ]),
            { name: 'mitigation', type: 'textarea' },
            select('status', l('Мәртебесі', 'Статус', 'Status', '状态'), [
              { value: 'open', label: l('Ашық', 'Открыт', 'Open', '未关闭') },
              { value: 'mitigated', label: l('Азайтылды', 'Снижен', 'Mitigated', '已缓解') },
              { value: 'closed', label: l('Жабық', 'Закрыт', 'Closed', '已关闭') },
            ]),
          ],
        ),
        rows(
          'pipelineSteps',
          l('Келесі әрекеттер мен мерзімдер', 'Следующие действия и сроки', 'Next actions and deadlines', '后续行动与期限'),
          { singular: l('Қадам', 'Шаг', 'Step', '步骤'), plural: l('Қадамдар', 'Шаги', 'Steps', '步骤') },
          [
            { name: 'nextAction', type: 'text' },
            { name: 'dueDate', type: 'date' },
            { name: 'completedAt', type: 'date' },
            { name: 'responsible', type: 'relationship', relationTo: 'admins' },
          ],
        ),
      ],
    },
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
