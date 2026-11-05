import { t } from '../lib'
import type { SeedBlock, SeedPage } from './types'

// Топ B: Инвесторларға (7 бет), Жобалар (3 бет), Мүшелік (5 бет).
// Түнгі аударма жобасы: ана тілді тілші тексеруі қажет (docs/PROGRESS.md).
// Ережелер: ТТ-да жоқ сан, ат, күн жазылмайды; сандар мен мөлшерлер бекітілгеннен кейін жарияланады деп бейтарап беріледі;
// ұзын сызықша қолданылмайды, сан аралықтары дефиспен жазылады.

/** Инвестор беттеріне ортақ жауапкершілікті шектеу мәтіні (ТТ 3, 14.3) */
const investorNotice: SeedBlock = {
  type: 'notice',
  tone: 'legal',
  title: t('Жауапкершілікті шектеу', 'Ограничение ответственности', 'Limitation of liability', '免责声明'),
  text: t(
    'Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді. Ішкі баға мен деңгей ресми рейтинг емес және ашық жарияланбайды. Қауымдастық инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді.',
    'Ассоциация не является государственным органом и не действует от имени государственных органов. Внутренняя оценка и уровень не являются официальным рейтингом и не публикуются открыто. Ассоциация не гарантирует инвестиционный доход, государственные разрешения или льготы.',
    'The Association is not a government body and does not act on behalf of government bodies. The internal assessment and level are not an official rating and are not published openly. The Association does not guarantee investment returns, government permits or incentives.',
    '协会不是政府机构，亦不代表任何政府机构行事。内部评估与等级不是官方评级，也不会公开发布。协会不保证投资收益、政府许可或优惠政策。',
  ),
}

/** Мүшелік беттеріне ортақ ескертпе: мүшелік кепілдік емес (ТТ 7.5) */
const membershipGuaranteeNotice: SeedBlock = {
  type: 'notice',
  tone: 'legal',
  title: t(
    'Мүшелік кепілдік емес',
    'Членство не является гарантией',
    'Membership is not a guarantee',
    '会员资格不构成担保',
  ),
  text: t(
    'Қауымдастықтағы мүшелік мүшенің қаржылық сенімділігінің кепілі емес. Ол инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді, ал қауымдастық мемлекеттік орган емес.',
    'Членство в ассоциации не является гарантией финансовой надёжности члена. Оно не гарантирует инвестиционный доход, государственные разрешения или льготы, а ассоциация не является государственным органом.',
    'Membership of the Association is not a guarantee of a member’s financial reliability. It does not guarantee investment returns, government permits or incentives, and the Association is not a government body.',
    '协会会员资格不构成对会员财务可靠性的担保，也不保证投资收益、政府许可或优惠政策。协会不是政府机构。',
  ),
}

/** Мүшелік беттеріне ортақ ескертпе: жарна мен жобалық қызмет ақысы бөлек (ТТ 7.5) */
const feeSeparateNotice: SeedBlock = {
  type: 'notice',
  tone: 'info',
  title: t(
    'Жарна мен қызмет ақысы бөлек',
    'Взнос и плата за услуги раздельны',
    'The fee and service charges are separate',
    '会费与服务费分别核算',
  ),
  text: t(
    'Мүшелік жарнасы мен жобалық қызмет ақысы бөлек есепке алынады және ашық жарияланады. Жарна мүшелікпен байланысты, ал жобалық қызмет ақысы нақты жоба бойынша көрсетілетін қызметке қатысты.',
    'Членский взнос и плата за проектные услуги учитываются раздельно и публикуются открыто. Взнос связан с членством, а плата за проектные услуги относится к конкретной услуге по проекту.',
    'The membership fee and project service fees are accounted for separately and published openly. The fee relates to membership, while a project service fee relates to a specific service provided on a project.',
    '会费与项目服务费分别核算，并公开披露。会费与会员资格相关，项目服务费则对应就具体项目提供的服务。',
  ),
}

