/**
> *[ Fitur Plugin Quote/Qc ]*

> Type Cjs
> *[ Script ]*
> https://github.com/AxellNetwork/NekoBot
> https://devuploads.com/vhaofww2sujx
> Source
> Ch1
> https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
> Ch2
> https://whatsapp.com/channel/0029VateyJuKWEKhJMRKEL20
**/

const {
    writeExif
} = require(process.cwd() + "/lib/sticker");
const axios = require("axios");

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {
    if (!text) throw "> Masukan pesan nya";
    if (text.length > 10000) throw "Maximal 10000 karakter!"
    try {
        urlPic = await sock.profilePictureUrl(m.sender, 'image')
    } catch {
        urlPic = "https://files.catbox.moe/px1m46.jpg"
    }
    const json = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#161616",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": m.pushName,
                "photo": {
                    "url": urlPic
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    };

    const res = await axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const buffer = Buffer.from(res.data.result.image, 'base64');
    const rest = {
        status: "200",
        creator: "AdrianTzy",
        result: buffer
    };
    const sticker = await writeExif({
        mimetype: "image",
        data: rest.result,
    }, {
        packName: config.sticker.packname,
        packPublish: config.sticker.author,
    });
    m.reply({
        sticker
    });
}

deku.command = "quote"
deku.alias = ["qc"]
deku.category = ["tools"]
deku.settings = {
    limit: true
}
deku.loading = true

module.exports = deku