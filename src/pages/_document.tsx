import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='zh'>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* 可以根据之前选择的 theme 模式 或者系统的颜色模式设置首次进入时候的主题模式 */}
          <Script strategy='beforeInteractive' id='toggle-dark-mode'>
            {`
            (() => {
              const isOSDark =
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isLocalDark = localStorage.getItem('theme') === 'dark';
              console.log("isLocalDark",isLocalDark)
              // 用户选择主题颜色优先级大于系统
              if(!isLocalDark) return
              if(isOSDark || isLocalDark) {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', 'dark');
              }
            })();
          `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
