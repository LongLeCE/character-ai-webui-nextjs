import { Fragment, useContext } from 'react';
import TurnRenderer from '../TurnRenderer/component';
import { RenderTurn } from '../Chat/types';
import { ChatMemoryIds } from '../Chat/contexts';

export default function Conversation(props: { turns: RenderTurn[] }) {
  const chatMemoryIds = useContext(ChatMemoryIds);

  const lastIdx = props.turns.length - 1;

  return props.turns.map((turn, i) => (
    <Fragment key={turn.id}>
      <TurnRenderer
        id={turn.id}
        isFirst={i == 0}
        isLast={i == lastIdx}
        isInMemory={chatMemoryIds.has(turn.id)}
        role={turn.role}
        content={turn.renderedContent}
        name={turn.name}
        fixed={turn.fixed}
      />
    </Fragment>
  ));
}
