//Plugin by Elixir & Punisher staff

let handler = async (m, { conn }) => {

const text = 
`╭─────────╮\n┃ 𝐈𝐍𝐅𝐎 𝐒𝐓𝐀𝐅𝐅 ꙰ 𝐄𝐋𝐈𝐗𝐈𝐑 𝐁𝐎𝐓 ꙰
┃
┃ 👑 𝐎𝐖𝐍𝐄𝐑
┃ • 𝐄𝐥𝐢𝐱𝐢𝐫: wa.me/639752917233
┃
┃ 🔱 𝐂𝐎-𝐎𝐖𝐍𝐄𝐑
┃ • 𝐏𝐮𝐧𝐢𝐬𝐡𝐞𝐫: wa.me/79524931364
┃
┃ 🧑‍💻 𝐒𝐓𝐀𝐅𝐅
┃ • 𝗚𝗵𝗼𝘀𝘁: wa.me/212785655331
┃━━━━━━━━━━━━━━
┃ 🌐 𝐋𝐈𝐍𝐊 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌
┃ • 𝐄𝐥𝐢𝐱𝐢𝐫: https://instagram.com/eli.xir_gg
┃ • 𝐀𝐫𝐭𝐲: https://instagram.com/arty.340
┃━━━━━━━━━━━━━━
┃ 📲 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌
┃ • 𝐄𝐥𝐢𝐱𝐢𝐫: @ElixirKG
┃ • 𝐏𝐮𝐧𝐢𝐬𝐡𝐞𝐫: @punishth
┃━━━━━━━━━━━━━━
┃ 💻 𝐆𝐈𝐓𝐇𝐔𝐁
┃ • https://github.com/Elixir-png/ElixirBot_
┃━━━━━━━━━━━━━━
┃📺 𝐂𝐀𝐍𝐀𝐋𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏
┃https://whatsapp.com/channel/0029Vb7NyC67tkj0robcbw24
┃━━━━━━━━━━━━━━
┃ ℹ️ 𝐃𝐄𝐒𝐂𝐑𝐈𝐙𝐈𝐎𝐍𝐄 𝐁𝐎𝐓
┃𝐄𝐋𝐈𝐗𝐈𝐑 𝐁𝐎𝐓 è il bot più richiesto in\n┃ Italia, con una base totalmente nuova\n┃ versione 2026 creata personalmente\n┃ dallo staff, è in grado di gestire\n┃ gruppi. Nel bot sono inclusi\n┃ minigiochi, comandi staff,\n┃ comandi owner e tanto altro,\n┃ facilmente scaricabile dal link di\n┃ github. Info o difficoltà? Contatta\n┃ lo staff per avere supporto.
╰─────────╯
`

const mentions = [
'639752917233@s.whatsapp.net',
'79524931364@s.whatsapp.net'
]

await conn.sendMessage(m.chat, {
text,
mentions,
contextInfo: {
externalAdReply: {
title: '𝐒𝐓𝐀𝐅𝐅 ꙰ 𝐄𝐋𝐈𝐗𝐈𝐑 𝐁𝐎𝐓 ꙰',
body: '𝐞𝐧𝐭𝐫𝐚 𝐧𝐞𝐥 𝐜𝐚𝐧𝐚𝐥𝐞 𝐝𝐢 𝐄𝐋𝐈𝐗𝐈𝐑 𝐛𝐨𝐭!',
sourceUrl: 'https://whatsapp.com/channel/0029Vb7NyC67tkj0robcbw24',
mediaType: 1,
renderLargerThumbnail: true
}
}
}, { quoted: m })

m.react('👑')
}

handler.help = ['staff']
handler.tags = ['admin']
handler.command = ['staff']

export default handler
