import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

import clsxm from '@/lib/clsxm';
import { useLoginContext } from '@/hooks/useLoginContext';

type MDRenderProps = {
  mdString?: any; // markdown 格式的字符串
} & React.ComponentPropsWithoutRef<'div'>;

type CodeProps = {
  code: string;
  lanuage: string;
};

export const CodeRender = ({ code, lanuage }: CodeProps) => {
  const { theme } = useLoginContext();
  if (lanuage) {
    if (theme != 'dark') {
      return (
        <SyntaxHighlighter style={vs} language={lanuage} PreTag='div'>
          {code}
        </SyntaxHighlighter>
      );
    } else {
      return (
        <SyntaxHighlighter style={vscDarkPlus} language={lanuage} PreTag='div'>
          {code}
        </SyntaxHighlighter>
      );
    }
  } else {
    return (
      <span className='rounded-sm bg-gray-100 px-1.5 py-0.5 text-sm font-medium dark:bg-gray-600'>
        {code}
      </span>
    );
  }
};

export const MDRender = ({
  className,
  mdString,
  children,
  ...rest
}: MDRenderProps) => {
  const { theme } = useLoginContext();

  const getComponents = (theme: string) => {
    return {
      // 代码块渲染
      code(props: any) {
        const { inline, className, children } = props;
        const isInline =
          typeof inline === 'boolean'
            ? inline
            : typeof children === 'string' && !children.includes('\n');
        if (isInline) {
          return (
            <code className='rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
              {children}
            </code>
          );
        }
        const match = /language-(\w+)/.exec(className || '') || 'shell';
        if (match) {
          return (
            <SyntaxHighlighter
              style={theme !== 'dark' ? vs : vscDarkPlus}
              language={match[1]}
              PreTag='pre'
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
        return (
          <span
            className='rounded-sm bg-gray-100 px-1.5 py-0.5 text-sm 
              font-medium dark:bg-gray-600'
          >
            {children}
          </span>
        );
      },
    };
  };

  return (
    <div className={clsxm('', className)} {...rest}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={getComponents(theme)}
      >
        {mdString || children}
      </ReactMarkdown>
    </div>
  );
};
