# Инвестициялық модуль: таза бизнес-логика (ТТ 8)

Фреймворксіз TypeScript функциялары: дерекқорсыз, серверсіз, күн мен деректі сырттан алады, сондықтан тесттер секундта өтеді. Payload hook-тары, `access` функциялары және API осыларды шақырады, ережені өздері қайталамайды.

- Тесттер: `tests/unit/{scoring,evaluators,projectRules,pipeline,amounts-kpi,matching,dataroom}.test.ts`.
- Іске қосу: `npx vitest run tests/unit/<файл>`.
- Әр файлдың басында «Болжам:» тізімі бар: ТТ мәтіні жетпеген жерде қабылданған шешімдер сонда жазылған.

## Ортақ келісімдер

- `can...` функциялары `{ ok, missing }` нысанын қайтарады. Нәтиже әрқашан нысан, сондықтан `if (canX(...))` емес, `.ok` тексеріңіз. `missing`: тұрақты ағылшын кодтары (мысалы `committeeApproval`), интерфейс оларды `messages/*.json` арқылы аударады.
- Жетіспейтін немесе жарамсыз дерек қауіпсіз жағына ауытқиды: рұқсат бермейді, қайта қарауды талап етеді.
- Күндер: `Date`, ISO жол немесе миллисекунд қабылданады, есептеу UTC бойынша (`scoring/dates.ts`).
- Функциялар кіріс деректерді өзгертпейді. Дерек түрлерінде барлық өріс міндетті емес, сондықтан Payload құжатын тікелей беруге болады.
- Сома бірлігі: млн $ (`Projects.amountMusd` сияқты). Жоба деңгейі мен кезеңі `src/lib/taxonomy.ts` мәндері ('1'-'4', '1'-'8').

## Баптау және бағалау: `src/lib/scoring/` (ТТ 8.2, 14.3)

| Файл | API |
| --- | --- |
| `config.ts` | `ScoringConfigData` (`dimensions: {key, weight}[]`, `grades: {key: 'A'\|'B'\|'C'\|'D', min, max}[]`); `defaultScoringConfig` (7 өлшем: 25, 15, 15, 15, 10, 10, 10; A 80-100, B 65-79, C 50-64, D 0-49; мұздатылған); `validateScoringConfig(config): string[]` (бос тізім = жарамды: салмақ қосындысы 100, өлшем кілттері бірегей, деңгейлер 0-100 аралығын үзіліссіз әрі қабаттаспай жабады) |
| `score.ts` | `computeScore(config, entries)`, `entries[]` = `{ dimension, points, evidenceText, evidenceFiles }`, нәтиже `{ total, byDimension, grade, errors: {code, dimension}[], complete }`. Кодтар: `points-out-of-range`, `evidence-text-missing`, `evidence-files-missing`, `dimension-missing`, `dimension-unknown`, `dimension-duplicate`. Қате болса да `total` есептеледі, бірақ `complete: false`. `gradeFor(config, total)`: бөлшек балл төменгі деңгейге жатады (79.5 = B) |
| `status.ts` | `resolveInvestorStatus({ total, config, veto })` -> `{ grade, status, eligibleForPriorityProjects, errors }`. `status`: `stopped`, `priority` (A), `conditional` (B), `watch` (C), `deferred` (D). Комплаенс ветосы баллға қарамастан басым: 95 балл + белсенді вето = `stopped`. Вето себебі бос болса `veto-reason-required`. Қосымша: `matchableGrades` (A, B), `isMatchableGrade`, `isVetoActive` |
| `evaluators.ts` | `canFinalizeAssessment(assessments)`: баға екі тұлғамен (`expert` + `committee-member`), екеуі әртүрлі адам; `hasConflictOfInterest(evaluatorId, subject, declarations)`; `canEvaluate(...)` -> `{ view, score, vote }`, қақтығысы бар сарапшы көреді (`view: true`), бірақ бағаламайды және дауыс бермейді; `isReassessmentDue(lastAssessedAt, now, newDataArrived)`: 12 айда бір немесе жаңа дерек келгенде |
| `dates.ts` | `DateInput`, `toTimestamp`, `addDaysUtc`, `addMonthsUtc`: ортақ күн көмекшілері |

