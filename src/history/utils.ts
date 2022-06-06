import { Location, PartialPath, State, To } from "./types";

export const clamp = (n: number, lowerBound: number, upperBound: number) => {
  return Math.min(Math.max(n, lowerBound), upperBound);
};

type Events<F> = {
  length: number;
  push: (fn: F) => () => void;
  call: (arg: any) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn: F) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach(fn => fn && fn(arg));
    },
  };
}

/**
 * Creates a string URL path from the given pathname, search, and hash components.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#createpath
 */
export const createPath = ({ pathname = '/', search = '', hash = '' }: PartialPath): string => (
  pathname + search + hash
);

/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#parsepath
 */
export const parsePath = (path: string): PartialPath => {
  const partialPath: PartialPath = {};

  if (path) {
    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      partialPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }

    const searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      partialPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }

    if (path) {
      partialPath.pathname = path;
    }
  }

  return {
    search: '',
    hash: '',
    pathname: '',
    ...partialPath,
  };
};

export const warning = (cond: boolean, message: string) => {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') {
      console.warn(message);
    }

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }
};

export const createHref = (to: To) => typeof to === 'string' ? to : createPath(to);

export const getNextLocation = (location: Location, to: To, state: State = null): Location => ({
  ...location,
  ...(typeof to === 'string' ? parsePath(to) : to),
  state,
});
