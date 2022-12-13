import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import { addCommas } from "../../functions";
import ms from "ms";

export default new Command({
  name: "weekly",
  description: "Recieve your weekly amount of bolts.",
  timeout: {
    time: ms("7d"),
    title: "You already got your weekly this week!",
  },
  run: async ({ client, interaction }) => {
    const reward = 10000;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s Weekly Coins`)
          .setDescription(`⚡ ${addCommas(reward)} was placed in your wallet!`)
          .setColor(client.config.color),
      ],
    });

    client.db.math(interaction.member.id, "+", reward, "wallet");
  },
});
