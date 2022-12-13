import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import ms from "ms";
import { Command } from "../../structures/Command";
import { random } from "../../functions";

const locations = [
  "car",
  "sock",
  "wallet",
  "pocket",
  "Discord HQ",
  "purse",
  "briefcase",
  "movie theater",
  "grass",
  "bushes",
  "ocean",
  "coffee shop",
  "bank",
];

export default new Command({
  name: "search",
  description: "Search for some bolts.",
  timeout: {
    time: ms("30s"),
  },
  run: async ({ client, interaction }) => {
    const selectedLocations = locations
      .sort(() => Math.random() - Math.random())
      .slice(0, 3);
    const components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        selectedLocations.map((name, index) =>
          new ButtonBuilder()
            .setCustomId(index.toString())
            .setLabel(name)
            .setStyle(ButtonStyle.Primary)
        )
      ),
    ];

    const res = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .addFields({
            name: "Where would you like to search?",
            value: "Just click on one of the buttons below!",
          })
          .setColor(client.config.color),
      ],
      components,
    });

    const collector = res.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: ms("20s"),
    });
    collector.on("collect", async (int) => {
      if (int.user.id !== interaction.user.id)
        return void int.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              `Only **${interaction.user.tag}** can use these buttons.`
            ),
          ],
        });

      const earnings = random(100, 1000);
      int.update({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You searched the **${
                selectedLocations[parseInt(int.customId)]
              }** and found ⚡ ${earnings}!`
            )
            .setColor("Green"),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            selectedLocations.map((name, index) =>
              new ButtonBuilder()
                .setCustomId(index.toString())
                .setLabel(name)
                .setStyle(
                  index.toString() === int.customId
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary
                )
                .setDisabled(true)
            )
          ),
        ],
      });
      client.db.math(interaction.user.id, "+", earnings, "wallet");
      collector.stop("done");
    });
    collector.on("end", (_, reason) => {
      if (reason === "time")
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Guess you didn't want to search anywhere, that's fine with me."
              )
              .setColor("Red"),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              selectedLocations.map((name, index) =>
                new ButtonBuilder()
                  .setCustomId(index.toString())
                  .setLabel(name)
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              )
            ),
          ],
        });
    });
  },
});
