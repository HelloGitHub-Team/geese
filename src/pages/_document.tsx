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
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <Script id='baidu-analytics'>
            {`
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ANALYTICS}";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
            `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
