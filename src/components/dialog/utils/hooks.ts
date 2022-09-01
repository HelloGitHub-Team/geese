import React, { MutableRefObject, useMemo, useState } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';

import {
  disposables,
  FocusableMode,
  isFocusableElement,
  isServer,
  match,
  Reason,
  transition,
} from '.';

export const useIsoMorphicEffect = isServer ? useEffect : useLayoutEffect;

export function useLatestValue<T>(value: T) {
  const cache = useRef(value);

  useIsoMorphicEffect(() => {
    cache.current = value;
  }, [value]);

  return cache;
}

export const useEvent =
  // TODO: Add React.useEvent ?? once the useEvent hook is available
  function useEvent<
    F extends (...args: any[]) => any,
    P extends any[] = Parameters<F>,
    R = ReturnType<F>
  >(cb: (...args: P) => R) {
    const cache = useLatestValue(cb);
    return React.useCallback((...args: P) => cache.current(...args), [cache]);
  };

const state = { serverHandoffComplete: false };

export function useServerHandoffComplete() {
  const [serverHandoffComplete, setServerHandoffComplete] = useState(
    state.serverHandoffComplete
  );

  useEffect(() => {
    if (serverHandoffComplete === true) return;

    setServerHandoffComplete(true);
  }, [serverHandoffComplete]);

  useEffect(() => {
    if (state.serverHandoffComplete === false)
      state.serverHandoffComplete = true;
  }, []);

  return serverHandoffComplete;
}

let id = 0;
function generateId() {
  return ++id;
}

export const useId =
  // Prefer React's `useId` if it's available.
  React.useId ??
  function useId() {
    const ready = useServerHandoffComplete();
    const [id, setId] = React.useState(ready ? generateId : null);

    useIsoMorphicEffect(() => {
      if (id === null) setId(generateId());
    }, [id]);

    return id != null ? '' + id : undefined;
  };

const Optional = Symbol();

export function optionalRef<T>(cb: (ref: T) => void, isOptional = true) {
  return Object.assign(cb, { [Optional]: isOptional });
}

export function useSyncRefs<TType>(
  ...refs: (
    | React.MutableRefObject<TType | null>
    | ((instance: TType) => void)
    | null
  )[]
) {
  const cache = useRef(refs);

  useEffect(() => {
    cache.current = refs;
  }, [refs]);

  const syncRefs = useEvent((value: TType) => {
    for (const ref of cache.current) {
      if (ref == null) continue;
      if (typeof ref === 'function') ref(value);
      else ref.current = value;
    }
  });

  return refs.every(
    (ref) =>
      ref == null ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref?.[Optional]
  )
    ? undefined
    : syncRefs;
}

export function useIsMounted() {
  const mounted = useRef(false);

  useIsoMorphicEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}

