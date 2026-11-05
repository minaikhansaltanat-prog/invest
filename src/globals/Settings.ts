import type { GlobalConfig } from 'payload'

import { checkbox, group, ltext, ltextarea, select, text } from '@/fields/helpers'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

// Реквизиттер, байланыс, саясат (ТТ 2, 6: қызметтік жол, header, footer деректері).
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: l('Баптаулар', 'Настройки', 'Settings', '设置'),
  admin: { group: adminGroups.system },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Реквизиттер', 'Реквизиты', 'Requisites', '登记信息'),
          fields: [
            ltext('legalName', l('Ресми атауы', 'Официальное название', 'Official name', '正式名称'), { required: true }),
            ltext('brandName', l('Қысқа атауы (logo жанында)', 'Краткое название (у логотипа)', 'Brand name (beside the logo)', '简称（标志旁）'), { required: true }),
            ltext('brandSubtitle', l('Ағылшынша қосымша атау', 'Англоязычное название', 'English subtitle', '英文副标题')),
            ltext('tagline', l('Ұран', 'Девиз', 'Tagline', '口号')),
            text('bin', l('БСН', 'БИН', 'BIN', '企业识别号（БСН）'), { required: true }),
            text('registeredOn', l('Алғашқы тіркелген күні', 'Дата первичной регистрации', 'First registered on', '首次登记日期'), {
              admin: { description: l('2017-01-17', '2017-01-17', '2017-01-17', '2017-01-17') },
            }),
          ],
        },
        {
          label: l('Байланыс', 'Контакты', 'Contacts', '联系方式'),
          fields: [
            ltext('citiesLine', l('Қалалар (қызметтік жол)', 'Города (служебная строка)', 'Cities (utility bar)', '城市（顶部栏）')),
            ltextarea('legalAddress', l('Заңды мекенжай', 'Юридический адрес', 'Legal address', '注册地址')),
            ltextarea('officeAddress', l('Кеңсе мекенжайы', 'Адрес офиса', 'Office address', '办公地址')),
            text('phone', l('Телефон', 'Телефон', 'Phone', '电话'), { required: true }),
            text('wechatId', l('WeChat', 'WeChat', 'WeChat', '微信')),
            {
              name: 'wechatQr',
              type: 'upload',
              relationTo: 'media',
              label: l('WeChat QR', 'WeChat QR', 'WeChat QR', '微信二维码'),
            },
            text('email', l('Пошта', 'Почта', 'Email', '邮箱'), {
              admin: {
                description: l(
                  'Корпоративтік домен ашылғанша бос қалдырыңыз.',
                  'Оставьте пустым до открытия корпоративного домена.',
                  'Leave empty until the corporate domain is ready.',
                  '企业域名启用前请留空。',
                ),
              },
            }),
            ltext('workingHours', l('Жұмыс уақыты', 'Часы работы', 'Working hours', '工作时间')),
          ],
        },
        {
          label: l('Мәтіндер', 'Тексты', 'Texts', '文本'),
          fields: [
            ltextarea('disclaimer', l('Жауапкершілікті шектеу (футер)', 'Ограничение ответственности (футер)', 'Disclaimer (footer)', '免责声明（页脚）'), {
              required: true,
            }),
          ],
        },
        {
          label: l('Саясат', 'Политика', 'Policy', '策略'),
          fields: [
            group(
              'policy',
              l('Аударма саясаты', 'Политика переводов', 'Translation policy', '翻译策略'),
              [
                select(
                  'translationPolicy',
                  l('Көрсетілетін аударма', 'Показываемые переводы', 'Shown translations', '显示的翻译'),
                  [
                    {
                      value: 'allow-draft',
                      label: l(
                        'Жобаламаны да көрсету (іске қосуға дейін)',
                        'Показывать и черновики (до запуска)',
                        'Show drafts too (before launch)',
                        '同时显示草稿（上线前）',
                      ),
                    },
                    {
                      value: 'approved-only',
                      label: l(
                        'Тек бекітілген аударма (іске қосқанда)',
                        'Только утверждённые переводы (при запуске)',
                        'Approved translations only (at launch)',
                        '仅显示已批准的翻译（上线时）',
                      ),
                    },
                  ],
                  { defaultValue: 'allow-draft', required: true },
                ),
                checkbox(
                  'showExampleBadges',
                  l('«Мысал ретінде көрсетілген» белгісін көрсету', 'Показывать пометку «Показано как пример»', 'Show the "Shown as an example" label', '显示“示例”标记'),
                  { defaultValue: true },
                ),
              ],
              {},
            ),
          ],
        },
      ],
    },
  ],
}
