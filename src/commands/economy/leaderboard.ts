import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { addCommas } from "../../functions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "leaderboard",
  description: "View the global leaderboard.",
  run: ({ client, interaction }) => {
    const users = client.db
      .keyArray()
      .filter((user) => client.users.cache.get(user as string))
      .sort((userA, userB) => {
        client.db.ensure(userA, {
          wallet: 0,
        });
        client.db.ensure(userB, {
          wallet: 0,
        });

        return client.db.get(userB, "wallet") - client.db.get(userA, "wallet");
      })
      .map((user, index) => {
        client.db.ensure(user, {
          wallet: 0,
        });
        const userInfo = client.users.cache.get(user as string);
        if (!userInfo) return;
        return `${index + 1}. **${userInfo.tag}**: ⚡ ${addCommas(
          client.db.get(user, "wallet")
        )}`;
      });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "Global Leaderboard",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(users.join("\n"))
          .setColor(client.config.color),
      ],
    });
  },
});
