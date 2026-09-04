const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fds')
    .setDescription('Terminer son service.'),

  async execute(interaction) {
    // Vérifie que la commande est utilisée dans le bon salon
    if (interaction.channelId !== process.env.FDS_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Cette commande ne peut être utilisée que dans <#${process.env.FDS_CHANNEL_ID}>.`,
        ephemeral: true,
      });
    }

    const maintenant = new Date();
    const date = maintenant.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
    const heure = maintenant.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

    await interaction.reply(
      `🔴 **Fin de service confirmée**\n👤 Agent : ${interaction.user}\n📅 Date : ${date}\n🕒 Heure : ${heure}`
    );
  },
};
