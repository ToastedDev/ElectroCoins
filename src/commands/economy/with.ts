import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { addCommas, unabbreviate } from "../../functions";

export default new Command({
  name: "withdraw",
  description: "Move some money from your bank account to your wallet.",
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

    const bank = client.db.get(interaction.member.id, "bank");
    if (amount === "all") {
      if (bank <= 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You don't have enough money in your bank account."
              )
              .setColor("Red"),
          ],
        });

      client.db.set(interaction.member.id, 0, "bank");
      client.db.math(interaction.member.id, "+", bank, "wallet");

      amountTransferred = bank;
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
      if (bank < amountNum)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You don't have enough money in your bank account."
              )
              .setColor("Red"),
          ],
        });

      client.db.math(interaction.member.id, "-", amountNum, "bank");
      client.db.math(interaction.member.id, "+", amountNum, "wallet");

      amountTransferred = amountNum;
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .addFields(
            {
              name: "Withdrawn",
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
