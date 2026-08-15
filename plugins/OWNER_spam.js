// Plugin by Elixir, Punisher & 888 staff

const manually = `𝐆𝐑𝐔𝐏𝐏𝐈 𝐔𝐅𝐅𝐈𝐂𝐈𝐀𝐋𝐈:

╭───⭓
│ 🗨️ ᒪᑌᑎᗩᖇᔕ
│ https://chat.whatsapp.com/Dxfu8kYcAhaIVZIVdKwGRc
│
│ 🗨️ ꪶ爻ꫂ ղҽօղ ꪶ☾ꫂ
│ https://chat.whatsapp.com/DjDBrPXWZLOCAoHMA1oNND
│
│ 🗨️ 𝓖𝓸𝓬𝓬𝓲𝓸𝓵𝓮
│ https://chat.whatsapp.com/JODMBEoCYRuCfxp9xhLjR1
│
│ 🗨️ Eception🖤⌛️‼️
│ https://chat.whatsapp.com/DKcxx1fW5hp9gSmHzj4HPw
│
│ 🗨️ ᙭ᗩ𝑁𝐴𝑿
│ https://chat.whatsapp.com/BkhhYNYyiaE19msAf5QDpc
╰───⭓`
import { generateWAMessageFromContent } from '@realvare/baileys'
const handler = async (m, { args, text }) => {
if (parseInt(args[1])) return m.reply(`Inserisci prima la quantità di messaggi da inviare e poi il testo`)
if (!parseInt(args[0])) return m.reply(`Inserisci nel comando la quantità di messaggi da inviare`)
var number = parseInt(args[0]) ? parseInt(args[0]) : 1

var count = 0
while(true) {
count++
const msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { ['extendedTextMessage'] : { text: args[1] ? text.replace(args[0] + ' ', []) : manually } }, { userJid: conn.user.id }), null, conn.user.jid, { mentions: conn.chats[m.chat].metadata.participants.map(u => conn.decodeJid(u.id)) })
await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
if (count===parseInt(args[0])) break
}}
handler.command = ['spam']
handler.help = ['𝐬𝐩𝐚𝐦'];
handler.tags = ['owner']
handler.owner = true
export default handler
