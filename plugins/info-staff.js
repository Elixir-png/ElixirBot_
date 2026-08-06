// Plugin by Elixir & 888 staff
import { readFileSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, usedPrefix }) => {
  const staffData = JSON.parse(readFileSync(join(__dirname, '../data/staff.json'), 'utf8'))

  const botName = global.db?.data?.nomedelbot || global.nomebot || "𝟴𝟴𝟴 𝗕𝗢𝗧"
  const botVersion = global.versione || global.db?.data?.version || "1.0"

  let section = `┃ *🤖 ${botName}*
┃ *Versione:* ${botVersion}
┃━━━━━━━━━━━━━━━━━━\n`

  for (const member of staffData) {
    section += `┃ ${member.emoji} *${member.nome}*\n`
    section += `┃   ├ *Ruolo:* ${member.ruolo}\n`
    if (member.telefono) {
      section += `┃   ├ *Telefono:* wa.me/${member.telefono}\n`
    }
    if (member.instagram) {
      section += `┃   ├ *IG:* instagram.com/${member.instagram}\n`
    }
    if (member.telegram) {
      section += `┃   ├ *TG:* @${member.telegram}\n`
    }
    if (member.bio) {
      section += `┃   └ *About:* ${member.bio}\n`
    }
    section += `┃━━━━━━━━━━━━━━━━━━\n`
  }

  section += `┃ github.com/Elixir-png/ElixirBot_
┃ Email: ElixirBoTSupporto@proton.me
┃ Canale: https://whatsapp.com/channel/0029Vb8Y0igGufJ0xMYJmU40
╰━━━━━━━━━━━━━━━━━━┈`

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

  const bannerUrl = "https://qu.ax/DQsgr.png"

  const buttons = [
    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔐 Contatta Owner" }, type: 1 },
    { buttonId: `${usedPrefix}script`, buttonText: { displayText: "📑 GitHub" }, type: 1 },
    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "◀️ Menu" }, type: 1 }
  ]

  try {
    await conn.sendMessage(m.chat, {
      image: { url: bannerUrl },
      caption: `🌟 *TEAM ${botName.toUpperCase()}*\n\n┏━━━━━━━━━━━━━━━━━━┓\n${section}\n┗━━━━━━━━━━━━━━━━━━┛`,
      footer: `> 💡 Vuoi entrare nello staff? Contatta @${staffData[0].telefono.split('39')[1]}`,
      buttons,
      headerType: 4,
      mentions: mentionedJids
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `🌟 *TEAM ${botName.toUpperCase()}*\n\n┏━━━━━━━━━━━━━━━━━━┓\n${section}\n┗━━━━━━━━━━━━━━━━━━┛`,
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
