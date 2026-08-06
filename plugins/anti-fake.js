// Plugin by Elixir & 888 staff

export async function before(m, { conn, participants, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (!m.isGroup) return false
  if (m.fromMe) return false

  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.antifake) return false

  if (!isBotAdmin) return false

  const sender = m.sender
  if (!sender || !sender.includes('@s.whatsapp.net')) return false

  const number = sender.split('@')[0]

  const isFakeNumber = 
    number.length < 8 ||
    /^(\d)\1{5,}$/.test(number) ||
    /^012345|^123456|^234567|^345678|^456789|^987654|^876543|^765432|^654321|^543210/.test(number) ||
    /^(0{7,}|1{7,}|2{7,}|3{7,}|4{7,}|5{7,}|6{7,}|7{7,}|8{7,}|9{7,})$/.test(number)

  if (!isFakeNumber) return false

  if (isAdmin || isOwner || isROwner) return false

  const user = global.db.data.users[sender]
  if (user && (user.messaggi || 0) >= 3) return false

  try {
    await conn.sendMessage(m.chat, {
      text: `🚫 *NUMERO TEMPORANEO RILEVATO!*\n\n` +
        `📱 *Numero:* ${number}\n` +
        `👤 *Nome:* ${m.pushName || 'Sconosciuto'}\n\n` +
        `I numeri usa-e-getta non sono ammessi in questo gruppo.`
    })

    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
    return true
  } catch (e) {
    return false
  }
}

export const disabled = false