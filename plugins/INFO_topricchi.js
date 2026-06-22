//Plugin by Elixir, Punisher & 888 staff

const handler = async (m, { conn, groupMetadata }) => {
  if (!m.isGroup) return await conn.sendMessage(m.chat, { text: 'Questo comando funziona solo nei gruppi.' })

  groupMetadata = groupMetadata || await conn.groupMetadata?.(m.chat).catch(() => null)
  const participants = groupMetadata?.participants || []

  if (!participants.length) {
    return await conn.sendMessage(m.chat, { text: 'Impossibile recuperare i membri del gruppo.' })
  }

  const usersDb = global.db.data.users || {}

  const groupMemberJids = new Set(participants.map(p => p.id))

  let values = Array.from(groupMemberJids)
    .filter(jid => jid && !jid.endsWith('@g.us'))
    .map(jid => {
      const user = usersDb[jid] || {}
      const wallet = Number(user.money) || 0
      const bank = Number(user.bank) || 0
      return {
        jid,
        wallet,
        bank,
        total: wallet + bank
      }
    })
    .filter(user => user.total > 0)

  if (!values.length) {
    return await conn.sendMessage(m.chat, { text: 'Nessun dato di ricchezza disponibile per i membri di questo gruppo.' })
  }

  values.sort((a, b) => b.total - a.total)

  const top = values.slice(0, 10)
  const header = `💰 𝐓𝐎𝐏 𝟏𝟎 𝐑𝐈𝐂𝐂𝐇𝐈 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎\n` +
    `👥 Gruppo: ${groupMetadata.subject || m.chat.split('@')[0]}\n` +
    `📌 Totale = Contanti + Banca\n\n`

  const lines = top.map((user, idx) => {
    const rank = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][idx] || `${idx + 1}.`
    return `${rank} @${user.jid.split('@')[0]} — ${user.total.toLocaleString('it-IT')}€`
  }).join('\n')

  await conn.sendMessage(m.chat, {
    text: header + lines,
    mentions: top.map(user => user.jid)
  })
}

handler.help = ['topricchi', 'toprich', 'ricchi']
handler.tags = ['group', 'economy']
handler.command = ['topricchi', 'toprich', 'ricchi']

export default handler
