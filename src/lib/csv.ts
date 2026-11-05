// CSV экспорты (ТТ 10.2: есептер). Excel формула инъекциясынан қорғау: =, +, -, @ , tab, CR таңбасынан басталған ұяшықтың алдына ' қойылады.

const DANGEROUS = /^[=+\-@\t\r]/

export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = typeof value === 'string' ? value : typeof value === 'object' ? JSON.stringify(value) : String(value)
  // Теріс сан (мысалы, -5) формула емес: тек мәтін ретінде жазылғанда қорғалады
  if (typeof value !== 'number' && DANGEROUS.test(text)) text = `'${text}`
  return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export type CsvColumn<Row> = { header: string; value: (row: Row) => unknown }

/** BOM (Excel UTF-8 танысын) + үтірмен бөлінген жолдар. CRLF: Excel үйлесімділігі үшін. */
export function toCsv<Row>(rows: readonly Row[], columns: readonly CsvColumn<Row>[]): string {
  const lines = [columns.map((column) => csvCell(column.header)).join(',')]
  for (const row of rows) lines.push(columns.map((column) => csvCell(column.value(row))).join(','))
  return `﻿${lines.join('\r\n')}\r\n`
}
