import { createContext, Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import { Message } from '../TurnRenderer/types';
import { ToastContainerImperativeHandle } from '../ToastContainer/types';

export const ChatWindow = createContext<RefObject<HTMLDivElement> | null>(null);
export const ChatActions = createContext<{
  addMemory: (id: string) => string | undefined;
  deleteMemory: (id: string) => string | undefined;
  deleteTurn: (id: string) => string | undefined;
  rewind: (id: string) => string | undefined;
  getContent: (id: string) => ReactNode;
  getHistoryUntil: (id: string) => Message[] | undefined;
  getHistory: () => Message[] | undefined;
  setHistory: (messages: Message[]) => void;
  setError: (message: string | null) => void;
} | null>(null);
export const ChatToast = createContext<RefObject<ToastContainerImperativeHandle> | null>(null);
export const ChatMemoryIds = createContext(new Set<string>());
export const ChatState = createContext<{
  generating: boolean;
  setResponseGenerated: Dispatch<SetStateAction<boolean>>;
  hasError: () => boolean;
} | null>(null);
export const ChatStreamingResponse = createContext<{
  controller: AbortController | null;
  setController: Dispatch<SetStateAction<AbortController | null>>;
  responseStream: string | null;
  setResponseStream: Dispatch<SetStateAction<string | null>>;
} | null>(null);
