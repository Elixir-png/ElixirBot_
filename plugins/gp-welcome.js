//Plugin by Elixir, Punisher & 888 staff

import fetch from 'node-fetch';

const byeMessages = [
  `👋 @user ha lasciato il gruppo @group. Finalmente un po' di pace!`,
  `😏 @user è uscito da @group. Non ci mancherai!`,
  `🚪 @user ha abbandonato @group. Buona liberazione!`,
  `👋 Addio @user! Non ti sentiremo la mancanza.`,
  `💔 @user ha lasciato @group. Chi se ne frega!`,
  `🌅 @user se n'è andato/a da @group. Meglio così!`,
  `😒 @user ha deciso di andarsene da @group. Che sollievo!`,
  `🙄 @user è uscito da @group. Speriamo non torni!`,
  `😤 @user ha lasciato @group. Un problema in meno!`,
  `👋 @user se n'è andato/a. Non fare che ti richiamiamo!`
];

const welcomeMessages = {
  buoni: [
    `🎉 Benvenuto @user nel gruppo @group! 🎉

📸 Per favore presentati con una *foto 1vis* (foto viso)!

👤 Scrivi il tuo *nome*
🎂 La tua *età*
📍 E di *dove sei*

Così tutti ti conoscono meglio! 😊`,
    `👋 Ciao @user, benvenuto/a in @group!

📸 Ti chiediamo gentilmente di presentarti con una *foto 1vis*

📝 Dicci:
• Il tuo *nome*
• La tua *età*
• Da *dove vieni*

Grazie e buona permanenza! 🌟`,
    `✨ Un nuovo membro è arrivato! Benvenuto @user!

📸 Per favore, presentati con una *foto 1vis* così ti riconosciamo!

🗣️ Raccontaci:
• *Nome*
• *Età*
• *Provenienza*

Benvenuto in @group! 🎊`,
    `🎊 Grande novità! @user si è unito a noi!

📸 Presentati con una *foto 1vis* per favore

📋 Scrivi:
• *Nome*
• *Età*
• *Città/Paese*

Benvenuto in @group! 🎉`,
    `🌟 @user, sei ufficialmente parte di @group!

📸 Presentati con una *foto 1vis*

👤 Dicci:
• *Nome*
• *Età*
• *Da dove vieni*

Benvenuto/a! 🎈`,
    `🎉 Un caloroso benvenuto a @user in @group!

📸 Per favore, invia una *foto 1vis* per presentarti

📝 Scrivi il tuo *nome*, la tua *età* e *da dove provieni*

Siamo felici di averti qui! 💫`
  ],
  cattivi: [
    `😒 Oh no, è arrivato @user in @group...

📸 Prima di tutto, presentati con una *foto 1vis* così vediamo chi sei

📝 Dicci:
• *Nome*
• *Età*
• *Da dove vieni*

E cerca di non rompere le scatole! 🙄`,
    `🤨 @user è entrato in @group. Speriamo sia all'altezza...

📸 Ti chiediamo una *foto 1vis* per presentarti

📋 Scrivi il tuo *nome*, la tua *età* e *da dove vieni*

Non fare danni! 😑`,
    `😤 Un altro nuovo arrivato... @user, benvenuto in @group

📸 Presentati con una *foto 1vis* e basta scuse

👤 Dicci:
• *Nome*
• *Età*
• *Provenienza*

E comportati bene! 😒`,
    `🙄 @user, sei entrato in @group. Che onore...

📸 Ti invitiamo a presentarti con una *foto 1vis*

📝 Scrivi il tuo *nome*, la tua *età* e *da dove vieni*

Non fare brutta figura! 😏`,
    `😐 Benvenuto @user in @group... speriamo tu sia meglio degli altri

📸 Presentati con una *foto 1vis* per favore

📋 Dicci:
• *Nome*
• *Età*
• *Da dove vieni*

E non fare casino! 😑`
  ],
  divertenti: [
    `🤣 Guardate chi è arrivato! @user si è unito a @group!

📸 Presentati con una *foto 1vis* così ti riconosciamo tra la folla!

📝 Dicci:
• *Nome*
• *Età*
• *Da dove vieni*

E preparati al caos! 🎉`,
    `😜 @user è entrato in @group! Che avventura ci aspetta!

📸 Ti chiediamo una *foto 1vis* per presentarti

👤 Scrivi il tuo *nome*, la tua *età* e *da dove vieni*

Divertiti, ma non troppo! 😂`,
    `🎪 E il circo si arricchisce! @user è arrivato in @group!

📸 Presentati con una *foto 1vis* per favore

📋 Dicci:
• *Nome*
• *Età*
• *Provenienza*

Lo spettacolo ha inizio! 🎭`,
    `🚀 @user ha deciso di unirsi a @group! Che coraggio!

📸 Ti chiediamo una *foto 1vis* per presentarti

📝 Dicci il tuo *nome*, la tua *età* e *da dove vieni*

Benvenuto nella giungla! 🦁`,
    `🍿 Popcorn pronti! @user è entrato in @group!

📸 Presentati con una *foto 1vis* così sappiamo chi guardare

👤 Dicci:
• *Nome*
• *Età*
• *Da dove vieni*

Che lo spettacolo abbia inizio! 🎬`
  ],
  neutri: [
    `👋 @user è entrato in @group.

📸 Ti chiediamo di presentarti con una *foto 1vis*

📝 Scrivi il tuo *nome*, la tua *età* e *da dove vieni*

Grazie.`,
    `ℹ️ @user si è unito a @group.

📸 Per favore, presentati con una *foto 1vis*

📋 Dicci:
• *Nome*
• *Età*
• *Provenienza*

Benvenuto.`,
    `📌 @user è ora membro di @group.

📸 Ti invitiamo a presentarti con una *foto 1vis*

👤 Scrivi il tuo *nome*, la tua *età* e *da dove vieni*

Buona permanenza.`
  ]
};

