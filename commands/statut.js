const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadData, formatDuree } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('statut')
    .setDescription('Affiche les agents actuellement en service et hors service.'),

  async execute(interaction) {
    const data = loadData();
    const activeIds = Object.keys(data.active);
    const statsIds = Object.keys(data.stats);

    // Hors service = déjà eu au moins un service terminé, mais pas actif actuellement
    const horsServiceIds = statsIds.filter(id => !activeIds.includes(id));

    const ligneEnService = [];
    for (const userId of activeIds) {
      let pseudo;
      try {
        const membre = await interaction.guild.members.fetch(userId);
        pseudo = membre.displayName;
      } catch {
        pseudo = `Agent inconnu (${userId})`;
      }
      const duree = formatDuree(Date.now() - data.active[userId]);
      ligneEnService.push(`🟢 **${pseudo}** — depuis ${duree}`);
    }

    const ligneHorsService = [];
    for (const userId of horsServiceIds) {
      let pseudo;
      try {
        const membre = await interaction.guild.members.fetch(userId);
        pseudo = membre.displayName;
      } catch {
        pseudo = `Agent inconnu (${userId})`;
      }
      const total = data.stats[userId].totalServices;
      ligneHorsService.push(`🔴 **${pseudo}** — ${total} service${total > 1 ? 's' : ''} au total`);
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Statut des agents — Douanes')
      .addFields(
        {
          name: `🟢 En service (${ligneEnService.length})`,
          value: ligneEnService.length > 0 ? ligneEnService.join('\n') : 'Aucun agent en service actuellement.',
        },
        {
          name: `🔴 Hors service (${ligneHorsService.length})`,
          value: ligneHorsService.length > 0 ? ligneHorsService.join('\n') : 'Aucun agent hors service enregistré.',
        }
      )
      .setColor(0x0F4C81);

    await interaction.reply({ embeds: [embed] });
  },
};
