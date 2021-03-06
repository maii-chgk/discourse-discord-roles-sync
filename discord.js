const Discord = require("discord.js");
const client = new Discord.Client();

const slugify = require("@sindresorhus/slugify");

exports.connect = (guildId, botToken) =>
  new Promise((resolve) => {
    client.once("ready", async () => {
      const guild = await client.guilds.fetch(guildId);
      resolve({ client, guild });
    });
    client.login(botToken);
  });

exports.fetchMembers = async (guild) => {
  const mm = await guild.members.fetch({ force: true });
  return mm
    .array()
    .map(({ user, _roles, nickname }) => ({
      id: user.id,
      roles: _roles,
      username: user.username,
      discriminator: user.discriminator,
      nickname: nickname || user.username,
      isBot: user.bot,
    }))
    .filter(({ isBot }) => !isBot);
};

exports.fetchRoles = async (guild) => {
  const rm = await guild.roles.fetch(undefined, true, true);
  return [...rm.cache.values()]
    .map(({ id, name, deleted }) => ({
      id,
      name: slugify(name, { separator: "_" }),
      isDeleted: deleted,
    }))
    .filter(({ isDeleted }) => !isDeleted);
};
