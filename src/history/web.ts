import { Action, History, Listener, Location, State, To } from "./types";
import { createEvents, createHref, getNextLocation } from "./utils";

export type BrowserHistory<S extends State = State> = History<S>

type HistoryState = {
  usr: State;
  key?: string;
  idx: number;
};

const PopStateEventType = 'popstate';

export type BrowserHistoryOptions = { window?: Window };

export const createBrowserHistory = (options: BrowserHistoryOptions = {}): BrowserHistory => {
  const {
    window = document.defaultView!
  } = options;

  const globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    const { pathname, search, hash } = window.location;
    const state = globalHistory.state || {};
    return [
      state.idx,
      {
        pathname,
        search,
        hash,
        state: state.usr || null,
      },
    ];
  }

  function handlePop() {
    const nextAction = Action.Pop;

    applyTx(nextAction);
  }

  window.addEventListener(PopStateEventType, handlePop);

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  const listeners = createEvents<Listener>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function getHistoryStateAndUrl(nextLocation: Location, index: number): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: To, state?: State) {
    const nextAction = Action.Push;
    const nextLocation = getNextLocation(location, to, state);

    const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

    // TODO: Support forced reloading
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, '', url);
    } catch (error) {
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }

    applyTx(nextAction);
  }

  function replace(to: To, state?: State) {
    const nextAction = Action.Replace;
    const nextLocation = getNextLocation(location, to, state);

    const [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

    // TODO: Support forced reloading
    globalHistory.replaceState(historyState, '', url);

    applyTx(nextAction);
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  return {
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
  };
};
