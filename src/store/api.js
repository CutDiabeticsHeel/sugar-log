import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
    }),

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
        }),

        getSugarLog: builder.query({
            query: () => "/sugar-log",
        }),

        getUserInfo: builder.query({
            query: () => "/user-info",
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetSugarLogQuery,
    useGetUserInfoQuery,
} = api;