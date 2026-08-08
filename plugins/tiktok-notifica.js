// Plugin by Elixir
import fs from 'fs'

const TIKTOK_USERNAME = 'elixir._regna'
const STATE_FILE = 'data/tiktok.json'

let lastVideoIds = []
try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    if (Array.isArray(data.videos)) lastVideoIds = data.videos
} catch (e) {}

async function fetchLatestVideos() {
    const res = await global.fetch(`https://www.tikwm.com/api/user/posts?unique_id=${TIKTOK_USERNAME}&count=10`)
    if (!res.ok) throw new Error('API TikTok non raggiungibile')
    const json = await res.json()
    return json?.data?.videos || []
}

async function checkNewVideos(conn) {
    const videos = await fetchLatestVideos()
    if (!videos.length) return { newVideos: [], groups: 0 }

    const newVideos = videos.filter(v => v.video_id && !lastVideoIds.includes(v.video_id))

    lastVideoIds = videos.map(v => v.video_id)
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify({ videos: lastVideoIds }))
    } catch (e) {}

    if (!newVideos.length) return { newVideos: [], groups: 0 }

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

    return { newVideos, groups: groups.length }
}

let handler = async (m, { conn, usedPrefix }) => {
    await m.reply('🔍 *Controllo nuovi video TikTok in corso...*\n\nAccount: @' + TIKTOK_USERNAME)

    try {
        const { newVideos, groups } = await checkNewVideos(conn)

        if (!newVideos.length) {
            await m.reply('✅ *Nessun nuovo video trovato.*\n\nI video già pubblicati sono già stati notificati nei gruppi.')
            return
        }

        const msg = `🎉 *Trovati ${newVideos.length} nuovi video!*\n\n📨 Inviati in *${groups}* gruppi.\n\nVideo:\n` +
            newVideos.map(v => `• https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${v.video_id}`).join('\n')

        await m.reply(msg)
    } catch (e) {
        console.error('[TikTok] Errore controllo nuovi video:', e)
        await m.reply(`❌ *Errore durante il controllo TikTok:*\n\n${e.message || 'Errore sconosciuto'}\n\nRiprova più tardi.`)
    }
}

handler.command = ['tiktok', 'tiktokcheck', 'nuovitiktok']
handler.tags = ['main']
handler.help = ['tiktok']
handler.disabled = false

export default handler