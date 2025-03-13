import TripleDotsIcon from '@/app/assets/icons/TripleDotsIcon';
import TurnOptions from '../TurnOptions/component';
import { TurnContext } from './contexts';
import { TurnRendererProps } from './types';
import Dropdown from '../Dropdown/component';

export default function TurnRenderer(props: TurnRendererProps) {
  return (
    <div
      className={`flex flex-col gap-1 w-full group ${props.role === 'user' ? 'ml-auto' : 'mr-auto'} ${props.role ? 'my-2' : '-mt-1 mb-2'} ${props.isFirst ? 'mt-0' : props.isLast ? 'mb-0' : ''}`}
    >
      <div
        onClick={props.onClick}
        className={`${props.role === 'user' ? 'ml-auto mr-2.5' : 'ml-2.5 mr-auto'} ${props.cursorPointer ? 'hover:cursor-pointer' : ''}`}
      >
        {props.name ?? props.role}
      </div>
      <div className={`flex gap-x-2 ${props.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {!props.hideOptions && props.role === 'user' ? (
          <div className='has-hover:hidden has-hover:group-hover:block'>
            <Dropdown
              dropdownLabel={
                <div className='flex items-center justify-center h-10 aspect-square rounded-[50%] active:bg-[#202024]'>
                  <TripleDotsIcon className='fill-[#d1d5db] h-3' />
                </div>
              }
              dropdownPosition='left'
            >
              <TurnContext.Provider value={props}>
                <TurnOptions />
              </TurnContext.Provider>
            </Dropdown>
          </div>
        ) : (
          <></>
        )}
        <div
          onClick={props.onClick}
          className={`max-w-[85%] bg-[#26272b] rounded-2xl py-3 px-[1.125rem] whitespace-pre-wrap break-words ${props.cursorPointer ? 'hover:cursor-pointer' : ''}`}
        >
          {props.content}
        </div>
        {!props.hideOptions && props.role !== 'user' ? (
          <div className='has-hover:hidden has-hover:group-hover:block'>
            <Dropdown
              dropdownLabel={
                <div className='flex items-center justify-center h-10 aspect-square rounded-[50%] active:bg-[#202024]'>
                  <TripleDotsIcon className='fill-[#d1d5db] h-3' />
                </div>
              }
            >
              <TurnContext.Provider value={props}>
                <TurnOptions />
              </TurnContext.Provider>
            </Dropdown>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
