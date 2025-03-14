'use client';

import { useContext, useState } from 'react';
import OptionButton from '../OptionButton/component';
import Downloader from '../Downloader/component';
import Memories from '../Memories/component';
import { RenderTurn } from '../Chat/types';
import { ChatActions } from '../Chat/contexts';
import FileSelector from '../FileSelector/component';
import Character from '@/app/core/character';
import Persona from '@/app/core/persona';
import CharacterConfigs from '../CharacterConfigs/component';
import PersonaConfigs from '../PersonaConfigs/component';

export default function SideBar(props: {
  memories?: RenderTurn[];
  character?: Character;
  persona?: Persona;
  onUpdateCharacter?:
    | ((character?: Character) => void)
    | ((character?: Character) => Promise<void>);
  onUpdatePersona?: ((persona?: Persona) => void) | ((persona?: Persona) => Promise<void>);
}) {
  const [showMemories, setShowMemories] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showPersona, setShowPersona] = useState(false);

  const chatActions = useContext(ChatActions);

  return (
    <div className='relative flex items-center justify-center size-full p-4 overflow-hidden rounded-tl-3xl rounded-bl-3xl'>
      <div className='flex flex-col items-center justify-center gap-y-1 w-1/2 rounded-2xl overflow-hidden'>
        <Downloader
          data={() => JSON.stringify(chatActions?.getHistory() ?? [])}
          fileName='history.json'
          type='application/json'
        >
          <OptionButton>Export history</OptionButton>
        </Downloader>
        <div className='size-full'>
          <FileSelector
            id='import-history'
            onFileSelect={async (files) =>
              files && chatActions?.setHistory(JSON.parse(await files[0].text()))
            }
            accept='.json,application/json'
            className='hidden'
          />
          <OptionButton onClick={() => document.getElementById('import-history')?.click()}>
            Import history
          </OptionButton>
        </div>
        {props.memories ? (
          <OptionButton onClick={() => setShowMemories(true)}>Memories</OptionButton>
        ) : (
          <></>
        )}
        {props.onUpdateCharacter ? (
          <OptionButton onClick={() => setShowCharacter(true)}>Character</OptionButton>
        ) : (
          <></>
        )}
        {props.onUpdatePersona ? (
          <OptionButton onClick={() => setShowPersona(true)}>Persona</OptionButton>
        ) : (
          <></>
        )}
      </div>
      {props.memories ? (
        <div
          onClick={() => setShowMemories(false)}
          className={`absolute size-full overflow-y-scroll p-4 bg-[#000000e5] ${showMemories ? 'animate-slide-in-r' : 'animate-slide-out-r'}`}
        >
          <Memories turns={props.memories} />
        </div>
      ) : (
        <></>
      )}
      {props.onUpdateCharacter ? (
        <div
          className={`absolute flex flex-col items-start justify-between gap-y-2 size-full overflow-y-scroll p-4 bg-[#000000e5] ${showCharacter ? 'animate-slide-in-r' : 'animate-slide-out-r'}`}
        >
          <CharacterConfigs
            character={props.character}
            onUpdateCharacter={props.onUpdateCharacter}
            onConfirmationResultComplete={() => setShowCharacter(false)}
          />
        </div>
      ) : (
        <></>
      )}
      {props.onUpdatePersona ? (
        <div
          className={`absolute flex flex-col items-start justify-between gap-y-2 size-full overflow-y-scroll p-4 bg-[#000000e5] ${showPersona ? 'animate-slide-in-r' : 'animate-slide-out-r'}`}
        >
          <PersonaConfigs
            persona={props.persona}
            onUpdatePersona={props.onUpdatePersona}
            onConfirmationResultComplete={() => setShowPersona(false)}
          />
        </div>
      ) : (
        <></>
      )}
      <div className='absolute size-full bg-[var(--bg-color-dark)] animate-slide-out-r'></div>
    </div>
  );
}
