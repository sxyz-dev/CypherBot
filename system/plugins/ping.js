const os = require("node:os");
const fs = require("node:fs");

module.exports = {
    command: "ping",
    alias: ["ping", "p"],
    category: ["main"],
    description: "Periksa Status bot",
    loading: true,
    async run(m, {
        sock,
        config,
        Func
    }) {
        let start = performance.now(),
            node = process.memoryUsage(),
            info = await fetch("https://ipwho.is").then((a) => a.json()),
            cap = `\`Bot Information\`
* Running On : ${process.env.username === "root" ? "VPS" : "HOSTING ( PANEL )"}
* Uptime : ${Func.toDate(process.uptime() * 1000)}
* Home Dir : ${os.homedir}
* Tmp Dir : ${os.tmpdir()} *( ${fs.readdirSync(process.cwd() + os.tmpdir).length} Files )*
* Hostname : ${os.hostname()}
* Node Version : ${process.version}
* Cwd : ${process.cwd()}

\`Provider Information\`
* Isp : ${info.connection.isp}
* Org : ${info.connection.org}
* Country : ${info.country}
* City : ${info.city}
* Flag : ${info.flag.emoji}
* Timezone : ${info.timezone.id}

\`Origin Server Informationr\`
* Speed : ${(performance.now() - start).toFixed(3)} ms
* Uptime : ${Func.toDate(os.uptime() * 1000)}
* Total Memory : ${Func.formatSize(os.totalmem() - os.freemem())} / ${Func.formatSize(os.totalmem())}
* CPU : ${os.cpus()[0].model} ( ${os.cpus().length} CORE )
* Release : ${os.release()}
* Type : ${os.type()}

\`Nodejs Memory Usage\`
${Object.entries(node)
  .map(([a, b]) => `* ${a.capitalize()} : ${Func.formatSize(b)}`)
  .join("\n")}`;
        m.reply(cap);
    },
};