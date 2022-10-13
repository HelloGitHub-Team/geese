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
      if (!inline && match) {
        children = String(children).replace(/\n$/, '');
        if (theme != 'dark') {
          return (
            <SyntaxHighlighter
              style={vs}
              language={match[1]}
              PreTag='div'
              {...props}
            >
              {children}
            </SyntaxHighlighter>
          );
        } else {
          return (
            <SyntaxHighlighter
              style={atomDark}
              language={match[1]}
              PreTag='div'
              {...props}
            >
              {children}
            </SyntaxHighlighter>
          );
        }
      } else {
        return (
          <span
            className='rounded-sm bg-gray-100 px-1.5 py-0.5 text-sm  font-medium dark:bg-gray-600'
            {...props}
          >
            {children}
          </span>
        );
      }
    },
  };
};
