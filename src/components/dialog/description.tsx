import React, {
  createContext,
  // Types
  ElementType,
  ReactNode,
  Ref,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  useEvent,
  useId,
  useIsoMorphicEffect,
  useSyncRefs,
} from './utils/hooks';
import { forwardRefWithAs, render } from './utils/render';
import { Props } from './utils/types';

interface SharedData {
  slot?: any;
  name?: string;
  props?: any;
}

interface DescriptionProviderProps extends SharedData {
  children: ReactNode;
}

const DescriptionContext = createContext<
  ({ register(value: string): () => void } & SharedData) | null
>(null);

function useDescriptionContext() {
  const context = useContext(DescriptionContext);
  if (context === null) {
    const err = new Error(
      'You used a <Description /> component, but it is not inside a relevant parent.'
    );
    if (Error.captureStackTrace)
      Error.captureStackTrace(err, useDescriptionContext);
    throw err;
  }
  return context;
}

export function useDescriptions(): [
  string | undefined,
  (props: DescriptionProviderProps) => JSX.Element
] {
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);

  return [
    // The actual id's as string or undefined
    descriptionIds.length > 0 ? descriptionIds.join(' ') : undefined,

    // The provider component
    useMemo(() => {
      return function DescriptionProvider(props: DescriptionProviderProps) {
        const register = useEvent((value: string) => {
          setDescriptionIds((existing) => [...existing, value]);

          return () =>
            setDescriptionIds((existing) => {
              const clone = existing.slice();
              const idx = clone.indexOf(value);
              if (idx !== -1) clone.splice(idx, 1);
              return clone;
            });
        });

        const contextBag = useMemo(
          () => ({
            register,
            slot: props.slot,
            name: props.name,
            props: props.props,
          }),
          [register, props.slot, props.name, props.props]
        );

        return (
          <DescriptionContext.Provider value={contextBag}>
            {props.children}
          </DescriptionContext.Provider>
        );
      };
    }, [setDescriptionIds]),
  ];
}

const DEFAULT_DESCRIPTION_TAG = 'p' as const;

export const Description = forwardRefWithAs(function Description<
  TTag extends ElementType = typeof DEFAULT_DESCRIPTION_TAG
>(props: Props<TTag, any, 'id'>, ref: Ref<HTMLParagraphElement>) {
  const context = useDescriptionContext();
  const id = `description-${useId()}`;
  const descriptionRef = useSyncRefs(ref);

  useIsoMorphicEffect(() => context.register(id), [id, context.register]);

  const theirProps = props;
  const ourProps = { ref: descriptionRef, ...context.props, id };

  return render({
    ourProps,
    theirProps,
    slot: context.slot || {},
    defaultTag: DEFAULT_DESCRIPTION_TAG,
    name: context.name || 'Description',
  });
});
