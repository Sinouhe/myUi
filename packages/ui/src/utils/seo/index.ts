import { isAbsoluteUrl } from '../global';

/**
 * Get the rel parameter of a link
 */
export const getLinkRel = ({
  url,
  isHomePage = false,
  target = '',
  role = false,
}: {
  url: string;
  isHomePage?: boolean;
  target?: string;
  role?: boolean;
}): {
  rel?: string;
} => {
  if (!url || role) return {};

  const isAnchor = url.indexOf('#') === 0,
    absoluteUrl = isAbsoluteUrl({ url });

  let rel: {
    rel?: string;
  } = {};
  if (isAnchor || (absoluteUrl && !isHomePage)) {
    rel = { rel: 'nofollow' };
  }
  if (target === '_blank') {
    if (rel.rel) rel.rel += ' noopenner';
    else rel = { rel: 'noopenner' };
  }

  return rel;
};

/**
 * @see https://gist.github.com/yairEO/9d8e18a330aab275bc86b56075fc234e
 */
export const minifyTemplateString = (str: string): string => {
  return typeof str === 'string'
    ? str
        // eslint-disable-next-line no-useless-escape
        .replace(/\>[\r\n ]+\</g, '><')
        .replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : ' '))
        .trim()
    : str;
};
