import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { getImageSrcSet, getImageUrl } from '@/utils/image';

/** Native image behavior with deployment-specific routing for owned URLs. */
const HostedImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<'img'>
>(({ src, srcSet, onError, ...props }, ref) => {
  const routedSrc = getImageUrl(src);
  const routedSrcSet = getImageSrcSet(srcSet);
  return (
    <img
      {...props}
      ref={ref}
      src={routedSrc}
      srcSet={routedSrcSet}
      onError={(event) => {
        const image = event.currentTarget;
        const needsFallback =
          (src !== routedSrc && image.getAttribute('src') === routedSrc) ||
          (srcSet !== routedSrcSet &&
            image.getAttribute('srcset') === routedSrcSet);
        if (needsFallback) {
          // New uploads may still be synchronizing when an overseas page renders.
          if (srcSet) image.setAttribute('srcset', srcSet);
          else image.removeAttribute('srcset');
          if (src) image.setAttribute('src', src);
        }
        onError?.(event);
      }}
    />
  );
});

export default HostedImage;
