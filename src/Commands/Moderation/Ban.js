const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Ban certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.reply({ content: 'Please specify a valid member to ban!' });

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = message.guild.members.cache.get(member.id) ? await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id }) : null;

		if (member.id === message.author.id) return message.reply({ content: 'You can\'t ban yourself!' });
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply({ content: 'You can\'t ban a member who has an higher or equal role hierarchy to yours!' });
		}

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		if (!message.guild.members.cache.get(member.id).bannable) {
			return message.reply({ content: `I can't banned **${member.user.username}**! For having a higher role than mine!` });
		}

		if (!member.user.bot) {
			await member.send({ content: `Hello <@${member.id}>,\nYou've just been banned from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });
		}

		message.guild.members.ban(member, { reason: `${message.author.tag}: ${reason}` }).then(() => {
			message.reply({ content: `**${member.user.username}** has just been banned from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });

			const caseInfo = {
				channel: message.channel.id,
				moderator: message.author.id,
				date: Date.now(),
				type: 'ban',
				case: guildData.casesCount,
				reason
			};

			if (memberData) {
				memberData.sanctions.push(caseInfo);
				memberData.save();
			}

			guildData.casesCount++;
			guildData.save();

			if (guildData.plugins.moderations) {
				const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
				if (!sendChannel) return;

				const embed = new MessageEmbed()
					.setColor(Color.RED)
					.setAuthor(`Moderation: Ban | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }))
					.setDescription([
						`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
						`***Moderator:*** ${message.author.tag} (\`${message.author.id}\`)`,
						`***Reason:*** ${reason}`
					].join('\n'))
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				sendChannel.send({ embeds: [embed] });
			}
		});
	}

};
