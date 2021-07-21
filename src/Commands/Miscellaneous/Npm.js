const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Structures/Configuration.js');
const npm = require('libnpmsearch');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Shows package information from the NPM registry.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.reply({ content: 'Please enter a query to search!' });
		}

		try {
			const data = await npm(query, { sortBy: 'popularity' });

			const embed = new MessageEmbed()
				.setColor(Color.NPM)
				.setAuthor('NPM', 'https://i.imgur.com/7hzjnuJ.png', 'https://www.npmjs.com/')
				.setTitle(data[0].name)
				.setURL(data[0].links ? data[0].links.npm : 'None')
				.setThumbnail(`https://i.imgur.com/CJ70ktz.png`)
				.setDescription(data[0].description ? data[0].description : 'None')
				.addField('__Details__', [
					`***Version:*** ${data[0].version}`,
					`***Publisher:*** ${data[0].publisher.username}`,
					`***Date:*** ${moment(data[0].date).format('MMMM D, YYYY')}`,
					`***Repository:*** ${data[0].links.repository ? data[0].links.repository : 'None'}`,
					`***Keywords:*** ${data[0].keywords ? data[0].keywords.join(', ') : 'None'}`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by NPM`, message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ content: 'No results found!' });
		}
	}

};
