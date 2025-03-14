'use client';

import { useCallback, useContext, useRef, useState } from 'react';
import Character from '@/app/core/character';
import EditMenu from '../EditMenu/component';
import EditMenuTextOption from '../EditMenuTextOption/component';
import { EditMenuTextOptionImperativeHandle } from '../EditMenuTextOption/types';
import ConfirmationOptions from '../ConfirmationOptions/component';
import { ChatToast } from '../Chat/contexts';

export default function CharacterConfigs(props: {
  character?: Character;
  onUpdateCharacter?: ((character: Character) => void) | ((character: Character) => Promise<void>);
  onConfirmationResultComplete?: (() => void) | (() => Promise<void>);
}) {
  const [character, setCharacter] = useState(props.character);
  const nameRef = useRef<EditMenuTextOptionImperativeHandle>(null);
  const taglineRef = useRef<EditMenuTextOptionImperativeHandle>(null);
  const selfDescriptionRef = useRef<EditMenuTextOptionImperativeHandle>(null);
  const greetingRef = useRef<EditMenuTextOptionImperativeHandle>(null);
  const definitionRef = useRef<EditMenuTextOptionImperativeHandle>(null);

  const chatToast = useContext(ChatToast);

  const updateCharacter = useCallback(
    (confirmationResult: boolean) => {
      if (confirmationResult) {
        const updatedCharacter = new Character(
          nameRef.current?.value,
          taglineRef.current?.value,
          selfDescriptionRef.current?.value,
          greetingRef.current?.value,
          definitionRef.current?.value
        );
        setCharacter(updatedCharacter);
        props.onUpdateCharacter && props.onUpdateCharacter(updatedCharacter);
        chatToast?.current?.toast('Saved character!');
      } else {
        nameRef.current?.setValue(character?.name ?? '');
        taglineRef.current?.setValue(character?.tagline ?? '');
        selfDescriptionRef.current?.setValue(character?.selfDescription ?? '');
        greetingRef.current?.setValue(character?.greeting ?? '');
        definitionRef.current?.setValue(character?.definition ?? '');
      }
      props.onConfirmationResultComplete && props.onConfirmationResultComplete();
    },
    [
      character,
      nameRef.current,
      taglineRef.current,
      selfDescriptionRef.current,
      greetingRef.current,
      definitionRef.current,
      props.onUpdateCharacter,
      props.onConfirmationResultComplete
    ]
  );

  return (
    <>
      <EditMenu className='flex flex-col items-center justify-center gap-y-2 w-full'>
        <EditMenuTextOption
          ref={nameRef}
          label='Name'
          description='Character name'
          rows={1}
          value={character?.name}
        />
        <EditMenuTextOption
          ref={taglineRef}
          label='Tagline'
          description='Character tagline'
          rows={1}
          value={character?.tagline}
        />
        <EditMenuTextOption
          ref={selfDescriptionRef}
          label='Self description'
          description='How would your character describe themselves?'
          rows={5}
          value={character?.selfDescription}
        />
        <EditMenuTextOption
          ref={greetingRef}
          label='Greeting'
          description='How should your character start the conversation'
          rows={3}
          value={character?.greeting}
        />
        <EditMenuTextOption
          ref={definitionRef}
          label='Definition'
          description="What's your character's backstory? How do you want it to talk or act?"
          rows={5}
          value={character?.definition}
        />
      </EditMenu>
      <ConfirmationOptions onResult={updateCharacter} />
    </>
  );
}
