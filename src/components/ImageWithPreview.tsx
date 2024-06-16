import RcImage, { ImageProps } from 'rc-image';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import 'rc-image/assets/index.css';

import GifPlayButton from './loading/GifPlayButton';

const ImageWithPreview = (props: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(
    props.src?.endsWith('gif') ? `${props.src}!gif` : (props.src as string)
  );
  const isGifThumb = imgSrc.endsWith('!gif');
  const isGif = imgSrc?.endsWith('gif') && !isGifThumb;
  const sourceIsGif = props.src?.endsWith('gif');

  useEffect(() => {
    if (props.src?.endsWith('gif')) {
      setImgSrc(`${props.src}!gif`);
    } else {
      setImgSrc(props.src as string);
    }
  }, [props.src]);

  const handleLoadGif = (e: any) => {
    e.stopPropagation();
    setTimeout(() => {
      if (sourceIsGif) {
        setImgSrc(imgSrc?.replace('!gif', ''));
      }
    }, 300);
  };

  return (
    <div style={{ position: 'relative' }}>
      <RcImage
        {...props}
        src={imgSrc}
        style={{ opacity: isGifThumb ? '0.9' : '1' }}
        preview={{
          icons: { close: <AiOutlineClose style={{ fontSize: 13 }} /> },
          toolbarRender: () => <></>,
        }}
      />
      {sourceIsGif && (
        <div className='absolute top-0 left-0 h-full w-full opacity-100'>
          <div
            onClick={handleLoadGif}
            className={`flex h-full cursor-pointer items-center justify-center transition-all duration-300 ${
              isGif ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <GifPlayButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithPreview;
