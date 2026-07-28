import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),
    tagTypes: ["SugarLog"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
        }),

        getAllSugarLog: builder.query({
            query: () => "/all-sugar-log",
            providesTags: ["SugarLog"],
        }),

        getTodaySugarLog: builder.query({
            query: () => "/today-sugar-log",
            providesTags: ["SugarLog"],
        }),

        getDayPeriodSugarLog: builder.query({
            query: ({ from, to }) => ({
                url: "/day-period-sugar-log",
                params: { from, to },
            }),
            providesTags: ["SugarLog"],
        }),

        getOnlySugar: builder.query({
            query: () => "/data-for-metrics",
        }),

        getUserInfo: builder.query({
            query: () => "/user-info",
        }),

        getUserQuestions: builder.query({
            query: () => "/user-questions",
        }),

        getEndocrinologistInfo: builder.query({
            query: () => "/endocrinologist",
        }),

        addSugarRecord: builder.mutation({
            query: (data) => ({
                url: "/addSugar",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SugarLog"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetAllSugarLogQuery,
    useGetTodaySugarLogQuery,
    useGetDayPeriodSugarLogQuery,
    useGetOnlySugarQuery,
    useGetUserInfoQuery,
    useGetUserQuestionsQuery,
    useGetEndocrinologistInfoQuery,
    useAddSugarRecordMutation 
} = api;