// Plugin by Elixir
import fs from 'fs'

const STATE_FILE = 'data/tiktok.json'

let lastVideoIds = []
try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    if (Array.isArray(data.videos)) lastVideoIds = data.videos
} catch (e) {}

function extractVideoId(url) {
    const m = url.match(/\/video\/(\d+)/)
    return m ? m[1] : null
}

async function getVideoInfo(videoId) {
    const url = `https://www.tiktok.com/@elixir._regna/video/${videoId}`
    const res = await global.fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    })
    if (!res.ok) throw new Error('oembed non raggiungibile')
    const json = await res.json()
    const desc = (json?.title || 'Video TikTok').trim()
    const tags = (desc.match(/#[\w]+/g) || [])
    return { videoId, desc, tags, link: url }
}

async function broadcastVideo(conn, info) {
    const tagsText = info.tags.length ? info.tags.join(' ') : 'Nessun tag'
    const text = `🎬 *NUOVO VIDEO TIKTOK*\n\n📝 *Descrizione:* ${info.desc}\n\n🏷️ *Tag:* ${tagsText}\n\n🔗 ${info.link}`

    const groups = Object.keys(global.db?.data?.chats || {})
        .filter(id => id.endsWith('@g.us'))

    let sent = 0
    for (const groupId of groups) {
        try {
            await conn.sendMessage(groupId, { text })
            sent++
        } catch (e) {
            console.error(`[TikTok] Errore invio in ${groupId}:`, e)
        }
    }
    return sent
}

let handler = async (m, { conn, args }) => {
    const input = (args[0] || '').trim()
    if (!input) {
        await m.reply(`📌 *Come usare il comando:*\n\nIncolla il link del video TikTok appena pubblicato:\n\n*${global.prefix || '.'}tiktok* https://www.tiktok.com/@elixir._regna/video/123456789\n\nIl bot invierà il link con descrizione e tag in *tutti i gruppi*.`)
        return
    }

    const videoId = extractVideoId(input)
    if (!videoId) {
        await m.reply('❌ *Link TikTok non valido.*\n\nAssicurati che sia un link del tipo:\n`https://www.tiktok.com/@utente/video/123456789`')
        return
    }

    if (lastVideoIds.includes(videoId)) {
        await m.reply('⚠️ *Questo video è già stato notificato nei gruppi.*')
        return
    }

    await m.reply('🔍 *Recupero informazioni video...*')

    try {
        const info = await getVideoInfo(videoId)

        lastVideoIds.unshift(videoId)
        lastVideoIds = lastVideoIds.slice(0, 50)
        try {
            fs.writeFileSync(STATE_FILE, JSON.stringify({ videos: lastVideoIds }))
        } catch (e) {}

        const sent = await broadcastVideo(conn, info)
        await m.reply(`✅ *Video inviato in ${sent} gruppi!*\n\n📝 *Descrizione:* ${info.desc}\n\n🏷️ *Tag:* ${info.tags.length ? info.tags.join(' ') : 'Nessun tag'}`)
    } catch (e) {
        console.error('[TikTok] Errore:', e)
        await m.reply(`❌ *Errore durante il recupero del video:*\n\n${e.message || 'Errore sconosciuto'}\n\nRiprova più tardi.`)
    }
}

handler.command = ['tiktok', 'tiktoknotifica', 'nuovitiktok']
handler.tags = ['main']
handler.help = ['tiktok <link>']
handler.disabled = false

export default handler