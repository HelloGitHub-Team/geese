import { ElementType, MutableRefObject, Ref } from 'react';

import { forwardRefWithAs, render } from './render';
import { Props } from './types';

export const isServer =
  typeof window === 'undefined' || typeof document === 'undefined';

export function match<
  TValue extends string | number = string,
  TReturnValue = unknown
>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    const returnValue = lookup[value];
    return typeof returnValue === 'function'
      ? returnValue(...args)
      : returnValue;
  }

  const error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

export function microTask(cb: () => void) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(cb);
  } else {
    Promise.resolve()
      .then(cb)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        })
      );
  }
}

// Credit:
//  - https://stackoverflow.com/a/30753870
const focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map(
    process.env.NODE_ENV === 'test'
      ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) =>
          `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : (selector) => `${selector}:not([tabindex='-1'])`
  )
  .join(',');

export enum Focus {
  /** Focus the first non-disabled element */
  First = 1 << 0,

  /** Focus the previous non-disabled element */
  Previous = 1 << 1,

  /** Focus the next non-disabled element */
  Next = 1 << 2,

  /** Focus the last non-disabled element */
  Last = 1 << 3,

  /** Wrap tab around */
  WrapAround = 1 << 4,

  /** Prevent scrolling the focusable elements into view */
  NoScroll = 1 << 5,
}

export enum FocusResult {
  /** Something went wrong while trying to focus. */
  Error,

  /** When `Focus.WrapAround` is enabled, going from position `N` to `N+1` where `N` is the last index in the array, then we overflow. */
  Overflow,

  /** Focus was successful. */
  Success,

  /** When `Focus.WrapAround` is enabled, going from position `N` to `N-1` where `N` is the first index in the array, then we underflow. */
  Underflow,
}

enum Direction {
  Previous = -1,
  Next = 1,
}

export function getFocusableElements(
  container: HTMLElement | null = document.body
) {
  if (container == null) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

export enum FocusableMode {
  /** The element itself must be focusable. */
  Strict,

  /** The element should be inside of a focusable element. */
  Loose,
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

export function isFocusableElement(
  element: HTMLElement,
  mode: FocusableMode = FocusableMode.Strict
) {
  if (element === getOwnerDocument(element)?.body) return false;

  return match(mode, {
    [FocusableMode.Strict]() {
      return element.matches(focusableSelector);
    },
    [FocusableMode.Loose]() {
      let next: HTMLElement | null = element;

      while (next !== null) {
        if (next.matches(focusableSelector)) return true;
        next = next.parentElement;
      }

      return false;
    },
  });
}

export function focusElement(element: HTMLElement | null) {
  element?.focus({ preventScroll: true });
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
const selectableSelector = ['textarea', 'input'].join(',');
function isSelectableElement(
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement {
  return element?.matches?.(selectableSelector) ?? false;
}

export function sortByDomNode<T>(
  nodes: T[],
  resolveKey: (item: T) => HTMLElement | null = (i) =>
    i as unknown as HTMLElement | null
): T[] {
  return nodes.slice().sort((aItem, zItem) => {
    const a = resolveKey(aItem);
    const z = resolveKey(zItem);

    if (a === null || z === null) return 0;

    const position = a.compareDocumentPosition(z);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
}

export function focusFrom(current: HTMLElement | null, focus: Focus) {
  return focusIn(getFocusableElements(), focus, true, current);
}

export function focusIn(
  container: HTMLElement | HTMLElement[],
  focus: Focus,
  sorted = true,
  active: HTMLElement | null = null
) {
  const ownerDocument = Array.isArray(container)
    ? container.length > 0
      ? container[0].ownerDocument
      : document
    : container.ownerDocument;

  const elements = Array.isArray(container)
    ? sorted
      ? sortByDomNode(container)
      : container
    : getFocusableElements(container);
  active = active ?? (ownerDocument.activeElement as HTMLElement);

  const direction = (() => {
    if (focus & (Focus.First | Focus.Next)) return Direction.Next;
    if (focus & (Focus.Previous | Focus.Last)) return Direction.Previous;

    throw new Error(
      'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
    );
  })();

  const startIndex = (() => {
    if (focus & Focus.First) return 0;
    if (focus & Focus.Previous)
      return Math.max(0, elements.indexOf(active)) - 1;
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(active)) + 1;
    if (focus & Focus.Last) return elements.length - 1;

    throw new Error(
      'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
    );
  })();

  const focusOptions = focus & Focus.NoScroll ? { preventScroll: true } : {};

  let offset = 0;
  const total = elements.length;
  let next = undefined;
  do {
    // Guard against infinite loops
    if (offset >= total || offset + total <= 0) return FocusResult.Error;

    let nextIdx = startIndex + offset;

    if (focus & Focus.WrapAround) {
      nextIdx = (nextIdx + total) % total;
    } else {
      if (nextIdx < 0) return FocusResult.Underflow;
      if (nextIdx >= total) return FocusResult.Overflow;
    }

    next = elements[nextIdx];

    // Try the focus the next element, might not work if it is "hidden" to the user.
    next?.focus(focusOptions);

    // Try the next one in line
    offset += direction;
  } while (next !== ownerDocument.activeElement);

  // By default if you <Tab> to a text input or a textarea, the browser will
  // select all the text once the focus is inside these DOM Nodes. However,
  // since we are manually moving focus this behaviour is not happening. This
  // code will make sure that the text gets selected as-if you did it manually.
  // Note: We only do this when going forward / backward. Not for the
  // Focus.First or Focus.Last actions. This is similar to the `autoFocus`
  // behaviour on an input where the input will get focus but won't be
  // selected.
  if (focus & (Focus.Next | Focus.Previous) && isSelectableElement(next)) {
    next.select();
  }

  // This is a little weird, but let me try and explain: There are a few scenario's
  // in chrome for example where a focused `<a>` tag does not get the default focus
  // styles and sometimes they do. This highly depends on whether you started by
  // clicking or by using your keyboard. When you programmatically add focus `anchor.focus()`
  // then the active element (document.activeElement) is this anchor, which is expected.
  // However in that case the default focus styles are not applied *unless* you
  // also add this tabindex.
  if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '0');

  return FocusResult.Success;
}

const DEFAULT_VISUALLY_HIDDEN_TAG = 'div' as const;

export enum Features {
  // The default, no features.
  None = 1 << 0,

  // Whether the element should be focusable or not.
  Focusable = 1 << 1,

  // Whether it should be completely hidden, even to assistive technologies.
  Hidden = 1 << 2,
}

export const Hidden = forwardRefWithAs(function VisuallyHidden<
  TTag extends ElementType = typeof DEFAULT_VISUALLY_HIDDEN_TAG
>(props: Props<TTag> & { features?: Features }, ref: Ref<HTMLElement>) {
  const { features = Features.None, ...theirProps } = props;
  const ourProps = {
    ref,
    'aria-hidden':
      (features & Features.Focusable) === Features.Focusable ? true : undefined,
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
      ...((features & Features.Hidden) === Features.Hidden &&
        !((features & Features.Focusable) === Features.Focusable) && {
          display: 'none',
        }),
    },
  };

  return render({
    ourProps,
    theirProps,
    slot: {},
    defaultTag: DEFAULT_VISUALLY_HIDDEN_TAG,
    name: 'Hidden',
  });
});

export function isDisabledReactIssue7711(element: Element): boolean {
  let parent = element.parentElement;
  let legend = null;

  while (parent && !(parent instanceof HTMLFieldSetElement)) {
    if (parent instanceof HTMLLegendElement) legend = parent;
    parent = parent.parentElement;
  }

  const isParentDisabled = parent?.getAttribute('disabled') === '' ?? false;
  if (isParentDisabled && isFirstLegend(legend)) return false;

  return isParentDisabled;
}

function isFirstLegend(element: HTMLLegendElement | null): boolean {
  if (!element) return false;

  let previous = element.previousElementSibling;

  while (previous !== null) {
    if (previous instanceof HTMLLegendElement) return false;
    previous = previous.previousElementSibling;
  }

  return true;
}

export function disposables() {
  const disposables: any[] = [];
  const queue: any[] = [];

  const api = {
    enqueue(fn: any) {
      queue.push(fn);
    },

    addEventListener<TEventName extends keyof WindowEventMap>(
      element: HTMLElement,
      name: TEventName,
      listener: (event: WindowEventMap[TEventName]) => any,
      options?: boolean | AddEventListenerOptions
    ) {
      element.addEventListener(name, listener as any, options);
      return api.add(() =>
        element.removeEventListener(name, listener as any, options)
      );
    },

    requestAnimationFrame(...args: Parameters<typeof requestAnimationFrame>) {
      const raf = requestAnimationFrame(...args);
      return api.add(() => cancelAnimationFrame(raf));
    },

    nextFrame(...args: Parameters<typeof requestAnimationFrame>) {
      return api.requestAnimationFrame(() => {
        return api.requestAnimationFrame(...args);
      });
    },

    setTimeout(...args: Parameters<typeof setTimeout>) {
      const timer = setTimeout(...args);
      return api.add(() => clearTimeout(timer));
    },

    add(cb: () => void) {
      disposables.push(cb);
      return () => {
        const idx = disposables.indexOf(cb);
        if (idx >= 0) {
          const [dispose] = disposables.splice(idx, 1);
          dispose();
        }
      };
    },

    dispose() {
      for (const dispose of disposables.splice(0)) {
        dispose();
      }
    },

    async workQueue() {
      for (const handle of queue.splice(0)) {
        await handle();
      }
    },
  };

  return api;
}

function addClasses(node: HTMLElement, ...classes: string[]) {
  node && classes.length > 0 && node.classList.add(...classes);
}

function removeClasses(node: HTMLElement, ...classes: string[]) {
  node && classes.length > 0 && node.classList.remove(...classes);
}

export enum Reason {
  // Transition succesfully ended
  Ended = 'ended',

  // Transition was cancelled
  Cancelled = 'cancelled',
}

function waitForTransition(node: HTMLElement, done: (reason: Reason) => void) {
  const d = disposables();

  if (!node) return d.dispose;

  // Safari returns a comma separated list of values, so let's sort them and take the highest value.
  const { transitionDuration, transitionDelay } = getComputedStyle(node);

  const [durationMs, delayMs] = [transitionDuration, transitionDelay].map(
    (value) => {
      const [resolvedValue = 0] = value
        .split(',')
        // Remove falsy we can't work with
        .filter(Boolean)
        // Values are returned as `0.3s` or `75ms`
        .map((v) => (v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000))
        .sort((a, z) => z - a);

      return resolvedValue;
    }
  );

  const totalDuration = durationMs + delayMs;

  if (totalDuration !== 0) {
    const listeners: (() => void)[] = [];

    if (process.env.NODE_ENV === 'test') {
      listeners.push(
        d.setTimeout(() => {
          done(Reason.Ended);
          listeners.splice(0).forEach((dispose) => dispose());
        }, totalDuration)
      );
    } else {
      listeners.push(
        d.addEventListener(node, 'transitionrun', (event) => {
          if (event.target !== event.currentTarget) return;

          // Cleanup "old" listeners
          listeners.splice(0).forEach((dispose) => dispose());

          // Register new listeners
          listeners.push(
            d.addEventListener(node, 'transitionend', (event) => {
              if (event.target !== event.currentTarget) return;

              done(Reason.Ended);
              listeners.splice(0).forEach((dispose) => dispose());
            }),
            d.addEventListener(node, 'transitioncancel', (event) => {
              if (event.target !== event.currentTarget) return;

              done(Reason.Cancelled);
              listeners.splice(0).forEach((dispose) => dispose());
            })
          );
        })
      );
    }
  } else {
    // No transition is happening, so we should cleanup already. Otherwise we have to wait until we
    // get disposed.
    done(Reason.Ended);
  }

  // If we get disposed before the transition finishes, we should cleanup anyway.
  d.add(() => done(Reason.Cancelled));

  return d.dispose;
}

export function transition(
  node: HTMLElement,
  classes: {
    enter: string[];
    enterFrom: string[];
    enterTo: string[];
    leave: string[];
    leaveFrom: string[];
    leaveTo: string[];
    entered: string[];
  },
  show: boolean,
  done?: (reason: Reason) => void
) {
  const direction = show ? 'enter' : 'leave';
  const d = disposables();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _done = done !== undefined ? once(done) : () => {};

  const base = match(direction, {
    enter: () => classes.enter,
    leave: () => classes.leave,
  });
  const to = match(direction, {
    enter: () => classes.enterTo,
    leave: () => classes.leaveTo,
  });
  const from = match(direction, {
    enter: () => classes.enterFrom,
    leave: () => classes.leaveFrom,
  });

  removeClasses(
    node,
    ...classes.enter,
    ...classes.enterTo,
    ...classes.enterFrom,
    ...classes.leave,
    ...classes.leaveFrom,
    ...classes.leaveTo,
    ...classes.entered
  );
  addClasses(node, ...base, ...from);

  d.nextFrame(() => {
    removeClasses(node, ...from);
    addClasses(node, ...to);

    waitForTransition(node, (reason) => {
      if (reason === Reason.Ended) {
        removeClasses(node, ...base);
        addClasses(node, ...classes.entered);
      }

      return _done(reason);
    });
  });

  return d.dispose;
}

export function once<T>(cb: (...args: T[]) => void) {
  const state = { called: false };

  return (...args: T[]) => {
    if (state.called) return;
    state.called = true;
    return cb(...args);
  };
}
