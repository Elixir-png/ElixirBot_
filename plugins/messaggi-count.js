// Plugin by Elixir & 888 staff
export async function all(m) {
  if (!global.db.data) return
  if (!m.sender || !m.chat) return
  if (m.fromMe) return
  if (m.mtype === 'pollUpdateMessage' || m.mtype === 'reactionMessage') return
  if (!m.message) return
  if (m.sender.endsWith('@g.us') || m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter')) return

  let sender = m.sender.includes(':') ? m.sender.split(':')[0] + '@s.whatsapp.net' : m.sender
  if (!sender.endsWith('@s.whatsapp.net')) return

  let user = global.db.data.users[sender]
  if (!user) {
    global.db.data.users[sender] = { messaggi: 0 }
    user = global.db.data.users[sender]
  }

  user.messaggi = (user.messaggi || 0) + 1

  if (m.isGroup) {
    let chat = global.db.data.chats[m.chat]
    if (!chat) {
      global.db.data.chats[m.chat] = { topUsers: {} }
      chat = global.db.data.chats[m.chat]
    }
    if (!chat.topUsers) chat.topUsers = {}
    chat.topUsers[sender] = (chat.topUsers[sender] || 0) + 1
  }
}

export default { all }
