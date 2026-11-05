import type { Payload } from 'payload'

import type { Locale } from '@/i18n/config'
import type { FormKind } from '@/lib/forms/definitions'

// Хат жіберу (ТТ 16): Payload email адаптері арқылы. SMTP/nodemailer адаптері қосылмаған ортада (dev) Payload хатты консольге жазады,
// сондықтан өтініш үшін хат «жіберілді» деп есептелмейді, бірақ өтініш әкімшілік панельде сақталады. Қатесі өтінішті тоқтатпайды.

export type Mail = { to: string | string[]; subject: string; text: string }

export async function sendMail(payload: Payload, mail: Mail): Promise<boolean> {
  try {
    await payload.sendEmail({ ...mail })
    return true
  } catch (error) {
    payload.logger.warn({ err: error }, 'email was not sent')
    return false
  }
}

/** Хабарлама алатын қызметкерлер: NOTIFY_EMAILS=a@x.kz,b@x.kz (үтірмен) */
export const staffRecipients = (): string[] =>
  (process.env.NOTIFY_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))

const kindName: Record<FormKind, Record<Locale, string>> = {
  contact: { kk: 'хабарлама', ru: 'обращение', en: 'enquiry', zh: '留言' },
  investor: { kk: 'инвестор өтініші', ru: 'заявка инвестора', en: 'investor application', zh: '投资者申请' },
  project: { kk: 'жоба өтініші', ru: 'заявка на проект', en: 'project submission', zh: '项目申请' },
  membership: { kk: 'мүшелікке өтініш', ru: 'заявка на членство', en: 'membership application', zh: '入会申请' },
}

/** Өтініш берушіге растау хаты (4 тілде, нөмірімен) */
export function acknowledgement(kind: FormKind, locale: Locale, reference: string): { subject: string; text: string } {
  const name = kindName[kind][locale]
  switch (locale) {
    case 'ru':
      return {
        subject: `Ваша ${name} принята: ${reference}`,
        text: `Здравствуйте!\n\nМы получили вашу ${name}. Номер для обращения: ${reference}.\nСотрудники ассоциации свяжутся с вами после первичного рассмотрения.\n\nКазахстанская ассоциация иностранного капитала`,
      }
    case 'en':
      return {
        subject: `Your ${name} was received: ${reference}`,
        text: `Hello,\n\nWe have received your ${name}. Reference number: ${reference}.\nThe Association will contact you after the initial review.\n\nKazakhstan Association of Foreign Capital`,
      }
    case 'zh':
      return {
        subject: `已收到您的${name}：${reference}`,
        text: `您好！\n\n我们已收到您的${name}，受理编号：${reference}。\n协会将在初步审核后与您联系。\n\n哈萨克斯坦外国资本协会`,
      }
    default:
      return {
        subject: `${name[0].toUpperCase()}${name.slice(1)} қабылданды: ${reference}`,
        text: `Сәлеметсіз бе!\n\nСіздің ${name} қабылданды. Өтініш нөмірі: ${reference}.\nҚауымдастық қызметкерлері алғашқы қараудан кейін сізбен байланысады.\n\nҚазақстандық шетелдік капитал қауымдастығы`,
      }
  }
}

/** Қызметкерге жаңа өтініш туралы хабар (қазақша, ішкі пайдалану; дербес деректер хатқа қосылмайды) */
export function staffNotice(kind: FormKind, reference: string): { subject: string; text: string } {
  return {
    subject: `Жаңа өтініш: ${kindName[kind].kk} ${reference}`,
    text: `Порталға жаңа ${kindName[kind].kk} түсті. Нөмірі: ${reference}.\nМазмұнын әкімшілік панельде «Өтініштер» бөлімінен қараңыз.`,
  }
}
