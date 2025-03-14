import { ReactNode } from 'react';
import { TailwindProps } from '@/app/types';

export default function EditMenu(
  props: {
    children: ReactNode;
  } & TailwindProps
) {
  return <form className={props.className}>{props.children}</form>;
}
