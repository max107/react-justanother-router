import { historyEvents } from "./historyEvents";

export type HistoryLocation = {
  pathname?: string;
  search?: string;
  hash?: string;
}

export type LocationCallback = {
  (location: HistoryLocation): void;
}

export interface HistoryInterface {
  listen(fn: LocationCallback): () => void;

  location: HistoryLocation;

  navigate(uri: string, replace?: boolean): void
}

export class History implements HistoryInterface {
  protected prevId: string = '/';
  protected initial?: HistoryLocation;

  constructor(initial?: HistoryLocation) {
    this.initial = initial;
  }

  get location(): HistoryLocation {
    const {
      pathname,
      search,
      hash
    } = window.location;

    return { pathname: pathname || '/', search, hash };
  }

  getId(loc: HistoryLocation): string {
    const {
      pathname,
      search,
      hash
    } = loc;

    return (pathname || '') + (search || '') + (hash || '');
  }

  listen(fn: LocationCallback): () => void {
    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const newLocation = this.location;
      const id = this.getId(newLocation);

      if (this.prevId !== id) {
        this.prevId = id;
        fn(newLocation);
      }
    };

    historyEvents.forEach((e) => addEventListener(e, checkForUpdates));

    // it's possible that an update has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates();

    return () => historyEvents.forEach((e) => removeEventListener(e, checkForUpdates));
  }

  navigate(uri: string, replace?: boolean): void {
    const state = {};
    if (replace) {
      return history.replaceState(state, '', uri);
    } else {
      return history.pushState(state, '', uri);
    }
  }
}

export const createHistory = (initial?: HistoryLocation) => new History(initial);
