// Әкімшілік панельдегі белгілер 4 тілде: қазақша, орысша, ағылшынша, қытайша.
// Қолданылуы: label: l('Жаңалықтар', 'Новости', 'News', '新闻')

export type L4 = { kk: string; ru: string; en: string; zh: string }

export const l = (kk: string, ru: string, en: string, zh: string): L4 => ({ kk, ru, en, zh })
