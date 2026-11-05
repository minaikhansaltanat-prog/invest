// Docker жоқ болғанда әзірлеуге арналған жергілікті PostgreSQL 17 (npm: @embedded-postgres/*, тек бинарлар).
// Өндіріс пен staging үшін docker-compose.yml қолданылады. Деректер `.data/pg` ішінде (git-ке түспейді).
//
//   node scripts/db.mjs start   : іске қосады, процесс тірі қалады (Ctrl+C тоқтатады)
//   node scripts/db.mjs stop    : жұмыс істеп тұрған серверді pg_ctl арқылы тоқтатады
//   node scripts/db.mjs status  : порт ашық па, соны көрсетеді
//
// Windows ескертпесі: initdb.exe/postgres.exe Юникод жолды (мысалы, қазақ әріптері бар папка) дұрыс оқымайды.
// Сондықтан барлық жол 8.3 қысқа ASCII атауына ауыстырылады.
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import pg from 'pg'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PGPORT || 54329)
const dbName = process.env.PGDATABASE || 'kfca'
const user = 'kfca'
const password = 'kfca'

/** Windows-та 8.3 қысқа жол (ASCII). Басқа ОЖ-да жолды өзгеріссіз қайтарады. */
function asciiPath(target) {
  if (process.platform !== 'win32' || /^[\x00-\x7F]*$/.test(target)) return target
  // Жол Юникод болғандықтан, аргумент емес, орта айнымалысы арқылы беріледі
  const script = '(New-Object -ComObject Scripting.FileSystemObject).GetFolder($env:KFCA_PATH).ShortPath'
  const out = execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', script], {
    encoding: 'utf8',
    env: { ...process.env, KFCA_PATH: target },
  }).trim()
  if (!out || !/^[\x00-\x7F]*$/.test(out)) {
    throw new Error(`ASCII жол алу мүмкін болмады: ${target}. 8.3 атаулар өшірілген болуы мүмкін.`)
  }
  return out
}

const root = asciiPath(projectRoot)
const dataRoot = path.join(root, '.data')
const dataDir = path.join(dataRoot, 'pg')

function binDir() {
  const platform = { win32: 'windows', darwin: 'darwin', linux: 'linux' }[process.platform]
  const dir = path.join(root, 'node_modules', '@embedded-postgres', `${platform}-${process.arch}`, 'native', 'bin')
  if (!fs.existsSync(dir)) throw new Error(`Postgres бинарлары табылмады: ${dir}. npm install жасаңыз.`)
  return dir
}
const exe = (name) => path.join(binDir(), process.platform === 'win32' ? `${name}.exe` : name)

const portOpen = (p) =>
  new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port: p })
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })

function initCluster() {
  fs.mkdirSync(dataRoot, { recursive: true })
  const pwFile = path.join(os.tmpdir(), `kfca-pg-pw-${process.pid}`)
  fs.writeFileSync(pwFile, password)
  try {
    console.log('[db] деректер қалтасы жасалуда (initdb)...')
    const result = spawnSync(
      exe('initdb'),
      [`--pgdata=${dataDir}`, `--username=${user}`, `--pwfile=${pwFile}`, '--auth=scram-sha-256', '--encoding=UTF8', '--locale=C'],
      { encoding: 'utf8' },
    )
    if (result.status !== 0) {
      throw new Error(`initdb қатесі: ${result.stderr || result.stdout}`)
    }
  } finally {
    fs.rmSync(pwFile, { force: true })
  }
}

async function ensureDatabase() {
  const client = new pg.Client({ host: '127.0.0.1', port, user, password, database: 'postgres' })
  await client.connect()
  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
    if (!rowCount) await client.query(`CREATE DATABASE "${dbName}" ENCODING 'UTF8' TEMPLATE template0`)
  } finally {
    await client.end()
  }
}

async function start() {
  if (await portOpen(port)) {
    console.log(`[db] ${port} порты бос емес: дерекқор іске қосылған деп есептеледі`)
    return
  }
  if (!fs.existsSync(path.join(dataDir, 'PG_VERSION'))) initCluster()

  const server = spawn(
    exe('postgres'),
    ['-D', dataDir, '-p', String(port), '-c', 'listen_addresses=127.0.0.1', '-c', 'max_connections=60', '-c', 'fsync=off'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )
  let ready = false
  const onData = (chunk) => {
    const text = chunk.toString()
    if (/database system is ready to accept connections|система БД готова принимать подключения/i.test(text)) ready = true
    if (/FATAL|PANIC/.test(text)) console.error('[db]', text.trim())
  }
  server.stdout.on('data', onData)
  server.stderr.on('data', onData)
  server.on('exit', (code) => {
    console.log(`[db] сервер тоқтады (код ${code})`)
    process.exit(code ?? 0)
  })

  for (let i = 0; i < 120 && !ready; i++) await new Promise((r) => setTimeout(r, 500))
  if (!ready) {
    server.kill()
    throw new Error('Postgres 60 секундта іске қосылмады')
  }
  await ensureDatabase()
  console.log(`[db] дайын: postgresql://${user}:${password}@127.0.0.1:${port}/${dbName}`)

  const shutdown = () => {
    server.removeAllListeners('exit')
    spawnSync(exe('pg_ctl'), ['stop', '-D', dataDir, '-m', 'fast'], { stdio: 'ignore' })
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

function stop() {
  const result = spawnSync(exe('pg_ctl'), ['stop', '-D', dataDir, '-m', 'fast'], { stdio: 'inherit' })
  process.exit(result.status ?? 0)
}

const command = process.argv[2] ?? 'start'
if (command === 'start') await start()
else if (command === 'stop') stop()
else if (command === 'status') {
  const open = await portOpen(port)
  console.log(open ? `[db] ${port} порты ашық` : `[db] ${port} порты жабық`)
  process.exit(open ? 0 : 1)
} else {
  console.error('Белгісіз команда:', command)
  process.exit(2)
}
