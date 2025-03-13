import { TailwindProps } from '@/app/types';

export default function BlinkingDots(
  props?: {
    ref?: React.RefObject<HTMLElement>;
  } & TailwindProps
) {
  return (
    <span ref={props?.ref} className={props?.className}>
      <span
        className='animate-pulse'
        style={{
          animation: '1s pulse infinite'
        }}
      >
        .
      </span>
      <span
        className='animate-pulse'
        style={{
          animation: '1s pulse infinite 250ms'
        }}
      >
        .
      </span>
      <span
        className='animate-pulse'
        style={{
          animation: '1s pulse infinite 500ms'
        }}
      >
        .
      </span>
    </span>
  );
}
