const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'interact',
			subCommand: 'dance',
			description: 'Dance with someone.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user', true);

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://api.waifu.pics/sfw/dance`, { headers }).then(res => res.data);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setDescription(`**${interaction.user.username}** is dancing with **${member.user.username}**.`)
			.setImage(result.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed] });
	}

};