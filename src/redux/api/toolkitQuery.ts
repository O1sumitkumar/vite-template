import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { authRoute } from "@/services/auth/auth.route";

export const tagsApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;

      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    getUser: builder.query<any, { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 }) =>
        `${authRoute.User}?page=${page}&limit=${size}`,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        if (newItems?.data?.[0]?.page === 1) {
          return newItems;
        }

        currentCache.data[0].tags.push(...(newItems?.data?.[0]?.tags || []));
        currentCache.data[0].total_pages = newItems?.data?.[0]?.total_pages;
        currentCache.data[0].total_tags = newItems?.data?.[0]?.total_tags;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Tags"],
    }),

    addUser: builder.mutation<Tag, Partial<Tag>>({
      query: (tag) => ({
        url: authRoute.User,
        method: "POST",
        body: tag,
      }),
      async onQueryStarted(newTag, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getUser",
            { page: 1, size: 10 },
            (draft) => {
              draft.push({ ...newTag, id: `temp-${Date.now()}` } as Tag);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Add tag failed:", error);
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tags"],
    }),

    updateUser: builder.mutation<Tag, { id: string; updates: Partial<Tag> }>({
      query: ({ id, updates }) => ({
        url: `${authRoute.User}/${id}`,
        method: "PATCH",
        body: updates,
      }),
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getUser",
            { page: 1, size: 10 },
            (draft) => {
              const tag = draft.find((t) => t.id === id);

              if (tag) {
                Object.assign(tag, updates);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Update tag failed:", error);
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tags"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${authRoute.User}/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getUser",
            { page: 1, size: 10 },
            (draft) => {
              const index = draft.findIndex((t) => t.id === id);

              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Delete tag failed:", error);
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = tagsApi;
