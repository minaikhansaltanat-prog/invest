import { scoringSeed } from '../data'
import { t, type T } from '../lib'
import type { SeedBlock, SeedCta, SeedPage, ServiceDetailSeed } from './types'

// Топ A: Қауымдастық, Қызметтер (индекс және 8 бет), Құқықтық беттер (ТТ 7.1, 7.2, 7.9).
// Түнгі аударма жобасы: ана тілді тілші тексеруі қажет. Құқықтық беттер: заңгер тексеріп бекітеді.
// Фактілер тек ТТ-дан алынған. ТТ-да жоқ дерек (жарна мөлшері, электрондық пошта, серіктес аттары) жазылмаған.

// ---------------------------------------------------------------------------------------------
// Ортақ бөліктер
// ---------------------------------------------------------------------------------------------

/** Құқықтық беттердің басындағы жоба туралы ескертпе */
const draftNotice: SeedBlock = {
  type: 'notice',
  tone: 'legal',
  title: t('Жоба мәтіні', 'Проект текста', 'Draft text', '草案文本'),
  text: t(
    'Бұл мәтін жоба, заңгер тексеріп бекіткенге дейін құқықтық күші жоқ.',
    'Этот текст является проектом и не имеет юридической силы до проверки и утверждения юристом.',
    'This text is a draft and has no legal force until it has been reviewed and approved by a lawyer.',
    '本文本为草案，在经律师审核并批准之前不具有法律效力。',
  ),
}

/** Оператор реквизиттері (14.09.2026 берілген қайта тіркеу анықтамасы бойынша, ТТ 2) */
const operatorFacts: SeedBlock = {
  type: 'facts',
  heading: t('Оператор', 'Оператор', 'Operator', '运营方'),
  items: [
    {
      label: t('Оператор', 'Оператор', 'Operator', '运营方'),
      value: t(
        '«Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігі, БСН 170140015381',
        'Объединение юридических лиц «Казахстанская ассоциация иностранного капитала», БИН 170140015381',
        'Kazakhstan Association of Foreign Capital, an association of legal entities, BIN 170140015381',
        '哈萨克斯坦外国资本协会（法人联合体），企业识别号（BIN）170140015381',
      ),
    },
    {
      label: t('Заңды мекенжайы', 'Юридический адрес', 'Legal address', '注册地址'),
      value: t(
        'Астана қ., Нұра ауданы, Әнет баба көшесі, 11/3 ғимарат, 7 т.е.б., 010000',
        'г. Астана, район Нура, ул. Анет баба, здание 11/3, н.п. 7, 010000',
        'Astana, Nura district, Anet Baba St., building 11/3, premises 7, 010000',
        '阿斯塔纳市努拉区阿内特巴巴街11/3号楼7号房，010000',
      ),
    },
    {
      label: t('Сұраулар', 'Обращения', 'Enquiries', '咨询渠道'),
      value: t(
        'Порталдағы «Байланыс» беті арқылы',
        'Через страницу «Контакты» на портале',
        'Through the Contacts page of the portal',
        '通过门户网站的“联系我们”页面',
      ),
    },
  ],
}

/** Баға салмағы: 4 тілде «25 балл» */
const points = (n: number) => t(`${n} балл`, `${n} баллов`, `${n} points`, `${n}分`)

/** Қызмет бетінің соңындағы сұраныс CTA (href әрқашан /contacts) */
const serviceCta = (text: T): SeedCta => ({
  title: t('Сұраныс қалдырыңыз', 'Оставьте запрос', 'Send us an enquiry', '欢迎咨询'),
  text,
  label: t('Сұраныс қалдыру', 'Оставить запрос', 'Leave an enquiry', '提交咨询'),
  href: '/contacts',
})

/** Қызмет беттерінің ортақ блок тақырыптары (ТТ 7.2) */
const hWhat = t('Не істейміз', 'Что мы делаем', 'What we do', '我们做什么')
const hWhom = t('Кімге арналған', 'Для кого', 'Who it is for', '服务对象')
const hStages = t('Жұмыс кезеңдері', 'Этапы работы', 'Stages of work', '工作阶段')
const hResult = t('Нәтижесі', 'Результат', 'Result', '预期成果')
const hLimits = t('Жауапкершілік шекарасы', 'Граница ответственности', 'Limits of responsibility', '责任边界')

// ---------------------------------------------------------------------------------------------
// Беттер
// ---------------------------------------------------------------------------------------------

