import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  ClientEvents,
  Collection,
} from "discord.js";
import fs from "fs";
import path from "path";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/client";
import { ClientConfig } from "../typings/Config";
import { Event } from "./Event";
import Enmap from "enmap";

type BotOptions = Omit<ClientOptions, "intents">;

export class Bot extends Client {
  commands: Collection<string, CommandType> = new Collection();
  config: ClientConfig = require("../../config.json");
  db = new Enmap("db", {
    dataDir: "./db/",
  });

  constructor(options: BotOptions = {}) {
    super({
      intents: ["Guilds"],
      ...options,
    });
  }

  start() {
    if (!process.env.token || process.env.token.length < 10)
      throw new SyntaxError("No valid token provided.");
    this.registerModules();
    this.login(process.env.token);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId && guildId.length) {
      const guild = this.guilds.cache.get(guildId);
      if (!guild) return;
      guild.commands.set(commands);
      console.log(`Registered commands in ${guild.name}.`);
    } else {
      this.application?.commands.set(commands);
      console.log("Registered commands globally.");
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    fs.readdirSync(path.join(__dirname, "../commands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, `../commands/${dir}`))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of commandFiles) {
        const command: CommandType = await this.importFile(
          `../commands/${dir}/${file}`
        );
        if (!command.name) return;

        this.commands.set(command.name, command);
        slashCommands.push(command);
      }
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: this.config.guildId,
      });
    });

    // Events
    const eventFiles = fs
      .readdirSync(path.join(__dirname, "../events"))
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(
        `../events/${file}`
      );
      this.on(event.event, event.run.bind(null, this));
    }
  }
}
