import type {
  ArrayField,
  CheckboxField,
  GroupField,
  NumberField,
  SelectField,
  TextareaField,
  TextField,
} from 'payload'

import { type L4 } from '@/lib/labels'

// Өріс құру көмекшілері: белгілер 4 тілде, контент өрістері тілге бөлінген (localized).

type Extra<T> = Partial<Omit<T, 'name' | 'type' | 'label'>>

/** Тілге бөлінген мәтін (4 тілде бөлек сақталады) */
export const ltext = (name: string, label: L4, extra: Extra<TextField> = {}): TextField =>
  ({ name, type: 'text', localized: true, label, ...extra }) as TextField

/** Тілге бөлінген көп жолды мәтін */
export const ltextarea = (name: string, label: L4, extra: Extra<TextareaField> = {}): TextareaField =>
  ({ name, type: 'textarea', localized: true, label, ...extra }) as TextareaField

/** Барлық тілде бірдей мәтін (сілтеме, код, атау) */
export const text = (name: string, label: L4, extra: Extra<TextField> = {}): TextField =>
  ({ name, type: 'text', label, ...extra }) as TextField

export const checkbox = (name: string, label: L4, extra: Extra<CheckboxField> = {}): CheckboxField =>
  ({ name, type: 'checkbox', label, ...extra }) as CheckboxField

export const number = (name: string, label: L4, extra: Extra<NumberField> = {}): NumberField =>
  ({ name, type: 'number', label, ...extra }) as NumberField

export const select = (
  name: string,
  label: L4,
  options: SelectField['options'],
  extra: Extra<SelectField> = {},
): SelectField => ({ name, type: 'select', label, options, ...extra }) as SelectField

export const group = (name: string, label: L4, fields: GroupField['fields'], extra: Extra<GroupField> = {}): GroupField =>
  ({ name, type: 'group', label, fields, ...extra }) as GroupField

/** Қатарлары барлық тілде ортақ массив: құрылым бірдей, ішіндегі мәтін ғана тілге бөлінеді */
export const rows = (
  name: string,
  label: L4,
  rowLabel: { singular: L4; plural: L4 },
  fields: ArrayField['fields'],
  extra: Extra<ArrayField> = {},
): ArrayField =>
  ({
    name,
    type: 'array',
    label,
    labels: rowLabel,
    fields,
    admin: { initCollapsed: true },
    ...extra,
  }) as ArrayField
