export const isObject = (o: any): boolean =>
  Object.prototype.toString.call(o) === '[object Object]';

export const capitalizeFirstLetter = ({ string }: { string: string }): string => {
  return string && string.length > 0
    ? string.charAt(0).toUpperCase() +
        string
          .replace(/chanel/g, 'Chanel')
          .slice(1)
          .toLowerCase()
    : '';
};

export const isAbsoluteUrl = ({ url }: { url: string }): RegExpExecArray | null => {
  const patternAbsolute = /^(http:|https:)?\/\//gi;
  return patternAbsolute.exec(url);
};

export const getCookie = ({ cookieName }: { cookieName: string }): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);

  if (parts.length === 2) {
    const result = parts.pop()?.split(';').shift();
    if (result) {
      return result;
    }
  }

  return '';
};

export const setCookie = ({
  cookieName,
  cookieValue,
  days,
}: {
  cookieName: string;
  cookieValue: string;
  days: number;
}): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${cookieName}=${cookieValue}; ${expires}; path=/`;
};
