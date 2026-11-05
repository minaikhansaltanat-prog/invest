import { t } from '../lib'
import type { SeedPage } from './types'

// Топ C: Нәтижелер, Серіктестер, Медиа, Байланыс, Тұлғалар, Құжаттар, Жылдық есептер (ТТ 5, 7.1, 7.6-7.9, 17.1).
// Түнгі аударма жобасы: ана тілді тілші тексеруі қажет. Нақты дерек (жұмыс уақыты, пошта, БАҚ-пен байланыс тұлғасы,
// серіктес пен өкіл аттары, ресми статистика) ТТ-да жоқ, сондықтан ол жерде мәтін бейтарап жазылған.

// Реквизиттер ТТ 2 және content/seed/data.ts (settingsSeed) бойынша бір рет жазылып, бірнеше бетте қайта қолданылады.
const legalAddress = t(
  'Астана қ., Нұра ауданы, Әнет баба көшесі, 11/3 ғимарат, 7 т.е.б., 010000',
  'г. Астана, район Нура, ул. Анет баба, здание 11/3, н.п. 7, 010000',
  'Astana, Nura district, Anet Baba St., building 11/3, premises 7, 010000',
  '阿斯塔纳市努拉区阿内特巴巴街11/3号楼7号房，010000',
)

const officeAddress = t(
  'Алматы қ., Жамбыл көшесі, 150',
  'г. Алматы, ул. Жамбыла, 150',
  'Almaty, Zhambyl St., 150',
  '阿拉木图市江布尔街150号',
)

