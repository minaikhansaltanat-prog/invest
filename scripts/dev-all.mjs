// Бір командамен: дерекқор (қажет болса) + Next.js dev сервері.
// Playwright webServer осыны қолданады. Дерекқор бұрыннан жұмыс істеп тұрса, қайта іске қоспайды.
import { spawn, spawnSync } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pgPort = Number(process.env.PGPORT || 54329)
const appPort = String(process.env.PORT || 3000)

const portOpen = (p) =>
  new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port: p })
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })

const children = []
const killTree = (child) => {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    child.kill('SIGTERM')
  }
}
const shutdown = () => {
  children.forEach(killTree)
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

if (!(await portOpen(pgPort))) {
  const db = spawn(process.execPath, [path.join(root, 'scripts', 'db.mjs'), 'start'], {
    cwd: root,
    stdio: 'inherit',
  })
  children.push(db)
  for (let i = 0; i < 120 && !(await portOpen(pgPort)); i++) {
    await new Promise((r) => setTimeout(r, 500))
  }
  if (!(await portOpen(pgPort))) {
    console.error('[dev-all] дерекқор 60 секундта іске қосылмады')
    shutdown()
  }
}

const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const app = spawn(process.execPath, [nextBin, 'dev', '-p', appPort], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
})
children.push(app)
app.on('exit', (code) => {
  children.forEach(killTree)
  process.exit(code ?? 0)
})