## Жобалар: `src/lib/investment/` (ТТ 7.4, 8.3, 8.4)

| Файл | API |
| --- | --- |
| `projectRules.ts` | `ProjectRecord` (ережелер оқитын жоба деректері). `canPromoteToLevel(project, target)`: тек келесі деңгейге (1-ден 3-ке секіру жоқ), төменгі деңгейлердің шарттары да қайта тексеріледі; 1: иесі, орны, мақсаты; 2: құжаттар, жер мәртебесі, бастапқы тәуекелдер тексерілді; 3: комитет бекітті, паспорт, алдын ала ТЭН; 4: түскен қаражат құжатпен расталды. `canPublishToCatalog(project)`: тек 2 және 3 деңгей, жариялау белгісі бар, 3-деңгейге комитет шешімі де керек, 1-деңгей ешқашан. `toPublicProject(project)`: ақ тізім (атауы, сала, өңір, болжамды көлем, модель, деңгей, қысқа сипаттама, жауапты менеджердің аты); иесі, құпия деректер, төрт сома және құжаттар кірмейді |
| `pipeline.ts` | `canAdvanceStage(project, toStage, { allowRollback })`: 1->2 міндетті өрістер, 2->3 хатшылық чек-листі, 3->4 комитет шешімі, 4->5 кем дегенде 1 инвестор, 5->6 ниет хаттамасы немесе терм-шит, 6->7 ресми шарт, 7->8 өндіріс басталды; кезеңді өткізіп жіберуге болмайды (`stage-skip`), артқа қайту тек `allowRollback: true` арқылы. `overdueSteps(steps, now)` -> `{ overdue, recipients }`: мерзімі өткен қадамдар (ең көп кешіккені алдымен) және ескертпе алушылар (жауапты тұлға + Атқарушы директор, яғни `chair` рөлі) |

`missing` кодтары: `canPromoteToLevel`: `owner`, `location`, `purpose`, `documents`, `landStatus`, `initialRisks`, `committeeApproval`, `passport`, `feasibilityStudy`, `fundsReceiptEvidence`, `level-skip`, `target-not-higher`, `invalid-level`. `canPublishToCatalog`: `level-not-publishable`, `publish-permission`, `committeeApproval`. `canAdvanceStage`: `need`, `secretariatChecklist`, `investorInterest`, `intentProtocolOrTermSheet`, `contractSigned`, `productionStarted` (және жоғарыдағы `owner`, `location`, `purpose`, `committeeApproval`), `stage-skip`, `same-stage`, `rollback-not-allowed`, `invalid-stage`.

## Сомалар және KPI: `investment/amounts.ts`, `src/lib/kpi/index.ts` (ТТ 8.7, 10.2)

ТӨРТ СОМА (`declared`, `loi`, `contract`, `received`) ЕШҚАШАН қосылмайды.

| Файл | API |
| --- | --- |
| `amounts.ts` | `FourAmounts` (`declared`, `loi`, `contract`, `received`, `receivedEvidenceFiles`, `associationContribution: 'direct'\|'indirect'\|null`); `validateFourAmounts(amounts)` -> `{ ok, errors }`: теріс сан жоқ, 0-ден үлкен `received` тек дәлел файлымен; `hasReceivedEvidence(amounts)` |
| `kpi/index.ts` | `aggregateKpi(projects)`: `projects[].amounts` бойынша әр санаттың БӨЛЕК қосындысы `{ declared, loi, contract, received }` және санауыштар (`projectCount`, `receivedCount`, `unverifiedReceivedCount`); біріккен жалпы сан жоқ; `received` қосындысына тек дәлелі бар жазбалар кіреді, мәлімделген сома оған әсер етпейді. `funnelCounts({ investors, screened, negotiating, contracted, received })`: воронканың бес бөлек санауышы (кіріс сан немесе тізім) |

Экспорт атауларында `total`, `sum`, `combined`, `overall` болмайды: мұны `tests/unit/amounts-kpi.test.ts` тексереді.

## Сәйкестендіру: `investment/matching.ts` (ТТ 8.5)

