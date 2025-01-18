module.exports = {
    command: "self",
    alias: [],
    category: ["owner"],
    settings: {
        cypherOwner: true,
    },
    description: "Ubah bot menjadi mode senyap",
    async run(m, {
        sock,
        text
    }) {
        if (!text)
            return m.reply({
                poll: {
                    name: `*– 乂 Cara Penggunaan*
> *\`0\`* Untuk mematikan fitur self
> *\`1\`* Untuk menghidupkan fitur self`,
                    values: [`${m.prefix}self 0`, `${m.prefix}self 1`],
                    selectableCount: 1,
                },
            });
        let settings = db.list().settings;
        settings.self = parseInt(text) > 0 ? true : false;
        m.reply(`> Berhasil ${text < 1 ? "mematikan" : "menghidupkan"} fitur self`);
    },
};