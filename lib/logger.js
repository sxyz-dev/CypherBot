const color = require("chalk");

module.exports = (m) => {
  let info = "";
  info += color.cyan.bold("- - - - - [ Chat Information ] -  - - - -\n");
  info += color.white.bold(
    ` - Dari : ${color.yellow.bold(m.isGroup ? "Group Chat" : "Private Chat")}\n`,
  );
  if (m.isGroup) {
    info += color.white.bold(
      ` - Subject : ${color.yellow.bold(m.metadata.subject)}\n`,
    );
    info += color.white.bold(` - Tipe : ${color.yellow.bold(m.type)}\n`);
    info += color.white.bold(` - Nama : ${color.yellow.bold(m.pushName)}\n`);
  } else {
    info += color.white.bold(` - Tipe : ${color.yellow.bold(m.type)}\n`);
    info += color.white.bold(` - Nama : ${color.yellow.bold(m.pushName)}\n`);
  }
  info += color.cyan.bold("- - - - - - - - - - - -- - - -\n");
  info += m.body.startsWith(m.body)
    ? color.yellow.bold(m.body)
    : color.white.bold(m.body);

  console.log(info);
};