// ---------------------------------------------------------------------------
// 1. Инвестор жолы
// ---------------------------------------------------------------------------
const investors: SeedPage = {
  path: '/investors',
  section: 'investors',
  title: t('Инвестор жолы', 'Путь инвестора', 'Investor pathway', '投资者路径'),
  description: t(
    'Инвесторға арналған жеті қадам: жобалар қорын қарау, өтініш, тексеру, NDA, деректер бөлмесі, келіссөз және сапар.',
    'Семь шагов для инвестора: просмотр пула проектов, заявка, проверка, NDA, дата-рум, переговоры и визит.',
    'Seven steps for an investor: browsing the project pool, application, vetting, NDA, data room, negotiations and a visit.',
    '投资者路径共七步：浏览项目库、提交申请、接受审核、签署NDA、进入数据室、洽谈与考察。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Инвестор жолы шетелдік инвесторға Қазақстандағы жобаға қатысудың ашық әрі тексерілетін тәртібін көрсетеді. Ол жеті қадамнан тұрады: инвестор орталығынан бастап келіссөз бен сапарға дейін.\n\nӘр қадамда қандай құжат қажет екені және нәтиженің қай жерде көрінетіні алдын ала белгілі. Өтініш мәртебесі мен деңгейі жеке кабинетте көрсетіледі. Тексеру мен баға қоюдың нақты мерзімдері Басқарма бекіткеннен кейін осы бетте жарияланады.',
        'Путь инвестора показывает иностранному инвестору открытый и проверяемый порядок участия в проекте в Казахстане. Он состоит из семи шагов: от раздела для инвесторов до переговоров и визита.\n\nНа каждом шаге заранее известно, какие документы нужны и где виден результат. Статус заявки и уровень отображаются в личном кабинете. Точные сроки проверки и оценки будут опубликованы на этой странице после утверждения Правлением.',
        'The investor pathway shows a foreign investor an open and verifiable route to taking part in a project in Kazakhstan. It has seven steps, from the investor centre to negotiations and a visit.\n\nAt every step it is clear in advance which documents are needed and where the result will appear. The status of the application and the investor’s level are shown in the personal account. Exact timeframes for vetting and assessment will be published on this page once approved by the Board.',
        '投资者路径向外国投资者说明参与哈萨克斯坦项目的公开、可核查的流程。全程共七步，从进入投资者中心开始，到洽谈与实地考察结束。\n\n每一步需要哪些文件、结果在哪里查看，都会事先说明。申请状态与等级会显示在个人中心。审核与评估的具体时限经理事会批准后，将在本页公布。',
      ),
    },
    {
      type: 'steps',
      heading: t('Жеті қадам', 'Семь шагов', 'Seven steps', '七个步骤'),
      lead: t(
        'Әр қадамға қажет құжаттар қадамның астында көрсетілген.',
        'Под каждым шагом указаны необходимые документы.',
        'The documents needed are listed under each step.',
        '每一步骤下方列出所需文件。',
      ),
      items: [
        {
          title: t(
            'Инвестор орталығына өту',
            'Переход в раздел для инвесторов',
            'Enter the investor centre',
            '进入投资者中心',
          ),
          text: t(
            'Басты беттегі «Инвесторға арналған жол» батырмасы арқылы инвестор орталығына өтесіз. Мұнда Қытай, Парсы шығанағы, Еуропа және Азия бағыттары мен инвестор анықтамалығы бар.',
            'Кнопка «Путь для инвестора» на главной странице ведёт в раздел для инвесторов. Здесь собраны направления по Китаю, странам Персидского залива, Европе и Азии, а также справочник инвестора.',
            'Use the “Investor pathway” button on the home page to enter the investor centre. It brings together the China, Gulf, Europe and Asia sections and the investor handbook.',
            '点击首页的“投资者通道”按钮，即可进入投资者中心。这里汇集了中国、海湾、欧洲与亚洲各板块以及投资者手册。',
          ),
          meta: t('Құжат қажет емес.', 'Документы не требуются.', 'No documents required.', '无需提交文件。'),
        },
        {
          title: t('Жобалар қорын қарау', 'Просмотр пула проектов', 'Browse the project pool', '浏览项目库'),
          text: t(
            'Жобалар қорын сала, өңір, көлем және деңгей бойынша сүзесіз. Ашық карточкада тек жалпы деректер көрсетіледі, жоба иесінің аты жарияланбайды.',
            'Вы фильтруете пул проектов по отрасли, региону, объёму и уровню. В открытой карточке указаны только общие данные, имя владельца проекта не публикуется.',
            'Filter the project pool by sector, region, volume and level. An open card shows general information only, and the project owner’s name is not published.',
            '您可按行业、地区、规模和等级筛选项目库。公开的项目卡片只显示一般性信息，不公布项目方名称。',
          ),
          meta: t('Құжат қажет емес.', 'Документы не требуются.', 'No documents required.', '无需提交文件。'),
        },
        {
          title: t(
            'Инвестор өтініші және жеке кабинет',
            'Заявка инвестора и личный кабинет',
            'Investor application and personal account',
            '提交申请并开通个人中心',
          ),
          text: t(
            'Өтініште компанияңызды, нақты бенефициарды, қаржылық әлеуетті және қызығушылық бағыттарын көрсетесіз. Өтініш берген соң жеке кабинет ашылады.',
            'В заявке вы указываете компанию, конечного бенефициара, финансовые возможности и интересы. После подачи заявки открывается личный кабинет.',
            'In the application you state the company, the ultimate beneficial owner, financial capacity and areas of interest. A personal account is opened once the application is submitted.',
            '申请中需填写公司信息、最终受益所有人、资金实力和投资意向。提交申请后，系统将为您开通个人中心。',
          ),
          meta: t(
            'Қажетті деректер мен құжаттар: тіркеу елі мен нөмірі, нақты бенефициар туралы мәлімет, өкілетті өкілдің сенімхаты. Қаржылық әлеует құжаттары міндетті емес, бірақ бағалау балына әсер етеді.',
            'Необходимые данные и документы: страна и номер регистрации, сведения о конечном бенефициаре, доверенность уполномоченного представителя. Документы о финансовых возможностях необязательны, но влияют на балл оценки.',
            'Data and documents needed: country and number of registration, details of the ultimate beneficial owner, power of attorney of the authorised representative. Proof of financial capacity is optional but affects the assessment score.',
            '所需资料与文件：注册国家与注册号、最终受益所有人信息、授权代表的授权委托书。资金实力证明为选填，但会影响评估得分。',
          ),
        },
        {
          title: t(
            'Тексеру, баға және комплаенс',
            'Проверка, оценка и комплаенс',
            'Vetting, assessment and compliance',
            '审核、评估与合规核查',
          ),
          text: t(
            'Хатшылық алғашқы тексеру жүргізеді, сарапшылар 100 балдық баға қояды, комплаенс ветосы тексеріледі. Нәтиже деңгей (A, B, C немесе D) ретінде жеке кабинетте көрінеді.',
            'Секретариат проводит первичную проверку, эксперты выставляют 100-балльную оценку, проверяется необходимость комплаенс-вето. Результат отображается в личном кабинете в виде уровня (A, B, C или D).',
            'The Secretariat carries out an initial check, experts give a 100-point assessment, and the need for a compliance veto is checked. The result appears in the personal account as a level (A, B, C or D).',
            '秘书处先进行初步审核，专家给出100分评估，合规职能核查是否需要启用合规否决权。结果将以等级（A、B、C或D）的形式显示在个人中心。',
          ),
          meta: t(
            'Қосымша құжаттар сұратылуы мүмкін: қаржылық есептілік, қаражаттың бар екенін растау, ресми инвестициялық жоспар.',
            'Могут быть запрошены дополнительные документы: финансовая отчётность, подтверждение наличия средств, официальный инвестиционный план.',
            'Additional documents may be requested: financial statements, proof of funds, a formal investment plan.',
            '可能要求补充文件：财务报表、资金到位证明、正式投资计划。',
          ),
        },
        {
          title: t('Электрондық NDA', 'Электронное NDA', 'Electronic NDA', '签署电子NDA'),
          text: t(
            'A немесе B деңгейін алған инвестор таңдалған жоба бойынша электрондық NDA-ға қол қояды. NDA шаблоны төрт тілде беріледі.',
            'Инвестор с уровнем A или B подписывает электронное NDA по выбранному проекту. Шаблон NDA доступен на четырёх языках.',
            'An investor at level A or B signs an electronic NDA for the chosen project. The NDA template is available in four languages.',
            '获得A级或B级的投资者，就所选项目以电子方式签署保密协议（NDA）。NDA模板提供四种语言版本。',
          ),
          meta: t(
            'Қосымша құжат қажет емес: NDA жеке кабинетте электрондық түрде қабылданады (белгі қою және бір реттік код, OTP). Нұсқасы, уақыты мен пайдаланушы тіркеледі.',
            'Дополнительные документы не нужны: NDA принимается электронно в личном кабинете (флажок и одноразовый код, OTP). Версия, время и пользователь фиксируются.',
            'No additional documents: the NDA is accepted electronically in the personal account (tick box and one-time code, OTP). The version, time and user are recorded.',
            '无需其他文件：NDA在个人中心以电子方式确认（勾选框加一次性验证码OTP）。模板版本、签署时间及用户信息将被记录。',
          ),
        },
        {
          title: t('Деректер бөлмесі', 'Дата-рум', 'Data room', '数据室'),
          text: t(
            'Деректер бөлмесінде жоба паспорты мен құжаттар су белгісімен ашылады. Әр ашу мен жүктеу журналға жазылады. Қатынас мерзімді: әдепкі бойынша 90 күн, оны кез келген уақытта кері алуға болады.',
            'В дата-руме паспорт проекта и документы открываются с водяным знаком. Каждое открытие и загрузка фиксируются в журнале. Доступ ограничен по сроку: по умолчанию 90 дней, его можно отозвать в любой момент.',
            'In the data room the project passport and documents are opened with a watermark. Every opening and download is recorded in a log. Access is time-limited, 90 days by default, and can be withdrawn at any time.',
            '在数据室中，项目档案和文件带水印开放查看。每次打开与下载都会记入日志。访问有期限，默认为90天，且可随时撤销。',
          ),
          meta: t(
            'Қосымша құжат қажет емес. Деректер бөлмесін ашу үшін екі факторлы аутентификация (2FA) міндетті.',
            'Дополнительные документы не нужны. Для входа в дата-рум обязательна двухфакторная аутентификация (2FA).',
            'No additional documents. Two-factor authentication (2FA) is required to open the data room.',
            '无需其他文件。进入数据室须启用双重验证（2FA）。',
          ),
        },
        {
          title: t(
            'Келіссөз, сапар және келесі қадамдар',
            'Переговоры, визит и дальнейшие шаги',
            'Negotiations, visit and next steps',
            '洽谈、考察与后续步骤',
          ),
          text: t(
            'Келіссөз, сапар және келесі қадамдар жеке кабинетте және қауымдастықтың CRM жүйесінде тіркеледі. Кездесулер мен сұраулар жеке кабинеттің тиісті бөлімінде жүргізіледі.',
            'Переговоры, визит и дальнейшие шаги фиксируются в личном кабинете и в CRM ассоциации. Встречи и запросы ведутся в соответствующем разделе кабинета.',
            'Negotiations, the visit and next steps are recorded in the personal account and in the Association’s CRM. Meetings and requests are handled in the relevant section of the account.',
            '洽谈、考察及后续步骤记录在个人中心和协会的CRM系统中。会面安排与问询请求在个人中心的相应栏目办理。',
          ),
          meta: t(
            'Құжаттар келіссөз барысына байланысты, мысалы, ниет хаттамасы немесе терм-шит.',
            'Документы зависят от хода переговоров, например протокол о намерениях или терм-шит.',
            'Documents depend on the negotiations, for example a protocol of intent or a term sheet.',
            '所需文件视洽谈进展而定，例如意向备忘录或条款清单。',
          ),
        },
      ],
    },
    {
      type: 'facts',
      heading: t('Баға деңгейлері', 'Уровни оценки', 'Assessment levels', '评估等级'),
      items: [
        {
          label: t('A деңгейі', 'Уровень A', 'Level A', 'A级'),
          value: t(
            '80-100 балл: басым серіктес',
            '80-100 баллов: приоритетный партнёр',
            '80-100 points: priority partner',
            '80-100分：优先合作伙伴',
          ),
        },
        {
          label: t('B деңгейі', 'Уровень B', 'Level B', 'B级'),
          value: t(
            '65-79 балл: шартты серіктес, қосымша құжат қажет',
            '65-79 баллов: условный партнёр, нужны дополнительные документы',
            '65-79 points: conditional partner, additional documents required',
            '65-79分：有条件合作伙伴，需补充文件',
          ),
        },
        {
          label: t('C деңгейі', 'Уровень C', 'Level C', 'C级'),
          value: t('50-64 балл: бақылау тобы', '50-64 балла: группа наблюдения', '50-64 points: watch group', '50-64分：观察组'),
        },
        {
          label: t('D деңгейі', 'Уровень D', 'Level D', 'D级'),
          value: t(
            '50 баллдан төмен: басым жобаларға жіберілмейді',
            'менее 50 баллов: к приоритетным проектам не допускается',
            'below 50 points: not admitted to priority projects',
            '50分以下：不进入优先项目',
          ),
        },
      ],
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t(
        'Деңгей ресми рейтинг емес',
        'Уровень не является официальным рейтингом',
        'A level is not an official rating',
        '等级不是官方评级',
      ),
      text: t(
        'Қауымдастық мемлекеттік орган емес. Инвестор деңгейі мен 100 балдық баға қауымдастықтың ішкі басқару құралы: ол ресми рейтинг емес, ашық бөлімде жарияланбайды және инвестициялық табысқа немесе мемлекеттік рұқсатқа кепілдік бермейді. Инвестор өз деңгейін жеке кабинетте көреді, ал сарапшылардың ішкі пікірі көрсетілмейді. Баға динамикалық: ол 12 айда бір рет немесе жаңа дерек түскенде қайта қаралады.',
        'Ассоциация не является государственным органом. Уровень инвестора и 100-балльная оценка являются внутренним инструментом управления ассоциации: они не представляют собой официальный рейтинг, не публикуются в открытом разделе и не гарантируют инвестиционный доход или государственные разрешения. Инвестор видит свой уровень в личном кабинете, но не видит внутренние мнения экспертов. Оценка динамична: она пересматривается раз в 12 месяцев или при поступлении новых данных.',
        'The Association is not a government body. The investor level and the 100-point assessment are an internal management tool of the Association: they are not an official rating, are not published in the open section, and do not guarantee investment returns or government permits. Investors see their own level in the personal account but not the experts’ internal opinions. The assessment is dynamic: it is reviewed once every 12 months or when new data arrives.',
        '协会不是政府机构。投资者等级与100分评估是协会的内部管理工具：它们不是官方评级，不在公开栏目发布，也不保证投资收益或政府许可。投资者可在个人中心查看自己的等级，但看不到专家的内部意见。评估是动态的：每12个月复核一次，或在获得新资料时复核。',
      ),
    },
    {
      type: 'links',
      heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
      items: [
        {
          label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
          href: '/investors/handbook',
          text: t(
            'Процесс, NDA, деңгейлер, құпиялылық және құны бойынша жауаптар.',
            'Ответы о процессе, NDA, уровнях, конфиденциальности и стоимости.',
            'Answers on the process, NDA, levels, confidentiality and cost.',
            '关于流程、NDA、等级、保密与费用的解答。',
          ),
        },
        {
          label: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
          href: '/projects',
          text: t('Тексерілген жобалар каталогы.', 'Каталог проверенных проектов.', 'The catalogue of verified projects.', '经审核的项目目录。'),
        },
        {
          label: t('Жоба деңгейлері', 'Уровни проектов', 'Project levels', '项目等级'),
          href: '/projects/levels',
          text: t('Төрт деңгей мен сегіз кезең.', 'Четыре уровня и восемь этапов.', 'Four levels and eight stages.', '四个等级与八个阶段。'),
        },
        {
          label: t('Қытай орталығы', 'Китайский центр', 'China centre', '中国投资者服务中心'),
          href: '/investors/china',
          text: t(
            'Қытай тіліндегі материалдар мен WeChat арнасы.',
            'Материалы на китайском языке и канал WeChat.',
            'Chinese-language materials and the WeChat channel.',
            '中文资料与微信渠道。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Инвестор жолын бастаңыз', 'Начните путь инвестора', 'Begin the investor pathway', '开启您的投资者路径'),
    text: t(
      'Өтінішті онлайн формамен толтырыңыз. Өтініш жіберілгеннен кейін жеке кабинет ашылады.',
      'Заполните заявку в онлайн-форме. После отправки заявки будет открыт личный кабинет.',
      'Complete the application in the online form. A personal account is opened once it is submitted.',
      '请通过在线表单填写申请。申请提交后，系统将为您开通个人中心。',
    ),
    label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
    href: '/investors/apply',
  },
}

// ---------------------------------------------------------------------------
// 2. Қытай орталығы (中国投资者服务中心)
// ---------------------------------------------------------------------------
const investorsChina: SeedPage = {
  path: '/investors/china',
  section: 'investors',
  title: t('Қытай орталығы', 'Китайский центр', 'China centre', '中国投资者服务中心'),
  description: t(
    'Қытай инвесторларына арналған орталық: қытай тіліндегі материалдар, «Белдеу және жол» мен «Нұрлы жол» үйлесімі, WeChat арнасы.',
    'Центр для китайских инвесторов: материалы на китайском языке, сочетание инициативы «Пояс и путь» и программы «Нурлы жол», канал WeChat.',
    'A centre for Chinese investors: materials in Chinese, alignment of the Belt and Road Initiative with the Nurly Zhol programme, and a WeChat channel.',
    '专为中国投资者设立：中文资料、“一带一路”倡议与“光明之路”计划的对接，以及微信沟通渠道。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Қытай орталығы (中国投资者服务中心) Қытай компаниялары мен мемлекеттік кәсіпорындарына арналған. Бұл бөлімде қытай тіліндегі материалдар, қытай тілінде сөйлейтін менеджер және WeChat арнасы бір жерде жиналған. Қытай инвесторлары порталдың басты аудиториясы болғандықтан, қытай нұсқасында инвестор бөлімдері бірінші кезекте аударылады.',
        'Китайский центр (中国投资者服务中心) предназначен для китайских компаний и государственных предприятий. Здесь собраны материалы на китайском языке, менеджер, говорящий по-китайски, и канал WeChat. Китайские инвесторы являются основной аудиторией портала, поэтому в китайской версии разделы для инвесторов переводятся в первую очередь.',
        'The China centre is intended for Chinese companies and state-owned enterprises. It brings together materials in Chinese, a Chinese-speaking manager and a WeChat channel. Chinese investors are the main audience of the portal, so in the Chinese version the investor sections are translated first.',
        '本中心专为中国企业和国有企业设立，汇集中文资料、中文客户经理和微信沟通渠道。中国投资者是本门户的主要受众，因此中文版优先翻译投资者栏目。',
      ),
    },
    {
      type: 'cards',
      heading: t('Орталық не ұсынады', 'Что предлагает центр', 'What the centre offers', '中心提供的内容'),
      columns: 3,
      items: [
        {
          title: t(
            'Қытайша толық анықтамалық',
            'Полный справочник на китайском',
            'Full handbook in Chinese',
            '中文版完整手册',
          ),
          text: t(
            'Қазақстанға кірудің құқықтық бағдарын қамтитын PDF анықтамалық әзірленуде. Дайын болған кезде осы беттен жүктеуге болады.',
            'Справочник в формате PDF, охватывающий правовые ориентиры входа в Казахстан, находится в разработке. После готовности его можно будет скачать на этой странице.',
            'A PDF handbook covering the legal guidance for entering Kazakhstan is being prepared. Once ready, it can be downloaded from this page.',
            'PDF格式的手册正在编制中，内容涵盖进入哈萨克斯坦的法律指引。完成后可在本页下载。',
          ),
          icon: 'document',
          badge: t('Әзірленуде', 'В разработке', 'In preparation', '编制中'),
        },
        {
          title: t(
            '«Белдеу және жол» және «Нұрлы жол»',
            'Инициатива «Пояс и путь» и «Нурлы жол»',
            'Belt and Road and Nurly Zhol',
            '“一带一路”与“光明之路”',
          ),
          text: t(
            'Орталық «Белдеу және жол» бастамасы мен «Нұрлы жол» бағдарламасының үйлесімі аясындағы жобаларға назар аударады. Қауымдастық бұл бастама мен бағдарламаның ресми мәтіндерін түсіндірмейді және олармен байланысты мемлекеттік қолдауға кепілдік бермейді.',
            'Центр уделяет внимание проектам в рамках сочетания инициативы «Пояс и путь» и программы «Нурлы жол». Ассоциация не толкует официальные тексты инициативы и программы и не гарантирует связанную с ними государственную поддержку.',
            'The centre focuses on projects within the alignment of the Belt and Road Initiative and the Nurly Zhol programme. The Association does not interpret the official texts of the initiative and the programme and does not guarantee any related government support.',
            '中心重点关注处于“一带一路”倡议与“光明之路”计划对接框架内的项目。协会不解释该倡议和该计划的官方文本，也不保证与之相关的政府支持。',
          ),
          icon: 'compass',
        },
        {
          title: t('Индустриялық аймақтар мен АЭА', 'Индустриальные зоны и СЭЗ', 'Industrial zones and SEZs', '工业园区与经济特区'),
          text: t(
            'Индустриялық аймақтар мен арнайы экономикалық аймақтар (АЭА) туралы шолу беріледі: жобаны орналастыру мүмкіндіктері және инфрақұрылым. Аймақтардың жағдайлары мен жеңілдіктері ресми дереккөзден тексеріледі, қауымдастық оларға кепілдік бермейді.',
            'Даётся обзор индустриальных зон и специальных экономических зон (СЭЗ): возможности размещения проекта и инфраструктура. Условия и льготы зон следует проверять по официальным источникам, ассоциация их не гарантирует.',
            'An overview of industrial zones and special economic zones (SEZs) is provided: options for locating a project and the available infrastructure. Zone conditions and incentives should be checked against official sources; the Association does not guarantee them.',
            '提供工业园区与经济特区概览，涵盖项目选址选项与基础设施配套情况。园区的条件与优惠政策请以官方渠道为准，协会不对此作出保证。',
          ),
          icon: 'factory',
        },
        {
          title: t(
            'Екіжақты келісімдер тізімі',
            'Перечень двусторонних соглашений',
            'List of bilateral agreements',
            '双边协定清单',
          ),
          text: t(
            'Екіжақты келісімдер тізімі тексеруден кейін жарияланады. Әр құжат ресми дереккөзі мен күнімен көрсетіледі.',
            'Перечень двусторонних соглашений будет опубликован после проверки. Каждый документ указывается с официальным источником и датой.',
            'The list of bilateral agreements will be published after verification. Each document will be shown with its official source and date.',
            '双边协定清单经核实后发布。每份文件将注明官方来源和日期。',
          ),
          icon: 'shield-check',
          badge: t('Тексеруден кейін', 'После проверки', 'After verification', '核实后发布'),
        },
        {
          title: t(
            'Қытай тілінде сөйлейтін менеджер',
            'Менеджер, говорящий по-китайски',
            'Chinese-speaking manager',
            '中文客户经理',
          ),
          text: t(
            'Қытай бағытының менеджері қытай тілінде сөйлейді және инвесторлардың сұрақтарына жауап береді.',
            'Менеджер китайского направления говорит по-китайски и отвечает на вопросы инвесторов.',
            'The manager for the China direction speaks Chinese and answers investors’ questions.',
            '负责中国方向的经理使用中文沟通，解答投资者的问题。',
          ),
          icon: 'user',
        },
        {
          title: t('WeChat және ресми аккаунт', 'WeChat и официальный аккаунт', 'WeChat and the official account', '微信与官方账号'),
          text: t(
            'WeChat QR коды арқылы қауымдастықпен тікелей байланысуға болады. WeChat ресми аккаунты (公众号) 2-кезеңде іске қосылады.',
            'Через QR-код WeChat можно напрямую связаться с ассоциацией. Официальный аккаунт WeChat (公众号) будет запущен на втором этапе.',
            'The WeChat QR code lets you contact the Association directly. The official WeChat account will be launched in the second phase.',
            '通过微信二维码可直接联系协会。微信官方账号（公众号）将在第二阶段上线。',
          ),
          icon: 'wechat',
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Қауымдастық пен мемлекеттік оператор',
        'Ассоциация и государственный оператор',
        'The Association and the state operator',
        '协会与国家运营机构',
      ),
      text: t(
        'Мемлекеттік оператор Kazakh Invest ресми сүйемелдеу мен әкімшілік қолдауды жүргізеді. Қауымдастық нарықтық толықтырушы рөлін атқарады: жеке халықаралық желі, жобаларды алдын ала іріктеу, инвесторды ішкі бағалау және жобаны толық цикл бойынша бақылау.\n\nИнвестордың жер, инфрақұрылым, рұқсат, салық, еңбек немесе көші-қон бойынша мәселелері қажет болғанда ресми арналар арқылы тиісті мемлекеттік органдарға жеткізіледі. Қауымдастық мемлекеттік орган емес, сондықтан мәселенің шешілуіне кепілдік бермейді.',
        'Государственный оператор Kazakh Invest осуществляет официальное сопровождение и административную поддержку. Ассоциация выступает рыночным дополнением: собственная международная сеть, предварительный отбор проектов, внутренняя оценка инвестора и контроль проекта на протяжении всего цикла.\n\nВопросы инвестора по земле, инфраструктуре, разрешениям, налогам, труду и миграции при необходимости передаются соответствующим государственным органам по официальным каналам. Ассоциация не является государственным органом, поэтому не гарантирует решения вопроса.',
        'The state operator Kazakh Invest provides official support and administrative assistance. The Association acts as a market-based complement: its own international network, pre-selection of projects, internal assessment of the investor and oversight of a project across its full cycle.\n\nWhere necessary, an investor’s issues concerning land, infrastructure, permits, taxes, labour or migration are passed to the relevant government bodies through official channels. The Association is not a government body and therefore does not guarantee that an issue will be resolved.',
        '国家运营机构 Kazakh Invest 负责官方对接与行政支持。协会则是市场化的补充力量：拥有自己的国际网络，对项目进行预先遴选，对投资者开展内部评估，并对项目实行全周期跟踪。\n\n投资者在土地、基础设施、许可、税收、劳动或移民方面遇到的问题，必要时由协会通过正式渠道转交相关政府机构。协会不是政府机构，因此不保证问题一定得到解决。',
      ),
    },
    investorNotice,
    {
      type: 'links',
      heading: t('Келесі қадамдар', 'Следующие шаги', 'Next steps', '后续步骤'),
      items: [
        {
          label: t('Инвестор жолы', 'Путь инвестора', 'Investor pathway', '投资者路径'),
          href: '/investors',
          text: t(
            'Жеті қадам және әр қадамға қажет құжаттар.',
            'Семь шагов и документы для каждого шага.',
            'Seven steps and the documents for each.',
            '七个步骤及各步骤所需文件。',
          ),
        },
        {
          label: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
          href: '/projects',
          text: t('Тексерілген жобалар каталогы.', 'Каталог проверенных проектов.', 'The catalogue of verified projects.', '经审核的项目目录。'),
        },
        {
          label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
          href: '/investors/handbook',
          text: t(
            'Жиі қойылатын сұрақтарға жауаптар.',
            'Ответы на частые вопросы.',
            'Answers to frequently asked questions.',
            '常见问题解答。',
          ),
        },
        {
          label: t('Байланыс', 'Контакты', 'Contacts', '联系我们'),
          href: '/contacts',
          text: t(
            'Телефон, WeChat және екі мекенжай.',
            'Телефон, WeChat и два адреса.',
            'Telephone, WeChat and two addresses.',
            '电话、微信及两个地址。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Инвестор өтінішін беріңіз', 'Подайте заявку инвестора', 'Submit your investor application', '提交投资者申请'),
    text: t(
      'Өтінішті онлайн формамен толтырыңыз. Сұрақтар туындаса, қауымдастыққа WeChat арқылы жазуға болады.',
      'Заполните заявку в онлайн-форме. Если возникнут вопросы, можно написать ассоциации в WeChat.',
      'Complete the application in the online form. If you have questions, you can write to the Association on WeChat.',
      '请通过在线表单填写申请。如有疑问，可通过微信联系协会。',
    ),
    label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
    href: '/investors/apply',
  },
}

// ---------------------------------------------------------------------------
// 3. Парсы шығанағы
// ---------------------------------------------------------------------------
const investorsGulf: SeedPage = {
  path: '/investors/gulf',
  section: 'investors',
  title: t('Парсы шығанағы', 'Страны Персидского залива', 'Gulf countries', '海湾国家'),
  description: t(
    'Парсы шығанағы инвесторларына арналған бөлім: егемен қорлармен бірлескен инвестиция форматтары, АХҚО мүмкіндіктері мен ислам қаржысы.',
    'Раздел для инвесторов Персидского залива: форматы совместных инвестиций с суверенными фондами, возможности МФЦА и исламские финансы.',
    'A section for Gulf investors: co-investment formats with sovereign funds, AIFC opportunities and Islamic finance.',
    '面向海湾地区投资者：与主权基金共同投资的模式、阿斯塔纳国际金融中心的机遇以及伊斯兰金融。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Бұл бөлім Парсы шығанағы елдерінің егемен қорлары мен отбасылық кеңселеріне арналған. Мұндай инвесторлар, әдетте, ірі жобаларды, АХҚО алаңында құрылымдауды және ислам қаржысы құралдарын іздейді. Қауымдастық жобаларды алдын ала іріктеуге және инвестор жолының әр қадамын сүйемелдеуге көмектеседі.',
        'Раздел адресован суверенным фондам и семейным офисам стран Персидского залива. Эта группа, как правило, ищет крупные проекты, структурирование на площадке МФЦА и инструменты исламских финансов. Ассоциация помогает с предварительным отбором проектов и сопровождает каждый шаг пути инвестора.',
        'This section is for sovereign wealth funds and family offices in the Gulf countries. This group typically looks for large projects, structuring on the AIFC platform and Islamic finance instruments. The Association helps with the preliminary selection of projects and supports every step of the investor pathway.',
        '本栏目面向海湾国家的主权基金和家族办公室。这类投资者通常关注大型项目、在阿斯塔纳国际金融中心（AIFC）平台上的结构化安排以及伊斯兰金融工具。协会协助对项目进行预先遴选，并支持投资者路径的每一步。',
      ),
    },
    {
      type: 'cards',
      heading: t(
        'Бірлескен инвестиция форматтары',
        'Форматы совместных инвестиций',
        'Co-investment formats',
        '共同投资模式',
      ),
      lead: t(
        'Формат жобаның моделіне байланысты таңдалады. Жобалар қорында модель бойынша сүзгі бар.',
        'Формат выбирается в зависимости от модели проекта. В пуле проектов есть фильтр по модели.',
        'The format depends on the project’s model. The project pool has a filter by model.',
        '具体模式取决于项目的类型。项目库提供按模式筛选的功能。',
      ),
      columns: 2,
      items: [
        {
          title: t('Үлестік қатысу', 'Долевое участие', 'Equity participation', '股权投资'),
          text: t(
            'Егемен қор немесе отбасылық кеңсе жоба компаниясының үлесін сатып алады. Үлесті басқа инвесторлармен бірлесіп алуға болады.',
            'Суверенный фонд или семейный офис приобретает долю в проектной компании. Долю можно приобрести совместно с другими инвесторами.',
            'A sovereign fund or family office acquires a stake in the project company. The stake can be acquired jointly with other investors.',
            '主权基金或家族办公室收购项目公司股权，也可与其他投资者联合收购。',
          ),
          icon: 'chart',
        },
        {
          title: t('Бірлескен кәсіпорын', 'Совместное предприятие', 'Joint venture', '合资企业'),
          text: t(
            'Инвестор қазақстандық өнеркәсіп серіктесімен бірлескен кәсіпорын құрады. Модель өндірісті оқшаулауды және технология трансфертін қамтуы мүмкін.',
            'Инвестор создаёт совместное предприятие с казахстанским промышленным партнёром. Модель может включать локализацию производства и трансфер технологий.',
            'The investor sets up a joint venture with a Kazakhstani industrial partner. The model may include localisation of production and technology transfer.',
            '投资者与哈萨克斯坦工业伙伴设立合资企业。该模式可涵盖生产本地化和技术转让。',
          ),
          icon: 'factory',
        },
        {
          title: t('МЖӘ және BOT', 'ГЧП и BOT', 'PPP and BOT', 'PPP与BOT'),
          text: t(
            'Ұзақ мерзімді инфрақұрылым жобаларында мемлекеттік-жекеменшік әріптестік (МЖӘ) немесе BOT моделі қарастырылады. Мемлекеттік тараптың талаптарын тиісті мемлекеттік орган айқындайды.',
            'Для долгосрочных инфраструктурных проектов рассматриваются государственно-частное партнёрство (ГЧП) или модель BOT. Требования государственной стороны определяет соответствующий государственный орган.',
            'For long-term infrastructure projects, public-private partnership (PPP) or BOT models are considered. The requirements of the public party are set by the relevant government body.',
            '对于长期基础设施项目，可考虑政府和社会资本合作（PPP）或BOT模式。政府方的要求由相关政府机构确定。',
          ),
          icon: 'columns',
        },
        {
          title: t('EPC және EPC+F', 'EPC и EPC+F', 'EPC and EPC+F', 'EPC与EPC+F'),
          text: t(
            'Жоба EPC шарттарымен (жобалау, жабдықтау, құрылыс) немесе қаржыландыру құрылымымен бірге (EPC+F) жүзеге асырылады. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады.',
            'Проект реализуется по контракту EPC (проектирование, поставка, строительство) или вместе со структурой финансирования (EPC+F). Финансирование осуществляют организации, имеющие лицензию.',
            'The project is delivered under an EPC contract (engineering, procurement, construction) or together with a financing structure (EPC+F). Financing is provided by licensed organisations.',
            '项目按EPC合同（设计、采购、施工）实施，或与融资结构一并安排（EPC+F）。融资由持牌机构提供。',
          ),
          icon: 'layers',
        },
      ],
    },
    {
      type: 'cards',
      heading: t(
        'АХҚО, ислам қаржысы және кәсіби кеңесшілер',
        'МФЦА, исламские финансы и профессиональные консультанты',
        'AIFC, Islamic finance and professional advisers',
        'AIFC、伊斯兰金融与专业顾问',
      ),
      columns: 3,
      items: [
        {
          title: t('АХҚО мүмкіндіктері', 'Возможности МФЦА', 'AIFC opportunities', 'AIFC的机遇'),
          text: t(
            'Астана халықаралық қаржы орталығы (АХҚО) капитал құрылымын жобалау және бірлескен инвестицияны рәсімдеу үшін қарастырылатын алаң. Қолданылатын жағдайлар мен рәсімдерді орталықтың ресми құжаттары айқындайды.',
            'Международный финансовый центр «Астана» (МФЦА) рассматривается как площадка для проектирования структуры капитала и оформления совместных инвестиций. Применимые условия и процедуры определяются официальными документами центра.',
            'The Astana International Financial Centre (AIFC) is considered as a platform for designing the capital structure and formalising joint investments. The applicable conditions and procedures are set by the Centre’s official documents.',
            '阿斯塔纳国际金融中心（AIFC）可作为设计资本结构和落实共同投资的平台。适用的条件与程序以该中心的官方文件为准。',
          ),
          icon: 'columns',
        },
        {
          title: t('Ислам қаржысы', 'Исламские финансы', 'Islamic finance', '伊斯兰金融'),
          text: t(
            'Инвестор ислам қаржысы принциптеріне сай құрылымдарға қызығушылығын менеджерге хабарлай алады. Мұндай құрылымдарды лицензиясы бар қаржы ұйымдары мен құқықтық кеңесшілер рәсімдейді.',
            'Инвестор может сообщить менеджеру об интересе к структурам, соответствующим принципам исламских финансов. Такие структуры оформляют лицензированные финансовые организации и юридические консультанты.',
            'An investor can tell the manager of an interest in structures consistent with the principles of Islamic finance. Such structures are arranged by licensed financial institutions and legal advisers.',
            '投资者如有意采用符合伊斯兰金融原则的结构，可告知经理。此类结构由持牌金融机构和法律顾问负责设计与落实。',
          ),
          icon: 'chart',
        },
        {
          title: t('Кәсіби кеңесшілер', 'Профессиональные консультанты', 'Professional advisers', '专业顾问'),
          text: t(
            'Тіркеу, құқық, салық, логистика және кадр мәселелері бойынша қауымдастық сенімді кәсіби серіктестермен жұмыс істейді. Қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады, ал қауымдастық қаржы ұйымы емес.',
            'По вопросам регистрации, права, налогов, логистики и кадров ассоциация работает с надёжными профессиональными партнёрами. Финансирование осуществляют организации с лицензией, сама ассоциация не является финансовой организацией.',
            'For registration, legal, tax, logistics and staffing matters the Association works with trusted professional partners. Financing is provided by licensed organisations; the Association is not itself a financial institution.',
            '在注册、法律、税务、物流和人力方面，协会与可靠的专业合作伙伴合作。融资由持牌机构提供，协会本身不是金融机构。',
          ),
          icon: 'compass',
          href: '/services/market-entry',
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t('Араб тіліндегі нұсқа', 'Версия на арабском языке', 'Arabic-language version', '阿拉伯语版本'),
      text: t(
        'Араб тіліндегі нұсқа 2-кезеңде қосылады. Ол оңнан солға жазылатын (RTL) форматта жасалып, тек «Инвесторларға» бөлімін қамтиды. Іске қосылғанға дейін бөлім қазақ, орыс, ағылшын және қытай тілдерінде қолжетімді.',
        'Версия на арабском языке будет добавлена на втором этапе. Она будет выполнена в формате письма справа налево (RTL) и охватит только раздел «Инвесторам». До её запуска раздел доступен на казахском, русском, английском и китайском языках.',
        'An Arabic-language version will be added in the second phase. It will use right-to-left (RTL) layout and will cover the Investors section only. Until it is launched, the section is available in Kazakh, Russian, English and Chinese.',
        '阿拉伯语版本将在第二阶段上线，采用从右至左（RTL）的排版，仅涵盖“投资者”栏目。在其上线之前，本栏目提供哈萨克语、俄语、英语和中文版本。',
      ),
    },
    investorNotice,
    {
      type: 'links',
      heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
      items: [
        {
          label: t('Жобалық қаржыландыру', 'Проектное финансирование', 'Project finance', '项目融资'),
          href: '/services/project-finance',
          text: t(
            'EPC, EPC+F, BOT, МЖӘ модельдері және капитал құрылымы.',
            'Модели EPC, EPC+F, BOT, ГЧП и структура капитала.',
            'EPC, EPC+F, BOT and PPP models and capital structure.',
            'EPC、EPC+F、BOT、PPP模式与资本结构。',
          ),
        },
        {
          label: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
          href: '/projects',
          text: t('Тексерілген жобалар каталогы.', 'Каталог проверенных проектов.', 'The catalogue of verified projects.', '经审核的项目目录。'),
        },
        {
          label: t('Инвестор жолы', 'Путь инвестора', 'Investor pathway', '投资者路径'),
          href: '/investors',
          text: t(
            'Жеті қадам және әр қадамға қажет құжаттар.',
            'Семь шагов и документы для каждого шага.',
            'Seven steps and the documents for each.',
            '七个步骤及各步骤所需文件。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Қызығушылығыңызды көрсетіңіз', 'Укажите ваш интерес', 'State your area of interest', '说明您的投资意向'),
    text: t(
      'Көлем, модель және шешім қабылдау мерзімі инвестор өтінішін толтыру кезінде көрсетіледі.',
      'Объём, модель и срок принятия решения указываются при заполнении заявки инвестора.',
      'The volume, model and decision timeline are stated when you complete the investor application.',
      '投资规模、模式和决策时限在填写投资者申请时说明。',
    ),
    label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
    href: '/investors/apply',
  },
}

// ---------------------------------------------------------------------------
// 4. Еуропа және Азия
// ---------------------------------------------------------------------------
const investorsGlobal: SeedPage = {
  path: '/investors/global',
  section: 'investors',
  title: t('Еуропа және Азия', 'Европа и Азия', 'Europe and Asia', '欧洲与亚洲'),
  description: t(
    'Түркия, Корея, Жапония және Еуропалық Одақ инвесторларына арналған бөлім: технология трансферті, жасыл энергетика, экспортқа бағытталған өндіріс.',
    'Раздел для инвесторов из Турции, Кореи, Японии и Европейского союза: трансфер технологий, зелёная энергетика и экспортно ориентированное производство.',
    'A section for investors from Türkiye, Korea, Japan and the European Union: technology transfer, green energy and export-oriented manufacturing.',
    '面向土耳其、韩国、日本及欧盟投资者：技术转让、绿色能源与面向出口的制造业。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Еуропа, Түркия, Корея және Жапония инвесторлары, әдетте, технология трансфертін және жасыл энергетика жобаларын іздейді. Қауымдастық оларға экспортқа бағытталған өндіріс жобаларын да ұсынады. Елге тән ақпарат ресми дереккөздерден тексеріліп, дереккөзі мен күнімен жарияланады.',
        'Инвесторы из Европы, Турции, Кореи и Японии, как правило, ищут трансфер технологий и проекты зелёной энергетики. Ассоциация также предлагает им проекты экспортно ориентированного производства. Информация по каждой стране проверяется по официальным источникам и публикуется с указанием источника и даты.',
        'Investors from Europe, Türkiye, Korea and Japan typically look for technology transfer and green energy projects. The Association also offers them export-oriented manufacturing projects. Country-specific information is checked against official sources and published with its source and date.',
        '来自欧洲、土耳其、韩国和日本的投资者通常关注技术转让和绿色能源项目。协会同时向他们提供面向出口的制造业项目。各国相关信息经官方来源核实，并注明来源与日期后发布。',
      ),
    },
    {
      type: 'cards',
      heading: t('Бағыттар бойынша', 'По направлениям', 'By direction', '按国别与地区'),
      columns: 2,
      items: [
        {
          title: t('Түркия', 'Турция', 'Türkiye', '土耳其'),
          text: t(
            'Өнеркәсіптік кооперация, бірлескен кәсіпорындар және жергілікті өндірісті оқшаулау жобалары қарастырылады.',
            'Рассматриваются проекты промышленной кооперации, совместные предприятия и локализация производства.',
            'Industrial cooperation projects, joint ventures and localisation of production are considered.',
            '可考虑产业合作项目、合资企业及生产本地化项目。',
          ),
          icon: 'factory',
          href: '/services/industrial-cooperation',
        },
        {
          title: t('Корея', 'Корея', 'Korea', '韩国'),
          text: t(
            'Технология трансферті мен жасыл инвестиция жобалары қарастырылады.',
            'Рассматриваются проекты трансфера технологий и зелёных инвестиций.',
            'Technology transfer and green investment projects are considered.',
            '可考虑技术转让与绿色投资项目。',
          ),
          icon: 'leaf',
          href: '/services/green-investment',
        },
        {
          title: t('Жапония', 'Япония', 'Japan', '日本'),
          text: t(
            'Технологиялық серіктестік және экспортқа бағытталған өндіріс жобалары қарастырылады.',
            'Рассматриваются проекты технологического партнёрства и экспортно ориентированного производства.',
            'Technology partnership and export-oriented manufacturing projects are considered.',
            '可考虑技术合作与面向出口的制造业项目。',
          ),
          icon: 'layers',
          href: '/services/industrial-cooperation',
        },
        {
          title: t('Еуропалық Одақ', 'Европейский союз', 'European Union', '欧盟'),
          text: t(
            'Жасыл энергетика, қалдықтарды қайта өңдеу және терең өңдеу жобалары қарастырылады. Нарыққа кіруді кәсіби серіктестер сүйемелдейді.',
            'Рассматриваются проекты зелёной энергетики, переработки отходов и глубокой переработки. Выход на рынок сопровождают профессиональные партнёры.',
            'Green energy, waste recycling and deep-processing projects are considered. Professional partners support market entry.',
            '可考虑绿色能源、废弃物回收和深加工项目。专业合作伙伴协助市场准入。',
          ),
          icon: 'compass',
          href: '/services/market-entry',
        },
      ],
    },
    {
      type: 'cards',
      heading: t('Үш басым тақырып', 'Три приоритетные темы', 'Three priority themes', '三大重点主题'),
      columns: 3,
      items: [
        {
          title: t('Технология трансферті', 'Трансфер технологий', 'Technology transfer', '技术转让'),
          text: t(
            'Технология беру, өндірісті оқшаулау және жұмыс орындарын құру инвестор бағасында «Қазақстандағы жергілікті үлес» өлшемі бойынша ескеріледі.',
            'Передача технологий, локализация производства и создание рабочих мест учитываются в оценке инвестора по критерию «Локальный вклад в Казахстане».',
            'Technology transfer, localisation of production and job creation are taken into account in the investor assessment under the “Local contribution in Kazakhstan” criterion.',
            '技术转让、生产本地化和创造就业，在投资者评估中计入“对哈萨克斯坦的本地贡献”这一维度。',
          ),
          icon: 'layers',
        },
        {
          title: t('Жасыл энергетика', 'Зелёная энергетика', 'Green energy', '绿色能源'),
          text: t(
            'Жаңартылатын энергетика, қалдықтарды қайта өңдеу және терең өңдеу жобалары «Жасыл инвестиция және инновация» қызмет бағытында қарастырылады.',
            'Проекты в сфере возобновляемой энергетики, переработки отходов и глубокой переработки рассматриваются в рамках направления «Зелёные инвестиции и инновации».',
            'Renewable energy, waste recycling and deep-processing projects are handled under the “Green investment and innovation” service line.',
            '可再生能源、废弃物回收和深加工项目归入“绿色投资与创新”服务方向。',
          ),
          icon: 'leaf',
          href: '/services/green-investment',
        },
        {
          title: t(
            'Экспортқа бағытталған өндіріс',
            'Экспортно ориентированное производство',
            'Export-oriented manufacturing',
            '面向出口的制造业',
          ),
          text: t(
            'Экспортқа бағытталған өндіріс жобалары өнеркәсіптік кооперация бағытында қарастырылады: бірлескен кәсіпорын, өндірісті оқшаулау және технология трансферті.',
            'Проекты экспортно ориентированного производства рассматриваются по направлению «Промышленная кооперация»: совместные предприятия, локализация производства и трансфер технологий.',
            'Export-oriented manufacturing projects are handled under the “Industrial cooperation” service line: joint ventures, localisation of production and technology transfer.',
            '面向出口的制造业项目归入“产业合作”服务方向：合资企业、生产本地化与技术转让。',
          ),
          icon: 'factory',
          href: '/services/industrial-cooperation',
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t('Қалай бастау керек', 'С чего начать', 'How to begin', '如何开始'),
      text: t(
        'Алдымен жобалар қорын сала, өңір, көлем және деңгей бойынша сүзіп көріңіз. Содан кейін инвестор өтінішін беріңіз: өтініш пен тексеру рәсімінен соң A немесе B деңгейлі инвестор жоба бойынша NDA-ға қол қойып, деректер бөлмесіне қол жеткізеді.',
        'Сначала отфильтруйте пул проектов по отрасли, региону, объёму и уровню. Затем подайте заявку инвестора: после заявки и проверки инвестор уровня A или B подписывает NDA по проекту и получает доступ в дата-рум.',
        'Start by filtering the project pool by sector, region, volume and level. Then submit an investor application: after the application and vetting, an investor at level A or B signs an NDA for the project and gains access to the data room.',
        '请先按行业、地区、规模和等级筛选项目库，再提交投资者申请。经申请与审核后，A级或B级投资者就项目签署NDA，即可进入数据室。',
      ),
    },
    investorNotice,
  ],
  cta: {
    title: t(
      'Қызығушылық бағытыңызды көрсетіңіз',
      'Укажите направление интереса',
      'State your area of interest',
      '说明您的投资方向',
    ),
    text: t(
      'Сала, өңір, көлем және модель бойынша қызығушылық инвестор өтінішінде көрсетіледі.',
      'Интерес по отрасли, региону, объёму и модели указывается в заявке инвестора.',
      'Your interest by sector, region, volume and model is stated in the investor application.',
      '行业、地区、规模和模式方面的意向在投资者申请中说明。',
    ),
    label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
    href: '/investors/apply',
  },
}

// ---------------------------------------------------------------------------
// 5. Инвестициялық климат
// ---------------------------------------------------------------------------
const investorsClimate: SeedPage = {
  path: '/investors/climate',
  section: 'investors',
  title: t('Инвестициялық климат', 'Инвестиционный климат', 'Investment climate', '投资环境'),
  description: t(
    'Инвестициялық ортаға шолу: ТШИ көрсеткіштері, 2030 жылға дейінгі инвестициялық саясат тұжырымдамасы, АХҚО және салық режимі.',
    'Обзор инвестиционной среды: показатели ПИИ, Концепция инвестиционной политики до 2030 года, МФЦА и налоговый режим.',
    'An overview of the investment environment: FDI indicators, the investment policy concept to 2030, the AIFC and the tax regime.',
    '投资环境概览：外国直接投资指标、《2030年前投资政策构想》、阿斯塔纳国际金融中心与税收制度。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Бұл бет инвестициялық ортаны бағалауға көмектесетін төрт тақырыпты біріктіреді: тікелей шетелдік инвестициялар (ТШИ) көрсеткіштері, 2030 жылға дейінгі инвестициялық саясат тұжырымдамасы, АХҚО және салық режимі. Қауымдастық өз атынан ресми статистика жарияламайды: әр көрсеткіш ресми дереккөзге сүйеніп, дереккөзі мен күнімен беріледі. Сандар айсайын тексеріледі.',
        'Эта страница объединяет четыре темы, которые помогают оценить инвестиционную среду: показатели прямых иностранных инвестиций (ПИИ), Концепцию инвестиционной политики до 2030 года, МФЦА и налоговый режим. Ассоциация не публикует официальную статистику от своего имени: каждый показатель опирается на официальный источник и приводится с указанием источника и даты. Цифры проверяются ежемесячно.',
        'This page brings together four topics that help to assess the investment environment: foreign direct investment (FDI) indicators, the investment policy concept to 2030, the AIFC and the tax regime. The Association does not publish official statistics in its own name: every indicator relies on an official source and is given with its source and date. Figures are checked every month.',
        '本页汇集有助于评估投资环境的四个主题：外国直接投资（FDI）指标、《2030年前投资政策构想》、阿斯塔纳国际金融中心（AIFC）和税收制度。协会不以自己的名义发布官方统计数据：每项指标均以官方来源为依据，并注明来源与日期。数据每月核查一次。',
      ),
    },
    {
      type: 'cards',
      heading: t('Төрт тақырып', 'Четыре темы', 'Four topics', '四个主题'),
      columns: 2,
      items: [
        {
          title: t('ТШИ көрсеткіштері', 'Показатели ПИИ', 'FDI indicators', '外国直接投资指标'),
          text: t(
            'Тікелей шетелдік инвестициялар бойынша көрсеткіштер ресми статистикалық дереккөздерден алынады. Әр көрсеткіш дереккөзі мен күнімен жарияланады және айсайын тексеріледі.',
            'Показатели прямых иностранных инвестиций берутся из официальных статистических источников. Каждый показатель публикуется с источником и датой и проверяется ежемесячно.',
            'Foreign direct investment indicators are taken from official statistical sources. Each indicator is published with its source and date and is checked every month.',
            '外国直接投资指标取自官方统计来源。每项指标均注明来源和日期，并每月核查。',
          ),
          icon: 'chart',
        },
        {
          title: t(
            '2030 жылға дейінгі инвестициялық саясат тұжырымдамасы',
            'Концепция инвестиционной политики до 2030 года',
            'Investment policy concept to 2030',
            '《2030年前投资政策构想》',
          ),
          text: t(
            'Тұжырымдама инвестициялық саясаттың ұзақ мерзімді бағдарын айқындайтын құжат ретінде қаралады. Ресми мәтінді ресми дереккөзден қараңыз: қауымдастық оны ресми түсіндірмейді.',
            'Концепция рассматривается как документ, определяющий долгосрочные ориентиры инвестиционной политики. Официальный текст следует смотреть в официальном источнике: ассоциация не даёт его официального толкования.',
            'The concept is treated as a document that sets out the long-term direction of investment policy. Please consult the official text at the official source: the Association does not provide an official interpretation of it.',
            '该构想被视为确定投资政策长期方向的文件。官方文本请查阅官方来源，协会不对其作官方解释。',
          ),
          icon: 'document',
        },
        {
          title: t('АХҚО', 'МФЦА', 'AIFC', '阿斯塔纳国际金融中心'),
          text: t(
            'Астана халықаралық қаржы орталығы капитал құрылымын жобалау және қаржы құралдарын рәсімдеу алаңы ретінде қаралады. Қолданылатын жағдайлар мен рәсімдер орталықтың ресми құжаттарымен айқындалады.',
            'Международный финансовый центр «Астана» рассматривается как площадка для проектирования структуры капитала и оформления финансовых инструментов. Применимые условия и процедуры определяются официальными документами центра.',
            'The Astana International Financial Centre is considered as a platform for designing capital structures and formalising financial instruments. The applicable conditions and procedures are set by the Centre’s official documents.',
            '阿斯塔纳国际金融中心可作为设计资本结构和落实金融工具的平台。适用的条件与程序以该中心的官方文件为准。',
          ),
          icon: 'columns',
          href: '/investors/gulf',
        },
        {
          title: t('Салық режимі', 'Налоговый режим', 'Tax regime', '税收制度'),
          text: t(
            'Салық режимі туралы тек жалпы сипаттама беріледі. Нақты ставкалар мен жеңілдіктер бұл бетте көрсетілмейді: оларды қолданыстағы заңнамадан және салық кеңесшісінен тексеріңіз.',
            'О налоговом режиме даётся только общее описание. Конкретные ставки и льготы на этой странице не приводятся: проверяйте их по действующему законодательству и у налогового консультанта.',
            'Only a general description of the tax regime is given. Specific rates and incentives are not stated on this page: please check them against current legislation and with a tax adviser.',
            '关于税收制度，此处仅作一般性介绍。具体税率和优惠不在本页列出，请以现行法律为准，并咨询税务顾问。',
          ),
          icon: 'shield',
        },
      ],
    },
    {
      type: 'facts',
      heading: t(
        'Көрсеткіштер қалай беріледі',
        'Как приводятся показатели',
        'How indicators are presented',
        '指标的呈现方式',
      ),
      items: [
        {
          label: t('Дереккөзі', 'Источник', 'Source', '来源'),
          value: t(
            'Әр көрсеткіштің ресми дереккөзі аталады',
            'Для каждого показателя указывается официальный источник',
            'The official source is named for every indicator',
            '每项指标均注明官方来源',
          ),
        },
        {
          label: t('Күні', 'Дата', 'Date', '日期'),
          value: t(
            'Деректің күні көрсетіледі; күні жоқ сан жарияланбайды',
            'Указывается дата данных; число без даты не публикуется',
            'The date of the data is shown; a figure without a date is not published',
            '注明数据日期；无日期的数字不予发布',
          ),
        },
        {
          label: t('Тексеру', 'Проверка', 'Verification', '核查'),
          value: t(
            'Сандар айсайын тексеріліп отырады',
            'Цифры проверяются ежемесячно',
            'Figures are checked every month',
            '数据每月核查',
          ),
        },
        {
          label: t('Сипаты', 'Характер', 'Nature', '性质'),
          value: t(
            'Көрсеткіш ақпараттық сипатта: ол қауымдастықтың бағасы немесе болжамы емес',
            'Показатель носит информационный характер и не является оценкой или прогнозом ассоциации',
            'An indicator is for information only and is not an assessment or forecast by the Association',
            '指标仅供参考，不代表协会的评估或预测',
          ),
        },
      ],
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t('Кепілдік жоқ', 'Гарантий нет', 'No guarantee', '不作任何保证'),
      text: t(
        'Бұл бет ақпараттық сипатта. Қауымдастық мемлекеттік орган емес және инвестициялық табысқа, мемлекеттік рұқсатқа, салық жеңілдігіне не жағдайлардың өзгермеуіне кепілдік бермейді. Заңнама мен салық ережелері өзгеруі мүмкін, сондықтан шешім қабылдар алдында ресми дереккөздерді қараңыз және өз кеңесшілеріңізбен кеңесіңіз.',
        'Эта страница носит информационный характер. Ассоциация не является государственным органом и не гарантирует инвестиционный доход, государственные разрешения, налоговые льготы или неизменность условий. Законодательство и налоговые правила могут меняться, поэтому перед принятием решения обращайтесь к официальным источникам и консультируйтесь со своими советниками.',
        'This page is for information only. The Association is not a government body and does not guarantee investment returns, government permits, tax incentives or that conditions will remain unchanged. Legislation and tax rules may change, so before making a decision please consult official sources and your own advisers.',
        '本页仅供参考。协会不是政府机构，不保证投资收益、政府许可、税收优惠或条件保持不变。法律和税收规则可能发生变化，作出决策前请查阅官方来源并咨询您自己的顾问。',
      ),
    },
    {
      type: 'links',
      heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
      items: [
        {
          label: t('Парсы шығанағы', 'Страны Персидского залива', 'Gulf countries', '海湾国家'),
          href: '/investors/gulf',
          text: t(
            'АХҚО мүмкіндіктері мен ислам қаржысы.',
            'Возможности МФЦА и исламские финансы.',
            'AIFC opportunities and Islamic finance.',
            'AIFC的机遇与伊斯兰金融。',
          ),
        },
        {
          label: t(
            'Мемлекетпен және өңірлермен жұмыс',
            'Работа с государством и регионами',
            'Working with government and regions',
            '政府与地方对接',
          ),
          href: '/services/government-relations',
          text: t(
            'Инвестор мәселелерін ресми арналар арқылы жеткізу.',
            'Передача вопросов инвесторов по официальным каналам.',
            'Raising investors’ issues through official channels.',
            '通过正式渠道反映投资者诉求。',
          ),
        },
        {
          label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
          href: '/investors/handbook',
          text: t(
            'Жиі қойылатын сұрақтарға жауаптар.',
            'Ответы на частые вопросы.',
            'Answers to frequently asked questions.',
            '常见问题解答。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Жобалар қорымен танысыңыз', 'Ознакомьтесь с пулом проектов', 'Explore the project pool', '浏览项目库'),
    text: t(
      'Инвестициялық ортамен танысқан соң, тексерілген жобалар каталогын қараңыз.',
      'Изучив инвестиционную среду, посмотрите каталог проверенных проектов.',
      'Having reviewed the investment environment, look through the catalogue of verified projects.',
      '了解投资环境后，请查看经审核的项目目录。',
    ),
    label: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
    href: '/projects',
  },
}

// ---------------------------------------------------------------------------
// 6. Инвестор анықтамалығы
// ---------------------------------------------------------------------------
const investorsHandbook: SeedPage = {
  path: '/investors/handbook',
  section: 'investors',
  title: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
  description: t(
    'Инвесторлар жиі қоятын сұрақтарға жауаптар: процесс, NDA, деңгейлер, деректер бөлмесі, құпиялылық, құны және қауымдастықтың рөлі.',
    'Ответы на частые вопросы инвесторов: процесс, NDA, уровни, дата-рум, конфиденциальность, стоимость и роль ассоциации.',
    'Answers to investors’ frequently asked questions: the process, NDA, levels, the data room, confidentiality, cost and the Association’s role.',
    '投资者常见问题解答：流程、NDA、等级、数据室、保密、费用以及协会的角色。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Анықтамалық инвестордың өтініш бергенге дейін және жолдың барысында қоятын негізгі сұрақтарына жауап береді. Жауаптар қысқа, ал толық сипаттама тиісті беттерде берілген. Жауап таппасаңыз, кері байланыс формасы арқылы жазыңыз.',
        'Справочник отвечает на основные вопросы, которые инвестор задаёт до подачи заявки и в ходе пути. Ответы краткие, подробное описание дано на соответствующих страницах. Если вы не нашли ответ, напишите через форму обратной связи.',
        'The handbook answers the main questions an investor has before applying and during the pathway. Answers are brief, and fuller descriptions are on the relevant pages. If you do not find an answer, write to us through the feedback form.',
        '本手册解答投资者在申请前及整个流程中的主要问题。答案力求简明，详细说明请见相关页面。如未找到答案，请通过反馈表单联系我们。',
      ),
    },
    {
      type: 'faq',
      heading: t('Жиі қойылатын сұрақтар', 'Частые вопросы', 'Frequently asked questions', '常见问题'),
      items: [
        {
          q: t(
            'Инвестор жолы қалай өтеді?',
            'Как проходит путь инвестора?',
            'How does the investor pathway work?',
            '投资者路径是如何进行的？',
          ),
          a: t(
            'Жол жеті қадамнан тұрады: инвестор орталығына өту, жобалар қорын қарау, инвестор өтінішін беру, тексеру мен баға, электрондық NDA, деректер бөлмесі, келіссөз бен сапар. Әр қадамға қажетті құжаттар «Инвестор жолы» бетінде көрсетілген. Өтініш мәртебесі жеке кабинетте көрінеді.',
            'Путь состоит из семи шагов: переход в раздел для инвесторов, просмотр пула проектов, подача заявки, проверка и оценка, электронное NDA, дата-рум, переговоры и визит. Необходимые документы по каждому шагу указаны на странице «Путь инвестора». Статус заявки виден в личном кабинете.',
            'The pathway has seven steps: entering the investor centre, browsing the project pool, submitting an application, vetting and assessment, an electronic NDA, the data room, and negotiations with a visit. The documents needed at each step are listed on the “Investor pathway” page. The status of your application is visible in the personal account.',
            '路径共七个步骤：进入投资者中心、浏览项目库、提交申请、审核与评估、电子NDA、数据室，以及洽谈与考察。各步骤所需文件见“投资者路径”页面。申请状态可在个人中心查看。',
          ),
        },
        {
          q: t(
            'Өтініште қандай ақпарат көрсетіледі?',
            'Какая информация указывается в заявке?',
            'What information is given in the application?',
            '申请中需要填写哪些信息？',
          ),
          a: t(
            'Компания атауы мен тіркеу елі, тіркеу нөмірі, сайт, нақты бенефициар, өкілетті өкіл және оның сенімхаты, салалық тәжірибе, қызығушылық бағыттары (сала, өңір, көлем, модель, шешім қабылдау мерзімі), байланыс тілі және дербес деректерге келісім. Қаржылық әлеует құжаттары міндетті емес, бірақ бағалау балына әсер етеді. Толық тізім инвестор өтінішін беру бетінде.',
            'Название компании и страна регистрации, регистрационный номер, сайт, конечный бенефициар, уполномоченный представитель и его доверенность, отраслевой опыт, интересы (отрасль, регион, объём, модель, срок принятия решения), язык общения и согласие на обработку персональных данных. Документы о финансовых возможностях необязательны, но влияют на балл оценки. Полный перечень приведён на странице подачи заявки.',
            'The company name and country of registration, registration number, website, ultimate beneficial owner, authorised representative and power of attorney, sector experience, areas of interest (sector, region, volume, model, decision timeline), contact language and consent to the processing of personal data. Proof of financial capacity is optional but affects the assessment score. The full list is on the application page.',
            '公司名称与注册国家、注册号、网站、最终受益所有人、授权代表及其授权委托书、行业经验、投资意向（行业、地区、规模、模式、决策时限）、沟通语言，以及同意处理个人数据的声明。资金实力证明为选填，但会影响评估得分。完整清单见申请页面。',
          ),
        },
        {
          q: t(
            '100 балдық бағалау қалай жүргізіледі?',
            'Как проводится 100-балльная оценка?',
            'How is the 100-point assessment carried out?',
            '100分评估是如何进行的？',
          ),
          a: t(
            'Инвестор жеті өлшем бойынша бағаланады: қаржылық әлеует, инвестициялық ниет пен шешім қабілеті, салалық тәжірибе және технология, іскерлік бедел, Қазақстандағы жергілікті үлес, комплаенс және тәуекел, инвестициялық жоспардың дайындығы. Ең үлкен салмақ қаржылық әлеуетке тиеді: 25 балл. Әр өлшем бойынша балл, дәлелдеме мәтіні және дәлел файлдары болуы тиіс. Бағаны екі тұлға қояды: сарапшы және комитет мүшесі, ал мүдделер қақтығысы бар сарапшы баға қоя алмайды.',
            'Инвестор оценивается по семи критериям: финансовый потенциал, инвестиционное намерение и полномочия, отраслевой опыт и технологии, деловая репутация, локальный вклад в Казахстане, комплаенс и риск, готовность инвестиционного плана. Наибольший вес имеет финансовый потенциал: 25 баллов. По каждому критерию обязательны балл, обоснование и подтверждающие файлы. Оценку выставляют два лица: эксперт и член комитета, а эксперт с конфликтом интересов оценку выставить не может.',
            'An investor is assessed on seven criteria: financial capacity, investment intent and decision-making authority, sector experience and technology, business reputation, local contribution in Kazakhstan, compliance and risk, and investment plan readiness. Financial capacity carries the greatest weight: 25 points. Each criterion requires a score, a written justification and supporting files. Two people give the assessment, an expert and a committee member, and an expert with a conflict of interest cannot score.',
            '投资者按七项标准评估：资金实力、投资意向与决策能力、行业经验与技术、商业信誉与履约记录、对哈萨克斯坦的本地贡献、合规与风险、投资计划成熟度。其中资金实力权重最大，为25分。每项标准都须有评分、论证文字和佐证文件。评分由专家和委员会成员两人共同给出，存在利益冲突的专家不得评分。',
          ),
        },
        {
          q: t(
            'A, B, C, D деңгейлері нені білдіреді және бұл ресми рейтинг пе?',
            'Что означают уровни A, B, C, D и является ли это официальным рейтингом?',
            'What do levels A, B, C and D mean, and is this an official rating?',
            'A、B、C、D等级代表什么？这是官方评级吗？',
          ),
          a: t(
            'Жоқ, деңгей қауымдастықтың ішкі құралы: ол ресми рейтинг емес және ашық жарияланбайды. A (80-100 балл) басым серіктесті, B (65-79) қосымша құжат қажет шартты серіктесті, C (50-64) бақылау тобын білдіреді; D (50 баллдан төмен) деңгейлі инвестор басым жобаларға жіберілмейді. Инвестор өз деңгейін жеке кабинетте көреді, ал баға 12 айда бір рет немесе жаңа дерек түскенде қайта қаралады.',
            'Нет, уровень является внутренним инструментом ассоциации: он не является официальным рейтингом и не публикуется открыто. A (80-100 баллов) означает приоритетного партнёра, B (65-79) условного партнёра, которому нужны дополнительные документы, C (50-64) группу наблюдения; инвестор уровня D (менее 50 баллов) к приоритетным проектам не допускается. Инвестор видит свой уровень в личном кабинете, а оценка пересматривается раз в 12 месяцев или при поступлении новых данных.',
            'No. The level is an internal tool of the Association; it is not an official rating and is not published openly. A (80-100 points) means a priority partner, B (65-79) a conditional partner who must supply additional documents, and C (50-64) the watch group; an investor at level D (below 50 points) is not admitted to priority projects. Investors see their own level in the personal account, and the assessment is reviewed every 12 months or when new data arrives.',
            '不是。等级是协会的内部工具，不是官方评级，也不会公开发布。A级（80-100分）为优先合作伙伴，B级（65-79分）为需补充文件的有条件合作伙伴，C级（50-64分）为观察组；D级（50分以下）的投资者不进入优先项目。投资者可在个人中心查看自己的等级，评估每12个月或在获得新资料时复核。',
          ),
        },
        {
          q: t(
            'Комплаенс ветосы мен санкциялық тексеру дегеніміз не?',
            'Что такое комплаенс-вето и проверка по санкционным спискам?',
            'What are the compliance veto and sanctions screening?',
            '什么是合规否决权和制裁名单核查？',
          ),
          a: t(
            'Комплаенс қызметкері жалпы балға қарамастан инвестордың мәртебесін «тоқтатылды» деп белгілей алады. Бұл күмәнді қаражат көзі, жалған құжат немесе санкциялық тәуекел анықталғанда қолданылады, ал себебі міндетті түрде көрсетіледі. Инвесторлар ашық санкциялық тізімдер (БҰҰ, ЕО, АҚШ OFAC, Ұлыбритания) бойынша тексеріледі, нәтиже комплаенс қызметкеріне жіберіледі.',
            'Сотрудник по комплаенс может присвоить статус «приостановлено» независимо от общего балла. Это применяется при сомнительном источнике средств, поддельном документе или санкционном риске, причина указывается обязательно. Инвесторы проверяются по открытым санкционным спискам (ООН, ЕС, OFAC США, Великобритания), результат передаётся сотруднику по комплаенс.',
            'A compliance officer can set the status “suspended” regardless of the total score. This applies when the source of funds is doubtful, a document is forged or a sanctions risk is found, and the reason must always be given. Investors are screened against open sanctions lists (UN, EU, US OFAC, United Kingdom), and the result goes to the compliance officer.',
            '合规专员可不论总分多少，将状态设为“已暂停”。资金来源存疑、文件伪造或存在制裁风险时适用，且必须说明原因。投资者将对照公开制裁名单（联合国、欧盟、美国OFAC、英国）接受核查，结果提交合规专员。',
          ),
        },
        {
          q: t(
            'NDA не үшін қажет және қашан қол қойылады?',
            'Для чего нужно NDA и когда оно подписывается?',
            'What is the NDA for and when is it signed?',
            'NDA有什么作用，何时签署？',
          ),
          a: t(
            'NDA жобаның құпия деректерін қорғайды және деректер бөлмесіне қатынасудың шарты болып табылады; жоба иесінің аты NDA-дан кейін ғана ашылады. A немесе B деңгейін алған инвестор таңдалған жоба бойынша электрондық NDA-ға қол қояды. NDA шаблоны төрт тілде беріледі, қабылдау жеке кабинетте белгі қою және бір реттік код арқылы жүреді, ал нұсқасы, уақыты, IP мекенжайы мен пайдаланушы тіркеледі. Қазақстандық тұлғалар үшін ЭЦҚ арқылы қол қою 2-кезеңде қосылады.',
            'NDA защищает конфиденциальные данные проекта и является условием доступа в дата-рум; имя владельца проекта раскрывается только после него. Инвестор уровня A или B подписывает электронное NDA по выбранному проекту. Шаблон доступен на четырёх языках, принятие происходит в личном кабинете через флажок и одноразовый код, при этом фиксируются версия, время, IP-адрес и пользователь. Для казахстанских лиц подписание с помощью ЭЦП будет добавлено на втором этапе.',
            'The NDA protects the project’s confidential data and is a condition of access to the data room; the project owner’s name is disclosed only after it. An investor at level A or B signs an electronic NDA for the chosen project. The template is available in four languages, and acceptance takes place in the personal account by a tick box and a one-time code, with the version, time, IP address and user recorded. Signing with an electronic digital signature for Kazakhstani persons will be added in the second phase.',
            'NDA保护项目的保密数据，是进入数据室的前提条件；项目方名称在签署后才会披露。A级或B级投资者就所选项目签署电子NDA。模板提供四种语言版本，在个人中心通过勾选和一次性验证码确认，并记录版本、时间、IP地址和用户。针对哈萨克斯坦境内主体的电子数字签名方式将在第二阶段增加。',
          ),
        },
        {
          q: t(
            'Деректер бөлмесіндегі құжаттар қалай қорғалады?',
            'Как защищены документы в дата-руме?',
            'How are documents protected in the data room?',
            '数据室中的文件如何保护？',
          ),
          a: t(
            'Деректер бөлмесінде құжаттар тек көру режимінде немесе сіздің атыңыз бен күніңіз жазылған жеке су белгісімен беріледі. Әр ашу мен жүктеу журналға жазылады. Қатынас мерзімді (әдепкі бойынша 90 күн) және кез келген уақытта кері алынады, ал деректер бөлмесін ашу үшін екі факторлы аутентификация (2FA) міндетті.',
            'В дата-руме документы доступны только для просмотра либо с персональным водяным знаком, содержащим ваше имя и дату. Каждое открытие и загрузка записываются в журнал. Доступ ограничен по сроку (по умолчанию 90 дней) и может быть отозван в любой момент, а для входа в дата-рум обязательна двухфакторная аутентификация (2FA).',
            'Documents in the data room are provided in view-only mode or with a personal watermark showing your name and date. Every opening and download is recorded in a log. Access is time-limited (90 days by default) and can be withdrawn at any time, and two-factor authentication (2FA) is required to enter the data room.',
            '数据室中的文件仅限在线查看，或带有注明您姓名和日期的个人水印。每次打开与下载都会记入日志。访问有期限（默认90天），可随时撤销，进入数据室须启用双重验证（2FA）。',
          ),
        },
        {
          q: t(
            'Менің дербес деректерім қалай өңделеді?',
            'Как обрабатываются мои персональные данные?',
            'How is my personal data processed?',
            '我的个人数据如何处理？',
          ),
          a: t(
            'Әр формада дербес деректерді жинауға және өңдеуге анық келісім сұралады, келісім белгісі алдын ала қойылмайды. Деректер ең аз көлемде жиналады: жеке сәйкестендіру нөмірлері мен төлқұжат скандары тек комплаенс кезеңінде және жабық қоймада сақталады. Сіз өз деректеріңізді жүктеп ала аласыз немесе жоюды сұрай аласыз. Толық шарттар құпиялылық саясатында.',
            'В каждой форме запрашивается явное согласие на сбор и обработку персональных данных, флажок согласия заранее не устанавливается. Данные собираются в минимальном объёме: индивидуальные идентификационные номера и сканы паспортов хранятся только на этапе комплаенса и только в закрытом хранилище. Вы можете скачать свои данные или запросить их удаление. Полные условия изложены в политике конфиденциальности.',
            'Every form asks for explicit consent to the collection and processing of personal data, and the consent box is never ticked in advance. Data is collected in the minimum amount: personal identification numbers and passport scans are kept only at the compliance stage and only in closed storage. You can download your data or request its deletion. The full terms are set out in the privacy policy.',
            '每个表单都会明确征求您对收集和处理个人数据的同意，同意框不会预先勾选。数据按最小范围收集：个人身份号码和护照扫描件仅在合规核查阶段使用，并仅存放于封闭存储中。您可以下载自己的数据，也可以申请删除。完整条款见隐私政策。',
          ),
        },
        {
          q: t(
            'Қызметтің құны қанша және кім төлейді?',
            'Сколько стоят услуги и кто платит?',
            'How much do the services cost and who pays?',
            '服务费用是多少，由谁支付？',
          ),
          a: t(
            'Қызметтің құны мен төлеуші тарап қызмет түріне байланысты және нақты шартпен айқындалады. Жалпы қағида: мүшелік жарнасы мен жобалық қызмет ақысы бөлек есепке алынады және ашық жарияланады. Нақты мөлшерлер Басқарма бекіткеннен кейін тиісті беттерде көрсетіледі.',
            'Стоимость услуги и плательщик зависят от вида услуги и определяются условиями конкретного договора. Общий принцип: членский взнос и плата за проектные услуги учитываются раздельно и публикуются открыто. Конкретные размеры будут указаны на соответствующих страницах после утверждения Правлением.',
            'The cost of a service and the paying party depend on the type of service and are set by the specific agreement. As a general principle, the membership fee and project service fees are accounted for separately and published openly. Specific amounts will be shown on the relevant pages once approved by the Board.',
            '服务费用及付费方取决于服务类型，并由具体协议约定。总的原则是：会费与项目服务费分别核算并公开披露。具体金额经理事会批准后，将在相关页面公布。',
          ),
        },
        {
          q: t(
            'Қауымдастық не істейді және не істемейді?',
            'Что ассоциация делает и чего не делает?',
            'What does the Association do, and what does it not do?',
            '协会做什么，不做什么？',
          ),
          a: t(
            'Қауымдастық жобаларды алдын ала іріктейді, инвесторды ішкі бағалайды, келіссөздер мен сапарларды ұйымдастыруға көмектеседі және жобаны толық цикл бойынша бақылайды. Қауымдастық мемлекеттік орган емес, ресми рейтинг агенттігі де емес, ал қаржыландыруды лицензиясы бар ұйымдар жүзеге асырады. Ол инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді.',
            'Ассоциация предварительно отбирает проекты, проводит внутреннюю оценку инвесторов, помогает с организацией переговоров и визитов и контролирует проект на протяжении всего цикла. Она не является государственным органом или официальным рейтинговым агентством, а финансирование осуществляют организации с лицензией. Ассоциация не гарантирует инвестиционный доход, государственные разрешения или льготы.',
            'The Association pre-selects projects, assesses investors internally, helps to organise negotiations and visits, and oversees a project across its full cycle. It is not a government body or an official rating agency, and financing is provided by licensed organisations. It does not guarantee investment returns, government permits or incentives.',
            '协会对项目进行预先遴选，对投资者开展内部评估，协助组织洽谈与考察，并对项目实行全周期跟踪。协会不是政府机构，也不是官方评级机构，融资由持牌机构提供。协会不保证投资收益、政府许可或优惠政策。',
          ),
        },
        {
          q: t(
            'Қауымдастықтың Kazakh Invest-тен айырмашылығы неде?',
            'Чем ассоциация отличается от Kazakh Invest?',
            'How does the Association differ from Kazakh Invest?',
            '协会与 Kazakh Invest 有何不同？',
          ),
          a: t(
            'Мемлекеттік оператор ресми сүйемелдеу мен әкімшілік қолдауды жүргізеді. Қауымдастық нарықтық толықтырушы рөлін атқарады: жеке халықаралық желі, жобаларды алдын ала іріктеу, инвесторды ішкі бағалау және жобаны толық цикл бойынша бақылау. Қауымдастық мемлекеттік оператордың атынан әрекет етпейді.',
            'Государственный оператор осуществляет официальное сопровождение и административную поддержку. Ассоциация выступает рыночным дополнением: собственная международная сеть, предварительный отбор проектов, внутренняя оценка инвестора и контроль проекта на протяжении всего цикла. Ассоциация не действует от имени государственного оператора.',
            'The state operator provides official support and administrative assistance. The Association is a market-based complement: its own international network, pre-selection of projects, internal investor assessment and oversight of a project across its full cycle. The Association does not act on behalf of the state operator.',
            '国家运营机构负责官方对接与行政支持。协会是市场化的补充力量：拥有自己的国际网络，对项目进行预先遴选，对投资者开展内部评估，并对项目实行全周期跟踪。协会不代表国家运营机构行事。',
          ),
        },
        {
          q: t(
            'Жоба деңгейлері мен кезеңдері қандай?',
            'Какие бывают уровни и этапы проекта?',
            'What are the project levels and stages?',
            '项目有哪些等级和阶段？',
          ),
          a: t(
            'Жоба төрт деңгейдің бірінде тұрады: 1-деңгей (Тұжырымдама), 2-деңгей (Алдын ала бағаланған), 3-деңгей (Инвестицияға дайын) және 4-деңгей (Іске асырылуда). Ашық каталогта инвесторларға тексеруден өткен 2 және 3 деңгейлі жобалар көрсетіледі. Жоба сегіз кезеңнен өтеді: қабылдаудан нәтижені бағалауға дейін. Толық кесте «Жоба деңгейлері» бетінде.',
            'Проект находится на одном из четырёх уровней: 1 (Концепция), 2 (Предварительно оценён), 3 (Готов к инвестициям) и 4 (В реализации). В открытом каталоге инвесторам показываются проверенные проекты уровней 2 и 3. Проект проходит восемь этапов: от приёма до оценки результата. Полная таблица приведена на странице «Уровни проектов».',
            'A project is at one of four levels: 1 (Concept), 2 (Pre-assessed), 3 (Investment-ready) and 4 (In implementation). The open catalogue shows investors verified projects at levels 2 and 3. A project passes through eight stages, from intake to results assessment. The full table is on the “Project levels” page.',
            '项目处于四个等级之一：1级（概念）、2级（已预评估）、3级（具备投资条件）和4级（实施中）。公开目录向投资者展示经审核的2级和3级项目。项目经历八个阶段，从受理直至成果评估。完整表格见“项目等级”页面。',
          ),
        },
        {
          q: t(
            '«Төрт бөлек сома» дегеніміз не?',
            'Что означают «четыре раздельные суммы»?',
            'What are the “four separate amounts”?',
            '“四项独立金额”是什么意思？',
          ),
          a: t(
            'Әр жобада төрт сома бөлек есептеледі: мәлімделген, ниет құжаты бойынша, ресми шарт бойынша және нақты түскен. Олар ешқашан қосылмайды. Нақты түскен соманы тек дәлел файлы (банк құжаты, аудит) болғанда ғана толтыруға болады. Сондықтан ниет сомасы «инвестиция тартылды» деп көрсетілмейді.',
            'По каждому проекту раздельно учитываются четыре суммы: заявленная, по документу о намерениях, по официальному договору и фактически поступившая. Они никогда не суммируются. Фактически поступившая сумма заполняется только при наличии подтверждающего файла (банковский документ, аудит). Поэтому сумма намерения не представляется как «инвестиции привлечены».',
            'Four amounts are recorded separately for every project: declared, per letter of intent, per signed contract, and actually received. They are never added together. The actually received amount can be entered only with supporting evidence (a bank document or an audit). For this reason an intended amount is never described as “investment attracted”.',
            '每个项目分别记录四项金额：申报金额、按意向文件的金额、按正式合同的金额和实际到位金额。它们永不相加。实际到位金额只有附有佐证文件（银行凭证、审计文件）时才可填写。因此，意向金额不会被表述为“已吸引投资”。',
          ),
        },
        {
          q: t(
            'Портал қандай тілдерде жұмыс істейді?',
            'На каких языках работает портал?',
            'Which languages does the portal work in?',
            '门户支持哪些语言？',
          ),
          a: t(
            'Портал қазақ, орыс, ағылшын және қытай тілдерінде толық жұмыс істейді, ал қытай нұсқасында инвестор бөлімдері бірінші кезекте аударылады. Араб тіліндегі нұсқа (оңнан солға жазылатын, RTL) 2-кезеңде қосылады және тек «Инвесторларға» бөлімін қамтиды. Тілді беттің жоғарғы жағынан ауыстыруға болады.',
            'Портал полностью работает на казахском, русском, английском и китайском языках, при этом в китайской версии разделы для инвесторов переводятся в первую очередь. Версия на арабском языке (письмо справа налево, RTL) будет добавлена на втором этапе и охватит только раздел «Инвесторам». Язык можно переключить в верхней части страницы.',
            'The portal works fully in Kazakh, Russian, English and Chinese, and in the Chinese version the investor sections are translated first. An Arabic version (right-to-left, RTL) will be added in the second phase and will cover the Investors section only. You can switch the language at the top of the page.',
            '门户全面支持哈萨克语、俄语、英语和中文，其中中文版优先翻译投资者栏目。阿拉伯语版本（从右至左，RTL）将在第二阶段上线，仅涵盖“投资者”栏目。您可在页面顶部切换语言。',
          ),
        },
        {
          q: t(
            'Қауымдастықпен қалай байланысуға болады?',
            'Как связаться с ассоциацией?',
            'How can I contact the Association?',
            '如何联系协会？',
          ),
          a: t(
            'Байланыс деректері «Байланыс» бетінде: телефон, WeChat және екі мекенжай (заңды мекенжай Астанада, кеңсе Алматыда). Кері байланыс формасында «инвестиция» тақырыбын таңдап, сұрағыңызды жібере аласыз. Қытай инвесторлары WeChat арқылы да жаза алады.',
            'Контактные данные размещены на странице «Контакты»: телефон, WeChat и два адреса (юридический адрес в Астане, офис в Алматы). В форме обратной связи выберите тему «инвестиции» и отправьте свой вопрос. Китайские инвесторы могут также написать через WeChat.',
            'Contact details are on the “Contacts” page: telephone, WeChat and two addresses (the registered address in Astana and the office in Almaty). In the feedback form, choose the topic “investment” and send your question. Chinese investors can also write via WeChat.',
            '联系方式见“联系我们”页面：电话、微信和两个地址（注册地址在阿斯塔纳，办公室在阿拉木图）。在反馈表单中选择“投资”主题，即可发送您的问题。中国投资者也可通过微信联系。',
          ),
        },
      ],
    },
    investorNotice,
  ],
  cta: {
    title: t('Сұрағыңыз қалды ма?', 'Остались вопросы?', 'Still have questions?', '仍有疑问？'),
    text: t(
      'Кері байланыс формасында «инвестиция» тақырыбын таңдап, сұрағыңызды жіберіңіз.',
      'В форме обратной связи выберите тему «инвестиции» и отправьте свой вопрос.',
      'Choose the topic “investment” in the feedback form and send your question.',
      '请在反馈表单中选择“投资”主题并发送您的问题。',
    ),
    label: t('Сұрақ қою', 'Задать вопрос', 'Ask a question', '提出问题'),
    href: '/contacts',
  },
}

// ---------------------------------------------------------------------------
// 7. Инвестор өтінішін беру
// ---------------------------------------------------------------------------
const investorsApply: SeedPage = {
  path: '/investors/apply',
  section: 'investors',
  title: t(
    'Инвестор өтінішін беру',
    'Подача заявки инвестора',
    'Submit an investor application',
    '提交投资者申请',
  ),
  description: t(
    'Инвестор өтініші онлайн формамен толтырылады: компания, нақты бенефициар, қызығушылық бағыттары және дербес деректерге келісім.',
    'Заявка инвестора заполняется в онлайн-форме: компания, конечный бенефициар, направления интереса и согласие на обработку персональных данных.',
    'The investor application is completed in an online form: the company, ultimate beneficial owner, areas of interest and consent to the processing of personal data.',
    '投资者申请通过在线表单填写：公司信息、最终受益所有人、投资意向及个人数据处理同意。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Өтінім онлайн формамен толтырылады. Өтініш арқылы қауымдастық инвестордың компаниясы, нақты бенефициары және қызығушылық бағыттары туралы алғашқы деректерді алады. Өтініш жіберілгенде жеке кабинет ашылады, онда өтініш мәртебесі мен деңгей көрінеді.',
        'Заявка заполняется в онлайн-форме. Через заявку ассоциация получает первичные данные о компании инвестора, конечном бенефициаре и направлениях интереса. После отправки заявки открывается личный кабинет, в котором видны статус заявки и уровень.',
        'The application is completed in an online form. Through it the Association receives the first information about the investor’s company, ultimate beneficial owner and areas of interest. When the application is submitted, a personal account is opened in which the status of the application and the level are shown.',
        '申请通过在线表单填写。协会借此获得投资者公司、最终受益所有人和投资意向的初步资料。申请提交后，系统将开通个人中心，您可在其中查看申请状态与等级。',
      ),
    },
    {
      type: 'table',
      heading: t('Форма өрістері', 'Поля формы', 'Form fields', '表单字段'),
      caption: t(
        'Инвестор өтінішінің өрістері',
        'Поля заявки инвестора',
        'Investor application fields',
        '投资者申请字段',
      ),
      columns: [
        t('Өріс', 'Поле', 'Field', '字段'),
        t('Не көрсетіледі', 'Что указывается', 'What is stated', '填写内容'),
      ],
      rows: [
        [
          t(
            'Компания атауы және тіркеу елі',
            'Название компании и страна регистрации',
            'Company name and country of registration',
            '公司名称与注册国家',
          ),
          t(
            'Компанияның толық атауы мен ол тіркелген ел.',
            'Полное название компании и страна, в которой она зарегистрирована.',
            'The full name of the company and the country where it is registered.',
            '公司全称及其注册所在国家。',
          ),
        ],
        [
          t('Тіркеу нөмірі', 'Регистрационный номер', 'Registration number', '注册号'),
          t(
            'Компанияның тіркеу нөмірі.',
            'Регистрационный номер компании.',
            'The company’s registration number.',
            '公司的注册号码。',
          ),
        ],
        [
          t('Сайт', 'Сайт', 'Website', '网站'),
          t('Компанияның ресми сайты.', 'Официальный сайт компании.', 'The company’s official website.', '公司官方网站。'),
        ],
        [
          t('Нақты бенефициар', 'Конечный бенефициар', 'Ultimate beneficial owner', '最终受益所有人'),
          t(
            'Компанияға түпкілікті иелік ететін немесе оны бақылайтын тұлға (бенефициарлық меншік иесі).',
            'Лицо, которое в конечном счёте владеет компанией или контролирует её (бенефициарный владелец).',
            'The person who ultimately owns or controls the company.',
            '最终拥有或实际控制公司的自然人。',
          ),
        ],
        [
          t(
            'Өкілетті өкіл және сенімхат',
            'Уполномоченный представитель и доверенность',
            'Authorised representative and power of attorney',
            '授权代表与授权委托书',
          ),
          t(
            'Компания атынан әрекет ететін өкіл және оның өкілеттігін растайтын сенімхат файлы.',
            'Представитель, действующий от имени компании, и файл доверенности, подтверждающей его полномочия.',
            'The representative acting for the company and the power of attorney file confirming their authority.',
            '代表公司行事的授权代表，以及证明其权限的授权委托书文件。',
          ),
        ],
        [
          t('Салалық тәжірибе', 'Отраслевой опыт', 'Sector experience', '行业经验'),
          t(
            'Ұқсас жобалар, технология және команда туралы қысқаша мәлімет.',
            'Краткие сведения об аналогичных проектах, технологиях и команде.',
            'Brief details of comparable projects, technology and the team.',
            '同类项目、技术和团队的简要介绍。',
          ),
        ],
        [
          t('Қызығушылық бағыттары', 'Направления интереса', 'Areas of interest', '投资意向'),
          t(
            'Сала, өңір, көлем аралығы, модель және шешім қабылдау мерзімі.',
            'Отрасль, регион, диапазон объёма, модель и срок принятия решения.',
            'Sector, region, volume range, model and decision timeline.',
            '行业、地区、规模区间、模式和决策时限。',
          ),
        ],
        [
          t(
            'Қаржылық әлеует құжаттары',
            'Документы о финансовых возможностях',
            'Proof of financial capacity',
            '资金实力证明文件',
          ),
          t(
            'Міндетті емес, бірақ бағалау балына әсер етеді: қаржылық есептілік, қаражаттың бар екенін растау, қаржыландыру көздері.',
            'Необязательны, но влияют на балл оценки: финансовая отчётность, подтверждение наличия средств, источники финансирования.',
            'Optional, but it affects the assessment score: financial statements, proof of funds and funding sources.',
            '选填，但会影响评估得分：财务报表、资金到位证明和融资来源。',
          ),
        ],
        [
          t('Байланыс тілі', 'Язык общения', 'Contact language', '沟通语言'),
          t(
            'Қауымдастықпен хат алмасу тілі: қазақ, орыс, ағылшын немесе қытай.',
            'Язык переписки с ассоциацией: казахский, русский, английский или китайский.',
            'The language of correspondence with the Association: Kazakh, Russian, English or Chinese.',
            '与协会往来的语言：哈萨克语、俄语、英语或中文。',
          ),
        ],
        [
          t(
            'Дербес деректерге келісім',
            'Согласие на обработку персональных данных',
            'Consent to the processing of personal data',
            '个人数据处理同意',
          ),
          t(
            'Дербес деректерді жинауға және өңдеуге анық келісім. Келісім белгісі алдын ала қойылмайды.',
            'Явное согласие на сбор и обработку персональных данных. Флажок согласия заранее не установлен.',
            'Explicit consent to the collection and processing of personal data. The consent box is not ticked in advance.',
            '对收集和处理个人数据的明确同意。同意框不会预先勾选。',
          ),
        ],
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Өтініштен кейін не болады',
        'Что происходит после подачи заявки',
        'What happens after you apply',
        '提交申请之后',
      ),
      text: t(
        'Хатшылық өтініштің толықтығын тексереді, содан кейін сарапшылар 100 балдық баға қояды. Комплаенс функциясы комплаенс ветосының қажеттілігін қарайды. Нәтиже деңгей (A-D) ретінде жеке кабинетте көрінеді, ал A немесе B деңгейлі инвестор жоба бойынша NDA-ға қол қоя алады. Қадамдардың толық сипаттамасы «Инвестор жолы» бетінде.',
        'Секретариат проверяет полноту заявки, после чего эксперты выставляют 100-балльную оценку. Функция комплаенс рассматривает необходимость комплаенс-вето. Результат отображается в личном кабинете как уровень (A-D), а инвестор уровня A или B может подписать NDA по проекту. Подробное описание шагов приведено на странице «Путь инвестора».',
        'The Secretariat checks that the application is complete, and then experts give a 100-point assessment. The compliance function considers whether a compliance veto is needed. The result appears in the personal account as a level (A-D), and an investor at level A or B can sign an NDA for a project. The steps are described in full on the “Investor pathway” page.',
        '秘书处核查申请材料是否齐全，随后专家给出100分评估，合规职能判断是否需要启用合规否决权。结果以等级（A-D）形式显示在个人中心，A级或B级投资者可就项目签署NDA。各步骤的详细说明见“投资者路径”页面。',
      ),
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t(
        'Келісім және құпиялылық',
        'Согласие и конфиденциальность',
        'Consent and confidentiality',
        '同意与保密',
      ),
      text: t(
        'Форма дербес деректерді жинауға және өңдеуге анық келісімді сұрайды, ал келісім мәтінінің нұсқасы мен уақыты сақталады. Деректер ең аз көлемде жиналады: жеке сәйкестендіру нөмірлері мен төлқұжат скандары тек комплаенс кезеңінде және жабық қоймада сақталады. Өтініш беру ішкі бағаның нәтижесіне, инвестициялық табысқа немесе мемлекеттік рұқсатқа кепілдік бермейді.',
        'Форма запрашивает явное согласие на сбор и обработку персональных данных, а версия текста согласия и время его получения сохраняются. Данные собираются в минимальном объёме: индивидуальные идентификационные номера и сканы паспортов хранятся только на этапе комплаенса и в закрытом хранилище. Подача заявки не гарантирует результат внутренней оценки, инвестиционный доход или государственные разрешения.',
        'The form asks for explicit consent to the collection and processing of personal data, and the version of the consent text and the time of consent are stored. Data is collected in the minimum amount: personal identification numbers and passport scans are kept only at the compliance stage and in closed storage. Submitting an application does not guarantee the outcome of the internal assessment, investment returns or government permits.',
        '表单会明确征求您对收集和处理个人数据的同意，并保存同意文本的版本和时间。数据按最小范围收集：个人身份号码和护照扫描件仅在合规核查阶段使用，并存放于封闭存储中。提交申请不保证内部评估的结果，也不保证投资收益或政府许可。',
      ),
    },
    {
      type: 'links',
      heading: t('Құқықтық құжаттар', 'Правовые документы', 'Legal documents', '法律文件'),
      items: [
        {
          label: t('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy', '隐私政策'),
          href: '/legal/privacy',
        },
        {
          label: t(
            'Дербес деректерді өңдеуге келісім',
            'Согласие на обработку персональных данных',
            'Consent to the processing of personal data',
            '个人数据处理同意书',
          ),
          href: '/legal/consent',
        },
        {
          label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
          href: '/investors/handbook',
          text: t(
            'Процесс, NDA, деңгейлер және құпиялылық бойынша жауаптар.',
            'Ответы о процессе, NDA, уровнях и конфиденциальности.',
            'Answers on the process, NDA, levels and confidentiality.',
            '关于流程、NDA、等级与保密的解答。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t(
      'Алдымен анықтамалықпен танысыңыз',
      'Сначала ознакомьтесь со справочником',
      'Read the handbook first',
      '请先阅读投资者手册',
    ),
    text: t(
      'Процесс, NDA, деңгейлер және құпиялылық бойынша жиі қойылатын сұрақтарға жауаптар анықтамалықта жиналған.',
      'Ответы на частые вопросы о процессе, NDA, уровнях и конфиденциальности собраны в справочнике.',
      'Answers to frequently asked questions about the process, NDA, levels and confidentiality are gathered in the handbook.',
      '关于流程、NDA、等级与保密的常见问题解答，均汇集在投资者手册中。',
    ),
    label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
    href: '/investors/handbook',
  },
}

// ---------------------------------------------------------------------------
// 8. Жобалар қоры
// ---------------------------------------------------------------------------
const projects: SeedPage = {
  path: '/projects',
  section: 'projects',
  title: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
  description: t(
    'Қауымдастық тексерген инвестициялық жобалар каталогы: тек 2 және 3 деңгейлі жобалар, ашық карточкада тек жалпы деректер.',
    'Каталог проверенных ассоциацией инвестиционных проектов: только проекты уровней 2 и 3, в открытой карточке только общие данные.',
    'A catalogue of investment projects verified by the Association: only level 2 and 3 projects, with general information only on the open card.',
    '经协会审核的投资项目目录：仅展示2级和3级项目，公开卡片仅含一般性信息。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Жобалар қорына қауымдастық тексерген инвестициялық жобалар енеді. Жобаларды сала, өңір, көлем аралығы, деңгей, модель және мақсатты ел бойынша сүзуге болады. Каталог жобаның қысқаша жалпы сипатын көрсетеді, ал толық деректер NDA арқылы ашылады.',
        'В пул проектов входят инвестиционные проекты, проверенные ассоциацией. Проекты можно фильтровать по отрасли, региону, диапазону объёма, уровню, модели и целевой стране. Каталог показывает краткое общее описание проекта, а полные данные открываются через NDA.',
        'The project pool consists of investment projects verified by the Association. Projects can be filtered by sector, region, volume range, level, model and target country. The catalogue gives a brief general description of each project, while full details are opened through an NDA.',
        '项目库收录经协会审核的投资项目。项目可按行业、地区、规模区间、等级、模式和目标国别筛选。目录只展示项目的简要概况，完整资料须通过NDA开放。',
      ),
    },
    {
      type: 'cards',
      heading: t('Каталог қағидаттары', 'Принципы каталога', 'Principles of the catalogue', '目录的基本原则'),
      columns: 2,
      items: [
        {
          title: t('Тек тексерілген жобалар', 'Только проверенные проекты', 'Verified projects only', '仅限已审核项目'),
          text: t(
            'Ашық каталогқа тексеруден өткен жобалар ғана шығады. Тексерілмеген жоба 3 деңгейге жүйе деңгейінде көтерілмейді: міндетті өрістер толтырылмаса және комитет шешімі болмаса, бұл әрекет қолжетімсіз.',
            'В открытый каталог попадают только проверенные проекты. Непроверенный проект не может быть повышен до уровня 3 на уровне системы: без заполненных обязательных полей и решения комитета это действие недоступно.',
            'Only verified projects reach the open catalogue. An unverified project cannot be raised to level 3 within the system: without the mandatory fields and a committee decision this action is unavailable.',
            '只有经审核的项目才会进入公开目录。未经审核的项目无法在系统中升至3级：缺少必填项和委员会决议时，该操作不可用。',
          ),
          icon: 'shield-check',
        },
        {
          title: t('2 және 3 деңгей', 'Уровни 2 и 3', 'Levels 2 and 3', '2级与3级'),
          text: t(
            'Каталогта алдын ала бағаланған (2-деңгей) және инвестицияға дайын (3-деңгей) жобалар жарияланады. Деңгейлердің мағынасы «Жоба деңгейлері» бетінде түсіндірілген.',
            'В каталоге публикуются предварительно оценённые (уровень 2) и готовые к инвестициям (уровень 3) проекты. Смысл уровней объяснён на странице «Уровни проектов».',
            'The catalogue publishes pre-assessed (level 2) and investment-ready (level 3) projects. The meaning of the levels is explained on the “Project levels” page.',
            '目录中发布已预评估（2级）和具备投资条件（3级）的项目。各等级的含义见“项目等级”页面。',
          ),
          icon: 'layers',
          href: '/projects/levels',
        },
        {
          title: t(
            'Иесінің аты көрсетілмейді',
            'Имя владельца не указывается',
            'The owner’s name is not shown',
            '不显示项目方名称',
          ),
          text: t(
            'Ашық карточкада жоба иесінің аты көрсетілмейді. Ол NDA-дан кейін ғана ашылады.',
            'В открытой карточке имя владельца проекта не указывается. Оно раскрывается только после подписания NDA.',
            'The project owner’s name is not shown on the open card. It is disclosed only after the NDA has been signed.',
            '公开卡片上不显示项目方名称，仅在签署NDA后披露。',
          ),
          icon: 'lock',
        },
        {
          title: t('Толық деректер NDA арқылы', 'Полные данные через NDA', 'Full details through an NDA', '完整资料须经NDA'),
          text: t(
            'Жоба паспорты мен құжаттар деректер бөлмесінде су белгісімен ашылады. Оған A немесе B деңгейін алған және жоба бойынша электрондық NDA-ға қол қойған инвестор ғана қол жеткізеді.',
            'Паспорт проекта и документы открываются в дата-руме с водяным знаком. Доступ получает только инвестор уровня A или B, подписавший электронное NDA по проекту.',
            'The project passport and documents are opened in the data room with a watermark. Only an investor at level A or B who has signed the electronic NDA for the project has access.',
            '项目档案和文件在数据室中带水印开放。只有获得A级或B级并就该项目签署电子NDA的投资者才能访问。',
          ),
          icon: 'eye',
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Ашық карточкада не көрсетіледі',
        'Что показано в открытой карточке',
        'What the open card shows',
        '公开卡片显示的内容',
      ),
      text: t(
        'Ашық карточка жобамен алғаш танысуға жеткілікті жалпы деректерді береді. Онда мыналар бар:\n\n- Атауы\n- Сала мен өңір\n- Болжамды көлем және қатысу моделі\n- Деңгей\n- Қысқа сипаттама\n- Жауапты менеджер\n- «Толық деректер NDA арқылы» батырмасы\n\nКөлем болжамды болып саналады және тартылған инвестиция ретінде көрсетілмейді. Жоба иесінің аты, құпия деректер мен құжаттар ашық бөлімге шықпайды.',
        'Открытая карточка даёт общие данные, достаточные для первого знакомства с проектом. В ней указано следующее:\n\n- Название\n- Отрасль и регион\n- Ориентировочный объём и модель участия\n- Уровень\n- Краткое описание\n- Ответственный менеджер\n- Кнопка «Полные данные через NDA»\n\nОбъём является ориентировочным и не представляется как привлечённая инвестиция. Имя владельца проекта, конфиденциальные данные и документы в открытый раздел не выносятся.',
        'The open card gives enough general information for a first look at the project. It shows the following:\n\n- Name\n- Sector and region\n- Estimated volume and model of participation\n- Level\n- Brief description\n- Responsible manager\n- The “Full details through an NDA” button\n\nThe volume is an estimate and is not presented as investment attracted. The owner’s name, confidential data and documents are not placed in the open section.',
        '公开卡片提供足以初步了解项目的一般性信息。其中包括：\n\n- 项目名称\n- 行业与地区\n- 预计规模与参与模式\n- 等级\n- 简要说明\n- 负责经理\n- “完整资料须经NDA”按钮\n\n规模为预估值，不作为已吸引的投资展示。项目方名称、保密数据和文件不会出现在公开栏目中。',
      ),
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t('Ақпараттық сипат', 'Информационный характер', 'For information only', '仅供参考'),
      text: t(
        'Каталогта жобаның болуы, оның деңгейі және болжамды көлемі инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік емес. Қауымдастық мемлекеттік орган емес, ал оның ішкі бағасы ресми рейтинг емес.',
        'Наличие проекта в каталоге, его уровень и ориентировочный объём не являются гарантией инвестиционного дохода, государственных разрешений или льгот. Ассоциация не является государственным органом, а её внутренняя оценка не является официальным рейтингом.',
        'The presence of a project in the catalogue, its level and its estimated volume are not a guarantee of investment returns, government permits or incentives. The Association is not a government body, and its internal assessment is not an official rating.',
        '项目列入目录、其等级及预计规模，均不构成对投资收益、政府许可或优惠政策的保证。协会不是政府机构，其内部评估也不是官方评级。',
      ),
    },
    {
      type: 'links',
      heading: t('Келесі қадамдар', 'Следующие шаги', 'Next steps', '后续步骤'),
      items: [
        {
          label: t('Жоба деңгейлері', 'Уровни проектов', 'Project levels', '项目等级'),
          href: '/projects/levels',
          text: t('Төрт деңгей мен сегіз кезең.', 'Четыре уровня и восемь этапов.', 'Four levels and eight stages.', '四个等级与八个阶段。'),
        },
        {
          label: t('Инвестор жолы', 'Путь инвестора', 'Investor pathway', '投资者路径'),
          href: '/investors',
          text: t(
            'Жеті қадам және әр қадамға қажет құжаттар.',
            'Семь шагов и документы для каждого шага.',
            'Seven steps and the documents for each.',
            '七个步骤及各步骤所需文件。',
          ),
        },
        {
          label: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
          href: '/projects/submit',
          text: t(
            'Жоба иелеріне арналған бөлім.',
            'Раздел для владельцев проектов.',
            'The section for project owners.',
            '面向项目方的栏目。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Толық деректерге қол жеткізіңіз', 'Получите доступ к полным данным', 'Gain access to full details', '获取完整资料'),
    text: t(
      'Алдымен инвестор өтінішін беріңіз: A немесе B деңгейін алған соң жоба бойынша NDA-ға қол қойып, деректер бөлмесін ашасыз.',
      'Сначала подайте заявку инвестора: получив уровень A или B, вы сможете подписать NDA по проекту и открыть дата-рум.',
      'Submit an investor application first: once you reach level A or B you can sign an NDA for a project and open the data room.',
      '请先提交投资者申请：获得A级或B级后，即可就项目签署NDA并进入数据室。',
    ),
    label: t('Инвестор өтініші', 'Заявка инвестора', 'Investor application', '投资者申请'),
    href: '/investors/apply',
  },
}

// ---------------------------------------------------------------------------
// 9. Жоба деңгейлері
// ---------------------------------------------------------------------------
const projectsLevels: SeedPage = {
  path: '/projects/levels',
  section: 'projects',
  title: t('Жоба деңгейлері', 'Уровни проектов', 'Project levels', '项目等级'),
  description: t(
    'Жобаның төрт дайындық деңгейі мен сегіз кезеңдік циклі: ашық каталогқа шығу шарттары және кезеңнен кезеңге өту талаптары.',
    'Четыре уровня готовности проекта и восьмиэтапный цикл: условия попадания в открытый каталог и требования для перехода между этапами.',
    'The four project readiness levels and the eight-stage cycle: conditions for appearing in the open catalogue and requirements for moving between stages.',
    '项目成熟度的四个等级与八个阶段的流程：进入公开目录的条件及阶段间转换的要求。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Әр жоба дайындығына қарай төрт деңгейдің бірінде тұрады және жұмыс барысында сегіз кезеңнен өтеді. Деңгей жобаның қаншалықты дайын екенін және ашық каталогқа шығатынын көрсетеді, ал кезең жобамен қазір қандай жұмыс жүріп жатқанын білдіреді. Тексерілмеген жоба 3 деңгейге жүйе деңгейінде көтерілмейді: міндетті өрістер мен комитет шешімі болмаса, тиісті батырма белсенді емес.',
        'Каждый проект в зависимости от готовности находится на одном из четырёх уровней и в ходе работы проходит восемь этапов. Уровень показывает, насколько проект готов и попадает ли он в открытый каталог, а этап обозначает, какая работа ведётся с проектом в настоящий момент. Непроверенный проект не может быть повышен до уровня 3 на уровне системы: без обязательных полей и решения комитета соответствующая кнопка неактивна.',
        'Depending on its readiness, every project sits at one of four levels and, as work proceeds, passes through eight stages. The level shows how ready a project is and whether it appears in the open catalogue, while the stage shows what work is currently under way. An unverified project cannot be raised to level 3 within the system: without the mandatory fields and a committee decision, the button is inactive.',
        '每个项目按其成熟度处于四个等级之一，并在推进过程中经历八个阶段。等级表明项目的成熟程度及能否进入公开目录，阶段则表明项目当前开展的工作。未经审核的项目无法在系统中升至3级：缺少必填项和委员会决议时，相应按钮不可用。',
      ),
    },
    {
      type: 'table',
      heading: t('Төрт деңгей', 'Четыре уровня', 'Four levels', '四个等级'),
      caption: t(
        'Жоба деңгейлері және ашық каталогқа шығу шарттары',
        'Уровни проектов и условия попадания в открытый каталог',
        'Project levels and conditions for the open catalogue',
        '项目等级及进入公开目录的条件',
      ),
      columns: [
        t('Деңгей', 'Уровень', 'Level', '等级'),
        t('Атауы', 'Название', 'Name', '名称'),
        t('Ашық каталогта', 'В открытом каталоге', 'In the open catalogue', '公开目录'),
        t('Кіру шарты', 'Условие присвоения', 'Entry condition', '进入条件'),
      ],
      rows: [
        [
          t('1-деңгей', 'Уровень 1', 'Level 1', '1级'),
          t('Тұжырымдама', 'Концепция', 'Concept', '概念'),
          t('Жоқ', 'Нет', 'No', '否'),
          t(
            'Иесі, орны, мақсаты жазылған',
            'Указаны владелец, место и цель',
            'Owner, location and purpose are recorded',
            '已记录项目方、地点和目的',
          ),
        ],
        [
          t('2-деңгей', 'Уровень 2', 'Level 2', '2级'),
          t('Алдын ала бағаланған', 'Предварительно оценён', 'Pre-assessed', '已预评估'),
          t('Иә (жинақталған түрде)', 'Да (в сводном виде)', 'Yes (in summary form)', '是（汇总展示）'),
          t(
            'Құжаттар, жер мәртебесі, бастапқы тәуекелдер тексерілді',
            'Проверены документы, статус земли, первичные риски',
            'Documents, land status and initial risks have been checked',
            '已核查文件、土地状态和初步风险',
          ),
        ],
        [
          t('3-деңгей', 'Уровень 3', 'Level 3', '3级'),
          t('Инвестицияға дайын', 'Готов к инвестициям', 'Investment-ready', '具备投资条件'),
          t('Иә', 'Да', 'Yes', '是'),
          t(
            'Комитет бекітті, паспорт пен алдын ала ТЭН дайын',
            'Комитет утвердил, паспорт и предварительное ТЭО готовы',
            'Approved by the committee; the passport and preliminary feasibility study are ready',
            '委员会已批准，项目档案和初步可行性研究已就绪',
          ),
        ],
        [
          t('4-деңгей', 'Уровень 4', 'Level 4', '4级'),
          t('Іске асырылуда', 'В реализации', 'In implementation', '实施中'),
          t('Иә (нәтиже ретінде)', 'Да (как результат)', 'Yes (as a result)', '是（作为成果）'),
          t(
            'Қаражаттың түсуі құжатпен расталды',
            'Поступление средств подтверждено документом',
            'Receipt of funds is confirmed by a document',
            '资金到位已有文件证明',
          ),
        ],
      ],
    },
    {
      type: 'steps',
      heading: t('Сегіз кезеңдік цикл', 'Восьмиэтапный цикл', 'The eight-stage cycle', '八个阶段的流程'),
      lead: t(
        'Әр кезеңде не тіркелетіні және келесі кезеңге өту шарты көрсетілген.',
        'Для каждого этапа указано, что фиксируется и каково условие перехода к следующему.',
        'For each stage we state what is recorded and the condition for moving to the next stage.',
        '每个阶段均说明记录的内容及进入下一阶段的条件。',
      ),
      items: [
        {
          title: t('Жобаны қабылдау', 'Приём проекта', 'Project intake', '项目受理'),
          text: t(
            'Тіркеледі: иесі, мақсаты, орны, қажеттілігі.',
            'Фиксируются: владелец, цель, место, потребность.',
            'Recorded: owner, purpose, location, need.',
            '记录内容：项目方、目的、地点、需求。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: міндетті өрістер толтырылды.',
            'Условие перехода к следующему этапу: обязательные поля заполнены.',
            'Condition for the next stage: the mandatory fields are completed.',
            '进入下一阶段的条件：必填项已填写。',
          ),
        },
        {
          title: t('Бастапқы іріктеу', 'Первичный отбор', 'Initial screening', '初步筛选'),
          text: t(
            'Тіркеледі: шынайылығы, жер, рұқсаттар, инфрақұрылым.',
            'Фиксируются: достоверность, земля, разрешения, инфраструктура.',
            'Recorded: authenticity, land, permits, infrastructure.',
            '记录内容：真实性、土地、许可、基础设施。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: хатшылық чек-листі бекітілді.',
            'Условие перехода к следующему этапу: утверждён чек-лист секретариата.',
            'Condition for the next stage: the Secretariat’s checklist is approved.',
            '进入下一阶段的条件：秘书处核查清单已通过。',
          ),
        },
        {
          title: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
          text: t(
            'Тіркеледі: қаржы, құқық, техника, нарық және экология қорытындылары.',
            'Фиксируются: заключения по финансам, праву, технике, рынку и экологии.',
            'Recorded: finance, legal, technical, market and environmental findings.',
            '记录内容：财务、法律、技术、市场和环境方面的结论。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: комитет шешімі.',
            'Условие перехода к следующему этапу: решение комитета.',
            'Condition for the next stage: a committee decision.',
            '进入下一阶段的条件：委员会决议。',
          ),
        },
        {
          title: t('Инвесторды сәйкестендіру', 'Подбор инвестора', 'Investor matching', '投资者匹配'),
          text: t(
            'Тіркеледі: ұсынылған инвесторлар тізімі.',
            'Фиксируется: список предложенных инвесторов.',
            'Recorded: the list of proposed investors.',
            '记录内容：推荐的投资者名单。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: кемінде бір инвестор қызығушылық білдірді.',
            'Условие перехода к следующему этапу: хотя бы один инвестор выразил заинтересованность.',
            'Condition for the next stage: at least one investor has expressed interest.',
            '进入下一阶段的条件：至少一位投资者表示有意向。',
          ),
        },
        {
          title: t('Келіссөздер', 'Переговоры', 'Negotiations', '谈判'),
          text: t(
            'Тіркеледі: NDA, кездесулер, сапарлар, шарттар жобасы.',
            'Фиксируются: NDA, встречи, визиты, проект условий.',
            'Recorded: the NDA, meetings, visits, draft terms.',
            '记录内容：NDA、会议、考察、条款草案。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: ниет хаттамасы немесе терм-шит.',
            'Условие перехода к следующему этапу: протокол о намерениях или терм-шит.',
            'Condition for the next stage: a protocol of intent or a term sheet.',
            '进入下一阶段的条件：意向备忘录或条款清单。',
          ),
        },
        {
          title: t('Құрылым және келісу', 'Структура и согласование', 'Structuring and agreement', '结构设计与签约'),
          text: t(
            'Тіркеледі: қаржыландыру моделі, келісімдер, өтініштер.',
            'Фиксируются: модель финансирования, соглашения, заявки.',
            'Recorded: the financing model, agreements, applications.',
            '记录内容：融资模式、协议、申请文件。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: ресми шартқа қол қойылды.',
            'Условие перехода к следующему этапу: подписан официальный договор.',
            'Condition for the next stage: the formal contract is signed.',
            '进入下一阶段的条件：正式合同已签署。',
          ),
        },
        {
          title: t('Іске асыру мониторингі', 'Мониторинг реализации', 'Implementation monitoring', '实施监测'),
          text: t(
            'Тіркеледі: қаражаттың түсуі, құрылыс, жабдық, жалдау.',
            'Фиксируются: поступление средств, строительство, оборудование, аренда.',
            'Recorded: receipt of funds, construction, equipment, leasing.',
            '记录内容：资金到位、施工、设备、租赁。',
          ),
          meta: t(
            'Келесі кезеңге өту шарты: сынақтан кейін өндіріс басталды.',
            'Условие перехода к следующему этапу: после пробного запуска начато производство.',
            'Condition for the next stage: production has started after the trial run.',
            '进入下一阶段的条件：试运行后已投产。',
          ),
        },
        {
          title: t('Нәтижені бағалау', 'Оценка результата', 'Results assessment', '成果评估'),
          text: t(
            'Тіркеледі: нақты инвестиция, қуат, жұмыс орны, салық, жергілікті сатып алу.',
            'Фиксируются: фактические инвестиции, мощность, рабочие места, налоги, локальные закупки.',
            'Recorded: actual investment, capacity, jobs, taxes, local procurement.',
            '记录内容：实际投资、产能、就业、税收、本地采购。',
          ),
          meta: t(
            'Аяқталуы: жылдық есепке енеді.',
            'Завершение: включается в годовой отчёт.',
            'Completion: included in the annual report.',
            '完成标志：纳入年度报告。',
          ),
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Электрондық мұрағат пен бақылау',
        'Электронный архив и контроль',
        'Electronic archive and monitoring',
        '电子档案与跟踪',
      ),
      text: t(
        'Әр басым жобаның электрондық мұрағаты болады: жауапты тұлға, мерзімдер, тәуекелдер тізілімі, келесі әрекет, құжаттар және өзгерістер тарихы. Мерзімі өткен қадам туралы жауапты тұлғаға ескертпе жіберіледі.',
        'У каждого приоритетного проекта есть электронный архив: ответственное лицо, сроки, реестр рисков, следующее действие, документы и история изменений. Об истёкшем сроке шага ответственному лицу направляется уведомление.',
        'Every priority project has an electronic archive: a responsible person, deadlines, a risk register, the next action, documents and the history of changes. A notification goes to the responsible person when a step is overdue.',
        '每个重点项目都有电子档案：责任人、时间节点、风险台账、下一步行动、文件和变更记录。某一步骤逾期时，系统会向责任人发出提醒。',
      ),
    },
    {
      type: 'links',
      heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
      items: [
        {
          label: t('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
          href: '/projects',
          text: t('Тексерілген жобалар каталогы.', 'Каталог проверенных проектов.', 'The catalogue of verified projects.', '经审核的项目目录。'),
        },
        {
          label: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
          href: '/projects/submit',
          text: t(
            'Жоба иелеріне арналған бөлім.',
            'Раздел для владельцев проектов.',
            'The section for project owners.',
            '面向项目方的栏目。',
          ),
        },
        {
          label: t('Инвестор анықтамалығы', 'Справочник инвестора', 'Investor handbook', '投资者手册'),
          href: '/investors/handbook',
          text: t(
            'Жиі қойылатын сұрақтарға жауаптар.',
            'Ответы на частые вопросы.',
            'Answers to frequently asked questions.',
            '常见问题解答。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Жобаңызды ұсыныңыз', 'Предложите свой проект', 'Submit your project', '提交您的项目'),
    text: t(
      'Бірінші кезең жоба иесі, орны, мақсаты және қажеттілігі көрсетілген өтінішпен басталады.',
      'Первый этап начинается с заявки, в которой указаны владелец, место, цель и потребность проекта.',
      'The first stage begins with an application that states the project’s owner, location, purpose and need.',
      '第一阶段始于一份说明项目方、地点、目的和需求的申请。',
    ),
    label: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
    href: '/projects/submit',
  },
}

// ---------------------------------------------------------------------------
// 10. Жобаны ұсыну
// ---------------------------------------------------------------------------
const projectsSubmit: SeedPage = {
  path: '/projects/submit',
  section: 'projects',
  title: t('Жобаны ұсыну', 'Предложить проект', 'Submit a project', '提交项目'),
  description: t(
    'Жоба иелеріне арналған бөлім: жобаны бірыңғай форматпен ұсыну, қажетті ақпарат, құпиялылық шарттары және жеке кабинет.',
    'Раздел для владельцев проектов: подача проекта в едином формате, необходимые сведения, условия конфиденциальности и личный кабинет.',
    'A section for project owners: submitting a project in a single format, the information required, confidentiality terms and the personal account.',
    '面向项目方：以统一格式提交项目、所需信息、保密条款和个人中心。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Жобаны оның иесі ұсына алады: Қазақстанда жобаны іске асыруға жауапты және оған инвестор іздеп отырған қазақстандық ұйым немесе тұлға. Жоба бірыңғай форматпен, онлайн формамен ұсынылады.\n\nҚауымдастық жобаның шынайылығын тексереді, сараптама ұйымдастырады және сәйкес инвесторларды ұсынады. Жоба ашық каталогқа тек иесінің келісімімен және 2 немесе 3 деңгейге жеткенде шығады.',
        'Проект может предложить его владелец: казахстанская организация или лицо, отвечающее за реализацию проекта в Казахстане и ищущее для него инвестора. Проект подаётся в едином формате через онлайн-форму.\n\nАссоциация проверяет достоверность проекта, организует экспертизу и предлагает подходящих инвесторов. В открытый каталог проект попадает только с согласия владельца и по достижении уровня 2 или 3.',
        'A project can be submitted by its owner: a Kazakhstani organisation or person responsible for implementing the project in Kazakhstan and looking for an investor. The project is submitted in a single format through an online form.\n\nThe Association checks the project’s authenticity, arranges an expert review and proposes suitable investors. A project reaches the open catalogue only with the owner’s consent and once it has reached level 2 or 3.',
        '项目由其所有者提交：即负责在哈萨克斯坦实施项目并为其寻找投资者的哈萨克斯坦组织或个人。项目通过在线表单，以统一格式提交。\n\n协会核实项目的真实性，组织专家评审，并推荐合适的投资者。项目仅在获得所有者同意并达到2级或3级后，才会进入公开目录。',
      ),
    },
    {
      type: 'steps',
      heading: t(
        'Жобаны ұсыну қадамдары',
        'Шаги подачи проекта',
        'Steps for submitting a project',
        '提交项目的步骤',
      ),
      items: [
        {
          title: t(
            'Жеке кабинет ашу',
            'Открытие личного кабинета',
            'Open a personal account',
            '开通个人中心',
          ),
          text: t(
            'Электрондық пошта мен құпия сөз арқылы тіркеліп, жоба иесі ретінде жеке кабинетке кіресіз.',
            'Вы регистрируетесь по электронной почте и паролю и входите в личный кабинет владельца проекта.',
            'Register with an email address and password and sign in to the project owner’s personal account.',
            '使用电子邮箱和密码注册，并以项目方身份登录个人中心。',
          ),
        },
        {
          title: t('Жобаны толтыру', 'Заполнение проекта', 'Complete the project form', '填写项目信息'),
          text: t(
            'Көп қадамды формада жоба иесі, орны, мақсаты және қажеттілігі көрсетіледі. Жобалама автоматты түрде сақталады, сондықтан толтыруды кейін жалғастыруға болады.',
            'В многошаговой форме указываются владелец, место, цель и потребность проекта. Черновик сохраняется автоматически, поэтому заполнение можно продолжить позже.',
            'The multi-step form asks for the project’s owner, location, purpose and need. A draft is saved automatically, so you can continue later.',
            '在多步骤表单中填写项目方、地点、目的和需求。草稿会自动保存，您可以稍后继续填写。',
          ),
        },
        {
          title: t('Құжаттарды жүктеу', 'Загрузка документов', 'Upload documents', '上传文件'),
          text: t(
            'Жобаны растайтын құжаттар жүктеледі. Файлдардың түрі мен өлшемі тексеріледі, олар жабық қоймада сақталады.',
            'Загружаются документы, подтверждающие проект. Тип и размер файлов проверяются, файлы хранятся в закрытом хранилище.',
            'Documents that support the project are uploaded. The type and size of files are checked, and files are kept in closed storage.',
            '上传证明项目情况的文件。系统会检查文件的类型和大小，文件存放于封闭存储中。',
          ),
        },
        {
          title: t('Бастапқы іріктеу', 'Первичный отбор', 'Initial screening', '初步筛选'),
          text: t(
            'Хатшылық жобаның шынайылығын, жер мәртебесін, рұқсаттар мен инфрақұрылымды тексереді.',
            'Секретариат проверяет достоверность проекта, статус земли, разрешения и инфраструктуру.',
            'The Secretariat checks the project’s authenticity, land status, permits and infrastructure.',
            '秘书处核查项目的真实性、土地状态、许可和基础设施。',
          ),
        },
        {
          title: t('Сараптама', 'Экспертиза', 'Expert review', '专家评审'),
          text: t(
            'Қаржы, құқық, техника, нарық және экология бойынша қорытындылар дайындалады, содан кейін комитет шешім қабылдайды.',
            'Готовятся заключения по финансам, праву, технике, рынку и экологии, после чего комитет принимает решение.',
            'Findings on finance, legal, technical, market and environmental matters are prepared, after which the committee takes a decision.',
            '就财务、法律、技术、市场和环境出具结论，随后由委员会作出决议。',
          ),
        },
        {
          title: t('Нәтиже және инвесторлар', 'Результат и инвесторы', 'Outcome and investors', '结果与投资者'),
          text: t(
            'Сараптама кезеңі мен ескертулер жеке кабинетте көрінеді, қосымша сұраныстарға сол жерде жауап бересіз. Иесінің келісімімен жоба ашық каталогқа шығады, ал қызығушылық білдірген инвесторлардың саны атаусыз көрсетіледі.',
            'Этап экспертизы и замечания видны в личном кабинете, на дополнительные запросы вы отвечаете там же. С согласия владельца проект попадает в открытый каталог, а число заинтересовавшихся инвесторов отображается без указания имён.',
            'The review stage and comments appear in the personal account, where you also reply to further requests. With the owner’s consent the project is placed in the open catalogue, and the number of interested investors is shown without names.',
            '评审阶段和意见会显示在个人中心，您也在那里答复补充问询。经所有者同意，项目进入公开目录，对项目感兴趣的投资者人数以匿名方式显示。',
          ),
        },
      ],
    },
    {
      type: 'facts',
      heading: t('Қажетті ақпарат', 'Необходимая информация', 'Information required', '所需信息'),
      items: [
        {
          label: t('Иесі', 'Владелец', 'Owner', '项目方'),
          value: t(
            'Жобаға иелік ететін ұйымның немесе тұлғаның деректері.',
            'Данные организации или лица, которому принадлежит проект.',
            'Details of the organisation or person that owns the project.',
            '拥有该项目的组织或个人的信息。',
          ),
        },
        {
          label: t('Орны', 'Место', 'Location', '地点'),
          value: t(
            'Жоба іске асырылатын өңір және нақты орналасуы.',
            'Регион реализации проекта и его точное расположение.',
            'The region where the project will be carried out and its exact location.',
            '项目实施所在的地区及具体位置。',
          ),
        },
        {
          label: t('Мақсаты', 'Цель', 'Purpose', '目的'),
          value: t(
            'Не салынады немесе іске асырылады және қандай нәтиже күтіледі.',
            'Что будет построено или реализовано и какой результат ожидается.',
            'What will be built or delivered and what result is expected.',
            '将建设或实施什么，以及预期成果。',
          ),
        },
        {
          label: t('Қажеттілігі', 'Потребность', 'Need', '需求'),
          value: t(
            'Жобаға қандай инвестиция және қандай қатысу моделі қажет.',
            'Какие инвестиции и какая модель участия нужны проекту.',
            'What investment and which model of participation the project needs.',
            '项目需要何种投资以及何种参与模式。',
          ),
        },
        {
          label: t('Құжаттар', 'Документы', 'Documents', '文件'),
          value: t(
            'Жер мәртебесі, рұқсаттар, бар болса алдын ала ТЭН және жобаны растайтын басқа материалдар.',
            'Статус земли, разрешения, при наличии предварительное ТЭО и другие материалы, подтверждающие проект.',
            'Land status, permits and, if available, a preliminary feasibility study and other materials supporting the project.',
            '土地状态、许可，以及（如有）初步可行性研究和其他证明项目情况的材料。',
          ),
        },
      ],
    },
    {
      type: 'notice',
      tone: 'info',
      title: t('Құпиялылық', 'Конфиденциальность', 'Confidentiality', '保密'),
      text: t(
        'Жеберушінің келісімінсіз құпия деректер ашық бөлімге шықпайды. Жоба иесінің аты NDA-ға дейін көрсетілмейді, ал инвестордың аты NDA мен екі жақтың келісімінен кейін ғана ашылады. Қызығушылық білдірген инвесторлардың саны жеке кабинетте атаусыз көрінеді.',
        'Без согласия отправителя конфиденциальные данные в открытый раздел не выносятся. Имя владельца проекта не указывается до NDA, а имя инвестора раскрывается только после NDA и согласия обеих сторон. Число заинтересовавшихся инвесторов видно в личном кабинете без имён.',
        'Without the sender’s consent, confidential data is not placed in the open section. The project owner’s name is not shown before the NDA, and the investor’s name is disclosed only after the NDA and with the consent of both parties. The number of interested investors is visible in the personal account without names.',
        '未经提交人同意，保密数据不会出现在公开栏目中。签署NDA之前不显示项目方名称，投资者名称须在NDA签署且双方同意后才披露。对项目感兴趣的投资者人数在个人中心以匿名方式显示。',
      ),
    },
    {
      type: 'paragraphs',
      heading: t('Жеке кабинет', 'Личный кабинет', 'Personal account', '个人中心'),
      text: t(
        'Жоба иесінің кабинетінде жобаны жасау (жобама ретінде сақтау), құжаттарды жүктеу, сараптама кезеңі мен ескертулерді көру және қосымша сұраныстарға жауап беру бөлімдері бар. Бір аккаунтта бірнеше рөл болуы мүмкін: мысалы, мүше әрі жоба иесі.',
        'В кабинете владельца проекта есть разделы для создания проекта (с сохранением черновика), загрузки документов, просмотра этапа экспертизы и замечаний, а также ответов на дополнительные запросы. В одном аккаунте могут сочетаться несколько ролей: например, член ассоциации и владелец проекта.',
        'The project owner’s account has sections for creating a project (saved as a draft), uploading documents, viewing the review stage and comments, and replying to further requests. One account can hold several roles, for example a member and a project owner.',
        '项目方的个人中心包含以下功能：创建项目（可保存草稿）、上传文件、查看评审阶段与意见，以及答复补充问询。同一账号可兼有多种角色，例如会员兼项目方。',
      ),
    },
  ],
  cta: {
    title: t('Жеке кабинет ашыңыз', 'Откройте личный кабинет', 'Open your personal account', '开通个人中心'),
    text: t(
      'Жобаңызды ұсыну жеке кабинеттен басталады.',
      'Подача проекта начинается с личного кабинета.',
      'Submitting a project begins in the personal account.',
      '提交项目从个人中心开始。',
    ),
    label: t('Жеке кабинетке өту', 'Перейти в личный кабинет', 'Go to the personal account', '进入个人中心'),
    href: '/account',
  },
}

// ---------------------------------------------------------------------------
// 11. Мүшелік
// ---------------------------------------------------------------------------
const membership: SeedPage = {
  path: '/membership',
  section: 'membership',
  title: t('Мүшелік', 'Членство', 'Membership', '会员'),
  description: t(
    'Қауымдастық мүшелігінің бес санаты: кімдерге арналған, негізгі қызметтер, жарна және қабылдау рәсімі.',
    'Пять категорий членства в ассоциации: для кого предназначены, основные услуги, взнос и порядок приёма.',
    'The five membership categories of the Association: who they are for, the main services, the fee and the admission procedure.',
    '协会会员的五个类别：适用对象、主要服务、会费与入会程序。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Қауымдастық мүшелігі бес санатқа бөлінеді. Мүшелер салалық желіге, мүдделерін білдіруге, мәселелерін мемлекетке жеткізуге, іс-шараларға және цифрлық қызметтерге қолжетімділік алады. Мүшелік жарнасы мен жобалық қызмет ақысы бөлек есепке алынады және ашық жарияланады.',
        'Членство в ассоциации делится на пять категорий. Члены получают доступ к отраслевой сети, мероприятиям и цифровым сервисам, а также возможность представлять свои интересы и передавать вопросы государству. Членский взнос и плата за проектные услуги учитываются раздельно и публикуются открыто.',
        'Membership of the Association is divided into five categories. Members gain access to an industry network, representation of their interests, a channel for raising issues with the state, events and digital services. The membership fee and project service fees are accounted for separately and published openly.',
        '协会会员分为五个类别。会员可享有行业网络、利益代表、向政府反映诉求的渠道、活动以及数字化服务。会费与项目服务费分别核算，并公开披露。',
      ),
    },
    {
      type: 'cards',
      heading: t('Мүшелік санаттары', 'Категории членства', 'Membership categories', '会员类别'),
      columns: 3,
      items: [
        {
          title: t(
            'Шетелдік инвестор компаниялар',
            'Иностранные инвесторские компании',
            'Foreign investor companies',
            '外国投资企业',
          ),
          text: t(
            'Кімдерге арналған: Қазақстанда инвестиция салуды қарастыратын немесе жүзеге асырып жатқан шетелдік компаниялар. Негізгі қызметтер: салалық желі, іс-шаралар, инвестор мәселелерін мемлекетке жеткізу.',
            'Для кого: иностранные компании, которые рассматривают или осуществляют инвестиции в Казахстане. Основные услуги: отраслевая сеть, мероприятия, передача вопросов инвесторов государству.',
            'Who it is for: foreign companies considering or making investments in Kazakhstan. Main services: the industry network, events and raising investors’ issues with the state.',
            '适用对象：考虑或正在哈萨克斯坦投资的外国公司。主要服务：行业网络、活动，以及向政府反映投资者诉求。',
          ),
          icon: 'globe',
        },
        {
          title: t(
            'Халықаралық инвестициялық институттар',
            'Международные инвестиционные институты',
            'International investment institutions',
            '国际投资机构',
          ),
          text: t(
            'Кімдерге арналған: Қазақстанмен жұмыс істейтін халықаралық инвестициялық институттар мен олардың өкілдіктері. Негізгі қызметтер: салалық желі, мүдделерді білдіру, іс-шаралар.',
            'Для кого: международные инвестиционные институты и их представительства, работающие с Казахстаном. Основные услуги: отраслевая сеть, представление интересов, мероприятия.',
            'Who it is for: international investment institutions and their offices that work with Kazakhstan. Main services: the industry network, representation of interests and events.',
            '适用对象：与哈萨克斯坦开展合作的国际投资机构及其代表处。主要服务：行业网络、利益代表和活动。',
          ),
          icon: 'columns',
        },
        {
          title: t(
            'Отандық өнеркәсіп компаниялары',
            'Отечественные промышленные компании',
            'Domestic industrial companies',
            '本土工业企业',
          ),
          text: t(
            'Кімдерге арналған: серіктес немесе инвестор іздейтін қазақстандық өнеркәсіп кәсіпорындары. Негізгі қызметтер: мүдделерді білдіру, мәселелерді мемлекетке жеткізу, іс-шаралар, салалық желі.',
            'Для кого: казахстанские промышленные предприятия, ищущие партнёра или инвестора. Основные услуги: представление интересов, передача вопросов государству, мероприятия, отраслевая сеть.',
            'Who it is for: Kazakhstani industrial enterprises looking for a partner or investor. Main services: representation of interests, raising issues with the state, events and the industry network.',
            '适用对象：寻找合作伙伴或投资者的哈萨克斯坦工业企业。主要服务：利益代表、向政府反映诉求、活动和行业网络。',
          ),
          icon: 'factory',
        },
        {
          title: t(
            'Кәсіби қызмет көрсетушілер',
            'Поставщики профессиональных услуг',
            'Professional service providers',
            '专业服务机构',
          ),
          text: t(
            'Кімдерге арналған: тіркеу, құқық, салық, логистика және кадр мәселелері бойынша қызмет көрсететін ұйымдар. Негізгі қызметтер: салалық желі, іс-шаралар, инвесторлармен және жоба иелерімен кәсіби байланыс.',
            'Для кого: организации, оказывающие услуги по регистрации, праву, налогам, логистике и кадрам. Основные услуги: отраслевая сеть, мероприятия, профессиональные контакты с инвесторами и владельцами проектов.',
            'Who it is for: organisations providing registration, legal, tax, logistics and staffing services. Main services: the industry network, events and professional contact with investors and project owners.',
            '适用对象：提供注册、法律、税务、物流和人力服务的机构。主要服务：行业网络、活动，以及与投资者和项目方的专业对接。',
          ),
          icon: 'compass',
        },
        {
          title: t('Стратегиялық серіктестер', 'Стратегические партнёры', 'Strategic partners', '战略合作伙伴'),
          text: t(
            'Кімдерге арналған: қауымдастықпен ұзақ мерзімді бірлескен жұмыс жүргізетін ұйымдар. Негізгі қызметтер: бірлескен бастамалар, іс-шаралар, мүдделерді білдіру. Серіктестің аты мен логотипі тек жазбаша келісіммен жарияланады.',
            'Для кого: организации, ведущие с ассоциацией долгосрочную совместную работу. Основные услуги: совместные инициативы, мероприятия, представление интересов. Название и логотип партнёра публикуются только с письменного согласия.',
            'Who it is for: organisations that work with the Association on a long-term basis. Main services: joint initiatives, events and representation of interests. A partner’s name and logo are published only with written consent.',
            '适用对象：与协会开展长期合作的组织。主要服务：联合倡议、活动和利益代表。合作伙伴的名称和标志仅在取得书面同意后发布。',
          ),
          icon: 'layers',
        },
      ],
    },
    {
      type: 'facts',
      heading: t(
        'Барлық санатқа ортақ шарттар',
        'Общие условия для всех категорий',
        'Terms common to all categories',
        '各类别通用条款',
      ),
      items: [
        {
          label: t('Жарна', 'Взнос', 'Fee', '会费'),
          value: t(
            'Әр санат бойынша мөлшері Басқарма бекіткеннен кейін осы бетте ашық жарияланады.',
            'Размер по каждой категории будет открыто опубликован на этой странице после утверждения Правлением.',
            'The amount for each category will be published openly on this page once approved by the Board.',
            '各类别的会费金额经理事会批准后，将在本页公开。',
          ),
        },
        {
          label: t('Қабылдау рәсімі', 'Порядок приёма', 'Admission procedure', '入会程序'),
          value: t(
            'Өтініш беру, хатшылықтың тексеруі, мүшелік мәртебесін беру. Толық жолы «Мүшелікке өтініш» бетінде.',
            'Подача заявки, проверка секретариатом, присвоение статуса члена. Полный порядок описан на странице «Заявка на членство».',
            'Submission of an application, checking by the Secretariat and granting of member status. The full procedure is on the “Apply for membership” page.',
            '提交申请、秘书处审核、授予会员身份。完整程序见“申请入会”页面。',
          ),
        },
        {
          label: t('Мүшелік мәртебелері', 'Статусы членства', 'Membership statuses', '会员状态'),
          value: t(
            'Өтініш, тексеру, белсенді, тоқтатылған, аяқталған.',
            'Заявка, проверка, активный, приостановлен, завершён.',
            'Application, review, active, suspended, ended.',
            '申请、审核、有效、暂停、终止。',
          ),
        },
        {
          label: t('Жеке кабинет', 'Личный кабинет', 'Personal account', '个人中心'),
          value: t(
            'Мүшелік мәртебесі, санаты мен мерзімі, жарна шоттары мен актілер, іс-шараға тіркелу.',
            'Статус, категория и срок членства, счета на взнос и акты, регистрация на мероприятия.',
            'Membership status, category and term, fee invoices and statements, and registration for events.',
            '会员状态、类别和期限、会费账单与结算单，以及活动报名。',
          ),
        },
        {
          label: t('Мүшелер тізілімі', 'Реестр членов', 'Member registry', '会员名录'),
          value: t(
            'Мүшенің аты тізілімде тек жазбаша келісім бойынша көрсетіледі.',
            'Название члена указывается в реестре только по письменному согласию.',
            'A member is named in the registry only with written consent.',
            '会员名称仅在取得书面同意后列入名录。',
          ),
        },
      ],
    },
    membershipGuaranteeNotice,
    feeSeparateNotice,
  ],
  cta: {
    title: t(
      'Қауымдастыққа мүше болыңыз',
      'Станьте членом ассоциации',
      'Become a member of the Association',
      '加入协会成为会员',
    ),
    text: t(
      'Санатыңызды таңдап, мүшелікке онлайн өтініш беріңіз.',
      'Выберите свою категорию и подайте заявку на членство онлайн.',
      'Choose your category and apply for membership online.',
      '选择您的类别，在线申请入会。',
    ),
    label: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
    href: '/membership/apply',
  },
}

// ---------------------------------------------------------------------------
// 12. Артықшылықтар
// ---------------------------------------------------------------------------
const membershipBenefits: SeedPage = {
  path: '/membership/benefits',
  section: 'membership',
  title: t('Артықшылықтар', 'Преимущества', 'Benefits', '会员权益'),
  description: t(
    'Мүшелердің мүмкіндіктері: салалық желі, мүдделерді білдіру, мәселені мемлекетке жеткізу, іс-шаралар, цифрлық қызметтер және жеке кабинет.',
    'Возможности членов ассоциации: отраслевая сеть, представление интересов, передача вопросов государству, мероприятия, цифровые сервисы и личный кабинет.',
    'What members gain: an industry network, representation of interests, a channel to the state, events, digital services and a personal account.',
    '会员的权益：行业网络、利益代表、向政府反映诉求的渠道、活动、数字化服务和个人中心。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Мүшелік қауымдастықтың салалық желісіне және мемлекетпен сындарлы диалог алаңына жол ашады. Мүшелерге қолжетімді негізгі мүмкіндіктер төменде берілген.',
        'Членство открывает доступ к отраслевой сети ассоциации и к площадке для конструктивного диалога с государством. Основные возможности, доступные членам, перечислены ниже.',
        'Membership opens access to the Association’s industry network and to a platform for constructive dialogue with the state. The main opportunities available to members are set out below.',
        '会员资格为您打开协会的行业网络，并提供与政府开展建设性对话的平台。会员可享有的主要权益如下。',
      ),
    },
    {
      type: 'cards',
      heading: t('Мүшелердің мүмкіндіктері', 'Возможности членов', 'Opportunities for members', '会员权益一览'),
      columns: 3,
      items: [
        {
          title: t('Салалық желі', 'Отраслевая сеть', 'Industry network', '行业网络'),
          text: t(
            'Мүшелер өзара және қауымдастықтың халықаралық байланыстарымен кәсіби желіде кездеседі. Желіге шетелдік инвесторлар, қазақстандық өнеркәсіп компаниялары және кәсіби қызмет көрсетушілер кіреді.',
            'Члены общаются между собой и с международными контактами ассоциации в профессиональной сети. В неё входят иностранные инвесторы, казахстанские промышленные компании и поставщики профессиональных услуг.',
            'Members network with one another and with the Association’s international contacts. The network includes foreign investors, Kazakhstani industrial companies and professional service providers.',
            '会员在专业网络中相互交流，并接触协会的国际联系人。网络成员包括外国投资者、哈萨克斯坦工业企业和专业服务机构。',
          ),
          icon: 'globe',
        },
        {
          title: t('Мүдделерді білдіру', 'Представление интересов', 'Representation of interests', '利益代表'),
          text: t(
            'Қауымдастық мүшелердің ортақ мүдделерін мемлекеттік институттармен сындарлы диалогта білдіреді. Қауымдастық мемлекеттік орган емес және мемлекеттік органдардың атынан әрекет етпейді.',
            'Ассоциация представляет общие интересы членов в конструктивном диалоге с государственными институтами. Ассоциация не является государственным органом и не действует от имени государственных органов.',
            'The Association represents members’ shared interests in constructive dialogue with state institutions. The Association is not a government body and does not act on behalf of government bodies.',
            '协会在与政府机构的建设性对话中代表会员的共同利益。协会不是政府机构，也不代表任何政府机构行事。',
          ),
          icon: 'columns',
        },
        {
          title: t(
            'Мәселені мемлекетке жеткізу',
            'Передача вопросов государству',
            'Raising issues with the state',
            '向政府反映诉求',
          ),
          text: t(
            'Мүше жер, инфрақұрылым, рұқсат, салық, еңбек және көші-қон мәселелерін жеке кабинет арқылы өтініш ретінде жібереді. Өтініш ресми арналар арқылы тиісті органға жеткізіледі, ал оның мәртебесі кабинетте көрінеді. Қауымдастық мәселенің оң шешілуіне кепілдік бермейді.',
            'Член ассоциации направляет вопросы по земле, инфраструктуре, разрешениям, налогам, труду и миграции через личный кабинет в виде обращения. Обращение передаётся в соответствующий орган по официальным каналам, а его статус виден в кабинете. Ассоциация не гарантирует положительного решения вопроса.',
            'A member submits issues concerning land, infrastructure, permits, taxes, labour and migration as a request through the personal account. The request is passed to the relevant body through official channels, and its status is visible in the account. The Association does not guarantee a favourable outcome.',
            '会员可通过个人中心，就土地、基础设施、许可、税收、劳动和移民等问题提交诉求。诉求通过正式渠道转交相关机构，其状态在个人中心可见。协会不保证问题得到有利解决。',
          ),
          icon: 'shield',
        },
        {
          title: t('Іс-шаралар', 'Мероприятия', 'Events', '活动'),
          text: t(
            'Мүшелер қауымдастықтың іс-шараларына жеке кабинет арқылы тіркеледі. Іс-шаралар күнтізбесі «Медиа» бөлімінде жарияланады.',
            'Члены регистрируются на мероприятия ассоциации через личный кабинет. Календарь мероприятий публикуется в разделе «Медиа».',
            'Members register for the Association’s events through the personal account. The events calendar is published in the Media section.',
            '会员通过个人中心报名参加协会活动。活动日历发布在“媒体”栏目。',
          ),
          icon: 'calendar',
          href: '/media/events',
        },
        {
          title: t('Цифрлық қызметтер', 'Цифровые сервисы', 'Digital services', '数字化服务'),
          text: t(
            'Мүшелер өтініштерін, жарна шоттарын және құжаттарын онлайн жүргізеді. Хабарламалар портал ішінде де, электрондық поштамен де келеді.',
            'Члены ведут заявки, счета на взнос и документы онлайн. Уведомления приходят и внутри портала, и по электронной почте.',
            'Members handle applications, fee invoices and documents online. Notifications arrive both within the portal and by email.',
            '会员可在线办理申请、查看会费账单和管理文件。通知既在门户内显示，也通过电子邮件发送。',
          ),
          icon: 'layers',
        },
        {
          title: t('Жеке кабинет', 'Личный кабинет', 'Personal account', '个人中心'),
          text: t(
            'Кабинетте мүшелік мәртебесі, санаты мен мерзімі, мүдделер қақтығысы декларациясы және мүшелер тізілімінде көрсетуге келісім бар. Кіру тарихын көруге, деректерді жүктеп алуға және аккаунтты жоюға сұраныс беруге болады.',
            'В кабинете находятся статус, категория и срок членства, декларация о конфликте интересов и согласие на указание в реестре членов. Можно просматривать историю входов, скачивать данные и запрашивать удаление аккаунта.',
            'The account holds the membership status, category and term, the conflict of interest declaration and the consent to appear in the member registry. You can view your sign-in history, download your data and request deletion of the account.',
            '个人中心包含会员状态、类别和期限、利益冲突声明，以及列入会员名录的同意书。您可以查看登录记录、下载自己的数据并申请删除账号。',
          ),
          icon: 'user',
        },
      ],
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t(
        'Мүшелік нені білдірмейді',
        'Чего членство не означает',
        'What membership does not mean',
        '会员资格不意味着什么',
      ),
      text: t(
        'Мүшелік инвестициялық табысқа, мемлекеттік рұқсатқа немесе жеңілдікке кепілдік бермейді және қаржылық сенімділіктің кепілі емес. Мемлекеттік органмен кездесу «кездесу өтті» деп жазылады, «серіктестік орнады» деп емес.',
        'Членство не гарантирует инвестиционный доход, государственные разрешения или льготы и не является гарантией финансовой надёжности. Встреча с государственным органом описывается как «встреча состоялась», а не как «установлено партнёрство».',
        'Membership does not guarantee investment returns, government permits or incentives and is not a guarantee of financial reliability. A meeting with a government body is described as “a meeting took place”, not as “a partnership has been established”.',
        '会员资格不保证投资收益、政府许可或优惠政策，也不构成对财务可靠性的担保。与政府机构的会面表述为“会面已举行”，而非“已建立合作关系”。',
      ),
    },
    {
      type: 'links',
      heading: t('Байланысты беттер', 'Связанные страницы', 'Related pages', '相关页面'),
      items: [
        {
          label: t('Шарттар мен жарналар', 'Условия и взносы', 'Terms and fees', '条件与会费'),
          href: '/membership/terms',
          text: t(
            'Шарттар, жарна, төлем тәртібі және мүшелікті тоқтату.',
            'Условия, взнос, порядок оплаты и прекращение членства.',
            'Terms, the fee, payment arrangements and ending membership.',
            '条件、会费、支付方式及会员资格终止。',
          ),
        },
        {
          label: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
          href: '/membership/apply',
          text: t(
            'Мүшелік мәртебелері мен қажетті құжаттар.',
            'Статусы членства и необходимые документы.',
            'Membership statuses and the documents required.',
            '会员状态与所需文件。',
          ),
        },
        {
          label: t('Мүшелер тізілімі', 'Реестр членов', 'Member registry', '会员名录'),
          href: '/membership/registry',
          text: t(
            'Тек жазбаша келісім берген мүшелер.',
            'Только члены, давшие письменное согласие.',
            'Only members that have given written consent.',
            '仅列示已书面同意的会员。',
          ),
        },
        {
          label: t('Ашықтық пен этика', 'Прозрачность и этика', 'Transparency and ethics', '透明与道德'),
          href: '/about/ethics',
          text: t(
            'Мүдделер қақтығысы саясаты және шағым беру тәртібі.',
            'Политика по конфликту интересов и порядок подачи жалоб.',
            'The conflict of interest policy and how to submit a complaint.',
            '利益冲突政策及投诉方式。',
          ),
        },
      ],
    },
  ],
  cta: {
    title: t('Мүшелікке өтініш беріңіз', 'Подайте заявку на членство', 'Apply for membership', '申请入会'),
    text: t(
      'Өтініш онлайн формамен толтырылады, ал нәтижесі жеке кабинетте көрінеді.',
      'Заявка заполняется в онлайн-форме, а её результат виден в личном кабинете.',
      'The application is completed in an online form, and the outcome is visible in the personal account.',
      '申请通过在线表单填写，结果可在个人中心查看。',
    ),
    label: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
    href: '/membership/apply',
  },
}

// ---------------------------------------------------------------------------
// 13. Шарттар мен жарналар
// ---------------------------------------------------------------------------
const membershipTerms: SeedPage = {
  path: '/membership/terms',
  section: 'membership',
  title: t('Шарттар мен жарналар', 'Условия и взносы', 'Terms and fees', '条件与会费'),
  description: t(
    'Мүшелік шарттары, жарна мен төлем тәртібі, мүшелікті тоқтату және мүдделер қақтығысы декларациясы.',
    'Условия членства, взнос и порядок оплаты, прекращение членства и декларация о конфликте интересов.',
    'The terms of membership, the fee and payment arrangements, ending membership and the conflict of interest declaration.',
    '会员条件、会费与支付方式、会员资格终止以及利益冲突声明。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Бұл бет мүшелік шарттарын, жарна мен төлем тәртібін және мүшелікті тоқтату ережелерін біріктіреді. Нақты мөлшерлер мен мерзімдер Басқарма бекіткеннен кейін осы бетте жарияланады.',
        'На этой странице собраны условия членства, взнос и порядок оплаты, а также правила прекращения членства. Конкретные размеры и сроки будут опубликованы на этой странице после утверждения Правлением.',
        'This page brings together the terms of membership, the fee and payment arrangements, and the rules for ending membership. Specific amounts and dates will be published on this page once approved by the Board.',
        '本页汇集会员条件、会费与支付方式，以及会员资格终止的规则。具体金额和期限经理事会批准后，将在本页公布。',
      ),
    },
    {
      type: 'facts',
      heading: t('Негізгі шарттар', 'Основные условия', 'Main terms', '主要条款'),
      items: [
        {
          label: t('Санаттар', 'Категории', 'Categories', '类别'),
          value: t(
            'Бес санат: шетелдік инвестор компаниялар, халықаралық инвестициялық институттар, отандық өнеркәсіп компаниялары, кәсіби қызмет көрсетушілер, стратегиялық серіктестер.',
            'Пять категорий: иностранные инвесторские компании, международные инвестиционные институты, отечественные промышленные компании, поставщики профессиональных услуг, стратегические партнёры.',
            'Five categories: foreign investor companies, international investment institutions, domestic industrial companies, professional service providers and strategic partners.',
            '五个类别：外国投资企业、国际投资机构、本土工业企业、专业服务机构和战略合作伙伴。',
          ),
        },
        {
          label: t('Мәртебелер', 'Статусы', 'Statuses', '状态'),
          value: t(
            'Өтініш, тексеру, белсенді, тоқтатылған, аяқталған.',
            'Заявка, проверка, активный, приостановлен, завершён.',
            'Application, review, active, suspended, ended.',
            '申请、审核、有效、暂停、终止。',
          ),
        },
        {
          label: t('Мерзім', 'Срок', 'Term', '期限'),
          value: t(
            'Мүшелік мерзімі жеке кабинетте көрінеді, мерзім аяқталуға жақындағанда ескертпе жіберіледі.',
            'Срок членства виден в личном кабинете, при приближении окончания срока направляется напоминание.',
            'The membership term is shown in the personal account, and a reminder is sent as the end of the term approaches.',
            '会员期限显示在个人中心；期限临近届满时将发送提醒。',
          ),
        },
        {
          label: t('Деректердегі өзгерістер', 'Изменения данных', 'Changes to data', '资料变更'),
          value: t(
            'Атау, БСН және құжаттар сияқты маңызды өзгерістер модерациядан кейін көрінеді.',
            'Существенные изменения, такие как название, БИН и документы, отображаются после модерации.',
            'Significant changes, such as the name, the BIN and documents, become visible after moderation.',
            '名称、企业识别号和文件等重要变更，经审核后才会显示。',
          ),
        },
        {
          label: t('Тізілімде көрсету', 'Указание в реестре', 'Listing in the registry', '名录展示'),
          value: t(
            'Тек жазбаша келісім бойынша.',
            'Только по письменному согласию.',
            'Only with written consent.',
            '仅在取得书面同意后展示。',
          ),
        },
        {
          label: t('Мүшелікті тоқтату', 'Прекращение членства', 'Ending membership', '会员资格终止'),
          value: t(
            'Мәртебе «тоқтатылған» немесе «аяқталған» болуы мүмкін. Негіздері мен тәртібі жарғы мен ішкі ережелерде айқындалады және жаңартылған жарғы бекітілгеннен кейін жарияланады.',
            'Статус может стать «приостановлен» или «завершён». Основания и порядок определяются уставом и внутренними правилами и будут опубликованы после утверждения обновлённого устава.',
            'The status may become “suspended” or “ended”. The grounds and procedure are set by the charter and internal rules and will be published once the updated charter is approved.',
            '会员状态可能变为“暂停”或“终止”。具体事由和程序由章程及内部规则规定，待更新后的章程批准后公布。',
          ),
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Жарналар және төлем тәртібі',
        'Взносы и порядок оплаты',
        'Fees and payment arrangements',
        '会费与支付方式',
      ),
      text: t(
        'Мүшелік жарнасының мөлшері санат бойынша Басқарма бекіткеннен кейін осы бетте ашық жарияланады. Төлем тәртібі мен мерзімдері де бекітілгеннен кейін көрсетіледі. Жарна шоттары мен актілер мүшенің жеке кабинетінде қолжетімді.',
        'Размер членского взноса по категориям будет открыто опубликован на этой странице после утверждения Правлением. Порядок и сроки оплаты также будут указаны после утверждения. Счета на взнос и акты доступны в личном кабинете члена.',
        'The amount of the membership fee for each category will be published openly on this page once approved by the Board. The payment procedure and deadlines will also be shown once approved. Fee invoices and statements are available in the member’s personal account.',
        '各类别会费金额经理事会批准后，将在本页公开。支付方式与期限同样在批准后列明。会费账单与结算单可在会员个人中心查看。',
      ),
    },
    {
      type: 'paragraphs',
      heading: t(
        'Мүдделер қақтығысы декларациясы',
        'Декларация о конфликте интересов',
        'Conflict of interest declaration',
        '利益冲突声明',
      ),
      text: t(
        'Мүше мүдделер қақтығысы декларациясын жеке кабинетте толтырады: онда байланысты тарап пен жағдайдың сипаттамасы көрсетіледі. Қауымдастықтың өзінде де қағида бар: мүдделер қақтығысы бар сарапшы жобаны көре алады, бірақ баға қоя алмайды және дауыс бере алмайды.',
        'Член ассоциации заполняет декларацию о конфликте интересов в личном кабинете: в ней указываются связанная сторона и описание ситуации. Аналогичное правило действует и внутри ассоциации: эксперт с конфликтом интересов может видеть проект, но не может выставлять оценку и голосовать.',
        'A member completes the conflict of interest declaration in the personal account, stating the related party and describing the situation. The Association applies a similar rule internally: an expert with a conflict of interest may view a project but may not score it or vote.',
        '会员在个人中心填写利益冲突声明，说明关联方及相关情况。协会内部也适用类似规则：存在利益冲突的专家可以查看项目，但不得评分或投票。',
      ),
    },
    membershipGuaranteeNotice,
    feeSeparateNotice,
  ],
  cta: {
    title: t('Мүшелікке өтініш беріңіз', 'Подайте заявку на членство', 'Apply for membership', '申请入会'),
    text: t(
      'Шарттармен танысқан соң, өтінішті онлайн формамен толтырыңыз.',
      'Ознакомившись с условиями, заполните заявку в онлайн-форме.',
      'Once you have read the terms, complete the application in the online form.',
      '阅读条件后，请通过在线表单填写申请。',
    ),
    label: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
    href: '/membership/apply',
  },
}

// ---------------------------------------------------------------------------
// 14. Мүшелікке өтініш
// ---------------------------------------------------------------------------
const membershipApply: SeedPage = {
  path: '/membership/apply',
  section: 'membership',
  title: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
  description: t(
    'Мүшелікке өтініш онлайн формамен толтырылады; бетте мүшелік мәртебелері мен қажетті құжаттар сипатталған.',
    'Заявка на членство заполняется в онлайн-форме; здесь описаны статусы членства и необходимые документы.',
    'The membership application is completed in an online form; this page describes the membership statuses and the documents required.',
    '入会申请通过在线表单填写；本页说明会员状态和所需文件。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Өтінім онлайн формамен толтырылады. Өтініште ұйым деректері мен таңдалған мүшелік санаты көрсетіледі, содан кейін хатшылық оны тексереді. Тексеру нәтижесі бойынша мүшелік мәртебесі беріледі, ал жұмыс жеке кабинетте жалғасады.',
        'Заявка заполняется в онлайн-форме. В ней указываются данные организации и выбранная категория членства, после чего секретариат проводит проверку. По результатам проверки присваивается статус члена, а работа продолжается в личном кабинете.',
        'The application is completed in an online form. It states the organisation’s details and the chosen membership category, after which the Secretariat carries out a check. Following the check, member status is granted and work continues in the personal account.',
        '申请通过在线表单填写。表单中填写组织信息和所选会员类别，随后由秘书处审核。审核通过后授予会员身份，后续事务在个人中心办理。',
      ),
    },
    {
      type: 'steps',
      heading: t('Мүшелік мәртебелері', 'Статусы членства', 'Membership statuses', '会员状态'),
      items: [
        {
          title: t('Өтініш', 'Заявка', 'Application', '申请'),
          text: t(
            'Ұйым онлайн формада деректерін көрсетіп, санатты таңдайды және қажетті құжаттарды қосады.',
            'Организация указывает данные в онлайн-форме, выбирает категорию и прикладывает необходимые документы.',
            'The organisation enters its details in the online form, chooses a category and attaches the documents required.',
            '组织通过在线表单填写信息、选择类别并附上所需文件。',
          ),
        },
        {
          title: t('Тексеру', 'Проверка', 'Review', '审核'),
          text: t(
            'Хатшылық өтінішті және ұсынылған құжаттарды тексереді.',
            'Секретариат проверяет заявку и представленные документы.',
            'The Secretariat checks the application and the documents provided.',
            '秘书处审核申请及所提交的文件。',
          ),
        },
        {
          title: t('Белсенді', 'Активный', 'Active', '有效'),
          text: t(
            'Мүшелік мәртебесі берілді, мүше артықшылықтарды пайдалана алады. Мәртебе, санат пен мерзім жеке кабинетте көрінеді.',
            'Статус члена присвоен, член может пользоваться преимуществами членства. Статус, категория и срок видны в личном кабинете.',
            'Member status is granted and the member can use the benefits of membership. The status, category and term are shown in the personal account.',
            '已授予会员身份，会员可享有会员权益。状态、类别和期限显示在个人中心。',
          ),
        },
        {
          title: t('Тоқтатылған', 'Приостановлен', 'Suspended', '暂停'),
          text: t(
            'Мүшелік мәртебесі тоқтатылды. Негіздері мен тәртібі жарғы мен ішкі ережелерде айқындалады.',
            'Статус членства приостановлен. Основания и порядок определяются уставом и внутренними правилами.',
            'Membership status is suspended. The grounds and procedure are set by the charter and internal rules.',
            '会员状态为暂停。事由和程序由章程及内部规则规定。',
          ),
        },
        {
          title: t('Аяқталған', 'Завершён', 'Ended', '终止'),
          text: t(
            'Мүшелік аяқталды. Аяқталу негіздері мен тәртібі жарғы мен ішкі ережелерде айқындалады.',
            'Членство завершено. Основания и порядок завершения определяются уставом и внутренними правилами.',
            'Membership has ended. The grounds and procedure for ending it are set by the charter and internal rules.',
            '会员资格已终止。终止的事由和程序由章程及内部规则规定。',
          ),
        },
      ],
    },
    {
      type: 'paragraphs',
      heading: t(
        'Қажетті құжаттар мен деректер',
        'Необходимые документы и данные',
        'Documents and information required',
        '所需文件与资料',
      ),
      text: t(
        'Өтініште мынадай деректер мен құжаттар көрсетіледі. Нақты тізім өтініш формасында нақтыланады.\n\n- Ұйымның атауы, елі және тіркеу нөмірі (қазақстандық ұйымдар үшін БСН)\n- Ұйымның саласы және сайты\n- Нақты бенефициар туралы мәліметтер\n- Таңдалған мүшелік санаты\n- Ұйымның тіркелуін және өкілдің өкілеттігін растайтын құжаттар\n- Дербес деректерді өңдеуге келісім\n- Мүшелер тізілімінде көрсетуге жазбаша келісім (қалауыңыз бойынша)\n\nМүдделер қақтығысы декларациясы мен жарна шоттары мүшенің жеке кабинетінде жүргізіледі. Жарна мөлшері Басқарма бекіткеннен кейін «Шарттар мен жарналар» бетінде жарияланады.',
        'В заявке указываются следующие данные и документы. Точный перечень уточняется в форме заявки.\n\n- Название, страна и регистрационный номер организации (БИН для казахстанских организаций)\n- Отрасль и сайт организации\n- Сведения о конечном бенефициаре\n- Выбранная категория членства\n- Документы, подтверждающие регистрацию организации и полномочия представителя\n- Согласие на обработку персональных данных\n- Письменное согласие на указание в реестре членов (по желанию)\n\nДекларация о конфликте интересов и счета на взнос ведутся в личном кабинете члена. Размер взноса будет опубликован на странице «Условия и взносы» после утверждения Правлением.',
        'The application states the following information and documents. The exact list is confirmed in the application form.\n\n- The organisation’s name, country and registration number (the BIN for Kazakhstani organisations)\n- The organisation’s sector and website\n- Details of the ultimate beneficial owner\n- The chosen membership category\n- Documents confirming the organisation’s registration and the representative’s authority\n- Consent to the processing of personal data\n- Written consent to appear in the member registry (optional)\n\nThe conflict of interest declaration and fee invoices are handled in the member’s personal account. The amount of the fee will be published on the “Terms and fees” page once approved by the Board.',
        '申请中需提供以下资料和文件。具体清单以申请表单为准。\n\n- 组织名称、所在国家和注册号（哈萨克斯坦组织填写企业识别号）\n- 组织所属行业和网站\n- 最终受益所有人信息\n- 所选会员类别\n- 证明组织注册情况及代表权限的文件\n- 个人数据处理同意\n- 列入会员名录的书面同意（自愿）\n\n利益冲突声明和会费账单在会员个人中心办理。会费金额经理事会批准后，将在“条件与会费”页面公布。',
      ),
    },
    {
      type: 'notice',
      tone: 'info',
      title: t(
        'Өзгерістер модерациядан кейін көрінеді',
        'Изменения видны после модерации',
        'Changes appear after moderation',
        '变更经审核后才会显示',
      ),
      text: t(
        'Мүше кабинетте атау, БСН немесе құжаттар сияқты маңызды деректерді өзгерткенде, өзгеріс модерациядан кейін ғана көрінеді. Бұл мүшелер тізілімі мен құжаттардағы деректердің дұрыстығын қамтамасыз етеді.',
        'Когда член меняет в кабинете существенные данные, такие как название, БИН или документы, изменение становится видимым только после модерации. Это обеспечивает достоверность данных в реестре членов и в документах.',
        'When a member changes significant data in the account, such as the name, the BIN or documents, the change becomes visible only after moderation. This keeps the data in the member registry and in documents accurate.',
        '会员在个人中心修改名称、企业识别号或文件等重要资料时，变更须经审核后才会显示。这样可确保会员名录和文件中的资料准确无误。',
      ),
    },
    membershipGuaranteeNotice,
  ],
  cta: {
    title: t('Шарттармен танысыңыз', 'Ознакомьтесь с условиями', 'Read the terms', '请阅读入会条件'),
    text: t(
      'Санаттар, жарна және қабылдау тәртібі туралы толық ақпарат «Шарттар мен жарналар» бетінде.',
      'Полная информация о категориях, взносе и порядке приёма приведена на странице «Условия и взносы».',
      'Full information on categories, the fee and the admission procedure is on the “Terms and fees” page.',
      '有关类别、会费和入会程序的完整信息，见“条件与会费”页面。',
    ),
    label: t('Шарттар мен жарналар', 'Условия и взносы', 'Terms and fees', '条件与会费'),
    href: '/membership/terms',
  },
}

// ---------------------------------------------------------------------------
// 15. Мүшелер тізілімі
// ---------------------------------------------------------------------------
const membershipRegistry: SeedPage = {
  path: '/membership/registry',
  section: 'membership',
  title: t('Мүшелер тізілімі', 'Реестр членов', 'Member registry', '会员名录'),
  description: t(
    'Тізілімде тек өз ұйымын көрсетуге жазбаша келісім берген қауымдастық мүшелері жарияланады.',
    'В реестре публикуются только члены ассоциации, давшие письменное согласие на указание своей организации.',
    'The registry lists only those members of the Association that have given written consent to being named.',
    '名录仅列示已书面同意公开其组织名称的协会会员。',
  ),
  blocks: [
    {
      type: 'paragraphs',
      text: t(
        'Мүшелер тізілімінде тек өз ұйымын көрсетуге жазбаша келісім берген мүшелер жарияланады. Келісім мүшенің жеке кабинетінде беріледі. Мүшенің аты мен логотипі тек осы келісім негізінде қойылады.',
        'В реестре членов публикуются только те члены, которые дали письменное согласие на указание своей организации. Согласие предоставляется в личном кабинете члена. Название и логотип члена размещаются только на основании этого согласия.',
        'The member registry lists only those members that have given written consent to their organisation being named. Consent is given in the member’s personal account. A member’s name and logo are shown only on the basis of that consent.',
        '会员名录仅列示已书面同意公开其组织名称的会员。同意在会员个人中心作出。会员的名称和标志仅依据该同意展示。',
      ),
    },
    {
      type: 'cards',
      heading: t('Тізілім қағидаттары', 'Принципы реестра', 'Principles of the registry', '名录的基本原则'),
      columns: 3,
      items: [
        {
          title: t('Тек келісім бойынша', 'Только по согласию', 'Consent only', '须经同意'),
          text: t(
            'Мүше тізілімде тек жазбаша келісім бергенде көрсетіледі. Келісімі жоқ мүшенің аты жарияланбайды.',
            'Член указывается в реестре только после письменного согласия. Название члена без согласия не публикуется.',
            'A member is listed only after giving written consent. Without consent, the member’s name is not published.',
            '会员须在书面同意后才会列入名录。未经同意，不会公布会员名称。',
          ),
          icon: 'check',
        },
        {
          title: t('Логотип тек рұқсатпен', 'Логотип только с разрешения', 'Logos only with permission', '标志须经许可'),
          text: t(
            'Атау мен логотип тек жазбаша рұқсатпен қойылады. Рұқсатсыз ешқандай белгі жарияланбайды.',
            'Название и логотип размещаются только с письменного разрешения. Без разрешения никакие обозначения не публикуются.',
            'A name and logo are shown only with written permission. Nothing is published without permission.',
            '名称和标志仅在取得书面许可后展示。未经许可，不会发布任何标识。',
          ),
          icon: 'lock',
        },
        {
          title: t('Деректердің дұрыстығы', 'Достоверность данных', 'Accuracy of data', '资料准确性'),
          text: t(
            'Атау, БСН және құжаттар сияқты маңызды өзгерістер модерациядан кейін көрінеді. Бұл тізімдегі деректердің дәлдігін қамтамасыз етеді.',
            'Существенные изменения, такие как название, БИН и документы, становятся видимыми после модерации. Это обеспечивает точность данных в реестре.',
            'Significant changes, such as the name, the BIN and documents, become visible after moderation. This keeps the data in the registry accurate.',
            '名称、企业识别号和文件等重要变更，经审核后才会显示，以确保名录资料准确。',
          ),
          icon: 'shield-check',
        },
      ],
    },
    {
      type: 'notice',
      tone: 'legal',
      title: t(
        'Тізілімде болу кепілдік емес',
        'Присутствие в реестре не является гарантией',
        'Being listed is not a guarantee',
        '列入名录不构成担保',
      ),
      text: t(
        'Тізілімде көрсетілу мүшенің қаржылық сенімділігінің кепілі емес және инвестициялық нәтижеге кепілдік бермейді. Тізілімде жоқ ұйым мүше емес дегенді білдірмейді: ұйым көрсетілуге келісім бермеген болуы мүмкін.',
        'Указание в реестре не является гарантией финансовой надёжности члена и не гарантирует инвестиционный результат. Отсутствие организации в реестре не означает, что она не является членом: возможно, она не давала согласия на указание.',
        'Being listed in the registry is not a guarantee of a member’s financial reliability and does not guarantee any investment outcome. The absence of an organisation from the registry does not mean that it is not a member: it may simply not have consented to being named.',
        '列入名录不构成对会员财务可靠性的担保，也不保证任何投资结果。组织未列入名录并不意味着其不是会员，可能只是该组织未同意公开名称。',
      ),
    },
  ],
  cta: {
    title: t(
      'Мүшелер қатарына қосылыңыз',
      'Присоединяйтесь к членам ассоциации',
      'Join the members of the Association',
      '加入协会会员行列',
    ),
    text: t(
      'Өтініш беріп, мүшелік мәртебесін алғаннан кейін тізілімде көрсетуге келісімді жеке кабинетте бере аласыз.',
      'После подачи заявки и получения статуса члена вы можете дать согласие на указание в реестре в личном кабинете.',
      'Once you have applied and been granted member status, you can give your consent to be listed in the registry in the personal account.',
      '申请并获得会员身份后，您可在个人中心作出同意列入名录的授权。',
    ),
    label: t('Мүшелікке өтініш', 'Заявка на членство', 'Apply for membership', '申请入会'),
    href: '/membership/apply',
  },
}

export const pagesB: SeedPage[] = [
  investors,
  investorsChina,
  investorsGulf,
  investorsGlobal,
  investorsClimate,
  investorsHandbook,
  investorsApply,
  projects,
  projectsLevels,
  projectsSubmit,
  membership,
  membershipBenefits,
  membershipTerms,
  membershipApply,
  membershipRegistry,
]
