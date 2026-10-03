import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cacheGet} from "../offline/db"; 

const API_URL = import.meta.env.VITE_API_URL;
const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });
const FALLBACKS = {
    "/products": [],
    "/all-sugar-log": [],
    "/today-sugar-log": [],
    "/day-period-sugar-log": [],
    "/data-for-metrics": [],
    "/user-info": [],
    "/user-questions": [],
    "/endocrinologist": [],
};

const getUrl = (args) => (typeof args === "string" ? args : args.url);

const isGetRequest = (args) =>
    typeof args === "string" || !args.method || args.method === "GET";

const isNetworkProblem = (error) => {
    const status = error?.status;
    return (
        status === "FETCH_ERROR" ||
        status === "TIMEOUT_ERROR" ||
        status === "PARSING_ERROR" ||
        (typeof status === "number" && status >= 502)
    );
};

const baseQueryWithOffline = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (!isGetRequest(args)) return result;
    if (result.data !== undefined) return result;

    if (isNetworkProblem(result.error)) {
        const url = getUrl(args);
        try {
            const cached = await cacheGet(url);
            if (cached) return { data: cached.data, meta: { fromCache: true } };
        } catch (e) {}

        const fallback = FALLBACKS[url];
        if (fallback !== undefined) {
            return { data: fallback, meta: { stub: true } };
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithOffline,
    tagTypes: ["SugarLog", 'Product'],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
            providesTags: ['Product'],
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

        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/addProduct',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Product'],
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
    useAddSugarRecordMutation,
    useAddProductMutation, 
} = api;