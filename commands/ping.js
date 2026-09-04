const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Vérifie que le bot répond.'),

  async execute(interaction) {
    await interaction.reply('🏓 Pong ! Le bot est en ligne.');
  },
};
