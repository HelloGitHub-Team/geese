import React, {
  createContext,
  // Types
  ElementType,
  Fragment,
  MutableRefObject,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { isServer, microTask } from './utils';
import {
  optionalRef,
  useIsoMorphicEffect,
  useOwnerDocument,
  useServerHandoffComplete,
  useSyncRefs,
} from './utils/hooks';
import { forwardRefWithAs, render } from './utils/render';
import { Props } from './utils/types';

const ForcePortalRootContext = createContext(false);

export function usePortalRoot() {
  return useContext(ForcePortalRootContext);
}

interface ForcePortalRootProps {
  force: boolean;
  children: ReactNode;
}

export function ForcePortalRoot(props: ForcePortalRootProps) {
  return (
    <ForcePortalRootContext.Provider value={props.force}>
      {props.children}
    </ForcePortalRootContext.Provider>
  );
}

function usePortalTarget(
  ref: MutableRefObject<HTMLElement | null>
): HTMLElement | null {
  const forceInRoot = usePortalRoot();
  const groupTarget = useContext(PortalGroupContext);

  const ownerDocument = useOwnerDocument(ref);

  const [target, setTarget] = useState(() => {
    // Group context is used, but still null
    if (!forceInRoot && groupTarget !== null) return null;

    // No group context is used, const's create a default portal root
    if (isServer) return null;
    const existingRoot = ownerDocument?.getElementById('dialog-portal');
    if (existingRoot) return existingRoot;

    if (ownerDocument === null) return null;

    const root = ownerDocument.createElement('div');
    root.setAttribute('id', 'dialog-portal');
    return ownerDocument.body.appendChild(root);
  });

  // Ensure the portal root is always in the DOM
  useEffect(() => {
    if (target === null) return;

    if (!ownerDocument?.body.contains(target)) {
      ownerDocument?.body.appendChild(target);
    }
  }, [target, ownerDocument]);

  useEffect(() => {
    if (forceInRoot) return;
    if (groupTarget === null) return;
    setTarget(groupTarget.current);
  }, [groupTarget, setTarget, forceInRoot]);

  return target;
}

// ---

const DEFAULT_PORTAL_TAG = Fragment;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PortalRenderPropArg {}

const PortalRoot = forwardRefWithAs(function Portal<
  TTag extends ElementType = typeof DEFAULT_PORTAL_TAG
>(props: Props<TTag, PortalRenderPropArg>, ref: Ref<HTMLElement>) {
  const theirProps = props;
  const internalPortalRootRef = useRef<HTMLElement | null>(null);
  const portalRef = useSyncRefs(
    optionalRef<typeof internalPortalRootRef['current']>((ref) => {
      internalPortalRootRef.current = ref;
    }),
    ref
  );
  const ownerDocument = useOwnerDocument(internalPortalRootRef);
  const target = usePortalTarget(internalPortalRootRef);
  const [element] = useState<HTMLDivElement | null>(() =>
    isServer ? null : ownerDocument?.createElement('div') ?? null
  );

  const ready = useServerHandoffComplete();

  const trulyUnmounted = useRef(false);
  useIsoMorphicEffect(() => {
    trulyUnmounted.current = false;

    if (!target || !element) return;

    // Element already exists in target, always calling target.appendChild(element) will cause a
    // brief unmount/remount.
    if (!target.contains(element)) {
      element.setAttribute('data-portal', '');
      target.appendChild(element);
    }

    return () => {
      trulyUnmounted.current = true;

      microTask(() => {
        if (!trulyUnmounted.current) return;
        if (!target || !element) return;

        target.removeChild(element);

        if (target.childNodes.length <= 0) {
          target.parentElement?.removeChild(target);
        }
      });
    };
  }, [target, element]);

  if (!ready) return null;

  const ourProps = { ref: portalRef };

  return !target || !element
    ? null
    : createPortal(
        render({
          ourProps,
          theirProps,
          defaultTag: DEFAULT_PORTAL_TAG,
          name: 'Portal',
        }),
        element
      );
});

// ---

const DEFAULT_GROUP_TAG = Fragment;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GroupRenderPropArg {}

const PortalGroupContext =
  createContext<MutableRefObject<HTMLElement | null> | null>(null);

const Group = forwardRefWithAs(function Group<
  TTag extends ElementType = typeof DEFAULT_GROUP_TAG
>(
  props: Props<TTag, GroupRenderPropArg> & {
    target: MutableRefObject<HTMLElement | null>;
  },
  ref: Ref<HTMLElement>
) {
  const { target, ...theirProps } = props;
  const groupRef = useSyncRefs(ref);

  const ourProps = { ref: groupRef };

  return (
    <PortalGroupContext.Provider value={target}>
      {render({
        ourProps,
        theirProps,
        defaultTag: DEFAULT_GROUP_TAG,
        name: 'Popover.Group',
      })}
    </PortalGroupContext.Provider>
  );
});

// ---

export const Portal = Object.assign(PortalRoot, { Group });
