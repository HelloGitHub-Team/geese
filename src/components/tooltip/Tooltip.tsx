import React, { ReactNode, useState } from 'react';

import { isMobile } from '@/utils/util';

type TooltipProps = {
  content: string | ReactNode;
  children: ReactNode;
};

function Tooltip({ content, children }: TooltipProps) {
  const [visibility, setVisibility] = useState(false);

  return (
    <div>
      <div
        onMouseEnter={() => {
          !isMobile() && setVisibility(true);
        }}
        onMouseLeave={() => {
          !isMobile() && setVisibility(false);
        }}
      >
        {children}
      </div>
      {visibility && (
        <div
          className='rounded-sm text-sm'
          style={{
            backgroundColor: 'rgba(0,0,0,.7)',
            color: 'white',
            position: 'absolute',
            marginTop: '2px',
            zIndex: 99,
          }}
        >
          <div style={{ position: 'relative' }}>{content}</div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
