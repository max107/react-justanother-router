import { Context, createContext } from "react";
import { RouterEngineInterface } from "./routing";
import { History } from './history';

export const HistoryContext: Context<History> = createContext<History>({} as any);
export const RouterContext: Context<RouterEngineInterface> = createContext<RouterEngineInterface>({} as any);
