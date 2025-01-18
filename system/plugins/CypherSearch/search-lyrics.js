const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    command: "lyrics",
    alias: ["lirik"],
    category: ["search"],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, { sock, text }) {
        if (!text) {
            return m.reply(`╭━━━『 LYRICS FINDER 』━━━╮
┃ ⚠️ Format tidak valid
┃ 
┃ 📝 Penggunaan:
┃ • .lyrics judul lagu
┃ • .lyrics --detail url
╰━━━━━━━━━━━━━━━━━━━╯`);
        }

        try {
            if (text.includes("--detail")) {
                const url = text.replace("--detail", "").trim();
                const data = await detail(url);

                if (!data) {
                    return m.reply(`╭━━━『 LYRICS FINDER 』━━━╮
┃ ❌ Gagal memuat lirik
┃ 🔄 Silahkan coba lagi
╰━━━━━━━━━━━━━━━━━━━╯`);
                }

                const caption = `╭━━━『 DETAILED LYRICS 』━━━╮
┃ 👤 Artist: ${data.artist}
┃ 🌐 Language: ${data.language || "Unknown"}
┃
┃ 📝 Lyrics:
┃ ${data.lyric.replace(/\n/g, '\n┃ ')}
╰━━━━━━━━━━━━━━━━━━━╯`;

                await m.reply(caption);
            } else {
                const results = await lyrics(text);
                if (!results.length) {
                    return m.reply(`╭━━━『 LYRICS FINDER 』━━━╮
┃ ❌ Lirik tidak ditemukan
┃ 🔍 Coba kata kunci lain
╰━━━━━━━━━━━━━━━━━━━╯`);
                }

                const { title, artist, lyricSingkat, lirikLinks } = results[0];
                const caption = `╭━━━『 LYRICS PREVIEW 』━━━╮
┃ 🎵 Title: ${title}
┃ 👤 Artist: ${artist}
┃ 🔗 URL: ${lirikLinks}
┃
┃ 📝 Preview:
┃ ${lyricSingkat.replace(/\n/g, '\n┃ ')}
┃
┃ 💡 Silahkan Click Tombol Di Bawah Untuk Detail.
╰━━━━━━━━━━━━━━━━━━━╯`;

                await m.reply({
                  text: caption,
                  footer: "© Cypher 2025 - 2026",
                  buttons: [{
                    buttonId: `.lyrics --detail ${lirikLinks}`,
                    buttonText: {
                       displayText: "Details"
                    }
                  }],
                  viewOnce: true,
                  headerType: 6
                });
            }
        } catch (e) {
            m.reply(`╭━━━『 LYRICS FINDER 』━━━╮
┃ ❌ Terjadi kesalahan
┃ ⚠️ ${e.message}
╰━━━━━━━━━━━━━━━━━━━╯`);
        }
    }
};

async function lyrics(search) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'DNT': '1'
    };

    try {
        const { data } = await axios.get(`https://www.lyrics.com/lyrics/${search}`, { headers });
        const $ = cheerio.load(data);
        const results = [];

        $('.sec-lyric').each((i, el) => {
            const title = $(el).find('.lyric-meta-title a').text().trim();
            const artist = $(el).find('.lyric-meta-album-artist a, .lyric-meta-artists a').text().trim();
            const lyric = $(el).find('.lyric-body').text().trim();
            let lirikLinks = $(el).find("a").attr("href")?.replace(/^\/lyric-\w+\//, '/');

            if (title && artist && lyric && lirikLinks) {
                results.push({
                    title,
                    artist,
                    lyricSingkat: lyric,
                    lirikLinks: "https://www.lyrics.com" + lirikLinks
                });
            }
        });

        return results;
    } catch {
        return [];
    }
}

async function detail(urlLyrics) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'DNT': '1'
    };

    try {
        const { data } = await axios.get(urlLyrics, { headers });
        const $ = cheerio.load(data);

        return {
            artist: $('.artist-meta h4 a').text().trim(),
            language: $('.lyric-details .lang-area a span.hidden-xs').text().trim(),
            lyric: $('#lyric-body-text').text().trim()
        };
    } catch {
        return null;
    }
}