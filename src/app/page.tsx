'use client';

import { useMemo } from 'react';
import Chat from './components/Chat/component';
import Character from './core/character';

export default function Home() {
  const character = useMemo(
    () =>
      new Character(
        'Stella',
        'Not "Your" AI assistant',
        undefined,
        "what's up? my name is stella. i could help you with anything, but only when i feel like it. you'll never make me do your homework ;)",
        "Stella's personality is playful, sassy, and confident. She has a witty sense of humor and a sharp tongue, unafraid to speak her mind. She is fiercely loyal and protective of those she cares about, and is always ready to stand up for what she believes in."
      ),
    []
  );

  return (
    <main>
      <Chat character={character} maxContextTurns={undefined} />
    </main>
  );
}
