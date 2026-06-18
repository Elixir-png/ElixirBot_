// Plugin by Elixir & 888 staff
function ensureUser(jid) {
  if (!global.db.data.users[jid]) {
    global.db.data.users[jid] = { messaggi: 0 }
  }
}

function ensureChat(chatId) {
  if (!global.db.data.chats[chatId]) {
    global.db.data.chats[chatId] = { topUsers: {} }
  }
  if (!global.db.data.chats[chatId].topUsers) {
    global.db.data.chats[chatId].topUsers = {}
  }
}

let handler = async (m, { conn, args }) => {
  let target = m.mentionedJid?.[0] || (m.quoted?.sender) || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (!target || !target.includes('@s.whatsapp.net')) {
    return conn.reply(m.chat, 'Menziona o rispondi a un utente valido.', m)
  }

  let amount = parseInt(args[1])
  if (isNaN(amount) || amount <= 0) {
    return conn.reply(m.chat, 'Inserisci un numero valido di messaggi.', m)
  }

  ensureUser(target)

  let user = global.db.data.users[target]
  user.messaggi = (user.messaggi || 0) + amount

  if (m.isGroup) {
    ensureChat(m.chat)
    global.db.data.chats[m.chat].topUsers[target] = (global.db.data.chats[m.chat].topUsers[target] || 0) + amount
  }

  conn.reply(m.chat, `✅ Aggiunti *${amount}* messaggi a @${target.split('@')[0]}.`, m, { mentions: [target] })
}

handler.command = /^(aggiungi)$/i
handler.rowner = true

export default handler
