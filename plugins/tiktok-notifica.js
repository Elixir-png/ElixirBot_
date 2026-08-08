// Plugin by 888 Staff - Notifica nuovi video TikTok in tutti i gruppi
import fs from 'fs'

const TIKTOK_USERNAME = 'elixir._regna'
const CHECK_INTERVAL = 5 * 60 * 1000 // Controllo ogni 5 minuti
const STATE_FILE = 'data/tiktok.json'

// Stato persistente: ultimi video già notificati
let lastVideoIds = []
try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    if (Array.isArray(data.videos)) lastVideoIds = data.videos
} catch (e) {}

async function checkNewVideos(conn) {
    try {
        const res = await global.fetch(`https://www.tikwm.com/api/user/posts?unique_id=${TIKTOK_USERNAME}&count=10`)
        if (!res.ok) return
        const json = await res.json()
        const videos = json?.data?.videos || []
        if (!videos.length) return

        // Filtra i video mai visti prima
        const newVideos = videos.filter(v => v.video_id && !lastVideoIds.includes(v.video_id))
        if (!newVideos.length) return

        // Aggiorna lo stato con gli ultimi video (in ordine, i più recenti primi)
        lastVideoIds = videos.map(v => v.video_id)
        try {
            fs.writeFileSync(STATE_FILE, JSON.stringify({ videos: lastVideoIds }))
        } catch (e) {}

        // Invia il link + descrizione + tag in tutti i gruppi dove c'è il bot
        const groups = Object.keys(global.db?.data?.chats || {})
            .filter(id => id.endsWith('@g.us'))

        for (const groupId of groups) {
            for (const v of newVideos) {
                const desc = (v.title || 'Video TikTok').trim()
                const tags = (desc.match(/#[\w]+/g) || [])
                const tagsText = tags.length ? tags.join(' ') : 'Nessun tag'
                const link = `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${v.video_id}`
                const text = `🎬 *NUOVO VIDEO TIKTOK*\n\n📝 *Descrizione:* ${desc}\n\n🏷️ *Tag:* ${tagsText}\n\n🔗 ${link}`

                try {
                    await conn.sendMessage(groupId, { text })
                } catch (e) {
                    console.error(`[TikTok] Errore invio in ${groupId}:`, e)
                }
            }
        }

        console.log(`[TikTok] Notificati ${newVideos.length} nuovi video in ${groups.length} gruppi`)
    } catch (e) {
        console.error('[TikTok] Errore controllo nuovi video:', e)
    }
}

let handler = async (m) => {}

// Attivo sempre: viene eseguito su ogni messaggio, ma avvia il controllo solo una volta
handler.all = async function (m) {
    if (!global._tiktokNotifierStarted) {
        global._tiktokNotifierStarted = true
        const conn = this
        // Primo controllo dopo 10 secondi dall'avvio, poi ogni 5 minuti
        setTimeout(() => {
            checkNewVideos(conn)
            setInterval(() => checkNewVideos(conn), CHECK_INTERVAL)
        }, 10000)
    }
}

handler.command = []
handler.tags = ['main']
handler.help = []
handler.disabled = false

export default handler