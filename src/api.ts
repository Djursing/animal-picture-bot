import { EmbedBuilder, TextChannel } from 'discord.js';
import { client } from './client';

export const CHANNEL_ID = '1510364506209911045';

export const ANIMALS = [
  'cat', 'dog', 'bird', 'panda', 'redpanda', 'koala', 'fox', 'whale',
  'dolphin', 'kangaroo', 'rabbit', 'lion', 'bear', 'frog', 'duck',
  'penguin', 'axolotl', 'capybara', 'hedgehog', 'turtle', 'narwhal',
  'squirrel', 'fish', 'horse',
];

interface AnimalResponse {
  animal: string;
  image: string;
  fact: string;
}

export async function fetchAnimal(animal: string): Promise<AnimalResponse> {
  const res = await fetch(`https://api.animality.xyz/all/${animal}`);
  if (!res.ok) throw new Error(`Animality API returned ${res.status} for ${animal}`);
  return res.json() as Promise<AnimalResponse>;
}

export async function sendAnimalMessage(animal?: string): Promise<void> {
  const chosen = animal ?? ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const data = await fetchAnimal(chosen);

  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel?.isTextBased()) throw new Error('Channel not found or not text-based');

  const embed = new EmbedBuilder()
    .setTitle(chosen.charAt(0).toUpperCase() + chosen.slice(1))
    .setDescription(data.fact)
    .setImage(data.image)
    .setColor(0x5865f2);

  await (channel as TextChannel).send({ embeds: [embed] });
}
