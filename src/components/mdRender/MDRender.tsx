import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import clsxm from '@/lib/clsxm';

type MDRenderProps = {
  mdString?: any; // markdown 格式的字符串
} & React.ComponentPropsWithoutRef<'div'>;

export default function MDRender({
  className,
  mdString,
  children,
  ...rest
}: MDRenderProps) {
  return (
    <div className={clsxm('', className)} {...rest}>
      <ReactMarkdown components={Code}>{mdString || children}</ReactMarkdown>
    </div>
  );
}

const Code = {
  code({ node: _node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    children = String(children).replace(/\n$/, '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
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