export const pagesC: SeedPage[] = [
  // 1. Нәтижелер
  {
    path: '/results',
    section: 'results',
    title: t('Нәтижелер', 'Результаты', 'Results', '成果'),
    description: t(
      'Қауымдастықтың нәтижесі төрт деңгей мен төрт бөлек сома бойынша көрсетіледі, әдістемесі ашық жарияланады.',
      'Результаты ассоциации показаны по четырем уровням и четырем раздельным суммам, а методика опубликована открыто.',
      'Results are reported across four levels and four separate sums, and the methodology is published openly.',
      '协会成果按四个层级和四类独立金额披露，方法论公开发布。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Қауымдастықтың беделі өткізілген іс-шаралар санымен емес, тексерілген инвесторлармен, нақты жобалармен және құжатпен расталған инвестициямен өлшенеді. Сондықтан нәтиже осы бетте төрт деңгей бойынша және төрт бөлек сомамен көрсетіледі.\n\nӘр көрсеткіштің анықтамасы, жаңарту жиілігі және есептеу шектері әдістемеде жарияланады. Сандар тек расталған жазбалардан есептеледі, ал бастапқы кезеңде олар «мақсатты көрсеткіш» деп белгіленеді.',
          'Репутация ассоциации измеряется не числом проведенных мероприятий, а проверенными инвесторами, реальными проектами и инвестициями, подтвержденными документами. Поэтому результат на этой странице показан по четырем уровням и четырем раздельным суммам.\n\nОпределение каждого показателя, периодичность обновления и границы подсчета опубликованы в методике. Цифры рассчитываются только по подтвержденным записям, а на начальном этапе обозначаются как «целевой показатель».',
          'The reputation of the Association is measured not by the number of events held, but by vetted investors, real projects and investment confirmed by documents. For that reason, results on this page are shown across four levels and four separate sums.\n\nThe definition of each indicator, the update frequency and the limits of counting are published in the methodology. Figures are calculated only from confirmed records, and in the initial period they are labelled “target figure”.',
          '协会的声誉不以举办活动的数量衡量，而以经审核的投资者、真实的项目和有文件证明的投资来衡量。因此，本页按四个层级和四类独立金额呈现成果。\n\n每项指标的定义、更新频率和统计范围均在方法论中公布。数据仅依据已确认的记录计算，在起步阶段标注为“目标指标”。',
        ),
      },
      {
        type: 'cards',
        heading: t('Нәтиженің төрт деңгейі', 'Четыре уровня результата', 'Four levels of results', '成果的四个层级'),
        lead: t(
          'Әр деңгей өз көрсеткіштерімен өлшенеді және басқа деңгейлермен араласпайды.',
          'Каждый уровень измеряется собственными показателями и не смешивается с другими.',
          'Each level is measured by its own indicators and is not mixed with the others.',
          '每个层级由各自的指标衡量，互不混淆。',
        ),
        columns: 4,
        items: [
          {
            title: t('Инвесторларды тарту', 'Привлечение инвесторов', 'Attracting investors', '吸引投资者'),
            text: t(
              'Деректер базасына тіркелген әлеуетті инвесторлар және бастапқы тексеруден өткен инвесторлар.',
              'Потенциальные инвесторы, внесенные в базу данных, и инвесторы, прошедшие первичную проверку.',
              'Prospective investors entered in the database and investors that have passed initial screening.',
              '已录入数据库的潜在投资者，以及通过初步审核的投资者。',
            ),
            icon: 'user',
          },
          {
            title: t('Жобаларды дамыту', 'Развитие проектов', 'Developing projects', '推进项目发展'),
            text: t(
              'Жобалар қорына қабылданған және алдын ала бағаланған жобалар, олардың дайындық деңгейі.',
              'Проекты, принятые в пул проектов и предварительно оцененные, а также уровень их готовности.',
              'Projects admitted to the project pool and pre-assessed, together with their readiness levels.',
              '已纳入项目库并完成预评估的项目，及其成熟度等级。',
            ),
            icon: 'layers',
          },
          {
            title: t('Инвестицияны іске асыру', 'Реализация инвестиций', 'Delivering investment', '投资落地'),
            text: t(
              'Ниет құжаттары, ресми шарттар және қаражаттың нақты түсуі. Әр кезең бөлек есепке алынады.',
              'Документы о намерениях, официальные договоры и фактическое поступление средств. Каждый этап учитывается отдельно.',
              'Letters of intent, signed contracts and funds actually received. Each stage is recorded separately.',
              '意向文件、正式合同和资金的实际到位。每个环节单独记录。',
            ),
            icon: 'chart',
          },
          {
            title: t('Экономикалық үлес', 'Экономический вклад', 'Economic contribution', '经济贡献'),
            text: t(
              'Жобаларды іске асыру нәтижесі: нақты инвестиция, қуат, жұмыс орындары, салық және жергілікті сатып алу.',
              'Итоги реализации проектов: фактические инвестиции, мощность, рабочие места, налоги и локальные закупки.',
              'Outcomes of project delivery: actual investment, capacity, jobs, taxes and local procurement.',
              '项目实施成果：实际投资、产能、就业、税收和本地采购。',
            ),
            icon: 'factory',
          },
        ],
      },
      {
        type: 'cards',
        heading: t('Төрт бөлек сома', 'Четыре раздельные суммы', 'Four separate sums', '四类独立金额'),
        lead: t(
          'Төрт сома бір санға қосылмайды: әрқайсысы өз дәлеліне сүйеніп бөлек көрсетіледі.',
          'Четыре суммы не складываются в одну цифру: каждая показывается отдельно и опирается на собственное подтверждение.',
          'The four sums are never added into one figure: each is shown separately and rests on its own evidence.',
          '四类金额永不合并为一个数字：每类单独列示，并以各自的证据为依据。',
        ),
        columns: 2,
        items: [
          {
            title: t('Мәлімделген', 'Заявленная', 'Declared', '申报'),
            text: t(
              'Жоба иесі немесе инвестор мәлімдеген сома. Құжатпен расталмағанша, ол тек мәлімдеме болып қалады.',
              'Сумма, заявленная владельцем проекта или инвестором. Пока она не подтверждена документами, это лишь заявление.',
              'The amount declared by a project owner or an investor. Until documents confirm it, it remains a statement only.',
              '项目方或投资者申报的金额。在有文件证明之前，它仅属于申报性质。',
            ),
            icon: 'info',
          },
          {
            title: t('Ниет құжаты бойынша', 'По документу о намерениях', 'Per letter of intent', '按意向文件'),
            text: t(
              'Ниет хаттамасында немесе терм-шитте көрсетілген сома. Бұл инвестициялық ниет, түскен қаражат емес.',
              'Сумма, указанная в протоколе о намерениях или в терм-шите. Это намерение инвестировать, а не поступившие средства.',
              'The amount stated in a protocol of intent or a term sheet. It records an intention to invest, not funds received.',
              '意向书或条款清单（term sheet）中载明的金额。它体现的是投资意向，而不是已到位的资金。',
            ),
            icon: 'document',
          },
          {
            title: t('Ресми шарт бойынша', 'По официальному договору', 'Per signed contract', '按正式合同'),
            text: t(
              'Тараптар қол қойған ресми шартта көрсетілген сома. Шарттың өзі қаражаттың түскенін білдірмейді.',
              'Сумма, указанная в официальном договоре, подписанном сторонами. Сам договор не означает поступления средств.',
              'The amount stated in a formal contract signed by the parties. A contract in itself does not mean funds have been received.',
              '双方签署的正式合同中载明的金额。合同本身并不意味着资金已经到位。',
            ),
            icon: 'shield',
          },
          {
            title: t('Нақты түскен', 'Фактически поступившая', 'Actually received', '实际到位'),
            text: t(
              'Қаражаттың түскені банк құжатымен немесе аудитпен расталғанда ғана толтырылады. Дәлел файлы міндетті.',
              'Заполняется только тогда, когда поступление средств подтверждено банковским документом или аудитом. Файл-подтверждение обязателен.',
              'Filled in only when receipt of funds is confirmed by a bank document or an audit. A supporting file is mandatory.',
              '仅在资金到位已由银行文件或审计证实时填写。必须附有证明文件。',
            ),
            icon: 'check',
          },
        ],
      },
      {
        type: 'table',
        heading: t(
          'Әдістеме: көрсеткіштердің анықтамасы',
          'Методика: определения показателей',
          'Methodology: definitions of indicators',
          '方法论：指标定义',
        ),
        caption: t(
          'Нәтижелер бетіндегі негізгі көрсеткіштердің анықтамасы',
          'Определения основных показателей на странице результатов',
          'Definitions of the main indicators used on the results page',
          '成果页面所用主要指标的定义',
        ),
        columns: [
          t('Көрсеткіш', 'Показатель', 'Indicator', '指标'),
          t('Анықтамасы', 'Определение', 'Definition', '定义'),
        ],
        rows: [
          [
            t(
              'Тіркелген әлеуетті инвестор',
              'Зарегистрированный потенциальный инвестор',
              'Registered prospective investor',
              '已登记的潜在投资者',
            ),
            t(
              'Өтініш беріп, деректер базасына тіркелген инвестор. Тіркеу тексеруден өткенін білдірмейді.',
              'Инвестор, подавший заявку и внесенный в базу данных. Регистрация не означает, что проверка пройдена.',
              'An investor that has submitted an application and been entered in the database. Registration does not mean that screening has been passed.',
              '已提交申请并录入数据库的投资者。登记并不意味着已通过审核。',
            ),
          ],
          [
            t(
              'Бастапқы тексеруден өткен инвестор',
              'Инвестор, прошедший первичную проверку',
              'Investor that has passed initial screening',
              '通过初步审核的投资者',
            ),
            t(
              'Хатшылық жүргізген бастапқы тексеруден өткен инвестор. Бұл ішкі тексеру нәтижесі, ресми рейтинг немесе кепілдік емес.',
              'Инвестор, прошедший первичную проверку секретариата. Это результат внутренней проверки, а не официальный рейтинг и не гарантия.',
              'An investor that has passed the initial screening carried out by the Secretariat. It is the result of an internal check, not an official rating or a guarantee.',
              '通过秘书处初步审核的投资者。这是内部审核的结果，不是官方评级，也不构成担保。',
            ),
          ],
          [
            t(
              'Алдын ала бағаланған жоба',
              'Предварительно оцененный проект',
              'Pre-assessed project',
              '已预评估的项目',
            ),
            t(
              'Құжаттары, жер мәртебесі және бастапқы тәуекелдері тексерілген жоба. Ол жоба дайындығының 2-деңгейіне сәйкес келеді.',
              'Проект, у которого проверены документы, статус земли и первичные риски. Соответствует 2-му уровню готовности проекта.',
              'A project whose documents, land status and initial risks have been checked. It corresponds to project readiness level 2.',
              '已核查文件、土地状况和初步风险的项目，对应项目成熟度第2级。',
            ),
          ],
          [
            t(
              'Құжатпен расталған инвестиция',
              'Инвестиция, подтвержденная документами',
              'Investment confirmed by documents',
              '有文件证明的投资',
            ),
            t(
              'Қаражаттың түсуі банк құжатымен немесе аудитпен расталған жоба. Ол жоба дайындығының 4-деңгейіне сәйкес келеді. Ниет құжаттары мен шарттар бұл көрсеткішке кірмейді.',
              'Проект, по которому поступление средств подтверждено банковским документом или аудитом. Соответствует 4-му уровню готовности проекта. Документы о намерениях и договоры в этот показатель не входят.',
              'A project for which receipt of funds is confirmed by a bank document or an audit. It corresponds to project readiness level 4. Letters of intent and contracts are not included in this indicator.',
              '资金到位已由银行文件或审计证实的项目，对应项目成熟度第4级。意向文件和合同不计入该指标。',
            ),
          ],
        ],
      },
      {
        type: 'facts',
        heading: t(
          'Жаңарту және есепке алу тәртібі',
          'Порядок обновления и учета',
          'Updates and recording',
          '更新与统计规则',
        ),
        items: [
          {
            label: t('Жаңарту жиілігі', 'Периодичность обновления', 'Update frequency', '更新频率'),
            value: t('Тоқсан сайын', 'Ежеквартально', 'Quarterly', '每季度'),
          },
          {
            label: t('Деректер көзі', 'Источник данных', 'Data source', '数据来源'),
            value: t(
              'Тек расталған жазбалар',
              'Только подтвержденные записи',
              'Confirmed records only',
              '仅限已确认的记录',
            ),
          },
          {
            label: t('Есепті кезең', 'Отчетный период', 'Reporting period', '报告期'),
            value: t(
              'Әр көрсеткіштің жанында кезең мен жаңартылған күні көрсетіледі',
              'Рядом с каждым показателем указываются период и дата обновления',
              'Each indicator shows its period and the date it was last updated',
              '每项指标旁均注明统计期间和更新日期',
            ),
          },
          {
            label: t('Бастапқы кезең', 'Начальный период', 'Initial period', '起步阶段'),
            value: t(
              'Сандар «мақсатты көрсеткіш» деп белгіленеді: олар жоспарланған межені білдіреді, қол жеткізілген нәтижені емес',
              'Цифры обозначаются как «целевой показатель»: это запланированный рубеж, а не достигнутый результат',
              'Figures are labelled “target figure”: they show a planned milestone, not an achieved result',
              '数据标注为“目标指标”：它们代表计划目标，而非已实现的成果',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'caution',
        title: t('Нені есептемейміз', 'Что мы не учитываем', 'What we do not count', '我们不统计的内容'),
        text: t(
          'Мәлімделген сома, ниет құжаты және меморандум нақты инвестиция ретінде есептелмейді. Іс-шаралар мен кездесулердің саны нәтиже болып саналмайды. Дәлел файлы жоқ қаражат «нақты түскен» сомасына енгізілмейді.',
          'Заявленная сумма, документ о намерениях и меморандум не засчитываются как реальные инвестиции. Число мероприятий и встреч не считается результатом. Средства без файла-подтверждения не включаются в «фактически поступившую» сумму.',
          'A declared amount, a letter of intent and a memorandum are not counted as actual investment. The number of events and meetings is not counted as a result. Funds without a supporting file are not included in the “actually received” sum.',
          '申报金额、意向文件和备忘录不计作实际投资。活动和会议的数量不计作成果。没有证明文件的资金不计入“实际到位”金额。',
        ),
      },
    ],
    cta: {
      title: t('Жылдық есептер', 'Годовые отчеты', 'Annual reports', '年度报告'),
      text: t(
        'Бекітілген жылдық есептерде нәтижелер, төрт бөлек сома және әдістеме толық беріледі.',
        'В утвержденных годовых отчетах результаты, четыре раздельные суммы и методика приводятся полностью.',
        'Approved annual reports set out the results, the four separate sums and the methodology in full.',
        '经批准的年度报告将完整列示成果、四类独立金额和方法论。',
      ),
      label: t('Жылдық есептер', 'Годовые отчеты', 'Annual reports', '年度报告'),
      href: '/about/reports',
    },
  },

  // 2. Серіктестер
  {
    path: '/partners',
    section: 'partners',
    title: t('Серіктестер', 'Партнеры', 'Partners', '合作伙伴'),
    description: t(
      'Бетте мемлекеттік, халықаралық және корпоративтік серіктестердің түрлері мен меморандумдар тізілімін жариялау қағидаттары берілген.',
      'На странице описаны виды государственных, международных и корпоративных партнеров и принципы публикации реестра меморандумов.',
      'This page sets out the types of state, international and corporate partner and the principles on which the registry of memoranda is published.',
      '本页介绍政府、国际和企业合作伙伴的类型，以及备忘录登记册的公布原则。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Қауымдастық серіктестікті құжатпен растайды. Бұл бетте серіктестердің түрлері мен меморандумдар тізілімін жариялау қағидаттары көрсетілген.\n\nСеріктестің аты, логотипі және фотосы тек жазбаша келісіммен жарияланады. Қол қойылған құжаты жоқ серіктестік туралы жазылмайды.',
          'Ассоциация подтверждает партнерство документами. На этой странице описаны виды партнеров и принципы публикации реестра меморандумов.\n\nНазвание, логотип и фотографии партнера публикуются только с письменного согласия. О партнерстве, у которого нет подписанного документа, мы не пишем.',
          "The Association confirms partnerships with documents. This page describes the types of partner and the principles on which the registry of memoranda is published.\n\nA partner's name, logo and photographs are published only with written consent. We do not write about a partnership that has no signed document behind it.",
          '协会以文件确认合作关系。本页介绍合作伙伴的类型以及备忘录登记册的公布原则。\n\n合作伙伴的名称、标识和照片须经书面同意后方可发布。没有已签署文件的合作关系，我们不予披露。',
        ),
      },
      {
        type: 'cards',
        heading: t('Серіктестердің түрлері', 'Виды партнеров', 'Types of partner', '合作伙伴类型'),
        columns: 3,
        items: [
          {
            title: t('Мемлекеттік серіктестер', 'Государственные партнеры', 'State partners', '政府合作伙伴'),
            text: t(
              'Инвестор мәселелерін ресми арналар арқылы шешуге қатысатын мемлекеттік органдар мен институттар.',
              'Государственные органы и институты, участвующие в решении вопросов инвесторов по официальным каналам.',
              "State bodies and institutions involved in resolving investors' issues through official channels.",
              '通过正式渠道参与解决投资者诉求的政府机构和相关机构。',
            ),
            icon: 'columns',
          },
          {
            title: t('Халықаралық серіктестер', 'Международные партнеры', 'International partners', '国际合作伙伴'),
            text: t(
              'Шетелдік капиталды Қазақстанға тартуға жәрдемдесетін халықаралық инвестициялық институттар мен ұйымдар.',
              'Международные инвестиционные институты и организации, содействующие привлечению иностранного капитала в Казахстан.',
              'International investment institutions and organisations that help bring foreign capital to Kazakhstan.',
              '协助外国资本进入哈萨克斯坦的国际投资机构和组织。',
            ),
            icon: 'globe',
          },
          {
            title: t('Корпоративтік серіктестер', 'Корпоративные партнеры', 'Corporate partners', '企业合作伙伴'),
            text: t(
              'Жобаларды іске асыруға, сондай-ақ инвесторларға тіркеу, құқық, салық және логистика мәселелері бойынша қолдау көрсетуге қатысатын компаниялар.',
              'Компании, участвующие в реализации проектов и в сопровождении инвесторов по вопросам регистрации, права, налогов и логистики.',
              'Companies that take part in delivering projects and in supporting investors on registration, legal, tax and logistics matters.',
              '参与项目实施，并在注册、法律、税务和物流方面为投资者提供支持的企业。',
            ),
            icon: 'factory',
          },
        ],
      },
      {
        type: 'facts',
        heading: t(
          'Меморандумдар тізілімі: не көрсетіледі',
          'Реестр меморандумов: что показывается',
          'Registry of memoranda: what is shown',
          '备忘录登记册：披露内容',
        ),
        items: [
          {
            label: t('Серіктес', 'Партнер', 'Partner', '合作伙伴'),
            value: t(
              'Құжатқа қол қойған тараптың атауы, егер екі жақ жариялауға келіссе',
              'Название стороны, подписавшей документ, если обе стороны согласны на публикацию',
              'The name of the party that signed the document, where both parties agree to publication',
              '签署文件一方的名称（以双方同意公开为前提）',
            ),
          },
          {
            label: t('Құжат түрі', 'Вид документа', 'Type of document', '文件类型'),
            value: t(
              'Құжаттың түрі, мысалы меморандум',
              'Вид документа, например меморандум',
              'The type of document, for example a memorandum',
              '文件的类型，例如备忘录',
            ),
          },
          {
            label: t('Күні', 'Дата', 'Date', '日期'),
            value: t(
              'Құжатқа қол қойылған күн',
              'Дата подписания документа',
              'The date on which the document was signed',
              '文件的签署日期',
            ),
          },
          {
            label: t('Мәртебесі', 'Статус', 'Status', '状态'),
            value: t(
              'Әрекетте немесе аяқталған',
              'Действует или завершен',
              'In force or ended',
              '有效或已结束',
            ),
          },
          {
            label: t('Логотип', 'Логотип', 'Logo', '标识'),
            value: t(
              'Серіктестің жазбаша рұқсаты болғанда ғана қойылады',
              'Размещается только при наличии письменного разрешения партнера',
              "Placed only with the partner's written permission",
              '仅在取得合作伙伴书面许可后展示',
            ),
          },
        ],
      },
      {
        type: 'steps',
        heading: t(
          'Құжат тізілімге қалай енеді',
          'Как документ попадает в реестр',
          'How a document enters the registry',
          '文件如何进入登记册',
        ),
        items: [
          {
            title: t('Құжатқа қол қойылады', 'Документ подписывается', 'The document is signed', '文件完成签署'),
            text: t(
              'Тізілімге енгізу үшін тек тараптар қол қойған құжаттар қарастырылады.',
              'Для включения в реестр рассматриваются только документы, подписанные сторонами.',
              'Only documents signed by the parties are considered for inclusion in the registry.',
              '只有各方已签署的文件才会被考虑纳入登记册。',
            ),
          },
          {
            title: t(
              'Екі жақ жариялауға келіседі',
              'Обе стороны соглашаются на публикацию',
              'Both parties agree to publication',
              '双方同意公布',
            ),
            text: t(
              'Жариялауға екі жақтың келісімі қажет. Келісімсіз құжат жарияланбайды.',
              'Необходимо согласие обеих сторон на публикацию. Без согласия документ не публикуется.',
              'Both parties must consent to publication. Without consent the document is not published.',
              '公布须取得双方同意。未经同意，文件不予公布。',
            ),
          },
          {
            title: t(
              '«Келісім бар» белгісі қойылады',
              'Ставится отметка «согласие есть»',
              'The “consent on file” mark is set',
              '标注“已取得同意”',
            ),
            text: t(
              'Мемлекеттік орган немесе серіктес туралы мәтін «келісім бар» белгісінсіз жарияланмайды.',
              'Текст о государственном органе или партнере не публикуется без отметки «согласие есть».',
              'A text about a government body or a partner is not published without the “consent on file” mark.',
              '涉及政府机构或合作伙伴的内容，未标注“已取得同意”不予发布。',
            ),
          },
          {
            title: t(
              'Құжат тізілімде көрсетіледі',
              'Документ отражается в реестре',
              'The document appears in the registry',
              '文件载入登记册',
            ),
            text: t(
              'Тізілімде серіктес, құжат түрі, күні және мәртебесі (әрекетте немесе аяқталған) беріледі.',
              'В реестре указываются партнер, вид документа, дата и статус (действует или завершен).',
              'The registry shows the partner, the type of document, the date and the status (in force or ended).',
              '登记册载明合作伙伴、文件类型、日期和状态（有效或已结束）。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'legal',
        title: t('Серіктестік мәртебесі', 'Статус партнерства', 'Partnership status', '合作关系的认定'),
        text: t(
          'Мемлекеттік органмен кездесу немесе келіссөз серіктестіктің орнағанын білдірмейді: ол «кездесу өтті» деп жазылады. Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді. Серіктестік инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді.',
          'Встреча или переговоры с государственным органом не означают, что партнерство установлено: о них пишется «встреча состоялась». Ассоциация не является государственным органом и не действует от имени государственных органов. Партнерство не гарантирует инвестиционного дохода, государственного разрешения или льгот.',
          'A meeting or negotiations with a government body do not mean that a partnership has been established: they are recorded as “a meeting took place”. The Association is not a government body and does not act on behalf of government bodies. A partnership does not guarantee investment returns, government permits or incentives.',
          '与政府机构会面或磋商并不意味着已建立合作关系，只表述为“会面已举行”。协会不是政府机构，亦不代表任何政府机构行事。合作关系不构成对投资收益、政府许可或优惠政策的保证。',
        ),
      },
    ],
    cta: {
      title: t(
        'Серіктестік туралы сұрағыңыз бар ма?',
        'Есть вопросы о партнерстве?',
        'Questions about partnership?',
        '关于合作有疑问？',
      ),
      text: t(
        'Қауымдастықпен байланыс бетіндегі деректер арқылы хабарласыңыз.',
        'Свяжитесь с ассоциацией по данным на странице контактов.',
        'Contact the Association using the details on the contacts page.',
        '请通过联系页面所列方式与协会取得联系。',
      ),
      label: t('Байланыс', 'Контакты', 'Contacts', '联系我们'),
      href: '/contacts',
    },
  },

  // 3. Медиа орталығы
  {
    path: '/media',
    section: 'media',
    title: t('Медиа орталығы', 'Медиацентр', 'Media centre', '媒体中心'),
    description: t(
      'Қауымдастықтың жаңалықтары, іс-шаралары, видео мен фотоматериалдары, баспасөз релиздері және аналитикасы бір жерде жиналған.',
      'Новости, мероприятия, видео- и фотоматериалы, пресс-релизы и аналитика ассоциации собраны в одном разделе.',
      'News, events, video and photo materials, press releases and analytics of the Association are gathered in one place.',
      '协会的新闻、活动、视频与图片资料、新闻稿及分析研究集中呈现于此。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Медиа орталығында қауымдастықтың жаңалықтары, іс-шаралар күнтізбесі, видео және фото материалдары, баспасөз релиздері мен аналитикасы жиналған. Әр бөлім жеке бетте ашылады.\n\nМатериалдардағы әр санның дереккөзі мен күні болады. Ниет сомасы «инвестиция тартылды» деп жазылмайды.',
          'В медиацентре собраны новости ассоциации, календарь мероприятий, видео- и фотоматериалы, пресс-релизы и аналитика. Каждый раздел открывается на отдельной странице.\n\nУ каждой цифры в материалах есть источник и дата. Сумма намерений не описывается как «инвестиции привлечены».',
          "The media centre brings together the Association's news, events calendar, video and photo materials, press releases and analytics. Each section opens on its own page.\n\nEvery figure in these materials has a source and a date. An amount stated in a letter of intent is never reported as “investment attracted”.",
          '媒体中心汇集协会的新闻、活动日历、视频与图片资料、新闻稿以及分析研究。各栏目均设独立页面。\n\n材料中的每个数字都注明来源和日期。意向文件金额不会被表述为“已吸引投资”。',
        ),
      },
      {
        type: 'links',
        heading: t(
          'Медиа орталығының бөлімдері',
          'Разделы медиацентра',
          'Media centre sections',
          '媒体中心栏目',
        ),
        items: [
          {
            label: t('Жаңалықтар', 'Новости', 'News', '新闻'),
            href: '/media/news',
            text: t(
              'Қауымдастық жаңалықтары санаттар, тегтер және іздеу бойынша.',
              'Новости ассоциации с фильтрами по категориям и тегам и поиском.',
              'News of the Association, with filters by category and tag, and search.',
              '协会新闻，可按类别、标签筛选并搜索。',
            ),
          },
          {
            label: t('Іс-шаралар күнтізбесі', 'Календарь мероприятий', 'Events calendar', '活动日历'),
            href: '/media/events',
            text: t(
              'Алдағы іс-шаралар, тіркелу формасы және .ics файлы.',
              'Предстоящие мероприятия, форма регистрации и файл .ics.',
              'Upcoming events, a registration form and an .ics file.',
              '即将举行的活动、报名表和.ics文件。',
            ),
          },
          {
            label: t('Видеогалерея', 'Видеогалерея', 'Video gallery', '视频库'),
            href: '/media/video',
            text: t(
              'Санаттар бойынша видеоматериалдар, төрт тілде субтитрмен.',
              'Видеоматериалы по категориям с субтитрами на четырех языках.',
              'Video materials by category, with subtitles in four languages.',
              '按类别整理的视频资料，配有四种语言字幕。',
            ),
          },
          {
            label: t('Фотогалерея', 'Фотогалерея', 'Photo gallery', '图片库'),
            href: '/media/photo',
            text: t(
              'Альбомдар бойынша суреттер, әр суретте автор мен лицензия көрсетіледі.',
              'Снимки по альбомам; у каждого снимка указаны автор и лицензия.',
              'Pictures by album; every picture shows its author and licence.',
              '按相册整理的图片，每张图片均标明作者和授权方式。',
            ),
          },
          {
            label: t('Баспасөз беті', 'Для прессы', 'Press room', '媒体专区'),
            href: '/media/press',
            text: t(
              'Баспасөз релиздері, БАҚ жарияланымдары және медиакит.',
              'Пресс-релизы, публикации в СМИ и медиакит.',
              'Press releases, media coverage and the media kit.',
              '新闻稿、媒体报道和媒体资料包。',
            ),
          },
          {
            label: t('Аналитика мен зерттеулер', 'Аналитика и исследования', 'Analytics and research', '分析与研究'),
            href: '/media/analytics',
            text: t(
              'Салалық шолулар мен зерттеулер.',
              'Отраслевые обзоры и исследования.',
              'Sector reviews and research studies.',
              '行业综述与研究报告。',
            ),
          },
        ],
      },
    ],
    cta: {
      title: t(
        'Журналистерге арналған материалдар',
        'Материалы для журналистов',
        'Materials for journalists',
        '面向记者的资料',
      ),
      text: t(
        'Медиакит, факт-парақ және баспасөз релиздері баспасөз бетінде жарияланады.',
        'Медиакит, фактологическая справка и пресс-релизы публикуются на странице для прессы.',
        'The media kit, the fact sheet and press releases are published on the press room page.',
        '媒体资料包、概况表和新闻稿发布于媒体专区。',
      ),
      label: t('Баспасөз беті', 'Для прессы', 'Press room', '媒体专区'),
      href: '/media/press',
    },
  },

  // 4. Жаңалықтар
  {
    path: '/media/news',
    section: 'media',
    title: t('Жаңалықтар', 'Новости', 'News', '新闻'),
    description: t(
      'Қауымдастық жаңалықтары санаттар мен тегтер бойынша сүзіледі, әр жаңалықтың дереккөзі мен күні көрсетіледі.',
      'Новости ассоциации с фильтрами по категориям и тегам; у каждой новости указаны источник и дата.',
      'News of the Association, filterable by category and tag, with a source and a date given for every item.',
      '协会新闻可按类别和标签筛选，每条新闻均注明来源和日期。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Бұл бөлімде қауымдастықтың стратегиясы, әдістемесі, жобалары, Қытаймен жұмысы және іс-шаралары туралы жаңалықтар жарияланады. Жаңалықтарды санат пен тег бойынша сүзуге, іздеуге және басқалармен бөлісуге болады. Жаңалықта аталған жобалар мен тұлғаларға сілтеме беріледі.',
          'В этом разделе публикуются новости о стратегии, методике, проектах, работе с Китаем и мероприятиях ассоциации. Новости можно фильтровать по категориям и тегам, находить через поиск и делиться ими. В новости даются ссылки на проекты и людей, о которых в ней идет речь.',
          "This section carries news on the Association's strategy, methodology, projects, work with China and events. News can be filtered by category and tag, found through search, and shared. A news item links to the projects and people it mentions.",
          '本栏目发布协会战略、方法论、项目、对华工作及活动方面的新闻。新闻可按类别和标签筛选、搜索并分享。新闻中会提供所涉项目和人物的链接。',
        ),
      },
      {
        type: 'cards',
        heading: t('Редакциялық ережелер', 'Редакционные правила', 'Editorial rules', '编辑规则'),
        columns: 3,
        items: [
          {
            title: t('Дереккөзі мен күні', 'Источник и дата', 'Source and date', '来源与日期'),
            text: t(
              'Әр санның дереккөзі мен күні болады. Дереккөзі жоқ сан жарияланбайды.',
              'У каждой цифры есть источник и дата. Цифра без источника не публикуется.',
              'Every figure has a source and a date. A figure without a source is not published.',
              '每个数字都有来源和日期。没有来源的数字不予发布。',
            ),
            icon: 'document',
          },
          {
            title: t('Ниет сомасы', 'Сумма намерений', 'Letter-of-intent amounts', '意向金额'),
            text: t(
              'Ниет сомасы «инвестиция тартылды» деп жазылмайды. Ол «мәлімделген» немесе «ниет құжаты бойынша» сома деп аталады.',
              'Сумма намерений не описывается как «инвестиции привлечены». Она называется «заявленной» или «суммой по документу о намерениях».',
              'An amount stated in a letter of intent is not described as “investment attracted”. It is called “declared” or “per letter of intent”.',
              '意向金额不得表述为“已吸引投资”，而称为“申报”或“按意向文件”金额。',
            ),
            icon: 'alert',
          },
          {
            title: t(
              'Мемлекеттік органдармен кездесу',
              'Встречи с государственными органами',
              'Meetings with government bodies',
              '与政府机构会面',
            ),
            text: t(
              'Кездесудің мәртебесі дәл көрсетіледі: «кездесу өтті» деген «серіктестік орнады» дегенді білдірмейді.',
              'Статус встречи указывается точно: «встреча состоялась» не означает «партнерство установлено».',
              'The status of a meeting is stated precisely: “a meeting took place” does not mean “a partnership was established”.',
              '会面的性质须准确表述：“会面已举行”不等于“已建立合作关系”。',
            ),
            icon: 'columns',
          },
          {
            title: t(
              'Серіктестің аты мен логотипі',
              'Название и логотип партнера',
              'Partner name and logo',
              '合作伙伴名称与标识',
            ),
            text: t(
              'Серіктестің аты, логотипі және фотосы тек жазбаша келісіммен жарияланады.',
              'Название, логотип и фотографии партнера публикуются только с письменного согласия.',
              "A partner's name, logo and photographs are published only with written consent.",
              '合作伙伴的名称、标识和照片须经书面同意后方可发布。',
            ),
            icon: 'lock',
          },
          {
            title: t('Жариялау жиілігі', 'Периодичность публикаций', 'Publication frequency', '发布频率'),
            text: t(
              'Қауымдастық аптасына кемінде бір жаңалық жариялауды көздейді.',
              'Ассоциация стремится публиковать не менее одной новости в неделю.',
              'The Association aims to publish at least one news item a week.',
              '协会力争每周至少发布一条新闻。',
            ),
            icon: 'calendar',
          },
          {
            title: t('Қытай нұсқасы', 'Китайская версия', 'Chinese version', '中文版'),
            text: t(
              'Қытай нұсқасында Қытайға қатысты жаңалықтар басым орында көрсетіледі.',
              'В китайской версии новости, связанные с Китаем, размещаются в первую очередь.',
              'In the Chinese version, news relating to China is given priority.',
              '在中文版中，与中国相关的新闻优先展示。',
            ),
            icon: 'globe',
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t(
          'Мысал ретінде көрсетілген материалдар',
          'Материалы, показанные как пример',
          'Items shown as examples',
          '示例展示的内容',
        ),
        text: t(
          'Нақты жаңалықтар жарияланғанға дейін бетте мысал ретінде берілген материалдар болуы мүмкін. Олар «Мысал ретінде көрсетілген» белгісімен таңбаланады.',
          'Пока не опубликованы реальные новости, на странице могут присутствовать материалы, показанные как пример. Они помечаются отметкой «Показано как пример».',
          'Until real news items are published, the page may carry items shown as examples. They are marked “Shown as an example”.',
          '在真实新闻发布之前，页面上可能含有示例内容，这些内容会标注“示例展示”。',
        ),
      },
    ],
    cta: {
      title: t('Алдағы іс-шаралар', 'Предстоящие мероприятия', 'Upcoming events', '即将举行的活动'),
      text: t(
        'Іс-шараларға күнтізбе арқылы тіркелуге болады.',
        'На мероприятия можно зарегистрироваться через календарь.',
        'You can register for events through the calendar.',
        '可通过日历报名参加活动。',
      ),
      label: t('Іс-шаралар күнтізбесі', 'Календарь мероприятий', 'Events calendar', '活动日历'),
      href: '/media/events',
    },
  },

  // 5. Іс-шаралар күнтізбесі
  {
    path: '/media/events',
    section: 'media',
    title: t('Іс-шаралар күнтізбесі', 'Календарь мероприятий', 'Events calendar', '活动日历'),
    description: t(
      'Бетте алдағы іс-шаралар күнтізбесі, тіркелу формасы, .ics файлы және өткен іс-шаралардың фото мен видеосы берілген.',
      'На странице представлены календарь предстоящих мероприятий, форма регистрации, файл .ics, а также фото и видео прошедших событий.',
      'This page offers a calendar of upcoming events, a registration form, an .ics file, and photos and video from past events.',
      '本页提供即将举行的活动日历、报名表、.ics文件，以及往期活动的照片和视频。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Күнтізбеде қауымдастықтың алдағы іс-шаралары көрсетіледі. Әр іс-шараға тіркелу формасы бар, ал оның күнін өз күнтізбеңізге .ics файлы арқылы қосуға болады. Іс-шара өткеннен кейін оның фото және видео материалдары тиісті галереяларда жарияланады.',
          'В календаре показаны предстоящие мероприятия ассоциации. Для каждого мероприятия есть форма регистрации, а его дату можно добавить в свой календарь с помощью файла .ics. После мероприятия его фото- и видеоматериалы публикуются в соответствующих галереях.',
          "The calendar lists the Association's upcoming events. Each event has a registration form, and its date can be added to your own calendar using an .ics file. After an event, its photo and video materials are published in the relevant galleries.",
          '日历列出协会即将举办的活动。每项活动均设有报名表，也可通过.ics文件将活动日期添加到您自己的日历。活动结束后，相关照片和视频将发布在对应的图片库和视频库中。',
        ),
      },
      {
        type: 'cards',
        heading: t('Күнтізбенің мүмкіндіктері', 'Возможности календаря', 'What the calendar offers', '日历功能'),
        columns: 3,
        items: [
          {
            title: t('Күнтізбе', 'Календарь', 'Calendar', '日历'),
            text: t(
              'Алдағы іс-шаралар күні бойынша тізіледі.',
              'Предстоящие мероприятия перечислены по датам.',
              'Upcoming events are listed by date.',
              '即将举行的活动按日期排列。',
            ),
            icon: 'calendar',
          },
          {
            title: t('Тіркелу формасы', 'Форма регистрации', 'Registration form', '报名表'),
            text: t(
              'Қатысуға тіркелу үшін форманы толтырыңыз. Дербес деректерді өңдеуге келісім қажет.',
              'Чтобы зарегистрироваться на участие, заполните форму. Требуется согласие на обработку персональных данных.',
              'Complete the form to register to attend. Consent to the processing of personal data is required.',
              '填写报名表即可登记参加。须同意个人数据处理。',
            ),
            icon: 'user',
          },
          {
            title: t('.ics файлы', 'Файл .ics', '.ics file', '.ics文件'),
            text: t(
              'Іс-шара күнін өз күнтізбе қосымшаңызға қосуға болады.',
              'Дату мероприятия можно добавить в собственное приложение-календарь.',
              'The date of an event can be added to your own calendar application.',
              '可将活动日期添加到您自己的日历应用。',
            ),
            icon: 'document',
          },
          {
            title: t('Өткен іс-шара фотосы', 'Фото прошедших мероприятий', 'Photos from past events', '往期活动照片'),
            text: t(
              'Өткен іс-шаралардың суреттері альбомдарға топтастырылып, Фотогалереяда жарияланады.',
              'Снимки прошедших мероприятий группируются в альбомы и публикуются в фотогалерее.',
              'Pictures from past events are grouped into albums and published in the photo gallery.',
              '往期活动的照片按相册归类，发布于图片库。',
            ),
            icon: 'image',
            href: '/media/photo',
          },
          {
            title: t('Өткен іс-шара видеосы', 'Видео прошедших мероприятий', 'Video from past events', '往期活动视频'),
            text: t(
              'Өткен іс-шаралардың видеосы Видеогалереяда жарияланады.',
              'Видео прошедших мероприятий публикуется в видеогалерее.',
              'Video from past events is published in the video gallery.',
              '往期活动的视频发布于视频库。',
            ),
            icon: 'video',
            href: '/media/video',
          },
        ],
      },
      {
        type: 'steps',
        heading: t(
          'Іс-шараға қалай тіркелуге болады',
          'Как зарегистрироваться на мероприятие',
          'How to register for an event',
          '如何报名参加活动',
        ),
        items: [
          {
            title: t('Іс-шараны таңдаңыз', 'Выберите мероприятие', 'Choose an event', '选择活动'),
            text: t(
              'Күнтізбеден қажетті іс-шараны ашып, ақпаратпен танысыңыз.',
              'Откройте нужное мероприятие в календаре и ознакомьтесь с информацией.',
              'Open the event you want in the calendar and read the details.',
              '在日历中打开所需活动，查看相关信息。',
            ),
          },
          {
            title: t('Форманы толтырыңыз', 'Заполните форму', 'Complete the form', '填写报名表'),
            text: t(
              'Тіркелу формасын толтырып, дербес деректерді өңдеуге келісім беріңіз.',
              'Заполните форму регистрации и дайте согласие на обработку персональных данных.',
              'Complete the registration form and give your consent to the processing of personal data.',
              '填写报名表并同意个人数据处理。',
            ),
          },
          {
            title: t(
              'Күнді күнтізбеңізге қосыңыз',
              'Добавьте дату в свой календарь',
              'Add the date to your calendar',
              '将日期加入您的日历',
            ),
            text: t(
              '.ics файлын жүктеп алып, күнді өз күнтізбеңізге қосыңыз.',
              'Скачайте файл .ics и добавьте дату в свой календарь.',
              'Download the .ics file and add the date to your own calendar.',
              '下载.ics文件，将日期添加到您自己的日历。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t(
          'Іс-шаралар туралы жариялау қағидаты',
          'Правила публикаций о мероприятиях',
          'How events are reported',
          '活动报道规则',
        ),
        text: t(
          'Іс-шара туралы мәтінде мемлекеттік органның қатысуы дәл көрсетіледі: «кездесу өтті» деген «серіктестік орнады» дегенді білдірмейді. Серіктестің аты, логотипі және фотосы тек жазбаша келісіммен жарияланады.',
          'В материалах о мероприятиях участие государственного органа указывается точно: «встреча состоялась» не означает «партнерство установлено». Название, логотип и фотографии партнера публикуются только с письменного согласия.',
          "In reports on events, the involvement of a government body is stated precisely: “a meeting took place” does not mean “a partnership was established”. A partner's name, logo and photographs are published only with written consent.",
          '活动报道中会准确表述政府机构的参与情况：“会面已举行”不等于“已建立合作关系”。合作伙伴的名称、标识和照片须经书面同意后方可发布。',
        ),
      },
    ],
    cta: {
      title: t(
        'Іс-шара бойынша сұрағыңыз бар ма?',
        'Есть вопрос по мероприятию?',
        'A question about an event?',
        '对活动有疑问？',
      ),
      text: t(
        'Қауымдастықпен байланыс бетіндегі деректер арқылы хабарласыңыз.',
        'Свяжитесь с ассоциацией по данным на странице контактов.',
        'Contact the Association using the details on the contacts page.',
        '请通过联系页面所列方式与协会取得联系。',
      ),
      label: t('Байланыс', 'Контакты', 'Contacts', '联系我们'),
      href: '/contacts',
    },
  },

  // 6. Видеогалерея
  {
    path: '/media/video',
    section: 'media',
    title: t('Видеогалерея', 'Видеогалерея', 'Video gallery', '视频库'),
    description: t(
      'Қауымдастықтың видеоматериалдары санаттар бойынша жиналған, әр видеоға төрт тілде субтитр дайындалады.',
      'Видеоматериалы ассоциации собраны по категориям, к каждому видео готовятся субтитры на четырех языках.',
      "The Association's video materials are grouped by category, with subtitles prepared in four languages for every video.",
      '协会的视频资料按类别整理，每个视频均制作四种语言的字幕。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Видеогалереяда қауымдастықтың видеоматериалдары санаттар бойынша жинақталады: таныстыру видеолары, іс-шаралардың жазбалары және басқа материалдар. Қажетті санатты сүзгі арқылы таңдауға болады.',
          'В видеогалерее видеоматериалы ассоциации собраны по категориям: презентационные ролики, записи мероприятий и другие материалы. Нужную категорию можно выбрать с помощью фильтра.',
          "The video gallery groups the Association's video materials by category: introductory films, recordings of events and other material. The category you need can be selected with the filter.",
          '视频库按类别整理协会的视频资料，包括介绍短片、活动录像及其他资料。可通过筛选选择所需类别。',
        ),
      },
      {
        type: 'cards',
        heading: t(
          'Видеогалерея қалай жұмыс істейді',
          'Как работает видеогалерея',
          'How the gallery works',
          '视频库如何运作',
        ),
        columns: 3,
        items: [
          {
            title: t('Санаттар', 'Категории', 'Categories', '类别'),
            text: t(
              'Видеолар тақырыбына қарай санаттарға бөлінеді.',
              'Видео разделены на категории по тематике.',
              'Videos are divided into categories by theme.',
              '视频按主题分为不同类别。',
            ),
            icon: 'layers',
          },
          {
            title: t('Субтитрлер', 'Субтитры', 'Subtitles', '字幕'),
            text: t(
              'Әр видеоға қазақ, орыс, ағылшын және қытай тілдерінде субтитр дайындалады.',
              'Для каждого видео готовятся субтитры на казахском, русском, английском и китайском языках.',
              'Subtitles are prepared for every video in Kazakh, Russian, English and Chinese.',
              '每个视频均制作哈萨克语、俄语、英语和中文字幕。',
            ),
            icon: 'eye',
          },
          {
            title: t(
              'Өз серверімізден ойнату',
              'Воспроизведение с нашего сервера',
              'Playback from our own server',
              '自有服务器播放',
            ),
            text: t(
              'Видео қауымдастықтың өз серверінен ойнатылады, ойнату Google немесе YouTube қызметтеріне тәуелді емес.',
              'Видео воспроизводится с собственного сервера ассоциации, воспроизведение не зависит от сервисов Google или YouTube.',
              "Video plays from the Association's own server, and playback does not depend on Google or YouTube services.",
              '视频由协会自有服务器播放，播放不依赖谷歌（Google）或YouTube的服务。',
            ),
            icon: 'video',
          },
        ],
      },
      {
        type: 'table',
        heading: t('Видео қалай жеткізіледі', 'Как доставляется видео', 'How video is delivered', '视频播放方式'),
        caption: t(
          'Тіл нұсқалары бойынша видеоны жеткізу көздері',
          'Источники доставки видео по языковым версиям',
          'Video delivery sources by language version',
          '各语言版本的视频播放来源',
        ),
        columns: [
          t('Тіл нұсқасы', 'Языковая версия', 'Language version', '语言版本'),
          t('Негізгі көз', 'Основной источник', 'Main source', '主要来源'),
          t('Қосымша сілтеме', 'Дополнительная ссылка', 'Additional link', '补充链接'),
        ],
        rows: [
          [
            t(
              'Қазақша, орысша және ағылшынша нұсқалар',
              'Казахская, русская и английская версии',
              'Kazakh, Russian and English versions',
              '哈萨克语、俄语和英语版本',
            ),
            t(
              'Өз серверіміз (HLS немесе MP4)',
              'Собственный сервер (HLS или MP4)',
              'Our own server (HLS or MP4)',
              '自有服务器（HLS或MP4）',
            ),
            t('YouTube сілтемесі', 'Ссылка на YouTube', 'YouTube link', 'YouTube链接'),
          ],
          [
            t('Қытайша нұсқа', 'Китайская версия', 'Chinese version', '中文版本'),
            t(
              'Өз серверіміз (HLS немесе MP4)',
              'Собственный сервер (HLS или MP4)',
              'Our own server (HLS or MP4)',
              '自有服务器（HLS或MP4）',
            ),
            t(
              'Bilibili немесе Youku сілтемесі',
              'Ссылка на Bilibili или Youku',
              'Bilibili or Youku link',
              '哔哩哔哩（Bilibili）或优酷（Youku）链接',
            ),
          ],
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t(
          'Видеодағы серіктестер мен органдар',
          'Партнеры и органы в видеоматериалах',
          'Partners and bodies in video',
          '视频中的合作伙伴与机构',
        ),
        text: t(
          'Видеоларда серіктестің аты, логотипі және фотосы тек жазбаша келісіммен көрсетіледі. Мемлекеттік органмен кездесу «серіктестік орнады» деп сипатталмайды.',
          'В видеоматериалах название, логотип и фотографии партнера показываются только с письменного согласия. Встреча с государственным органом не описывается как «партнерство установлено».',
          "In video, a partner's name, logo and photographs are shown only with written consent. A meeting with a government body is not described as “a partnership was established”.",
          '视频中合作伙伴的名称、标识和照片须经书面同意后方可展示。与政府机构的会面不会被描述为“已建立合作关系”。',
        ),
      },
    ],
    cta: {
      title: t('Фотоматериалдар', 'Фотоматериалы', 'Photo materials', '图片资料'),
      text: t(
        'Фотогалереяда әр суреттің авторы мен лицензиясы көрсетіледі.',
        'В фотогалерее для каждого снимка указаны автор и лицензия.',
        'In the photo gallery, every picture shows its author and licence.',
        '图片库中，每张图片均标明作者和授权方式。',
      ),
      label: t('Фотогалерея', 'Фотогалерея', 'Photo gallery', '图片库'),
      href: '/media/photo',
    },
  },

  // 7. Фотогалерея
  {
    path: '/media/photo',
    section: 'media',
    title: t('Фотогалерея', 'Фотогалерея', 'Photo gallery', '图片库'),
    description: t(
      'Фотогалерея альбомдар бойынша құрастырылған, әр суретте автор мен лицензия көрсетіледі.',
      'Фотогалерея организована по альбомам; для каждого снимка указаны автор и лицензия.',
      'The photo gallery is organised in albums, and every picture shows its author and licence.',
      '图片库按相册编排，每张图片均标明作者和授权方式。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Фотогалереядағы суреттер альбомдарға топтастырылған. Кез келген суретті үлкейтілген көріністе (lightbox) ашып, альбомды парақтап қарауға болады. Әр суретте автор мен лицензия көрсетіледі, сондай-ақ төрт тілде балама мәтін (alt) жазылады.',
          'Снимки в фотогалерее сгруппированы по альбомам. Любой снимок можно открыть в увеличенном виде (lightbox) и листать альбом. Для каждого снимка указываются автор и лицензия, а также пишется альтернативный текст (alt) на четырех языках.',
          'Pictures in the photo gallery are grouped into albums. Any picture can be opened in an enlarged view (lightbox) and the album paged through. Every picture shows its author and licence, and carries alternative text (alt) in four languages.',
          '图片库中的图片按相册归类。任意图片均可在放大视图（lightbox）中打开，并可翻阅整本相册。每张图片都标明作者和授权方式，并配有四种语言的替代文字（alt）。',
        ),
      },
      {
        type: 'cards',
        heading: t(
          'Құқықтық таза суреттер саясаты',
          'Политика правовой чистоты изображений',
          'Policy on legally clean images',
          '图片合法合规政策',
        ),
        lead: t(
          'Жария порталда тек авторлық құқықты бұзбайтын суреттер жарияланады.',
          'На публичном портале размещаются только изображения, не нарушающие авторских прав.',
          'Only images that do not infringe copyright are published on the public portal.',
          '公开门户上仅发布不侵犯著作权的图片。',
        ),
        columns: 3,
        items: [
          {
            title: t('Өз фотосессиямыз', 'Собственная фотосъемка', 'Our own photo shoots', '自有拍摄'),
            text: t(
              'Қауымдастық өзі ұйымдастырған фотосессиялар. Бұл басым жол.',
              'Фотосъемка, организованная самой ассоциацией. Это приоритетный путь.',
              'Photo shoots organised by the Association itself. This is the preferred route.',
              '由协会自行组织的拍摄，这是首选方式。',
            ),
            icon: 'image',
          },
          {
            title: t(
              'Лицензиясы анық сток-суреттер',
              'Стоковые изображения с понятной лицензией',
              'Stock images with a clear licence',
              '授权明确的图库图片',
            ),
            text: t(
              'Пайдалану шарттары нақты көрсетілген тегін немесе ақылы сток-суреттер.',
              'Бесплатные или платные стоковые изображения с четко указанными условиями использования.',
              'Free or paid stock images whose terms of use are clearly stated.',
              '使用条款清晰的免费或付费图库图片。',
            ),
            icon: 'document',
          },
          {
            title: t(
              'Серіктестің жазбаша рұқсаты',
              'Письменное разрешение партнера',
              "A partner's written permission",
              '合作伙伴的书面许可',
            ),
            text: t(
              'Серіктестің суреттері оның жазбаша рұқсаты болғанда ғана жарияланады.',
              'Фотографии партнера публикуются только при наличии его письменного разрешения.',
              "A partner's photographs are published only with its written permission.",
              '合作伙伴的照片仅在取得其书面许可后发布。',
            ),
            icon: 'lock',
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Қандай суреттер жарияланбайды',
          'Какие изображения не публикуются',
          'What is not published',
          '不予发布的图片',
        ),
        text: t(
          'Мына суреттер жарияланбайды:\n\n- агрегатор сайттардан алынған суреттер: олардағы авторлық құқық үшінші тұлғаларға тиесілі;\n- нақты жобаны немесе нақты адамды көрсету үшін жасанды интеллект арқылы жасалған суреттер;\n- сәндеу элементі ретінде қолданылатын мемлекеттік рәміздер мен жалаулар.',
          'Не публикуются:\n\n- изображения с сайтов-агрегаторов: авторские права на них принадлежат третьим лицам;\n- изображения, созданные с помощью искусственного интеллекта, если ими показывают реальный проект или реального человека;\n- государственные символы и флаги, используемые как декор.',
          'The following are not published:\n\n- images taken from aggregator sites, because the copyright in them belongs to third parties;\n- images created with artificial intelligence when they are used to show a real project or a real person;\n- state symbols and flags used as decoration.',
          '以下图片不予发布：\n\n- 取自聚合类网站的图片，因其著作权归第三方所有；\n- 用于展示真实项目或真实人物的人工智能生成图片；\n- 作为装饰元素使用的国家象征和旗帜。',
        ),
      },
      {
        type: 'notice',
        tone: 'info',
        title: t(
          'Суреттерді қайта пайдалану',
          'Повторное использование изображений',
          'Reusing pictures',
          '图片的再利用',
        ),
        text: t(
          'Суретті қайта пайдалану мүмкіндігі әр суретте көрсетілген лицензияға байланысты. Серіктестің аты, логотипі және фотосы тек жазбаша келісіммен жарияланады.',
          'Возможность повторного использования снимка зависит от лицензии, указанной у каждого снимка. Название, логотип и фотографии партнера публикуются только с письменного согласия.',
          "Whether a picture can be reused depends on the licence shown with it. A partner's name, logo and photographs are published only with written consent.",
          '图片能否再次使用取决于其所标注的授权方式。合作伙伴的名称、标识和照片须经书面同意后方可发布。',
        ),
      },
    ],
    cta: {
      title: t(
        'Баспасөз өкілдеріне арналған материалдар',
        'Материалы для представителей прессы',
        'Materials for the press',
        '面向媒体的资料',
      ),
      text: t(
        'Логотиптер, фотосуреттер және факт-парақ медиакитте жарияланады.',
        'Логотипы, фотографии и фактологическая справка публикуются в медиките.',
        'Logos, photographs and the fact sheet are published in the media kit.',
        '标识、照片和概况表发布于媒体资料包。',
      ),
      label: t('Баспасөз беті', 'Для прессы', 'Press room', '媒体专区'),
      href: '/media/press',
    },
  },

  // 8. Баспасөз беті
  {
    path: '/media/press',
    section: 'media',
    title: t('Баспасөз беті', 'Для прессы', 'Press room', '媒体专区'),
    description: t(
      'Баспасөз релиздері, БАҚ жарияланымдары, медиакит және қауымдастық туралы негізгі деректер журналистерге арналған.',
      'Пресс-релизы, публикации в СМИ, медиакит и основные сведения об ассоциации для журналистов.',
      'Press releases, media coverage, the media kit and key facts about the Association for journalists.',
      '面向记者的新闻稿、媒体报道、媒体资料包及协会基本信息。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Бұл бет журналистер мен редакцияларға арналған. Мұнда баспасөз релиздері, БАҚ жарияланымдары және медиакит жиналады. Қауымдастық туралы негізгі деректер төменде факт-парақ түрінде берілген.',
          'Эта страница предназначена для журналистов и редакций. Здесь собраны пресс-релизы, публикации в СМИ и медиакит. Основные сведения об ассоциации приведены ниже в виде фактологической справки.',
          'This page is for journalists and editorial teams. It brings together press releases, media coverage and the media kit. Key facts about the Association are given below as a fact sheet.',
          '本页面向记者和编辑部。这里汇集新闻稿、媒体报道和媒体资料包。协会的基本信息以概况表的形式列于下方。',
        ),
      },
      {
        type: 'cards',
        heading: t('Баспасөз материалдары', 'Материалы для прессы', 'Press materials', '媒体材料'),
        columns: 3,
        items: [
          {
            title: t('Баспасөз релиздері', 'Пресс-релизы', 'Press releases', '新闻稿'),
            text: t(
              'Қауымдастықтың ресми хабарламалары. Релиздегі әр санның дереккөзі мен күні көрсетіледі.',
              'Официальные сообщения ассоциации. У каждой цифры в релизе указаны источник и дата.',
              'Official announcements of the Association. Every figure in a release carries a source and a date.',
              '协会的正式公告。新闻稿中的每个数字均注明来源和日期。',
            ),
            icon: 'document',
          },
          {
            title: t('БАҚ жарияланымдары', 'Публикации в СМИ', 'Media coverage', '媒体报道'),
            text: t(
              'Қауымдастық туралы бұқаралық ақпарат құралдарында шыққан материалдардың тізімі.',
              'Перечень материалов об ассоциации, вышедших в средствах массовой информации.',
              'A list of material about the Association that has appeared in the media.',
              '媒体上发表的有关协会的报道清单。',
            ),
            icon: 'eye',
          },
          {
            title: t('Медиакит', 'Медиакит', 'Media kit', '媒体资料包'),
            text: t(
              'Логотиптер, фотосуреттер және факт-парақ бір жинақта.',
              'Логотипы, фотографии и фактологическая справка в одном комплекте.',
              'Logos, photographs and the fact sheet in one pack.',
              '标识、照片和概况表合为一套资料。',
            ),
            icon: 'layers',
          },
        ],
      },
      {
        type: 'facts',
        heading: t('Факт-парақ', 'Фактологическая справка', 'Fact sheet', '概况表'),
        items: [
          {
            label: t('Ресми атауы', 'Официальное название', 'Official name', '正式名称'),
            value: t(
              '«Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігі',
              'Объединение юридических лиц «Казахстанская ассоциация иностранного капитала»',
              'Kazakhstan Association of Foreign Capital',
              '哈萨克斯坦外国资本协会',
            ),
          },
          {
            label: t('БСН', 'БИН', 'BIN', '企业识别号（BIN）'),
            value: t(
              '170140015381 (2026 жылғы 14 қыркүйектегі қайта тіркеу анықтамасы бойынша)',
              '170140015381 (по справке о перерегистрации от 14 сентября 2026 года)',
              '170140015381 (per the re-registration certificate of 14 September 2026)',
              '170140015381（依据2026年9月14日出具的重新登记证明）',
            ),
          },
          {
            label: t('Заңды мекенжай (Астана)', 'Юридический адрес (Астана)', 'Legal address (Astana)', '注册地址（阿斯塔纳）'),
            value: legalAddress,
          },
          {
            label: t('Кеңсе (Алматы)', 'Офис (Алматы)', 'Office (Almaty)', '办公地址（阿拉木图）'),
            value: officeAddress,
          },
          {
            label: t('Құрылған жылы', 'Год основания', 'Year founded', '成立年份'),
            value: t('2017 жыл', '2017 год', '2017', '2017年'),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t('БАҚ-пен байланыс', 'Контакт для СМИ', 'Media contact', '媒体联络'),
        text: t(
          'БАҚ-пен байланыс тұлғасы бекітілгеннен кейін осы бетте жарияланады. Бұған дейін сұрауларды байланыс бетінде көрсетілген телефон немесе WeChat арқылы жіберуге болады.',
          'Контактное лицо для СМИ будет опубликовано на этой странице после утверждения. До этого запросы можно направлять по телефону или через WeChat, указанным на странице контактов.',
          'The contact person for the media will be published on this page once confirmed. Until then, enquiries can be sent by the telephone number or through the WeChat account shown on the contacts page.',
          '媒体联络人确定后将在本页公布。在此之前，可通过联系页面所列的电话或微信发送咨询。',
        ),
      },
      {
        type: 'notice',
        tone: 'legal',
        title: t('Материалдарды пайдаланғанда', 'При использовании материалов', 'Using the materials', '使用材料时'),
        text: t(
          'Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді. Релиздерде ниет сомасы «инвестиция тартылды» деп жазылмайды: ол «мәлімделген» немесе «ниет құжаты бойынша» сома ретінде беріледі. Серіктестің аты мен логотипі тек жазбаша келісіммен жарияланады.',
          'Ассоциация не является государственным органом и не действует от имени государственных органов. В релизах сумма намерений не описывается как «инвестиции привлечены»: она приводится как «заявленная» или «по документу о намерениях». Название и логотип партнера публикуются только с письменного согласия.',
          "The Association is not a government body and does not act on behalf of government bodies. In releases, an amount stated in a letter of intent is not described as “investment attracted”: it is given as “declared” or “per letter of intent”. A partner's name and logo are published only with written consent.",
          '协会不是政府机构，亦不代表任何政府机构行事。新闻稿中，意向金额不会表述为“已吸引投资”，而是以“申报”或“按意向文件”金额列示。合作伙伴的名称和标识须经书面同意后方可发布。',
        ),
      },
    ],
    cta: {
      title: t('БАҚ сұраулары', 'Запросы СМИ', 'Media enquiries', '媒体咨询'),
      text: t(
        'Сұрауларыңызды байланыс беті арқылы жіберіңіз.',
        'Направляйте запросы через страницу контактов.',
        'Please send your enquiries through the contacts page.',
        '请通过联系页面发送您的咨询。',
      ),
      label: t('Байланыс', 'Контакты', 'Contacts', '联系我们'),
      href: '/contacts',
    },
  },

  // 9. Аналитика мен зерттеулер
  {
    path: '/media/analytics',
    section: 'media',
    title: t('Аналитика мен зерттеулер', 'Аналитика и исследования', 'Analytics and research', '分析与研究'),
    description: t(
      'Салалық шолулар мен зерттеулер қауымдастықтың аналитикалық материалдары ретінде жарияланады.',
      'Отраслевые обзоры и исследования публикуются как аналитические материалы ассоциации.',
      "Sector reviews and research studies are published as the Association's analytical materials.",
      '行业综述和研究报告将作为协会的分析材料发布。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Бұл бөлімде салалық шолулар мен зерттеулер жарияланады. Аналитика шетелдік инвесторларға Қазақстан нарығы мен салаларын бағалауға көмектесуге арналған.\n\nҚауымдастық айына кемінде бір аналитикалық материал шығаруды көздейді. Әр материалдағы әр санның дереккөзі мен күні көрсетіледі.',
          'В этом разделе публикуются отраслевые обзоры и исследования. Аналитика призвана помогать иностранным инвесторам оценивать рынок и отрасли Казахстана.\n\nАссоциация стремится выпускать не менее одного аналитического материала в месяц. В каждом материале у каждой цифры указаны источник и дата.',
          "Sector reviews and research studies are published in this section. The analytics are intended to help foreign investors assess Kazakhstan's market and sectors.\n\nThe Association aims to issue at least one analytical piece a month. In every piece, each figure carries a source and a date.",
          '本栏目发布行业综述和研究报告。分析材料旨在帮助外国投资者评估哈萨克斯坦的市场和各行业。\n\n协会力争每月至少推出一份分析材料。每份材料中的每个数字均注明来源和日期。',
        ),
      },
      {
        type: 'cards',
        heading: t('Материал түрлері', 'Виды материалов', 'Types of material', '材料类型'),
        columns: 3,
        items: [
          {
            title: t('Салалық шолулар', 'Отраслевые обзоры', 'Sector reviews', '行业综述'),
            text: t(
              'Жеке саланың жай-күйі мен инвестициялық мүмкіндіктері туралы қысқаша шолу.',
              'Краткий обзор состояния отдельной отрасли и инвестиционных возможностей в ней.',
              'A concise review of the state of a particular sector and its investment opportunities.',
              '对某一行业现状及其投资机会的简要综述。',
            ),
            icon: 'chart',
          },
          {
            title: t('Зерттеулер', 'Исследования', 'Research studies', '研究报告'),
            text: t(
              'Инвестициялық талдау бағыты бойынша тереңдетілген зерттеулер.',
              'Углубленные исследования по направлению инвестиционного анализа.',
              'In-depth studies in the field of investment analysis.',
              '投资分析方向的深度研究。',
            ),
            icon: 'document',
          },
          {
            title: t('Дереккөзі мен күні', 'Источник и дата', 'Source and date', '来源与日期'),
            text: t(
              'Материалдағы әр санның дереккөзі мен күні болады. Дереккөзі жоқ сан жарияланбайды.',
              'У каждой цифры в материале есть источник и дата. Цифра без источника не публикуется.',
              'Every figure in a piece has a source and a date. A figure without a source is not published.',
              '材料中的每个数字都有来源和日期。没有来源的数字不予发布。',
            ),
            icon: 'check',
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t('Зерттеу бағыттары', 'Направления исследований', 'Research directions', '研究方向'),
        text: t(
          'Зерттеу бағыты бекітілгеннен кейін ғана сол бағыт бойынша материалдар жарияланады. Бағыт бекітілмесе, ол бойынша аналитика жарияланбайды.',
          'Материалы по тому или иному направлению исследований публикуются только после утверждения этого направления. Пока направление не утверждено, аналитика по нему не публикуется.',
          'Material on a research direction is published only once that direction has been approved. Until it is approved, no analysis is published on it.',
          '只有在研究方向获得批准后，才会发布该方向的材料。方向获批之前，不发布与之相关的分析。',
        ),
      },
    ],
    cta: {
      title: t('Нәтижелер мен әдістеме', 'Результаты и методика', 'Results and methodology', '成果与方法论'),
      text: t(
        'Көрсеткіштердің анықтамасы мен төрт бөлек сома нәтижелер бетінде беріледі.',
        'Определения показателей и четыре раздельные суммы приведены на странице результатов.',
        'The definitions of the indicators and the four separate sums are set out on the results page.',
        '指标定义和四类独立金额载于成果页面。',
      ),
      label: t('Нәтижелер', 'Результаты', 'Results', '成果'),
      href: '/results',
    },
  },

  // 10. Байланыс
  {
    path: '/contacts',
    section: 'contacts',
    title: t('Байланыс', 'Контакты', 'Contacts', '联系我们'),
    description: t(
      'Бетте қауымдастықтың Астанадағы заңды мекенжайы, Алматыдағы кеңсесі, телефоны және WeChat арқылы байланыс жолдары берілген.',
      'На странице указаны юридический адрес ассоциации в Астане, офис в Алматы, телефон и способы связи через WeChat.',
      "This page gives the Association's legal address in Astana, its office in Almaty, its telephone number and WeChat contact details.",
      '本页列出协会位于阿斯塔纳的注册地址、位于阿拉木图的办公室、联系电话及微信联系方式。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Қауымдастықтың заңды мекенжайы Астанада, ал жұмыс кеңсесі Алматыда орналасқан. Екі мекенжай бөлек көрсетіледі. Инвестиция, мүшелік, БАҚ және басқа тақырыптар бойынша телефон немесе WeChat арқылы хабарласуға болады.',
          'Юридический адрес ассоциации находится в Астане, а рабочий офис расположен в Алматы. Оба адреса указаны отдельно. По вопросам инвестиций, членства, СМИ и по другим темам можно обратиться по телефону или через WeChat.',
          "The Association's legal address is in Astana and its working office is in Almaty. The two addresses are shown separately. For questions on investment, membership, the media and other topics, you can get in touch by telephone or through WeChat.",
          '协会的注册地址在阿斯塔纳，工作办公室在阿拉木图，两处地址分别列示。如有投资、会员、媒体及其他方面的问题，可通过电话或微信联系。',
        ),
      },
      {
        type: 'facts',
        heading: t(
          'Мекенжайлар мен байланыс деректері',
          'Адреса и контактные данные',
          'Addresses and contact details',
          '地址与联系方式',
        ),
        items: [
          {
            label: t('Заңды мекенжай (Астана)', 'Юридический адрес (Астана)', 'Legal address (Astana)', '注册地址（阿斯塔纳）'),
            value: legalAddress,
          },
          {
            label: t('Кеңсе (Алматы)', 'Офис (Алматы)', 'Office (Almaty)', '办公地址（阿拉木图）'),
            value: officeAddress,
          },
          {
            label: t('Телефон', 'Телефон', 'Telephone', '电话'),
            value: t(
              '+7 700 386 66 32 (қауымдастықтың жалпы нөмірі)',
              '+7 700 386 66 32 (общий номер ассоциации)',
              "+7 700 386 66 32 (the Association's general number)",
              '+7 700 386 66 32（协会总联系电话）',
            ),
          },
          {
            label: t('WeChat мессенджері', 'WeChat', 'WeChat', '微信（WeChat）'),
            value: t(
              'QR код арқылы қосылуға болады',
              'Подключиться можно по QR-коду',
              'You can connect using a QR code',
              '可通过二维码添加',
            ),
          },
          {
            label: t('Жұмыс уақыты', 'Часы работы', 'Working hours', '工作时间'),
            value: t(
              'Бекітілгеннен кейін жарияланады',
              'Будут опубликованы после утверждения',
              'To be published once confirmed',
              '确定后公布',
            ),
          },
        ],
      },
      {
        type: 'cards',
        heading: t('Байланыс тақырыптары', 'Темы обращений', 'Topics of enquiry', '咨询主题'),
        lead: t(
          'Сұрағыңыздың тақырыбын таңдаңыз: тиісті бөлімде қажетті ақпарат бар.',
          'Выберите тему вашего вопроса: в соответствующем разделе есть нужная информация.',
          'Choose the topic of your enquiry: the relevant section holds the information you need.',
          '请选择咨询主题，相应栏目提供所需信息。',
        ),
        columns: 4,
        items: [
          {
            title: t('Инвестиция', 'Инвестиции', 'Investment', '投资'),
            text: t(
              'Инвестор өтініші, жобалар қоры және жобаны ұсыну бойынша сұрақтар.',
              'Вопросы по заявке инвестора, пулу проектов и подаче проекта.',
              'Questions about the investor application, the project pool and submitting a project.',
              '有关投资者申请、项目库和项目提交的问题。',
            ),
            icon: 'globe',
            href: '/investors',
          },
          {
            title: t('Мүшелік', 'Членство', 'Membership', '会员'),
            text: t(
              'Мүшелік санаттары, жарналар және қабылдау рәсімі бойынша сұрақтар.',
              'Вопросы по категориям членства, взносам и процедуре приема.',
              'Questions about membership categories, fees and the admission procedure.',
              '有关会员类别、会费和入会程序的问题。',
            ),
            icon: 'user',
            href: '/membership',
          },
          {
            title: t('БАҚ', 'СМИ', 'Media', '媒体'),
            text: t(
              'Журналистердің сұраулары, медиакит және баспасөз материалдары.',
              'Запросы журналистов, медиакит и материалы для прессы.',
              "Journalists' enquiries, the media kit and press materials.",
              '记者咨询、媒体资料包和新闻材料。',
            ),
            icon: 'document',
            href: '/media/press',
          },
          {
            title: t('Басқа', 'Другое', 'Other', '其他'),
            text: t(
              'Жоғарыда аталған тақырыптарға жатпайтын басқа сұрақтар.',
              'Другие вопросы, не относящиеся к перечисленным темам.',
              'Any other questions that do not fall under the topics above.',
              '不属于上述主题的其他问题。',
            ),
            icon: 'info',
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Өңірлік және шетелдік өкілдер',
          'Региональные и зарубежные представители',
          'Regional and overseas representatives',
          '地区及海外代表',
        ),
        text: t(
          'Өңірлік және шетелдік өкілдердің байланыс деректері олардың өкілеттіктері жаңартылған жарғыға сәйкес бекітілгеннен кейін жарияланады. Деректер әр өкілдің жазбаша келісімімен ғана көрсетіледі.',
          'Контактные данные региональных и зарубежных представителей будут опубликованы после того, как их полномочия будут утверждены в обновленном уставе. Данные приводятся только с письменного согласия представителя.',
          "The contact details of regional and overseas representatives will be published once their powers are confirmed in the updated charter. Details are shown only with the representative's written consent.",
          '地区及海外代表的联系方式将在其职权依据更新后的章程确认后公布，且仅在代表本人书面同意的情况下展示。',
        ),
      },
      {
        type: 'paragraphs',
        heading: t('Карта', 'Карта', 'Map', '地图'),
        text: t(
          'Кеңсенің орналасқан жері 2GIS картасында көрсетіледі. Мекенжай мәтін түрінде де берілген.',
          'Расположение офиса показано на карте 2GIS. Адрес также указан текстом.',
          'The location of the office is shown on a static map image, and the address is also given in text.',
          '办公室位置以静态地图图片显示，同时提供文字地址。',
        ),
      },
      {
        type: 'notice',
        tone: 'info',
        title: t('Кері байланыс формасы', 'Форма обратной связи', 'Feedback form', '反馈表单'),
        text: t(
          'Кері байланыс формасы осы бетке кейін қосылады. Онда тақырыпты таңдауға болады: инвестиция, мүшелік, БАҚ немесе басқа. Ол қосылғанға дейін телефон немесе WeChat арқылы хабарласыңыз.',
          'Форма обратной связи будет добавлена на эту страницу позже. В ней можно будет выбрать тему: инвестиции, членство, СМИ или другое. До этого свяжитесь с нами по телефону или через WeChat.',
          'A feedback form will be added to this page later. It will let you choose a topic: investment, membership, media or other. Until then, please get in touch by telephone or through WeChat.',
          '反馈表单将于稍后添加到本页，可选择咨询主题：投资、会员、媒体或其他。在此之前，请通过电话或微信联系。',
        ),
      },
    ],
    cta: {
      title: t('Инвестор жолын бастаңыз', 'Начните путь инвестора', 'Start the investor pathway', '开启投资者通道'),
      text: t(
        'Инвестор өтінішін толтырып, қауымдастықпен жұмысты бастаңыз.',
        'Заполните заявку инвестора и начните работу с ассоциацией.',
        'Complete the investor application to begin working with the Association.',
        '填写投资者申请，开始与协会合作。',
      ),
      label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
      href: '/investors/apply',
    },
  },

  // 11. Тұлғалар мен команда
  {
    path: '/about/people',
    section: 'about',
    title: t('Тұлғалар мен команда', 'Люди и команда', 'People and team', '人员与团队'),
    description: t(
      'Қауымдастықтың басшылығы, хатшылығы, сарапшылары мен өкілдері таныстырылады, ал профильдер тек жазбаша келісіммен жарияланады.',
      'Руководство, секретариат, эксперты и представители ассоциации; профили публикуются только с письменного согласия.',
      "The Association's leadership, secretariat, experts and representatives; profiles are published only with written consent.",
      '协会的领导层、秘书处、专家和代表；个人简介仅在取得书面同意后发布。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Бұл бетте қауымдастықтың басшылығы, хатшылығы, сарапшылары мен өкілдері таныстырылады. Әр профильде фото, лауазым, жұмыс бағыты, қысқа өмірбаян және тілдер көрсетіледі. Профиль тек тұлғаның жазбаша келісімімен жарияланады.',
          'На этой странице представлены руководство, секретариат, эксперты и представители ассоциации. В каждом профиле указываются фото, должность, направление работы, краткая биография и языки. Профиль публикуется только с письменного согласия человека.',
          "This page introduces the Association's leadership, secretariat, experts and representatives. Each profile shows a photograph, position, area of work, a short biography and languages. A profile is published only with the person's written consent.",
          '本页介绍协会的领导层、秘书处、专家和代表。每份简介包含照片、职务、工作方向、简历概要和使用语言。个人简介仅在本人书面同意后发布。',
        ),
      },
      {
        type: 'cards',
        heading: t('Топтар', 'Группы', 'Groups', '分组'),
        columns: 4,
        items: [
          {
            title: t('Басшылық', 'Руководство', 'Leadership', '领导层'),
            text: t(
              'Президент әрі төраға мен басқару құрылымындағы басқа лауазымды тұлғалар.',
              'Президент и председатель, а также другие должностные лица структуры управления.',
              'The President and Chair, and other office-holders in the governance structure.',
              '会长兼主席，以及治理结构中的其他负责人。',
            ),
            icon: 'columns',
          },
          {
            title: t('Хатшылық', 'Секретариат', 'Secretariat', '秘书处'),
            text: t(
              'Өтініштерді қабылдау, бастапқы тексеру, мүшелермен жұмыс және іс-шараларды ұйымдастыру жөніндегі қызметкерлер.',
              'Сотрудники, которые принимают заявки, проводят первичную проверку, работают с членами и организуют мероприятия.',
              'Staff who receive applications, carry out initial screening, work with members and organise events.',
              '负责受理申请、初步审核、会员事务和活动组织的工作人员。',
            ),
            icon: 'document',
          },
          {
            title: t('Сарапшылар', 'Эксперты', 'Experts', '专家'),
            text: t(
              'Инвесторлар мен жобаларды бағалауға және қорытынды дайындауға қатысатын сарапшылар.',
              'Эксперты, участвующие в оценке инвесторов и проектов и в подготовке заключений.',
              'Experts who take part in assessing investors and projects and in preparing opinions.',
              '参与评估投资者和项目并出具意见的专家。',
            ),
            icon: 'shield-check',
          },
          {
            title: t('Өкілдер', 'Представители', 'Representatives', '代表'),
            text: t(
              'Өз өңірінің жобалары мен инвесторларымен жұмыс істейтін өңірлік және шетелдік өкілдер.',
              'Региональные и зарубежные представители, работающие с проектами и инвесторами своего региона.',
              'Regional and overseas representatives who work with the projects and investors of their region.',
              '负责所在地区项目和投资者事务的地区及海外代表。',
            ),
            icon: 'globe',
          },
        ],
      },
      {
        type: 'facts',
        heading: t('Профиль мазмұны', 'Содержание профиля', 'What a profile contains', '简介内容'),
        items: [
          {
            label: t('Фото', 'Фото', 'Photograph', '照片'),
            value: t(
              'Жазбаша келісім болғанда жарияланады, әйтпесе монограмма көрсетіледі',
              'Публикуется при наличии письменного согласия, иначе показывается монограмма',
              'Published with written consent; otherwise a monogram is shown',
              '取得书面同意后发布，否则显示姓名首字母标识',
            ),
          },
          {
            label: t('Лауазым', 'Должность', 'Position', '职务'),
            value: t(
              'Қауымдастықтағы ресми лауазымы немесе рөлі',
              'Официальная должность или роль в ассоциации',
              'Official position or role in the Association',
              '在协会中的正式职务或角色',
            ),
          },
          {
            label: t('Бағыт', 'Направление', 'Area of work', '工作方向'),
            value: t(
              'Жауапты жұмыс бағыты',
              'Направление, за которое отвечает человек',
              'The area of work the person is responsible for',
              '所负责的工作方向',
            ),
          },
          {
            label: t('Қысқа өмірбаян', 'Краткая биография', 'Short biography', '简历概要'),
            value: t(
              'Тәжірибесі мен біліктілігі туралы қысқаша мәлімет',
              'Краткие сведения об опыте и квалификации',
              'A short account of experience and qualifications',
              '关于经验与资历的简要介绍',
            ),
          },
          {
            label: t('Тілдер', 'Языки', 'Languages', '语言'),
            value: t(
              'Жұмыс істейтін тілдері',
              'Рабочие языки',
              'Working languages',
              '工作语言',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'legal',
        title: t(
          'Жариялау тек жазбаша келісіммен',
          'Публикация только с письменного согласия',
          'Publication only with written consent',
          '仅在书面同意后发布',
        ),
        text: t(
          'Тұлғаның аты, фотосы және өмірбаяны тек сол адамның жазбаша келісімі болғанда жарияланады. Нақты профильдер келісім алынғаннан кейін толтырылады.',
          'Имя, фото и биография человека публикуются только при наличии его письменного согласия. Профили заполняются по мере получения согласия.',
          "A person's name, photograph and biography are published only with that person's written consent. Profiles are filled in as consent is obtained.",
          '个人的姓名、照片和简历仅在本人书面同意后发布。简介将随同意的取得而逐步补充。',
        ),
      },
    ],
    cta: {
      title: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
      text: t(
        'Басқару органдарының өкілеттіктері жаңартылған жарғы бекітілгеннен кейін жарияланады.',
        'Полномочия органов управления публикуются после утверждения обновленного устава.',
        'The powers of the governing bodies are published once the updated charter is approved.',
        '管理机构的职权将在更新后的章程获批后公布。',
      ),
      label: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
      href: '/about/governance',
    },
  },

  // 12. Құжаттар
  {
    path: '/about/documents',
    section: 'about',
    title: t('Құжаттар', 'Документы', 'Documents', '文件'),
    description: t(
      'Жарғы, стратегия және ішкі ережелер PDF форматында, тіл мен нұсқа бойынша бекітілген сайын жарияланады.',
      'Устав, стратегия и внутренние правила публикуются в формате PDF по языкам и версиям по мере утверждения.',
      'The charter, strategy and internal rules are published as PDF files, by language and version, as they are approved.',
      '章程、战略和内部规则经批准后以PDF格式按语言和版本公布。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Бұл бөлімде қауымдастықтың негізгі құжаттары жарияланады: жарғы, стратегия және ішкі ережелер. Әр құжат PDF форматында беріледі.\n\nҚұжаттар бекітілген сайын жарияланады. Әр құжатта нұсқа нөмірі мен күні көрсетіледі.',
          'В этом разделе публикуются основные документы ассоциации: устав, стратегия и внутренние правила. Каждый документ предоставляется в формате PDF.\n\nДокументы публикуются по мере утверждения. У каждого документа указываются номер версии и дата.',
          "This section publishes the Association's main documents: the charter, the strategy and internal rules. Each document is provided in PDF format.\n\nDocuments are published as they are approved. Each document shows its version number and date.",
          '本栏目公布协会的主要文件：章程、战略和内部规则，每份文件均提供PDF格式。\n\n文件经批准后随即公布，并注明版本号和日期。',
        ),
      },
      {
        type: 'cards',
        heading: t('Құжаттар түрлері', 'Виды документов', 'Types of document', '文件类型'),
        columns: 3,
        items: [
          {
            title: t('Жарғы', 'Устав', 'Charter', '章程'),
            text: t(
              'Қауымдастықтың құрылтай құжаты, нұсқа нөмірі мен күні көрсетіліп жарияланады.',
              'Учредительный документ ассоциации; публикуется с указанием номера версии и даты.',
              "The Association's constitutive document, published with its version number and date.",
              '协会的设立文件，公布时注明版本号和日期。',
            ),
            icon: 'document',
          },
          {
            title: t('Стратегия', 'Стратегия', 'Strategy', '战略'),
            text: t(
              'Қауымдастықтың 2026-2028 жылдарға арналған стратегиялық даму жоспары.',
              'Стратегический план развития ассоциации на 2026-2028 годы.',
              "The Association's Strategic Development Plan for 2026-2028.",
              '协会《2026-2028年战略发展规划》。',
            ),
            icon: 'compass',
          },
          {
            title: t('Инвесторды бағалау ережелері', 'Правила оценки инвесторов', 'Investor assessment rules', '投资者评估规则'),
            text: t(
              'Инвесторды 100 балдық бағалаудың ішкі тәртібі. Бұл баға ресми рейтинг емес.',
              'Внутренний порядок 100-балльной оценки инвесторов. Эта оценка не является официальным рейтингом.',
              'The internal procedure for the 100-point assessment of investors. The assessment is not an official rating.',
              '投资者100分评估的内部程序。该评估不是官方评级。',
            ),
            icon: 'shield-check',
          },
          {
            title: t('Мүдделер қақтығысы ережелері', 'Правила по конфликту интересов', 'Conflict of interest rules', '利益冲突规则'),
            text: t(
              'Мүдделер қақтығысы бар сарапшы баға қоя алмайды және дауыс бере алмайды.',
              'Эксперт с конфликтом интересов не может выставлять оценки и голосовать.',
              'An expert with a conflict of interest cannot score or vote.',
              '存在利益冲突的专家不得评分或表决。',
            ),
            icon: 'shield',
          },
          {
            title: t('Құпиялылық ережелері', 'Правила конфиденциальности', 'Confidentiality rules', '保密规则'),
            text: t(
              'Жобалар мен инвесторлардың құпия деректерін қорғау тәртібі.',
              'Порядок защиты конфиденциальных данных проектов и инвесторов.',
              'The procedure for protecting confidential data of projects and investors.',
              '保护项目和投资者保密数据的程序。',
            ),
            icon: 'lock',
          },
        ],
      },
      {
        type: 'facts',
        heading: t('Құжат карточкасында', 'В карточке документа', "On a document's page", '文件页面信息'),
        items: [
          {
            label: t('PDF файл', 'Файл PDF', 'PDF file', 'PDF文件'),
            value: t(
              'Әр құжатты PDF файл ретінде жүктеп алуға болады',
              'Каждый документ можно скачать в виде файла PDF',
              'Each document can be downloaded as a PDF file',
              '每份文件均可下载PDF文件',
            ),
          },
          {
            label: t('Тіл бойынша нұсқалар', 'Версии по языкам', 'Versions by language', '语言版本'),
            value: t(
              'Қазақ, орыс, ағылшын және қытай тіліндегі нұсқалар; тіл нұсқасы аудармасы бекітілгеннен кейін көрсетіледі',
              'Версии на казахском, русском, английском и китайском языках; языковая версия появляется после утверждения перевода',
              'Versions in Kazakh, Russian, English and Chinese; a language version appears once its translation is approved',
              '哈萨克语、俄语、英语和中文版本；译文获批后方显示相应语言版本',
            ),
          },
          {
            label: t('Нұсқа нөмірі', 'Номер версии', 'Version number', '版本号'),
            value: t(
              'Әр құжаттың нұсқа нөмірі көрсетіледі',
              'Указывается номер версии каждого документа',
              'The version number of each document is shown',
              '注明每份文件的版本号',
            ),
          },
          {
            label: t('Нұсқа күні', 'Дата версии', 'Version date', '版本日期'),
            value: t(
              'Әр нұсқаның күні көрсетіледі',
              'Указывается дата каждой версии',
              'The date of each version is shown',
              '注明每个版本的日期',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t('Жариялау тәртібі', 'Порядок публикации', 'How documents are published', '公布规则'),
        text: t(
          'Құжаттар бекітілген сайын жарияланады. Инвесторды бағалау әдістемесі бекітілгенге дейін «жоба» деп белгіленеді. Басқару органдарының өкілеттіктері жаңартылған жарғы бекітілгеннен кейін жарияланады.',
          'Документы публикуются по мере утверждения. Пока методика оценки инвесторов не утверждена, она помечается как «проект». Полномочия органов управления публикуются после утверждения обновленного устава.',
          'Documents are published as they are approved. Until the investor assessment methodology is approved, it is marked “draft”. The powers of the governing bodies are published once the updated charter is approved.',
          '文件经批准后随即公布。投资者评估方法论在获批之前标注为“草案”。管理机构的职权将在更新后的章程获批后公布。',
        ),
      },
    ],
    cta: {
      title: t('Жылдық есептер', 'Годовые отчеты', 'Annual reports', '年度报告'),
      text: t(
        'Есептер бекітілгеннен кейін жарияланады.',
        'Отчеты публикуются после утверждения.',
        'Reports are published once approved.',
        '年度报告经批准后公布。',
      ),
      label: t('Жылдық есептер', 'Годовые отчеты', 'Annual reports', '年度报告'),
      href: '/about/reports',
    },
  },

  // 13. Жылдық есептер
  {
    path: '/about/reports',
    section: 'about',
    title: t('Жылдық есептер', 'Годовые отчеты', 'Annual reports', '年度报告'),
    description: t(
      'Жылдық есептер бекітілгеннен кейін жарияланады және нәтижелер, төрт бөлек сома мен әдістемені қамтиды.',
      'Годовые отчеты публикуются после утверждения и включают результаты, четыре раздельные суммы и методику.',
      'Annual reports are published once approved and cover results, the four separate sums and the methodology.',
      '年度报告经批准后公布，内容涵盖成果、四类独立金额和方法论。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        text: t(
          'Жылдық есеп қауымдастықтың жыл ішіндегі жұмысын нәтижелер арқылы көрсетеді. Есептер бекітілгеннен кейін жарияланады.\n\nЕсептегі сандар расталған жазбалардан есептеледі. Әр санның дереккөзі мен күні көрсетіледі.',
          'Годовой отчет показывает работу ассоциации за год через результаты. Отчеты публикуются после утверждения.\n\nЦифры в отчете рассчитываются по подтвержденным записям. У каждой цифры указываются источник и дата.',
          "The annual report shows the Association's work over the year through its results. Reports are published once approved.\n\nFigures in a report are calculated from confirmed records. Each figure shows its source and date.",
          '年度报告通过成果展现协会全年的工作。报告经批准后公布。\n\n报告中的数据依据已确认的记录计算，每个数字均注明来源和日期。',
        ),
      },
      {
        type: 'cards',
        heading: t('Есептің құрылымы', 'Структура отчета', 'Structure of a report', '报告结构'),
        columns: 3,
        items: [
          {
            title: t('Нәтижелер', 'Результаты', 'Results', '成果'),
            text: t(
              'Нәтижелердің төрт деңгейі: инвесторларды тарту, жобаларды дамыту, инвестицияны іске асыру және экономикалық үлес.',
              'Четыре уровня результатов: привлечение инвесторов, развитие проектов, реализация инвестиций и экономический вклад.',
              'The four levels of results: attracting investors, developing projects, delivering investment and economic contribution.',
              '成果的四个层级：吸引投资者、推进项目发展、投资落地和经济贡献。',
            ),
            icon: 'chart',
            href: '/results',
          },
          {
            title: t('Төрт бөлек сома', 'Четыре раздельные суммы', 'Four separate sums', '四类独立金额'),
            text: t(
              'Мәлімделген, ниет құжаты бойынша, ресми шарт бойынша және нақты түскен сомалар бөлек беріледі және қосылмайды.',
              'Заявленная, по документу о намерениях, по официальному договору и фактически поступившая суммы приводятся отдельно и не суммируются.',
              'Declared, per letter of intent, per signed contract and actually received sums are given separately and are never added together.',
              '申报、按意向文件、按正式合同和实际到位的金额分别列示，互不相加。',
            ),
            icon: 'layers',
            href: '/results',
          },
          {
            title: t('Әдістеме', 'Методика', 'Methodology', '方法论'),
            text: t(
              'Көрсеткіштердің анықтамасы, есепке алу қағидаттары және есептен тыс қалатын жағдайлар.',
              'Определения показателей, принципы учета и то, что в подсчет не входит.',
              'Definitions of the indicators, the principles of recording and what is left out of the count.',
              '指标定义、统计原则以及不计入统计的内容。',
            ),
            icon: 'document',
            href: '/results',
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Жоба есепке қалай енеді',
          'Как проект попадает в отчет',
          'How a project reaches the report',
          '项目如何进入报告',
        ),
        text: t(
          'Жоба өмірлік циклінің сегізінші кезеңінде «Нәтижені бағалау» жүргізіледі: нақты инвестиция, қуат, жұмыс орындары, салық және жергілікті сатып алу бағаланады. Осыдан кейін жоба жылдық есепке енеді. Нақты түскен сома тек дәлел файлымен (банк құжаты, аудит) толтырылады.',
          'На восьмом этапе жизненного цикла проекта проводится «Оценка результата»: оцениваются фактические инвестиции, мощность, рабочие места, налоги и локальные закупки. После этого проект входит в годовой отчет. Фактически поступившая сумма заполняется только при наличии файла-подтверждения (банковский документ, аудит).',
          'The eighth stage of the project lifecycle is the results assessment: actual investment, capacity, jobs, taxes and local procurement are assessed. The project then enters the annual report. The actually received sum is filled in only with a supporting file (a bank document or an audit).',
          '项目生命周期的第八阶段为“成果评估”：评估实际投资、产能、就业、税收和本地采购。此后，该项目纳入年度报告。“实际到位”金额仅在附有证明文件（银行文件或审计）时填写。',
        ),
      },
      {
        type: 'notice',
        tone: 'info',
        title: t('Жариялау тәртібі', 'Порядок публикации', 'How reports are published', '发布方式'),
        text: t(
          'Жылдық есептер бекітілгеннен кейін ғана осы бетте жарияланады. Бекітілгенге дейін бұл бетте есеп орналастырылмайды.',
          'Годовые отчеты публикуются на этой странице только после утверждения. До утверждения отчеты здесь не размещаются.',
          'Annual reports are published on this page only once approved. Until then, no report is posted here.',
          '年度报告经批准后方会发布在本页。批准之前，本页不发布任何报告。',
        ),
      },
    ],
    cta: {
      title: t('Ағымдағы нәтижелер', 'Текущие результаты', 'Current results', '当前成果'),
      text: t(
        'Тоқсан сайын жаңартылатын көрсеткіштер нәтижелер бетінде беріледі.',
        'Показатели, обновляемые ежеквартально, приведены на странице результатов.',
        'Indicators updated every quarter are set out on the results page.',
        '每季度更新的指标载于成果页面。',
      ),
      label: t('Нәтижелер', 'Результаты', 'Results', '成果'),
      href: '/results',
    },
  },
]
