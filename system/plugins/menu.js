const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    command: "menu",
    alias: ["menu", "help"],
    category: ["main"],
    description: "Menampilkan menu bot dengan tampilan modern",
    loading: true,
    async run(m, { sock, plugins, config, Func, text }) {
        // Load and parse case commands
        const data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        const casePattern = /case\s+"([^"]+)"/g;
        const matches = data.match(casePattern)?.map(match => match.replace(/case\s+"([^"]+)"/, "$1")) || [];
        
        if (!matches.length) return m.reply("❌ Tidak ada case yang ditemukan.");

        // Organize plugins into menu categories
        const menu = plugins.reduce((acc, item) => {
            if (item.category && item.command && item.alias) {
                item.category.forEach(cat => {
                    if (!acc[cat]) acc[cat] = { command: [] };
                    acc[cat].command.push({
                        name: item.command,
                        alias: item.alias,
                        description: item.description,
                        settings: item.settings,
                    });
                });
            }
            return acc;
        }, {});

        // Calculate statistics
        const stats = {
            cmd: Object.values(menu).reduce((sum, cat) => sum + cat.command.length, 0),
            alias: Object.values(menu).reduce((sum, cat) => 
                sum + cat.command.reduce((a, cmd) => a + cmd.alias.length, 0), 0)
        };

        // Get user profile and status
        const pp = await sock.profilePictureUrl(m.sender, "image")
            .catch(() => "https://files.catbox.moe/m97u63.jpg");
        const userStatus = m.isOwner ? "👑 Developer" : 
                          db.list().user[m.sender].premium.status ? "⭐ Premium" : "👤 Free User";
        const userLimit = m.isOwner ? "♾️ Unlimited" : db.list().user[m.sender].limit;

        // Generate header section
        const header = `┏━━━❮ *${config.name}* ❯━━┓
┃ 👋 *Selamat datang!*
┃ ${m.pushName}
┗━━━━━━━━━━━━━━━━┛

╭─❮ *👤 User Info* ❯
├ Name: ${m.pushName}
├ Tag: @${m.sender.split("@")[0]}
├ Status: ${userStatus}
├ Limit: ${userLimit}
╰────────────────

╭─❮ *🤖 Bot Info* ❯
├ Name: ${pkg.name}
├ Version: v${pkg.version}
├ Uptime: ${Func.toDate(process.uptime() * 1000)}
├ Prefix: [ ${m.prefix} ]
├ Total Features: ${stats.cmd + stats.alias + matches.length}
╰────────────────

📌 *Notes:*
• [L] = Limit Feature
• [P] = Premium Feature
• [O] = Owner Feature
• Report bugs: Contact owner\n`;

        // Generate menu based on command
        if (text === "all") {
            let fullMenu = `${header}\n`;
            
            // Add other commands section
            fullMenu += `╭─❮ *📑 Other Commands* ❯\n`;
            matches.forEach((cmd, i) => {
                fullMenu += `├ ${i + 1}. ${m.prefix}${cmd}\n`;
            });
            fullMenu += `╰────────────────\n\n`;

            // Add category menus
            Object.entries(menu).forEach(([category, commands]) => {
                fullMenu += `╭─❮ *${category.toUpperCase()}* ❯\n`;
                commands.command.forEach((cmd, i) => {
                    const badge = cmd.settings?.premium ? "[P]" : cmd.settings?.limit ? "[L]" : m.isOwner ? "[O]" : "";
                    fullMenu += `├ ${i + 1}. ${m.prefix}${cmd.name} ${badge}\n`;
                });
                fullMenu += `╰────────────────\n\n`;
            });

            // Add footer
            fullMenu += `\n━━━━❮ *${config.name}* ❯━━━━
© ${moment().format('YYYY')} Sxyzz
Powered by WhatsApp`;

            return m.reply({
                text: fullMenu,
                contextInfo: {
                    mentionedJid: sock.parseMention(fullMenu),
                    externalAdReply: {
                        title: `${config.name} | Dashboard`,
                        body: "Advanced WhatsApp Bot",
                        mediaType: 1,
                        sourceUrl: "",
                        thumbnailUrl: "https://files.catbox.moe/m97u63.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        }

        // Category-specific menu
        if (Object.keys(menu).includes(text?.toLowerCase())) {
            const category = menu[text.toLowerCase()];
            let categoryMenu = `${header}\n╭─❮ *${text.toUpperCase()}* ❯\n`;
            
            category.command.forEach((cmd, i) => {
                const badge = cmd.settings?.premium ? "[P]" : cmd.settings?.limit ? "[L]" : m.isOwner ? "[O]" : "";
                categoryMenu += `├ ${i + 1}. ${m.prefix}${cmd.name} ${badge}\n`;
            });
            
            categoryMenu += `╰────────────────\n\n`;
            categoryMenu += `\n━━━━❮ *${config.name}* ❯━━━━\n© ${moment().format('YYYY')} Sxyzz\nPowered by WhatsApp`;

            return m.reply({
                text: categoryMenu,
                contextInfo: {
                    mentionedJid: sock.parseMention(categoryMenu),
                    externalAdReply: {
                        title: `${config.name} | ${text.toUpperCase()}`,
                        body: "Advanced WhatsApp Bot",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P",
                        thumbnailUrl: "https://files.catbox.moe/m97u63.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        }

        // Main menu with categories
        const categories = Object.keys(menu);
        let mainMenu = `${header}\n╭─❮ *📑 Menu Categories* ❯\n`;
        mainMenu += `├ • ${m.prefix}menu all\n`;
        categories.forEach(category => {
            mainMenu += `├ • ${m.prefix}menu ${category}\n`;
        });
        mainMenu += `╰────────────────\n\n`;
        mainMenu += `\n━━━━❮ *${config.name}* ❯━━━━\n© ${moment().format('YYYY')} Sxyzz\nPowered by WhatsApp`;

        return m.reply({
            image: { url: "https://files.catbox.moe/m97u63.jpg" },
            caption: mainMenu,
            footer: config.name,
            contextInfo: { mentionedJid: [m.sender] },
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '📁 MENU LIST' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: `☕ Menu – ${config.name}`,
                        sections: [
                            {
                                title: "📂 CATEGORY",
                                rows: [
                                    {
                                        header: '📑 All Features',
                                        title: 'Show All Commands',
                                        description: config.name,
                                        id: '.menu all',
                                    },
                                    ...categories.map(cat => ({
                                        header: `📁 ${cat.toUpperCase()}`,
                                        title: `Show ${cat} commands`,
                                        description: config.name,
                                        id: `.menu ${cat}`,
                                    }))
                                ]
                            }
                        ]
                    })
                }
            }],
            headerType: 1,
            viewOnce: true
        });
    }
};