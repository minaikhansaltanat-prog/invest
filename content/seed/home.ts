import { t } from './lib'

// Басты беттің мәтіндері (ТТ 6-бөлім). Түнгі аударма жобасы: ана тілді тілші тексеруі қажет.
// `*accent*` белгісі тақырыптағы алтын түсті бөлікті көрсетеді. `\n` жаңа жолға (тек үлкен экранда) бөледі.
export const homeSeed = {
  hero: {
    eyebrow: t(
      'Халықаралық инвестициялық ынтымақтастық платформасы',
      'Платформа международного инвестиционного сотрудничества',
      'International investment cooperation platform',
      '国际投资合作平台',
    ),
    title: t(
      'Шетелдік капитал мен Қазақстанның *нақты жобаларын* байланыстырамыз',
      'Соединяем иностранный капитал и *реальные проекты* Казахстана',
      "Connecting foreign capital with Kazakhstan's *real projects*",
      '连接外国资本与\n哈萨克斯坦的*真实项目*',
    ),
    subtitle: t(
      'Инвесторларды тексереміз, жобаларды іріктейміз және келіссөзден бастап іске асыруға дейін сүйемелдейміз. Нәтижені іс-шаралар санымен емес, нақты инвестициямен өлшейміз.',
      'Проверяем инвесторов, отбираем проекты и сопровождаем сделки от переговоров до реализации. Результат измеряем не числом мероприятий, а реальными инвестициями.',
      'We vet investors, select projects and support deals from negotiation to implementation. We measure results by real investment, not by the number of events.',
      '我们审核投资者、遴选项目，并从谈判到落地全程提供支持。我们以实际投资而非活动数量来衡量成果。',
    ),
    primaryCtaLabel: t('Инвесторға арналған жол', 'Путь для инвестора', 'Investor pathway', '投资者通道'),
    primaryCtaHref: '/investors',
    secondaryCtaLabel: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
    secondaryCtaHref: '/projects/submit',
    facts: [
      {
        id: 'fact-since',
        title: t('2017 жылдан', 'С 2017 года', 'Since 2017', '始于2017年'),
        text: t('заңды тұлғалар бірлестігі', 'объединение юридических лиц', 'association of legal entities', '法人联合体'),
      },
      {
        id: 'fact-languages',
        title: t('4 тіл', '4 языка', '4 languages', '4种语言'),
        text: t('KZ · RU · EN · 中文', 'KZ · RU · EN · 中文', 'KZ · RU · EN · 中文', 'KZ · RU · EN · 中文'),
      },
      {
        id: 'fact-lines',
        title: t('8 бағыт', '8 направлений', '8 service lines', '8大方向'),
        text: t('кәсіби қызметтер', 'профессиональные услуги', 'professional services', '专业服务'),
      },
    ],
  },

  audience: {
    cards: [
      {
        id: 'aud-investors',
        title: t('Инвесторларға', 'Инвесторам', 'For investors', '致投资者'),
        text: t(
          'Тексерілген жобалар қоры, жергілікті серіктестер және құқықтық бағдар бір терезеде.',
          'Проверенный пул проектов, местные партнеры и правовые ориентиры в одном окне.',
          'A vetted project pool, local partners and legal guidance in one place.',
          '经审核的项目库、本地合作伙伴与法律指引，一站式获取。',
        ),
        ctaLabel: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
        href: '/investors/apply',
      },
      {
        id: 'aud-owners',
        title: t('Жоба иелеріне', 'Владельцам проектов', 'For project owners', '致项目方'),
        text: t(
          'Жобаны сараптамадан өткізіп, оның ауқымы мен саласына сай инвесторды табамыз.',
          'Проводим экспертизу проекта и подбираем инвестора под его масштаб и отрасль.',
          'We put the project through expert review and find an investor that fits its scale and sector.',
          '我们对项目进行专家评审，并按规模与行业匹配合适的投资者。',
        ),
        ctaLabel: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
        href: '/projects/submit',
      },
      {
        id: 'aud-members',
        title: t('Мүшелерге', 'Членам ассоциации', 'For members', '致会员'),
        text: t(
          'Салалық желі, мүдделерді білдіру және мемлекетпен сындарлы диалог алаңы.',
          'Отраслевая сеть, представление интересов и площадка для конструктивного диалога с государством.',
          'An industry network, representation of interests and a platform for constructive dialogue with the state.',
          '行业网络、利益代表，以及与政府开展建设性对话的平台。',
        ),
        ctaLabel: t('Мүшелік шарттары', 'Условия членства', 'Membership terms', '会员条件'),
        href: '/membership/terms',
      },
    ],
  },

  results: {
    eyebrow: t('Нәтиже ашықтығы', 'Прозрачность результатов', 'Results transparency', '成果透明'),
    title: t(
      'Нәтижені төрт бөлек есеппен көрсетеміз',
      'Показываем результат в четырех раздельных отчетах',
      'We report results in four separate ledgers',
      '以四本独立账目\n呈现成果',
    ),
    lead: t(
      'Мәлімделген сома, ниет құжаты, ресми шарт және іс жүзінде түскен инвестиция ешқашан бір санға біріктірілмейді.',
      'Заявленная сумма, документ о намерениях, официальный договор и фактически поступившие инвестиции никогда не суммируются в одну цифру.',
      'Declared amounts, letters of intent, signed contracts and capital actually received are never merged into a single number.',
      '申报金额、意向文件、正式合同与实际到位资金永不合并为一个数字。',
    ),
    cells: [
      {
        id: 'cell-database',
        label: t('Деректер базасы', 'База данных', 'Database', '数据库'),
        description: t(
          'әлеуетті инвестор тіркелді',
          'потенциальных инвесторов зарегистрировано',
          'prospective investors registered',
          '位潜在投资者已登记',
        ),
      },
      {
        id: 'cell-screening',
        label: t('Тексеру', 'Проверка', 'Screening', '审核'),
        description: t(
          'инвестор бастапқы тексеруден өтті',
          'инвесторов прошли первичную проверку',
          'investors passed initial screening',
          '位投资者通过初步审核',
        ),
      },
      {
        id: 'cell-review',
        label: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
        description: t(
          'жоба алдын ала бағаланды',
          'проектов предварительно оценены',
          'projects pre-assessed',
          '个项目完成预评估',
        ),
      },
      {
        id: 'cell-confirmed',
        label: t('Расталған', 'Подтверждено', 'Confirmed', '已确认'),
        description: t(
          'жобаның инвестициясы құжатпен расталды',
          'проект с документально подтвержденной инвестицией',
          'project with documented investment',
          '个项目的投资有文件证明',
        ),
      },
    ],
  },

  services: {
    eyebrow: t('Қызметтер', 'Услуги', 'Services', '服务'),
    title: t(
      'Инвестицияның бүкіл жолын\nқамтитын сегіз бағыт',
      'Восемь направлений,\nохватывающих весь путь инвестиции',
      'Eight service lines covering\nthe entire investment journey',
      '覆盖投资全流程的\n八大服务方向',
    ),
    linkLabel: t('Барлық қызметтер', 'Все услуги', 'All services', '全部服务'),
  },

  lifecycle: {
    eyebrow: t('Жоба өмірлік циклі', 'Жизненный цикл проекта', 'Project lifecycle', '项目生命周期'),
    title: t(
      'Ниеттен өндіріске дейінгі\nсегіз кезеңдік жол',
      'Восемь этапов\nот намерения до производства',
      'Eight stages\nfrom intent to production',
      '从意向到投产的\n八个阶段',
    ),
    lead: t(
      'Әр басым жобаның жауапты тұлғасы, мерзімі, тәуекелдер тізілімі және электрондық мұрағаты болады.',
      'У каждого приоритетного проекта есть ответственное лицо, сроки, реестр рисков и электронный архив.',
      'Every priority project has a responsible owner, deadlines, a risk register and an electronic archive.',
      '每个重点项目都有责任人、时间节点、风险台账和电子档案。',
    ),
    steps: [
      {
        id: 'step-1',
        done: true,
        title: t('Жобаны қабылдау', 'Приём проекта', 'Project intake', '项目受理'),
        text: t('Иесі, орны, қажеттілігі', 'Владелец, место, потребность', 'Owner, site, need', '项目方、地点、需求'),
      },
      {
        id: 'step-2',
        done: true,
        title: t('Бастапқы іріктеу', 'Первичный отбор', 'Initial screening', '初步筛选'),
        text: t('Құжат, жер, рұқсат', 'Документы, земля, разрешения', 'Documents, land, permits', '文件、土地、许可'),
      },
      {
        id: 'step-3',
        done: true,
        title: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
        text: t('Қаржы, құқық, техника', 'Финансы, право, техника', 'Finance, legal, technical', '财务、法律、技术'),
      },
      {
        id: 'step-4',
        done: false,
        title: t('Инвесторды сәйкестендіру', 'Подбор инвестора', 'Investor matching', '投资者匹配'),
        text: t('Ауқым, сала, тәуекел', 'Масштаб, отрасль, риск', 'Scale, sector, risk', '规模、行业、风险'),
      },
      {
        id: 'step-5',
        done: false,
        title: t('Келіссөздер', 'Переговоры', 'Negotiations', '谈判'),
        text: t('NDA, сапар, шарттар', 'NDA, визиты, условия', 'NDA, visits, terms', 'NDA、考察、条款'),
      },
      {
        id: 'step-6',
        done: false,
        title: t('Құрылым және келісу', 'Структура и согласование', 'Structuring and agreement', '结构设计与签约'),
        text: t('Қаржыландыру моделі', 'Модель финансирования', 'Financing model', '融资模式'),
      },
      {
        id: 'step-7',
        done: false,
        title: t('Іске асыру мониторингі', 'Мониторинг реализации', 'Implementation monitoring', '实施监测'),
        text: t('Қаражат, құрылыс, жабдық', 'Средства, строительство, оборудование', 'Funds, construction, equipment', '资金、施工、设备'),
      },
      {
        id: 'step-8',
        done: false,
        title: t('Нәтижені бағалау', 'Оценка результата', 'Results assessment', '成果评估'),
        text: t('Инвестиция, жұмыс орны', 'Инвестиции, рабочие места', 'Investment, jobs', '投资、就业'),
      },
    ],
    levelsLabel: t(
      'Жоба дайындығының төрт деңгейі:',
      'Четыре уровня готовности проекта:',
      'Four project readiness levels:',
      '项目成熟度的四个等级：',
    ),
    levels: [
      { id: 'level-1', title: t('Тұжырымдама', 'Концепция', 'Concept', '概念') },
      { id: 'level-2', title: t('Алдын ала бағаланған', 'Предварительно оценён', 'Pre-assessed', '已预评估') },
      { id: 'level-3', title: t('Инвестицияға дайын', 'Готов к инвестициям', 'Investment-ready', '具备投资条件') },
      { id: 'level-4', title: t('Іске асырылуда', 'В реализации', 'In implementation', '实施中') },
    ],
  },

  projects: {
    eyebrow: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
    title: t('Инвестицияға дайын жобалар', 'Проекты, готовые к инвестициям', 'Investment-ready projects', '具备投资条件的项目'),
    linkLabel: t('Барлық жобалар', 'Все проекты', 'All projects', '全部项目'),
    showExampleBadge: true,
    chips: [
      { id: 'chip-all', label: t('Барлығы', 'Все', 'All', '全部') },
      { id: 'chip-industry', label: t('Өнеркәсіп', 'Промышленность', 'Industry', '工业') },
      { id: 'chip-energy', label: t('Энергетика', 'Энергетика', 'Energy', '能源') },
      { id: 'chip-logistics', label: t('Логистика', 'Логистика', 'Logistics', '物流') },
      { id: 'chip-agro', label: t('Агроөнеркәсіп', 'Агропромышленность', 'Agribusiness', '农业综合') },
      { id: 'chip-infra', label: t('Инфрақұрылым', 'Инфраструктура', 'Infrastructure', '基础设施') },
    ],
  },

  corridors: {
    eyebrow: t('Инвестициялық дәліздер', 'Инвестиционные коридоры', 'Investment corridors', '投资走廊'),
    title: t('Басым бағыттар', 'Приоритетные направления', 'Priority directions', '重点方向'),
    china: {
      eyebrow: t('Басты бағыт', 'Главное направление', 'Primary direction', '核心方向'),
      title: t('Қытай Халық Республикасы', 'Китайская Народная Республика', "People's Republic of China", '中华人民共和国'),
      zhTitle: '中国投资者服务中心',
      text: t(
        'Қытай инвесторларына арналған жеке бөлім: қытай тіліндегі толық ақпарат, WeChat арқылы байланыс және «Белдеу және жол» бастамасы мен «Нұрлы жол» бағдарламасының үйлесімі аясындағы жобалар.',
        'Отдельный раздел для китайских инвесторов: полная информация на китайском языке, связь через WeChat и проекты на стыке инициативы «Пояс и путь» и программы «Нурлы жол».',
        'A dedicated section for Chinese investors: full information in Chinese, contact via WeChat and projects at the intersection of the Belt and Road Initiative and the Nurly Zhol programme.',
        '为中国投资者设立的专属板块：完整的中文资讯、微信沟通渠道，以及“一带一路”倡议与“光明之路”计划对接框架下的项目。',
      ),
      bullets: [
        {
          id: 'china-handbook',
          text: t('Қытай тіліндегі инвестор анықтамалығы', 'Справочник инвестора на китайском языке', 'Investor handbook in Chinese', '中文投资者手册'),
        },
        {
          id: 'china-industry',
          text: t('Өндірістік кооперация жобалары', 'Проекты производственной кооперации', 'Industrial cooperation projects', '产能合作项目'),
        },
        {
          id: 'china-zones',
          text: t('Индустриялық аймақтар мен АЭА', 'Индустриальные зоны и СЭЗ', 'Industrial zones and SEZs', '工业园区与经济特区'),
        },
        {
          id: 'china-state',
          text: t(
            'Мемлекеттік институттармен жұмыс арналары',
            'Каналы работы с государственными институтами',
            'Channels for working with state institutions',
            '与政府机构对接的渠道',
          ),
        },
      ],
      primaryCtaLabel: '进入中文版',
      secondaryCtaLabel: t('WeChat арқылы байланысу', 'Связаться через WeChat', 'Contact via WeChat', '通过微信联系'),
    },
    gulf: {
      tag: 'الخليج',
      title: t('Парсы шығанағы елдері', 'Страны Персидского залива', 'Gulf countries', '海湾国家'),
      text: t(
        'Егемен қорлармен бірлескен инвестиция, ислам қаржысы құралдары және АХҚО алаңындағы құрылымдау.',
        'Совместные инвестиции с суверенными фондами, инструменты исламских финансов и структурирование на площадке МФЦА.',
        'Co-investment with sovereign funds, Islamic finance instruments and structuring on the AIFC platform.',
        '与主权基金共同投资、伊斯兰金融工具，以及在阿斯塔纳国际金融中心平台进行结构化安排。',
      ),
      linkLabel: t('Толығырақ', 'Подробнее', 'Learn more', '了解更多'),
    },
    global: {
      tag: 'EU · TR · KR · JP',
      title: t('Еуропа және Азия', 'Европа и Азия', 'Europe and Asia', '欧洲与亚洲'),
      text: t(
        'Технология трансферті, жасыл энергетика және экспортқа бағытталған өндіріс жобалары.',
        'Трансфер технологий, зеленая энергетика и экспортно ориентированные производственные проекты.',
        'Technology transfer, green energy and export-oriented manufacturing projects.',
        '技术转让、绿色能源与面向出口的制造业项目。',
      ),
      linkLabel: t('Толығырақ', 'Подробнее', 'Learn more', '了解更多'),
    },
  },

  scoring: {
    eyebrow: t('Сенім стандарты', 'Стандарт доверия', 'Trust standard', '信任标准'),
    title: t(
      'Инвесторды бағалаудың 100 балдық жүйесі',
      '100-балльная система оценки инвесторов',
      'The 100-point investor assessment system',
      '投资者100分评估体系',
    ),
    lead: t(
      'Әр инвестор жеті өлшем бойынша бағаланады. Басым жобаларға тек тексеруден өткен серіктестер жіберіледі.',
      'Каждый инвестор оценивается по семи критериям. К приоритетным проектам допускаются только проверенные партнеры.',
      'Every investor is assessed on seven criteria. Only vetted partners are admitted to priority projects.',
      '每位投资者按七项标准评估。只有通过审核的合作伙伴才能参与重点项目。',
    ),
    vetoTitle: t('Комплаенс бойынша вето:', 'Комплаенс-вето:', 'Compliance veto:', '合规否决权：'),
    vetoText: t(
      'қаражат көзі күмәнді болса, санкциялық тәуекел немесе жалған құжат анықталса, жалпы балға қарамастан басым мәртебе берілмейді. Бұл ішкі басқару құралы, ресми рейтинг немесе қаржылық кепілдік емес.',
      'если источник средств вызывает сомнения, выявлен санкционный риск или поддельный документ, приоритетный статус не присваивается независимо от общего балла. Это внутренний инструмент управления, а не официальный рейтинг и не финансовая гарантия.',
      'if the source of funds is doubtful, a sanctions risk or a forged document is found, priority status is not granted regardless of the total score. This is an internal management tool, not an official rating or a financial guarantee.',
      '若资金来源存疑、发现制裁风险或伪造文件，无论总分多少，均不授予优先身份。这是内部管理工具，不是官方评级，也不构成财务担保。',
    ),
  },

  leadership: {
    quote: t(
      'Қауымдастықтың беделі өткізілген іс-шаралар санымен емес, тексерілген инвесторлармен, нақты жобалармен және іс жүзінде тартылған инвестициялармен өлшенеді.',
      'Репутация ассоциации измеряется не числом проведенных мероприятий, а проверенными инвесторами, реальными проектами и фактически привлеченными инвестициями.',
      'The reputation of the Association is measured not by the number of events held, but by vetted investors, real projects and investment actually attracted.',
      '协会的声誉不以举办活动的数量衡量，而以经审核的投资者、真实的项目和实际吸引的投资来衡量。',
    ),
    quoteSource: t(
      '2026-2028 жылдарға арналған стратегиялық даму жоспарының негізгі қағидаты',
      'Ключевой принцип Стратегического плана развития на 2026-2028 годы',
      'A core principle of the Strategic Development Plan for 2026-2028',
      '《2026-2028年战略发展规划》的核心原则',
    ),
    personLinkLabel: t('Басқару құрылымы', 'Структура управления', 'Governance structure', '治理结构'),
  },

  media: {
    eyebrow: t('Медиа орталығы', 'Медиацентр', 'Media centre', '媒体中心'),
    title: t('Жаңалықтар мен оқиғалар', 'Новости и события', 'News and events', '新闻与活动'),
    linkLabel: t('Барлық жаңалықтар', 'Все новости', 'All news', '全部新闻'),
    showExampleBadge: true,
    videoLabel: t('Видеогалерея', 'Видеогалерея', 'Video gallery', '视频库'),
    photoLabel: t('Фотогалерея', 'Фотогалерея', 'Photo gallery', '图片库'),
  },

  membership: {
    eyebrow: t('Мүшелік', 'Членство', 'Membership', '会员'),
    title: t('Қауымдастыққа мүше болыңыз', 'Станьте членом ассоциации', 'Become a member of the Association', '加入协会成为会员'),
    text: t(
      'Мүшелік санаттары қажеттілікке қарай бөлінеді. Мүшелік жарнасы мен жобалық қызметтер бөлек есепке алынады және ашық жарияланады.',
      'Категории членства определяются потребностями. Членский взнос и плата за проектные услуги учитываются раздельно и публикуются открыто.',
      'Membership categories reflect your needs. The membership fee and project service fees are accounted for separately and published openly.',
      '会员类别按需求划分。会员费与项目服务费分别核算，并公开披露。',
    ),
    primaryCtaLabel: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
    secondaryCtaLabel: t('Шарттармен танысу', 'Ознакомиться с условиями', 'Read the terms', '查看条件'),
    categories: [
      {
        id: 'cat-1',
        title: t('Шетелдік инвестор компаниялар', 'Иностранные инвесторские компании', 'Foreign investor companies', '外国投资企业'),
      },
      {
        id: 'cat-2',
        title: t(
          'Халықаралық инвестициялық институттар',
          'Международные инвестиционные институты',
          'International investment institutions',
          '国际投资机构',
        ),
      },
      {
        id: 'cat-3',
        title: t('Отандық өнеркәсіп компаниялары', 'Отечественные промышленные компании', 'Domestic industrial companies', '本土工业企业'),
      },
      {
        id: 'cat-4',
        title: t('Кәсіби қызмет көрсетушілер', 'Поставщики профессиональных услуг', 'Professional service providers', '专业服务机构'),
      },
      {
        id: 'cat-5',
        title: t('Стратегиялық серіктестер', 'Стратегические партнеры', 'Strategic partners', '战略合作伙伴'),
      },
    ],
  },
}
