const util = require('util');
const { exec } = require('child_process');

let handler = async (m, { sock, text }) => {
  if (!text) {
    throw "Masukkan perintah yang ingin dieksekusi.";
  }

  try {
    exec(text, (err, stdout) => {
      if (err) {
        return m.reply(util.format(err));
      }
      m.reply(util.format(stdout));
    });
  } catch (error) {
    m.reply(util.format(error));
  }
};

handler.command = "exec";
handler.alias = ["$"];
handler.category = ["owner"];
handler.settings = {
  limit: true,
};
handler.loading = true;

module.exports = handler;