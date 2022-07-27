// WAI-ARIA: https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_modal
import React, {
  // Types
  ContextType,
  createContext,
  createRef,
  ElementType,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  Ref,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { Description, useDescriptions } from './description';
import { FocusTrap } from './focus-trap';
import { Portal } from './portal';
import { ForcePortalRoot } from './portal';
import {
  Features as HiddenFeatures,
  Hidden,
  isDisabledReactIssue7711,
  match,
} from '../utils';
import {
  StackMessage,
  StackProvider,
  State,
  useOpenClosed,
} from '../utils/common';
import {
  useEvent,
  useEventListener,
  useId,
  useInertOthers,
  useOutsideClick,
  useOwnerDocument,
  useServerHandoffComplete,
  useSyncRefs,
} from '../utils/hooks';
import {
  Features,
  forwardRefWithAs,
  PropsForFeatures,
  render,
} from '../utils/render';
import { Props } from '../utils/types';

export enum Keys {
  Space = ' ',
  Enter = 'Enter',
  Escape = 'Escape',
  Backspace = 'Backspace',
  Delete = 'Delete',

  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',

  Home = 'Home',
  End = 'End',

  PageUp = 'PageUp',
  PageDown = 'PageDown',

  Tab = 'Tab',
}

enum DialogStates {
  Open,
  Closed,
}

interface StateDefinition {
  titleId: string | null;
  panelRef: MutableRefObject<HTMLDivElement | null>;
}

enum ActionTypes {
  SetTitleId,
}

type Actions = { type: ActionTypes.SetTitleId; id: string | null };

const reducers: {
  [P in ActionTypes]: (
    state: StateDefinition,
    action: Extract<Actions, { type: P }>
  ) => StateDefinition;
} = {
  [ActionTypes.SetTitleId](state, action) {
    if (state.titleId === action.id) return state;
    return { ...state, titleId: action.id };
  },
};

const DialogContext = createContext<
  | [
      {
        dialogState: DialogStates;
        close(): void;
        setTitleId(id: string | null): void;
      },
      StateDefinition
    ]
  | null
>(null);
DialogContext.displayName = 'DialogContext';

function useDialogContext(component: string) {
  const context = useContext(DialogContext);
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Dialog /> component.`
    );
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDialogContext);
    throw err;
  }
  return context;
}

function stateReducer(state: StateDefinition, action: Actions) {
  return match(action.type, reducers, state, action);
}

// ---

const DEFAULT_DIALOG_TAG = 'div' as const;
interface DialogRenderPropArg {
  open: boolean;
}
type DialogPropsWeControl =
  | 'id'
  | 'role'
  | 'aria-modal'
  | 'aria-describedby'
  | 'aria-labelledby';

const DialogRenderFeatures = Features.RenderStrategy | Features.Static;

const DialogRoot = forwardRefWithAs(function Dialog<
  TTag extends ElementType = typeof DEFAULT_DIALOG_TAG
>(
  props: Props<TTag, DialogRenderPropArg, DialogPropsWeControl> &
    PropsForFeatures<typeof DialogRenderFeatures> & {
      open?: boolean;
      onClose(value: boolean): void;
      initialFocus?: MutableRefObject<HTMLElement | null>;
      __demoMode?: boolean;
    },
  ref: Ref<HTMLDivElement>
) {
  const { onClose, initialFocus, __demoMode = false, ...theirProps } = props;
  let { open } = props;
  const [nestedDialogCount, setNestedDialogCount] = useState(0);

  const usesOpenClosedState = useOpenClosed();
  if (open === undefined && usesOpenClosedState !== null) {
    // Update the `open` prop based on the open closed state
    open = match(usesOpenClosedState, {
      [State.Open]: true,
      [State.Closed]: false,
    });
  }

  const containers = useRef<Set<MutableRefObject<HTMLElement | null>>>(
    new Set()
  );
  const internalDialogRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useSyncRefs(internalDialogRef, ref);

  // Reference to a node in the "main" tree, not in the portalled Dialog tree.
  const mainTreeNode = useRef<HTMLDivElement | null>(null);

  const ownerDocument = useOwnerDocument(internalDialogRef);

  // Validations
  // eslint-disable-next-line no-prototype-builtins
  const hasOpen = props.hasOwnProperty('open') || usesOpenClosedState !== null;
  // eslint-disable-next-line no-prototype-builtins
  const hasOnClose = props.hasOwnProperty('onClose');
  if (!hasOpen && !hasOnClose) {
    throw new Error(
      `You have to provide an \`open\` and an \`onClose\` prop to the \`Dialog\` component.`
    );
  }

  if (!hasOpen) {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but forgot an \`open\` prop.`
    );
  }

  if (!hasOnClose) {
    throw new Error(
      `You provided an \`open\` prop to the \`Dialog\`, but forgot an \`onClose\` prop.`
    );
  }

  if (typeof open !== 'boolean') {
    throw new Error(
      `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${open}`
    );
  }

  if (typeof onClose !== 'function') {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${onClose}`
    );
  }

  const dialogState = open ? DialogStates.Open : DialogStates.Closed;

  const [state, dispatch] = useReducer(stateReducer, {
    titleId: null,
    descriptionId: null,
    panelRef: createRef(),
  } as StateDefinition);

  const close = useEvent(() => onClose(false));

  const setTitleId = useEvent((id: string | null) =>
    dispatch({ type: ActionTypes.SetTitleId, id })
  );

  const ready = useServerHandoffComplete();
  const enabled = ready
    ? __demoMode
      ? false
      : dialogState === DialogStates.Open
    : false;
  const hasNestedDialogs = nestedDialogCount > 1; // 1 is the current dialog
  // eslint-disable-next-line unused-imports/no-unused-vars
  const hasParentDialog = useContext(DialogContext) !== null;

  // If there are multiple dialogs, then you can be the root, the leaf or one
  // in between. We only care abou whether you are the top most one or not.
  const position = !hasNestedDialogs ? 'leaf' : 'parent';

  // Ensure other elements can't be interacted with
  useInertOthers(internalDialogRef, hasNestedDialogs ? enabled : false);

  // Close Dialog on outside click
  useOutsideClick(
    () => {
      // Third party roots
      const rootContainers = Array.from(
        ownerDocument?.querySelectorAll('body > *, [data-portal]') ?? []
      ).filter((container) => {
        if (!(container instanceof HTMLElement)) return false; // Skip non-HTMLElements
        if (container.contains(mainTreeNode.current)) return false; // Skip if it is the main app
        if (
          state.panelRef.current &&
          container.contains(state.panelRef.current)
        )
          return false;
        return true; // Keep
      });

      return [
        ...rootContainers,
        state.panelRef.current ?? internalDialogRef.current,
      ] as HTMLElement[];
    },
    close,
    enabled && !hasNestedDialogs
  );

  // Handle `Escape` to close
  useEventListener(ownerDocument?.defaultView, 'keydown', (event: any) => {
    if (event.defaultPrevented) return;
    if (event.key !== Keys.Escape) return;
    if (dialogState !== DialogStates.Open) return;
    if (hasNestedDialogs) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  // Scroll lock
  // useEffect(() => {
  //   if (dialogState !== DialogStates.Open) return;
  //   if (hasParentDialog) return;

  //   const ownerDocument = getOwnerDocument(internalDialogRef);
  //   if (!ownerDocument) return;

  //   const documentElement = ownerDocument.body;
  //   const ownerWindow = ownerDocument.defaultView ?? window;

  //   const overflow = documentElement.style.overflow;
  //   const paddingRight = documentElement.style.paddingRight;

  //   const scrollbarWidthBefore =
  //     ownerWindow.innerWidth - documentElement.clientWidth;
  //   documentElement.style.overflow = 'hidden';

  //   if (scrollbarWidthBefore > 0) {
  //     const scrollbarWidthAfter =
  //       documentElement.clientWidth - documentElement.offsetWidth;
  //     const scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter;
  //     documentElement.style.paddingRight = `${scrollbarWidth}px`;
  //   }

  //   return () => {
  //     documentElement.style.overflow = overflow;
  //     documentElement.style.paddingRight = paddingRight;
  //   };
  // }, [dialogState, hasParentDialog]);

  // Trigger close when the FocusTrap gets hidden
  useEffect(() => {
    if (dialogState !== DialogStates.Open) return;
    if (!internalDialogRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (
          entry.boundingClientRect.x === 0 &&
          entry.boundingClientRect.y === 0 &&
          entry.boundingClientRect.width === 0 &&
          entry.boundingClientRect.height === 0
        ) {
          close();
        }
      }
    });

    observer.observe(internalDialogRef.current);

    return () => observer.disconnect();
  }, [dialogState, internalDialogRef, close]);

  const [describedby, DescriptionProvider] = useDescriptions();

  const id = `dialog-${useId()}`;

  const contextBag = useMemo<ContextType<typeof DialogContext>>(
    () => [{ dialogState, close, setTitleId }, state],
    [dialogState, state, close, setTitleId]
  );

  const slot = useMemo<DialogRenderPropArg>(
    () => ({ open: dialogState === DialogStates.Open }),
    [dialogState]
  );

  const ourProps = {
    ref: dialogRef,
    id,
    role: 'dialog',
    'aria-modal': dialogState === DialogStates.Open ? true : undefined,
    'aria-labelledby': state.titleId,
    'aria-describedby': describedby,
  };

  return (
    <StackProvider
      type='Dialog'
      enabled={dialogState === DialogStates.Open}
      element={internalDialogRef}
      onUpdate={useEvent((message: any, type: any, element: any) => {
        if (type !== 'Dialog') return;

        match(message, {
          [StackMessage.Add]() {
            containers.current.add(element);
            setNestedDialogCount((count) => count + 1);
          },
          [StackMessage.Remove]() {
            containers.current.add(element);
            setNestedDialogCount((count) => count - 1);
          },
        });
      })}
    >
      <ForcePortalRoot force={true}>
        <Portal>
          <DialogContext.Provider value={contextBag}>
            <Portal.Group target={internalDialogRef}>
              <ForcePortalRoot force={false}>
                <DescriptionProvider slot={slot} name='Dialog.Description'>
                  <FocusTrap
                    initialFocus={initialFocus}
                    containers={containers}
                    features={
                      enabled
                        ? match(position, {
                            parent: FocusTrap.features.RestoreFocus,
                            leaf:
                              FocusTrap.features.All &
                              ~FocusTrap.features.FocusLock,
                          })
                        : FocusTrap.features.None
                    }
                  >
                    {render({
                      ourProps,
                      theirProps,
                      slot,
                      defaultTag: DEFAULT_DIALOG_TAG,
                      features: DialogRenderFeatures,
                      visible: dialogState === DialogStates.Open,
                      name: 'Dialog',
                    })}
                  </FocusTrap>
                </DescriptionProvider>
              </ForcePortalRoot>
            </Portal.Group>
          </DialogContext.Provider>
        </Portal>
      </ForcePortalRoot>
      <Hidden features={HiddenFeatures.Hidden} ref={mainTreeNode} />
    </StackProvider>
  );
});

// ---

const DEFAULT_OVERLAY_TAG = 'div' as const;
interface OverlayRenderPropArg {
  open: boolean;
}
type OverlayPropsWeControl = 'id' | 'aria-hidden' | 'onClick';

const Overlay = forwardRefWithAs(function Overlay<
  TTag extends ElementType = typeof DEFAULT_OVERLAY_TAG
>(
  props: Props<TTag, OverlayRenderPropArg, OverlayPropsWeControl>,
  ref: Ref<HTMLDivElement>
) {
  const [{ dialogState, close }] = useDialogContext('Dialog.Overlay');
  const overlayRef = useSyncRefs(ref);

  const id = `dialog-overlay-${useId()}`;

  const handleClick = useEvent((event: ReactMouseEvent) => {
    if (event.target !== event.currentTarget) return;
    if (isDisabledReactIssue7711(event.currentTarget))
      return event.preventDefault();
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  const slot = useMemo<OverlayRenderPropArg>(
    () => ({ open: dialogState === DialogStates.Open }),
    [dialogState]
  );

  const theirProps = props;
  const ourProps = {
    ref: overlayRef,
    id,
    'aria-hidden': true,
    onClick: handleClick,
  };

  return render({
    ourProps,
    theirProps,
    slot,
    defaultTag: DEFAULT_OVERLAY_TAG,
    name: 'Dialog.Overlay',
  });
});

// ---

const DEFAULT_BACKDROP_TAG = 'div' as const;
interface BackdropRenderPropArg {
  open: boolean;
}
type BackdropPropsWeControl = 'id' | 'aria-hidden' | 'onClick';

const Backdrop = forwardRefWithAs(function Backdrop<
  TTag extends ElementType = typeof DEFAULT_BACKDROP_TAG
>(
  props: Props<TTag, BackdropRenderPropArg, BackdropPropsWeControl>,
  ref: Ref<HTMLDivElement>
) {
  const [{ dialogState }, state] = useDialogContext('Dialog.Backdrop');
  const backdropRef = useSyncRefs(ref);

  const id = `dialog-backdrop-${useId()}`;

  useEffect(() => {
    if (state.panelRef.current === null) {
      throw new Error(
        `A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.`
      );
    }
  }, [state.panelRef]);

  const slot = useMemo<BackdropRenderPropArg>(
    () => ({ open: dialogState === DialogStates.Open }),
    [dialogState]
  );

  const theirProps = props;
  const ourProps = {
    ref: backdropRef,
    id,
    'aria-hidden': true,
  };

  return (
    <ForcePortalRoot force>
      <Portal>
        {render({
          ourProps,
          theirProps,
          slot,
          defaultTag: DEFAULT_BACKDROP_TAG,
          name: 'Dialog.Backdrop',
        })}
      </Portal>
    </ForcePortalRoot>
  );
});

// ---

const DEFAULT_PANEL_TAG = 'div' as const;
interface PanelRenderPropArg {
  open: boolean;
}

const Panel = forwardRefWithAs(function Panel<
  TTag extends ElementType = typeof DEFAULT_PANEL_TAG
>(props: Props<TTag, PanelRenderPropArg>, ref: Ref<HTMLDivElement>) {
  const [{ dialogState }, state] = useDialogContext('Dialog.Panel');
  const panelRef = useSyncRefs(ref, state.panelRef);

  const id = `dialog-panel-${useId()}`;

  const slot = useMemo<PanelRenderPropArg>(
    () => ({ open: dialogState === DialogStates.Open }),
    [dialogState]
  );

  // Prevent the click events inside the Dialog.Panel from bubbling through the React Tree which
  // could submit wrapping <form> elements even if we portalled the Dialog.
  const handleClick = useEvent((event: ReactMouseEvent) => {
    event.stopPropagation();
  });

  const theirProps = props;
  const ourProps = {
    ref: panelRef,
    id,
    onClick: handleClick,
  };

  return render({
    ourProps,
    theirProps,
    slot,
    defaultTag: DEFAULT_PANEL_TAG,
    name: 'Dialog.Panel',
  });
});

// ---

const DEFAULT_TITLE_TAG = 'h2' as const;
interface TitleRenderPropArg {
  open: boolean;
}
type TitlePropsWeControl = 'id';

const Title = forwardRefWithAs(function Title<
  TTag extends ElementType = typeof DEFAULT_TITLE_TAG
>(
  props: Props<TTag, TitleRenderPropArg, TitlePropsWeControl>,
  ref: Ref<HTMLHeadingElement>
) {
  const [{ dialogState, setTitleId }] = useDialogContext('Dialog.Title');

  const id = `dialog-title-${useId()}`;
  const titleRef = useSyncRefs(ref);

  useEffect(() => {
    setTitleId(id);
    return () => setTitleId(null);
  }, [id, setTitleId]);

  const slot = useMemo<TitleRenderPropArg>(
    () => ({ open: dialogState === DialogStates.Open }),
    [dialogState]
  );

  const theirProps = props;
  const ourProps = { ref: titleRef, id };

  return render({
    ourProps,
    theirProps,
    slot,
    defaultTag: DEFAULT_TITLE_TAG,
    name: 'Dialog.Title',
  });
});

// ---

export const Dialog = Object.assign(DialogRoot, {
  Backdrop,
  Panel,
  Overlay,
  Title,
  Description,
});
