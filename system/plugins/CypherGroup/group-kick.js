let Cypher = async (m, { sock, text }) => {
  try {
    const target = m.quoted ? m.quoted.sender : m.mentionedJid?.[0]
    
    if (!target) throw "╳ Tag atau balas pesan user yang ingin dikick!"
    
    const groupData = await sock.groupMetadata(m.cht)
    const participants = groupData.participants.map(v => v.id)
    
    if (!participants.includes(target)) {
      return m.reply({
        text: "⚠️ User tersebut tidak ada dalam grup ini!"
      })
    }
    
    await sock.groupParticipantsUpdate(m.chat, [target], "remove")
    
    await m.reply({
      text: `╭━━『 👢 Kick Member 』\n┃\n┃ ⌬ *Target:* @${target.split('@')[0]}\n┃ ⌬ *Admin:* @${m.sender.split('@')[0]}\n┃\n╰━━━━━━━━━━━━━━━⌬`,
      mentions: [target, m.sender]
    })
    
  } catch (e) {
    console.error(e)
    return m.reply({
      text: `Error: ${e.message}`
    })
  }
}

Cypher.command = "kick";
Cypher.alias = ["sulap", "dor", "tendang"];
Cypher.category = ["group"];
Cypher.settings = {};
Cypher.loading = true

module.exports = Cypher;