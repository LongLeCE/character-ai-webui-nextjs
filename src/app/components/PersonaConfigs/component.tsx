'use client';

import { useCallback, useContext, useRef, useState } from 'react';
import Persona from '@/app/core/persona';
import EditMenu from '../EditMenu/component';
import EditMenuTextOption from '../EditMenuTextOption/component';
import { EditMenuTextOptionImperativeHandle } from '../EditMenuTextOption/types';
import ConfirmationOptions from '../ConfirmationOptions/component';
import { ChatToast } from '../Chat/contexts';

export default function PersonaConfigs(props: {
  persona?: Persona;
  onUpdatePersona?: ((persona: Persona) => void) | ((persona: Persona) => Promise<void>);
  onConfirmationResultComplete?: (() => void) | (() => Promise<void>);
}) {
  const [persona, setPersona] = useState(props.persona);
  const nameRef = useRef<EditMenuTextOptionImperativeHandle>(null);
  const backgroundRef = useRef<EditMenuTextOptionImperativeHandle>(null);

  const chatToast = useContext(ChatToast);

  const updatePersona = useCallback(
    (confirmationResult: boolean) => {
      if (confirmationResult) {
        const updatedPersona = new Persona(nameRef.current?.value, backgroundRef.current?.value);
        setPersona(updatedPersona);
        props.onUpdatePersona && props.onUpdatePersona(updatedPersona);
        chatToast?.current?.toast('Saved persona!');
      } else {
        nameRef.current?.setValue(persona?.name ?? '');
        backgroundRef.current?.setValue(persona?.background ?? '');
      }
      props.onConfirmationResultComplete && props.onConfirmationResultComplete();
    },
    [
      persona,
      nameRef.current,
      backgroundRef.current,
      props.onUpdatePersona,
      props.onConfirmationResultComplete
    ]
  );

  return (
    <>
      <EditMenu className='flex flex-col items-center justify-center gap-y-2 w-full'>
        <EditMenuTextOption
          ref={nameRef}
          label='Name'
          description='Your name'
          rows={1}
          value={persona?.name}
        />
        <EditMenuTextOption
          ref={backgroundRef}
          label='Background'
          description='Your background'
          rows={5}
          value={persona?.background}
        />
      </EditMenu>
      <ConfirmationOptions onResult={updatePersona} />
    </>
  );
}
