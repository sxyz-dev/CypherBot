const {
    delay
} = require("baileys");
const DELAY = 4000; // - Delay broadcast.js

module.exports = {
    command: "broadcast",
    alias: ["bc"],
    settings: {
        cypherOwner: true,
    },
    description: "mengirim pesan ke semua orang",
    async run(m, {
        sock,
        store,
        text
    }) {
        if (!text)
            throw `*– 乂 Cara - Penggunaan*
> Masukan pesan yang ingin di broadcast
> Reply media jika ingin broadcast sambil mengirim media
> gunakan *\`--group\`* Untuk mengirim pesan ke semua group`;

        const MSG = Object.keys(store.messages);
        const isGROUP = MSG.filter((a) => a.endsWith("@g.us"));
        const isSENDER = MSG.filter((a) => a.endsWith("@s.whatsapp.net"));
        if (text.includes("--group")) {
            let input = text.replace("--group", "").trim();
            let q = m.quoted ? m.quoted : m;
            let Msg = sock.cMod(m.cht, q, input);
            for (let i of isGROUP) {
                sock.copyNForward(i, Msg, true);
                delay(DELAY);
            }
            m.reply(`> *- Berhasil broadcast ke ${isGROUP.length} group*`);
        } else {
            let q = m.quoted ? m.quoted : m;
            let Msg = sock.cMod(m.cht, q, m.text);
            for (let i of isSENDER) {
                sock.copyNForward(i, Msg, true);
                delay(DELAY);
            }
            m.reply(`> *- Berhasil broadcast ke ${isSENDER.length} orang*`);
        }
    },
};