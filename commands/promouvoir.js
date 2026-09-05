const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promouvoir')
    .setDescription('Change le grade d\'un agent (réservé à la Direction Générale).')
    .addUserOption(option =>
      option.setName('agent')
        .setDescription('L\'agent à promouvoir')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role_actuel')
        .setDescription('Le rôle actuel à retirer')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role_futur')
        .setDescription('Le nouveau rôle à attribuer')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(process.env.DIRECTION_ROLE_ID)) {
      return interaction.reply({
        content: '❌ Cette commande est réservée à la Direction Générale.',
        ephemeral: true,
      });
    }

    const agent = interaction.options.getMember('agent');
    const roleActuel = interaction.options.getRole('role_actuel');
    const roleFutur = interaction.options.getRole('role_futur');

    if (!agent) {
      return interaction.reply({
        content: '❌ Impossible de trouver cet agent sur le serveur.',
        ephemeral: true,
      });
    }

    const positionBot = interaction.guild.members.me.roles.highest.position;
    if (roleActuel.position >= positionBot || roleFutur.position >= positionBot) {
      return interaction.reply({
        content: '❌ Un des rôles est placé au-dessus (ou au même niveau) de mon propre rôle dans la hiérarchie Discord. Déplace mon rôle plus haut dans les paramètres du serveur.',
        ephemeral: true,
      });
    }

    if (!agent.roles.cache.has(roleActuel.id)) {
      return interaction.reply({
        content: `⚠️ ${agent.user.username} ne possède pas le rôle **${roleActuel.name}**.`,
        ephemeral: true,
      });
    }

    if (agent.roles.cache.has(roleFutur.id)) {
      return interaction.reply({
        content: `⚠️ ${agent.user.username} possède déjà le rôle **${roleFutur.name}**.`,
        ephemeral: true,
      });
    }

    await agent.roles.remove(roleActuel);
    await agent.roles.add(roleFutur);

    const embed = new EmbedBuilder()
      .setTitle('🎉 Promotion — Félicitations !')
      .setDescription(
        `${agent} vient d'être promu(e) au sein des Services Douaniers !\n\n` +
        `📉 Ancien rôle : **${roleActuel.name}**\n` +
        `📈 Nouveau rôle : **${roleFutur.name}**\n\n` +
        `Toutes nos félicitations pour ce nouveau grade, mérité par votre engagement et votre sérieux au service de la Douane. 🎖️`
      )
      .setColor(0xFFD700)
      .setFooter({ text: `Décision signée par ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ content: `${agent}`, embeds: [embed] });
  },
};
