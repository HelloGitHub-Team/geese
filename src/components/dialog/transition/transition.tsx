import React, {
  createContext,
  // Types
  ElementType,
  Fragment,
  MutableRefObject,
  Ref,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { match, microTask } from '../utils';
import { OpenClosedProvider, State, useOpenClosed } from '../utils/common';
import {
  useEvent,
  useId,
  useIsMounted,
  useIsoMorphicEffect,
  useLatestValue,
  useServerHandoffComplete,
  useSyncRefs,
  useTransition,
} from '../utils/hooks';
import {
  Features,
  forwardRefWithAs,
  PropsForFeatures,
  render,
  RenderStrategy,
} from '../utils/render';
import { Props } from '../utils/types';

type ID = ReturnType<typeof useId>;

function splitClasses(classes = '') {
  return classes.split(' ').filter((className) => className.trim().length > 1);
}

interface TransitionContextValues {
  show: boolean;
  appear: boolean;
  initial: boolean;
}
const TransitionContext = createContext<TransitionContextValues | null>(null);
TransitionContext.displayName = 'TransitionContext';

enum TreeStates {
  Visible = 'visible',
  Hidden = 'hidden',
}

export interface TransitionClasses {
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  entered?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

export interface TransitionEvents {
  beforeEnter?: () => void;
  afterEnter?: () => void;
  beforeLeave?: () => void;
  afterLeave?: () => void;
}

type TransitionChildProps<TTag> = Props<TTag, TransitionChildRenderPropArg> &
  PropsForFeatures<typeof TransitionChildRenderFeatures> &
  TransitionClasses &
  TransitionEvents & { appear?: boolean };

function useTransitionContext() {
  const context = useContext(TransitionContext);

  if (context === null) {
    throw new Error(
      'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.'
    );
  }

  return context;
}

function useParentNesting() {
  const context = useContext(NestingContext);

  if (context === null) {
    throw new Error(
      'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.'
    );
  }

  return context;
}

interface NestingContextValues {
  children: MutableRefObject<{ id: ID; state: TreeStates }[]>;
  register: (id: ID) => () => void;
  unregister: (id: ID, strategy?: RenderStrategy) => void;
}

const NestingContext = createContext<NestingContextValues | null>(null);
NestingContext.displayName = 'NestingContext';

function hasChildren(
  bag:
    | NestingContextValues['children']
    | { children: NestingContextValues['children'] }
): boolean {
  if ('children' in bag) return hasChildren(bag.children);
  return (
    bag.current.filter(({ state }) => state === TreeStates.Visible).length > 0
  );
}

function useNesting(done?: () => void) {
  const doneRef = useLatestValue(done);
  const transitionableChildren = useRef<
    NestingContextValues['children']['current']
  >([]);
  const mounted = useIsMounted();

  const unregister = useEvent(
    (childId: ID, strategy = RenderStrategy.Hidden) => {
      const idx = transitionableChildren.current.findIndex(
        ({ id }) => id === childId
      );
      if (idx === -1) return;

      match(strategy, {
        [RenderStrategy.Unmount]() {
          transitionableChildren.current.splice(idx, 1);
        },
        [RenderStrategy.Hidden]() {
          transitionableChildren.current[idx].state = TreeStates.Hidden;
        },
      });

      microTask(() => {
        if (!hasChildren(transitionableChildren) && mounted.current) {
          doneRef.current?.();
        }
      });
    }
  );

  const register = useEvent((childId: ID) => {
    const child = transitionableChildren.current.find(
      ({ id }) => id === childId
    );
    if (!child) {
      transitionableChildren.current.push({
        id: childId,
        state: TreeStates.Visible,
      });
    } else if (child.state !== TreeStates.Visible) {
      child.state = TreeStates.Visible;
    }

    return () => unregister(childId, RenderStrategy.Unmount);
  });

  return useMemo(
    () => ({
      children: transitionableChildren,
      register,
      unregister,
    }),
    [register, unregister, transitionableChildren]
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
const eventNames = [
  'beforeEnter',
  'afterEnter',
  'beforeLeave',
  'afterLeave',
] as const;
function ensureEventHooksExist(events: TransitionEvents) {
  const result = {} as Record<keyof typeof events, () => void>;
  for (const name of eventNames) {
    result[name] = events[name] ?? noop;
  }
  return result;
}

function useEvents(events: TransitionEvents) {
  const eventsRef = useRef(ensureEventHooksExist(events));

  useEffect(() => {
    eventsRef.current = ensureEventHooksExist(events);
  }, [events]);

  return eventsRef;
}

// ---

const DEFAULT_TRANSITION_CHILD_TAG = 'div' as const;
type TransitionChildRenderPropArg = MutableRefObject<HTMLDivElement>;
const TransitionChildRenderFeatures = Features.RenderStrategy;

const TransitionChild = forwardRefWithAs(function TransitionChild<
  TTag extends ElementType = typeof DEFAULT_TRANSITION_CHILD_TAG
>(props: TransitionChildProps<TTag>, ref: Ref<HTMLElement>) {
  const {
    // Event "handlers"
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,

    // Class names
    enter,
    enterFrom,
    enterTo,
    entered,
    leave,
    leaveFrom,
    leaveTo,
    ...rest
  } = props as typeof props;
  const container = useRef<HTMLElement | null>(null);
  const transitionRef = useSyncRefs(container, ref);
  const strategy = rest.unmount
    ? RenderStrategy.Unmount
    : RenderStrategy.Hidden;

  const { show, appear, initial } = useTransitionContext();

  const [state, setState] = useState(
    show ? TreeStates.Visible : TreeStates.Hidden
  );

  const { register, unregister } = useParentNesting();
  const prevShow = useRef<boolean | null>(null);

  const id = useId();

  useEffect(() => {
    if (!id) return;
    return register(id);
  }, [register, id]);

  useEffect(() => {
    // If we are in another mode than the Hidden mode then ignore
    if (strategy !== RenderStrategy.Hidden) return;
    if (!id) return;
    // Make sure that we are visible
    if (show && state !== TreeStates.Visible) {
      setState(TreeStates.Visible);
      return;
    }

    match(state, {
      [TreeStates.Hidden]: () => unregister(id),
      [TreeStates.Visible]: () => register(id),
    });
  }, [state, id, register, unregister, show, strategy]);

  const classes = useLatestValue({
    enter: splitClasses(enter),
    enterFrom: splitClasses(enterFrom),
    enterTo: splitClasses(enterTo),
    entered: splitClasses(entered),
    leave: splitClasses(leave),
    leaveFrom: splitClasses(leaveFrom),
    leaveTo: splitClasses(leaveTo),
  });
  const events = useEvents({
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
  });

  const ready = useServerHandoffComplete();

  useEffect(() => {
    if (ready && state === TreeStates.Visible && container.current === null) {
      throw new Error(
        'Did you forget to passthrough the `ref` to the actual DOM node?'
      );
    }
  }, [container, state, ready]);

  // Skipping initial transition
  const skip = initial && !appear;

  const transitionDirection = (() => {
    if (!ready) return 'idle';
    if (skip) return 'idle';
    if (prevShow.current === show) return 'idle';
    return show ? 'enter' : 'leave';
  })() as 'enter' | 'leave' | 'idle';

  const transitioning = useRef(false);

  const nesting = useNesting(() => {
    if (transitioning.current) return;

    // When all children have been unmounted we can only hide ourselves if and only if we are not
    // transitioning ourselves. Otherwise we would unmount before the transitions are finished.
    setState(TreeStates.Hidden);
    unregister(id);
  });

  useTransition({
    container,
    classes,
    events,
    direction: transitionDirection,
    onStart: useLatestValue(() => {
      transitioning.current = true;
    }),
    onStop: useLatestValue((direction) => {
      transitioning.current = false;

      if (direction === 'leave' && !hasChildren(nesting)) {
        // When we don't have children anymore we can safely unregister from the parent and hide
        // ourselves.
        setState(TreeStates.Hidden);
        unregister(id);
      }
    }),
  });

  useEffect(() => {
    if (!skip) return;

    if (strategy === RenderStrategy.Hidden) {
      prevShow.current = null;
    } else {
      prevShow.current = show;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, skip, state]);

  const theirProps = rest;
  const ourProps = { ref: transitionRef };

  return (
    <NestingContext.Provider value={nesting}>
      <OpenClosedProvider
        value={match(state, {
          [TreeStates.Visible]: State.Open,
          [TreeStates.Hidden]: State.Closed,
        })}
      >
        {render({
          ourProps,
          theirProps,
          defaultTag: DEFAULT_TRANSITION_CHILD_TAG,
          features: TransitionChildRenderFeatures,
          visible: state === TreeStates.Visible,
          name: 'Transition.Child',
        })}
      </OpenClosedProvider>
    </NestingContext.Provider>
  );
});

const TransitionRoot = forwardRefWithAs(function Transition<
  TTag extends ElementType = typeof DEFAULT_TRANSITION_CHILD_TAG
>(
  props: TransitionChildProps<TTag> & { show?: boolean; appear?: boolean },
  ref: Ref<HTMLElement>
) {
  // eslint-disable-next-line prefer-const
  let { show, appear = false, unmount, ...theirProps } = props as typeof props;
  // let {  } = props as typeof props;
  const internalTransitionRef = useRef<HTMLElement | null>(null);
  const transitionRef = useSyncRefs(internalTransitionRef, ref);

  // The TransitionChild will also call this hook, and we have to make sure that we are ready.
  useServerHandoffComplete();

  const usesOpenClosedState = useOpenClosed();

  if (show === undefined && usesOpenClosedState !== null) {
    show = match(usesOpenClosedState, {
      [State.Open]: true,
      [State.Closed]: false,
    });
  }

  if (![true, false].includes(show as unknown as boolean)) {
    throw new Error(
      'A <Transition /> is used but it is missing a `show={true | false}` prop.'
    );
  }

  const [state, setState] = useState(
    show ? TreeStates.Visible : TreeStates.Hidden
  );

  const nestingBag = useNesting(() => {
    setState(TreeStates.Hidden);
  });

  const [initial, setInitial] = useState(true);

  // Change the `initial` value
  const changes = useRef([show]);
  useIsoMorphicEffect(() => {
    // We can skip this effect
    if (initial === false) {
      return;
    }

    // Track the changes
    if (changes.current[changes.current.length - 1] !== show) {
      changes.current.push(show);
      setInitial(false);
    }
  }, [changes, show]);

  const transitionBag = useMemo<TransitionContextValues>(
    () => ({ show: show as boolean, appear, initial }),
    [show, appear, initial]
  );

  useEffect(() => {
    if (show) {
      setState(TreeStates.Visible);
    } else if (!hasChildren(nestingBag)) {
      setState(TreeStates.Hidden);
    } else {
      const node = internalTransitionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();

      if (
        rect.x === 0 &&
        rect.y === 0 &&
        rect.width === 0 &&
        rect.height === 0
      ) {
        // The node is completely hidden, const's hide it
        setState(TreeStates.Hidden);
      }
    }
  }, [show, nestingBag]);

  const sharedProps = { unmount };

  return (
    <NestingContext.Provider value={nestingBag}>
      <TransitionContext.Provider value={transitionBag}>
        {render({
          ourProps: {
            ...sharedProps,
            as: Fragment,
            children: (
              <TransitionChild
                ref={transitionRef as any}
                {...sharedProps}
                {...theirProps}
              />
            ),
          },
          theirProps: {},
          defaultTag: Fragment,
          features: TransitionChildRenderFeatures,
          visible: state === TreeStates.Visible,
          name: 'Transition',
        })}
      </TransitionContext.Provider>
    </NestingContext.Provider>
  );
});

const Child = forwardRefWithAs(function Child<
  TTag extends ElementType = typeof DEFAULT_TRANSITION_CHILD_TAG
>(props: TransitionChildProps<TTag>, ref: MutableRefObject<HTMLElement>) {
  const hasTransitionContext = useContext(TransitionContext) !== null;
  const hasOpenClosedContext = useOpenClosed() !== null;

  return (
    <>
      {!hasTransitionContext && hasOpenClosedContext ? (
        <TransitionRoot ref={ref} {...props} />
      ) : (
        <TransitionChild ref={ref} {...props} />
      )}
    </>
  );
});

export const Transition = Object.assign(TransitionRoot, {
  Child,
  Root: TransitionRoot,
});
