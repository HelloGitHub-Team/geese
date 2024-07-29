export const DEFAULT_AVATAR =
  'https://img.hellogithub.com/github_avatar/default.jpeg';

export const OAUTH_LOGIN_KEY = 'OAUTH_LOGIN_URL';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = () => {};

/**
 * 用户初始评论框中的默认数据
 */
export const DEFAULT_INITITAL_COMMENT_DATA = {
  comment: '',
  isUsed: false,
  score: 5,
  // 输入框高度
  height: 58,
};

export type NameMap = Record<string, string>;

export const nameMap: NameMap = {
  机器学习: 'AI',
  开源书籍: 'Book',
  其它: 'Other',
};
