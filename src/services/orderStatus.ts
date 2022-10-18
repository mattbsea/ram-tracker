import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderStatusQuery, OrderStatusResult } from './types';

export const orderStatusApi = createApi({
  reducerPath: "orderStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.ramtrucks.com/hostz/cots/order-status",
  }),
  endpoints: (builder) => ({
    getOrderStatus: builder.query<OrderStatusResult, OrderStatusQuery>({
      query: (q) => `${q.von}/${q.name}`,
    }),
  }),
});

export const { useGetOrderStatusQuery } = orderStatusApi;
