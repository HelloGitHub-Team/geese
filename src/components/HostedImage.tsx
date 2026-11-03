import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { getImageSrcSet, getImageUrl } from '@/utils/image';

/** Native image behavior with deployment-specific routing for owned URLs. */
const HostedImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<'img'>
>(({ src, srcSet, ...props }, ref) => (
  <img
    {...props}
    ref={ref}
    src={typeof src === 'string' ? getImageUrl(src) : src}
    srcSet={getImageSrcSet(srcSet)}
  />
));

export default HostedImage;
