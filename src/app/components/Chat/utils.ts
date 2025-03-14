import { Message } from '../TurnRenderer/types';
import Character from '@/app/core/character';
import Persona from '@/app/core/persona';

const buildMemoryContext = (memories: Message[]) =>
  memories.length > 0
    ? `Important moments:\n\t+ ${memories.map((message) => `${message.role}: '''${message.content}'''`).join('\n\t+ ')}`
    : null;

export const buildSystemMessage = (
  character?: Character,
  persona?: Persona,
  memories: Message[] = [],
  systemPromptPrefix?: string
) => {
  const promptParts: string[] = [];
  systemPromptPrefix && promptParts.push(systemPromptPrefix);
  const characterContext = character?.context();
  characterContext && promptParts.push(characterContext);
  const personaContext = persona?.context();
  personaContext && promptParts.push(personaContext);
  const memoryContext = buildMemoryContext(memories);
  memoryContext && promptParts.push(memoryContext);
  return promptParts.join('\n\n###\n\n') || '.';
};

export const buildChatMessages = (
  history: Message[],
  character?: Character,
  persona?: Persona,
  memories: Message[] = [],
  systemPromptPrefix?: string
) => {
  const systemMessage = buildSystemMessage(character, persona, memories, systemPromptPrefix);
  return [
    {
      role: 'system',
      content: systemMessage
    },
    ...history
  ];
};
