import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { addCommas, unabbreviate } from "../../functions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "give",
  description: "Give some money to a user.",
  options: [
    {
      name: "user",
      description: "The user to give the money to.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "amount",
      description: 'The amount to give to the user, or "all".',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const user = interaction.options.getMember("user");
    if (!user) return;
    const amount = interaction.options.getString("amount", true);
    let amountTransferred: number;

    client.db.ensure(user.id, {
      wallet: 0,
      bank: 0,
    });

    const wallet = client.db.get(interaction.user.id, "wallet");
    if (amount === "all") {
      if (wallet <= 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You don't have enough money in your wallet.")
              .setColor("Red"),
          ],
        });

      client.db.set(interaction.user.id, 0, "wallet");
      client.db.math(user.id, "+", wallet, "wallet");

      amountTransferred = wallet;
    } else {
      const amountNum = unabbreviate(amount);
      if (isNaN(amountNum) || amountNum % 1 != 0 || amountNum <= 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription('The amount must be a whole number, or "all".')
              .setColor("Red"),
          ],
        });
      if (wallet < amountNum)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You don't have enough money in your wallet.")
              .setColor("Red"),
          ],
        });

      client.db.math(interaction.user.id, "-", amountNum, "wallet");
      client.db.math(user.id, "+", amountNum, "wallet");

      amountTransferred = amountNum;
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .addFields(
            {
              name: "Donated",
              value: `⚡ ${addCommas(amountTransferred)}`,
            },
            {
              name: "Your Wallet Balance",
              value: `⚡ ${addCommas(
                client.db.get(interaction.user.id, "wallet")
              )}`,
              inline: true,
            },
            {
              name: `Their Wallet Balance`,
              value: `⚡ ${addCommas(client.db.get(user.id, "wallet"))}`,
              inline: true,
            }
          ).setColor(client.config.color),
      ],
    });
  },
});
