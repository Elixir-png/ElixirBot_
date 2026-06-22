//Plugin by Elixir, Punisher & 888 staff

let handler = async (m, { conn, text, usedPrefix: prefix }) => {
  if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.')

  let args = text.trim().split(/\s+/)
  let who = m.mentionedJid && m.mentionedJid[0]
  let amount = parseInt(args[args.length - 1])

  if (!who || isNaN(amount) || amount < 100) {
    return m.reply(`🤑 *COME IMPOSTARE UNA TAGLIA*\n\n➤ ${prefix}settaglia @user <importo>\n\nEsempio: ${prefix}settaglia @utente 500\n\n• Minimo 100€\n• I soldi vengono presi dal tuo portafoglio\n• Se nessuno riscatta la taglia in 30s, riavrai i tuoi soldi`)
  }

  if (who === m.sender) return m.reply('❌ Non puoi mettere una taglia su te stesso.')

  if (who === conn.user.jid) return m.reply('❌ Non puoi mettere una taglia sul bot.')

  let users = global.db.data.users
  users[m.sender] = users[m.sender] || { money: 0 }

  if ((users[m.sender].money || 0) < amount) {
    return m.reply(`❌ Non hai abbastanza soldi! Hai solo ${users[m.sender].money || 0}€, ti servono ${amount}€.`)
  }

  global.bounty = global.bounty || {}
  if (global.bounty[m.chat]?.active) {
    return m.reply('❌ C\'è già una taglia attiva in questo gruppo! Riscatta prima quella.')
  }

  users[m.sender].money -= amount

  global.bounty[m.chat] = {
    active: true,
    target: who,
    reward: amount,
    last: Date.now(),
    setter: m.sender
  }

  await conn.sendMessage(m.chat, {
    text: `🎯 𝐓𝐀𝐆𝐋𝐈𝐀 𝐏𝐀𝐆𝐀𝐌𝐄𝐍𝐓𝐎 𝐈𝐌𝐏𝐎𝐒𝐓𝐀𝐓𝐀!
    
👤 @${who.split('@')[0]} ha una taglia di ${amount}€
💰 Pagata da @${m.sender.split('@')[0]}

💥 Scrivi ''.spara'' entro 30 secondi per riscattarla!`,
    contextInfo: {
      mentionedJid: [who, m.sender]
    }
  })

  setTimeout(async () => {
    let current = global.bounty?.[m.chat]
    if (!current || !current.active) return
    if (current.setter !== m.sender) return

    current.active = false
    
    let setterUser = global.db.data.users[current.setter]
    if (setterUser) {
      setterUser.money = (setterUser.money || 0) + current.reward
    }

    await conn.sendMessage(m.chat, {
      text: `⌛ Tempo scaduto! @${current.setter.split('@')[0]} si riprende i suoi ${current.reward}€.`,
      mentions: [current.setter]
    })
  }, 30000)
}

handler.command = /^(settaglia|bounty)$/i
handler.group = true

export default handler
