const SYTDL = require('s-ytdl');

module.exports = {
    command: "ytmp3",
    alias: ["mp3"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, { sock, text, Func }) {
        if (!text) {
            return m.reply({
                text: `╭━━━『 YOUTUBE MP3 』━━━╮
┃ ⚠️ Format tidak valid
┃ ✏️ Masukkan URL YouTube
┃ 📝 Contoh: .ytmp3 url
╰━━━━━━━━━━━━━━━━━━━╯`,
                footer: "© CypherBot 2025 - 2026"
            });
        }

        if (!Func.isUrl(text)) {
            return m.reply({
                text: `╭━━━『 YOUTUBE MP3 』━━━╮
┃ ❌ URL tidak valid
┃ 🔗 Gunakan URL YouTube
┃ 📝 Contoh: youtu.be/xxx
╰━━━━━━━━━━━━━━━━━━━╯`,
                footer: "© CypherBot 2025 - 2026"
            });
        }

        try {
            m.reply(`╭━━━『 YOUTUBE MP3 』━━━╮
┃ ⏳ Sedang diproses...
┃ 📥 Mohon tunggu sebentar
╰━━━━━━━━━━━━━━━━━━━╯`);

            const data = await SYTDL.dl(text, "4", "audio");
            
            await sock.sendMessage(m.cht, {
                audio: { url: data.link },
                mimetype: "audio/mpeg",
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
            m.reply(`╭━━━『 YOUTUBE MP3 』━━━╮
┃ ❌ Gagal mengunduh audio
┃ ⚠️ ${e.message}
┃ 🔄 Silahkan coba lagi
╰━━━━━━━━━━━━━━━━━━━╯`);
        }
    }
};