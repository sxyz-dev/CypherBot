module.exports = {
    command: "say",
    alias: ["say"],
    category: ["tools"],
    description: "Tools Kirim text",
    loading: true,
    async run(m, {
        sock
    }) {
        if (!m.text) return m.reply("Masukan Text nya");
        m.reply(m.text);
    },
};