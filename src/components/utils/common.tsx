import {
  createContext,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';

import { useEvent, useIsoMorphicEffect } from '@/components/utils/hooks';

const Context = createContext<State | null>(null);
Context.displayName = 'OpenClosedContext';

export enum State {
  Open,
  Closed,
}

export function useOpenClosed() {
  return useContext(Context);
}

interface Props {
  value: State;
  children: ReactNode;
}

export function OpenClosedProvider({ value, children }: Props): ReactElement {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

type OnUpdate = (
  message: StackMessage,
  type: string,
  element: MutableRefObject<HTMLElement | null>
) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const StackContext = createContext<OnUpdate>(() => {});
StackContext.displayName = 'StackContext';

export enum StackMessage {
  Add,
  Remove,
}

export function useStackContext() {
  return useContext(StackContext);
}

export function StackProvider({
  children,
  onUpdate,
  type,
  element,
  enabled,
}: {
  children: ReactNode;
  onUpdate?: OnUpdate;
  type: string;
  element: MutableRefObject<HTMLElement | null>;
  enabled?: boolean;
}) {
  const parentUpdate = useStackContext();

  const notify = useEvent((...args: Parameters<OnUpdate>) => {
    // Notify our layer
    onUpdate?.(...args);

    // Notify the parent
    parentUpdate(...args);
  });

  useIsoMorphicEffect(() => {
    const shouldNotify = enabled === undefined || enabled === true;

    shouldNotify && notify(StackMessage.Add, type, element);

    return () => {
      shouldNotify && notify(StackMessage.Remove, type, element);
    };
  }, [notify, type, element, enabled]);

  return (
    <StackContext.Provider value={notify}>{children}</StackContext.Provider>
  );
}
