import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dishesApi = createApi({
  reducerPath: 'dishesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  endpoints: (builder) => ({
    getAllDishes: builder.query({ // used for generating a customhook
      query: () => 'dish/getalldishes',
    }),
  }),
});

export const { useGetAllDishesQuery } = dishesApi;
