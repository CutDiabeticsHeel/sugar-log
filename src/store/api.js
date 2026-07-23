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

        getAllSugarLog: builder.query({
            query: () => "/all-sugar-log",
        }),

        getTodaySugarLog: builder.query({
            query: () => "/today-sugar-log",
        }),

        getDayPeriodSugarLog: builder.query({
            query: ({ from, to }) => ({
                url: "/day-period-sugar-log",
                params: { from, to },
            }),
        }),

        getSugarLogForChart: builder.query({
            query: () => "/sugar-log-for-chart",
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
    }),
});

export const {
    useGetProductsQuery,
    useGetAllSugarLogQuery,
    useGetTodaySugarLogQuery,
    useGetDayPeriodSugarLogQuery,
    useGetSugarLogForChartQuery,
    useGetOnlySugarQuery,
    useGetUserInfoQuery,
    useGetUserQuestionsQuery,
    useGetEndocrinologistInfoQuery
} = api;