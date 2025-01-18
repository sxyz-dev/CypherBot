const path = require("node:path");
const fs = require("node:fs");

module.exports = {
    command: "sp",
    category: ["owner"],
    alias: ["saveplugin"],
    description: "untuk menyimpan fitur bot",
    settings: {
        cypherOwner: true,
    },
    loading: true,
    async run(m, {
        text,
        config,
        Func
    }) {
        if (!m.quoted) throw "> Reply kodingan mu king 😎";
        if (!text) throw "> Masukan Nama file nya";
        m.reply(config.messages.wait);
        try {
            let locate = "system/plugins/";
            await fs.writeFileSync(locate + m.text, m.quoted.body);
            m.reply(
                `> Fitur berhasil tersimpan kedalam file :\n> ${locate + m.text}`,
            );
        } catch (e) {
            m.reply("> Folder tersebut tidak ada mungkin belum kamu buat");
        }
    },
};