import { Command } from "../../structures/Command";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  messageLink,
} from "discord.js";
import { addCommas, unabbreviate } from "../../functions";

export default new Command({
  name: "deposit",
  description: "Move some money from your wallet to your bank account.",
  options: [
    {
      name: "amount",
      description: 'The amount of money you want to move, or "all".',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  timeout: {
    time: 1000,
  },
  run: async ({ client, interaction }) => {
    const amount = interaction.options.getString("amount", true);
    let amountTransferred: number;

    const wallet = client.db.get(interaction.member.id, "wallet");
    if (amount === "all") {
      if (wallet <= 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You don't have enough money in your wallet.")
              .setColor("Red"),
          ],
        });

      client.db.set(interaction.member.id, 0, "wallet");
      client.db.math(interaction.member.id, "+", wallet, "bank");

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

      client.db.math(interaction.member.id, "-", amountNum, "wallet");
      client.db.math(interaction.member.id, "+", amountNum, "bank");

      amountTransferred = amountNum;
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .addFields(
            {
              name: "Deposited",
              value: `⚡ ${addCommas(amountTransferred)}`,
            },
            {
              name: "Current Wallet Balance",
              value: `⚡ ${addCommas(
                client.db.get(interaction.member.id, "wallet")
              )}`,
              inline: true,
            },
            {
              name: "Current Bank Balance",
              value: `⚡ ${addCommas(
                client.db.get(interaction.member.id, "bank")
              )}`,
              inline: true,
            }
          )
          .setColor(client.config.color),
      ],
    });
  },
});
