import React, {
  // Types
  ElementType,
  MutableRefObject,
  Ref,
  useEffect,
  useRef,
} from 'react';

import {
  Features as HiddenFeatures,
  Focus,
  focusElement,
  focusIn,
  FocusResult,
  Hidden,
  match,
  microTask,
} from './utils';
import {
  Direction as TabDirection,
  useEvent,
  useEventListener,
  useIsMounted,
  useOwnerDocument,
  useServerHandoffComplete,
  useSyncRefs,
  useTabDirection,
  useWatch,
} from './utils/hooks';
import { forwardRefWithAs, render } from './utils/render';
import { Props } from './utils/types';

const DEFAULT_FOCUS_TRAP_TAG = 'div' as const;

enum Features {
  /** No features enabled for the focus trap. */
  None = 1 << 0,

  /** Ensure that we move focus initially into the container. */
  InitialFocus = 1 << 1,

  /** Ensure that pressing `Tab` and `Shift+Tab` is trapped within the container. */
  TabLock = 1 << 2,

  /** Ensure that programmatically moving focus outside of the container is disallowed. */
  FocusLock = 1 << 3,

  /** Ensure that we restore the focus when unmounting the focus trap. */
  RestoreFocus = 1 << 4,

  /** Enable all features. */
  All = InitialFocus | TabLock | FocusLock | RestoreFocus,
}

export const FocusTrap = Object.assign(
  forwardRefWithAs(function FocusTrap<
    TTag extends ElementType = typeof DEFAULT_FOCUS_TRAP_TAG
  >(
    props: Props<TTag> & {
      initialFocus?: MutableRefObject<HTMLElement | null>;
      features?: Features;
      containers?: MutableRefObject<Set<MutableRefObject<HTMLElement | null>>>;
    },
    ref: Ref<HTMLDivElement>
  ) {
    const container = useRef<HTMLDivElement | null>(null);
    const focusTrapRef = useSyncRefs(container, ref);
    const { initialFocus, containers, ...theirProps } = props;
    let { features = Features.All } = props;

    if (!useServerHandoffComplete()) {
      features = Features.None;
    }

    const ownerDocument = useOwnerDocument(container);

    useRestoreFocus(
      { ownerDocument },
      Boolean(features & Features.RestoreFocus)
    );
    const previousActiveElement = useInitialFocus(
      { ownerDocument, container, initialFocus },
      Boolean(features & Features.InitialFocus)
    );
    useFocusLock(
      { ownerDocument, container, containers, previousActiveElement },
      Boolean(features & Features.FocusLock)
    );

    const direction = useTabDirection();
    const handleFocus = useEvent(() => {
      const el = container.current as HTMLElement;
      if (!el) return;

      // TODO: Cleanup once we are using real browser tests
      if (process.env.NODE_ENV === 'test') {
        microTask(() => {
          match(direction.current, {
            [TabDirection.Forwards]: () => focusIn(el, Focus.First),
            [TabDirection.Backwards]: () => focusIn(el, Focus.Last),
          });
        });
      } else {
        match(direction.current, {
          [TabDirection.Forwards]: () => focusIn(el, Focus.First),
          [TabDirection.Backwards]: () => focusIn(el, Focus.Last),
        });
      }
    });

    const ourProps = { ref: focusTrapRef };

    return (
      <>
        {Boolean(features & Features.TabLock) && (
          <Hidden
            as='button'
            type='button'
            onFocus={handleFocus}
            features={HiddenFeatures.Focusable}
          />
        )}
        {render({
          ourProps,
          theirProps,
          defaultTag: DEFAULT_FOCUS_TRAP_TAG,
          name: 'FocusTrap',
        })}
        {Boolean(features & Features.TabLock) && (
          <Hidden
            as='button'
            type='button'
            onFocus={handleFocus}
            features={HiddenFeatures.Focusable}
          />
        )}
      </>
    );
  }),
  { features: Features }
);

function useRestoreFocus(
  { ownerDocument }: { ownerDocument: Document | null },
  enabled: boolean
) {
  const restoreElement = useRef<HTMLElement | null>(null);

  // Capture the currently focused element, before we try to move the focus inside the FocusTrap.
  useEventListener(
    ownerDocument?.defaultView,
    'focusout',
    (event) => {
      if (!enabled) return;
      if (restoreElement.current) return;

      restoreElement.current = event.target as HTMLElement;
    },
    true
  );

  // Restore the focus to the previous element when `enabled` becomes false again
  useWatch(() => {
    if (enabled) return;

    if (ownerDocument?.activeElement === ownerDocument?.body) {
      focusElement(restoreElement.current);
    }

    restoreElement.current = null;
  }, [enabled]);

  // Restore the focus to the previous element when the component is unmounted
  const trulyUnmounted = useRef(false);
  useEffect(() => {
    trulyUnmounted.current = false;

    return () => {
      trulyUnmounted.current = true;
      microTask(() => {
        if (!trulyUnmounted.current) return;

        focusElement(restoreElement.current);
        restoreElement.current = null;
      });
    };
  }, []);
}

function useInitialFocus(
  {
    ownerDocument,
    container,
    initialFocus,
  }: {
    ownerDocument: Document | null;
    container: MutableRefObject<HTMLElement | null>;
    initialFocus?: MutableRefObject<HTMLElement | null>;
  },
  enabled: boolean
) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle initial focus
  useWatch(() => {
    if (!enabled) return;
    const containerElement = container.current;
    if (!containerElement) return;

    const activeElement = ownerDocument?.activeElement as HTMLElement;

    if (initialFocus?.current) {
      if (initialFocus?.current === activeElement) {
        previousActiveElement.current = activeElement;
        return; // Initial focus ref is already the active element
      }
    } else if (containerElement.contains(activeElement)) {
      previousActiveElement.current = activeElement;
      return; // Already focused within Dialog
    }

    // Try to focus the initialFocus ref
    if (initialFocus?.current) {
      focusElement(initialFocus.current);
    } else {
      if (focusIn(containerElement, Focus.First) === FocusResult.Error) {
        console.warn(
          'There are no focusable elements inside the <FocusTrap />'
        );
      }
    }

    previousActiveElement.current = ownerDocument?.activeElement as HTMLElement;
  }, [enabled]);

  return previousActiveElement;
}

function useFocusLock(
  {
    ownerDocument,
    container,
    containers,
    previousActiveElement,
  }: {
    ownerDocument: Document | null;
    container: MutableRefObject<HTMLElement | null>;
    containers?: MutableRefObject<Set<MutableRefObject<HTMLElement | null>>>;
    previousActiveElement: MutableRefObject<HTMLElement | null>;
  },
  enabled: boolean
) {
  const mounted = useIsMounted();

  // Prevent programmatically escaping the container
  useEventListener(
    ownerDocument?.defaultView,
    'focus',
    (event) => {
      if (!enabled) return;
      if (!mounted.current) return;

      const allContainers = new Set(containers?.current);
      allContainers.add(container);

      const previous = previousActiveElement.current;
      if (!previous) return;

      const toElement = event.target as HTMLElement | null;

      if (toElement && toElement instanceof HTMLElement) {
        if (!contains(allContainers, toElement)) {
          event.preventDefault();
          event.stopPropagation();
          focusElement(previous);
        } else {
          previousActiveElement.current = toElement;
          focusElement(toElement);
        }
      } else {
        focusElement(previousActiveElement.current);
      }
    },
    true
  );
}

function contains(
  containers: Set<MutableRefObject<HTMLElement | null>>,
  element: HTMLElement
) {
  for (const container of Object.values(containers)) {
    if (container.current?.contains(element)) return true;
  }

  return false;
}
