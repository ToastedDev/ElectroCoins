import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import { addCommas, random } from "../../functions";
import ms from "ms";

const jobs = [
  "Programmer",
  "Construction Worker",
  "Waiter",
  "Bus Driver",
  "Chef",
  "Mechanic",
  "Doctor",
  "YouTuber",
  "Streamer",
  "Celebrity",
];

export default new Command({
  name: "work",
  description: "Do some work to get some bolts.",
  timeout: {
    time: ms("40m"),
    title: "You already did your shift!",
    description: "You can work again",
  },
  run: async ({ client, interaction }) => {
    const job = jobs[random(0, jobs.length - 1)];
    const amount = random(1, 2500);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${interaction.member.user.username}'s Work Shift`)
          .setDescription(
            `You worked as a **${job}** and recieved **⚡ ${addCommas(
              amount
            )}**`
          )
          .setColor(client.config.color),
      ],
    });

    client.db.math(interaction.member.id, "+", amount, "wallet");
  },
});
