//Plugin by Elixir, Punisher & 888 staff
export async function before(m) {
  if (!m.isGroup) return
  if (!m.text) return

  global.bounty = global.bounty || {}
  let data = global.bounty[m.chat] || {}

  let cooldown = (Math.floor(Math.random() * 31) + 30) * 60 * 1000

  if (data.last && Date.now() - data.last < cooldown) return
  if (data.active) return

  if (Math.random() > 0.002) return

  let metadata = await this.groupMetadata(m.chat)
  let members = metadata.participants.map(p => p.id)

  let target = members[Math.floor(Math.random() * members.length)]
  let reward = Math.floor(Math.random() * (10000 - 100 + 1)) + 100

  global.bounty[m.chat] = {
    active: true,
    target,
    reward,
    last: Date.now(),
    setter: null
  }

  await this.sendMessage(m.chat, {
    text: `🎯 𝐓𝐀𝐆𝐋𝐈𝐀 𝐀𝐓𝐓𝐈𝐕𝐀!

👤 @${target.split('@')[0]} ha una taglia di ${reward}€

💥 Scrivi ''.spara'' entro 30 secondi per riscattarla!`,
    contextInfo: {
      mentionedJid: [target]
    }
  })

  setTimeout(async () => {
    let current = global.bounty?.[m.chat]
    if (!current || !current.active) return
    current.active = false

    await this.sendMessage(m.chat, {
      text: `⌛ Tempo scaduto! Nessuno ha preso la taglia.`
    })
  }, 30000)
}
