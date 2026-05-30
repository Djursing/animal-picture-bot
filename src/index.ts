import http from 'http';
import { client } from './client';
import { registerCommands, handleInteraction } from './commands';

// Health endpoint — keeps Fly.io from autostopping the machine
http.createServer((_, res) => res.end('ok')).listen(3000);

client.once('ready', async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', (interaction) => {
  handleInteraction(interaction).catch((err) => console.error('Interaction error:', err));
});

client.on('error', (err) => console.error('Discord client error:', err));

client.login(process.env.DISCORD_TOKEN);
