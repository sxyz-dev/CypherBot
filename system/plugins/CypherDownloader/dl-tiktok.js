module.exports = {
    command: "tiktok",
    alias: ["tt", "ttdl"],
    category: ["downloader"],
    settings: {
        owner: false,
        group: false,
        limit: true,
    },
    description: "Download TikTok Video and Audio",
    loading: true,
    async run(m, { sock, Func, Scraper, text }) {
        try {
            if (!text.includes('tiktok')) {
                return m.reply('Please provide a valid TikTok link!');
            }

            const video = await Scraper.ttsave.ttvideo(text);
            const audio = await Scraper.ttsave.ttmp3(text);

            const metadata = {
                title: '📱 TikTok Downloader',
                fields: [
                    { name: 'Name', value: video.nickname },
                    { name: 'Username', value: video.username },
                    { name: 'User ID', value: video.uniqueId },
                    { name: 'Views', value: video.stats.plays },
                    { name: 'Likes', value: video.stats.likes },
                    { name: 'Comments', value: video.stats.comments },
                    { name: 'Shares', value: video.stats.shares }
                ]
            };

            const caption = metadata.fields
                .map(field => `━ *${field.name}:* ${field.value}`)
                .join('\n');

            const formattedCaption = `*${metadata.title}*\n${caption}\n━━━━━━━━━━`;

            await m.reply({
                image: { url: video.profilePic },
                caption: formattedCaption
            });

            if (video.dlink?.nowm) {
                await sock.sendMessage(m.cht, {
                    video: { url: video.dlink.nowm },
                    caption: formattedCaption
                }, { quoted: m });
            }

            if (video.slides) {
                for (const slide of video.slides) {
                    await sock.sendMessage(m.cht, {
                        video: { url: slide.url },
                        caption: formattedCaption
                    }, { quoted: m });
                }
            }

            await m.reply({
                audio: { url: audio.audioUrl },
                mimetype: 'audio/mpeg'
            });

        } catch (error) {
            m.reply(`Error occurred: ${error.message}`);
        }
    }
};