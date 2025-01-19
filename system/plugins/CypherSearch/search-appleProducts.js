const axios = require('axios');
const cheerio = require('cheerio');

const Cypher = async (m, { sock, text }) => {
    if (!text) throw "Masukkan nama produk yang ingin dicari.";

    try {
        const data = await fetchAppleProducts(text);
        if (!data || data.length === 0) throw "Tidak ada hasil untuk pencarian itu.";

        let results = data.map(({ name, price, colors }, i) => {
            const colorText = colors.length > 0 ? colors.join(", ") : "Tidak tersedia";
            return `
${i + 1}. *${name}*
    ➤ Harga: ${price || "Tidak tersedia"}
    ➤ Warna: ${colorText}
            `.trim();
        }).join("\n\n");

        const caption = `
*[  PRODUK DITEMUKAN!! ]*

Berikut hasil pencarian untuk *${text}*:

${results}

_Pencarian lebih lanjut? Klik tombol di bawah._
        `.trim();

        await m.reply({
            text: caption,
            footer: "© CypherBot 2025 - 2026",
            buttons: [
                {
                    buttonId: `.apple ${text}`,
                    buttonText: {
                        displayText: "Lagi"
                    },
                }
            ],
            viewOnce: true,
            headerType: 6
        });
    } catch (error) {
        console.error(error.message);
        return sock.sendMessage(m.cht, {
            text: `⚠️ Error: ${error.message}`
        });
    }
};

Cypher.command = "apple";
Cypher.alias = ["appleproducts"];
Cypher.category = ["search"];
Cypher.settings = {
    limit: true
};
Cypher.loading = true;

module.exports = Cypher;

async function fetchAppleProducts(search) {
    try {
        const { data } = await axios.get(`https://www.apple.com/us/search/${search}?src=serp`);
        const $ = cheerio.load(data);

        const products = [];

        $('.rf-producttile').each((_, el) => {
            const name = $(el).find('.rf-producttile-name a').text().trim() || "Tidak ada nama";
            const price = $(el).find('.rf-producttile-pricecurrent').text().trim() || "Tidak ada harga";
            const colors = [];

            $(el).find('.rf-producttile-colorswatch img').each((_, colorEl) => {
                const color = $(colorEl).attr('alt')?.trim() || "Tidak ada warna";
                colors.push(color);
            });

            products.push({ name, price, colors });
        });

        return products;
    } catch (error) {
        console.error('Error fetching Apple products:', error);
        return [];
    }
}