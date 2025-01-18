const SYTDL = require('s-ytdl');

module.exports = {
    command: "ytmp4",
    alias: ["mp4"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, { sock, text, Func }) {
        if (!text) {
            return m.reply({
                text: `╭━━━『 YOUTUBE MP4 』━━━╮
┃ ⚠️ Format tidak valid
┃ ✏️ Masukkan URL YouTube
┃ 📝 Contoh: .ytmp4 url
╰━━━━━━━━━━━━━━━━━━━╯`,
                footer: "© CypherBot 2025 - 2026"
            });
        }

        if (!Func.isUrl(text)) {
            return m.reply({
                text: `╭━━━『 YOUTUBE MP4 』━━━╮
┃ ❌ URL tidak valid
┃ 🔗 Gunakan URL YouTube
┃ 📝 Contoh: youtu.be/xxx
╰━━━━━━━━━━━━━━━━━━━╯`,
                footer: "© CypherBot 2025 - 2026"
            });
        }

        try {
            m.reply(`╭━━━『 YOUTUBE MP4 』━━━╮
┃ ⏳ Sedang diproses...
┃ 📥 Mohon tunggu sebentar
╰━━━━━━━━━━━━━━━━━━━╯`);

            const data = await SYTDL.dl(text, "4", "video")
            
            await sock.sendMessage(m.cht, {
                video: { url: data.link },
                caption: "",
                contextInfo: {
                    externalAdReply: {
                        title: `🎵 ${data.title}`,
                        body: `⏱️ ${data.durationLabel}`,
                        thumbnailUrl: data.thumbnail,
                        sourceUrl: text,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
        } catch (e) {
            m.reply(`╭━━━『 YOUTUBE MP4 』━━━╮
┃ ❌ Gagal mengunduh audio
┃ ⚠️ ${e.message}
┃ 🔄 Silahkan coba lagi
╰━━━━━━━━━━━━━━━━━━━╯`);
        }
    }
};