`matchInvestors(project, investors, now)` -> `{ suggestions, requiresManagerDecision: true }`. Сүзгі: сала, көлем аралығы, өңір, модель, тәуекелге дайындығы, деңгей тек A және B, вето белсенді емес, бағасы 12 айлық мерзімнен өтпеген. Әр ұсыныста `reasons` (критерий бойынша `match` немесе `unspecified`). C, D, вето белсенді және бағасы ескірген инвестор нәтижеде мүлде көрінбейді. Автоматты түрде ештеңе жіберілмейді: шешімді менеджер қабылдайды.

## NDA және деректер бөлмесі: `investment/dataroom.ts` (ТТ 8.6, 14.1)

- `ndaExpiry(signedAt, days = 90)`: қатынастың аяқталу сәті.
- `canAccessDataroom({ nda, investor, project, now, twoFactorVerified })` -> `{ allowed, reason }`. Қатынас шарттары: NDA осы жобаға әрі осы инвесторға қол қойылған, мерзімі өтпеген, кері алынбаған; инвестор деңгейі A немесе B және вето жоқ; 2FA расталған. Себеп коды: `veto-active`, `grade-too-low`, `nda-missing`, `nda-revoked`, `nda-expired`, `two-factor-required` (осы ретпен тексеріледі), рұқсат берілсе `null`. Сыртқы API инвесторға нақты себепті емес, жалпы «қатынас жоқ» дегенді көрсетуі тиіс, себеп тек журналға жазылады.
- `watermarkText(name, date)`: `Аты | YYYY-MM-DD`; аты бос немесе күні жарамсыз болса қате лақтырады.
- `describeAccessLog({ userId, action, projectId, fileId, ip, at, reason })`: аудит журналына жазылатын жазба (кім, не, қашан, IP) және тілге тәуелсіз `message` жолы. `action`: `open`, `view`, `download`, `denied`. Пайдаланушысыз немесе уақытсыз жазба қабылданбайды.

## Кіріс деректердің өрістері

Түрлердің толық анықтамасы файлдарда; Payload құжатын осы өрістерге келтіру жеткілікті.

- `ProjectRecord`: ашық карточка өрістері (`title`, `summary`, `sector`, `region`, `amountMusd`, `model`, `level`, `responsibleManager: { name }`, `publishToCatalog`), ішкі өрістер (`owner: { id, name }`, `purpose`, `need`, `documentsVerified`, `landStatusVerified`, `initialRisksVerified`, `committeeDecision: 'pending'\|'approved'\|'rejected'`, `passportReady`, `feasibilityStudyReady`, `amounts: FourAmounts`) және цикл өрістері (`stage`, `secretariatChecklistApproved`, `interestedInvestorCount`, `intentProtocolSigned`, `termSheetSigned`, `contractSigned`, `productionStarted`). `Projects` жинағында әзірше бар өрістер: `title`, `summary`, `sector`, `region`, `amountMusd`, `model`, `level`, `stage`, `publishToCatalog`; қалғаны ТТ 13.3 бойынша кейін қосылады.
- `PipelineStep`: `id`, `projectId`, `nextAction`, `dueDate`, `completedAt`, `responsibleId`.
- `AssessmentRecord`: `evaluatorId`, `role` (`expert` немесе `committee-member`). `CoiDeclaration`: `evaluatorId` және `investorId`, `projectId`, `organizationId` ішінен біреуі. `subject` (`investorId`, `projectId`, `organizationId`) ұйым өрісімен толтырылады: ұйым бойынша декларация сол ұйымның инвесторы мен жобасын қамтиды.
- `MatchProject`: `id`, `sector`, `region`, `model`, `amountMusd`, `riskLevel` (`low`, `medium`, `high`). `MatchInvestor`: `id`, `grade`, `veto`, `lastAssessedAt`, `sectors`, `regions`, `models`, `minAmountMusd`, `maxAmountMusd`, `riskAppetite`.
- `NdaRecord`: `projectId`, `investorId`, `signedAt`, `expiresAt` (болса, 90 күннен басым), `accessDays`, `revokedAt` (белгіленсе, NDA күшін жойды). `DataroomInvestor`: `id`, `grade`, `veto`.
