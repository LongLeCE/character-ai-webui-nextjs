import { Fragment } from 'react';
import { RenderTurn } from '../Chat/types';
import MemoryRenderer from '../MemoryRenderer/component';

export default function Memories(props: { turns: RenderTurn[] }) {
  const lastIdx = props.turns.length - 1;

  return props.turns.map((turn, i) => (
    <Fragment key={turn.id}>
      <MemoryRenderer
        id={turn.id}
        isFirst={i == 0}
        isLast={i == lastIdx}
        role={turn.role}
        content={turn.renderedContent}
        name={turn.name}
        hideOptions={true}
        cursorPointer={true}
      />
    </Fragment>
  ));
}
