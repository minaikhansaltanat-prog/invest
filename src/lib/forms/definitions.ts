import { z } from 'zod'

import { locales } from '@/i18n/config'
import { type L4, l } from '@/lib/labels'
import { projectModels, regions, sectors } from '@/lib/taxonomy'

// Формалар сипаттамасы (ТТ 8.1, 9, 18.2 6-кезең): бір дереккөз. Сервер де, браузер де осы сипаттамадан Zod схемасын құрады,
// интерфейс өрістерді осыдан салады. Қате «код» ретінде қайтады (required, email, ...), мәтінді интерфейс 4 тілде көрсетеді.

export type FormKind = 'contact' | 'investor' | 'project' | 'membership'
export const formKinds: readonly FormKind[] = ['contact', 'investor', 'project', 'membership']

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox'
export type FieldOption = { value: string; label: L4 }

export type FieldSpec = {
  name: string
  type: FieldType
  label: L4
  hint?: L4
  required?: boolean
  options?: readonly FieldOption[]
  minLength?: number
  maxLength?: number
  /** number өрісінің ең кіші мәні */
  min?: number
  autoComplete?: string
}

export type StepSpec = { id: string; title: L4; fields: FieldSpec[] }
export type FormSpec = { kind: FormKind; title: L4; steps: StepSpec[] }

export type FieldErrorCode = 'required' | 'email' | 'url' | 'number' | 'tooShort' | 'tooLong' | 'range' | 'invalid'

const opt = (value: string, kk: string, ru: string, en: string, zh: string): FieldOption => ({ value, label: l(kk, ru, en, zh) })
const fromTaxonomy = (items: readonly { value: string; label: L4 }[]): FieldOption[] => items.map(({ value, label }) => ({ value, label }))

const languageOptions = [
  opt('kk', 'Қазақша', 'Қазақша', 'Қазақша', 'Қазақша'),
  opt('ru', 'Русский', 'Русский', 'Русский', 'Русский'),
  opt('en', 'English', 'English', 'English', 'English'),
  opt('zh', '中文', '中文', '中文', '中文'),
]

const contactStep = (extra: FieldSpec[] = []): StepSpec => ({
  id: 'contact',
  title: l('Байланыс', 'Контакты', 'Contact', '联系方式'),
  fields: [
    { name: 'contactName', type: 'text', required: true, maxLength: 120, autoComplete: 'name', label: l('Байланыс тұлғасының аты-жөні', 'ФИО контактного лица', 'Contact person full name', '联系人姓名') },
    ...extra,
    { name: 'email', type: 'email', required: true, maxLength: 160, autoComplete: 'email', label: l('Электрондық пошта', 'Электронная почта', 'Email', '电子邮箱') },
    { name: 'phone', type: 'tel', maxLength: 40, autoComplete: 'tel', label: l('Телефон', 'Телефон', 'Phone', '电话') },
    { name: 'contactLanguage', type: 'select', required: true, options: languageOptions, label: l('Байланыс тілі', 'Язык общения', 'Contact language', '沟通语言') },
  ],
})

export const contactForm: FormSpec = {
  kind: 'contact',
  title: l('Хабарласу', 'Связаться с нами', 'Contact us', '联系我们'),
  steps: [
    {
      id: 'message',
      title: l('Хабарлама', 'Сообщение', 'Message', '留言'),
      fields: [
        { name: 'contactName', type: 'text', required: true, maxLength: 120, autoComplete: 'name', label: l('Аты-жөні', 'ФИО', 'Full name', '姓名') },
        { name: 'email', type: 'email', required: true, maxLength: 160, autoComplete: 'email', label: l('Электрондық пошта', 'Электронная почта', 'Email', '电子邮箱') },
        { name: 'phone', type: 'tel', maxLength: 40, autoComplete: 'tel', label: l('Телефон', 'Телефон', 'Phone', '电话') },
        {
          name: 'topic',
          type: 'select',
          required: true,
          label: l('Тақырып', 'Тема обращения', 'Topic', '咨询主题'),
          options: [
            opt('investor', 'Инвестор ретінде', 'Как инвестор', 'As an investor', '投资者咨询'),
            opt('project', 'Жоба иесі ретінде', 'Как владелец проекта', 'As a project owner', '项目方咨询'),
            opt('membership', 'Мүшелік', 'Членство', 'Membership', '会员事宜'),
            opt('media', 'БАҚ және іс-шаралар', 'СМИ и мероприятия', 'Media and events', '媒体与活动'),
            opt('other', 'Басқа', 'Другое', 'Other', '其他'),
          ],
        },
        { name: 'message', type: 'textarea', required: true, minLength: 10, maxLength: 3000, label: l('Хабарлама', 'Сообщение', 'Message', '留言内容') },
      ],
    },
  ],
}

