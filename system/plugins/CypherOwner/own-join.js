module.exports = {
    command: "join",
    alias: [],
    category: ["owner"],
    settings: {
        cypherOwner: true,
    },
    description: "Memasukan bot kedalam group",
    async run(m, {
        sock,
        text,
        Func
    }) {
        if (!Func.isUrl(text) || !/chat.whatsapp.com/.test(text))
            throw "> Masukan Link group nya";
        let id = text.split("chat.whatsapp.com/")[1];
        await sock
            .groupAcceptInvite(id)
            .then((a) =>
                m.reply(
                    a ?
                    "> *Bot Berhasil bergabung !*" :
                    "> *Bot sedang dalam prosess permintaan bergabung*",
                ),
            );
    },
};