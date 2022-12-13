import { Event } from "../structures/Event";
import { CmdInteraction } from "../typings/Command";
import { AutocompleteInteraction } from "discord.js";
import { EmbedBuilder, GuildMember } from "discord.js";

export default new Event("interactionCreate", async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    client.db.ensure(interaction.user.id, {
      wallet: 0,
      bank: 0,
      cooldowns: null,
    });

    const check = client.db.get(
      (interaction.member as GuildMember).id,
      `cooldowns.${interaction.commandName}`
    );

    const timeout = command?.timeout;

    if (
      timeout?.time &&
      check !== null &&
      timeout?.time - (Date.now() - check) > 0
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${timeout?.title || "Stop it. Get some help."}`)
            .setDescription(
              `${timeout?.description || "Try again"} <t:${(
                (check + timeout?.time) /
                1000
              ).toFixed(0)}:R>.`
            )
            .setColor(client.config.color),
        ],
      });

    command.run({
      client,
      interaction: interaction as CmdInteraction,
    });

    if (timeout?.time)
      client.db.set(
        (interaction.member as GuildMember).user.id,
        Date.now(),
        `cooldowns.${interaction.commandName}`
      );
  } else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    command.autocomplete?.({
      client,
      interaction: interaction as AutocompleteInteraction,
    });
  }
});
