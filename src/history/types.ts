/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location
 */
export interface Location<S extends State = State> extends Path {
  /**
   * An object of arbitrary data associated with this location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.state
   */
  state: S;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: Key;
}

/**
 * A partial Location object that may be missing some properties.
 */
export interface PartialLocation<S extends State = State> extends PartialPath {
  /**
   * An object of arbitrary data associated with this location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.state
   */
  state?: S;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key?: Key;
}

/**
 * A change to the current location.
 */
export interface Update<S extends State = State> {
  /**
   * The action that triggered the change.
   */
  action: Action;

  /**
   * The new location.
   */
  location: Location<S>;
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener<S extends State = State> {
  (update: Update<S>): void;
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | PartialPath;

/**
 * A history is an interface to the navigation stack. The history serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface History<S extends State = State> {
  /**
   * The last action that modified the current location. This will always be
   * Action.Pop when a history instance is first created. This value is mutable.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.action
   */
  readonly action: Action;

  /**
   * The current location. This value is mutable.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.location
   */
  readonly location: Location<S>;

  /**
   * Returns a valid href for the given `to` value that may be used as
   * the value of an <a href> attribute.
   *
   * @param to - The destination URL
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.createHref
   */
  createHref(to: To): string;

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are
   * lost.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.push
   */
  push(to: To, state?: S): void;

  /**
   * Replaces the current location in the history stack with a new one.  The
   * location that was replaced will no longer be available.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.replace
   */
  replace(to: To, state?: S): void;

  /**
   * Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * @param delta - The delta in the stack index
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.go
   */
  go(delta: number): void;

  /**
   * Navigates to the previous entry in the stack. Identical to go(-1).
   *
   * Warning: if the current location is the first location in the stack, this
   * will unload the current document.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.back
   */
  back(): void;

  /**
   * Navigates to the next entry in the stack. Identical to go(1).
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.forward
   */
  forward(): void;

  /**
   * Sets up a listener that will be called whenever the current location
   * changes.
   *
   * @param listener - A function that will be called when the location changes
   * @returns unlisten - A function that may be used to stop listening
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.listen
   */
  listen(listener: Listener<S>): () => void;
}

/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#action
 */
export enum Action {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Pop = 'POP',

  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Push = 'PUSH',

  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Replace = 'REPLACE'
}

/**
 * An object that is used to associate some arbitrary data with a location, but
 * that does not appear in the URL path.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.state
 */
export type State = object | null;

/**
 * A unique string associated with a location. May be used to safely store
 * and retrieve data in some other storage API, like `localStorage`.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
 */
export type Key = string;

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.pathname
   */
  pathname: Pathname;

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.search
   */
  search: Search;

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.hash
   */
  hash: Hash;
}

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.pathname
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.search
 */
export type Search = string;

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.hash
 */
export type Hash = string;

/**
 * A partial Path object that may be missing some properties.
 */
export interface PartialPath {
  /**
   * The URL pathname, beginning with a /.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.pathname
   */
  pathname?: Pathname;

  /**
   * The URL search string, beginning with a ?.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.search
   */
  search?: Search;

  /**
   * The URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.hash
   */
  hash?: Hash;
}
