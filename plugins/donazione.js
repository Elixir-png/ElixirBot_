//Plugin by Elixir, Punisher & 888 staff

let handler = async (m, { conn }) => {

  const text =
`💖 Donazione

Se vuoi supportare lo sviluppo del bot e del progetto puoi fare una piccola donazione qui:

👉 https://www.paypal.me/ElixirBoT85

Grazie per il supporto da parte dello staff di 888 🙏`;

  await conn.sendMessage(m.chat, { text });
};

handler.command = /^donazione$/i;

export default handler;
