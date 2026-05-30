import { REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction, Interaction, MessageFlags } from 'discord.js';
import { ANIMALS, sendAnimalMessage } from './api';

const command = new SlashCommandBuilder()
  .setName('animal')
  .setDescription('Post a random animal image and fact')
  .addStringOption(option =>
    option.setName('animal')
      .setDescription('Which animal? (optional — random if omitted)')
      .setRequired(false)
      .addChoices(...ANIMALS.map(a => ({ name: a, value: a })))
  );

export async function registerCommands(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const guildId = process.env.GUILD_ID;

  if (!token || !guildId) {
    console.error('DISCORD_TOKEN or GUILD_ID is not set — skipping command registration');
    return;
  }

  const rest = new REST().setToken(token);
  const appId = (await rest.get(Routes.currentApplication()) as { id: string }).id;

  await rest.put(Routes.applicationGuildCommands(appId, guildId), {
    body: [command.toJSON()],
  });

  console.log('Slash command /animal registered');
}

export async function handleInteraction(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'animal') return;

  const cmd = interaction as ChatInputCommandInteraction;
  const animal = cmd.options.getString('animal') ?? undefined;

  cmd.reply({ content: 'Fetching...', flags: MessageFlags.Ephemeral })
    .catch((err) => console.error('Failed to reply to interaction:', err));

  await sendAnimalMessage(animal);
}
