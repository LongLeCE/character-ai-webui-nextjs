import SVG from '@/app/components/SVG/component';
import { ComponentPropsWithRef } from 'react';

export default function SendIcon(props: ComponentPropsWithRef<'svg'>) {
  return (
    <SVG {...props} viewBox={props.viewBox ?? '0 0 28 28'}>
      <path d='M3.79 2.772 24.86 12.85a1.25 1.25 0 0 1 0 2.255L3.79 25.183a1.25 1.25 0 0 1-1.746-1.457l2.108-7.728a.5.5 0 0 1 .415-.364l10.21-1.387a.25.25 0 0 0 .195-.149l.018-.063a.25.25 0 0 0-.157-.268l-.055-.014-10.2-1.387a.5.5 0 0 1-.414-.364l-2.12-7.773A1.25 1.25 0 0 1 3.79 2.772Z' />
    </SVG>
  );
}
