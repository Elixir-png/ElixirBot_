// Plugin by Elixir, Punisher & 888 Staff
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const ICON_PATH = path.join(process.cwd(), 'icone', 'Whatsapp.jpeg')
const FONT_FILES = [
  '/usr/share/fonts/truetype/ancient-scripts/Symbola_hint.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
]
const FONT_FILE = FONT_FILES.find((f) => fs.existsSync(f)) || FONT_FILES[1]

const getMentionedUser = (msg) => {
  if (!msg) return null
  if (msg.quoted?.sender) return msg.quoted.sender
  if (Array.isArray(msg.mentionedJid) && msg.mentionedJid.length) return msg.mentionedJid[0]
  if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) return msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
  if (Array.isArray(msg.mentioned) && msg.mentioned.length) return msg.mentioned[0]
  return msg.sender || null
}

let handler = async (m, { conn }) => {
  try {
    const who = getMentionedUser(m)
    let imgBuffer = null

    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    
    if (/image/.test(mime)) {
      await m.reply('⏳ Elaboro l\'immagine allegata...')
      imgBuffer = await q.download()
    } else {
      await m.reply('⏳ Recupero la foto profilo ed elaboro...')
      let profileUrl = ICON_PATH
      try {
        profileUrl = await conn.profilePictureUrl(who, 'image')
      } catch {
        profileUrl = ICON_PATH
      }
      
      if (profileUrl && profileUrl !== ICON_PATH) {
        const response = await fetch(profileUrl)
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          imgBuffer = Buffer.from(arrayBuffer)
        }
      }
    }

    if (!imgBuffer) {
      if (fs.existsSync(ICON_PATH)) {
        imgBuffer = fs.readFileSync(ICON_PATH)
      } else {
        return m.reply('❌ Impossibile recuperare un\'immagine valida da modificare.')
      }
    }

    const fontSpec = `fontfile='${FONT_FILE}'`
    const filter = `[0:v]scale=512:512,hue=s=0,drawtext=${fontSpec}:text='WASTED':fontcolor=0x3333CC:fontsize=96:x=(w-tw)/2:y=(h-th)/2:borderw=5:bordercolor=black[out]`

    const args = ['-y', '-i', 'pipe:0', '-filter_complex', filter, '-map', '[out]', '-frames:v', '1', '-f', 'image2', 'pipe:1']

    const resultBuf = await new Promise((resolve, reject) => {
      const ff = spawn('ffmpeg', args)
      const chunks = []
      let stderr = ''
      
      ff.stdout.on('data', (chunk) => chunks.push(chunk))
      ff.stderr.on('data', (chunk) => { stderr += chunk.toString() })
      ff.on('error', reject)
      ff.on('close', (code) => {
        if (code !== 0) return reject(new Error(`ffmpeg exit code ${code}: ${stderr}`))
        resolve(Buffer.concat(chunks))
      })

      ff.stdin.write(imgBuffer)
      ff.stdin.end()
    })

    if (!resultBuf || !resultBuf.length) {
      return m.reply('❌ Errore durante l\'applicazione del filtro Wasted.')
    }

    await conn.sendFile(m.chat, resultBuf, 'wasted.png', '💀 *W A S T E D*', m)
  } catch (e) {
    console.error('Wasted handler error:', e)
    try { await m.reply('Errore: ' + (e.message || e)) } catch {}
  }
}

handler.help = ['wasted']
handler.tags = ['fun']
handler.command = ['wasted']
export default handler
