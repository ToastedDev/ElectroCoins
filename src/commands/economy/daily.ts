import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import { addCommas } from "../../functions";
import ms from "ms";

export default new Command({
  name: "daily",
  description: "Recieve your daily amount of bolts.",
  timeout: {
    time: ms("1d"),
    title: "You already got your daily today!",
  },
  run: async ({ client, interaction }) => {
    const reward = 5000;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${interaction.member.displayName}'s Daily Coins`)
          .setDescription(`⚡ ${addCommas(reward)} was placed in your wallet!`)
          .setColor(client.config.color),
      ],
    });

    client.db.math(interaction.member.id, "+", reward, "wallet");
  },
});
