import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import { random } from "../../functions";
import ms from "ms";

const messages = {
  success: [
    "Fine, take my money.",
    "You've convinced me, take my money.",
    "Here, take all I have.",
    "Oh you poor soul, take my money.",
  ],
  fail: [
    "No.",
    "I don't feel like it.",
    "I still need money to feed my family.",
    "HeRe In AmErIcA wE dOnT dO cOmMuNiSm",
    "Stop begging and get your own money.",
    "Stay away from me.",
    "The only people I give money to is people in need.",
    "begging is cringe bro",
    "begone thot",
  ],
};

const characters = [
  "Dank Memer",
  "Jimmy",
  "Chandler",
  "Karl",
  "Chris",
  "Nolan",
  "Toastify",
  "Graphify",
  "Kim Jong Un",
  "Jeff Kaplan",
  "Tom Holland",
];

export default new Command({
  name: "beg",
  description: "Beg for some bolts from strangers.",
  timeout: {
    time: ms("45s"),
    title: "Stop begging so much!",
  },
  run: async ({ client, interaction }) => {
    const chance = random(1, 2);
    const amount = random(1, 500);

    if (chance !== 2) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(characters[random(0, characters.length)])
            .setDescription(
              '"' + messages.fail[random(0, messages.fail.length - 1)] + '"'
            )
            .setColor("Red"),
        ],
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(characters[random(0, characters.length)])
          .setDescription(
            '"' + messages.success[random(0, messages.success.length - 1)] + '"'
          )
          .setColor("Green")
          .setFooter({
            text: `You recieved ⚡ ${amount}`,
          }),
      ],
    });

    client.db.math(interaction.member.id, "+", amount, "wallet");
  },
});
