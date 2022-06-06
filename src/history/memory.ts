import { Action, History, Listener, Location, PartialLocation, State, To } from "./types";
import { clamp, createEvents, createHref, getNextLocation, parsePath, warning } from "./utils";

/**
 * A memory history stores locations in memory. This is useful in stateful
 * environments where there is no web browser, such as node tests or React
 * Native.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#memoryhistory
 */
export interface MemoryHistory<S extends State = State> extends History<S> {
  index: number;
}

/**
 * A user-supplied object that describes a location. Used when providing
 * entries to `createMemoryHistory` via its `initialEntries` option.
 */
export type InitialEntry = string | PartialLocation;

export type MemoryHistoryOptions = {
  initialEntries?: InitialEntry[];
  initialIndex?: number;
};

/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#creatememoryhistory
 */
export const createMemoryHistory = (options: MemoryHistoryOptions = {}): MemoryHistory => {
  const { initialEntries = ['/'], initialIndex } = options;
  const entries: Location[] = initialEntries.map(entry => {
    const location = {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      ...(typeof entry === 'string' ? parsePath(entry) : entry),
    };

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${JSON.stringify(
        entry
      )})`
    );

    return location;
  });
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  let action = Action.Pop;
  let location = entries[index];
  const listeners = createEvents<Listener>();


  function applyTx(nextAction: Action, nextLocation: Location) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to: To, state?: State) {
    const nextAction = Action.Push;
    const nextLocation = getNextLocation(location, to, state);

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.push(${JSON.stringify(
        to
      )})`
    );

    index += 1;
    entries.splice(index, entries.length, nextLocation);
    applyTx(nextAction, nextLocation);
  }

  function replace(to: To, state?: State) {
    const nextAction = Action.Replace;
    const nextLocation = getNextLocation(location, to, state);

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.replace(${JSON.stringify(
        to
      )})`
    );

    entries[index] = nextLocation;
    applyTx(nextAction, nextLocation);
  }

  function go(delta: number) {
    const nextIndex = clamp(index + delta, 0, entries.length - 1);
    const nextAction = Action.Pop;
    const nextLocation = entries[nextIndex];

    index = nextIndex;
    applyTx(nextAction, nextLocation);
  }

  return {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
  } as MemoryHistory;
};
