import { PartialPath } from "./history";
import { Reducer } from 'react';

export type HistoryReducerState = {
  location: PartialPath
}

export type HistoryAction = {
  location: PartialPath
}

export type HistoryReducer = Reducer<HistoryReducerState, HistoryAction>;

export const historyReducer: HistoryReducer = (state, { location }) => ({ location });
