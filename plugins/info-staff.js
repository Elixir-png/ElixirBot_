// Plugin by Elixir & 888 staff
import { readFileSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, usedPrefix }) => {
  const staffData = JSON.parse(readFileSync(join(__dirname, '../data/staff.json'), 'utf8'))

  const botName = global.db?.data?.nomedelbot || global.nomebot || "𝟴𝟴𝟴 𝗕𝗢𝗧"
  const botVersion = global.versione || global.db?.data?.version || "1.0"

  let text = `╭━━━〔 👑 *TEAM ${botName.toUpperCase()}* 〕━━━┈\n`
  text += `┃ 🤖 *${botName}*\n`
  text += `┃ 📌 *v${botVersion}*\n`
  text += `┃━━━━━━━━━━━━━━━━━━\n`

  for (const member of staffData) {
    text += `┃ 👤 *${member.nome}* · ${member.ruolo}\n`
    if (member.telefono) {
      text += `┃   · 📱 wa.me/${member.telefono}\n`
    }
    if (member.instagram) {
      text += `┃   · 📷 instagram.com/${member.instagram}\n`
    }
    if (member.telegram) {
      text += `┃   · ✈️ @${member.telegram}\n`
    }
    if (member.bio) {
      text += `┃   · 💬 ${member.bio}\n`
    }
    text += `┃━━━━━━━━━━━━━━━━━━\n`
  }

  text += `┃ 📎 *GitHub:*\n`
  text += `┃   · https://github.com/Elixir-png/ElixirBot_\n`
  text += `┃ 📧 *Email:* ElixirBoTSupporto@proton.me\n`
  text += `┃ 📢 *Canale:*\n`
  text += `┃   · https://whatsapp.com/channel/0029Vb8Y0igGufJ0xMYJmU40\n`
  text += `╰━━━━━━━━━━━━━━━━━━┈\n\n`
  text += `💡 Vuoi entrare nello staff? Contatta wa.me/${staffData[0].telefono}`

  const mentionedJids = staffData
    .filter(m => m.telefono)
    .map(m => `${m.telefono}@s.whatsapp.net`)

  const contacts = staffData
    .filter(m => m.telefono)
    .map(m => ({
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:${m.nome}
ORG:${botName} - ${m.ruolo}
TEL;type=CELL;type=VOICE;waid=${m.telefono}:${m.telefono.startsWith('39') ? '+' : '+'}${m.telefono}
END:VCARD`
    }))

  await conn.sendMessage(m.chat, {
    text,
    mentions: mentionedJids
  }, { quoted: m })

  if (contacts.length > 0) {
    try {
      await conn.sendMessage(m.chat, {
        contacts: {
          contacts: contacts,
          subject: `Team ${botName}`
        }
      }, { quoted: m })
    } catch (e) {}
  }

  m.react('👑')
}

handler.help = ['staff', 'team']
handler.tags = ['main']
handler.command = ['staff', 'team']

export default handler