export const pagesA: SeedPage[] = [
  // 1. Біз туралы
  {
    path: '/about',
    section: 'about',
    title: t('Біз туралы', 'О нас', 'About us', '关于我们'),
    description: t(
      'Қауымдастық 2017 жылы тіркелді, ал 2026-2028 жылдарға арналған стратегия оны кәсіби инвестициялық платформаға айналдырады.',
      'Ассоциация зарегистрирована в 2017 году, а стратегия на 2026-2028 годы превращает её в профессиональную инвестиционную платформу.',
      'The Association was registered in 2017, and its 2026-2028 strategy turns it into a professional investment platform.',
      '协会于2017年登记成立，《2026-2028年战略发展规划》将其转型为专业的投资平台。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        heading: t('Қауымдастық туралы', 'Об ассоциации', 'About the Association', '协会简介'),
        text: t(
          '«Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігі шетелдік инвесторлар мен Қазақстанның тексерілген жобаларын байланыстырады. Қауымдастық алғаш рет 2017 жылғы 17 қаңтарда тіркелді, ал 2026 жылғы 14 қыркүйекте қайта тіркелді. Портал қауымдастықтың стратегиясын цифрлық жүйеге айналдырады: инвесторды тексеру, жобалар қоры, сәйкестендіру және нәтижені есепке алу бір платформада жүргізіледі.',
          'Объединение юридических лиц «Казахстанская ассоциация иностранного капитала» соединяет иностранных инвесторов с проверенными проектами Казахстана. Ассоциация впервые зарегистрирована 17 января 2017 года и перерегистрирована 14 сентября 2026 года. Портал превращает стратегию ассоциации в цифровую систему: проверка инвесторов, пул проектов, подбор и учёт результата ведутся на одной платформе.',
          'The Kazakhstan Association of Foreign Capital, an association of legal entities, connects foreign investors with vetted projects in Kazakhstan. It was first registered on 17 January 2017 and re-registered on 14 September 2026. The portal turns the Association’s strategy into a digital system: investor vetting, the project pool, matching and results reporting are handled on one platform.',
          '哈萨克斯坦外国资本协会（法人联合体）连接外国投资者与经审核的哈萨克斯坦项目。协会于2017年1月17日首次登记，并于2026年9月14日重新登记。门户网站将协会战略转化为数字化系统：投资者审核、项目库、匹配与成果核算均在同一平台完成。',
        ),
      },
      {
        type: 'facts',
        heading: t('Негізгі деректер', 'Основные данные', 'Key facts', '基本信息'),
        items: [
          {
            label: t('Ресми атауы', 'Официальное наименование', 'Official name', '正式名称'),
            value: t(
              '«Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігі',
              'Объединение юридических лиц «Казахстанская ассоциация иностранного капитала»',
              'Kazakhstan Association of Foreign Capital (association of legal entities)',
              '哈萨克斯坦外国资本协会（法人联合体）',
            ),
          },
          {
            label: t('Алғашқы тіркеу', 'Первичная регистрация', 'First registration', '首次登记'),
            value: t('2017 жылғы 17 қаңтар', '17 января 2017 года', '17 January 2017', '2017年1月17日'),
          },
          {
            label: t('Қайта тіркеу', 'Перерегистрация', 'Re-registration', '重新登记'),
            value: t('2026 жылғы 14 қыркүйек', '14 сентября 2026 года', '14 September 2026', '2026年9月14日'),
          },
          {
            label: t('БСН', 'БИН', 'BIN', '企业识别号'),
            value: t(
              '170140015381, қайта тіркеу туралы анықтама бойынша',
              '170140015381, по справке о перерегистрации',
              '170140015381, as per the re-registration certificate',
              '170140015381，依据重新登记证明',
            ),
          },
          {
            label: t('Құрылтайшылар', 'Учредители', 'Founders', '创始方'),
            value: t(
              '«Көк керуен» ЖШС, «New Level Pro» ЖШС',
              'ТОО «Кок керуен», ТОО «New Level Pro»',
              'Kok Keruen LLP, New Level Pro LLP',
              'Kok Keruen有限责任公司、New Level Pro有限责任公司',
            ),
          },
          {
            label: t('Басшысы', 'Руководитель', 'Head', '负责人'),
            value: t(
              'Ғалым Жанар, Қауымдастық президенті әрі төрағасы',
              'Галым Жанар, президент и председатель ассоциации',
              'Galym Zhanar, President and Chair of the Association',
              'Galym Zhanar，协会会长兼主席',
            ),
          },
          {
            label: t('Ұран', 'Девиз', 'Motto', '口号'),
            value: t(
              'Бірге тұрақты даму үшін',
              'Вместе за устойчивое развитие',
              'Together for sustainable growth',
              '携手共促可持续发展',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Жаңа стратегиялық позиция',
          'Новая стратегическая позиция',
          'New strategic position',
          '全新的战略定位',
        ),
        text: t(
          'Стратегия қауымдастықты дәстүрлі байланыс пен іс-шара моделінен кәсіби инвестициялық платформаға ауыстырады. Қауымдастықтың беделі өткізілген іс-шаралар санымен емес, тексерілген инвесторлармен, нақты жобалармен және іс жүзінде тартылған инвестициямен өлшенеді.\n\nЖаңа модельдің өзегі мынадай тізбек: ортақ стандартпен жиналған инвестор деректері мен жобалар қоры, оларды бағалау, сәйкестендіру және нәтижені тексерілетін түрде көрсету. Стратегияның мерзімі: 2026-2028 жылдар.',
          'Стратегия переводит ассоциацию от традиционной модели контактов и мероприятий к профессиональной инвестиционной платформе. Репутация ассоциации измеряется не числом проведённых мероприятий, а проверенными инвесторами, реальными проектами и фактически привлечёнными инвестициями.\n\nОснова новой модели: данные об инвесторах и пул проектов, собранные по единому стандарту, их оценка, подбор и проверяемое отображение результата. Горизонт стратегии: 2026-2028 годы.',
          'The strategy moves the Association from a traditional model of contacts and events to a professional investment platform. Its reputation is measured not by the number of events held, but by vetted investors, real projects and investment actually attracted.\n\nThe new model rests on one chain: investor data and a project pool collected to a common standard, their assessment, matching, and verifiable reporting of results. The strategy covers 2026-2028.',
          '战略将协会从传统的联络与活动模式转变为专业的投资平台。协会的声誉不以举办活动的数量衡量，而以经审核的投资者、真实的项目和实际吸引的投资来衡量。\n\n新模式的核心是一条完整链条：按统一标准收集的投资者数据与项目库，对其进行评估、匹配，并以可核查的方式呈现成果。战略周期为2026-2028年。',
        ),
      },
      {
        type: 'cards',
        heading: t(
          'Нәтижені төрт бөлек есеппен көрсетеміз',
          'Показываем результат в четырёх раздельных отчётах',
          'We report results in four separate ledgers',
          '以四本独立账目呈现成果',
        ),
        lead: t(
          'Төрт сома ешқашан бір санға біріктірілмейді.',
          'Четыре суммы никогда не складываются в одну цифру.',
          'The four amounts are never merged into a single figure.',
          '四类金额永不合并为一个数字。',
        ),
        columns: 4,
        items: [
          {
            title: t('Мәлімделген сома', 'Заявленная сумма', 'Declared', '申报'),
            text: t(
              'Тараптың өзі хабарлаған сома. Ол құжатпен расталмаған.',
              'Сумма, которую назвала сама сторона. Документально она не подтверждена.',
              'The amount stated by the party itself. It is not backed by a document.',
              '当事方自行申报的金额，尚无文件佐证。',
            ),
          },
          {
            title: t('Ниет құжаты бойынша', 'По документу о намерениях', 'Per letter of intent', '按意向文件'),
            text: t(
              'Ниет хаттамасында немесе терм-шитте көрсетілген сома. Бұл инвестиция тартылды дегенді білдірмейді.',
              'Сумма, указанная в протоколе о намерениях или в терм-шите. Это не означает, что инвестиции привлечены.',
              'The amount in a protocol of intent or term sheet. It does not mean that investment has been attracted.',
              '意向协议或条款清单中的金额，不等于投资已经到位。',
            ),
          },
          {
            title: t('Ресми шарт бойынша', 'По официальному договору', 'Per signed contract', '按正式合同'),
            text: t(
              'Тараптар қол қойған ресми шартта бекітілген сома.',
              'Сумма, закреплённая в подписанном сторонами официальном договоре.',
              'The amount set out in an official contract signed by the parties.',
              '双方签署的正式合同中约定的金额。',
            ),
          },
          {
            title: t('Нақты түскен', 'Фактически поступившая', 'Actually received', '实际到位'),
            text: t(
              'Банк құжатымен немесе аудитпен расталған, іс жүзінде түскен қаражат.',
              'Средства, фактически поступившие и подтверждённые банковским документом или аудитом.',
              'Funds actually received and confirmed by a bank document or an audit.',
              '已实际到账，并有银行文件或审计证明的资金。',
            ),
          },
        ],
      },
      {
        type: 'cards',
        heading: t(
          'Kazakh Invest-тен айырмашылығымыз',
          'Отличие от Kazakh Invest',
          'How we differ from Kazakh Invest',
          '与 Kazakh Invest 的区别',
        ),
        lead: t(
          'Kazakh Invest мемлекеттік оператор ретінде ресми сүйемелдеу мен әкімшілік қолдауды жүргізеді. Қауымдастық оны алмастырмайды: біз нарықтық толықтырушы рөлін атқарамыз.',
          'Kazakh Invest как государственный оператор осуществляет официальное сопровождение и административную поддержку. Ассоциация его не заменяет: мы выполняем роль рыночного дополнения.',
          'As the state operator, Kazakh Invest provides official support and administrative assistance. The Association does not replace it: we play a complementary, market-based role.',
          'Kazakh Invest 作为国家运营机构，负责官方服务与行政支持。协会并非取而代之，而是发挥市场化的补充作用。',
        ),
        columns: 4,
        items: [
          {
            icon: 'globe',
            title: t(
              'Жеке халықаралық желі',
              'Собственная международная сеть',
              'Our own international network',
              '自有国际网络',
            ),
            text: t(
              'Қытай, Орталық Азия, Еуропа және Таяу Шығыс инвесторларымен тікелей байланыс арналары.',
              'Прямые каналы связи с инвесторами Китая, Центральной Азии, Европы и Ближнего Востока.',
              'Direct channels to investors in China, Central Asia, Europe and the Middle East.',
              '与中国、中亚、欧洲及中东投资者保持直接沟通渠道。',
            ),
          },
          {
            icon: 'layers',
            title: t(
              'Жобаларды алдын ала іріктеу',
              'Предварительный отбор проектов',
              'Pre-selection of projects',
              '项目预先遴选',
            ),
            text: t(
              'Жоба каталогқа шықпас бұрын құжаттары мен дайындығы бойынша тексеріледі.',
              'Проект проходит проверку документов и готовности до выхода в каталог.',
              'A project’s documents and readiness are checked before it reaches the catalogue.',
              '项目在进入目录之前，须先通过文件与成熟度审核。',
            ),
          },
          {
            icon: 'shield-check',
            title: t(
              'Инвесторды ішкі бағалау',
              'Внутренняя оценка инвесторов',
              'Internal investor assessment',
              '投资者内部评估',
            ),
            text: t(
              '100 балдық ішкі баға мен комплаенс ветосы басым жобаларға тексерілген серіктестерді ғана жібереді. Бұл ресми рейтинг емес.',
              'Внутренняя 100-балльная оценка и комплаенс-вето допускают к приоритетным проектам только проверенных партнёров. Это не официальный рейтинг.',
              'A 100-point internal assessment and the compliance veto admit only vetted partners to priority projects. It is not an official rating.',
              '100分内部评估与合规否决权，确保只有经审核的合作伙伴才能参与重点项目。这不是官方评级。',
            ),
          },
          {
            icon: 'compass',
            title: t(
              'Толық цикл бақылауы',
              'Контроль полного цикла',
              'Control of the full cycle',
              '全周期跟踪',
            ),
            text: t(
              'Жоба қабылданғаннан бастап нәтиже бағаланғанға дейін сегіз кезең бойынша бақыланады.',
              'Проект отслеживается на всех восьми этапах: от приёма до оценки результата.',
              'Each project is tracked through eight stages, from intake to results assessment.',
              '每个项目从受理到成果评估，全程按八个阶段跟踪。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'legal',
        title: t('Ашықтық ескертпесі', 'Примечание о прозрачности', 'Transparency notice', '透明度声明'),
        text: t(
          'Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді. Ішкі баға ресми рейтинг емес, мүшелік қаржылық сенімділіктің кепілі емес. Қауымдастық инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді.',
          'Ассоциация не является государственным органом и не действует от имени государственных органов. Внутренняя оценка не является официальным рейтингом, а членство не гарантирует финансовую надёжность. Ассоциация не гарантирует инвестиционный доход, государственное разрешение или льготы.',
          'The Association is not a government body and does not act on behalf of government bodies. The internal assessment is not an official rating, and membership is not a guarantee of financial reliability. The Association does not guarantee investment returns, government permits or incentives.',
          '协会不是政府机构，亦不代表任何政府机构行事。内部评估不是官方评级，会员资格也不构成财务可靠性的担保。协会不保证投资收益、政府许可或优惠政策。',
        ),
      },
    ],
    cta: {
      title: t(
        'Бізбен жұмыс істегіңіз келе ме?',
        'Хотите работать с нами?',
        'Would you like to work with us?',
        '有意与我们合作吗？',
      ),
      text: t(
        'Инвестор, жоба иесі немесе мүше ретінде қауымдастықпен байланысыңыз.',
        'Свяжитесь с ассоциацией как инвестор, владелец проекта или член ассоциации.',
        'Get in touch with the Association as an investor, project owner or member.',
        '无论您是投资者、项目方还是会员，欢迎与协会联系。',
      ),
      label: t('Байланыс', 'Контакты', 'Contact us', '联系我们'),
      href: '/contacts',
    },
  },

  // 2. Миссия мен қағидаттар
  {
    path: '/about/mission',
    section: 'about',
    title: t('Миссия мен қағидаттар', 'Миссия и принципы', 'Mission and principles', '使命与原则'),
    description: t(
      'Қауымдастықтың миссиясы шетелдік капитал мен Қазақстанның нақты жобаларын байланыстыру, ал жұмысымыз алты қағидатқа сүйенеді.',
      'Миссия ассоциации: соединять иностранный капитал с реальными проектами Казахстана; работа строится на шести принципах.',
      'Our mission is to connect foreign capital with real projects in Kazakhstan, guided by six working principles.',
      '协会的使命是连接外国资本与哈萨克斯坦的真实项目，并遵循六项工作原则。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        heading: t('Миссиямыз', 'Наша миссия', 'Our mission', '我们的使命'),
        text: t(
          'Біздің миссиямыз: шетелдік капитал мен Қазақстанның нақты жобаларын байланыстыру. Инвесторларды тексереміз, жобаларды іріктейміз және мәмілелерді келіссөзден бастап іске асыруға дейін сүйемелдейміз. Ұранымыз: «Бірге тұрақты даму үшін».',
          'Наша миссия: соединять иностранный капитал и реальные проекты Казахстана. Мы проверяем инвесторов, отбираем проекты и сопровождаем сделки от переговоров до реализации. Наш девиз: «Вместе за устойчивое развитие».',
          'Our mission is to connect foreign capital with real projects in Kazakhstan. We vet investors, select projects and support deals from negotiation to implementation. Our motto is “Together for sustainable growth”.',
          '我们的使命是连接外国资本与哈萨克斯坦的真实项目。我们审核投资者、遴选项目，并从谈判到落地全程支持交易。我们的口号是“携手共促可持续发展”。',
        ),
      },
      {
        type: 'cards',
        heading: t('Алты қағидат', 'Шесть принципов', 'Six principles', '六项原则'),
        lead: t(
          'Қауымдастықтың әр шешімі мен әр мәтіні осы қағидаттарға сәйкес болуы тиіс.',
          'Каждое решение и каждый текст ассоциации должны соответствовать этим принципам.',
          'Every decision and every text of the Association must be consistent with these principles.',
          '协会的每项决定和每份文本都应符合这些原则。',
        ),
        columns: 3,
        items: [
          {
            icon: 'columns',
            title: t('Заңдылық', 'Законность', 'Legality', '合法合规'),
            text: t(
              'Барлық жұмыс Қазақстан Республикасының заңнамасына сай жүргізіледі. Инвесторды тексеру тек заңды тәсілдермен жасалады.',
              'Вся работа ведётся в соответствии с законодательством Республики Казахстан. Проверка инвесторов проводится только законными методами.',
              'All work is carried out in line with the legislation of the Republic of Kazakhstan. Investors are vetted by lawful means only.',
              '一切工作均依照哈萨克斯坦共和国法律开展。对投资者的审核仅采用合法手段。',
            ),
          },
          {
            icon: 'eye',
            title: t('Шынайылық', 'Достоверность', 'Authenticity', '真实性'),
            text: t(
              'Әр дерек дереккөзі мен күнімен беріледі. Ниет сомасы тартылған инвестиция ретінде көрсетілмейді.',
              'Каждая цифра приводится с источником и датой. Сумма намерения не выдаётся за привлечённую инвестицию.',
              'Every figure is given with its source and date. An amount of intent is never presented as investment attracted.',
              '每项数据均注明来源和日期。意向金额不会被表述为已吸引的投资。',
            ),
          },
          {
            icon: 'shield-check',
            title: t('Кәсіби сақтық', 'Профессиональная осмотрительность', 'Professional prudence', '专业审慎'),
            text: t(
              'Инвесторлар да, жобалар да ортақ стандарт бойынша тексеріледі. Тексерілмеген жоба каталогқа шықпайды.',
              'Инвесторы и проекты проверяются по единому стандарту. Непроверенный проект в каталог не попадает.',
              'Investors and projects are both checked to a common standard. A project that has not been vetted does not reach the catalogue.',
              '投资者和项目均按统一标准审核。未经审核的项目不会进入目录。',
            ),
          },
          {
            icon: 'user',
            title: t('Тең серіктестік', 'Равноправное партнёрство', 'Equal partnership', '平等合作'),
            text: t(
              'Инвесторға да, жоба иесіне де бірдей ашық ережелер қолданылады. Қауымдастық тараптардың мүддесін тең ескереді.',
              'К инвестору и к владельцу проекта применяются одинаково открытые правила. Ассоциация в равной мере учитывает интересы сторон.',
              'The same open rules apply to the investor and the project owner. The Association gives equal weight to the interests of both sides.',
              '投资者与项目方适用同样公开的规则。协会平等对待双方的利益。',
            ),
          },
          {
            icon: 'alert',
            title: t('Тәуекелді бақылау', 'Контроль рисков', 'Risk control', '风险管控'),
            text: t(
              'Әр басым жобада тәуекелдер тізілімі жүргізіледі. Комплаенс ветосы күмәнді қаражатты, жалған құжатты және санкциялық тәуекелді жалпы баллға қарамастан тоқтатады.',
              'По каждому приоритетному проекту ведётся реестр рисков. Комплаенс-вето останавливает сомнительные средства, поддельные документы и санкционные риски независимо от общего балла.',
              'A risk register is kept for every priority project. The compliance veto stops doubtful funds, forged documents and sanctions risks regardless of the total score.',
              '每个重点项目都建立风险台账。无论总分多少，合规否决权均可叫停来源存疑的资金、伪造文件和制裁风险。',
            ),
          },
          {
            icon: 'chart',
            title: t('Нәтижеге бағдарлану', 'Ориентация на результат', 'Focus on results', '结果导向'),
            text: t(
              'Табыс іс-шара санымен емес, нақты инвестициямен өлшенеді. Нәтиже төрт бөлек есеппен көрсетіледі.',
              'Успех измеряется не числом мероприятий, а реальными инвестициями. Результат показывается в четырёх раздельных отчётах.',
              'Success is measured by real investment, not by the number of events. Results are reported in four separate ledgers.',
              '成效以实际投资而非活动数量衡量。成果以四本独立账目呈现。',
            ),
          },
        ],
      },
      {
        type: 'links',
        heading: t(
          'Қағидаттар қайда көрінеді',
          'Где принципы проявляются',
          'Where the principles show up',
          '原则的体现',
        ),
        items: [
          {
            label: t('Ашықтық пен этика', 'Прозрачность и этика', 'Transparency and ethics', '透明与道德'),
            href: '/about/ethics',
            text: t(
              'Мүдделер қақтығысы, комплаенс ветосы және шағым беру жолы.',
              'Конфликт интересов, комплаенс-вето и порядок подачи жалоб.',
              'Conflicts of interest, the compliance veto and how to raise a complaint.',
              '利益冲突、合规否决权与投诉渠道。',
            ),
          },
          {
            label: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
            href: '/about/governance',
            text: t(
              'Органдар мен функциялар және олардың рөлі.',
              'Органы и функции, их роль.',
              'Governing bodies and functions and their roles.',
              '各治理机构与职能及其作用。',
            ),
          },
          {
            label: t('Құжаттар', 'Документы', 'Documents', '文件'),
            href: '/about/documents',
            text: t(
              'Жарғы, стратегия және ішкі ережелер.',
              'Устав, стратегия и внутренние правила.',
              'The charter, the strategy and internal rules.',
              '章程、战略与内部规则。',
            ),
          },
          {
            label: t('Нәтижелер', 'Результаты', 'Results', '成果'),
            href: '/results',
            text: t(
              'Нәтиже төрт бөлек есеппен көрсетіледі.',
              'Результаты в четырёх раздельных отчётах.',
              'Results in four separate ledgers.',
              '以四本独立账目呈现的成果。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t(
          'Қағидаттар кепілдік емес',
          'Принципы не являются гарантией',
          'Principles are not guarantees',
          '原则不构成担保',
        ),
        text: t(
          'Қағидаттар қауымдастықтың жұмыс стандартын білдіреді. Олар инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді.',
          'Принципы определяют стандарт работы ассоциации. Они не гарантируют инвестиционный доход, государственное разрешение или льготы.',
          'The principles set the Association’s working standard. They do not guarantee investment returns, government permits or incentives.',
          '这些原则体现协会的工作标准，并不保证投资收益、政府许可或优惠政策。',
        ),
      },
    ],
    cta: {
      title: t(
        'Қауымдастық қалай басқарылады?',
        'Как управляется ассоциация?',
        'How is the Association governed?',
        '协会如何治理？',
      ),
      text: t(
        'Қауымдастықтың органдары мен функциялары қандай рөл атқаратынын қараңыз.',
        'Узнайте, какую роль выполняют органы и функции ассоциации.',
        'See the role played by the Association’s bodies and functions.',
        '了解协会各机构与职能分别发挥什么作用。',
      ),
      label: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
      href: '/about/governance',
    },
  },

  // 3. Басқару құрылымы
  {
    path: '/about/governance',
    section: 'about',
    title: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
    description: t(
      'Қауымдастықтың басқару органдары мен функциялары және олардың рөлі; өкілеттіктер жаңартылған жарғы бекітілгеннен кейін жарияланады.',
      'Органы и функции управления ассоциации и их роли; полномочия будут опубликованы после утверждения обновлённого устава.',
      'The Association’s governing bodies and functions and their roles; powers will be published once the updated charter is approved.',
      '协会的治理机构与职能及其作用；各机构权限将在更新后的章程获批后公布。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        heading: t('Басқару моделі', 'Модель управления', 'Governance model', '治理模式'),
        text: t(
          'Қауымдастықтың басқару моделі жарғыға негізделеді және жоғары басқару органдарынан өңірлік өкілдерге дейінгі буындарды қамтиды. Төменде әр органның негізгі міндеті қысқаша түсіндіріледі. Инвесторды бағалауды екі тұлға (сарапшы мен комитет мүшесі) жүргізеді, ал жобаны 3-деңгейге көтеру комитет шешімін талап етеді.',
          'Модель управления ассоциации опирается на устав и охватывает звенья от высших органов управления до региональных представителей. Ниже кратко описана основная задача каждого органа. Оценку инвестора проводят два человека (эксперт и член комитета), а перевод проекта на уровень 3 требует решения комитета.',
          'The Association’s governance model is based on its charter and covers every level from the supreme bodies to regional representatives. The main task of each body is outlined below. An investor is assessed by two people (an expert and a committee member), and moving a project to Level 3 requires a committee decision.',
          '协会的治理模式以章程为基础，涵盖从最高决策机构到地区代表的各个层级。下文简要说明各机构的主要职责。投资者评估由两人（专家与委员会成员）共同完成，项目升至3级须经委员会决定。',
        ),
      },
      {
        type: 'cards',
        heading: t(
          'Басқару және бақылау органдары',
          'Органы управления и контроля',
          'Governing and oversight bodies',
          '管理与监督机构',
        ),
        columns: 3,
        items: [
          {
            icon: 'columns',
            title: t('Жалпы жиналыс', 'Общее собрание', 'General Assembly', '全体大会'),
            text: t(
              'Қауымдастық мүшелерінен құралатын алқалы орган. Қауымдастықтың негізгі бағыттары мен жарғыға қатысты маңызды мәселелер осы деңгейде қаралады.',
              'Коллегиальный орган, объединяющий членов ассоциации. На этом уровне рассматриваются основные направления деятельности ассоциации и важные вопросы, связанные с уставом.',
              'The collective body of the Association’s members. Key directions of the Association and important charter-related matters are considered at this level.',
              '由协会全体成员组成的合议机构。协会的主要发展方向以及与章程相关的重大事项在此层面审议。',
            ),
          },
          {
            icon: 'user',
            title: t('Төраға', 'Председатель', 'Chair', '主席'),
            text: t(
              'Қауымдастықты басқарады және оның атынан өкілдік етеді. Қазіргі басшы: Ғалым Жанар, Қауымдастық президенті әрі төрағасы. Комитет шешімінен кейін жобаларды бекітеді.',
              'Руководит ассоциацией и представляет её. Нынешний руководитель: Галым Жанар, президент и председатель ассоциации. Утверждает проекты после решения комитета.',
              'Leads the Association and represents it. The current head is Galym Zhanar, President and Chair of the Association. Approves projects after a committee decision.',
              '领导并代表协会。现任负责人为协会会长兼主席 Galym Zhanar。在委员会作出决定后批准项目。',
            ),
          },
          {
            icon: 'user',
            title: t('Төраға орынбасарлары', 'Заместители председателя', 'Deputy Chairs', '副主席'),
            text: t(
              'Төраға тапсырмасы бойынша жекелеген бағыттарды үйлестіреді және оған басқаруда көмектеседі.',
              'Координируют отдельные направления по поручению председателя и помогают ему в управлении.',
              'Coordinate individual areas of work as instructed by the Chair and support the Chair in running the Association.',
              '受主席委托协调各个业务方向，协助主席管理协会。',
            ),
          },
          {
            icon: 'compass',
            title: t(
              'Атқарушы директор (енгізілсе)',
              'Исполнительный директор (если будет введён)',
              'Executive Director (if introduced)',
              '执行董事（如设立）',
            ),
            text: t(
              'Күнделікті жұмысты және жоба кезеңдерінің мерзімін бақылайды: мерзімі өткен қадам туралы ескертпе соған да жіберіледі. Лауазым жаңартылған жарғыда көзделсе ғана енгізіледі.',
              'Контролирует текущую работу и сроки этапов проектов: уведомление о просроченном шаге направляется в том числе ему. Должность вводится, только если она предусмотрена обновлённым уставом.',
              'Oversees day-to-day work and project stage deadlines, and is notified when a step is overdue. The post is introduced only if the updated charter provides for it.',
              '负责监督日常工作和项目阶段的时间节点，步骤逾期时会收到提醒。仅当更新后的章程设置该职位时才予设立。',
            ),
          },
          {
            icon: 'eye',
            title: t('Ревизор', 'Ревизор', 'Auditor', '审计员'),
            text: t(
              'Қаржылық есептерді және аудит журналын тәуелсіз тексереді. Порталда оларды тек оқу режимінде көреді.',
              'Независимо проверяет финансовые отчёты и журнал аудита. На портале ему доступен только режим чтения.',
              'Independently reviews the financial statements and the audit log. In the portal the Auditor has read-only access.',
              '独立审查财务报告与审计日志，在门户中仅拥有只读权限。',
            ),
          },
        ],
      },
      {
        type: 'cards',
        heading: t(
          'Жұмыс органдары мен функциялар',
          'Рабочие органы и функции',
          'Working bodies and functions',
          '工作机构与职能',
        ),
        columns: 3,
        items: [
          {
            icon: 'chart',
            title: t(
              'Инвестициялық жобаларды бағалау комитеті',
              'Комитет по оценке инвестиционных проектов',
              'Investment Projects Evaluation Committee',
              '投资项目评估委员会',
            ),
            text: t(
              'Жобалар сараптамасы бойынша шешім қабылдайды, 3-деңгейге көтеруді бекітеді. Комитет мүшесі инвесторды бағалауда сарапшымен бірге баға қояды.',
              'Принимает решения по экспертизе проектов и утверждает перевод проекта на уровень 3. Член комитета ставит оценку инвестору совместно с экспертом.',
              'Takes decisions on project expert review and approves a project’s move to Level 3. A committee member scores an investor together with an expert.',
              '就项目专家评审作出决定，并批准项目升至3级。委员会成员与专家共同为投资者评分。',
            ),
          },
          {
            icon: 'shield-check',
            title: t('Комплаенс функциясы', 'Функция комплаенс', 'Compliance function', '合规职能'),
            text: t(
              'Комплаенс ветосын қолданады, санкциялық тексеру нәтижелерін қарайды және мүдделер қақтығысы декларацияларын бақылайды.',
              'Применяет комплаенс-вето, рассматривает результаты санкционных проверок и контролирует декларации о конфликте интересов.',
              'Applies the compliance veto, reviews sanctions screening results and oversees conflict-of-interest declarations.',
              '行使合规否决权，审阅制裁筛查结果，并监督利益冲突声明。',
            ),
          },
          {
            icon: 'document',
            title: t('Хатшылық', 'Секретариат', 'Secretariat', '秘书处'),
            text: t(
              'Өтініштерді қабылдайды, алғашқы тексеру жасайды, мүшелер мен инвесторлар базасын (CRM) жүргізеді және іс-шараларды ұйымдастырады.',
              'Принимает заявки, проводит первичную проверку, ведёт базу членов и инвесторов (CRM) и организует мероприятия.',
              'Receives applications, carries out the initial check, and maintains the member and investor records (CRM) and the events programme.',
              '受理申请，开展初步审核，管理会员与投资者档案（CRM）并组织活动。',
            ),
          },
          {
            icon: 'sparkle',
            title: t('Сарапшылық кеңестер', 'Экспертные советы', 'Expert councils', '专家委员会'),
            text: t(
              'Қаржы, құқық, техника, нарық және экология бойынша қорытынды дайындайды. Мүдделер қақтығысы бар сарапшы баға қоймайды.',
              'Готовят заключения по финансам, праву, технике, рынку и экологии. Эксперт с конфликтом интересов оценку не ставит.',
              'Prepare opinions on finance, legal, technical, market and environmental matters. An expert with a conflict of interest does not score.',
              '就财务、法律、技术、市场与环境出具意见。存在利益冲突的专家不得评分。',
            ),
          },
          {
            icon: 'pin',
            title: t(
              'Өңірлік және шетелдік өкілдер',
              'Региональные и зарубежные представители',
              'Regional and overseas representatives',
              '地区及海外代表',
            ),
            text: t(
              'Өз өңірінің немесе елінің жобалары мен инвесторлары бойынша жұмыс істейді және тоқсан сайын есеп жібереді.',
              'Работают с проектами и инвесторами своего региона или страны и ежеквартально направляют отчёт.',
              'Work with the projects and investors of their own region or country and submit a quarterly report.',
              '负责本地区或本国的项目与投资者工作，并按季度提交报告。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        title: t('Өкілеттіктер туралы', 'О полномочиях', 'On powers', '关于权限'),
        text: t(
          'Өкілеттіктер жаңартылған жарғы бекітілгеннен кейін жарияланады. Осы беттегі сипаттамалар органдардың рөлін жалпы түрде түсіндіреді және жарғының орнын баспайды.',
          'Полномочия будут опубликованы после утверждения обновлённого устава. Описания на этой странице в общем виде поясняют роль органов и не заменяют устав.',
          'Powers will be published once the updated charter has been approved. The descriptions on this page explain the role of each body in general terms and do not replace the charter.',
          '各机构的权限将在更新后的章程获批后公布。本页说明仅概括介绍各机构的作用，不能替代章程。',
        ),
      },
      {
        type: 'links',
        heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
        items: [
          {
            label: t('Тұлғалар мен команда', 'Люди и команда', 'People and team', '人员与团队'),
            href: '/about/people',
            text: t(
              'Басшылық, хатшылық, сарапшылар мен өкілдер профильдері.',
              'Профили руководства, секретариата, экспертов и представителей.',
              'Profiles of the leadership, Secretariat, experts and representatives.',
              '领导层、秘书处、专家与代表的简介。',
            ),
          },
          {
            label: t('Құжаттар', 'Документы', 'Documents', '文件'),
            href: '/about/documents',
            text: t(
              'Жарғы, стратегия және ішкі ережелер.',
              'Устав, стратегия и внутренние правила.',
              'The charter, the strategy and internal rules.',
              '章程、战略与内部规则。',
            ),
          },
        ],
      },
    ],
    cta: {
      title: t(
        'Ашықтық қалай қамтамасыз етіледі?',
        'Как обеспечивается прозрачность?',
        'How is transparency ensured?',
        '如何保障透明度？',
      ),
      text: t(
        'Мүдделер қақтығысы саясаты, сыбайлас жемқорлыққа қарсы тәртіп және шағым беру жолы.',
        'Политика по конфликту интересов, антикоррупционный порядок и путь подачи жалобы.',
        'Conflict-of-interest policy, anti-corruption rules and how to raise a complaint.',
        '利益冲突政策、反腐败规则以及投诉渠道。',
      ),
      label: t('Ашықтық пен этика', 'Прозрачность и этика', 'Transparency and ethics', '透明与道德'),
      href: '/about/ethics',
    },
  },

  // 4. Ашықтық пен этика
  {
    path: '/about/ethics',
    section: 'about',
    title: t('Ашықтық пен этика', 'Прозрачность и этика', 'Transparency and ethics', '透明与道德'),
    description: t(
      'Қауымдастық мүдделер қақтығысын бақылайды, сыбайлас жемқорлыққа қарсы тәртіп ұстанады және шағым беру жолын ашық көрсетеді.',
      'Ассоциация контролирует конфликт интересов, соблюдает антикоррупционный порядок и открыто указывает путь подачи жалоб.',
      'The Association manages conflicts of interest, follows anti-corruption rules and sets out openly how to raise a complaint.',
      '协会管控利益冲突，遵循反腐败规则，并公开说明投诉渠道。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        heading: t('Ашықтық қағидаты', 'Принцип прозрачности', 'The principle of transparency', '透明原则'),
        text: t(
          'Қауымдастықтың беделі ашықтыққа сүйенеді. Осы бетте мүдделер қақтығысы қалай бақыланатыны, сыбайлас жемқорлыққа қарсы тәртіп, комплаенс ветосы және шағым беру жолы түсіндіріледі. Ішкі ережелердің мәтіні «Құжаттар» бөлімінде орналастырылады.',
          'Репутация ассоциации основана на прозрачности. На этой странице объясняется, как контролируется конфликт интересов, каков антикоррупционный порядок, как работает комплаенс-вето и как подать жалобу. Тексты внутренних правил размещаются в разделе «Документы».',
          'The Association’s reputation rests on transparency. This page explains how conflicts of interest are managed, what the anti-corruption rules are, how the compliance veto works and how to raise a complaint. The text of the internal rules is placed in the “Documents” section.',
          '协会的声誉建立在透明之上。本页说明如何管控利益冲突、反腐败规则、合规否决权的运作方式以及投诉渠道。内部规则的文本将发布在“文件”栏目。',
        ),
      },
      {
        type: 'cards',
        heading: t(
          'Мүдделер қақтығысы саясаты',
          'Политика по конфликту интересов',
          'Conflict-of-interest policy',
          '利益冲突政策',
        ),
        columns: 3,
        items: [
          {
            icon: 'document',
            title: t('Декларация', 'Декларация', 'Declaration', '利益冲突声明'),
            text: t(
              'Сарапшылар мен комитет мүшелері байланысты тараптар туралы мүдделер қақтығысы декларациясын тапсырады.',
              'Эксперты и члены комитета подают декларацию о конфликте интересов с указанием связанных сторон.',
              'Experts and committee members submit a conflict-of-interest declaration naming any connected parties.',
              '专家与委员会成员须提交利益冲突声明，说明相关关联方。',
            ),
          },
          {
            icon: 'eye',
            title: t(
              'Көре алады, баға қоя алмайды',
              'Видит, но не оценивает',
              'May view, may not score',
              '可查看，不可评分',
            ),
            text: t(
              'Мүдделер қақтығысы бар сарапшы жобаны көре алады, бірақ баға қоя алмайды және дауыс бере алмайды.',
              'Эксперт с конфликтом интересов может видеть проект, но не вправе ставить оценку и голосовать.',
              'An expert with a conflict of interest may view the project but may not score it or vote on it.',
              '存在利益冲突的专家可以查看项目，但不得评分，也不得参与表决。',
            ),
          },
          {
            icon: 'lock',
            title: t('Автоматты бұғаттау', 'Автоматическая блокировка', 'Automatic blocking', '系统自动限制'),
            text: t(
              'Жүйе мұндай сарапшыны сәйкес жоба бойынша баға қоюдан автоматты түрде бұғаттайды.',
              'Система автоматически блокирует такому эксперту выставление оценки по соответствующему проекту.',
              'The system automatically blocks such an expert from scoring the project concerned.',
              '系统会自动限制该专家对相关项目评分。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Сыбайлас жемқорлыққа қарсы тәртіп',
          'Антикоррупционный порядок',
          'Anti-corruption rules',
          '反腐败规则',
        ),
        text: t(
          'Сыбайлас жемқорлыққа қарсы тәртіптің толық мәтіні бекітілгеннен кейін «Құжаттар» бөлімінде жарияланады. Портал жүйесі тәртіпті бірнеше тетікпен қолдайды:\n- баға екі тұлғамен қойылады: сарапшы мен комитет мүшесі;\n- әр өлшем бойынша балл дәлелдеме мәтінімен және файлдарымен расталады;\n- өзгерістер өшірілмейтін аудит журналына жазылады;\n- мүшелік жарнасы мен жобалық қызмет ақысы бөлек есепке алынады.',
          'Полный текст антикоррупционного порядка будет опубликован в разделе «Документы» после утверждения. Портал поддерживает этот порядок рядом механизмов:\n- оценку ставят два человека: эксперт и член комитета;\n- балл по каждому критерию подтверждается текстом обоснования и файлами;\n- изменения записываются в журнал аудита, который нельзя удалить;\n- членский взнос и плата за проектные услуги учитываются раздельно.',
          'The full text of the anti-corruption rules will be published in the “Documents” section once approved. The portal supports them through several built-in safeguards:\n- every score is set by two people: an expert and a committee member;\n- each score is backed by a written justification and evidence files;\n- changes are recorded in an audit log that cannot be deleted;\n- the membership fee and project service fees are accounted for separately.',
          '反腐败规则的完整文本将在批准后发布在“文件”栏目。门户通过多项机制支持这些规则：\n- 评分由两人共同完成：一名专家和一名委员会成员；\n- 每项评分须附书面依据和证明文件；\n- 所有变更均记入不可删除的审计日志；\n- 会员费与项目服务费分别核算。',
        ),
      },
      {
        type: 'paragraphs',
        heading: t('Комплаенс ветосы', 'Комплаенс-вето', 'Compliance veto', '合规否决权'),
        text: t(
          'Комплаенс қызметкері күмәнді қаражат, жалған құжат немесе санкциялық тәуекел анықталса, инвесторға жалпы баллға қарамастан «тоқтатылды» мәртебесін қояды. Вето себебі міндетті түрде жазылады. Инвесторлар БҰҰ, ЕО, АҚШ (OFAC) және Ұлыбритания ашық санкциялық тізімдері бойынша тексеріледі, нәтиже комплаенс қызметкеріне жіберіледі.\n\nКомплаенс ветосы ішкі басқару құралы болып табылады. Ол ресми рейтинг емес және қаржылық кепілдік бермейді.',
          'Если выявлены сомнительные средства, поддельный документ или санкционный риск, сотрудник по комплаенсу присваивает инвестору статус «приостановлено» независимо от общего балла. Причина вето указывается обязательно. Инвесторы проверяются по открытым санкционным спискам (ООН, ЕС, OFAC США, Великобритания), результат направляется сотруднику по комплаенсу.\n\nКомплаенс-вето является внутренним инструментом управления. Оно не представляет собой официальный рейтинг и не даёт финансовых гарантий.',
          'If doubtful funds, a forged document or a sanctions risk is found, the compliance officer places the investor on “suspended” status regardless of the total score. A reason for the veto must always be recorded. Investors are screened against open sanctions lists (UN, EU, US OFAC and UK), and the result is passed to the compliance officer.\n\nThe compliance veto is an internal management tool. It is not an official rating and does not provide a financial guarantee.',
          '一旦发现来源存疑的资金、伪造文件或制裁风险，合规专员无论总分多少，均可将投资者状态设为“已暂停”，并且必须记录原因。投资者将依据公开制裁名单（联合国、欧盟、美国OFAC、英国）接受筛查，结果提交合规专员。\n\n合规否决权是内部管理工具。它不是官方评级，也不构成财务担保。',
        ),
      },
      {
        type: 'paragraphs',
        heading: t('Шағым беру тәртібі', 'Порядок подачи жалоб', 'How to raise a complaint', '投诉渠道'),
        text: t(
          'Қауымдастықтың жұмысына, сарапшылардың әрекетіне немесе порталдағы мәтінге қатысты шағым болса, оны «Байланыс» бетіндегі кері байланыс формасы арқылы жіберуге болады. Арнайы шағым формасы кейін қосылады. Шағымды қарау мерзімі мен тәртібі бекітілгеннен кейін осы бетте жарияланады.\n\nХабарламада мына деректерді көрсетіңіз:\n- шағымның қысқаша мазмұны;\n- қатысты жоба, инвестор, сарапшы немесе оқиға, егер бар болса;\n- жауап алу үшін байланыс деректері.',
          'Если у вас есть жалоба на работу ассоциации, действия экспертов или текст на портале, направьте её через форму обратной связи на странице «Контакты». Специальная форма для жалоб будет добавлена позднее. Сроки и порядок рассмотрения жалоб будут опубликованы на этой странице после их утверждения.\n\nУкажите в сообщении:\n- краткое содержание жалобы;\n- связанный проект, инвестора, эксперта или событие, если они есть;\n- контактные данные для ответа.',
          'If you have a complaint about the Association’s work, the conduct of an expert or a text on the portal, send it through the feedback form on the Contacts page. A dedicated complaint form will be added later. The time limits and procedure for handling complaints will be published on this page once they have been approved.\n\nPlease include in your message:\n- a short summary of the complaint;\n- the project, investor, expert or event concerned, if any;\n- your contact details so that we can reply.',
          '如对协会的工作、专家的行为或门户上的内容有投诉，可通过“联系我们”页面的反馈表提交。专门的投诉表单将于稍后上线。投诉的处理期限与程序将在批准后公布在本页。\n\n请在留言中说明：\n- 投诉的简要内容；\n- 相关的项目、投资者、专家或事件（如有）；\n- 供我们回复的联系方式。',
        ),
      },
    ],
    cta: {
      title: t(
        'Шағым немесе сұрақ бар ма?',
        'Есть жалоба или вопрос?',
        'Have a complaint or a question?',
        '有投诉或疑问吗？',
      ),
      text: t(
        'Хабарламаңызды «Байланыс» беті арқылы жіберіңіз.',
        'Отправьте сообщение через страницу «Контакты».',
        'Send your message through the Contacts page.',
        '请通过“联系我们”页面留言。',
      ),
      label: t('Байланыс', 'Контакты', 'Contact us', '联系我们'),
      href: '/contacts',
    },
  },

  // 5. Қызметтер (8 қызметтің тізімін код өзі шығарады)
  {
    path: '/services',
    section: 'services',
    title: t('Қызметтер', 'Услуги', 'Services', '服务'),
    description: t(
      'Сегіз қызмет бағыты халықаралық инвесторды іздеуден жоба нәтижесін бағалауға дейінгі инвестицияның бүкіл жолын қамтиды.',
      'Восемь направлений услуг охватывают весь путь инвестиции: от поиска международного инвестора до оценки результата проекта.',
      'Eight service lines cover the whole investment journey, from finding an international investor to assessing the result of a project.',
      '八大服务方向覆盖投资全流程，从寻找国际投资者到评估项目成果。',
    ),
    blocks: [
      {
        type: 'paragraphs',
        heading: t(
          'Инвестицияның бүкіл жолын қамтитын сегіз бағыт',
          'Восемь направлений на всём пути инвестиции',
          'Eight service lines for the whole investment journey',
          '覆盖投资全流程的八大方向',
        ),
        text: t(
          'Қауымдастықтың сегіз қызмет бағыты инвестицияның бүкіл жолын қамтиды: халықаралық инвесторды табудан және жобаны іріктеуден бастап қаржыландыруды құрылымдауға, нарыққа кіруге және нәтижені бағалауға дейін. Әр бағыттың жеке беті бар: онда кімге арналғаны, жұмыс кезеңдері, күтілетін нәтиже және жауапкершілік шекарасы көрсетілген. Қызметтер мемлекеттік оператордың ресми сүйемелдеуін алмастырмайды, оны нарықтық тәжірибемен толықтырады.',
          'Восемь направлений услуг ассоциации охватывают весь путь инвестиции: от поиска международного инвестора и отбора проекта до структурирования финансирования, выхода на рынок и оценки результата. У каждого направления есть отдельная страница: на ней указано, для кого оно, этапы работы, ожидаемый результат и граница ответственности. Услуги не заменяют официальное сопровождение государственного оператора, а дополняют его рыночным опытом.',
          'The Association’s eight service lines cover the whole investment journey, from finding an international investor and selecting a project to structuring finance, entering the market and assessing the result. Each line has its own page showing who it is for, the stages of work, the expected result and the limits of our responsibility. The services do not replace the official support of the state operator; they complement it with market experience.',
          '协会的八大服务方向覆盖投资全流程：从寻找国际投资者、遴选项目，到融资结构设计、市场准入和成果评估。每个方向都有独立页面，说明服务对象、工作阶段、预期成果与责任边界。这些服务不取代国家运营机构的官方服务，而是以市场化经验加以补充。',
        ),
      },
      {
        type: 'cards',
        heading: t('Қызметтер кімге арналған', 'Для кого эти услуги', 'Who the services are for', '服务对象'),
        columns: 3,
        items: [
          {
            icon: 'globe',
            title: t('Инвесторларға', 'Инвесторам', 'For investors', '致投资者'),
            text: t(
              'Тексерілген жобалар қоры, жергілікті серіктестер және құқықтық бағдар.',
              'Проверенный пул проектов, местные партнёры и правовые ориентиры.',
              'A vetted project pool, local partners and legal guidance.',
              '经审核的项目库、本地合作伙伴与法律指引。',
            ),
            href: '/investors',
          },
          {
            icon: 'layers',
            title: t('Жоба иелеріне', 'Владельцам проектов', 'For project owners', '致项目方'),
            text: t(
              'Жобаны сараптамадан өткізіп, оның ауқымы мен саласына сай инвестор табуға көмектесеміз.',
              'Проводим экспертизу проекта и помогаем найти инвестора под его масштаб и отрасль.',
              'We put the project through expert review and help to find an investor that fits its scale and sector.',
              '我们对项目进行专家评审，并协助按规模与行业匹配合适的投资者。',
            ),
            href: '/projects/submit',
          },
          {
            icon: 'user',
            title: t('Мүшелерге', 'Членам ассоциации', 'For members', '致会员'),
            text: t(
              'Салалық желі, мүдделерді білдіру және мемлекетпен сындарлы диалог алаңы.',
              'Отраслевая сеть, представление интересов и площадка для конструктивного диалога с государством.',
              'An industry network, representation of interests and a platform for constructive dialogue with the state.',
              '行业网络、利益代表，以及与政府开展建设性对话的平台。',
            ),
            href: '/membership',
          },
        ],
      },
      {
        type: 'steps',
        heading: t('Қалай жұмыс істейміз', 'Как мы работаем', 'How we work', '工作方式'),
        lead: t(
          'Әр бағыттың жеке кезеңдері бар, ал жалпы жол бірдей.',
          'У каждого направления свои этапы, а общий путь един.',
          'Each line has its own stages, but the overall route is the same.',
          '每个方向有各自的工作阶段，但总体路径一致。',
        ),
        items: [
          {
            title: t('Сұранысты қабылдау', 'Приём запроса', 'Receiving your enquiry', '受理咨询'),
            text: t(
              'Сұранысыңызды «Байланыс» беті арқылы қалдырасыз немесе инвестор, жоба, мүшелік өтінішін жібересіз.',
              'Вы оставляете запрос через страницу «Контакты» либо подаёте заявку инвестора, проекта или членства.',
              'You leave an enquiry through the Contacts page, or submit an investor, project or membership application.',
              '您可通过“联系我们”页面留言，或提交投资者、项目或入会申请。',
            ),
          },
          {
            title: t('Алғашқы тексеру', 'Первичная проверка', 'Initial check', '初步审核'),
            text: t(
              'Хатшылық өтінішті алғашқы тексереді және оған сай қызмет бағытын анықтайды.',
              'Секретариат проводит первичную проверку заявки и определяет подходящее направление услуг.',
              'The Secretariat carries out an initial check of the application and identifies the right service line.',
              '秘书处对申请进行初步审核，并确定适合的服务方向。',
            ),
          },
          {
            title: t('Бағалау және тексеру', 'Оценка и проверка', 'Assessment and vetting', '评估与审核'),
            text: t(
              'Инвестор 100 балдық ішкі бағалаудан және комплаенс тексеруінен өтеді, жоба сараптама мен деңгей беру рәсімінен өтеді.',
              'Инвестор проходит внутреннюю 100-балльную оценку и комплаенс-проверку, проект проходит экспертизу и присвоение уровня.',
              'The investor goes through the 100-point internal assessment and a compliance check; the project goes through expert review and level assignment.',
              '投资者接受100分内部评估与合规审查；项目接受专家评审并确定等级。',
            ),
          },
          {
            title: t('Сәйкестендіру және келіссөз', 'Подбор и переговоры', 'Matching and negotiation', '匹配与谈判'),
            text: t(
              'Жүйе жобаға сай инвесторларды ұсынады, соңғы шешімді менеджер қабылдайды. Деректер бөлмесі NDA-ға қол қойылғаннан кейін ашылады.',
              'Система предлагает подходящих инвесторов, окончательное решение принимает менеджер. Дата-рум открывается после подписания NDA.',
              'The system proposes suitable investors and the manager takes the final decision. The data room opens once the NDA is signed.',
              '系统推荐与项目相匹配的投资者，由经理作出最终决定。签署保密协议（NDA）后开放数据室。',
            ),
          },
          {
            title: t(
              'Құрылымдау және келісу',
              'Структурирование и согласование',
              'Structuring and agreement',
              '结构设计与签约',
            ),
            text: t(
              'Қаржыландыру моделі мен келісімдер құрылымдалады. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады.',
              'Структурируются модель финансирования и соглашения. Финансирование осуществляют организации, имеющие лицензию.',
              'The financing model and agreements are structured. Financing is provided by licensed organisations.',
              '设计融资模式并拟定各项协议。融资由持牌机构提供。',
            ),
          },
          {
            title: t(
              'Сүйемелдеу және есеп',
              'Сопровождение и отчётность',
              'Support and reporting',
              '全程支持与汇报',
            ),
            text: t(
              'Іске асыру мониторингі жүргізіледі, нәтиже төрт бөлек есеппен көрсетіледі.',
              'Ведётся мониторинг реализации, результат показывается в четырёх раздельных отчётах.',
              'Implementation is monitored and the result is shown in four separate ledgers.',
              '对实施情况进行监测，成果以四本独立账目呈现。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады: қауымдастық құрылымдауға ғана көмектеседі. Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді. Қызметтер инвестициялық табысқа, мемлекеттік рұқсатқа, жеңілдікке немесе мәміленің жасалуына кепілдік бермейді.',
          'Финансирование осуществляют организации, имеющие лицензию: ассоциация лишь помогает со структурированием. Ассоциация не является государственным органом и не действует от имени государственных органов. Услуги не гарантируют инвестиционный доход, государственное разрешение, льготы или заключение сделки.',
          'Financing is provided by licensed organisations; the Association only helps with structuring. The Association is not a government body and does not act on behalf of government bodies. The services do not guarantee investment returns, government permits, incentives or the conclusion of a deal.',
          '融资由持牌机构提供，协会仅协助进行结构设计。协会不是政府机构，亦不代表任何政府机构行事。这些服务不保证投资收益、政府许可、优惠政策或交易达成。',
        ),
      },
    ],
    cta: {
      title: t(
        'Қай бағыт қажет екенін білмейсіз бе?',
        'Не знаете, какое направление вам нужно?',
        'Not sure which line you need?',
        '不确定需要哪项服务？',
      ),
      text: t(
        'Сұранысыңызды қалдырыңыз, қауымдастық сізге сай бағытты анықтауға көмектеседі.',
        'Оставьте запрос, и ассоциация поможет определить подходящее направление.',
        'Leave an enquiry and the Association will help you identify the right line.',
        '请留下咨询，协会将协助您确定合适的服务方向。',
      ),
      label: t('Сұраныс қалдыру', 'Оставить запрос', 'Leave an enquiry', '提交咨询'),
      href: '/contacts',
    },
  },

  // 6. Құпиялылық саясаты
  {
    path: '/legal/privacy',
    section: 'legal',
    title: t(
      'Құпиялылық саясаты',
      'Политика конфиденциальности',
      'Privacy policy',
      '隐私政策',
    ),
    description: t(
      'Порталда қандай дербес деректер жиналатыны, қалай сақталатыны және пайдаланушының құқықтары қандай екені түсіндіріледі.',
      'Объясняем, какие персональные данные собираются на портале, как они хранятся и какие права есть у пользователя.',
      'Explains what personal data the portal collects, how it is stored and what rights users have.',
      '说明门户收集哪些个人数据、如何存储，以及用户享有哪些权利。',
    ),
    blocks: [
      draftNotice,
      {
        type: 'paragraphs',
        heading: t('Жалпы ережелер', 'Общие положения', 'General provisions', '总则'),
        text: t(
          'Бұл саясат «Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігі (бұдан әрі: оператор) порталда пайдаланушылардың дербес деректерін қалай жинайтынын, пайдаланатынын және қорғайтынын түсіндіреді. Оператор Қазақстан Республикасының «Дербес деректер және оларды қорғау туралы» Заңын басшылыққа алады. Деректерді жинауға келісім әр формада бөлек беріледі, оның мәтіні «Дербес деректерді өңдеуге келісім» бетінде жарияланған.',
          'Настоящая политика объясняет, как объединение юридических лиц «Казахстанская ассоциация иностранного капитала» (далее: оператор) собирает, использует и защищает персональные данные пользователей на портале. Оператор руководствуется Законом Республики Казахстан «О персональных данных и их защите». Согласие на сбор данных даётся отдельно в каждой форме, его текст опубликован на странице «Согласие на обработку персональных данных».',
          'This policy explains how the Kazakhstan Association of Foreign Capital, an association of legal entities (the “Operator”), collects, uses and protects users’ personal data on the portal. The Operator is guided by the Law of the Republic of Kazakhstan “On Personal Data and Their Protection”. Consent to data collection is given separately in each form, and its text is published on the “Consent to personal data processing” page.',
          '本政策说明哈萨克斯坦外国资本协会（法人联合体，以下简称“运营方”）如何在门户上收集、使用和保护用户的个人数据。运营方遵循《哈萨克斯坦共和国个人数据及其保护法》。数据收集的同意在每个表单中单独作出，同意书文本发布在《个人数据处理同意书》页面。',
        ),
      },
      operatorFacts,
      {
        type: 'cards',
        heading: t('Қандай деректер жиналады', 'Какие данные собираются', 'What data is collected', '收集哪些数据'),
        lead: t(
          'Деректер ең аз көлемде жиналады: тек тиісті қызмет үшін қажеттісі сұралады.',
          'Данные собираются в минимальном объёме: запрашивается только то, что нужно для конкретной услуги.',
          'Data is collected in the minimum volume: only what is needed for the service concerned is requested.',
          '数据按最小范围收集：仅索取相关服务所必需的信息。',
        ),
        columns: 3,
        items: [
          {
            icon: 'user',
            title: t('Аккаунт деректері', 'Данные аккаунта', 'Account data', '账户数据'),
            text: t(
              'Аты, электрондық пошта, таңдалған тіл және рөл: инвестор, жоба иесі немесе мүше.',
              'Имя, адрес электронной почты, выбранный язык и роль: инвестор, владелец проекта или член ассоциации.',
              'Name, email address, chosen language and role: investor, project owner or member.',
              '姓名、电子邮箱、所选语言与角色：投资者、项目方或会员。',
            ),
          },
          {
            icon: 'document',
            title: t('Өтініш деректері', 'Данные заявок', 'Application data', '申请数据'),
            text: t(
              'Инвестор, жоба және мүшелік өтініштерінде көрсетілген компания, бенефициар, өкілетті өкіл, қызығушылық және жоба деректері, жүктелген құжаттар.',
              'Сведения о компании, бенефициаре, уполномоченном представителе, интересах и проекте из заявок инвестора, проекта и членства, а также загруженные документы.',
              'Company, beneficial owner, authorised representative, interest and project details given in investor, project and membership applications, and uploaded documents.',
              '投资者、项目和入会申请中填写的公司、受益人、授权代表、关注领域与项目信息，以及上传的文件。',
            ),
          },
          {
            icon: 'lock',
            title: t('Комплаенс деректері', 'Данные комплаенс-проверки', 'Compliance data', '合规审查数据'),
            text: t(
              'Жеке сәйкестендіру нөмірлері мен төлқұжат көшірмелері тек комплаенс кезеңінде және тек жабық қоймада өңделеді.',
              'Индивидуальные идентификационные номера и копии паспортов обрабатываются только на этапе комплаенса и только в закрытом хранилище.',
              'Personal identification numbers and passport scans are processed only at the compliance stage and only in closed storage.',
              '个人识别号码和护照扫描件仅在合规审查阶段处理，并仅存放在封闭存储中。',
            ),
          },
          {
            icon: 'shield',
            title: t('Техникалық деректер', 'Технические данные', 'Technical data', '技术数据'),
            text: t(
              'Кіру тарихы, NDA-ға қол қойылған уақыт, IP-мекенжай және деректер бөлмесіндегі әрекеттер журналы.',
              'История входов, время подписания NDA, IP-адрес и журнал действий в дата-руме.',
              'Login history, the time an NDA was signed, the IP address and the log of actions in the data room.',
              '登录记录、签署保密协议（NDA）的时间、IP地址以及数据室操作日志。',
            ),
          },
          {
            icon: 'mail',
            title: t('Хабарламалар', 'Обращения', 'Messages', '来函留言'),
            text: t(
              'Кері байланыс формасы арқылы жіберген хабарламаңыз бен байланыс деректеріңіз.',
              'Ваше сообщение и контактные данные, отправленные через форму обратной связи.',
              'Your message and contact details sent through the feedback form.',
              '您通过反馈表提交的留言及联系方式。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Деректерді пайдалану, сақтау және қорғау',
          'Использование, хранение и защита данных',
          'Use, storage and protection of data',
          '数据的使用、存储与保护',
        ),
        text: t(
          'Деректер өтініштерді қарау, инвесторды бағалау, жоба мен инвесторды сәйкестендіру, NDA рәсімі, байланыс және порталдың қауіпсіздігі үшін ғана пайдаланылады. Қызметкерлер мен сарапшылар деректерге тек өз рөлінің құқығы шегінде қол жеткізеді.\n\nДеректер базасы Қазақстан аумағындағы серверде орналасады. Статикалық файлдар үшін шетелдік CDN қолданылуы мүмкін, бірақ дербес деректер ол арқылы өтпейді. Деректер базасы мен сақтық көшірмелер шифрланады.',
          'Данные используются только для рассмотрения заявок, оценки инвесторов, подбора проектов и инвесторов, процедуры NDA, связи с пользователем и обеспечения безопасности портала. Сотрудники и эксперты получают доступ к данным только в пределах прав своей роли.\n\nБаза данных размещается на сервере на территории Казахстана. Для статических файлов может использоваться зарубежная CDN, но персональные данные через неё не передаются. База данных и резервные копии шифруются.',
          'Data is used only to review applications, assess investors, match projects with investors, conduct the NDA procedure, stay in touch with users and keep the portal secure. Staff and experts access data only within the rights of their role.\n\nThe database is hosted on a server located in Kazakhstan. A foreign CDN may be used for static files, but personal data does not pass through it. The database and backups are encrypted.',
          '数据仅用于审核申请、评估投资者、匹配项目与投资者、办理保密协议（NDA）手续、与用户保持联系以及保障门户安全。工作人员与专家仅可在其角色权限范围内访问数据。\n\n数据库部署在哈萨克斯坦境内的服务器上。静态文件可使用境外CDN，但个人数据不经由CDN传输。数据库及备份均经过加密。',
        ),
      },
      {
        type: 'cards',
        heading: t('Сіздің құқықтарыңыз', 'Ваши права', 'Your rights', '您的权利'),
        columns: 2,
        items: [
          {
            title: t('Деректерді жүктеп алу', 'Выгрузка данных', 'Download your data', '导出数据'),
            text: t(
              'Жеке кабинеттен өз деректеріңізді жүктеп аласыз.',
              'Вы можете выгрузить свои данные из личного кабинета.',
              'You can download your data from your personal account.',
              '您可以在个人账户中导出自己的数据。',
            ),
          },
          {
            title: t('Жоюды сұрау', 'Запрос на удаление', 'Request deletion', '申请删除'),
            text: t(
              'Деректерді немесе аккаунтты жоюды сұрай аласыз. Жою сұранысы аудитке жазылады.',
              'Вы можете запросить удаление данных или аккаунта. Запрос на удаление фиксируется в журнале аудита.',
              'You can ask for your data or account to be deleted. A deletion request is recorded in the audit log.',
              '您可以申请删除数据或账户。删除申请会记入审计日志。',
            ),
          },
          {
            title: t('Сұрақ қою', 'Вопросы об обработке', 'Ask a question', '咨询'),
            text: t(
              'Деректердің қалай өңделетіні туралы «Байланыс» беті арқылы сұрақ қоюға болады.',
              'Вопрос о том, как обрабатываются данные, можно задать через страницу «Контакты».',
              'You can ask how your data is processed through the Contacts page.',
              '您可通过“联系我们”页面咨询数据的处理方式。',
            ),
          },
          {
            title: t('Заңнамалық құқықтар', 'Права по закону', 'Rights under the law', '法定权利'),
            text: t(
              'Қазақстан Республикасының заңнамасында көзделген басқа құқықтарыңыз сақталады.',
              'Сохраняются и иные ваши права, предусмотренные законодательством Республики Казахстан.',
              'Your other rights under the legislation of the Republic of Kazakhstan remain in force.',
              '您依据哈萨克斯坦共和国法律享有的其他权利同样有效。',
            ),
          },
        ],
      },
    ],
    cta: {
      title: t(
        'Деректеріңізге қатысты сұрақ бар ма?',
        'Есть вопрос о ваших данных?',
        'A question about your data?',
        '对您的数据有疑问？',
      ),
      text: t(
        'Дербес деректерді өңдеу туралы сұрағыңызды «Байланыс» беті арқылы жіберіңіз.',
        'Направьте вопрос об обработке персональных данных через страницу «Контакты».',
        'Send your question about personal data processing through the Contacts page.',
        '有关个人数据处理的问题，请通过“联系我们”页面提交。',
      ),
      label: t('Байланыс', 'Контакты', 'Contact us', '联系我们'),
      href: '/contacts',
    },
  },

  // 7. Пайдалану шарттары
  {
    path: '/legal/terms',
    section: 'legal',
    title: t('Пайдалану шарттары', 'Условия использования', 'Terms of use', '使用条款'),
    description: t(
      'Порталды пайдалану шарттары: қызметтің сипаты, пайдаланушының міндеттері, құпия материалдар мен жауапкершіліктің шегі.',
      'Условия использования портала: характер сервиса, обязанности пользователя, конфиденциальные материалы и пределы ответственности.',
      'Terms of use of the portal: the nature of the service, user obligations, confidential materials and the limits of liability.',
      '门户使用条款：服务性质、用户义务、保密材料以及责任限度。',
    ),
    blocks: [
      draftNotice,
      {
        type: 'paragraphs',
        heading: t('Порталдың сипаты', 'Характер портала', 'Nature of the portal', '门户性质'),
        text: t(
          'Портал шетелдік инвесторларды Қазақстанның тексерілген жобаларымен байланыстыратын инвестициялық платформа. Ол жаңалық сайты емес: онда инвесторды бағалау, жобалар қоры, сәйкестендіру және нәтижені есепке алу жүргізіледі. Қауымдастық мемлекеттік орган емес, ал порталдағы мәліметтер инвестициялық табысқа кепілдік болып табылмайды.',
          'Портал является инвестиционной платформой, которая связывает иностранных инвесторов с проверенными проектами Казахстана. Это не новостной сайт: на нём ведутся оценка инвесторов, пул проектов, подбор и учёт результата. Ассоциация не является государственным органом, а сведения на портале не гарантируют инвестиционный доход.',
          'The portal is an investment platform that connects foreign investors with vetted projects in Kazakhstan. It is not a news site: it handles investor assessment, the project pool, matching and results reporting. The Association is not a government body, and information on the portal does not guarantee investment returns.',
          '本门户是连接外国投资者与经审核的哈萨克斯坦项目的投资平台。它不是新闻网站，而是承载投资者评估、项目库、匹配与成果核算的工作平台。协会不是政府机构，门户上的信息不构成投资收益保证。',
        ),
      },
      {
        type: 'cards',
        heading: t('Пайдаланушының міндеттері', 'Обязанности пользователя', 'User obligations', '用户义务'),
        columns: 2,
        items: [
          {
            title: t('Дұрыс деректер', 'Достоверные данные', 'Accurate information', '提供真实信息'),
            text: t(
              'Өтініштер мен жобаларда тек дұрыс және өзекті мәліметтерді көрсетіңіз, оның ішінде нақты бенефициарды.',
              'Указывайте в заявках и проектах только достоверные и актуальные сведения, включая реального бенефициара.',
              'Give only accurate and up-to-date information in applications and projects, including the ultimate beneficial owner.',
              '在申请和项目中仅提供真实、最新的信息，包括最终受益人。',
            ),
          },
          {
            title: t('Аккаунт қауіпсіздігі', 'Безопасность аккаунта', 'Account security', '账户安全'),
            text: t(
              'Кіру деректерін құпия ұстаңыз. Деректер бөлмесін ашу үшін инвестор екі факторлы аутентификацияны қолдануы тиіс.',
              'Храните данные для входа в тайне. Для открытия дата-рума инвестор обязан использовать двухфакторную аутентификацию.',
              'Keep your login details confidential. An investor must use two-factor authentication to open a data room.',
              '妥善保管登录信息。投资者开启数据室须使用双因素认证。',
            ),
          },
          {
            title: t('Құпия материалдар', 'Конфиденциальные материалы', 'Confidential materials', '保密材料'),
            text: t(
              'Деректер бөлмесіндегі құжаттарды тек NDA шарттарында пайдаланыңыз, рұқсатсыз көшірмеңіз және таратпаңыз.',
              'Используйте документы дата-рума только на условиях NDA, не копируйте и не распространяйте их без разрешения.',
              'Use data room documents only on the terms of the NDA, and do not copy or distribute them without permission.',
              '仅在保密协议（NDA）条款范围内使用数据室文件，未经许可不得复制或传播。',
            ),
          },
          {
            title: t('Заңды пайдалану', 'Законное использование', 'Lawful use', '合法使用'),
            text: t(
              'Порталды күмәнді қаражатты жасыру немесе санкцияларды айналып өту үшін пайдалануға болмайды.',
              'Портал нельзя использовать для сокрытия сомнительных средств или обхода санкций.',
              'The portal must not be used to conceal doubtful funds or to circumvent sanctions.',
              '不得利用门户隐匿来源存疑的资金或规避制裁。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t('Қызметтердің шектері', 'Пределы услуг', 'Limits of the services', '服务范围的限度'),
        text: t(
          'Инвесторды 100 балдық бағалау ішкі басқару құралы: ол ресми рейтинг емес, ашық жарияланбайды және инвестор тек өз деңгейін көреді. Жобаның 3-деңгейі (инвестицияға дайын) комитет шешімінсіз берілмейді, ал тексерілмеген жоба ашық каталогқа шықпайды. Сәйкестендіруде соңғы шешімді менеджер қабылдайды, автоматты түрде ештеңе жіберілмейді.\n\nДеректер бөлмесіне қолжетімділік мерзімді (әдепкі 90 күн) және кез келген уақытта кері алынуы мүмкін. Жауапкершілікті шектеу туралы толық мәтін «Жауапкершілікті шектеу» бетінде жарияланған.',
          'Оценка инвестора по 100-балльной шкале является внутренним инструментом управления: она не представляет собой официальный рейтинг, не публикуется открыто, и инвестор видит только свой уровень. Уровень 3 проекта (готов к инвестициям) не присваивается без решения комитета, а непроверенный проект в открытый каталог не попадает. При подборе окончательное решение принимает менеджер, ничего не отправляется автоматически.\n\nДоступ к дата-руму ограничен по сроку (по умолчанию 90 дней) и может быть отозван в любое время. Полный текст об ограничении ответственности опубликован на странице «Ограничение ответственности».',
          'The 100-point assessment of an investor is an internal management tool. It is not an official rating, is not published openly, and an investor sees only their own grade. A project does not reach Level 3 (investment-ready) without a committee decision, and a project that has not been vetted does not appear in the public catalogue. In matching, the manager takes the final decision and nothing is sent automatically.\n\nAccess to a data room is time-limited (90 days by default) and may be withdrawn at any time. The full text on limitation of liability is published on the “Disclaimer” page.',
          '对投资者的100分评估是内部管理工具：它不是官方评级，不会公开发布，投资者只能看到自己的等级。项目未经委员会决定不得升至3级（具备投资条件），未经审核的项目不会进入公开目录。在匹配环节，最终决定由经理作出，系统不会自动发送任何内容。\n\n数据室的访问有期限（默认90天），并可随时撤回。有关责任限制的完整文本发布在《免责声明》页面。',
        ),
      },
      operatorFacts,
      {
        type: 'paragraphs',
        heading: t('Шарттарды өзгерту', 'Изменение условий', 'Changes to the terms', '条款变更'),
        text: t(
          'Шарттар өзгерсе, жаңа нұсқасы осы бетте жарияланады. Зияткерлік меншік, дауларды шешу тәртібі және қолданылатын құқық заңгер бекіткеннен кейін осы бетте нақтыланады.',
          'При изменении условий новая редакция публикуется на этой странице. Вопросы интеллектуальной собственности, порядок разрешения споров и применимое право будут уточнены на этой странице после утверждения юристом.',
          'If the terms change, the new version is published on this page. Intellectual property, dispute resolution and governing law will be set out on this page once approved by a lawyer.',
          '条款如有变更，新版本将发布在本页。知识产权、争议解决和适用法律将在律师批准后在本页补充明确。',
        ),
      },
    ],
    cta: {
      title: t(
        'Жауапкершіліктің шегін қараңыз',
        'Ознакомьтесь с пределами ответственности',
        'See the limits of liability',
        '了解责任限度',
      ),
      text: t(
        'Қауымдастық қандай кепілдік бермейтіні жеке бетте түсіндірілген.',
        'Что ассоциация не гарантирует, объяснено на отдельной странице.',
        'What the Association does not guarantee is explained on a separate page.',
        '协会不提供哪些担保，单独页面中有详细说明。',
      ),
      label: t('Жауапкершілікті шектеу', 'Ограничение ответственности', 'Disclaimer', '免责声明'),
      href: '/legal/disclaimer',
    },
  },

  // 8. Дербес деректерді өңдеуге келісім
  {
    path: '/legal/consent',
    section: 'legal',
    title: t(
      'Дербес деректерді өңдеуге келісім',
      'Согласие на обработку персональных данных',
      'Consent to personal data processing',
      '个人数据处理同意书',
    ),
    description: t(
      'Формаларда дербес деректерді жинауға және өңдеуге берілетін келісімнің мәтіні, оны беру және қайтарып алу тәртібі.',
      'Текст согласия на сбор и обработку персональных данных в формах, порядок его предоставления и отзыва.',
      'The text of the consent to the collection and processing of personal data in forms, and how it is given and withdrawn.',
      '各表单中收集和处理个人数据的同意书文本，以及同意的作出与撤回方式。',
    ),
    blocks: [
      draftNotice,
      {
        type: 'paragraphs',
        heading: t('Келісім мәтіні', 'Текст согласия', 'Text of the consent', '同意书文本'),
        text: t(
          'Осы форманы жіберу арқылы мен «Қазақстандық шетелдік капитал қауымдастығы» заңды тұлғалар бірлестігіне (БСН 170140015381, бұдан әрі: оператор) формада көрсетілген дербес деректерімді өңдеуге келісім беремін. Өңдеу деректерді жинауды, жазуды, сақтауды, пайдалануды және заңнамада көзделген өзге де әрекеттерді қамтиды.\n\nМақсаты: өтінішімді қарау, қажет болса инвестор ретінде бағалау, жобаларды сәйкестендіру, менімен байланысу және қауымдастықтың қызметтерін көрсету. Оператор деректерді Қазақстан Республикасының «Дербес деректер және оларды қорғау туралы» Заңына сай өңдейді.',
          'Отправляя эту форму, я даю объединению юридических лиц «Казахстанская ассоциация иностранного капитала» (БИН 170140015381, далее: оператор) согласие на обработку указанных в форме персональных данных. Обработка включает сбор, запись, хранение, использование и иные действия, предусмотренные законодательством.\n\nЦели: рассмотрение моей заявки, при необходимости оценка меня как инвестора, подбор проектов, связь со мной и оказание услуг ассоциации. Оператор обрабатывает данные в соответствии с Законом Республики Казахстан «О персональных данных и их защите».',
          'By submitting this form, I give the Kazakhstan Association of Foreign Capital, an association of legal entities (BIN 170140015381, the “Operator”), my consent to process the personal data I have entered in the form. Processing includes collection, recording, storage, use and other actions provided for by law.\n\nThe purposes are to review my application, to assess me as an investor where relevant, to match projects, to stay in touch with me and to provide the Association’s services. The Operator processes the data in accordance with the Law of the Republic of Kazakhstan “On Personal Data and Their Protection”.',
          '提交本表单，即表示我同意哈萨克斯坦外国资本协会（法人联合体，企业识别号BIN 170140015381，以下简称“运营方”）处理我在表单中填写的个人数据。处理包括收集、记录、存储、使用以及法律规定的其他行为。\n\n处理目的为：审核我的申请、必要时对我作为投资者进行评估、匹配项目、与我保持联系以及提供协会的服务。运营方依照《哈萨克斯坦共和国个人数据及其保护法》处理数据。',
        ),
      },
      {
        type: 'cards',
        heading: t('Келісім қалай беріледі', 'Как предоставляется согласие', 'How consent is given', '同意如何作出'),
        columns: 2,
        items: [
          {
            title: t('Анық келісім', 'Явное согласие', 'Explicit consent', '明示同意'),
            text: t(
              'Әр формада келісімге арналған бөлек белгі бар. Белгі алдын ала қойылмайды: оны пайдаланушы өзі қояды.',
              'В каждой форме есть отдельная отметка согласия. Она не проставлена заранее: её ставит сам пользователь.',
              'Every form has a separate consent checkbox. It is never ticked in advance; the user ticks it.',
              '每个表单均设有单独的同意勾选框。该勾选框不会预先勾选，须由用户自行勾选。',
            ),
          },
          {
            title: t('Нұсқа мен уақыт', 'Версия и время', 'Version and time', '版本与时间'),
            text: t(
              'Келісім мәтінінің нұсқасы мен келісім берілген уақыт сақталады.',
              'Сохраняются версия текста согласия и время, когда оно дано.',
              'The version of the consent text and the time at which it was given are stored.',
              '系统保存同意书文本的版本以及作出同意的时间。',
            ),
          },
          {
            title: t('Ең аз көлем', 'Минимальный объём', 'Minimum volume', '最小范围'),
            text: t(
              'Тек қажетті деректер сұралады. Жеке сәйкестендіру нөмірі мен төлқұжат көшірмесі тек комплаенс кезеңінде және жабық қоймада өңделеді.',
              'Запрашиваются только необходимые данные. Индивидуальные идентификационные номера и копии паспортов обрабатываются только на этапе комплаенса и в закрытом хранилище.',
              'Only necessary data is requested. Personal identification numbers and passport scans are processed only at the compliance stage and in closed storage.',
              '仅索取必要数据。个人识别号码和护照扫描件仅在合规审查阶段处理，并存放在封闭存储中。',
            ),
          },
          {
            title: t('Жүктеу және жою', 'Выгрузка и удаление', 'Download and deletion', '导出与删除'),
            text: t(
              'Деректерді жүктеп алуға және жоюды сұрауға болады. Жою сұранысы аудитке жазылады.',
              'Данные можно выгрузить и запросить их удаление. Запрос на удаление фиксируется в журнале аудита.',
              'You can download your data and request its deletion. A deletion request is recorded in the audit log.',
              '您可以导出自己的数据并申请删除。删除申请会记入审计日志。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Келісімді қайтарып алу және сақтау мерзімі',
          'Отзыв согласия и сроки хранения',
          'Withdrawing consent and retention periods',
          '撤回同意与保存期限',
        ),
        text: t(
          'Келісімді қайтарып алу немесе деректерді жоюды сұрау үшін жеке кабинеттегі сұранысты немесе «Байланыс» бетін пайдаланыңыз. Деректерді сақтау мерзімдері мен жою тәртібі заңгер бекіткеннен кейін осы бетте нақтыланады.',
          'Чтобы отозвать согласие или запросить удаление данных, воспользуйтесь запросом в личном кабинете или страницей «Контакты». Сроки хранения данных и порядок их удаления будут уточнены на этой странице после утверждения юристом.',
          'To withdraw consent or request deletion of your data, use the request in your personal account or the Contacts page. Retention periods and the deletion procedure will be set out on this page once approved by a lawyer.',
          '如需撤回同意或申请删除数据，请使用个人账户中的申请功能或“联系我们”页面。数据保存期限与删除程序将在律师批准后在本页明确。',
        ),
      },
      operatorFacts,
    ],
    cta: {
      title: t(
        'Деректер қалай қорғалады?',
        'Как защищаются данные?',
        'How is your data protected?',
        '数据如何受到保护？',
      ),
      text: t(
        'Құпиялылық саясатында қандай деректер жиналатыны және олар қалай сақталатыны түсіндірілген.',
        'В политике конфиденциальности объяснено, какие данные собираются и как они хранятся.',
        'The privacy policy explains what data is collected and how it is stored.',
        '隐私政策说明了收集哪些数据以及如何存储。',
      ),
      label: t('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy', '隐私政策'),
      href: '/legal/privacy',
    },
  },

  // 9. Cookie саясаты
  {
    path: '/legal/cookies',
    section: 'legal',
    title: t('Cookie саясаты', 'Политика cookie', 'Cookie policy', 'Cookie政策'),
    description: t(
      'Портал әдепкі түрде тек қажетті cookie файлдарын қолданады, ал аналитика cookie тек сіздің келісіміңізбен қосылады.',
      'По умолчанию портал использует только необходимые файлы cookie, а аналитические cookie включаются только с вашего согласия.',
      'By default the portal uses only necessary cookies; analytics cookies are switched on only with your consent.',
      '门户默认仅使用必要的Cookie，分析类Cookie仅在您同意后启用。',
    ),
    blocks: [
      draftNotice,
      {
        type: 'paragraphs',
        heading: t('Cookie дегеніміз не', 'Что такое cookie', 'What cookies are', '什么是Cookie'),
        text: t(
          'Cookie: браузерде сақталатын шағын мәтіндік файл. Ол порталға таңдалған тілді, кіру сессиясын және қауіпсіздік параметрлерін есте сақтауға көмектеседі. Біз әдепкі түрде тек қажетті cookie файлдарын қосамыз, ал қалғандары үшін сіздің келісіміңізді сұраймыз.',
          'Cookie: небольшой текстовый файл, который хранится в браузере. Он помогает порталу запоминать выбранный язык, сессию входа и параметры безопасности. По умолчанию мы включаем только необходимые файлы cookie, а для остальных запрашиваем ваше согласие.',
          'A cookie is a small text file stored in your browser. It helps the portal remember your chosen language, your login session and security settings. We switch on only necessary cookies by default, and ask for your consent for the rest.',
          'Cookie是存储在浏览器中的小型文本文件，可帮助门户记住您所选的语言、登录会话和安全设置。我们默认仅启用必要的Cookie，其余类别须征得您的同意。',
        ),
      },
      {
        type: 'table',
        heading: t(
          'Қандай cookie қолданамыз',
          'Какие cookie мы используем',
          'Which cookies we use',
          '我们使用哪些Cookie',
        ),
        caption: t(
          'Cookie санаттары, мақсаты және қосылу шарты',
          'Категории cookie, их назначение и условие включения',
          'Cookie categories, purpose and when they are enabled',
          'Cookie类别、用途及启用条件',
        ),
        columns: [
          t('Санат', 'Категория', 'Category', '类别'),
          t('Мақсаты', 'Назначение', 'Purpose', '用途'),
          t('Қашан қосылады', 'Когда включается', 'When enabled', '启用条件'),
        ],
        rows: [
          [
            t('Қажетті cookie', 'Необходимые cookie', 'Necessary cookies', '必要Cookie'),
            t(
              'Тіл таңдауын, кіру сессиясын және қауіпсіздікті (CSRF қорғанысы) қамтамасыз етеді.',
              'Обеспечивают выбор языка, сессию входа и безопасность (защита от CSRF).',
              'Provide language selection, the login session and security (CSRF protection).',
              '保障语言选择、登录会话与安全（CSRF防护）。',
            ),
            t('Әдепкі түрде қосулы', 'Включены по умолчанию', 'Enabled by default', '默认启用'),
          ],
          [
            t('Аналитика cookie', 'Аналитические cookie', 'Analytics cookies', '分析类Cookie'),
            t(
              'Портал бөлімдерінің қалай пайдаланылатынын түсінуге көмектеседі. Аналитика өз серверімізде орналасқан Umami жүйесі арқылы жүргізіледі.',
              'Помогают понять, как используются разделы портала. Аналитика ведётся через систему Umami на нашем собственном сервере.',
              'Help us understand how portal sections are used. Analytics runs through Umami on our own server.',
              '帮助我们了解门户各栏目的使用情况。分析通过部署在我们自有服务器上的Umami系统完成。',
            ),
            t('Тек сіздің келісіміңізбен', 'Только с вашего согласия', 'Only with your consent', '仅在您同意后'),
          ],
          [
            t('Google сервистері', 'Сервисы Google', 'Google services', 'Google服务'),
            t(
              'Google Analytics, Google Fonts, Google Maps және reCAPTCHA қолданылмайды. Қаріптер мен капча өз серверімізде жұмыс істейді.',
              'Google Analytics, Google Fonts, Google Maps и reCAPTCHA не используются. Шрифты и капча работают на нашем собственном сервере.',
              'Google Analytics, Google Fonts, Google Maps and reCAPTCHA are not used. Fonts and the captcha run on our own server.',
              '不使用Google Analytics、Google Fonts、Google Maps与reCAPTCHA。字体与验证码均在我们自有服务器上运行。',
            ),
            t('Қолданылмайды', 'Не используются', 'Not used', '不使用'),
          ],
        ],
      },
      {
        type: 'paragraphs',
        heading: t(
          'Cookie баптауларын басқару',
          'Управление настройками cookie',
          'Managing cookie settings',
          '管理Cookie设置',
        ),
        text: t(
          'Аналитика cookie файлдарына келісімді cookie хабарламасында бересіз немесе бас тартасыз: келісімсіз аналитика қосылмайды. Cookie файлдарын браузер баптауларында кез келген уақытта өшіруге немесе бұғаттауға болады, бірақ қажетті cookie өшірілсе, кабинетке кіру сияқты кейбір функциялар жұмыс істемейді.',
          'Согласие на аналитические cookie вы даёте или отклоняете в уведомлении о cookie: без согласия аналитика не включается. Файлы cookie можно в любой момент удалить или заблокировать в настройках браузера, но без необходимых cookie некоторые функции, например вход в кабинет, работать не будут.',
          'You give or decline consent to analytics cookies in the cookie notice: without consent, analytics is not switched on. You can delete or block cookies in your browser settings at any time, but without the necessary cookies some functions, such as logging in to your account, will not work.',
          '您可在Cookie提示中同意或拒绝分析类Cookie：未经同意，分析功能不会启用。您可随时在浏览器设置中删除或屏蔽Cookie，但若缺少必要Cookie，登录个人账户等部分功能将无法使用。',
        ),
      },
      operatorFacts,
    ],
    cta: {
      title: t(
        'Дербес деректер қалай қорғалады?',
        'Как защищаются персональные данные?',
        'How is personal data protected?',
        '个人数据如何受到保护？',
      ),
      text: t(
        'Құпиялылық саясатында деректердің жиналуы мен сақталуы толық сипатталған.',
        'Сбор и хранение данных подробно описаны в политике конфиденциальности.',
        'The privacy policy describes in full how data is collected and stored.',
        '隐私政策详细说明了数据的收集与存储方式。',
      ),
      label: t('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy', '隐私政策'),
      href: '/legal/privacy',
    },
  },

  // 10. Жауапкершілікті шектеу
  {
    path: '/legal/disclaimer',
    section: 'legal',
    title: t('Жауапкершілікті шектеу', 'Ограничение ответственности', 'Disclaimer', '免责声明'),
    description: t(
      'Қауымдастық мемлекеттік орган емес, ішкі баға ресми рейтинг емес, ал мүшелік пен қызметтер инвестициялық нәтижеге кепілдік бермейді.',
      'Ассоциация не является государственным органом, внутренняя оценка не является официальным рейтингом, а членство и услуги не гарантируют инвестиционный результат.',
      'The Association is not a government body; its internal assessment is not an official rating; membership and services guarantee no investment outcome.',
      '协会不是政府机构，内部评估不是官方评级，会员资格与服务均不保证投资结果。',
    ),
    blocks: [
      draftNotice,
      {
        type: 'paragraphs',
        heading: t('Осы бет не туралы', 'О чём эта страница', 'What this page covers', '本页内容'),
        text: t(
          'Осы бетте қауымдастық пен порталдың жауапкершілік шегі көрсетілген. Бұл ережелер порталдың барлық бөлімдеріне және төрт тілдегі нұсқаларының барлығына бірдей қолданылады.',
          'На этой странице указаны пределы ответственности ассоциации и портала. Эти правила применяются ко всем разделам портала и ко всем четырём языковым версиям.',
          'This page sets out the limits of responsibility of the Association and the portal. These rules apply to every section of the portal and to all four language versions.',
          '本页说明协会及门户的责任边界。这些规则适用于门户的所有栏目及全部四种语言版本。',
        ),
      },
      {
        type: 'cards',
        heading: t('Негізгі шектеулер', 'Основные ограничения', 'Key limitations', '主要限制'),
        columns: 3,
        items: [
          {
            icon: 'columns',
            title: t('Мемлекеттік орган емес', 'Не государственный орган', 'Not a government body', '非政府机构'),
            text: t(
              'Қауымдастық мемлекеттік орган, рұқсат беруші орган немесе ресми рейтинг агенттігі емес және мемлекеттік органдардың атынан әрекет етпейді.',
              'Ассоциация не является государственным органом, разрешающим органом или официальным рейтинговым агентством и не действует от имени государственных органов.',
              'The Association is not a government body, a permitting authority or an official rating agency, and does not act on behalf of government bodies.',
              '协会不是政府机构、许可机关或官方评级机构，亦不代表任何政府机构行事。',
            ),
          },
          {
            icon: 'shield',
            title: t(
              'Ішкі баға ресми рейтинг емес',
              'Внутренняя оценка не является рейтингом',
              'Internal assessment is not a rating',
              '内部评估不是评级',
            ),
            text: t(
              'Инвесторды 100 балдық бағалау ішкі басқару құралы. Ол ресми рейтинг емес және ашық бөлімде жарияланбайды.',
              'Оценка инвесторов по 100-балльной шкале является внутренним инструментом управления. Она не представляет собой официальный рейтинг и не публикуется в открытом разделе.',
              'The 100-point investor assessment is an internal management tool. It is not an official rating and is not published in the public section.',
              '对投资者的100分评估是内部管理工具，不是官方评级，也不会在公开栏目发布。',
            ),
          },
          {
            icon: 'user',
            title: t('Мүшелік кепілдік емес', 'Членство не является гарантией', 'Membership is not a guarantee', '会员资格不构成担保'),
            text: t(
              'Мүшелік қаржылық сенімділіктің кепілі емес. Мүшелік жарнасы мен жобалық қызмет ақысы бөлек есепке алынады.',
              'Членство не гарантирует финансовую надёжность. Членский взнос и плата за проектные услуги учитываются раздельно.',
              'Membership is not a guarantee of financial reliability. The membership fee and project service fees are accounted for separately.',
              '会员资格不构成财务可靠性的担保。会员费与项目服务费分别核算。',
            ),
          },
          {
            icon: 'alert',
            title: t('Табысқа кепілдік жоқ', 'Нет гарантии дохода', 'No guarantee of returns', '不保证收益'),
            text: t(
              'Қауымдастық инвестициялық табысқа, мемлекеттік рұқсатқа, жеңілдікке немесе мәміленің жасалуына кепілдік бермейді.',
              'Ассоциация не гарантирует инвестиционный доход, государственное разрешение, льготы или заключение сделки.',
              'The Association does not guarantee investment returns, government permits, incentives or the conclusion of a deal.',
              '协会不保证投资收益、政府许可、优惠政策或交易达成。',
            ),
          },
          {
            icon: 'document',
            title: t(
              'Ниет сомасы инвестиция емес',
              'Сумма намерения не является инвестицией',
              'Intended amounts are not investment',
              '意向金额不等于投资',
            ),
            text: t(
              'Мәлімделген сома, ниет құжаты немесе меморандум нақты инвестиция ретінде көрсетілмейді. Нәтиже төрт бөлек есеппен беріледі.',
              'Заявленная сумма, документ о намерениях или меморандум не выдаются за фактические инвестиции. Результат приводится в четырёх раздельных отчётах.',
              'A declared amount, a letter of intent or a memorandum is never presented as actual investment. Results are reported in four separate ledgers.',
              '申报金额、意向文件或备忘录不会被表述为实际投资。成果以四本独立账目呈现。',
            ),
          },
          {
            icon: 'info',
            title: t(
              'Серіктестер мен мемлекеттік органдар',
              'Партнёры и государственные органы',
              'Partners and government bodies',
              '合作伙伴与政府机构',
            ),
            text: t(
              'Серіктестің аты мен логотипі жазбаша келісіммен ғана жарияланады. Мемлекеттік органмен кездесу өткені серіктестік орнады дегенді білдірмейді.',
              'Название и логотип партнёра публикуются только с письменного согласия. Проведение встречи с государственным органом не означает установления партнёрства.',
              'A partner’s name and logo are published only with written consent. A meeting with a government body does not mean that a partnership has been established.',
              '合作伙伴的名称与标识仅在取得书面同意后发布。与政府机构会面并不意味着已建立合作关系。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: t('Мазмұн және деректер', 'Содержание и данные', 'Content and data', '内容与数据'),
        text: t(
          'Нақты дерекпен ауыстырылғанша «Мысал ретінде көрсетілген» белгісі бар жобалар мен жаңалықтар көрнекілік үшін ғана берілген және нақты жобалар мен оқиғаларды білдірмейді. Нәтиже блоктарындағы сандар тек расталған жазбалардан есептеледі, бастапқы кезеңде олар мақсатты көрсеткіш ретінде белгіленеді.\n\nПортал материалдары жалпы ақпараттық сипатта және жеке заңгерлік, салықтық немесе инвестициялық кеңестің орнын баспайды. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады.',
          'Проекты и новости с пометкой «Показано как пример» представлены только для наглядности и не отражают реальных проектов и событий, пока не заменены фактическими данными. Цифры в блоках результатов рассчитываются только по подтверждённым записям, на начальном этапе они обозначаются как целевые показатели.\n\nМатериалы портала носят общий информационный характер и не заменяют индивидуальную юридическую, налоговую или инвестиционную консультацию. Финансирование осуществляют организации, имеющие лицензию.',
          'Projects and news items marked “Shown as an example” are for illustration only and do not represent real projects or events until they are replaced with actual data. Figures in the results blocks are calculated only from confirmed records and are labelled as target figures in the initial period.\n\nThe portal’s materials are of a general informational nature and do not replace individual legal, tax or investment advice. Financing is provided by licensed organisations.',
          '标注“示例展示”的项目和新闻仅用于演示，在替换为真实数据之前不代表真实的项目或事件。成果栏目中的数字仅根据已确认的记录计算，在初始阶段标注为目标指标。\n\n门户材料仅供一般信息参考，不能替代个别的法律、税务或投资建议。融资由持牌机构提供。',
        ),
      },
      operatorFacts,
    ],
    cta: {
      title: t('Сұрақтарыңыз бар ма?', 'Остались вопросы?', 'Any questions?', '还有疑问吗？'),
      text: t(
        'Жауапкершілік шектеріне қатысты сұрағыңызды «Байланыс» беті арқылы жіберіңіз.',
        'Направьте вопрос о пределах ответственности через страницу «Контакты».',
        'Send your question about the limits of responsibility through the Contacts page.',
        '有关责任限度的问题，请通过“联系我们”页面提交。',
      ),
      label: t('Байланыс', 'Контакты', 'Contact us', '联系我们'),
      href: '/contacts',
    },
  },
]

// ---------------------------------------------------------------------------------------------
// Қызмет беттерінің толық мазмұны (ТТ 7.2): slug бойынша. Атаулары мен бір сөйлемдік сипаттамалары
// content/seed/data.ts (servicesSeed) ішінде, бұл жерде қайталанбайды.
// ---------------------------------------------------------------------------------------------

export const servicesDetailSeed: Record<string, ServiceDetailSeed> = {
  // 1. Халықаралық инвестиция тарту
  'international-investment': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Қытай, Орталық Азия, Еуропа және Таяу Шығыс нарықтарындағы инвесторлармен тұрақты байланыс арналарын жүргіземіз және оларға Қазақстанның тексерілген жобаларын таныстырамыз. Әр арнада инвесторлардың тілі, қаржыландыру форматы және қызығушылық саласы ескеріледі. Қызығушылық танытқан инвестор өтініш береді және ортақ стандарт бойынша тексеруден өтеді.',
          'Мы поддерживаем устойчивые каналы связи с инвесторами рынков Китая, Центральной Азии, Европы и Ближнего Востока и знакомим их с проверенными проектами Казахстана. По каждому каналу учитываются язык инвесторов, формат финансирования и сфера интересов. Заинтересованный инвестор подаёт заявку и проходит проверку по единому стандарту.',
          'We maintain sustained channels to investors in the markets of China, Central Asia, Europe and the Middle East and introduce them to Kazakhstan’s vetted projects. In each channel we take account of the investors’ language, financing format and field of interest. An interested investor submits an application and is vetted to a common standard.',
          '我们与中国、中亚、欧洲及中东市场的投资者保持稳定的沟通渠道，并向他们介绍经审核的哈萨克斯坦项目。在每个渠道中，我们都会考虑投资者的语言、融资方式与关注领域。有意向的投资者提交申请，并按统一标准接受审核。',
        ),
      },
      {
        type: 'cards',
        heading: t('Төрт арна', 'Четыре канала', 'Four channels', '四大渠道'),
        lead: t(
          'Әр арна бойынша инвесторлармен жұмыс жеке жүргізіледі.',
          'Работа с инвесторами по каждому каналу ведётся отдельно.',
          'Work with investors is organised separately for each channel.',
          '每个渠道的投资者工作单独开展。',
        ),
        columns: 4,
        items: [
          {
            icon: 'globe',
            title: t('Қытай', 'Китай', 'China', '中国'),
            text: t(
              'Қытай тіліндегі толық нұсқа, WeChat арнасы және «Белдеу және жол» бастамасы мен «Нұрлы жол» бағдарламасының үйлесімі аясындағы жобалар.',
              'Полная версия на китайском языке, канал WeChat и проекты на стыке инициативы «Пояс и путь» и программы «Нурлы жол».',
              'A full Chinese-language version, a WeChat channel and projects where the Belt and Road Initiative meets the Nurly Zhol programme.',
              '完整的中文版、微信沟通渠道，以及“一带一路”倡议与“光明之路”计划对接框架下的项目。',
            ),
            href: '/investors/china',
          },
          {
            icon: 'compass',
            title: t('Орталық Азия', 'Центральная Азия', 'Central Asia', '中亚'),
            text: t(
              'Орталық Азия елдерінің инвесторларымен өңірлік инвестициялық ынтымақтастық арнасы.',
              'Канал регионального инвестиционного сотрудничества с инвесторами стран Центральной Азии.',
              'A channel for regional investment cooperation with investors from Central Asian countries.',
              '与中亚国家投资者开展区域投资合作的渠道。',
            ),
          },
          {
            icon: 'leaf',
            title: t('Еуропа', 'Европа', 'Europe', '欧洲'),
            text: t(
              'Технология трансферті, жасыл энергетика және экспортқа бағытталған өндіріс жобалары. Еуропа және Азия бөлімінде ЕО, Түркия, Корея және Жапония бойынша қысқа беттер бар.',
              'Проекты трансфера технологий, зелёной энергетики и экспортно ориентированного производства. В разделе «Европа и Азия» есть краткие страницы по ЕС, Турции, Корее и Японии.',
              'Technology transfer, green energy and export-oriented manufacturing projects. The Europe and Asia section has short pages on the EU, Turkey, Korea and Japan.',
              '技术转让、绿色能源和面向出口的制造业项目。“欧洲与亚洲”栏目设有欧盟、土耳其、韩国和日本的简要页面。',
            ),
            href: '/investors/global',
          },
          {
            icon: 'chart',
            title: t('Таяу Шығыс', 'Ближний Восток', 'Middle East', '中东'),
            text: t(
              'Парсы шығанағы елдері: егемен қорлармен бірлескен инвестиция, ислам қаржысы құралдары және АХҚО алаңындағы құрылымдау.',
              'Страны Персидского залива: совместные инвестиции с суверенными фондами, инструменты исламских финансов и структурирование на площадке МФЦА.',
              'Gulf countries: co-investment with sovereign funds, Islamic finance instruments and structuring on the AIFC platform.',
              '海湾国家：与主权基金共同投资、伊斯兰金融工具，以及在阿斯塔纳国际金融中心平台进行结构化安排。',
            ),
            href: '/investors/gulf',
          },
        ],
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Шетелдік инвесторлар', 'Иностранные инвесторы', 'Foreign investors', '外国投资者'),
            text: t(
              'Қазақстанда сенімді серіктес пен дайын жоба іздейтін компаниялар, қорлар және институттар.',
              'Компании, фонды и институты, которые ищут в Казахстане надёжного партнёра и готовый проект.',
              'Companies, funds and institutions looking for a reliable partner and a ready project in Kazakhstan.',
              '在哈萨克斯坦寻找可靠合作伙伴和成熟项目的企业、基金与机构。',
            ),
          },
          {
            title: t('Қытай инвесторлары', 'Китайские инвесторы', 'Chinese investors', '中国投资者'),
            text: t(
              'Қытай тіліндегі толық ақпарат пен WeChat арнасы қажет қытайлық компаниялар мен мемлекеттік кәсіпорындар.',
              'Китайские компании и государственные предприятия, которым нужны полная информация на китайском языке и канал WeChat.',
              'Chinese companies and state-owned enterprises that need full information in Chinese and a WeChat channel.',
              '需要完整中文资讯和微信沟通渠道的中国企业与国有企业。',
            ),
          },
          {
            title: t('Жоба иелері', 'Владельцы проектов', 'Project owners', '项目方'),
            text: t(
              'Жобасына халықаралық инвестор іздейтін қазақстандық компаниялар.',
              'Казахстанские компании, ищущие международного инвестора для своего проекта.',
              'Kazakhstani companies looking for an international investor for their project.',
              '为项目寻找国际投资者的哈萨克斯坦企业。',
            ),
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t(
              'Арналар мен басымдықтарды анықтау',
              'Определение каналов и приоритетов',
              'Defining channels and priorities',
              '确定渠道与重点',
            ),
            text: t(
              'Нарықтар мен инвестор топтары қауымдастықтың басым жобаларына сай таңдалады.',
              'Рынки и группы инвесторов выбираются с учётом приоритетных проектов ассоциации.',
              'Markets and investor groups are chosen in line with the Association’s priority projects.',
              '根据协会的重点项目选定目标市场与投资者群体。',
            ),
          },
          {
            title: t('Бастапқы байланыс', 'Первичный контакт', 'First contact', '首次接触'),
            text: t(
              'Инвесторға қауымдастық пен тексерілген жобалар туралы ақпарат жіберіледі, кездесулер ұйымдастырылады.',
              'Инвестору направляется информация об ассоциации и проверенных проектах, организуются встречи.',
              'The investor receives information about the Association and vetted projects, and meetings are arranged.',
              '向投资者提供协会及经审核项目的信息，并安排会面。',
            ),
          },
          {
            title: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
            text: t(
              'Инвестор компания, нақты бенефициар, өкілетті өкіл және қызығушылық бойынша өтініш толтырады.',
              'Инвестор заполняет заявку: компания, реальный бенефициар, уполномоченный представитель и сфера интересов.',
              'The investor completes an application covering the company, beneficial owner, authorised representative and area of interest.',
              '投资者填写申请，内容包括公司、最终受益人、授权代表与关注领域。',
            ),
          },
          {
            title: t('Тексеру және бағалау', 'Проверка и оценка', 'Vetting and assessment', '审核与评估'),
            text: t(
              'Хатшылық алғашқы тексеру жүргізеді, сарапшылар 100 балдық баға қояды, комплаенс ветоны тексереді.',
              'Секретариат проводит первичную проверку, эксперты выставляют оценку по 100-балльной шкале, комплаенс проверяет вето.',
              'The Secretariat carries out an initial check, experts give a 100-point score and compliance considers the veto.',
              '秘书处进行初步审核，专家按100分制评分，合规部门审议是否行使否决权。',
            ),
          },
          {
            title: t('Жобаларға шығу', 'Выход на проекты', 'Introduction to projects', '对接项目'),
            text: t(
              'A немесе B деңгейін алған инвестор жоба бойынша электрондық NDA-ға қол қойып, деректер бөлмесіне қолжетімділік алады.',
              'Инвестор с уровнем A или B подписывает электронный NDA по проекту и получает доступ к дата-руму.',
              'An investor with Grade A or B signs an electronic NDA for the project and gains access to the data room.',
              '获得A级或B级的投资者就项目签署电子保密协议（NDA），并获准进入数据室。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: Қазақстан жобаларына қызығушылық танытқан тексерілген халықаралық инвесторлардың нақты базасын жасау. Әр инвестор өз деңгейін (A-D) жеке кабинетте көреді, ал қауымдастық инвесторлармен байланыс тарихын бір жүйеде жүргізеді.\n\nКүтілетін нәтиже: инвестор мен жобаны алғашқы сәйкестендіру және келіссөзге өту. Инвестиция көлемі бөлек көрсетіледі: мәлімделген, ниет құжаты бойынша, ресми шарт бойынша және нақты түскен сома.',
          'Цель: сформировать реальную базу проверенных международных инвесторов, заинтересованных в проектах Казахстана. Каждый инвестор видит свой уровень (A-D) в личном кабинете, а ассоциация ведёт историю контактов с инвесторами в единой системе.\n\nОжидаемый результат: первичный подбор инвестора и проекта и переход к переговорам. Объём инвестиций показывается раздельно: заявленная сумма, по документу о намерениях, по официальному договору и фактически поступившая.',
          'The aim is to build a real base of vetted international investors interested in Kazakhstan’s projects. Each investor sees their own grade (A-D) in the personal account, and the Association keeps the history of contacts with investors in one system.\n\nThe expected outcome is a first match between investor and project and a move to negotiations. Investment volumes are shown separately: declared, per letter of intent, per signed contract and actually received.',
          '目标是建立一个真实可靠的、对哈萨克斯坦项目感兴趣的国际投资者库。每位投资者可在个人账户中看到自己的等级（A-D），协会则在同一系统内维护与投资者的联络记录。\n\n预期成果是完成投资者与项目的初步匹配并进入谈判。投资规模分别列示：申报、按意向文件、按正式合同和实际到位。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қауымдастық инвесторды қызықтыруға және тараптарды байланыстыруға көмектеседі, бірақ инвестиция жасалуына, табысқа немесе мемлекеттік рұқсатқа кепілдік бермейді. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді.',
          'Ассоциация помогает заинтересовать инвестора и установить контакт между сторонами, но не гарантирует совершение инвестиции, доход или государственное разрешение. Финансирование осуществляют организации, имеющие лицензию. Ассоциация не является государственным органом и не действует от имени государственных органов.',
          'The Association helps to interest investors and to bring the parties together, but does not guarantee that an investment will be made, any return or any government permit. Financing is provided by licensed organisations. The Association is not a government body and does not act on behalf of government bodies.',
          '协会协助吸引投资者并促成各方接触，但不保证投资一定落地，也不保证收益或政府许可。融资由持牌机构提供。协会不是政府机构，亦不代表任何政府机构行事。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Инвестор іздеу бағыты немесе нарық бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по направлению поиска инвестора или рынку.',
        'Leave an enquiry about the investor search direction or market.',
        '请就投资者寻源方向或目标市场留下咨询。',
      ),
    ),
  },

  // 2. Жобалар қорын қалыптастыру
  'project-pool': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Қазақстандағы инвестициялық жобаларды бірыңғай форматпен жинаймыз, тексереміз және ортақ стандартпен рәсімдейміз. Әр жобаға паспорт жасалып, төрт деңгейдің бірі беріледі, ал жобаның бүкіл жолы сегіз кезеңдік циклмен бақыланады. Тексерілмеген жоба ашық каталогқа шықпайды.',
          'Мы собираем инвестиционные проекты Казахстана в едином формате, проверяем их и оформляем по общему стандарту. Каждому проекту составляется паспорт и присваивается один из четырёх уровней, а весь путь проекта контролируется по восьмиэтапному циклу. Непроверенный проект в открытый каталог не попадает.',
          'We collect investment projects in Kazakhstan in a single format, vet them and package them to a common standard. Each project receives a passport and one of four levels, and its whole journey is tracked through an eight-stage cycle. A project that has not been vetted does not reach the public catalogue.',
          '我们以统一格式收集哈萨克斯坦的投资项目，对其进行审核，并按共同标准规范包装。每个项目都会建立项目档案并确定四个等级之一，项目全程按八个阶段的周期跟踪。未经审核的项目不会进入公开目录。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Жоба иелері', 'Владельцы проектов', 'Project owners', '项目方'),
            text: t(
              'Жобасына инвестор іздейтін және жобасын ортақ стандартпен рәсімдегісі келетін компаниялар.',
              'Компании, которые ищут инвестора и хотят оформить проект по общему стандарту.',
              'Companies that are looking for an investor and want their project packaged to a common standard.',
              '正在寻找投资者并希望按统一标准包装项目的企业。',
            ),
            href: '/projects/submit',
          },
          {
            title: t('Инвесторлар', 'Инвесторы', 'Investors', '投资者'),
            text: t(
              'Саласы, өңірі, көлемі және дайындық деңгейі бойынша тексерілген жобаларды таңдағысы келетін инвесторлар.',
              'Инвесторы, которые хотят выбирать проверенные проекты по отрасли, региону, объёму и уровню готовности.',
              'Investors who want to choose vetted projects by sector, region, size and readiness level.',
              '希望按行业、地区、规模和成熟度挑选经审核项目的投资者。',
            ),
            href: '/projects',
          },
          {
            title: t('Өңірлік өкілдер', 'Региональные представители', 'Regional representatives', '地区代表'),
            text: t(
              'Өз өңіріндегі жобалар бойынша жұмыс істейтін өңірлік өкілдер.',
              'Региональные представители, работающие с проектами своего региона.',
              'Regional representatives who work with the projects of their own region.',
              '负责本地区项目工作的地区代表。',
            ),
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Жобаны қабылдау', 'Приём проекта', 'Project intake', '项目受理'),
            text: t(
              'Иесі, мақсаты, орны және қажеттілігі бірыңғай форматпен тіркеледі (1-кезең).',
              'Владелец, цель, место и потребность фиксируются в едином формате (этап 1).',
              'The owner, purpose, location and need are recorded in a single format (stage 1).',
              '以统一格式登记项目方、目标、地点与需求（第1阶段）。',
            ),
          },
          {
            title: t('Бастапқы іріктеу', 'Первичный отбор', 'Initial screening', '初步筛选'),
            text: t(
              'Жобаның шынайылығы, жер, рұқсаттар мен инфрақұрылым хатшылықтың чек-листі бойынша тексеріледі (2-кезең).',
              'Достоверность проекта, земля, разрешения и инфраструктура проверяются по чек-листу секретариата (этап 2).',
              'The authenticity of the project, land, permits and infrastructure are checked against the Secretariat’s checklist (stage 2).',
              '按秘书处核查清单审查项目的真实性、土地、许可与基础设施（第2阶段）。',
            ),
          },
          {
            title: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
            text: t(
              'Қаржы, құқық, техника, нарық және экология бойынша қорытындылар жиналады, комитет шешім қабылдайды (3-кезең).',
              'Собираются заключения по финансам, праву, технике, рынку и экологии, комитет принимает решение (этап 3).',
              'Opinions on finance, legal, technical, market and environmental matters are gathered and the committee takes a decision (stage 3).',
              '汇集财务、法律、技术、市场与环境方面的意见，由委员会作出决定（第3阶段）。',
            ),
          },
          {
            title: t('Паспорт және деңгей', 'Паспорт и уровень', 'Passport and level', '项目档案与等级'),
            text: t(
              'Жобаға паспорт жасалады және 1-4 деңгейдің бірі беріледі. 3-деңгей комитет шешімінсіз берілмейді.',
              'Составляется паспорт проекта и присваивается один из уровней 1-4. Уровень 3 не присваивается без решения комитета.',
              'A project passport is prepared and one of levels 1 to 4 is assigned. Level 3 is not assigned without a committee decision.',
              '编制项目档案并确定1-4级中的一个等级。未经委员会决定，不得授予3级。',
            ),
          },
          {
            title: t('Каталогқа шығару', 'Публикация в каталоге', 'Catalogue listing', '上架目录'),
            text: t(
              'Жоба ашық каталогқа иесінің келісімімен шығады: карточкада иесінің аты көрсетілмейді, толық деректер NDA арқылы ашылады.',
              'Проект попадает в открытый каталог с согласия владельца: в карточке имя владельца не указывается, полные данные открываются через NDA.',
              'A project goes into the public catalogue with the owner’s consent: the card does not name the owner, and full data is opened through an NDA.',
              '项目经项目方同意后进入公开目录：卡片不显示项目方名称，完整资料通过保密协议（NDA）开放。',
            ),
          },
          {
            title: t('Кейінгі кезеңдер', 'Дальнейшие этапы', 'Later stages', '后续阶段'),
            text: t(
              'Инвесторды сәйкестендіру, келіссөздер, құрылым және келісу, іске асыру мониторингі және нәтижені бағалау (4-8 кезеңдер).',
              'Подбор инвестора, переговоры, структура и согласование, мониторинг реализации и оценка результата (этапы 4-8).',
              'Investor matching, negotiations, structuring and agreement, implementation monitoring and results assessment (stages 4 to 8).',
              '投资者匹配、谈判、结构设计与签约、实施监测和成果评估（第4-8阶段）。',
            ),
          },
        ],
      },
      {
        type: 'cards',
        heading: hResult,
        lead: t(
          'Нәтижесінде әр жоба төрт деңгейдің бірін алады. Әр басым жобада жауапты тұлға, мерзімдер, тәуекелдер тізілімі және электрондық мұрағат болады.',
          'В результате каждый проект получает один из четырёх уровней. У каждого приоритетного проекта есть ответственное лицо, сроки, реестр рисков и электронный архив.',
          'As a result, every project receives one of four levels. Every priority project has a responsible owner, deadlines, a risk register and an electronic archive.',
          '最终每个项目都会获得四个等级之一。每个重点项目都有责任人、时间节点、风险台账和电子档案。',
        ),
        columns: 4,
        items: [
          {
            badge: t('1-деңгей', 'Уровень 1', 'Level 1', '1级'),
            title: t('Тұжырымдама', 'Концепция', 'Concept', '概念'),
            text: t(
              'Иесі, орны және мақсаты жазылған. Ашық каталогта көрсетілмейді.',
              'Указаны владелец, место и цель. В открытом каталоге не отображается.',
              'The owner, location and purpose are recorded. Not shown in the public catalogue.',
              '已记录项目方、地点与目标。不在公开目录中显示。',
            ),
          },
          {
            badge: t('2-деңгей', 'Уровень 2', 'Level 2', '2级'),
            title: t('Алдын ала бағаланған', 'Предварительно оценён', 'Pre-assessed', '已预评估'),
            text: t(
              'Құжаттар, жер мәртебесі және бастапқы тәуекелдер тексерілді. Каталогта жинақталған түрде көрсетіледі.',
              'Проверены документы, статус земли и первичные риски. В каталоге отображается в сводном виде.',
              'Documents, land status and initial risks have been checked. Shown in the catalogue in summary form.',
              '已核查文件、土地状态与初步风险。在目录中以汇总形式显示。',
            ),
          },
          {
            badge: t('3-деңгей', 'Уровень 3', 'Level 3', '3级'),
            title: t('Инвестицияға дайын', 'Готов к инвестициям', 'Investment-ready', '具备投资条件'),
            text: t(
              'Комитет бекітті, паспорт пен алдын ала ТЭН дайын. Каталогта ашық карточкамен көрсетіледі.',
              'Утверждён комитетом, готовы паспорт и предварительное ТЭО. В каталоге отображается открытой карточкой.',
              'Approved by the committee; the passport and a preliminary feasibility study are ready. Shown in the catalogue as an open card.',
              '已获委员会批准，项目档案与初步可行性研究已就绪。在目录中以公开卡片显示。',
            ),
          },
          {
            badge: t('4-деңгей', 'Уровень 4', 'Level 4', '4级'),
            title: t('Іске асырылуда', 'В реализации', 'In implementation', '实施中'),
            text: t(
              'Қаражаттың түсуі құжатпен расталды. Каталогта нәтиже ретінде көрсетіледі.',
              'Поступление средств подтверждено документально. В каталоге показывается как результат.',
              'The receipt of funds has been confirmed by a document. Shown in the catalogue as a result.',
              '资金到位已有文件证明。在目录中作为成果显示。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Жобаға деңгей беру оның инвестиция алатынына, табысты болатынына немесе мемлекеттік рұқсат алатынына кепілдік бермейді. Жоба иесінің келісімінсіз құпия деректер ашық бөлімге шығарылмайды. Тексерілмеген жоба каталогқа шықпайды, ал қауымдастық мемлекеттік орган емес.',
          'Присвоение проекту уровня не гарантирует, что он получит инвестиции, окажется успешным или получит государственное разрешение. Конфиденциальные данные без согласия владельца в открытый раздел не выносятся. Непроверенный проект в каталог не попадает, а ассоциация не является государственным органом.',
          'Assigning a level to a project does not guarantee that it will receive investment, succeed or obtain a government permit. Confidential data is not placed in the public section without the owner’s consent. A project that has not been vetted does not reach the catalogue, and the Association is not a government body.',
          '为项目确定等级，并不保证该项目一定获得投资、取得成功或获得政府许可。未经项目方同意，保密资料不会进入公开栏目。未经审核的项目不会进入目录，协会也不是政府机构。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Жобаңызды ұсыну немесе жобалар қоры туралы білу үшін сұранысыңызды қалдырыңыз.',
        'Оставьте запрос, чтобы предложить проект или узнать о пуле проектов.',
        'Leave an enquiry to put forward a project or to find out about the project pool.',
        '如需提交项目或了解项目库，请留下咨询。',
      ),
    ),
  },

  // 3. Инвесторды тексеру
  'investor-vetting': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Әр инвесторды жобаға жібермес бұрын ортақ стандарт бойынша тексереміз. Тексеру екі бөліктен тұрады: заңды тәсілдермен жүргізілетін тиісті тексеру және жеті өлшем бойынша 100 балдық ішкі бағалау. Комплаенс қызметкері күмәнді қаражат, жалған құжат немесе санкциялық тәуекел анықтаса, жалпы баллға қарамастан вето қоя алады.',
          'Мы проверяем каждого инвестора по единому стандарту, прежде чем допустить его к проектам. Проверка состоит из due diligence, проводимого законными методами, и внутренней 100-балльной оценки по семи критериям. Если сотрудник по комплаенсу выявляет сомнительные средства, поддельный документ или санкционный риск, он может наложить вето независимо от общего балла.',
          'We vet each investor to a common standard before admitting them to projects. Vetting consists of due diligence carried out by lawful means and a 100-point internal assessment across seven criteria. If the compliance officer finds doubtful funds, a forged document or a sanctions risk, a veto can be applied regardless of the total score.',
          '在投资者参与项目之前，我们按统一标准对每位投资者进行审核。审核包括依法开展的尽职调查，以及按七项标准进行的100分内部评估。若合规专员发现来源存疑的资金、伪造文件或制裁风险，则无论总分多少均可行使否决权。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Шетелдік инвесторлар', 'Иностранные инвесторы', 'Foreign investors', '外国投资者'),
            text: t(
              'Жобаларға қол жеткізу үшін өз деңгейін алғысы келетін компаниялар, қорлар және институттар.',
              'Компании, фонды и институты, которым нужен уровень для доступа к проектам.',
              'Companies, funds and institutions that need a grade to gain access to projects.',
              '需要取得等级以便参与项目的企业、基金与机构。',
            ),
            href: '/investors/apply',
          },
          {
            title: t('Жоба иелері', 'Владельцы проектов', 'Project owners', '项目方'),
            text: t(
              'Жобаға тек тексерілген серіктестер ғана жіберілетініне көз жеткізгісі келетін иелер.',
              'Владельцы, которым важно, чтобы к проекту допускались только проверенные партнёры.',
              'Owners who want to be sure that only vetted partners are admitted to their project.',
              '希望确保只有经审核的合作伙伴才能参与其项目的项目方。',
            ),
          },
          {
            title: t(
              'Мемлекеттік органдар мен серіктестер',
              'Государственные органы и партнёры',
              'Government bodies and partners',
              '政府机构与合作伙伴',
            ),
            text: t(
              'Қауымдастықтың сенімділігін бағалап, оның тексеру тәртібімен танысқысы келетін органдар мен серіктестер.',
              'Органы и партнёры, которые оценивают надёжность ассоциации и хотят познакомиться с порядком проверки.',
              'Bodies and partners that assess the Association’s reliability and want to understand how vetting works.',
              '评估协会可靠性并希望了解审核流程的机构与合作伙伴。',
            ),
          },
        ],
      },
      {
        type: 'table',
        heading: t('Бағалаудың жеті өлшемі', 'Семь критериев оценки', 'Seven assessment criteria', '七项评估标准'),
        caption: t(
          '100 балдық ішкі бағалаудың өлшемдері, салмағы және тексерілетін мәселелер',
          'Критерии внутренней 100-балльной оценки, их вес и что проверяется',
          'Criteria of the 100-point internal assessment, their weight and what is checked',
          '100分内部评估的标准、权重与核查内容',
        ),
        columns: [
          t('Өлшем', 'Критерий', 'Criterion', '标准'),
          t('Салмағы', 'Вес', 'Weight', '权重'),
          t('Не тексеріледі', 'Что проверяется', 'What is checked', '核查内容'),
        ],
        rows: scoringSeed.dimensions.map((dimension) => [
          dimension.label,
          points(dimension.weight),
          dimension.description,
        ]),
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Өтінішті қабылдау', 'Приём заявки', 'Receiving the application', '受理申请'),
            text: t(
              'Инвестор компания, нақты бенефициар, өкілетті өкіл және қызығушылық бойынша өтініш береді.',
              'Инвестор подаёт заявку: компания, реальный бенефициар, уполномоченный представитель, сфера интересов.',
              'The investor submits an application covering the company, beneficial owner, authorised representative and area of interest.',
              '投资者提交申请，内容包括公司、最终受益人、授权代表与关注领域。',
            ),
          },
          {
            title: t('Алғашқы тексеру', 'Первичная проверка', 'Initial check', '初步审核'),
            text: t(
              'Хатшылық өтініштің толықтығын тексереді, ашық санкциялық тізімдер бойынша тексеру іске қосылады.',
              'Секретариат проверяет полноту заявки, запускается проверка по открытым санкционным спискам.',
              'The Secretariat checks that the application is complete, and screening against open sanctions lists is launched.',
              '秘书处核查申请材料是否完整，并启动对公开制裁名单的筛查。',
            ),
          },
          {
            title: t('Тиісті тексеру', 'Комплексная проверка', 'Due diligence', '尽职调查'),
            text: t(
              'Қаржылық есептілік, қаражат көзі, бенефициар, іскерлік бедел мен сот тәуекелі тек заңды тәсілдермен зерттеледі.',
              'Финансовая отчётность, источник средств, бенефициар, деловая репутация и судебные риски изучаются только законными методами.',
              'Financial statements, the source of funds, the beneficiary, business reputation and litigation risk are examined by lawful means only.',
              '仅通过合法手段核查财务报表、资金来源、受益人、商业信誉与诉讼风险。',
            ),
          },
          {
            title: t('100 балдық баға', 'Оценка по 100 баллам', 'The 100-point score', '100分评分'),
            text: t(
              'Бағаны екі тұлға қояды: сарапшы және комитет мүшесі. Әр өлшем бойынша балл дәлелдеме мәтінімен және файлдарымен расталады.',
              'Оценку ставят два человека: эксперт и член комитета. Балл по каждому критерию подтверждается текстом обоснования и файлами.',
              'The score is set by two people: an expert and a committee member. The score for each criterion is backed by a written justification and files.',
              '评分由两人完成：一名专家和一名委员会成员。每项标准的得分均须附书面依据和文件。',
            ),
          },
          {
            title: t('Деңгей және вето', 'Уровень и вето', 'Grade and veto', '等级与否决'),
            text: t(
              'Жалпы балл бойынша A-D деңгейі беріледі. Комплаенс қызметкері қажет болса, себебін көрсетіп, «тоқтатылды» мәртебесін қояды.',
              'По общему баллу присваивается уровень A-D. При необходимости сотрудник по комплаенсу присваивает статус «приостановлено», указав причину.',
              'A grade from A to D is assigned on the total score. Where necessary, the compliance officer sets the status “suspended” and records the reason.',
              '根据总分确定A-D等级。必要时，合规专员会注明原因并将状态设为“已暂停”。',
            ),
          },
          {
            title: t('Қайта қарау', 'Пересмотр', 'Review', '复核'),
            text: t(
              'Баға динамикалық: 12 айда бір рет немесе жаңа дерек келгенде қайта қаралады.',
              'Оценка динамична: пересматривается раз в 12 месяцев или при поступлении новых данных.',
              'The score is dynamic: it is reviewed once every 12 months or when new data arrives.',
              '评分是动态的：每12个月复核一次，或在获得新数据时复核。',
            ),
          },
        ],
      },
      {
        type: 'cards',
        heading: hResult,
        lead: t(
          'Тексеру нәтижесінде инвесторға төрт деңгейдің бірі беріледі. Инвестор өз деңгейін жеке кабинетте көреді, ал баға ашық бөлімде жарияланбайды.',
          'По итогам проверки инвестору присваивается один из четырёх уровней. Инвестор видит свой уровень в личном кабинете, а в открытом разделе оценка не публикуется.',
          'Vetting ends with the investor being assigned one of four grades. The investor sees their grade in the personal account, and the score is never published in the public section.',
          '审核结束后，投资者将获得四个等级之一。投资者可在个人账户中查看自己的等级，评分不会在公开栏目发布。',
        ),
        columns: 4,
        items: [
          {
            badge: t('80-100 балл', '80-100 баллов', '80-100 points', '80-100分'),
            title: t('A деңгейі: басым серіктес', 'Уровень A: приоритетный партнёр', 'Grade A: priority partner', 'A级：优先合作伙伴'),
            text: t(
              'Жобамен электрондық NDA арқылы танысып, сәйкестендіруге қатыса алады.',
              'Может ознакомиться с проектом через электронный NDA и участвовать в подборе.',
              'May review a project through an electronic NDA and take part in matching.',
              '可通过电子保密协议（NDA）了解项目，并参与匹配。',
            ),
          },
          {
            badge: t('65-79 балл', '65-79 баллов', '65-79 points', '65-79分'),
            title: t('B деңгейі: шартты серіктес', 'Уровень B: условный партнёр', 'Grade B: conditional partner', 'B级：有条件合作伙伴'),
            text: t(
              'Қосымша құжат қажет. NDA-ға қол қойып, сәйкестендіруге қатыса алады.',
              'Требуются дополнительные документы. Может подписать NDA и участвовать в подборе.',
              'Additional documents are required. May sign an NDA and take part in matching.',
              '须补充提交文件。可签署保密协议（NDA）并参与匹配。',
            ),
          },
          {
            badge: t('50-64 балл', '50-64 балла', '50-64 points', '50-64分'),
            title: t('C деңгейі: бақылау тобы', 'Уровень C: группа наблюдения', 'Grade C: watch group', 'C级：观察组'),
            text: t(
              'Сәйкестендіруге қатыспайды: ол тек A және B деңгейлері үшін жүргізіледі. Жағдайы бақылауда болады.',
              'В подборе не участвует: он проводится только для уровней A и B. Ситуация остаётся под наблюдением.',
              'Does not take part in matching, which is held only for Grades A and B. The situation stays under observation.',
              '不参与匹配，匹配仅面向A级和B级。其情况将持续观察。',
            ),
          },
          {
            badge: t('50 баллдан төмен', 'Менее 50 баллов', 'Below 50 points', '50分以下'),
            title: t('D деңгейі: кейінге қалдырылады', 'Уровень D: откладывается', 'Grade D: deferred', 'D级：暂缓'),
            text: t(
              'Басым жобаларға жіберілмейді.',
              'К приоритетным проектам не допускается.',
              'Not admitted to priority projects.',
              '不得参与重点项目。',
            ),
          },
        ],
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          '100 балдық баға ішкі басқару құралы: ол ресми рейтинг емес, ашық жарияланбайды және қаржылық кепілдік бермейді. Тексеру инвестордың сенімділігіне немесе жобаның табысына кепілдік емес. Баға әдістемесі әзірге жоба күйінде, Басқарма бекіткеннен кейін осы бетте жарияланады.',
          'Оценка по 100 баллам является внутренним инструментом управления: она не представляет собой официальный рейтинг, не публикуется открыто и не даёт финансовых гарантий. Проверка не гарантирует надёжность инвестора или успех проекта. Методика оценки пока находится в статусе проекта и будет опубликована на этой странице после утверждения правлением.',
          'The 100-point score is an internal management tool: it is not an official rating, is not published openly and does not provide a financial guarantee. Vetting does not guarantee an investor’s reliability or a project’s success. The assessment methodology is still a draft and will be published on this page once the Management Board has approved it.',
          '100分评估是内部管理工具：它不是官方评级，不会公开发布，也不构成财务担保。审核并不保证投资者的可靠性或项目的成功。评估方法论目前仍为草案，经理事会批准后将在本页公布。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Инвесторды тексеру тәртібі туралы сұранысыңызды қалдырыңыз.',
        'Оставьте запрос о порядке проверки инвесторов.',
        'Leave an enquiry about the investor vetting procedure.',
        '请就投资者审核流程留下咨询。',
      ),
    ),
  },

  // 4. Өнеркәсіптік кооперация
  'industrial-cooperation': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Шетелдік өндірушілер мен технология иелерін отандық өнеркәсіп компанияларымен байланыстырамыз. Бірлескен кәсіпорын құру, технология трансферті және өндірісті Қазақстанда оқшаулау форматтары қарастырылады. Қытай бағытында өндірістік кооперация жобалары, индустриялық аймақтар мен арнайы экономикалық аймақтар (АЭА) орналасу алаңы ретінде қаралады.',
          'Мы связываем иностранных производителей и владельцев технологий с отечественными промышленными компаниями. Рассматриваются форматы совместного предприятия, трансфера технологий и локализации производства в Казахстане. В китайском направлении проекты производственной кооперации, индустриальные зоны и СЭЗ рассматриваются как площадки для размещения.',
          'We connect foreign manufacturers and technology owners with Kazakhstani industrial companies. Joint ventures, technology transfer and the localisation of production in Kazakhstan are the formats considered. In the Chinese direction, industrial cooperation projects, industrial zones and special economic zones (SEZs) are considered as sites.',
          '我们将外国制造商和技术持有者与哈萨克斯坦本土工业企业对接，重点考虑合资企业、技术转让以及在哈萨克斯坦实现生产本地化等合作形式。在中国方向上，产能合作项目、工业园区和经济特区可作为落地选址。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Шетелдік өндірушілер', 'Иностранные производители', 'Foreign manufacturers', '外国制造商'),
            text: t(
              'Қазақстанда өндіріс ашқысы келетін немесе технологиясын беруге дайын компаниялар.',
              'Компании, которые хотят открыть производство в Казахстане или готовы передать технологию.',
              'Companies that want to set up production in Kazakhstan or are ready to transfer technology.',
              '希望在哈萨克斯坦设立生产或愿意转让技术的企业。',
            ),
          },
          {
            title: t(
              'Отандық өнеркәсіп компаниялары',
              'Отечественные промышленные компании',
              'Domestic industrial companies',
              '本土工业企业',
            ),
            text: t(
              'Технологиялық серіктес, бірлескен кәсіпорын немесе инвестор іздейтін өндірушілер.',
              'Производители, которые ищут технологического партнёра, совместное предприятие или инвестора.',
              'Producers looking for a technology partner, a joint venture or an investor.',
              '寻找技术合作伙伴、合资企业或投资者的生产企业。',
            ),
          },
          {
            title: t(
              'Индустриялық аймақтар мен АЭА',
              'Индустриальные зоны и СЭЗ',
              'Industrial zones and SEZs',
              '工业园区与经济特区',
            ),
            text: t(
              'Өндірістік жобаларға орналасу алаңын ұсынатын аймақтар.',
              'Зоны, которые предлагают площадки для производственных проектов.',
              'Zones that offer sites for production projects.',
              '为生产项目提供选址的园区。',
            ),
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Қажеттілікті талдау', 'Анализ потребности', 'Needs analysis', '需求分析'),
            text: t(
              'Өнімі, технологиясы, көлемі және орналасу талаптары бойынша тараптың мақсаты нақтыланады.',
              'Уточняется цель стороны: продукция, технология, масштаб и требования к размещению.',
              'The party’s objective is clarified: product, technology, scale and siting requirements.',
              '明确当事方的目标，包括产品、技术、规模与选址要求。',
            ),
          },
          {
            title: t('Серіктес іздеу', 'Поиск партнёра', 'Finding a partner', '寻找合作伙伴'),
            text: t(
              'Жобаға сай шетелдік және отандық серіктес таңдалады, тараптар тексеруден өтеді.',
              'Подбирается подходящий иностранный и отечественный партнёр, стороны проходят проверку.',
              'A suitable foreign and domestic partner is identified, and the parties are vetted.',
              '遴选合适的外方与本土合作伙伴，并对各方进行审核。',
            ),
          },
          {
            title: t('Орналасу алаңы', 'Площадка', 'Site selection', '选址'),
            text: t(
              'Индустриялық аймақ, АЭА немесе өңір бойынша орналасу нұсқалары қаралады.',
              'Рассматриваются варианты размещения: индустриальная зона, СЭЗ или регион.',
              'Siting options are reviewed: an industrial zone, an SEZ or a region.',
              '比较工业园区、经济特区或地区等选址方案。',
            ),
          },
          {
            title: t('Кооперация моделі', 'Модель кооперации', 'Cooperation model', '合作模式'),
            text: t(
              'Бірлескен кәсіпорын, технология трансферті немесе оқшаулау моделі таңдалып, құрылымдалады.',
              'Выбирается и структурируется модель: совместное предприятие, трансфер технологий или локализация.',
              'A model is chosen and structured: a joint venture, technology transfer or localisation.',
              '选定并设计合作模式：合资企业、技术转让或本地化生产。',
            ),
          },
          {
            title: t('Келісу және мониторинг', 'Согласование и мониторинг', 'Agreement and monitoring', '签约与监测'),
            text: t(
              'Тараптар ресми шартқа қол қояды. Іске асыру, оның ішінде жергілікті үлес (жұмыс орны, жергілікті сатып алу) бақыланады.',
              'Стороны подписывают официальный договор. Отслеживается реализация, в том числе локальный вклад (рабочие места, локальные закупки).',
              'The parties sign an official contract. Implementation is monitored, including the local contribution (jobs and local procurement).',
              '双方签署正式合同。对实施情况进行监测，包括本地贡献（就业、本地采购）。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: Қазақстанда өндірісті оқшаулауға және технология трансфертіне бағытталған өнеркәсіптік кооперация жобаларын қалыптастыру. Нәтиже жұмыс орны, жергілікті сатып алу және технология трансферті көрсеткіштері бойынша бағаланады. Қол қойылған шарттар мен нақты түскен инвестиция төрт бөлек есепте көрсетіледі.',
          'Цель: формировать проекты промышленной кооперации, направленные на локализацию производства и трансфер технологий в Казахстане. Результат оценивается по показателям рабочих мест, локальных закупок и трансфера технологий. Подписанные договоры и фактически поступившие инвестиции показываются в четырёх раздельных отчётах.',
          'The aim is to build industrial cooperation projects focused on localising production and transferring technology in Kazakhstan. Results are assessed by jobs, local procurement and technology transfer. Signed contracts and investment actually received are shown in four separate ledgers.',
          '目标是打造以哈萨克斯坦生产本地化和技术转让为方向的产业合作项目。成果按就业、本地采购与技术转让等指标评估。已签署的合同和实际到位的投资以四本独立账目呈现。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қауымдастық өнеркәсіптік серіктестерді байланыстырады және кооперация құрылымын жобалауға көмектеседі, бірақ бірлескен кәсіпорынның құрылуына, технологияны беруге немесе өндірістің іске қосылуына кепілдік бермейді. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Қауымдастық мемлекеттік орган емес және жеңілдікке не мемлекеттік рұқсатқа кепілдік бермейді.',
          'Ассоциация связывает промышленных партнёров и помогает проектировать структуру кооперации, но не гарантирует создание совместного предприятия, передачу технологии или запуск производства. Финансирование осуществляют организации, имеющие лицензию. Ассоциация не является государственным органом и не гарантирует льготы или государственные разрешения.',
          'The Association connects industrial partners and helps to design the structure of cooperation, but does not guarantee that a joint venture will be set up, technology transferred or production launched. Financing is provided by licensed organisations. The Association is not a government body and does not guarantee incentives or government permits.',
          '协会为产业合作伙伴牵线并协助设计合作结构，但不保证合资企业一定成立、技术一定转让或生产一定启动。融资由持牌机构提供。协会不是政府机构，也不保证优惠政策或政府许可。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Кооперация форматы немесе серіктес іздеу бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по формату кооперации или поиску партнёра.',
        'Leave an enquiry about a cooperation format or a partner search.',
        '请就合作模式或寻找合作伙伴留下咨询。',
      ),
    ),
  },

  // 5. Жобалық қаржыландыру
  'project-finance': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Жобаға сай қаржыландыру моделін таңдап, капитал құрылымын жобалауға көмектесеміз. Қарастырылатын модельдер: EPC, EPC+F, BOT, мемлекеттік-жекешелік әріптестік (МЖӘ), бірлескен кәсіпорын және үлестік қатысу. Парсы шығанағы инвесторлары үшін ислам қаржысы құралдары мен АХҚО алаңындағы құрылымдау да қарастырылады.\n\nҚаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Қауымдастық құрылымдауға көмектеседі, бірақ қаржыландыруды өзі ұсынбайды.',
          'Мы помогаем выбрать модель финансирования под проект и спроектировать структуру капитала. Рассматриваются модели EPC, EPC+F, BOT, государственно-частное партнёрство (ГЧП), совместное предприятие и долевое участие. Для инвесторов из стран Персидского залива также рассматриваются инструменты исламских финансов и структурирование на площадке МФЦА.\n\nФинансирование осуществляют организации, имеющие лицензию. Ассоциация помогает со структурированием, но само финансирование не предоставляет.',
          'We help to choose a financing model for a project and to design its capital structure. The models considered are EPC, EPC+F, BOT, public-private partnership (PPP), joint venture and equity participation. For investors from the Gulf, Islamic finance instruments and structuring on the AIFC platform are also considered.\n\nFinancing is provided by licensed organisations. The Association helps with structuring but does not provide financing itself.',
          '我们协助为项目选择融资模式，并设计资本结构。可考虑的模式包括EPC、EPC+F、BOT、政府和社会资本合作（PPP）、合资企业与股权投资。对于海湾国家的投资者，还可考虑伊斯兰金融工具以及在阿斯塔纳国际金融中心平台上进行结构设计。\n\n融资由持牌机构提供。协会协助进行结构设计，但自身不提供融资。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Жоба иелері', 'Владельцы проектов', 'Project owners', '项目方'),
            text: t(
              'Жобасы үшін қаржыландыру моделі мен капитал құрылымын таңдағысы келетін компаниялар.',
              'Компании, которым нужно выбрать для проекта модель финансирования и структуру капитала.',
              'Companies that need to choose a financing model and capital structure for their project.',
              '需要为项目选择融资模式与资本结构的企业。',
            ),
          },
          {
            title: t('Инвесторлар', 'Инвесторы', 'Investors', '投资者'),
            text: t(
              'Қатысу форматын, үлесін және қаржыландыру шарттарын нақтылағысы келетін инвесторлар.',
              'Инвесторы, которым нужно определить формат участия, долю и условия финансирования.',
              'Investors who need to define the form of participation, share and financing terms.',
              '需要明确参与方式、出资份额与融资条件的投资者。',
            ),
          },
          {
            title: t('Парсы шығанағы қорлары', 'Фонды стран Персидского залива', 'Gulf funds', '海湾地区基金'),
            text: t(
              'Егемен қорлар мен отбасылық кеңселер: бірлескен инвестиция, ислам қаржысы және АХҚО алаңындағы құрылымдау.',
              'Суверенные фонды и семейные офисы: совместные инвестиции, исламские финансы и структурирование в МФЦА.',
              'Sovereign funds and family offices: co-investment, Islamic finance and structuring at the AIFC.',
              '主权基金与家族办公室：联合投资、伊斯兰金融以及在阿斯塔纳国际金融中心的结构设计。',
            ),
            href: '/investors/gulf',
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Жобаны талдау', 'Анализ проекта', 'Project analysis', '项目分析'),
            text: t(
              'Жобаның қаржылық қажеттілігі, дайындық деңгейі және тәуекелдері зерттеледі.',
              'Изучаются финансовая потребность проекта, уровень готовности и риски.',
              'The project’s funding need, readiness level and risks are examined.',
              '研究项目的资金需求、成熟度与风险。',
            ),
          },
          {
            title: t('Модельді таңдау', 'Выбор модели', 'Choosing a model', '选择模式'),
            text: t(
              'EPC, EPC+F, BOT, МЖӘ, бірлескен кәсіпорын немесе үлестік қатысу модельдері салыстырылады.',
              'Сравниваются модели EPC, EPC+F, BOT, ГЧП, совместное предприятие и долевое участие.',
              'EPC, EPC+F, BOT, PPP, joint venture and equity participation models are compared.',
              '比较EPC、EPC+F、BOT、PPP、合资企业与股权投资等模式。',
            ),
          },
          {
            title: t('Капитал құрылымы', 'Структура капитала', 'Capital structure', '资本结构'),
            text: t(
              'Меншікті және қарыз қаражаттың арақатынасы мен тараптардың рөлі жобаланады.',
              'Проектируются соотношение собственных и заёмных средств и роли сторон.',
              'The balance of equity and debt and the roles of the parties are designed.',
              '设计自有资金与借贷资金的比例以及各方角色。',
            ),
          },
          {
            title: t(
              'Қаржыландыру көздерімен байланыс',
              'Выход на источники финансирования',
              'Approaching sources of finance',
              '对接融资来源',
            ),
            text: t(
              'Жоба лицензиясы бар қаржы ұйымдарына және инвесторларға таныстырылады.',
              'Проект представляется лицензированным финансовым организациям и инвесторам.',
              'The project is presented to licensed financial institutions and investors.',
              '向持牌金融机构和投资者介绍项目。',
            ),
          },
          {
            title: t('Келісімдер мен өтініштер', 'Соглашения и заявки', 'Agreements and applications', '协议与申请'),
            text: t(
              'Қаржыландыру моделі, келісімдер мен өтініштер дайындалады, тараптар арасында келіссөз жүреді.',
              'Готовятся модель финансирования, соглашения и заявки, стороны ведут переговоры.',
              'The financing model, agreements and applications are prepared, and the parties negotiate.',
              '拟定融资模式、协议与申请文件，各方进行谈判。',
            ),
          },
          {
            title: t(
              'Шартқа қол қою және мониторинг',
              'Подписание и мониторинг',
              'Signing and monitoring',
              '签约与监测',
            ),
            text: t(
              'Тараптар ресми шартқа қол қояды. Қаражаттың түсуі мен іске асыру бақыланады.',
              'Стороны подписывают официальный договор. Отслеживаются поступление средств и реализация.',
              'The parties sign an official contract. The receipt of funds and implementation are monitored.',
              '双方签署正式合同。对资金到位和实施情况进行监测。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: жоба үшін түсінікті қаржыландыру моделі мен капитал құрылымын қалыптастыру және тараптарды ресми шартқа жақындату. Әр жобада төрт сома бөлек есептеледі: мәлімделген, ниет құжаты бойынша, ресми шарт бойынша және нақты түскен.',
          'Цель: сформировать для проекта понятную модель финансирования и структуру капитала и приблизить стороны к официальному договору. По каждому проекту четыре суммы учитываются раздельно: заявленная, по документу о намерениях, по официальному договору и фактически поступившая.',
          'The aim is to give the project a clear financing model and capital structure and to bring the parties closer to an official contract. Four amounts are recorded separately for each project: declared, per letter of intent, per signed contract and actually received.',
          '目标是为项目形成清晰的融资模式与资本结构，并推动各方接近正式合同。每个项目分别记录四类金额：申报、按意向文件、按正式合同和实际到位。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Қауымдастық құрылымдауға көмектеседі, бірақ қаржыландырудың берілуіне, қарыз немесе инвестиция жасалуына, табысқа кепілдік бермейді. Қауымдастық мемлекеттік орган емес.',
          'Финансирование осуществляют организации, имеющие лицензию. Ассоциация помогает со структурированием, но не гарантирует предоставление финансирования, заключение кредита или инвестиции либо доход. Ассоциация не является государственным органом.',
          'Financing is provided by licensed organisations. The Association helps with structuring, but does not guarantee that financing will be provided, that a loan or investment will be made, or any return. The Association is not a government body.',
          '融资由持牌机构提供。协会协助进行结构设计，但不保证融资一定落实，不保证贷款或投资一定达成，也不保证收益。协会不是政府机构。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Қаржыландыру моделі немесе капитал құрылымы бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по модели финансирования или структуре капитала.',
        'Leave an enquiry about a financing model or capital structure.',
        '请就融资模式或资本结构留下咨询。',
      ),
    ),
  },

  // 6. Мемлекетпен және өңірлермен жұмыс
  'government-relations': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Инвесторлар мен мүшелердің мемлекетке жеткізілетін мәселелерін (жер, инфрақұрылым, рұқсат, салық, еңбек, көші-қон) ресми арналар арқылы жеткіземіз және шешілуін бақылаймыз. Әр мәселе тізілімге жазылады: оның жіберілген органы мен мәртебесі көрсетіледі. Өңірлік өкілдер өз өңіріндегі жобалар мен инвесторлар бойынша жұмыс істейді.',
          'Мы передаём вопросы инвесторов и членов ассоциации, требующие участия государства (земля, инфраструктура, разрешения, налоги, труд, миграция), по официальным каналам и контролируем их решение. Каждый вопрос записывается в реестр с указанием органа, которому он направлен, и статуса. Региональные представители работают с проектами и инвесторами своего региона.',
          'We raise investors’ and members’ issues that need a government response (land, infrastructure, permits, tax, labour, migration) through official channels and track their resolution. Each issue is entered in a register, with the body it was sent to and its status. Regional representatives work with the projects and investors of their own region.',
          '我们通过正式渠道反映投资者和会员需要政府回应的问题（土地、基础设施、许可、税务、劳动、移民），并跟踪问题的解决。每个问题都会登记在台账中，注明送达机关和办理状态。地区代表负责本地区的项目与投资者工作。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Мүше компаниялар', 'Компании-члены', 'Member companies', '会员企业'),
            text: t(
              'Мемлекетке жеткізілетін мәселені өтініш ретінде жеке кабинет арқылы жібереді.',
              'Направляют вопрос, требующий участия государства, как заявку через личный кабинет.',
              'Submit an issue that needs a government response as a request through the personal account.',
              '通过个人账户以申请形式提交需政府回应的问题。',
            ),
            href: '/membership',
          },
          {
            title: t('Шетелдік инвесторлар', 'Иностранные инвесторы', 'Foreign investors', '外国投资者'),
            text: t(
              'Қазақстандағы жобасын іске асыру кезінде жер, рұқсат, салық немесе көші-қон мәселесіне тап болғандар.',
              'Столкнувшиеся при реализации проекта в Казахстане с вопросом по земле, разрешениям, налогам или миграции.',
              'Those who face a land, permit, tax or migration issue while carrying out a project in Kazakhstan.',
              '在哈萨克斯坦实施项目时遇到土地、许可、税务或移民问题的投资者。',
            ),
          },
          {
            title: t('Жоба иелері', 'Владельцы проектов', 'Project owners', '项目方'),
            text: t(
              'Жобасының жер, инфрақұрылым немесе рұқсат мәселелерін шешкісі келетін иелер.',
              'Владельцы, которые хотят решить вопросы проекта по земле, инфраструктуре или разрешениям.',
              'Owners who want to resolve land, infrastructure or permit issues affecting their project.',
              '希望解决项目土地、基础设施或许可问题的项目方。',
            ),
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Өтінішті қабылдау', 'Приём обращения', 'Receiving the request', '受理诉求'),
            text: t(
              'Мүше немесе инвестор мәселені жеке кабинет немесе «Байланыс» беті арқылы жібереді.',
              'Член ассоциации или инвестор направляет вопрос через личный кабинет или страницу «Контакты».',
              'A member or investor sends the issue through the personal account or the Contacts page.',
              '会员或投资者通过个人账户或“联系我们”页面提交问题。',
            ),
          },
          {
            title: t('Тіркеу және жіктеу', 'Регистрация и классификация', 'Logging and classification', '登记与分类'),
            text: t(
              'Мәселе тізілімге жазылып, түрі бойынша жіктеледі: жер, инфрақұрылым, рұқсат, салық, еңбек немесе көші-қон.',
              'Вопрос записывается в реестр и классифицируется: земля, инфраструктура, разрешения, налоги, труд или миграция.',
              'The issue is entered in the register and classified: land, infrastructure, permits, tax, labour or migration.',
              '问题登记入台账并分类：土地、基础设施、许可、税务、劳动或移民。',
            ),
          },
          {
            title: t('Деректерді дайындау', 'Подготовка материалов', 'Preparing the materials', '整理材料'),
            text: t(
              'Мәселенің мәні, қатысты жоба мен құжаттар нақтыланады.',
              'Уточняются суть вопроса, связанный проект и документы.',
              'The substance of the issue, the project concerned and the documents are clarified.',
              '明确问题实质、相关项目与文件。',
            ),
          },
          {
            title: t(
              'Ресми арна арқылы жолдау',
              'Направление по официальному каналу',
              'Sending through an official channel',
              '通过正式渠道转送',
            ),
            text: t(
              'Мәселе тиісті мемлекеттік органға қауымдастықтың ресми арнасы арқылы жіберіледі, жіберілген орган тізілімде көрсетіледі.',
              'Вопрос направляется в соответствующий государственный орган по официальному каналу ассоциации, орган, которому он направлен, указывается в реестре.',
              'The issue is sent to the competent government body through the Association’s official channel, and the body concerned is recorded in the register.',
              '问题通过协会的正式渠道转送至相应的政府机关，送达机关记入台账。',
            ),
          },
          {
            title: t('Мәртебені бақылау', 'Контроль статуса', 'Tracking the status', '跟踪办理状态'),
            text: t(
              'Мәселенің мәртебесі тізілімде жаңартылып отырады, өтініш иесі оны жеке кабинетте көреді.',
              'Статус вопроса обновляется в реестре, заявитель видит его в личном кабинете.',
              'The status of the issue is kept up to date in the register and the applicant sees it in the personal account.',
              '问题的办理状态在台账中持续更新，申请人可在个人账户中查看。',
            ),
          },
          {
            title: t('Нәтижені тіркеу', 'Фиксация результата', 'Recording the outcome', '记录结果'),
            text: t(
              'Орган жауабы немесе шешімі тіркеледі, мәселе жабылады не келесі әрекет жоспарланады.',
              'Ответ или решение органа фиксируется, вопрос закрывается либо планируется следующий шаг.',
              'The body’s reply or decision is recorded, and the issue is closed or a next step is planned.',
              '记录机关的答复或决定，问题随之办结或另行安排下一步行动。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: инвесторлар мен мүшелердің мәселелері ресми арналар арқылы жолданып, олардың мәртебесі ашық көрінетін болуы. Әр мәселе бойынша жіберілген орган, мәртебе және жауап тізілімде сақталады.',
          'Цель: чтобы вопросы инвесторов и членов ассоциации направлялись по официальным каналам, а их статус был виден. По каждому вопросу в реестре сохраняются орган, статус и ответ.',
          'The aim is for the issues of investors and members to be sent through official channels, with their status visible. For each issue the register keeps the body concerned, the status and the reply.',
          '目标是让投资者和会员的问题通过正式渠道转送，并使办理状态清晰可见。每个问题的送达机关、状态和答复都会保存在台账中。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қауымдастық мемлекеттік орган емес және мемлекеттік органның атынан әрекет етпейді: ол мәселені ресми арна арқылы жеткізеді, ал шешімді тиісті орган өз құзыреті шегінде қабылдайды. Нәтижеге, рұқсатқа немесе жеңілдікке кепілдік берілмейді. Мемлекеттік органмен кездесу «кездесу өтті» деп көрсетіледі және серіктестік орнады дегенді білдірмейді.',
          'Ассоциация не является государственным органом и не действует от его имени: она доводит вопрос по официальному каналу, а решение принимает соответствующий орган в пределах своей компетенции. Результат, разрешение или льготы не гарантируются. Встреча с государственным органом отражается как «встреча состоялась» и не означает установления партнёрства.',
          'The Association is not a government body and does not act on behalf of one: it raises the issue through an official channel, and the competent body takes its decision within its own authority. No result, permit or incentive is guaranteed. A meeting with a government body is recorded as “meeting held” and does not mean a partnership has been established.',
          '协会不是政府机构，亦不代表政府机构行事：协会通过正式渠道反映问题，决定由相应机关在其职权范围内作出。协会不保证任何结果、许可或优惠。与政府机关会面仅记录为“会面已举行”，并不意味着已建立合作关系。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Мемлекетке жеткізілетін мәселе бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по вопросу, который нужно довести до государства.',
        'Leave an enquiry about an issue that needs to be raised with the state.',
        '请就需要向政府反映的问题留下咨询。',
      ),
    ),
  },

  // 7. Нарыққа кіру және сүйемелдеу
  'market-entry': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Қазақстан нарығына кіретін инвесторға тіркеу, құқық, салық, логистика және кадр бойынша сенімді кәсіби серіктестерді табуға көмектесеміз. Нарыққа кіру жолы жобаның моделіне, саласына және орналасатын өңіріне қарай жеке құрылады. Құқықтық бағдар «Инвестор анықтамалығында» жинақталады.',
          'Мы помогаем инвестору, выходящему на рынок Казахстана, найти надёжных профессиональных партнёров по регистрации, праву, налогам, логистике и кадрам. Путь выхода на рынок выстраивается индивидуально с учётом модели, отрасли и региона проекта. Правовые ориентиры собраны в «Справочнике инвестора».',
          'We help an investor entering the Kazakhstan market to find reliable professional partners for registration, legal, tax, logistics and staffing matters. The route to market is built individually, taking account of the project’s model, sector and region. Legal guidance is collected in the “Investor handbook”.',
          '我们协助进入哈萨克斯坦市场的投资者，在注册、法律、税务、物流与人力方面寻找可靠的专业合作伙伴。进入市场的路径将根据项目的模式、行业和所在地区量身设计。法律指引汇集在《投资者手册》中。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Шетелдік инвесторлар', 'Иностранные инвесторы', 'Foreign investors', '外国投资者'),
            text: t(
              'Қазақстанда компания ашып, өндіріс немесе кеңсе орналастырғысы келетін инвесторлар.',
              'Инвесторы, которые хотят открыть в Казахстане компанию, производство или офис.',
              'Investors who want to set up a company, production or an office in Kazakhstan.',
              '希望在哈萨克斯坦设立公司、生产基地或办事处的投资者。',
            ),
            href: '/investors/handbook',
          },
          {
            title: t('Қытай компаниялары', 'Китайские компании', 'Chinese companies', '中国企业'),
            text: t(
              'Қытай тіліндегі құқықтық бағдар мен жергілікті сенімді серіктес іздейтін компаниялар.',
              'Компании, которым нужны правовые ориентиры на китайском языке и надёжный местный партнёр.',
              'Companies that need legal guidance in Chinese and a reliable local partner.',
              '需要中文法律指引和可靠本地合作伙伴的企业。',
            ),
            href: '/investors/china',
          },
          {
            title: t(
              'Кәсіби қызмет көрсетушілер',
              'Поставщики профессиональных услуг',
              'Professional service providers',
              '专业服务机构',
            ),
            text: t(
              'Тіркеу, құқық, салық, логистика және кадр қызметтерін ұсынып, серіктестер желісіне қосылғысы келетін компаниялар.',
              'Компании, предлагающие услуги по регистрации, праву, налогам, логистике и кадрам и желающие войти в сеть партнёров.',
              'Companies that offer registration, legal, tax, logistics and staffing services and wish to join the partner network.',
              '提供注册、法律、税务、物流与人力服务并希望加入合作伙伴网络的机构。',
            ),
            href: '/membership',
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Мақсатты нақтылау', 'Уточнение цели', 'Clarifying the objective', '明确目标'),
            text: t(
              'Инвестордың жоспарлы моделі, саласы, өңірі және мерзімі нақтыланады.',
              'Уточняются планируемая модель, отрасль, регион и сроки инвестора.',
              'The investor’s planned model, sector, region and timetable are clarified.',
              '明确投资者拟采用的模式、行业、地区与时间安排。',
            ),
          },
          {
            title: t('Құқықтық бағдар', 'Правовые ориентиры', 'Legal guidance', '法律指引'),
            text: t(
              'Инвестор анықтамалығы арқылы Қазақстанға кірудің құқықтық бағдары беріледі.',
              'Правовые ориентиры входа в Казахстан предоставляются через справочник инвестора.',
              'Legal guidance on entering Kazakhstan is provided through the investor handbook.',
              '通过投资者手册提供进入哈萨克斯坦的法律指引。',
            ),
          },
          {
            title: t('Серіктестерді таңдау', 'Подбор партнёров', 'Choosing partners', '遴选合作伙伴'),
            text: t(
              'Тіркеу, құқық, салық, логистика және кадр бойынша кәсіби серіктестер ұсынылады.',
              'Предлагаются профессиональные партнёры по регистрации, праву, налогам, логистике и кадрам.',
              'Professional partners for registration, legal, tax, logistics and staffing are proposed.',
              '推荐注册、法律、税务、物流与人力方面的专业合作伙伴。',
            ),
          },
          {
            title: t('Тіркеу және іске қосу', 'Регистрация и запуск', 'Registration and launch', '注册与启动'),
            text: t(
              'Компания тіркеледі, қажетті рұқсаттар рәсімделеді, алаң, жабдық пен кадр мәселелері шешіледі.',
              'Регистрируется компания, оформляются необходимые разрешения, решаются вопросы площадки, оборудования и кадров.',
              'The company is registered, the necessary permits are obtained and questions of site, equipment and staffing are settled.',
              '办理公司注册与必要许可，并落实场地、设备与人员事宜。',
            ),
          },
          {
            title: t('Сүйемелдеу', 'Сопровождение', 'Ongoing support', '持续支持'),
            text: t(
              'Іске асыру кезеңінде мәселелер бақыланады, қажет болса «Мемлекетпен және өңірлермен жұмыс» бағыты қосылады.',
              'На этапе реализации вопросы отслеживаются, при необходимости подключается направление «Работа с государством и регионами».',
              'Issues are followed during implementation and, where needed, the “Working with government and regions” line is brought in.',
              '在实施阶段持续跟进相关问题，必要时对接“政府与地方对接”服务。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: инвестор Қазақстанда компанияны тіркеу, рұқсаттар, салық, логистика және кадр мәселелерін сенімді кәсіби серіктестермен реттеп, жобасын іске қосуға көшуі. Іске асыру барысы мониторинг кезеңінде бақыланады.',
          'Цель: чтобы инвестор урегулировал вопросы регистрации компании, разрешений, налогов, логистики и кадров вместе с надёжными профессиональными партнёрами и перешёл к запуску проекта. Ход реализации отслеживается на этапе мониторинга.',
          'The aim is for the investor to settle company registration, permits, tax, logistics and staffing with reliable professional partners and move on to launching the project. Progress is followed at the monitoring stage.',
          '目标是让投资者借助可靠的专业合作伙伴，办妥公司注册、许可、税务、物流与人员事宜，进而启动项目。实施进展将在监测阶段持续跟踪。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Кәсіби қызмет көрсетушілер (құқық, салық, тіркеу, логистика, кадр) өз жауапкершілігімен және өз шарттары бойынша жұмыс істейді. Қауымдастық серіктестерді ұсынады, бірақ олардың қызмет сапасына, рұқсаттардың берілуіне және нарықтағы табысқа кепілдік бермейді. Қауымдастық мемлекеттік орган емес.',
          'Профессиональные поставщики услуг (право, налоги, регистрация, логистика, кадры) работают на собственную ответственность и по собственным условиям. Ассоциация рекомендует партнёров, но не гарантирует качество их услуг, выдачу разрешений и успех на рынке. Ассоциация не является государственным органом.',
          'Professional service providers (legal, tax, registration, logistics, staffing) work on their own responsibility and on their own terms. The Association proposes partners, but does not guarantee the quality of their services, the grant of permits or success in the market. The Association is not a government body.',
          '专业服务机构（法律、税务、注册、物流、人力）自行承担责任，并按各自条款提供服务。协会负责推荐合作伙伴，但不保证其服务质量、许可的取得或市场成功。协会不是政府机构。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Нарыққа кіру және кәсіби серіктестер бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по выходу на рынок и профессиональным партнёрам.',
        'Leave an enquiry about market entry and professional partners.',
        '请就市场准入与专业合作伙伴留下咨询。',
      ),
    ),
  },

  // 8. Жасыл инвестиция және инновация
  'green-investment': {
    blocks: [
      {
        type: 'paragraphs',
        heading: hWhat,
        text: t(
          'Жаңартылатын энергетика, қалдықтарды қайта өңдеу және терең өңдеу жобаларына инвестор мен технология серіктесін табуға көмектесеміз. Еуропа және Азия бағытында технология трансферті, жасыл энергетика және экспортқа бағытталған өндіріс жобалары қарастырылады. Сараптама кезеңінде экология бойынша қорытынды да жиналады.',
          'Мы помогаем найти инвестора и технологического партнёра для проектов в сфере возобновляемой энергетики, переработки отходов и глубокой переработки. В европейском и азиатском направлении рассматриваются проекты трансфера технологий, зелёной энергетики и экспортно ориентированного производства. На этапе экспертизы собирается в том числе заключение по экологии.',
          'We help to find an investor and a technology partner for renewable energy, waste recycling and deep-processing projects. In the European and Asian direction we consider technology transfer, green energy and export-oriented manufacturing projects. An environmental opinion is also gathered at the expert review stage.',
          '我们协助为可再生能源、废弃物回收与深加工项目寻找投资者和技术合作伙伴。在欧洲与亚洲方向上，重点考虑技术转让、绿色能源和面向出口的制造业项目。专家评审阶段还会收集环境方面的意见。',
        ),
      },
      {
        type: 'cards',
        heading: hWhom,
        columns: 3,
        items: [
          {
            title: t('Жасыл жобалардың иелері', 'Владельцы зелёных проектов', 'Owners of green projects', '绿色项目方'),
            text: t(
              'Жаңартылатын энергетика, қалдықтарды қайта өңдеу немесе терең өңдеу жобасына инвестор іздейтін компаниялар.',
              'Компании, которые ищут инвестора для проекта в сфере возобновляемой энергетики, переработки отходов или глубокой переработки.',
              'Companies looking for an investor for a renewable energy, waste recycling or deep-processing project.',
              '为可再生能源、废弃物回收或深加工项目寻找投资者的企业。',
            ),
            href: '/projects/submit',
          },
          {
            title: t('Технология иелері', 'Владельцы технологий', 'Technology owners', '技术持有者'),
            text: t(
              'Технологиясын Қазақстанда қолдануға немесе беруге дайын шетелдік және отандық компаниялар мен инновациялық командалар.',
              'Иностранные и отечественные компании и инновационные команды, готовые применить или передать технологию в Казахстане.',
              'Foreign and domestic companies and innovation teams ready to apply or transfer technology in Kazakhstan.',
              '愿意在哈萨克斯坦应用或转让技术的外国与本土企业及创新团队。',
            ),
          },
          {
            title: t(
              'Еуропа және Азия инвесторлары',
              'Инвесторы из Европы и Азии',
              'Investors from Europe and Asia',
              '欧亚投资者',
            ),
            text: t(
              'Технология трансферті мен жасыл энергетикаға қызығатын ЕО, Түркия, Корея және Жапония инвесторлары.',
              'Инвесторы из ЕС, Турции, Кореи и Японии, интересующиеся трансфером технологий и зелёной энергетикой.',
              'Investors from the EU, Turkey, Korea and Japan interested in technology transfer and green energy.',
              '关注技术转让与绿色能源的欧盟、土耳其、韩国和日本投资者。',
            ),
            href: '/investors/global',
          },
        ],
      },
      {
        type: 'steps',
        heading: hStages,
        items: [
          {
            title: t('Жобаны анықтау', 'Определение проекта', 'Identifying the project', '确定项目'),
            text: t(
              'Жоба бағыты (жаңартылатын энергетика, қалдықтарды қайта өңдеу, терең өңдеу), орны мен иесі тіркеледі.',
              'Фиксируются направление проекта (возобновляемая энергетика, переработка отходов, глубокая переработка), место и владелец.',
              'The project type (renewable energy, waste recycling, deep processing), location and owner are recorded.',
              '登记项目类型（可再生能源、废弃物回收、深加工）、地点与项目方。',
            ),
          },
          {
            title: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
            text: t(
              'Қаржы, құқық, техника, нарық және экология бойынша қорытындылар жиналады.',
              'Собираются заключения по финансам, праву, технике, рынку и экологии.',
              'Opinions on finance, legal, technical, market and environmental matters are gathered.',
              '汇集财务、法律、技术、市场与环境方面的意见。',
            ),
          },
          {
            title: t('Технология серіктесі', 'Технологический партнёр', 'Technology partner', '技术合作伙伴'),
            text: t(
              'Технология трансферті мүмкін болса, технология иесі мен отандық серіктес таңдалады.',
              'Если возможен трансфер технологий, подбираются владелец технологии и местный партнёр.',
              'Where technology transfer is possible, a technology owner and a local partner are identified.',
              '如可进行技术转让，则遴选技术持有者和本地合作伙伴。',
            ),
          },
          {
            title: t(
              'Қаржыландыруды құрылымдау',
              'Структурирование финансирования',
              'Structuring the finance',
              '融资结构设计',
            ),
            text: t(
              'Жобаға қаржыландыру моделі мен капитал құрылымы жобаланады («Жобалық қаржыландыру» бағыты).',
              'Для проекта проектируются модель финансирования и структура капитала (направление «Проектное финансирование»).',
              'A financing model and capital structure are designed for the project (the “Project finance” line).',
              '为项目设计融资模式与资本结构（“项目融资”服务方向）。',
            ),
          },
          {
            title: t(
              'Инвесторға ұсыну және мониторинг',
              'Предложение инвестору и мониторинг',
              'Introduction to investors and monitoring',
              '对接投资者与监测',
            ),
            text: t(
              'Жоба сәйкес инвесторларға ұсынылады, іске асыру мен нәтиже (қуат, жұмыс орны) бақыланады.',
              'Проект предлагается подходящим инвесторам, отслеживаются реализация и результат (мощность, рабочие места).',
              'The project is put to suitable investors, and implementation and results (capacity, jobs) are monitored.',
              '向合适的投资者推介项目，并监测实施情况与成果（装机能力、就业）。',
            ),
          },
        ],
      },
      {
        type: 'paragraphs',
        heading: hResult,
        text: t(
          'Мақсат: сараптамадан өткен жасыл жобалар мен технология серіктестерінің қорын қалыптастыру. Нәтиже нақты инвестиция, қуат, жұмыс орны, салық және жергілікті сатып алу көрсеткіштері бойынша бағаланады. Көрсеткіштер жылдық есепке енгізіледі.',
          'Цель: сформировать пул прошедших экспертизу зелёных проектов и технологических партнёров. Результат оценивается по показателям фактических инвестиций, мощности, рабочих мест, налогов и локальных закупок. Показатели включаются в годовой отчёт.',
          'The aim is to build a pool of green projects that have passed expert review, together with technology partners. Results are assessed by actual investment, capacity, jobs, taxes and local procurement. The indicators are included in the annual report.',
          '目标是建立一个经专家评审的绿色项目与技术合作伙伴库。成果按实际投资、装机能力、就业、税收和本地采购等指标评估，相关指标纳入年度报告。',
        ),
      },
      {
        type: 'notice',
        tone: 'caution',
        title: hLimits,
        text: t(
          'Қауымдастық жасыл жобаның экологиялық, техникалық немесе қаржылық табысына кепілдік бермейді және мемлекеттік рұқсат пен жеңілдіктер беруге құзыретті емес. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Экологиялық қорытынды сараптама шеңберінде жиналады және ресми мемлекеттік сараптаманы алмастырмайды.',
          'Ассоциация не гарантирует экологический, технический или финансовый успех зелёного проекта и не уполномочена выдавать государственные разрешения и льготы. Финансирование осуществляют организации, имеющие лицензию. Экологическое заключение готовится в рамках экспертизы и не заменяет официальную государственную экспертизу.',
          'The Association does not guarantee the environmental, technical or financial success of a green project and has no authority to grant government permits or incentives. Financing is provided by licensed organisations. The environmental opinion is prepared as part of the expert review and does not replace an official state review.',
          '协会不保证绿色项目在环境、技术或财务上取得成功，也无权授予政府许可或优惠。融资由持牌机构提供。环境意见在专家评审框架内出具，不能替代官方的国家评审。',
        ),
      },
    ],
    cta: serviceCta(
      t(
        'Жасыл жоба немесе технология серіктесі бойынша сұранысыңызды қалдырыңыз.',
        'Оставьте запрос по зелёному проекту или технологическому партнёру.',
        'Leave an enquiry about a green project or a technology partner.',
        '请就绿色项目或技术合作伙伴留下咨询。',
      ),
    ),
  },
}
