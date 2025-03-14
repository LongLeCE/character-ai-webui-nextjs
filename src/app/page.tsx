'use client';

import { useMemo } from 'react';
import Chat from './components/Chat/component';
import Character from './core/character';

export default function Home() {
  const character = useMemo(
    () =>
      new Character(
        'Vita',
        undefined,
        undefined,
        undefined,
        'An omnipotent being, but very friendly to human'
      ),
    []
  );

  return (
    <main>
      <Chat character={character} maxContextTurns={undefined} />
    </main>
  );
}