export async function before(m, { conn, participants }) {
  if (!m.isGroup) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat) return;

  let groupMetadata = await conn.groupMetadata(m.chat) || (conn.chats[m.chat] || {}).metadata;
  let participants_new = m.messageStubParameters || [];

  for (let user of participants_new) {
    if (m.messageStubType === 28) {
      if (chat.topBlasphemy && chat.topBlasphemy[user]) {
        delete chat.topBlasphemy[user];
      }

      if (chat.topUsers && chat.topUsers[user]) {
        delete chat.topUsers[user];
      }

      if (chat.whitelist && chat.whitelist.includes(user)) {
        chat.whitelist = chat.whitelist.filter(u => u !== user);
      }
    }

    let profilePic;
    try {
      profilePic = await conn.profilePictureUrl(user, 'image');
    } catch {
      profilePic = 'https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg';
    }

    let ppBuffer;
    try {
      ppBuffer = await (await fetch(profilePic)).buffer();
    } catch {
      ppBuffer = await (await fetch('https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg')).buffer();
    }

    if (m.messageStubType === 28) {
      let byeText;
      if (chat.sBye) {
        byeText = chat.sBye;
      } else {
        byeText = byeMessages[Math.floor(Math.random() * byeMessages.length)];
      }

      byeText = byeText
        .replace(/@user/g, `@${user.split('@')[0]}`)
        .replace(/@group/g, groupMetadata.subject)
        .replace(/@count/g, groupMetadata.participants.length);

      byeText += `\n\n👥 𝐌𝐞𝐦𝐛𝐫𝐢 𝐫𝐢𝐦𝐚𝐧𝐞𝐧𝐭𝐢: ${groupMetadata.participants.length}`;

      const fakeBye = {
        key: {
          participants: '0@s.whatsapp.net',
          fromMe: false,
          id: '333Bye'
        },
        message: {
          locationMessage: {
            name: '𝐀𝐝𝐝𝐢𝐨 👋',
            jpegThumbnail: ppBuffer.toString('base64'),
            vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Bye;;;\nFN:Bye\nEND:VCARD'
          }
        },
        participant: '0@s.whatsapp.net'
      };

      await conn.sendMessage(m.chat, {
        text: byeText,
        mentions: [user]
      }, { quoted: fakeBye });
    }

    if (m.messageStubType === 27) {
      let welcomeText;
      if (chat.sWelcome) {
        welcomeText = chat.sWelcome;
      } else {
        const categories = Object.keys(welcomeMessages);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const messages = welcomeMessages[randomCategory];
        welcomeText = messages[Math.floor(Math.random() * messages.length)];
      }

      welcomeText = welcomeText
        .replace(/@user/g, `@${user.split('@')[0]}`)
        .replace(/@group/g, groupMetadata.subject)
        .replace(/@count/g, groupMetadata.participants.length)
        .replace(/@desc/g, groupMetadata.desc?.toString() || 'Nessuna descrizione');

      welcomeText += `\n\n👥 𝐌𝐞𝐦𝐛𝐫𝐢 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨: ${groupMetadata.participants.length}`;

      const fakeWelcome = {
        key: {
          participants: '0@s.whatsapp.net',
          fromMe: false,
          id: '333Welcome'
        },
        message: {
          locationMessage: {
            name: '𝐁𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨 👋',
            jpegThumbnail: ppBuffer.toString('base64'),
            vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Welcome;;;\nFN:Welcome\nEND:VCARD'
          }
        },
        participant: '0@s.whatsapp.net'
      };

      await conn.sendMessage(m.chat, {
        text: welcomeText,
        mentions: [user]
      }, { quoted: fakeWelcome });
    }
  }
}