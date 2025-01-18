const util = require("util");

module.exports = {
   command: "eval",
   alias: ["ev", "e"],
   category: ["owner"],
   settings: {
      cypherOwner: true,
   },
   loading: true,
   
   async run(m, { text, sock }) {
      if (!text) throw `${m.prefix}eval 1 + 1`
      
      let out = ""
      let evalCmd
      
      try {
         const isAsync = /await/i.test(text)
         const code = isAsync ? `(async () => { ${text} })()` : text
         
         evalCmd = eval(code)
         
         await Promise.resolve(evalCmd)
            .then(res => {
               out = util.format(res)
            })
            .catch(e => {
               out = util.format(e)
               evalCmd = e
            })
            
      } catch (e) {
         out = util.format(e)
         evalCmd = e
      }
      
      try {
         await m.reply(out)
      } catch (e) {
         await m.reply(util.format(e))
      }
   }
}