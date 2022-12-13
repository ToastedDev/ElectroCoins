import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { addCommas } from "../../functions";

export default new Command({
  name: "balance",
  description: "View the balance of a user.",
  options: [
    {
      name: "user",
      description: "The user to see the balance of.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  timeout: {
    time: 1000,
  },
  run: async ({ client, interaction }) => {
    const user = interaction.options.getUser("user") || interaction.user;

    client.db.ensure(user.id, {
      wallet: 0,
      bank: 0,
    });

    const data = client.db.get(user.id);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${user.username}'s balance`)
          .setDescription(
            `**Wallet**: ⚡ ${addCommas(data.wallet)}\n**Bank**: ⚡ ${addCommas(
              data.bank
            )}`
          )
          .setColor(client.config.color),
      ],
    });
  },
});
