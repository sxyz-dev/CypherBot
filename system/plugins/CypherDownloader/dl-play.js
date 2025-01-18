const yts = require("yt-search");

module.exports = {
    command: "play",
    alias: [],
    category: ["downloader"],
    settings: {
        limit: true
    },
    description: "Search and play YouTube videos/music",
    loading: true,
    async run(m, { sock, Scraper, Func, config, text }) {
        if (!text) {
            return m.reply(`╭━━━『 YOUTUBE PLAYER 』━━━╮
┃ ⚠️ Format tidak valid
┃ ✏️ Contoh: .play levitating
╰━━━━━━━━━━━━━━━━━━━╯`);
        }

        try {
            const search = await yts({
                search: text,
                hl: "id",
                gl: "ID"
            });

            if (!search.all[0]) {
                return m.reply(`╭━━━『 YOUTUBE PLAYER 』━━━╮
┃ ❌ Video tidak ditemukan
┃ 🔍 Coba kata kunci lain
╰━━━━━━━━━━━━━━━━━━━╯`);
            }

            const video = search.all[0];
            const caption = `╭━━━『 YOUTUBE PLAYER 』━━━╮
┃
┃ 📽️ *INFORMASI VIDEO*
┃ 
┃ 📌 Judul: ${video.title}
┃ ⏱️ Durasi: ${video.timestamp}
┃ 👁️ Views: ${video.views}
┃ 📅 Upload: ${video.ago}
┃ 👤 Channel: ${video.author.name}
┃ 🔗 URL: ${video.url}
┃
┃ Silahkan pilih format unduhan
╰━━━━━━━━━━━━━━━━━━━╯`;

            await m.reply({
                image: { url: video.thumbnail },
                caption: caption,
                footer: "© CypherBot 2025 - 2026",
                buttons: [
                    {
                        buttonId: `.ytmp3 ${video.url}`,
                        buttonText: {
                            displayText: "🎵 Audio MP3"
                        }
                    },
                    {
                        buttonId: `.ytmp4 ${video.url}`,
                        buttonText: {
                            displayText: "🎬 Video MP4"
                        }
                    }
                ],
                viewOnce: true,
                headerType: 6
            });
        } catch {
            m.reply(`╭━━━『 YOUTUBE PLAYER 』━━━╮
┃ ❌ Gagal memproses request
┃ 🔄 Silahkan coba lagi
╰━━━━━━━━━━━━━━━━━━━╯`);
        }
    }
};