export function useWindowEvent<TType extends keyof WindowEventMap>(
  type: TType,
  listener: (ev: WindowEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const listenerRef = useLatestValue(listener);

  useEffect(() => {
    function handler(event: WindowEventMap[TType]) {
      listenerRef.current(event);
    }

    window.addEventListener(type, handler, options);
    return () => window.removeEventListener(type, handler, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, options]);
}

export enum Direction {
  Forwards,
  Backwards,
}

export function useTabDirection() {
  const direction = useRef(Direction.Forwards);

  useWindowEvent(
    'keydown',
    (event: any) => {
      if (event.key === 'Tab') {
        direction.current = event.shiftKey
          ? Direction.Backwards
          : Direction.Forwards;
      }
    },
    true
  );

  return direction;
}

export function useEventListener<TType extends keyof WindowEventMap>(
  element: HTMLElement | Document | Window | EventTarget | null | undefined,
  type: TType,
  listener: (event: WindowEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const listenerRef = useLatestValue(listener);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    element = element ?? window;

    function handler(event: WindowEventMap[TType]) {
      listenerRef.current(event);
    }

    element.addEventListener(type, handler as any, options);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return () => element!.removeEventListener(type, handler as any, options);
  }, [element, type, options]);
}

export function useWatch<T>(
  cb: (values: T[]) => void | (() => void),
  dependencies: T[]
) {
  const track = useRef<typeof dependencies>([]);
  const action = useEvent(cb);

  useEffect(() => {
    for (const [idx, value] of Object.entries(dependencies)) {
      if (track.current[Number(idx)] !== value) {
        // At least 1 item changed
        const returnValue = action(dependencies);
        track.current = dependencies;
        return returnValue;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, ...dependencies]);
}

export function getOwnerDocument<
  T extends Element | MutableRefObject<Element | null>
>(element: T | null | undefined) {
  if (isServer) return null;
  if (element instanceof Node) return element.ownerDocument;
  // eslint-disable-next-line no-prototype-builtins
  if (element?.hasOwnProperty('current')) {
    if (element.current instanceof Node) return element.current.ownerDocument;
  }

  return document;
}

export function useOwnerDocument(...args: Parameters<typeof getOwnerDocument>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getOwnerDocument(...args), [...args]);
}

const interactables = new Set<HTMLElement>();
const originals = new Map<
  HTMLElement,
  { 'aria-hidden': string | null; inert: boolean }
>();

function inert(element: HTMLElement) {
  element.setAttribute('aria-hidden', 'true');
  // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
  element.inert = true;
}

function restore(element: HTMLElement) {
  const original = originals.get(element);
  if (!original) return;

  if (original['aria-hidden'] === null) element.removeAttribute('aria-hidden');
  else element.setAttribute('aria-hidden', original['aria-hidden']);
  // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
  element.inert = original.inert;
}

export function useInertOthers<TElement extends HTMLElement>(
  container: MutableRefObject<TElement | null>,
  enabled = true
) {
  useIsoMorphicEffect(() => {
    if (!enabled) return;
    if (!container.current) return;

    const element = container.current;
    const ownerDocument = getOwnerDocument(element);
    if (!ownerDocument) return;

    // Mark myself as an interactable element
    interactables.add(element);

    // Restore elements that now contain an interactable child
    for (const original of Object.values(originals)) {
      if (original.contains(element)) {
        restore(original);
        originals.delete(original);
      }
    }

    // Collect direct children of the body
    ownerDocument.querySelectorAll('body > *').forEach((child) => {
      if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements

      // Skip the interactables, and the parents of the interactables
      for (const interactable of Object.values(interactables)) {
        if (child.contains(interactable)) return;
      }

      // Keep track of the elements
      if (interactables.size === 1) {
        originals.set(child, {
          'aria-hidden': child.getAttribute('aria-hidden'),
          // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
          inert: child.inert,
        });

        // Mutate the element
        inert(child);
      }
    });

    return () => {
      // Inert is disabled on the current element
      interactables.delete(element);

      // We still have interactable elements, therefore this one and its parent
      // will become inert as well.
      if (interactables.size > 0) {
        // Collect direct children of the body
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ownerDocument!.querySelectorAll('body > *').forEach((child) => {
          if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements

          // Skip already inert parents
          if (originals.has(child)) return;

          // Skip the interactables, and the parents of the interactables
          for (const interactable of Object.values(interactables)) {
            if (child.contains(interactable)) return;
          }

          originals.set(child, {
            'aria-hidden': child.getAttribute('aria-hidden'),
            // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
            inert: child.inert,
          });

          // Mutate the element
          inert(child);
        });
      } else {
        for (const element of Object.values(originals)) {
          // Restore
          restore(element);

          // Cleanup
          originals.delete(element);
        }
      }
    };
  }, [enabled]);
}

type Container = MutableRefObject<HTMLElement | null> | HTMLElement | null;
type ContainerCollection = Container[] | Set<Container>;
type ContainerInput = Container | ContainerCollection;

export function useOutsideClick(
  containers: ContainerInput | (() => ContainerInput),
  cb: (
    event: MouseEvent | PointerEvent | FocusEvent,
    target: HTMLElement
  ) => void,
  enabled = true
) {
  // TODO: remove this once the React bug has been fixed: https://github.com/facebook/react/issues/24657
  const enabledRef = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    process.env.NODE_ENV === 'test'
      ? () => {
          enabledRef.current = enabled;
        }
      : () => {
          requestAnimationFrame(() => {
            enabledRef.current = enabled;
          });
        },
    [enabled]
  );

  function handleOutsideClick<E extends MouseEvent | PointerEvent | FocusEvent>(
    event: E,
    resolveTarget: (event: E) => HTMLElement | null
  ) {
    if (!enabledRef.current) return;

    // Check whether the event got prevented already. This can happen if you use the
    // useOutsideClick hook in both a Dialog and a Menu and the inner Menu "cancels" the default
    // behaviour so that only the Menu closes and not the Dialog (yet)
    if (event.defaultPrevented) return;

    const _containers = (function resolve(containers): ContainerCollection {
      if (typeof containers === 'function') {
        return resolve(containers());
      }

      if (Array.isArray(containers)) {
        return containers;
      }

      if (containers instanceof Set) {
        return containers;
      }

      return [containers];
    })(containers);

    const target = resolveTarget(event);

    if (target === null) {
      return;
    }

    // Ignore if the target doesn't exist in the DOM anymore
    if (!target.ownerDocument.documentElement.contains(target)) return;

    // Ignore if the target exists in one of the containers
    for (const container of Object.values(_containers)) {
      if (container === null) continue;
      const domNode =
        container instanceof HTMLElement ? container : container.current;
      if (domNode?.contains(target)) {
        return;
      }
    }

    // This allows us to check whether the event was defaultPrevented when you are nesting this
    // inside a `<Dialog />` for example.
    if (
      // This check alllows us to know whether or not we clicked on a "focusable" element like a
      // button or an input. This is a backwards compatibility check so that you can open a <Menu
      // /> and click on another <Menu /> which should close Menu A and open Menu B. We might
      // revisit that so that you will require 2 clicks instead.
      !isFocusableElement(target, FocusableMode.Loose) &&
      // This could be improved, but the `Combobox.Button` adds tabIndex={-1} to make it
      // unfocusable via the keyboard so that tabbing to the next item from the input doesn't
      // first go to the button.
      target.tabIndex !== -1
    ) {
      event.preventDefault();
    }

    return cb(event, target);
  }

  const initialClickTarget = useRef<EventTarget | null>(null);

  useWindowEvent(
    'mousedown',
    (event) => {
      if (enabledRef.current) {
        initialClickTarget.current = event.target;
      }
    },
    true
  );

  useWindowEvent(
    'click',
    (event) => {
      if (!initialClickTarget.current) {
        return;
      }

      handleOutsideClick(event, () => {
        return initialClickTarget.current as HTMLElement;
      });

      initialClickTarget.current = null;
    },

    // We will use the `capture` phase so that layers in between with `event.stopPropagation()`
    // don't "cancel" this outside click check. E.g.: A `Menu` inside a `DialogPanel` if the `Menu`
    // is open, and you click outside of it in the `DialogPanel` the `Menu` should close. However,
    // the `DialogPanel` has a `onClick(e) { e.stopPropagation() }` which would cancel this.
    true
  );

  // When content inside an iframe is clicked `window` will receive a blur event
  // This can happen when an iframe _inside_ a window is clicked
  // Or, if headless UI is *in* the iframe, when a content in a window containing that iframe is clicked

  // In this case we care only about the first case so we check to see if the active element is the iframe
  // If so this was because of a click, focus, or other interaction with the child iframe
  // and we can consider it an "outside click"
  useWindowEvent(
    'blur',
    (event) =>
      handleOutsideClick(event, () =>
        window.document.activeElement instanceof HTMLIFrameElement
          ? window.document.activeElement
          : null
      ),
    true
  );
}

interface TransitionArgs {
  container: MutableRefObject<HTMLElement | null>;
  classes: MutableRefObject<{
    enter: string[];
    enterFrom: string[];
    enterTo: string[];

    leave: string[];
    leaveFrom: string[];
    leaveTo: string[];

    entered: string[];
  }>;
  events: MutableRefObject<{
    beforeEnter: () => void;
    afterEnter: () => void;
    beforeLeave: () => void;
    afterLeave: () => void;
  }>;
  direction: 'enter' | 'leave' | 'idle';
  onStart: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
  onStop: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
}

export function useDisposables() {
  // Using useState instead of useRef so that we can use the initializer function.
  const [d] = useState(disposables);
  useEffect(() => () => d.dispose(), [d]);
  return d;
}

export function useTransition({
  container,
  direction,
  classes,
  events,
  onStart,
  onStop,
}: TransitionArgs) {
  const mounted = useIsMounted();
  const d = useDisposables();

  const latestDirection = useLatestValue(direction);

  const beforeEvent = useEvent(() => {
    return match(latestDirection.current, {
      enter: () => events.current.beforeEnter(),
      leave: () => events.current.beforeLeave(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      idle: () => {},
    });
  });

  const afterEvent = useEvent(() => {
    return match(latestDirection.current, {
      enter: () => events.current.afterEnter(),
      leave: () => events.current.afterLeave(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      idle: () => {},
    });
  });

  useIsoMorphicEffect(() => {
    const dd = disposables();
    d.add(dd.dispose);

    const node = container.current;
    if (!node) return; // We don't have a DOM node (yet)
    if (latestDirection.current === 'idle') return; // We don't need to transition
    if (!mounted.current) return;

    dd.dispose();

    beforeEvent();

    onStart.current(latestDirection.current);

    dd.add(
      transition(
        node,
        classes.current,
        latestDirection.current === 'enter',
        (reason) => {
          dd.dispose();

          match(reason, {
            [Reason.Ended]() {
              afterEvent();
              onStop.current(latestDirection.current);
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            [Reason.Cancelled]: () => {},
          });
        }
      )
    );

    return dd.dispose;
  }, [direction]);
}
