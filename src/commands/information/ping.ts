import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new Command({
  name: "ping",
  description: "Pings the Discord API.",
  run: async ({ client, interaction }) => {
    const d1 = new Date().getMilliseconds();
    interaction
      .reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Pinging...")
            .setColor(client.config.color),
        ],
        ephemeral: true,
        fetchReply: true,
      })
      .then((res) => {
        let host = new Date().getMilliseconds() - d1;
        if (host < 0) host *= -1;
        if (host > 10) host = Math.floor(host / 10);
        const ping = res.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("🏓 Pong!")
              .addFields(
                {
                  name: "🧠 Bot",
                  value: `\`\`\`${ping}ms\`\`\``,
                  inline: true,
                },
                {
                  name: "📶 API",
                  value: `\`\`\`${client.ws.ping}ms\`\`\``,
                  inline: true,
                },
                {
                  name: "💻 Host",
                  value: `\`\`\`${host}ms\`\`\``,
                  inline: true,
                }
              )
              .setColor(client.config.color),
          ],
        });
      });
  },
});
