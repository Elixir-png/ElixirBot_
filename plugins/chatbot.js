// Plugin by Elixir & 888 staff
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const chatbotDataPath = path.join(__dirname, '../data/chatbot.json')

const GEMINI_KEY = global.APIKeys?.gemini && global.APIKeys.gemini !== '333' ? global.APIKeys.gemini : (global.gemini && global.gemini !== '333' ? global.gemini : 'AQ.Ab8RN6LlbHx3696_NS_poCPupeX_zQyEvW40pcFgbpGQS77viQ')
const OPENROUTER_KEY = global.APIKeys?.openrouter && global.APIKeys.openrouter !== '333' ? global.APIKeys.openrouter : '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'

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(chatbotDataPath, 'utf8'))
  } catch (e) {
    return {
      sessions: {},
      defaultProvider: 'openrouter',
      maxHistory: 10,
      welcomeMessage: 'Ciao! Sono l\'AI del 888 Bot. Chiedimi pure qualunque cosa!',
      systemPrompt: 'Sei un assistente AI amichevole integrato nel bot WhatsApp. Rispondi in modo conciso e utile. Sei ironico e divertente, ma rispetta sempre.'
    }
  }
}

function getSession(chatId) {
  const cfg = loadConfig()
  if (!cfg.sessions) cfg.sessions = {}
  if (!cfg.sessions[chatId]) cfg.sessions[chatId] = { messages: [] }
  saveConfig(cfg)
  return { cfg, session: cfg.sessions[chatId] }
}

function saveConfig(cfg) {
  try {
    fs.writeFileSync(chatbotDataPath, JSON.stringify(cfg, null, 2))
  } catch (e) {}
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function callGemini(messages) {
  const res = await fetchWithTimeout('https://generalllm.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_KEY
    },
    body: JSON.stringify({
      model: 'gemini-1.5-flash',
      messages: messages
    })
  }, 10000)
  if (!res.ok) throw new Error('Gemini fallita')
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callOpenRouter(messages) {
  const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/Elixir-png/ElixirBot_',
      'X-Title': '888 Bot'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-70b-chat:free',
      messages: messages
    })
  }, 8000)
  if (!res.ok) throw new Error('OpenRouter fallita')
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callPollinations(messages) {
  const res = await fetchWithTimeout('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages,
      model: 'gpt-4o',
      json: false
    })
  }, 8000)
  if (!res.ok) throw new Error('Pollinations fallita')
  return await res.text()
}

async function getAIResponse(messages) {
  if (GEMINI_KEY) {
    try {
      const reply = await callGemini(messages)
      if (reply && reply.trim()) return reply
    } catch (e) {}
  }
  if (OPENROUTER_KEY) {
    try {
      const reply = await callOpenRouter(messages)
      if (reply && reply.trim()) return reply
    } catch (e) {}
  }
  try {
    const reply = await callPollinations(messages)
    if (reply && reply.trim()) return reply
  } catch (e) {}

  return 'Scusa, ho avuto un piccolo intoppo. Riprova tra pochi secondi.'
}

async function resolveSenderName(conn, sender, fallback = 'Utente') {
  if (!conn || typeof conn.getName !== 'function') {
    return fallback
  }

  try {
    const name = await Promise.resolve(conn.getName(sender))
    if (typeof name === 'string' && name.trim()) return name
  } catch (e) {}

  return fallback
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const cfg = loadConfig()
  const chat = global.db.data.chats?.[m.chat] || {}
  const isEnabled = chat.ai !== false

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Il chatbot funziona solo nei gruppi. Usa il comando in un gruppo.', m)
  }

  if (!text || text.toLowerCase() === 'status') {
    return conn.reply(m.chat, `Chatbot *STATO*\n\n${isEnabled ? 'Attivo' : 'Disattivato'}\nProvider: *${cfg.defaultProvider}*\n\n• ${usedPrefix}chatbot on  — Attiva\n• ${usedPrefix}chatbot off — Disattiva\n• ${usedPrefix}chatbot reset — Pulisci conversazione\n• ${usedPrefix}chatbot help — Questo messaggio`, m)
  }

  const sub = text.toLowerCase().trim()

  if (sub === 'on' || sub === 'attiva') {
    chat.ai = true
    global.db.data.chats[m.chat] = chat
    return conn.reply(m.chat, 'Chatbot *ATTIVATO*! Ora rispondo quando mi menzioni o rispondi ai miei messaggi nel gruppo.', m)
  }

  if (sub === 'off' || sub === 'disattiva') {
    chat.ai = false
    global.db.data.chats[m.chat] = chat
    return conn.reply(m.chat, 'Chatbot *DISATTIVATO*. Non rispondero piu automaticamente nel gruppo.', m)
  }

  if (sub === 'reset' || sub === 'pulisci') {
    const { cfg, session } = getSession(m.chat)
    session.messages = []
    saveConfig(cfg)
    return conn.reply(m.chat, 'Conversazione *PULITA*! Sessione resettata.', m)
  }

  return conn.reply(m.chat, `Chatbot *COMANDI*\n\n• ${usedPrefix}chatbot — Stato\n• ${usedPrefix}chatbot on — Attiva\n• ${usedPrefix}chatbot off — Disattiva\n• ${usedPrefix}chatbot reset — Pulisci conversazione\n• ${usedPrefix}chatbot help — Questo messaggio\n\nMenziona il bot o rispondi ai suoi messaggi per chattare nel gruppo!`, m)
}

handler.before = async (m, { conn }) => {
  if (!m.message || m.mtype === 'reaction' || m.mtype === 'pollUpdateMessage') return
  if (m.fromMe) return
  if (!m.isGroup) return

  const chat = global.db.data.chats?.[m.chat]
  if (!chat || chat.ai === false) return

  const botJid = conn.user?.jid

  const isMentioned = m.mentionedJid && m.mentionedJid.includes(botJid)
  const isReplyAlBot = m.quoted && m.quoted.sender === botJid

  if (!isMentioned && !isReplyAlBot) return

  const prompt = m.text || (Object.values(m.message || {})[0]?.text || Object.values(m.message || {})[0]?.caption || '')
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 1) return

  const senderName = await resolveSenderName(conn, m.sender, m.pushName || 'Utente')
  const cfg = loadConfig()
  const maxHistory = cfg.maxHistory || 10
  const systemPrompt = cfg.systemPrompt || 'Sei un assistente AI amichevole. Rispondi in modo conciso.'

  const { session } = getSession(m.chat)
  if (session.messages.length === 0) {
    session.messages.push({ role: 'system', content: systemPrompt })
  }

  session.messages.push({ role: 'user', content: `${senderName}: ${prompt}` })

  if (session.messages.length > maxHistory + 2) {
    session.messages = [session.messages[0], ...session.messages.slice(-(maxHistory + 1))]
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)
    const reply = await getAIResponse(session.messages)

    session.messages.push({ role: 'assistant', content: reply })
    if (session.messages.length > maxHistory + 2) {
      session.messages = [session.messages[0], ...session.messages.slice(-(maxHistory + 1))]
    }

    await conn.reply(m.chat, reply, m)
    await conn.sendPresenceUpdate('paused', m.chat)
  } catch (e) {
    await conn.reply(m.chat, 'Errore durante la generazione della risposta. Riprova piu tardi.', m)
    await conn.sendPresenceUpdate('paused', m.chat)
  }
}

handler.help = ['chatbot']
handler.tags = ['ai']
handler.command = ['chatbot', 'chat', 'ai']
handler.group = true

export default handler