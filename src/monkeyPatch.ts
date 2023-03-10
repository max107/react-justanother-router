// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
import { eventPushState, eventReplaceState } from "./historyEvents";

if (typeof window !== "undefined" && typeof window.history !== "undefined") {
  for (const type of [eventPushState, eventReplaceState]) {
    // @ts-ignore
    const original = window.history[type];

    // @ts-ignore
    window.history[type] = function () {
      const result = original.apply(this, arguments);
      dispatchEvent(new Event(type));
      return result;
    };
  }
}