export const investorForm: FormSpec = {
  kind: 'investor',
  title: l('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
  steps: [
    {
      id: 'company',
      title: l('Компания', 'Компания', 'Company', '公司'),
      fields: [
        { name: 'companyName', type: 'text', required: true, maxLength: 200, autoComplete: 'organization', label: l('Компания атауы', 'Название компании', 'Company name', '公司名称') },
        { name: 'country', type: 'text', required: true, maxLength: 80, autoComplete: 'country-name', label: l('Тіркеу елі', 'Страна регистрации', 'Country of registration', '注册国家') },
        { name: 'registrationNumber', type: 'text', required: true, maxLength: 80, label: l('Тіркеу нөмірі', 'Регистрационный номер', 'Registration number', '注册号') },
        { name: 'website', type: 'url', maxLength: 200, autoComplete: 'url', label: l('Сайт', 'Сайт', 'Website', '网站') },
        {
          name: 'beneficiary',
          type: 'text',
          required: true,
          maxLength: 200,
          label: l('Нақты бенефициар', 'Конечный бенефициар', 'Ultimate beneficial owner', '最终受益人'),
          hint: l('Аты-жөні немесе меншік құрылымы. Құжаттар алғашқы тексеруден кейін сұралады.', 'ФИО или структура владения. Документы запрашиваются после первичной проверки.', 'Full name or ownership structure. Documents are requested after the initial screening.', '姓名或股权结构。文件将在初步审核后索取。'),
        },
        { name: 'representativeName', type: 'text', required: true, maxLength: 120, label: l('Өкілетті өкіл', 'Уполномоченный представитель', 'Authorised representative', '授权代表') },
      ],
    },
    {
      id: 'interests',
      title: l('Қызығушылық', 'Интересы', 'Interests', '投资意向'),
      fields: [
        { name: 'sectors', type: 'multiselect', required: true, options: fromTaxonomy(sectors), label: l('Қызығатын салалар', 'Интересующие отрасли', 'Sectors of interest', '关注行业') },
        { name: 'regions', type: 'multiselect', options: fromTaxonomy(regions), label: l('Қызығатын өңірлер', 'Интересующие регионы', 'Regions of interest', '关注地区') },
        { name: 'amountMinMusd', type: 'number', min: 0, label: l('Көлемі: бастап, млн $', 'Объем: от, млн $', 'Size: from, USD million', '规模：起，百万美元') },
        { name: 'amountMaxMusd', type: 'number', min: 0, label: l('Көлемі: дейін, млн $', 'Объем: до, млн $', 'Size: up to, USD million', '规模：至，百万美元') },
        { name: 'models', type: 'multiselect', options: fromTaxonomy(projectModels), label: l('Қатысу моделі', 'Модель участия', 'Participation model', '参与模式') },
        {
          name: 'decisionTimeline',
          type: 'select',
          required: true,
          label: l('Шешім қабылдау мерзімі', 'Срок принятия решения', 'Decision timeline', '决策周期'),
          options: [
            opt('lt3', '3 айға дейін', 'До 3 месяцев', 'Up to 3 months', '3个月以内'),
            opt('m3-6', '3-6 ай', '3-6 месяцев', '3-6 months', '3至6个月'),
            opt('m6-12', '6-12 ай', '6-12 месяцев', '6-12 months', '6至12个月'),
            opt('gt12', '12 айдан көп', 'Более 12 месяцев', 'More than 12 months', '超过12个月'),
          ],
        },
        { name: 'experience', type: 'textarea', required: true, minLength: 20, maxLength: 2000, label: l('Салалық тәжірибе', 'Отраслевой опыт', 'Industry experience', '行业经验') },
        {
          name: 'financialNote',
          type: 'textarea',
          maxLength: 2000,
          label: l('Қаржылық әлеует туралы', 'О финансовом потенциале', 'Financial capacity', '资金实力说明'),
          hint: l('Міндетті емес, бірақ бағаға әсер етеді. Құжаттарды кабинет арқылы жүктейсіз.', 'Необязательно, но влияет на оценку. Документы загружаются через кабинет.', 'Optional, but it affects the assessment. Documents are uploaded through the cabinet.', '选填，但会影响评估。文件通过个人中心上传。'),
        },
      ],
    },
    contactStep(),
  ],
}

export const projectForm: FormSpec = {
  kind: 'project',
  title: l('Жоба ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
  steps: [
    {
      id: 'owner',
      title: l('Жоба иесі', 'Владелец', 'Owner', '项目方'),
      fields: [
        { name: 'organizationName', type: 'text', required: true, maxLength: 200, autoComplete: 'organization', label: l('Ұйым атауы', 'Название организации', 'Organisation name', '机构名称') },
        { name: 'bin', type: 'text', required: true, maxLength: 40, label: l('БСН немесе тіркеу нөмірі', 'БИН или регистрационный номер', 'BIN or registration number', 'BIN或注册号') },
        { name: 'ownerName', type: 'text', required: true, maxLength: 120, label: l('Басшы немесе иесі', 'Руководитель или владелец', 'Head or owner', '负责人或所有人') },
      ],
    },
    {
      id: 'project',
      title: l('Жоба', 'Проект', 'Project', '项目'),
      fields: [
        { name: 'projectTitle', type: 'text', required: true, maxLength: 200, label: l('Жоба атауы', 'Название проекта', 'Project title', '项目名称') },
        { name: 'sector', type: 'select', required: true, options: fromTaxonomy(sectors), label: l('Сала', 'Отрасль', 'Sector', '行业') },
        { name: 'region', type: 'select', required: true, options: fromTaxonomy(regions), label: l('Өңір', 'Регион', 'Region', '地区') },
        { name: 'location', type: 'text', required: true, maxLength: 200, label: l('Орналасу орны', 'Место реализации', 'Location', '项目地点') },
        { name: 'amountMusd', type: 'number', required: true, min: 0, label: l('Болжамды көлем, млн $', 'Ориентировочный объем, млн $', 'Estimated size, USD million', '预计规模，百万美元') },
        { name: 'model', type: 'select', required: true, options: fromTaxonomy(projectModels), label: l('Қаржыландыру моделі', 'Модель финансирования', 'Financing model', '融资模式') },
        {
          name: 'landStatus',
          type: 'select',
          required: true,
          label: l('Жер мәртебесі', 'Статус земли', 'Land status', '土地状态'),
          options: [
            opt('owned', 'Меншікті', 'В собственности', 'Owned', '自有'),
            opt('leased', 'Жалға алынған', 'В аренде', 'Leased', '租赁'),
            opt('allocated', 'Бөлу күтілуде', 'Выделение ожидается', 'Allocation pending', '待划拨'),
            opt('none', 'Әзірге жоқ', 'Пока нет', 'Not yet', '暂无'),
          ],
        },
        { name: 'purpose', type: 'textarea', required: true, minLength: 20, maxLength: 1500, label: l('Мақсаты', 'Цель проекта', 'Project purpose', '项目目标') },
        { name: 'summary', type: 'textarea', required: true, minLength: 30, maxLength: 3000, label: l('Қысқаша сипаттама', 'Краткое описание', 'Short description', '项目简介') },
      ],
    },
    contactStep(),
  ],
}

export const membershipForm: FormSpec = {
  kind: 'membership',
  title: l('Мүшелікке өтініш', 'Заявка на членство', 'Membership application', '入会申请'),
  steps: [
    {
      id: 'organization',
      title: l('Ұйым', 'Организация', 'Organisation', '机构'),
      fields: [
        { name: 'organizationName', type: 'text', required: true, maxLength: 200, autoComplete: 'organization', label: l('Ұйым атауы', 'Название организации', 'Organisation name', '机构名称') },
        { name: 'bin', type: 'text', required: true, maxLength: 40, label: l('БСН немесе тіркеу нөмірі', 'БИН или регистрационный номер', 'BIN or registration number', 'BIN或注册号') },
        { name: 'country', type: 'text', required: true, maxLength: 80, autoComplete: 'country-name', label: l('Тіркеу елі', 'Страна регистрации', 'Country of registration', '注册国家') },
        { name: 'website', type: 'url', maxLength: 200, autoComplete: 'url', label: l('Сайт', 'Сайт', 'Website', '网站') },
        {
          name: 'category',
          type: 'select',
          required: true,
          label: l('Мүшелік санаты', 'Категория членства', 'Membership category', '会员类别'),
          options: [
            opt('foreign-investors', 'Шетелдік инвестор компаниялар', 'Иностранные инвесторские компании', 'Foreign investor companies', '外国投资企业'),
            opt('institutions', 'Халықаралық инвестициялық институттар', 'Международные инвестиционные институты', 'International investment institutions', '国际投资机构'),
            opt('industrial', 'Отандық өнеркәсіп компаниялары', 'Отечественные промышленные компании', 'Domestic industrial companies', '本土工业企业'),
            opt('professional', 'Кәсіби қызмет көрсетушілер', 'Поставщики профессиональных услуг', 'Professional service providers', '专业服务机构'),
            opt('strategic', 'Стратегиялық серіктестер', 'Стратегические партнёры', 'Strategic partners', '战略合作伙伴'),
          ],
        },
      ],
    },
    contactStep([
      { name: 'position', type: 'text', maxLength: 120, autoComplete: 'organization-title', label: l('Лауазымы', 'Должность', 'Position', '职位') },
    ]),
    {
      id: 'registry',
      title: l('Тізілім', 'Реестр', 'Registry', '名录'),
      fields: [
        {
          name: 'registryConsent',
          type: 'checkbox',
          label: l(
            'Ұйымымды мүшелер тізілімінде көрсетуге келісемін',
            'Согласен на отображение организации в реестре членов',
            'I agree to list the organisation in the public members registry',
            '同意在会员名录中公开展示本机构',
          ),
        },
      ],
    },
  ],
}

export const formSpecs: Record<FormKind, FormSpec> = {
  contact: contactForm,
  investor: investorForm,
  project: projectForm,
  membership: membershipForm,
}

// ---------- Zod ----------

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const urlPattern = /^https?:\/\/[^\s]+\.[^\s]+$/i

function fieldSchema(field: FieldSpec): z.ZodType<unknown> {
  const required = Boolean(field.required)
  switch (field.type) {
    case 'checkbox':
      return required ? z.literal(true, { error: 'required' }) : z.boolean().optional()
    case 'multiselect': {
      const allowed = new Set((field.options ?? []).map((option) => option.value))
      const base = z.array(z.string()).refine((values) => values.every((value) => allowed.has(value)), { error: 'invalid' })
      return required ? base.refine((values) => values.length > 0, { error: 'required' }) : base.optional()
    }
    case 'select': {
      const allowed = new Set((field.options ?? []).map((option) => option.value))
      const base = z.string().refine((value) => allowed.has(value), { error: required ? 'required' : 'invalid' })
      return required ? base : z.union([z.literal(''), base]).optional()
    }
    case 'number': {
      const min = field.min ?? 0
      const base = z
        .string()
        .trim()
        .refine((value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= min), { error: 'number' })
      return required ? base.refine((value) => value !== '', { error: 'required' }) : base.optional()
    }
    case 'email':
      return z.string().trim().min(1, { error: 'required' }).max(field.maxLength ?? 160, { error: 'tooLong' }).regex(emailPattern, { error: 'email' })
    case 'url': {
      const base = z
        .string()
        .trim()
        .max(field.maxLength ?? 200, { error: 'tooLong' })
        .refine((value) => value === '' || urlPattern.test(value), { error: 'url' })
      return required ? base.refine((value) => value !== '', { error: 'required' }) : base.optional()
    }
    default: {
      let base = z.string().trim().max(field.maxLength ?? 300, { error: 'tooLong' })
      if (field.minLength) {
        const min = field.minLength
        base = base.refine((value) => value === '' || value.length >= min, { error: 'tooShort' })
      }
      return required ? base.refine((value) => value !== '', { error: 'required' }) : base.optional()
    }
  }
}

export const fieldsOf = (spec: FormSpec): FieldSpec[] => spec.steps.flatMap((step) => step.fields)

/** Форма деректерінің схемасы (consent, altcha, locale қосылмаған: оларды сервер бөлек тексереді) */
export function dataSchema(spec: FormSpec) {
  const shape = Object.fromEntries(fieldsOf(spec).map((field) => [field.name, fieldSchema(field)]))
  return z.object(shape).superRefine((data, ctx) => {
    const record = data as Record<string, unknown>
    const min = Number(record.amountMinMusd)
    const max = Number(record.amountMaxMusd)
    if (record.amountMinMusd && record.amountMaxMusd && Number.isFinite(min) && Number.isFinite(max) && min > max) {
      ctx.addIssue({ code: 'custom', path: ['amountMaxMusd'], message: 'range' })
    }
  })
}

/** Сервердің толық сұрау схемасы */
export function submissionSchema(spec: FormSpec) {
  return z.object({
    data: dataSchema(spec),
    consent: z.literal(true, { error: 'required' }),
    altcha: z.string().min(1, { error: 'required' }),
    locale: z.enum(locales),
    // honeypot: адам бос қалдырады, бот толтырады
    hp: z.string().max(0).optional(),
  })
}

/** Zod қателерін өріс атына байланыстырады: әр өріске алғашқы код */
export function fieldErrors(error: z.ZodError): Record<string, FieldErrorCode> {
  const out: Record<string, FieldErrorCode> = {}
  for (const issue of error.issues) {
    const key = issue.path.filter((part) => part !== 'data').join('.') || '_'
    if (!(key in out)) {
      const code = issue.message as FieldErrorCode
      out[key] = ['required', 'email', 'url', 'number', 'tooShort', 'tooLong', 'range', 'invalid'].includes(code) ? code : 'invalid'
    }
  }
  return out
}

export const isFormKind = (value: string): value is FormKind => (formKinds as readonly string[]).includes(value)
