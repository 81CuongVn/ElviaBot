const MessageCommand = require('../../../Structures/Command');
const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } = require('@discordjs/builders');
const { ComponentType } = require('discord-api-types/v10');
const { Colors, Links } = require('../../../Utils/Constants');
const { nanoid } = require('nanoid');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			name: 'help',
			aliases: ['h'],
			description: 'View help.',
			category: 'Utility',
			usage: '(command)',
			disabled: true
		});
	}

	async run(message, [command]) {
		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) return message.reply({ content: `There is not a command named \`${command}\`. Try searching something else.` });

			embed.setAuthor({ name: `Command | ${cmd.name.toTitleCase()}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Command Parameters: \`[]\` is strict & \`()\` is optional\n`,
				`***Aliases:*** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases.'}`,
				`***Description:*** ${cmd.description}`,
				`***Category:*** ${cmd.category}`,
				`***Permission(s):*** ${cmd.memberPermissions.toArray().length > 0 ? `${cmd.memberPermissions.toArray().map(perm => `\`${this.client.utils.formatPermissions(perm)}\``).join(', ')}` : 'No permission required.'}`,
				`***Cooldown:*** ${cmd.cooldown / 1000} second(s)`,
				`***Usage:*** ${cmd.usage ? `\`${this.client.prefix + cmd.name} ${cmd.usage}\`` : `\`${this.client.prefix + cmd.name}\``}`
			].join('\n'));

			return message.reply({ embeds: [embed] });
		} else {
			const categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category)).map(dir => {
				const getCommand = this.client.commands.filter(cmd => cmd.category === dir)
					.map(cmd => ({
						name: cmd.name
					}));

				return {
					directory: dir,
					commands: getCommand
				};
			});

			embed.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Need more help? Come join our [guild](${Links.SupportServer})`,
				`The bot prefix is: \`${this.client.prefix}\``
			].join('\n'));

			const menuId = `menu-${nanoid()}`;
			const menu = (state) => new ActionRowBuilder()
				.addComponents([new SelectMenuBuilder()
					.setCustomId(menuId)
					.setPlaceholder('Select a category!')
					.setDisabled(state)
					.addOptions(categories.filter(({ directory }) => this.client.utils.filterCategory(directory, { message })).map(({ directory }) => ({
						label: directory,
						value: directory.toLowerCase(),
						description: `Shows all the ${directory} Commands`
					})))]);

			const reply = await message.reply({ embeds: [embed], components: [menu(false)] });

			const filter = (i) => i.user.id === message.author.id;
			const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60000 });

			collector.on('collect', async (i) => {
				collector.resetTimer();

				const [selected] = i.values;
				const category = categories.find(({ directory }) => directory.toLowerCase() === selected);

				embed.setAuthor({ name: `Category | ${category.directory}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
				embed.setFields([{ name: `__Available commands__`, value: category.commands.map(({ name }) => `\`${name}\``).join(' ') }]);
				embed.setFooter({ text: `Powered by ${this.client.user.username} | ${category.commands.length} Commands`, iconURL: message.author.avatarURL() });

				return i.update({ embeds: [embed], components: [menu(false)] });
			});

			collector.on('ignore', (i) => {
				if (i.user.id !== message.author.id) return i.deferUpdate();
			});

			collector.on('end', (collected, reason) => {
				if ((!collected.size && reason === 'time') || reason === 'time') {
					return reply.edit({ components: [menu(true)] });
				}
			});
		}
	}

};
