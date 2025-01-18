const util = require("util");
const { exec } = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const { writeExif } = require("../lib/sticker");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");
const cheerio = require('cheerio');
const { catbox } = require('../lib/Uploader');

module.exports = async (
    m,
    sock,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    const quoted = m.isQuoted ? m.quoted : m;
    
    switch (m.command) {
        case "jadwalsholat": {
            if (!text) return m.reply("⚠️ Silakan masukkan nama kota");
            const kota = text?.toLowerCase() || 'jakarta';
            
            try {
                const { data } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                const $ = cheerio.load(data);
                const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                if (jadwal.length === 7) {
                    const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;
                    const response = `╔══ *JADWAL SHOLAT* ══╗
║ Kota: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
║ Tanggal: ${tanggal}
╠════ *WAKTU* ════╣
║ • Subuh   : ${subuh}
║ • Duha    : ${duha}
║ • Dzuhur  : ${dzuhur}
║ • Ashar   : ${ashar}
║ • Maghrib : ${maghrib}
║ • Isya    : ${isya}
╚═══════════════╝`;

                    await m.reply(response);
                } else {
                    await m.reply('⚠️ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                }
            } catch (error) {
                await m.reply('❌ Terjadi kesalahan dalam memproses permintaan');
               return console.error(error.message);
            }
        }
        break;

        case "sticker":
        case "s": {
            if (/image|video|webp/.test(quoted.msg.mimetype)) {
                let media = await quoted.download();
                if (quoted.msg?.seconds > 10) {
                    throw "⚠️ Durasi video maksimal 10 detik";
                }
                
                let exif;
                if (text) {
                    let [packname, author] = text.split(/[,|\-+&]/);
                    exif = {
                        packName: packname ? packname : "",
                        packPublish: author ? author : "",
                    };
                } else {
                    exif = {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    };
                }

                let sticker = await writeExif(
                    {
                        mimetype: quoted.msg.mimetype,
                        data: media
                    },
                    exif,
                );
                
                await m.reply({ sticker });
            } else if (m.mentions.length !== 0) {
                for (let id of m.mentions) {
                    await delay(1500);
                    let url = await sock.profilePictureUrl(id, "image");
                    let media = await axios.get(url, {
                        responsType: "arraybuffer",
                    }).then((a) => a.data);
                    
                    let sticker = await writeExif(media, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    });
                    
                    await m.reply({ sticker });
                }
            } else {
                m.reply("⚠️ Silakan reply media yang ingin dijadikan sticker");
            }
        }
        break;
        
        case "smeme": {
            try {
                if (!/image/.test(quoted.msg?.mimetype)) {
                    return m.reply(`Kirim/kutip gambar dengan caption ${m.prefix + m.command} San|Abc`);
                }

                let atas = text.split("|")[0] || "-";
                let bawah = text.split("|")[1] || "-";

                let media = await quoted.download();
                let url = await catbox(media); // Menggunakan uploader

                // Buat URL meme
                let smemeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${url}`;

                // Convert ke stiker
                let sticker = await writeExif(
                    { mimetype: "image/png", data: await axios.get(smemeUrl, { responseType: "arraybuffer" }).then((res) => res.data) },
                    { packName: config.sticker.packname, packPublish: config.sticker.author }
                );

                await sock.sendMessage(m.cht, { sticker }, { quoted: m });
            } catch (error) {
                m.reply(`Gagal membuat meme: ${error.message}`);
            }
            break;
        }

        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);
            
            const helpText = `╔══ *PENGELOLAAN CASE* ══╗
║ Penggunaan:
║ • --add    : Tambah fitur
║ • --get    : Ambil fitur
║ • --delete : Hapus fitur
╠════ *DAFTAR CASE* ════╣
${Case.list().map((a, i) => `║ ${i + 1}. ${a}`).join("\n")}
╚═══════════════════════╝`;

            if (!text) return m.reply(helpText);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("⚠️ Reply fitur case yang ingin disimpan");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "✅ Case berhasil ditambahkan" : "❌ Gagal menambahkan case");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("⚠️ Masukkan nama case yang ingin dihapus");
                let status = Case.delete(input);
                m.reply(status ? `✅ Case ${input} berhasil dihapus` : `❌ Case ${input} tidak ditemukan`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("⚠️ Masukkan nama case yang ingin diambil");
                if (!Case.list().includes(input)) return m.reply("❌ Case tidak ditemukan");
                let status = Case.get(input);
                m.reply(status ? status : `❌ Case ${input} tidak ditemukan`);
            }
        }
        break;
        
                case "brat": {
            let input = m.isQuoted ? m.quoted.body : text;
            if (!input) return m.reply("> Reply/Masukan pessn");
            m.reply(config.messages.wait);
            let media = await axios.get(`https://aqul-brat.hf.space/api/brat?text=${text}`, {
                responseType: 'arraybuffer'
            }).then((a) => a.data);
            let sticker = await writeExif({
                mimetype: "image",
                data: media,
            }, {
                packName: config.sticker.packname,
                packPublish: config.sticker.author,
            }, );

            await m.reply({
                sticker
            });
        }
        break;
        case "daftar": {
            let user = db.list().user[m.sender]
            if (user.register) return m.reply("> Kamu sudah mendaftar !");
            if (!text) return m.reply("> Masukan nama anda !");
            let list = Object.values(db.list().user).find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (list) return m.reply("> Nama tersebut sudah digunakan !");
            let bonus = 1000;
            user.register = true
            user.name = text
            user.rpg.money += bonus
            user.rpg.exp += bonus
            let cap = `*– 乂 Pendaftaran - Berhasil !*
> 🎉 Selamat ${user.name} kamu mendapatkan bonus tambahan karena sudah mendaftar pada bot kami

*– 乂 Hadiah - Pendaftaran*
> *- Money :* 1.000
> *- Exp :* 1.000`
            m.reply(cap);
        }
        break
        case "zzz": {
            let list = await Scraper.zzz.list();
            if (!text) return m.reply("> Masukan nama character dari game ZZZ");
            let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (!chara) return m.reply(`> Character tidak ditemukan !

*– 乂 Berikut ${list.length} character dari game ZZZ*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join('\n')).join("\n\n")}`);

            let data = await Scraper.zzz.chara(text);
            let cap = "*– 乂 Zenless Zone Zero - Character*\n"
            cap += Object.entries(data.info).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")
            cap += "\n\n*– Statistic Character :*\n"
            cap += data.stats.map((a) => `> *- ${a.name.capitalize()} :* ${a.value}`).join("\n");
            cap += "\n\n*– Party Character :*\n"
            cap += data.team.map((a) => `> *- Name :* ${a.name}\n> *- Role :* ${a.role}`).join("\n\n");

            cap += "\n\n*– Skills Character :*\n"
            cap += data.skills.map((a) => `> *- Name :* ${a.name}\n> ${a.description}`).join("\n\n");

            m.reply({
                text: cap,
                contextInfo: {
                    externalAdReply: {
                        title: "– Zenless Zone Zero Wiki : " + data.info.name,
                        body: "- Element : " + data.info.element,
                        mediaType: 1,
                        thumbnailUrl: data.info.image
                    }
                }
            });
        }
        break;
        
        default:
            if ([">", "eval", "=>"].some((a) => m.command.toLowerCase().startsWith(a)) && m.isOwner) {
                let evalCmd = "";
                try {
                    evalCmd = /await/i.test(m.text)
                        ? eval("(async() => { " + m.text + " })()")
                        : eval(m.text);
                } catch (e) {
                    evalCmd = e;
                }
                
                new Promise((resolve, reject) => {
                    try {
                        resolve(evalCmd);
                    } catch (err) {
                        reject(err);
                    }
                })
                    ?.then((res) => m.reply(util.format(res)))
                    ?.catch((err) => m.reply(util.format(err)));
            }
    }
};

// Watch for file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("📝 File case.js telah diperbarui");
    delete require.cache[file];
});