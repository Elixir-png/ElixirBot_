//Plugin by Elixir, Punisher & 888 staff

let handler = async (m, { conn }) => {
  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
  
  const user = global.db.data.users[target] || (global.db.data.users[target] = {})

  if (typeof user.lvl !== 'number') user.lvl = Number(user.level ?? user.rankData?.level ?? 0) || 0
  if (typeof user.msgCount !== 'number') user.msgCount = Number(user.rankData?.messages ?? 0) || 0
  if (!user.money) user.money = 0
  if (!user.level && typeof user.lvl === 'number') user.level = user.lvl
  user.rankData = user.rankData || {}
  user.rankData.level = user.lvl
  user.rankData.messages = user.msgCount

  const LEVEL_STEP = 300 

  let percent = Math.floor((user.msgCount / LEVEL_STEP) * 100)
  if (percent > 100) percent = 100

  let bar = "█".repeat(Math.floor(percent / 10)) + "░".repeat(10 - Math.floor(percent / 10))

  let missing = LEVEL_STEP - user.msgCount
  if (missing < 0) missing = 0

  let text = `
📊 *RANK SYSTEM*

👤 @${target.split('@')[0]}

🏆 Livello: ${user.lvl}
💬 Progress: ${user.msgCount}/${LEVEL_STEP}

${bar} ${percent}%

📈 Mancano: ${missing}
💰 Soldi: ${user.money}€
`

  await conn.sendMessage(m.chat, {
    text,
    mentions: [target]
  }, { quoted: m })
}

handler.command = ['rank']
export default handler
