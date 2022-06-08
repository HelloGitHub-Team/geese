import * as React from 'react';



const PrimaryLang = ({ color, lang }: { color: string, lang: string }) => {
    const name = 'mt-1 ml-1 whitespace-nowrap rounded-md h-4 py-0.5 px-2 text-xs leading-none font-semibold bg-['+color+']'
  return (
      <div>
     <span className={name}>1</span>
        <span>{lang}</span>
    </div>

  );
}

export default PrimaryLang;
