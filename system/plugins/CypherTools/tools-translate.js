const { translate } = require('@vitalets/google-translate-api');


module.exports = {
    command: "translate",
    alias: ["tr"],
    category: ["tools"],
    settings: {
        limit: true,
    },
    loading: true,
    
    async run(m, { text, sock }) {
        const [sourceText, targetLang] = text.split("|")
        
        if (!sourceText || !targetLang) {
            throw "Format: .translate Hello World|ID";
        }

        const proxyList = [
            'http://103.152.112.162:80',
            'http://103.152.112.163:80',
            'http://103.152.112.164:80'
        ];

        const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
        
        try {
            
            const { text: translatedText } = await translate(sourceText, {
                to: targetLang.toLowerCase()
            });
            
            return sock.sendMessage(m.cht, {
              text: translatedText,
            }, { quoted: m, ephemeralExpiration: 9999999 })
            
        } catch (error) {
            throw `Gagal menerjemahkan: ${error.message}`;
        }
    }
};