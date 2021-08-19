const Command = require('../../Structures/Command.js');
const { MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../package.json');
const { Color, Emoji } = require('../../Utils/Configuration.js');
const moment = require('moment');
const os = require('os');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['botinfo', 'info'],
			description: 'Displays information about running Bots!',
			category: 'Utilities',
			cooldown: 3000
		});
	}

	async run(message) {
		const core = os.cpus()[0];

		const status = {
			online: `${Emoji.ONLINE} Online`,
			idle: `${Emoji.IDLE} Idle`,
			dnd: `${Emoji.DND} Do Not Disturb`,
			invisible: `${Emoji.OFFLINE} Offline`
		};

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Information about ${this.client.user.username}`, this.client.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Client:*** ${this.client.user.tag}`,
				`***ID:*** \`${this.client.user.id}\``,
				`***Creators:*** ${this.client.users.resolve(this.client.owners[0])}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${version}`,
				`***Node:*** [${process.version}](https://nodejs.org/)`,
				`***Library:*** [Discord.js v${discordVersion}](https://discord.js.org/)`,
				`***Registered:*** ${moment(this.client.user.createdAt).format('MMMM D, YYYY HH:mm')} (${moment(this.client.user.createdAt, 'YYYYMMDDHHmmss').fromNow()})`
			].join('\n'))
			.addField('__Systems__', [
				`***Platform:*** ${os.type} ${os.release} ${os.arch}`,
				`***CPU:*** ${core.model} ${os.cpus().length} Cores ${core.speed}MHz`,
				`***Memory:*** ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)} / ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`,
				`***Host:*** ${moment.duration(os.uptime * 1000).format('D [days], H [hrs], m [mins], s [secs]')}`
			].join('\n'))
			.setFooter(`Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
