'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Chip, ChipGroup } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field'
import { FormSteps } from '@/components/ui/FormSteps'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

/** Styleguide-тың интерактивті үлгілері: чип-сүзгі, форма, аккордеон, модаль, toast, бос күй */
export function InteractiveDemos({
  chips,
  accordion,
  steps,
}: {
  chips: string[]
  accordion: { id: string; title: string; text: string }[]
  steps: string[]
}) {
  const t = useTranslations()
  const toast = useToast()
  const [selected, setSelected] = useState(0)
  const [modal, setModal] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? t('forms.invalidEmail') : undefined
  const consentError = submitted && !consent ? t('forms.consentRequired') : undefined

  return (
    <div className="grid gap-14">
      <section className="grid gap-4" aria-labelledby="sg-chips">
        <h3 id="sg-chips" className="t-small font-semibold uppercase tracking-widest text-muted">
          Chip
        </h3>
        <ChipGroup label="Chip">
          {chips.map((label, index) => (
            <Chip key={label} selected={selected === index} onClick={() => setSelected(index)}>
              {label}
            </Chip>
          ))}
        </ChipGroup>
      </section>

      <section className="grid gap-6" aria-labelledby="sg-form">
        <h3 id="sg-form" className="t-small font-semibold uppercase tracking-widest text-muted">
          Field / Input / Textarea / Select / Checkbox / FormSteps
        </h3>
        <FormSteps steps={steps} current={1} label="FormSteps" />
        <form
          noValidate
          className="grid max-w-[640px] gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <Field
            label={t('forms.sampleLabel')}
            hint={t('forms.sampleHint')}
            error={emailError}
            required
          >
            {(ids) => (
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                {...ids}
              />
            )}
          </Field>
          <Field label={t('forms.sampleSelect')} optionalLabel={t('common.optional')}>
            {(ids) => (
              <Select defaultValue="" {...ids}>
                <option value="" disabled />
                {chips.map((label) => (
                  <option key={label}>{label}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={t('forms.sampleMessage')} optionalLabel={t('common.optional')}>
            {(ids) => <Textarea {...ids} />}
          </Field>
          <Checkbox
            label={t('forms.sampleConsent')}
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            error={consentError}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" arrow>
              {t('common.submit')}
            </Button>
            <Button type="button" variant="line" onClick={() => setSubmitted(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </section>

      <section className="grid gap-4" aria-labelledby="sg-accordion">
        <h3 id="sg-accordion" className="t-small font-semibold uppercase tracking-widest text-muted">
          Accordion
        </h3>
        <Accordion
          className="max-w-[720px] rounded-card border border-line bg-paper px-5 shadow-card"
          defaultOpen={[accordion[0]?.id ?? '']}
          items={accordion.map((item) => ({
            id: item.id,
            title: item.title,
            content: <p className="t-body text-muted">{item.text}</p>,
          }))}
        />
      </section>

      <section className="grid gap-4" aria-labelledby="sg-overlay">
        <h3 id="sg-overlay" className="t-small font-semibold uppercase tracking-widest text-muted">
          Modal / Toast
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="navy" onClick={() => setModal(true)}>
            {t('styleguide.modalOpen')}
          </Button>
          <Button variant="line" onClick={() => toast.push(t('styleguide.toastText'), 'success')}>
            {t('styleguide.toastShow')}
          </Button>
        </div>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title={t('styleguide.modalTitle')}
          closeLabel={t('a11y.close')}
          footer={
            <>
              <Button variant="line" onClick={() => setModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={() => setModal(false)}>{t('common.save')}</Button>
            </>
          }
        >
          {t('styleguide.modalText')}
        </Modal>
      </section>

      <section className="grid gap-4" aria-labelledby="sg-empty">
        <h3 id="sg-empty" className="t-small font-semibold uppercase tracking-widest text-muted">
          EmptyState
        </h3>
        <EmptyState
          title={t('styleguide.emptyTitle')}
          text={t('styleguide.emptyText')}
          action={
            <Button variant="line" href="/projects">
              {t('common.all')}
            </Button>
          }
        />
      </section>
    </div>
  )
}
