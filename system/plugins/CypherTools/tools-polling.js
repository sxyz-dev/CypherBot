module.exports = {
  command: "polling",
  alias: ["poll", "create_poll"],
  category: ["tools"],
  settings: {
    limit: true,
    cooldown: 30,
    premium: false
  },
  loading: true,
  
  async run(m, { text }) {
    if (!text?.includes("|")) {
      throw `Format: ${m.prefix}polling Question|Option1|Option2`;
    }

    const parts = text.split("|").map(str => str.trim());
    const [question, ...options] = parts;
    
    if (!question || options.length < 2) {
      throw `Format: ${prefix}polling Question|Option1|Option2`;
    }
    
    if (question.length > 300) {
      throw "Question too long! Maximum 300 characters";
    }
    
    if (options.some(opt => opt.length > 100)) {
      throw "Options too long! Maximum 100 characters each";
    }

    try {
      await m.reply({
        poll: {
          name: question,
          values: options.slice(0, 12),
          selectableCount: 2
        }
      });
    } catch (err) {
      throw {
        message: "Failed to create poll",
        cause: err.message,
        status: 500
      };
    }
  }
};