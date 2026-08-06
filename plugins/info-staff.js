// Plugin by Elixir & 888 staff
import { readFileSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, usedPrefix }) => {
  const staffData = JSON.parse(readFileSync(join(__dirname, '../data/staff.json'), 'utf8'))

  const botName = global.db?.data?.nomedelbot || global.nomebot || "𝟴𝟴𝟴 𝗕𝗢𝗧"
  const botVersion = global.versione || global.db?.data?.version || "1.0"

  let text = `🌟 *TEAM ${botName.toUpperCase()}*\n\n`
  text += `🤖 *${botName}* · v${botVersion}\n\n`

  for (const member of staffData) {
    text += `${member.emoji} *${member.nome}* · ${member.ruolo}\n`
    if (member.telefono) {
      text += `   📱 wa.me/${member.telefono}\n`
    }
    if (member.instagram) {
      text += `   📷 instagram.com/${member.instagram}\n`
    }
    if (member.telegram) {
      text += `   ✈️ @${member.telegram}\n`
    }
    if (member.bio) {
      text += `   💬 ${member.bio}\n`
    }
    text += `\n`
  }

  text += `──────────────────\n`
  text += `📎 *GitHub*\n`
  text += `📧 *Email:* ElixirBoTSupporto@proton.me\n`
  text += `📢 *Canale*\n`
  text += `──────────────────\n\n`
  text += `💡 Vuoi entrare nello staff? Contatta l'owner`

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

  const buttons = [
    { buttonId: `https://wa.me/393297014539`, buttonText: { displayText: "🔐 Contatta Owner" }, type: 2 },
    { buttonId: `https://github.com/Elixir-png/ElixirBot_`, buttonText: { displayText: "📑 GitHub" }, type: 2 },
    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "◀️ Menu" }, type: 1 }
  ]

  try {
    await conn.sendMessage(m.chat, {
      text,
      footer: `> 💡 Vuoi entrare nello staff? Contatta @${staffData[0].telefono.split('39')[1]}`,
      buttons,
      headerType: 1,
      mentions: mentionedJids
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text,
      footer: `> 💡 Vuoi entrare nello staff? Contatta un owner`,
      buttons,
      headerType: 1,
      mentions: mentionedJids
    }, { quoted: m })
  }

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