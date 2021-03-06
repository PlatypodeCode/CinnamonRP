const Discord = require('discord.js');
const utils = require('../util.js')


module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'List all of my commands or info about a specific command.',
  hidden: false,
  args: false,
  usage: ['[command]'],
  example: undefined,
  execute(client, guildSettings, msg, args) {
    const { prefix } = guildSettings
    const data = [];
    const commands = msg.client.commands.filter(command => !command.hidden)

    if (!args.length) {

      data.push(commands.map(command => guildSettings.prefix + command.name).join('\n'))

      embed = new Discord.MessageEmbed()
        .addField("Commands:", data, true)
        .addField("Other things", "• You can also react to a proxied message with ❓ to get information on who sent it\n• You can react to a proxied message you sent with a ❌ to delete it\n• You can edit your message to fix the proxy if it is the latest message in the channel\n• A character with a 🔗 next to them in the list, or in the footer of their character card, is a public character. This means anyone can edit them.", true)
        .setFooter(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
        .setColor("#ffaa00")

      return msg.channel.send(embed)
    }
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return msg.channel.send(utils.errorEmbed('That\'s not a valid command!'));
    }

    embed = utils.warnEmbed()
      .setFooter(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
      .setTitle(prefix+command.name)
    if (command.aliases) embed.addField(`Aliases:`, `${command.aliases.join(', ')}`);
    if (command.description) embed.addField(`Description:`, `${command.description}`);
    if (command.usage) {
      usage = ""
      for (var i = 0; i < command.usage.length; i++) {
        if(i < command.usage.length && usage.length + `\n**${prefix}${command.name}  ${command.usage[i]}`.length > 1024){
          embed.addField("Usage:",usage)
          usage = ""
        }
        usage += `\n**${prefix}${command.name}  ${command.usage[i]}`
      }
      embed.addField("Usage:",usage)
    }
    if (command.example) embed.addField(`Example:`, `${prefix}${command.name} ${command.example}`);

    msg.channel.send(embed);
  },
};
