// Plugin by Elixir & 888 staff
import yts from 'yt-search'
import { exec, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function checkBinaries() {
  try {
    execSync('yt-dlp --version', { stdio: 'pipe' })
  } catch {
    execSync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp', { stdio: 'inherit' })
  }
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' })
  } catch {
    execSync('apt-get install -y ffmpeg 2>/dev/null || apk add ffmpeg 2>/dev/null || pacman -S --noconfirm ffmpeg 2>/dev/null || brew install ffmpeg 2>/dev/null', { stdio: 'inherit' })
  }
}

function isUrl(string) {
  return /^https?:\/\//.test(string)
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚡ *888 BOT*\n\n💡 Scrivi: ${usedPrefix + command} nome canzone`)

  try {
    await checkBinaries()

    let url = text
    if (!isUrl(text)) {
      const search = await yts(text)
      const vid = search.videos[0]
      if (!vid) return m.reply('⚠️ Risultato non trovato.')
      url = vid.url

      if (command === 'play') {
        let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n   🎧  *Play 888 BOT* 🎧\n┗━━━━━━━━━━━━━━━━━━━┛\n\n◈ 📌 *Titolo:* ${vid.title}\n◈ ⏱️ *Durata:* ${vid.timestamp}\n\n*Seleziona il formato:*`

        let buttonsPayload = {
          buttons: [
            { buttonId: `${usedPrefix}playaud ${url}`, buttonText: { displayText: '🎵 Audio (MP3)' }, type: 1 },
            { buttonId: `${usedPrefix}playvid ${url}`, buttonText: { displayText: '🎬 Video (MP4)' }, type: 1 }
          ],
          headerType: 4,
          viewOnce: true
        }

        return await conn.sendMessage(m.chat, {
          image: { url: vid.thumbnail },
          caption: infoMsg
        }, {
          quoted: m,
          message: {
            viewOnceMessage: {
              message: {
                buttonsMessage: buttonsPayload
              }
            }
          }
        })
      }
    }

    await conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } })

    const isAudio = command === 'playaud' || command === 'play'
    const tmpDir = os.tmpdir()
    const fileName = `file_${Date.now()}`
    const outputPath = path.join(tmpDir, `${fileName}.${isAudio ? 'mp3' : 'mp4'}`)

    await new Promise((resolve, reject) => {
      let cmd = isAudio
        ? `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`
        : `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}" "${url}"`

      exec(cmd, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    if (!fs.existsSync(outputPath)) {
      throw new Error('Download fallito con yt-dlp.')
    }

    if (isAudio) {
      const voicePath = path.join(tmpDir, `${fileName}.ogg`)

      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -hide_banner -loglevel error -y -i "${outputPath}" -map_metadata -1 -vn -ar 48000 -ac 1 -c:a libopus -b:a 64k -application voip -f ogg "${voicePath}"`,
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })

      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(voicePath),
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m })

      if (fs.existsSync(voicePath)) fs.unlinkSync(voicePath)

    } else {
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(outputPath),
        mimetype: 'video/mp4',
        caption: '✅ *Scaricato da 888 BOT*'
      }, { quoted: m })
    }

    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('Handler Error:', e.message)
    m.reply('🚀 *Play Error:* Impossibile elaborare la richiesta. Riprova.')
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|playaud|playvid)$/i

export default handler
