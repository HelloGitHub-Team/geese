import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import clsxm from '@/lib/clsxm';

type MDRenderProps = {
  mdString: string; // markdown 格式的字符串
} & React.ComponentPropsWithoutRef<'div'>;

export default function MDRender({
  className,
  mdString,
  ...rest
}: MDRenderProps) {
  return (
    <div className={clsxm('', className)} {...rest}>
      <ReactMarkdown components={Code}>{mdString}</ReactMarkdown>
    </div>
  );
}

const Code = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    children = String(children).replace(/\n$/, '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag='div'
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    );
  },
};
