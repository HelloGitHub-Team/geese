import { ReactElement, ReactNode } from 'react';

const __ = '1D45E01E-AF44-47C4-988A-19A94EBAF55C' as const;
export type __ = typeof __;

type PropsWeControl = 'as' | 'children' | 'refName' | 'className';

export type PropsOf<TTag = any> = TTag extends React.ElementType
  ? React.ComponentProps<TTag>
  : never;

// Add certain props that we control
type OurProps<TTag, TSlot = any> = {
  as?: TTag;
  children?: ReactNode | ((bag: TSlot) => ReactElement);
  refName?: string;
};

type CleanProps<
  TTag,
  TOmitableProps extends keyof any = __
> = TOmitableProps extends __
  ? Omit<PropsOf<TTag>, PropsWeControl>
  : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;

export type Props<
  TTag,
  TSlot = any,
  TOmitableProps extends keyof any = __
> = CleanProps<TTag, TOmitableProps> &
  OurProps<TTag, TSlot> &
  ClassNameOverride<TTag, TSlot>;

// Conditionally override the `className`, to also allow for a function
// if and only if the PropsOf<TTag> already define `className`.
// This will allow us to have a TS error on as={Fragment}
type ClassNameOverride<TTag, TSlot = any> = PropsOf<TTag> extends {
  className?: any;
}
  ? { className?: string | ((bag: TSlot) => string) }
  : any;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends __
  ? never
  : T extends __
  ? U
  : U extends __
  ? T
  : T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
