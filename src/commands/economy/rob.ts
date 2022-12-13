import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { random } from "../../functions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "rob",
  description: "Rob someone out of bolts.",
  options: [
    {
      name: "user",
      description: "The user you want to rob.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const user = interaction.options.getUser("user");
    if (!user) return;

    client.db.ensure(user.id, {
      wallet: 0,
      bank: 0,
    });
    if (client.db.get(user.id, "wallet") === 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You can't rob a poor person.")
            .setColor("Red"),
        ],
      });

    const chance = random(1, 2);
    const earnings = Math.abs(
      random(0.05, 0.1) * client.db.get(user.id, "wallet")
    );
    if (chance !== 2) {
      client.db.math(interaction.user.id, "-", earnings, "wallet");
      client.db.math(user.id, "+", earnings, "wallet");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You got caught and had to pay **${user.username}** ⚡ ${earnings}.`
            )
            .setColor("Red"),
        ],
      });
    } else {
      client.db.math(interaction.user.id, "+", earnings, "wallet");
      client.db.math(user.id, "-", earnings, "wallet");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You stole ⚡ ${earnings} from **${user.username}**!`
            )
            .setColor("Green"),
        ],
      });
    }
  },
});
