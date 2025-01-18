module.exports = {
   command: "tourl",
   alias: ["tolink", "upload", "host"],
   category: ["tools", "main"],
   settings: {
      limit: true,
   },
   loading: true,

   async run(m, { sock, Uploader }) {
      const supportedMimes = [
         "image",
         "video",
         "audio",
         "document",
         "sticker"
      ]
      
      const quoted = m.quoted ? m.quoted : m
      const mime = (quoted.msg || quoted).mimetype || ""
      
      if (!mime) throw `Reply media dengan caption ${m.prefix}tourl`
      
      if (!supportedMimes.some(type => mime.startsWith(type))) {
         throw `Media type tidak support! Hanya support:\n${supportedMimes.join(", ")}`
      }
      
      try {
         m.reply("Uploading media...")
         
         const media = await quoted.download()
         if (!media) throw "Gagal download media"
         
         const url = await Uploader.catbox(media)
         if (!url) throw "Gagal upload media"
         
         const text = `*Success Upload!*\n\n` +
                     `*📮 URL:* ${url}\n` +
                     `*📊 Size:* ${formatSize(media.length)}\n` +
                     `*📑 Mime:* ${mime}`
                     
         await m.reply(text)
         
      } catch (e) {
         throw `Error: ${e.message}`
      }
   }
}

function formatSize(bytes) {
   const sizes = ["Bytes", "KB", "MB", "GB"]
   if (bytes === 0) return "0 Byte"
   const i = Math.floor(Math.log(bytes) / Math.log(1024))
   return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}