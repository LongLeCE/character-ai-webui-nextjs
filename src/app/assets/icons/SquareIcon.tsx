import SVG from '@/app/components/SVG/component';
import { ComponentPropsWithRef } from 'react';

export default function SendIcon(props: ComponentPropsWithRef<'svg'>) {
  return (
    <SVG {...props} viewBox={props.viewBox ?? '0 0 512 512'}>
      <path d='M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z' />
    </SVG>
  );
}
