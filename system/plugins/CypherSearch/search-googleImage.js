const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
   command: "gimage",
   alias: ["gimg"],
   category: ["search"],
   settings: {
     limit: true
   },
   
   async run(m, { sock, text }) {
      if (!text) throw "Masukkan Query Pencarian Anda.";
      
      try {1
        await m.react("☕")
         let data = await googleImage(text);
         let img = data[0]; //Mengambil Index Pertama Dari Array Agar SendMessage Valid.
         await m.reply({
           image: { url: img },
           caption: "Done.",
           footer: "© CypherBot 2025 - 2026",
           buttons: [{
              buttonId: `.gimage ${text}`,
              buttonText: {
                displayText: "⬅ Lanjut"
              }
           }],
           viewOnce: true,
           headerType: 6
         })
      } catch (error) {
         console.error(error.message)
         throw {
            msg: "Error Internal",
            detail: error.message,
            status_code: 500
         }
      }
   }
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

async function googleImage(query) {
  try {
    const { data: html } = await axios.get(`https://www.google.com/search?q=${query}&sclient=mobile-gws-wiz-img&udm=2`);
    const $ = cheerio.load(html);
    
    const imageUrls = [];
    $('img.DS1iW').each((i, el) => {
      const imgUrl = $(el).attr('src');
      if (imgUrl) imageUrls.push(imgUrl);
    });

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}