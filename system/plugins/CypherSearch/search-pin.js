const axios = require('axios')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, getBinaryNodeChildren, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, downloadContentFromMessage} = require('baileys');

module.exports = {
  command: "pinterest",
  alias: ["pin"],
  category: ["search"],
  settings: {
     limit: true
  },
  loading: true,
  async run(m, { sock, text, Scraper }) {
    if (!text) throw "Masukkan Query Pencarian Anda."
  }
  
  try {
    async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: {
         url
      }
    }, {
      upload: sock.waUploadToServer
    });
    return imageMessage;
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let push = [];
  
  const hasil = await Scraper.pinterestsearch.search(text)
 const dekusig = hasil.map(v => v.image)
  shuffleArray(dekusig); // Randomize arrays
  let ult = dekusig.splice(0, 10000000); // Takes the first 10 images from a randomized array
  let i = 1;
  for (let lucuy of ult) {
    push.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `done search ${text}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: config.name
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `Image - ${i++}`,
        hasMediaAttachment: true,
        imageMessage: await createImage(lucuy)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [{ }]
      })
    });
  }

  const bot = generateWAMessageFromContent(m.cht, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `< ! > Halo ${m.pushName}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: config.name
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              ...push
            ]
          })
        })
      }
    }
  }, {quoted:m});
  await sock.relayMessage(m.cht, bot.message, {
    messageId: m.key.id
  });
  }
}