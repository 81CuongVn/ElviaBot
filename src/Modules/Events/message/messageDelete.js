const Event = require('../../../Structures/Event.js');
const ElainaEmbed = require('../../../Structures/ElainaEmbed.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot) return;

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (guildData.plugins.audits) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.audits);
			if (!sendChannel) return;

			const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
			const roleColor = message.guild.me.roles.highest.hexColor;

			const embed = new ElainaEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('Message Delete')
				.setDescription([
					`***Message ID:*** \`${message.id}\``,
					`***Channel:*** ${message.channel}`,
					`***Author:*** ${message.member.displayName}`,
					`${attachments ? `***Attachments:*** ${attachments.join('\n')}` : ''}`
				].join('\n'))
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));
			if (message.content.length) {
				embed.splitFields(`***Deleted Message:*** ${message.content}`);
			}

			if (sendChannel) sendChannel.send(embed);
		}
	}

};
