'use client';

import { useCallback, useContext, useState } from 'react';
import OptionButton from '../OptionButton/component';
import Downloader from '../Downloader/component';
import Memories from '../Memories/component';
import { RenderTurn } from '../Chat/types';
import { ChatActions } from '../Chat/contexts';
import FileSelector from '../FileSelector/component';

export default function SideBar(props: { memories?: RenderTurn[] }) {
  const [showMemories, setShowMemories] = useState(false);

  const chatActions = useContext(ChatActions);

  const toggleMemories = useCallback(() => {
    setShowMemories(!showMemories);
  }, [showMemories]);

  return (
    <div className='relative flex items-center justify-center size-full p-4 overflow-hidden'>
      <div className='flex flex-col items-center justify-center gap-y-2 w-1/2'>
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
        <OptionButton>Character</OptionButton>
        {props.memories ? <OptionButton onClick={toggleMemories}>Memories</OptionButton> : <></>}
        <OptionButton>Profile</OptionButton>
      </div>
      {props.memories ? (
        <div
          onClick={toggleMemories}
          className={`absolute size-full overflow-y-scroll p-4 bg-black opacity-90 ${showMemories ? 'animate-slide-in-r' : 'animate-slide-out-r'}`}
        >
          <Memories turns={props.memories} />
        </div>
      ) : (
        <></>
      )}
      <div className='absolute size-full bg-[var(--bg-color-dark)] animate-slide-out-r'></div>
    </div>
  );
}
