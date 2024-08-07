import { getCurrentToken } from '@/hooks/useToken';

function translate(key: string, lang: string): string {
  const messages: { [key: string]: { [lang: string]: string } } = {
    requestFailed: {
      zh: '请求接口失败',
      en: 'API request failed',
    },
    serverError: {
      zh: '服务器发生错误',
      en: 'Server error occurred',
    },
    resourceNotFound: {
      zh: '未找到该资源',
      en: 'Resource not found',
    },
    pleaseLogin: {
      zh: '请先登录',
      en: 'Please login first',
    },
  };

  return messages[key]?.[lang] || messages[key]?.['en'] || key;
}

function getUserLanguage(): string {
  if (typeof window === 'undefined') {
    // 服务器端渲染
    // 这里可以使用 Next.js 的 API 来获取语言设置
    // 例如，从 cookies 或者请求头中获取
    // 这个实现需要根据你的具体设置来调整
    return 'en'; // 接口异常默认语言
  } else {
    // 客户端渲染
    return (
      localStorage?.getItem('locale') ||
      navigator?.language?.split('-')[0] ||
      'en'
    );
  }
}

export const fetcher = async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const lang = getUserLanguage();
  // if the user is not online when making the API call
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    throw new Error('OFFLINE');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCurrentToken()}`,
  };
  if (init?.headers) {
    init.headers = { ...defaultHeaders, ...init.headers };
  } else if (init) {
    init.headers = defaultHeaders;
  } else {
    init = { headers: defaultHeaders };
  }
  let message = translate('requestFailed', lang);
  const res = await fetch(input, init);
  try {
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 500) {
        if (typeof window !== 'undefined') {
          window.location.href = '/500';
        } else {
          message = translate('serverError', lang);
        }
      } else if (res.status === 404) {
        if (typeof window !== 'undefined') {
          window.location.href = '/404';
        } else {
          message = translate('resourceNotFound', lang);
        }
      } else if (res.status === 400) {
        message = json.message;
      } else if (res.status === 401) {
        if (!res.url.includes('/me/')) {
          message = translate('pleaseLogin', lang);
        }
      } else if (res.status === 422) {
        message = `${message}：${json.detail[0].msg}`;
      } else {
        if (json.message) {
          message = json.message;
        } else {
          console.log(json);
        }
      }
      return Object({ success: false, message: message });
    } else {
      return json;
    }
  } catch (error) {
    return Object({ success: false, message: message });
  }
};
