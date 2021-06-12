const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lockdown'],
			description: 'Lock the channel for a certain period of time! Use `lockdown end` to end lockdown early.',
			category: 'Moderation',
			usage: '[duration]',
			userPerms: ['MANAGE_CHANNELS'],
			clientPerms: ['MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [time]) {
		if (!this.client.lockit) this.client.lockit = [];
		if (!time) {
			return message.quote('A duration for the lockdown must be set!');
		}

		const roleColor = message.guild.me.roles.highest.hexColor;
		const validUnlocks = ['unlock', 'end', 'stop'];
		if (validUnlocks.includes(time)) {
			message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: null }).then(() => {
				message.channel.send('Lockdown lifted.');
				clearTimeout(this.client.lockit[message.channel.id]);
				delete this.client.lockit[message.channel.id];
			});
		} else {
			message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: false }).then(() => {
				const embed = new MessageEmbed()
					.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
					.setTitle('🔒 Channel locked down')
					.setDescription([
						`***Duration:*** ${ms(ms(time), { long: true })}`,
						`***Issued by:*** ${message.author.tag} (${message.author.id})`
					].join('\n'))
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				message.channel.send(embed).then(() => {
					this.client.lockit[message.channel.id] = setTimeout(() => {
						message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: null })
							.then(message.channel.send('Lockdown lifted.'));
						delete this.client.lockit[message.channel.id];
					}, ms(time));
				});
			});
		}
	}

};
