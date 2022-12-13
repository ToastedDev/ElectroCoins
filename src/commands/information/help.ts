import { Command } from "../../structures/Command";
import { EmbedBuilder, APIEmbedField, ClientUser } from "discord.js";
import fs from "fs";
import path from "path";
import { CommandType } from "../../typings/Command";
import { capitalize } from "../../functions";

export default new Command({
  name: "help",
  description: "View all my commands.",
  run: async ({ client, interaction }) => {
    const categories: APIEmbedField[] = [];

    fs.readdirSync(path.join(__dirname, "../../commands")).forEach((dir) => {
      const commands = fs
        .readdirSync(path.join(__dirname, `../../commands/${dir}`))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      const cmds = commands.map((command) => {
        let file: CommandType =
          require(`../../commands/${dir}/${command}`)?.default;
        if (!file) return;

        return `\`${file.name}\``;
      });

      if (!cmds) return;

      categories.push({
        name: `${capitalize(dir)} [${cmds.length}]`,
        value: cmds.join(", "),
      });
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: (client.user as ClientUser).username,
            iconURL: (client.user as ClientUser).displayAvatarURL(),
          })
          .setFields(categories)
          .setColor(client.config.color),
      ],
      ephemeral: true,
    });
  },
});
