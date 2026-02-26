import { isObject } from '../global';
import logger from '../logger';

class ScriptLoader {
  private static singleton: ScriptLoader;

  private _loadedScript: Array<string> = [];

  private _loadedCss: Array<string> = [];

  static getSingleton(): ScriptLoader {
    return ScriptLoader.singleton || (ScriptLoader.singleton = new ScriptLoader());
  }

  get loadedScript(): Array<string> {
    return this._loadedScript;
  }

  get loadedCss(): Array<string> {
    return this._loadedCss;
  }

  private addLoadedScript({ url }: { url: string }): Array<string> {
    this._loadedScript.push(url);
    return this._loadedScript;
  }

  private addLoadedStyle({ url }: { url: string }): Array<string> {
    this._loadedCss.push(url);
    return this._loadedCss;
  }

  private withDrawLoadedScript({ url }: { url: string }): Array<string> {
    this._loadedScript = this._loadedCss.filter((urlTemp) => urlTemp !== url);
    return this._loadedScript;
  }

  private withDrawLoadedStyle({ url }: { url: string }): Array<string> {
    this._loadedCss = this._loadedCss.filter((urlTemp) => urlTemp !== url);
    return this._loadedCss;
  }

  createElement = ({
    tag,
    id,
    classes = [],
    style = {},
    attributes = {},
  }: any = {}): HTMLElement => {
    if (typeof tag !== 'string') throw new Error('Could not create element!');

    const el = document.createElement(tag);

    if (typeof id === 'string') el.id = id;

    if (Array.isArray(classes))
      classes.map((c) => {
        el.classList.add(c);
      });

    // Add style attribute
    if (isObject(style)) Object.assign(el.style, style);

    // Add other attributes
    if (isObject(attributes)) Object.keys(attributes).map((a) => el.setAttribute(a, attributes[a]));

    return el;
  };

  private loadScript = ({
    src,
    promisedCallbackLauncher,
  }: {
    src: string;
    promisedCallbackLauncher: () => void;
  }): Promise<void> =>
    new Promise((resolve, reject) => {
      const script = this.createElement({
        tag: 'script',
        attributes: {
          src,
          type: 'text/javascript',
          defer: true,
        },
      });

      const onError = (e: any): void => {
        script.removeEventListener('load', onLoad);
        this.withDrawLoadedScript({ url: src });
        reject(e);
      };

      const onLoad = (e: any): void => {
        script.removeEventListener('error', onError);
        promisedCallbackLauncher();
        resolve(e);
      };

      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
      document.head.append(script);
    });

  private loadStyle = ({
    href,
    promisedCallbackLauncher,
  }: {
    href: string;
    promisedCallbackLauncher: () => void;
  }): Promise<void> =>
    new Promise((resolve, reject) => {
      const link = this.createElement({
        tag: 'link',
        attributes: {
          href,
          type: 'text/css',
          rel: 'stylesheet',
        },
      });

      const onError = (e: any): void => {
        link.removeEventListener('load', onLoad);
        this.withDrawLoadedStyle({ url: href });
        reject(e);
      };

      const onLoad = (e: any): void => {
        link.removeEventListener('error', onError);
        promisedCallbackLauncher();
        resolve(e);
      };

      link.addEventListener('load', onLoad, { once: true });
      link.addEventListener('error', onError, { once: true });
      document.head.append(link);
    });

  addHeaderScript = async ({
    urls,
    promisedCallback,
  }: {
    urls: Array<string>;
    promisedCallback: () => any;
  }): Promise<boolean> => {
    let inError = false;
    const uniq = [...new Set(urls)],
      promises: Array<any> = [];

    let promiseIndex = 0;
    const promisedCallbackLauncher = (): void => {
      promiseIndex++;
      if (promiseIndex >= uniq.length) {
        promisedCallback();
      }
    };

    uniq.forEach((url) => {
      if (url.endsWith('.js')) {
        if (!this._loadedScript?.includes(url)) {
          this.addLoadedScript({ url });
          promises.push(Promise.resolve(this.loadScript({ src: url, promisedCallbackLauncher })));
        }
      } else if (url.endsWith('.css')) {
        if (!this._loadedCss?.includes(url)) {
          this.addLoadedStyle({ url });
          promises.push(Promise.resolve(this.loadStyle({ href: url, promisedCallbackLauncher })));
        }
      } else {
        logger(`Unable to load script ${url}.`, {
          method: 'error',
          forceLog: true,
        });
      }
    });

    await Promise.all(promises).catch((err) => {
      logger('Unable to promise all load scripts.', {
        method: 'error',
        forceLog: true,
        objectToLog: err,
      });
      inError = true;
    });
    return inError;
  };
}

export default ScriptLoader.getSingleton();
