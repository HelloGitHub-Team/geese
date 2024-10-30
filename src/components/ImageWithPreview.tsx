import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import GifPlayButton from './loading/GifPlayButton';

const gifCoverImage = '!gif';

interface ImageWithPreviewProps {
  src: string;
  alt: string;
  [key: string]: any;
}

const ImageWithPreview = ({ src, alt, ...rest }: ImageWithPreviewProps) => {
  const [imgSrc, setImgSrc] = useState(
    src?.endsWith('gif') ? `${src}${gifCoverImage}` : src
  );
  const sourceIsGif = src?.endsWith('gif');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleLoadGif = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      if (sourceIsGif) {
        setImgSrc(src);
      }
    }, 300);
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleWheel = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div className='relative flex'>
        <img
          {...rest}
          src={imgSrc}
          alt={alt}
          style={{
            opacity: imgSrc.endsWith(gifCoverImage) ? 0.9 : 1,
            width: '100%',
            height: 'auto',
            cursor: 'zoom-in',
          }}
          onClick={handleOpenPreview}
        />
        {sourceIsGif && imgSrc.endsWith(gifCoverImage) && (
          <div
            onClick={handleLoadGif}
            className='absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center'
          >
            <GifPlayButton />
          </div>
        )}
      </div>
      {isPreviewOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
          onClick={handleClosePreview}
          onWheel={handleWheel}
        >
          <img
            src={src}
            alt={alt}
            className='max-h-full max-w-full object-contain'
            style={{ cursor: 'zoom-out', maxHeight: '80%' }}
          />
          <button
            className='absolute top-4 right-4 rounded-full bg-black bg-opacity-50 p-1 text-white'
            onClick={handleClosePreview}
          >
            <AiOutlineClose style={{ fontSize: 13 }} />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageWithPreview;
