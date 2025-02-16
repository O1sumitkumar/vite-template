import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Business_Endpoint } from "@api/business/BusinessEndPoints";
import { oneTapDevAPIBaseURL } from "@api/fetcher";
import { Tag } from "@interface/tags.interface";

export const tagsApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: oneTapDevAPIBaseURL.endsWith("/")
      ? oneTapDevAPIBaseURL
      : `${oneTapDevAPIBaseURL}/`,
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
    getTags: builder.query<any, { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 }) =>
        `${Business_Endpoint.FETCH_TAGS_LIST}?page=${page}&limit=${size}`,
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

    addTag: builder.mutation<Tag, Partial<Tag>>({
      query: (tag) => ({
        url: "tags",
        method: "POST",
        body: tag,
      }),
      async onQueryStarted(newTag, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getTags",
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

    updateTag: builder.mutation<Tag, { id: string; updates: Partial<Tag> }>({
      query: ({ id, updates }) => ({
        url: `tags/${id}`,
        method: "PATCH",
        body: updates,
      }),
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getTags",
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

    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `tags/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData(
            "getTags",
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
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
