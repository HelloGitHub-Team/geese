import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import clsxm from '@/lib/clsxm';
import { useLoginContext } from '@/hooks/useLoginContext';

type MDRenderProps = {
  mdString?: any; // markdown 格式的字符串
} & React.ComponentPropsWithoutRef<'div'>;

export default function MDRender({
  className,
  mdString,
  children,
  ...rest
}: MDRenderProps) {
  const { theme } = useLoginContext();

  return (
    <div className={clsxm('', className)} {...rest}>
      <ReactMarkdown components={getCode(theme)}>
        {mdString || children}
      </ReactMarkdown>
    </div>
  );
}

const getCode = (theme: string) => {
  return {
    code({ node: _node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '') || 'shell';
      children = String(children).replace(/\n$/, '');
      if (theme != 'dark') {
        return !inline && match ? (
          <SyntaxHighlighter
            style={vs}
            language={match[1]}
            PreTag='div'
            {...props}
          >
            {children}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props} />
        );
      } else {
        return !inline && match ? (
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag='div'
            {...props}
          >
            {children}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props} />
        );
      }
    },
  };
};
