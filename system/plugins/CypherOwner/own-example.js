module.exports = {
    command: "example",
    alias: ["exp"],
    settings: {
        cypherOwner: true,
    },
    description: "Example Features Bot",
    async run(m, {
        text
    }) {
        let cap = `*– 乂 Example - Code*
> Pilih type 1 atau 2 Sesuai Dengan kebutuhan anda`;
        if (!text)
            return m.reply({
                poll: {
                    name: cap,
                    values: [`${m.prefix + m.command} 1`, `${m.prefix + m.command} 2`],
                    selectableCount: 1,
                },
            });
        if (Number(text) === 1) {
            let code = `
class Command {
       constructor() {
       this.command = ""
       this.alias = [] 
       this.category = []
       this.settings = {}
       this.description = ""
       this.loading = true
   }
   run = async(m, { sock, Func, Scraper, config, store }) => {
      //do Something...
  }
}

module.exports = new Command();`;
            m.reply(code);
        } else if (Number(text) === 2) {
            let code = `
module.exports = {
      command: "",
      alias: [],
      category: [],
      settings: {},
      description: "",
      loading: true,
      async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
      //do something...
   }
}`;
            m.reply(code);
        } else
            return m.reply({
                poll: {
                    name: cap,
                    values: [`${m.prefix + m.command} 1`, `${m.prefix + m.command} 2`],
                    selectableCount: 1,
                },
            });
    },
};