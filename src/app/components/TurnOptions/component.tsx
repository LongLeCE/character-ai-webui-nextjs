import { useCallback, useContext } from 'react';
import { ChatActions, ChatState, ChatToast } from '../Chat/contexts';
import { TurnContext } from '../TurnRenderer/contexts';
import { DropdownActions } from '../Dropdown/contexts';
import OptionButton from '../OptionButton/component';

export default function TurnOptions() {
  const turnContext = useContext(TurnContext);
  const chatActions = useContext(ChatActions);
  const chatToast = useContext(ChatToast);
  const chatState = useContext(ChatState);
  const dropdownActions = useContext(DropdownActions);

  const addMemoryAction = useCallback(() => {
    if (chatActions && turnContext) {
      const addedMemory = chatActions.addMemory(turnContext.id);
      if (addedMemory !== undefined) {
        dropdownActions?.setRenderDropdownContent(false);
        chatToast?.current?.toast('Memory added!');
      }
    }
  }, [turnContext?.id, chatActions?.addMemory, chatToast?.current?.toast]);

  const deleteMemoryAction = useCallback(() => {
    if (chatActions && turnContext) {
      const deletedTurn = chatActions.deleteMemory(turnContext.id);
      if (deletedTurn !== undefined) {
        dropdownActions?.setRenderDropdownContent(false);
        chatToast?.current?.toast('Memory deleted!');
      }
    }
  }, [turnContext?.id, chatActions?.deleteMemory, chatToast?.current?.toast]);

  const deleteTurnAction = useCallback(() => {
    if (chatActions && turnContext) {
      const deletedTurn = chatActions.deleteTurn(turnContext.id);
      if (deletedTurn !== undefined) {
        chatToast?.current?.toast('Message deleted!');
      }
    }
  }, [turnContext?.id, chatActions?.deleteTurn, chatToast?.current?.toast]);

  const rewindAction = useCallback(() => {
    if (chatActions && turnContext) {
      const lastTurn = chatActions.rewind(turnContext.id);
      if (lastTurn !== undefined) {
        dropdownActions?.setRenderDropdownContent(false);
        chatToast?.current?.toast('Rewinded!');
      }
    }
  }, [turnContext?.id, chatActions?.rewind, chatToast?.current?.toast]);

  const copyAction = useCallback(() => {
    if (chatActions && turnContext) {
      const content = chatActions.getContent(turnContext.id);
      if (content !== undefined) {
        navigator.clipboard.writeText(content as string);
        dropdownActions?.setRenderDropdownContent(false);
        chatToast?.current?.toast('Message copied to clipboard!');
      }
    }
  }, [turnContext?.id, chatActions?.getContent, chatToast?.current?.toast]);

  const copyHistoryUntilAction = useCallback(() => {
    if (chatActions && turnContext) {
      const history = chatActions.getHistoryUntil(turnContext.id);
      if (history !== undefined) {
        navigator.clipboard.writeText(JSON.stringify(history));
        dropdownActions?.setRenderDropdownContent(false);
        chatToast?.current?.toast('History copied to clipboard!');
      }
    }
  }, [turnContext?.id, chatActions?.getHistoryUntil, chatToast?.current?.toast]);

  return (
    <div className='flex flex-col items-center justify-center gap-y-2 size-max'>
      {chatState?.generating || turnContext?.role == 'system' ? (
        <></>
      ) : (
        <OptionButton onClick={turnContext?.isInMemory ? deleteMemoryAction : addMemoryAction}>
          {turnContext?.isInMemory ? 'Forget this' : 'Remember this'}
        </OptionButton>
      )}
      {chatState?.generating && !turnContext?.isLast ? (
        <></>
      ) : (
        <OptionButton onClick={deleteTurnAction}>Delete</OptionButton>
      )}
      {turnContext?.isLast ? (
        <></>
      ) : (
        <OptionButton onClick={rewindAction}>Rewind to here</OptionButton>
      )}
      {chatState?.generating && turnContext?.isLast ? (
        <></>
      ) : (
        <OptionButton onClick={copyAction}>Copy</OptionButton>
      )}
      {chatState?.generating && turnContext?.isLast ? (
        <></>
      ) : (
        <OptionButton onClick={copyHistoryUntilAction}>Copy history until this point</OptionButton>
      )}
    </div>
  );
}
