import { ComponentPropsWithRef } from 'react';

export default function SVG(props: ComponentPropsWithRef<'svg'>) {
  return (
    <svg
      {...props}
      className={`max-w-full max-h-full ${props.className ?? ''}`}
      xmlns={props.xmlns ?? 'http://www.w3.org/2000/svg'}
    />
  );
}
