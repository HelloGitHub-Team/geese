import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { getImageSrcSet, getImageUrl, getUpyunImageUrl } from '@/utils/image';

/** Native image behavior with deployment-specific routing for owned URLs. */
const HostedImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<'img'>
>(({ src, srcSet, onError, ...props }, ref) => {
  const routedSrc = typeof src === 'string' ? getImageUrl(src) : src;
  const routedSrcSet = getImageSrcSet(srcSet);
  const fallbackSrc = typeof src === 'string' ? getUpyunImageUrl(src) : src;
  const fallbackSrcSet = getImageSrcSet(srcSet, getUpyunImageUrl);
  return (
    <img
      {...props}
      ref={ref}
      src={routedSrc}
      srcSet={routedSrcSet}
      onError={(event) => {
        const image = event.currentTarget;
        const needsFallback =
          (fallbackSrc !== routedSrc &&
            image.getAttribute('src') === routedSrc) ||
          (fallbackSrcSet !== routedSrcSet &&
            image.getAttribute('srcset') === routedSrcSet);
        if (needsFallback) {
          // New uploads may still be synchronizing when an overseas page renders.
          if (fallbackSrcSet) image.setAttribute('srcset', fallbackSrcSet);
          else image.removeAttribute('srcset');
          if (typeof fallbackSrc === 'string' && fallbackSrc)
            image.setAttribute('src', fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
});

export default HostedImage;
