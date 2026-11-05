// Құпия сөз саясаты (ТТ 14.1, OWASP ASVS L2): кемінде 12 таңба, әріп пен сан, пошта атымен бірдей емес.
// Хэштеу Payload ішінде (pbkdf2-sha256 + кездейсоқ тұз). Жиі қолданылатын құпия сөздердің шағын тізімі қабылданбайды.

export type PasswordProblem = 'too-short' | 'too-long' | 'no-letter' | 'no-digit' | 'common' | 'contains-email'

const common = new Set([
  'password1234',
  'password12345',
  '123456789012',
  'qwerty123456',
  'qwertyuiop12',
  'administrator1',
  'kazakhstan123',
  'qazaqstan123',
  'changeme1234',
  'letmein12345',
])

export function passwordProblems(password: string, email = ''): PasswordProblem[] {
  const problems: PasswordProblem[] = []
  if (password.length < 12) problems.push('too-short')
  if (password.length > 128) problems.push('too-long')
  if (!/\p{L}/u.test(password)) problems.push('no-letter')
  if (!/\d/.test(password)) problems.push('no-digit')
  if (common.has(password.toLowerCase())) problems.push('common')
  const local = email.split('@')[0]?.toLowerCase()
  if (local && local.length >= 4 && password.toLowerCase().includes(local)) problems.push('contains-email')
  return problems
}
