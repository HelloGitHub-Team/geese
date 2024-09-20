import RcImage from 'rc-image';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import 'rc-image/assets/index.css';

import GifPlayButton from './loading/GifPlayButton';

const gifCoverImage = '!gif';

const ImageWithPreview = (props: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  const [imgSrc, setImgSrc] = useState(
    props.src?.endsWith('gif') ? `${props.src}${gifCoverImage}` : props.src
  );
  const isGifThumb = imgSrc.endsWith(gifCoverImage);
  const isGif = imgSrc?.endsWith('gif') && !isGifThumb;
  const sourceIsGif = props.src?.endsWith('gif');

  useEffect(() => {
    if (props.src?.endsWith('gif')) {
      setImgSrc(`${props.src}${gifCoverImage}`);
    } else {
      setImgSrc(props.src);
    }
  }, [props.src]);

  const handleLoadGif = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      if (sourceIsGif) {
        setImgSrc(imgSrc?.replace(gifCoverImage, ''));
      }
    }, 300);
  };

  return (
    <div className='relative flex'>
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
