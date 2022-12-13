import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { random, unabbreviate } from "../../functions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "coinflip",
  description: "Bet on some money and flip a coin to see if you gain or lose!",
  options: [
    {
      name: "bet",
      description: "What do you think it will land on?",
      type: ApplicationCommandOptionType.Number,
      choices: [
        {
          name: "Heads",
          value: 1,
        },
        {
          name: "Tails",
          value: 2,
        },
      ],
      required: true,
    },
    {
      name: "amount",
      description:
        "The amount of money that you'll be betting on. Maximum is 10,000.",
      type: ApplicationCommandOptionType.String,
      maxValue: 10_000,
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const bet = interaction.options.getNumber("bet");
    const amount = unabbreviate(interaction.options.getString("amount", true));
    if (amount > 10000)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("The bet must be below ⚡ 10,000.")
            .setColor("Red"),
        ],
      });
    if (client.db.get(interaction.user.id, "wallet") < amount)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You don't have enough money to flip a coin.")
            .setColor("Red"),
        ],
      });

    const choice = random(1, 2);
    const choices = ["heads", "tails"];

    if (choice === bet) {
      client.db.math(interaction.user.id, "+", amount, "wallet");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `It was **${choices[choice - 1]}**! You won ⚡ ${amount}.`
            )
            .setColor("Green"),
        ],
      });
    } else {
      client.db.math(interaction.user.id, "-", amount, "wallet");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `It was **${choices[choice - 1]}**. You lost ⚡ ${amount}.`
            )
            .setColor("Red"),
        ],
      });
    }
  },
});
