import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { orderStatusApi } from '../services/orderStatus';

export const store = configureStore({
  reducer: {
    [orderStatusApi.reducerPath]: orderStatusApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderStatusApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
