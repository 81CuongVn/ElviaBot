import Command from '../../../../Structures/Interaction.js';
import flip from 'flip-text';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'flip'],
			description: 'Flip your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: flip(text) });
	}

}