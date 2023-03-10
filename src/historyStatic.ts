import { HistoryInterface, HistoryLocation, LocationCallback } from "./history";

export class HistoryStatic implements HistoryInterface {
  protected initial: HistoryLocation;

  constructor(initial: HistoryLocation) {
    this.initial = initial;
  }

  get location(): HistoryLocation {
    return this.initial;
  }

  listen(fn: LocationCallback): () => void {
    return () => {}
  }

  navigate(uri: string, replace?: boolean): void {
  }
}

export const createHistoryStatic = (initial: HistoryLocation) => new HistoryStatic(initial);
