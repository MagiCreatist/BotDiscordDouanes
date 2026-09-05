const { SlashCommandBuilder } = require('discord.js');
const { loadData, saveData, formatDuree, incrementerServices } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fds')
    .setDescription('Terminer son service.'),

  async execute(interaction) {
    if (interaction.channelId !== process.env.FDS_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Cette commande ne peut être utilisée que dans <#${process.env.FDS_CHANNEL_ID}>.`,
        ephemeral: true,
      });
    }

    const data = loadData();
    const debut = data.active[interaction.user.id];

    if (!debut) {
      return interaction.reply({
        content: '⚠️ Tu n\'as pas de service en cours. Utilise d\'abord la commande de prise de service.',
        ephemeral: true,
      });
    }

    const maintenant = new Date();
    const duree = maintenant.getTime() - debut;
    const dureeFormatee = formatDuree(duree);

    delete data.active[interaction.user.id];
    incrementerServices(data, interaction.user.id);
    saveData(data);

    const totalServices = data.stats[interaction.user.id].totalServices;
    const date = maintenant.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
    const heure = maintenant.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

    await interaction.reply(
      `🔴 **Fin de service confirmée**\n👤 Agent : ${interaction.user}\n📅 Date : ${date}\n🕒 Heure : ${heure}\n⏱️ Durée du service : ${dureeFormatee}\n📊 Total services effectués : ${totalServices}`
    );
  },
};
