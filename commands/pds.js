const { SlashCommandBuilder } = require('discord.js');
const { loadData, saveData } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pds')
    .setDescription('Prendre son service.'),

  async execute(interaction) {
    if (interaction.channelId !== process.env.PDS_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Cette commande ne peut être utilisée que dans <#${process.env.PDS_CHANNEL_ID}>.`,
        ephemeral: true,
      });
    }

    const data = loadData();

    // Empêche de reprendre un service déjà en cours
    if (data.active[interaction.user.id]) {
      return interaction.reply({
        content: '⚠️ Tu as déjà un service en cours. Utilise la commande de fin de service avant d\'en reprendre un.',
        ephemeral: true,
      });
    }

    const maintenant = new Date();
    data.active[interaction.user.id] = maintenant.getTime();
    saveData(data);

    const date = maintenant.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
    const heure = maintenant.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

    await interaction.reply(
      `🟢 **Prise de service confirmée**\n👤 Agent : ${interaction.user}\n📅 Date : ${date}\n🕒 Heure : ${heure}`
    );
  },
};
