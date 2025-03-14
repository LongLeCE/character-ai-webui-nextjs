import { TailwindProps } from '@/app/types';

export default function ConfirmationOptions(
  props: {
    onResult: ((result: boolean) => Promise<void>) | ((result: boolean) => void);
  } & TailwindProps
) {
  return (
    <div className={`flex items-center gap-x-2 ${props.className ?? ''}`}>
      <button
        onClick={() => props.onResult(true)}
        className='bg-white text-black px-2 py-1 rounded-2xl'
      >
        Confirm
      </button>
      <button onClick={() => props.onResult(false)}>cancel</button>
    </div>
  );
}
