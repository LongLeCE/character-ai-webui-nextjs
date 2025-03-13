import { ComponentPropsWithRef } from 'react';

export default function OptionButton(props: ComponentPropsWithRef<'button'>) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center size-full py-3 px-[1.125rem] bg-gray-500 hover:bg-[#202024] hover:opacity-90 ${props.className ?? ''}`}
    ></button>
  );
}
