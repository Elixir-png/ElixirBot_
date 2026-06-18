// Plugin by Elixir, Punisher & 888 Staff

let handler = async (m, { conn }) => {
  const alfabeto = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'
  
  let messaggio = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                  `   🔤  *𝗔𝗟𝗙𝗔𝗕𝗘𝗧𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗢* \n` +
                  `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                  `👉 ${alfabeto}`

  await conn.sendMessage(m.chat, { text: messaggio }, { quoted: m })
}

handler.help = ['alfabeto']
handler.tags = ['fun']
handler.command = /^(alfabeto)$/i

export default handler
