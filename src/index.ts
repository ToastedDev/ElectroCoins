import { ActivityType } from "discord.js";
import "dotenv/config";
import { Bot } from "./structures/Client";

export const client = new Bot({
  presence: {
    activities: [
      {
        name: "money rain",
        type: ActivityType.Watching,
      },
    ],
  },
});

client.start();
