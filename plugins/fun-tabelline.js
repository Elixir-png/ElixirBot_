// Plugin by Elixir, Punisher & 888 Staff

let handler = async (m, { conn }) => {
  let messaggio = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                  `   🔢  *𝗧𝗔𝗕𝗘𝗟𝗟𝗜𝗡𝗘 𝗗𝗔𝗟𝗟'𝟭 𝗔𝗟 𝟭𝟬* \n` +
                  `┗━━━━━━━━━━━━━━━━━━━┛\n\n`

  for (let i = 1; i <= 10; i++) {
    messaggio += `▪️ *𝗧𝗮𝗯𝗲𝗹𝗹𝗶𝗻𝗮 𝗱𝗲𝗹 ${i}:*\n`
    let riga = []
    for (let j = 1; j <= 10; j++) {
      riga.push(`${i}×${j}=*${i * j}*`)
    }
    messaggio += riga.join('  |  ') + '\n\n'
  }

  await conn.sendMessage(m.chat, { text: messaggio.trim() }, { quoted: m })
}

handler.help = ['tabelline']
handler.tags = ['fun', 'edu']
handler.command = /^(tabelline)$/i

export default handler
