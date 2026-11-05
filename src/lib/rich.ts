// Беттің абзац блогындағы жеңіл белгілеу: бос жолмен бөлінген абзацтар, «- » тізім элементтері, **қалың** мәтін.
// HTML емес, таза мәтін: контент менеджері кездейсоқ тег жаза алмайды (XSS жоқ), рендерлеу React арқылы.

export type RichInline = { text: string; bold: boolean }
export type RichNode = { type: 'p'; inline: RichInline[] } | { type: 'ul'; items: RichInline[][] }

/** `**қалың**` бөліктерін ажыратады: тақ индекстегі бөліктер қалың */
export function parseInline(text: string): RichInline[] {
  return text
    .split('**')
    .map((part, index) => ({ text: part, bold: index % 2 === 1 }))
    .filter((part) => part.text !== '')
}

export function parseRich(source: string): RichNode[] {
  const nodes: RichNode[] = []
  for (const chunk of source.split(/\n\s*\n/)) {
    let paragraph: string[] = []
    let list: string[] = []
    const flushParagraph = () => {
      if (paragraph.length) nodes.push({ type: 'p', inline: parseInline(paragraph.join(' ')) })
      paragraph = []
    }
    const flushList = () => {
      if (list.length) nodes.push({ type: 'ul', items: list.map(parseInline) })
      list = []
    }
    for (const raw of chunk.split('\n')) {
      const line = raw.trim()
      if (!line) continue
      if (line.startsWith('- ')) {
        flushParagraph()
        list.push(line.slice(2).trim())
      } else {
        flushList()
        paragraph.push(line)
      }
    }
    flushParagraph()
    flushList()
  }
  return nodes
}
