import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  CancelTokenSource,
} from "axios";

import { store } from "@/redux/Store";

export const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const REQUEST_CONTENT_TYPE = {
  JSON: "application/json",
  MULTIPART: "multipart/form-data",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
};

const axiosInstance: AxiosInstance = axios.create();

export const apiBaseUrl = import.meta.env.VITE_API_KEY;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  contentType?: string;
  showToast?: boolean;
  usertoken?: string;
  res?: any;
  getCancellationId?: string;
  onProgress?: (progressEvent: any) => void;
}

// Function to generate cURL command
const generateCurlCommand = (config: AxiosRequestConfig): string => {
  const method = config.method?.toUpperCase() ?? "GET";
  const url = config.url ?? "";
  const headers = config.headers || {};
  const data = config.data || "";

  let curlCommand = `curl -X ${method} '${url}'`;

  // Add headers to cURL command
  Object.keys(headers).forEach((key) => {
    curlCommand += ` -H '${key}: ${headers[key]}'`;
  });

  // Add body if the method is not GET or DELETE
  if (method !== "GET" && method !== "DELETE" && data) {
    curlCommand += ` -d '${JSON.stringify(data)}'`;
  }

  return curlCommand;
};

const cancelTokenSources: Record<string, CancelTokenSource> = {};

export const doFetch = async (
  apiURL: string,
  method: string = REQUEST_METHODS.GET,
  body: any = {},
  otherOptions?: CustomAxiosRequestConfig,
) => {
  const baseURL = apiBaseUrl;

  // Create cancel token if cancellation ID is provided
  if (otherOptions?.getCancellationId) {
    // Cancel previous request with same ID if exists
    if (cancelTokenSources[otherOptions.getCancellationId]) {
      cancelTokenSources[otherOptions.getCancellationId].cancel(
        "Request cancelled due to new request",
      );
    }
    // Create new cancel token
    cancelTokenSources[otherOptions.getCancellationId] =
      axios.CancelToken.source();
  }

  const headers: Record<string, string | boolean> = {
    // 'Content-Type': 'multipart/form-data',
    Accept: "application/json",
    Authorization: "Authorization",
  };

  const token = store.getState().auth.token;

  // console.log('token====', token);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (otherOptions?.usertoken) {
    headers.usertoken = otherOptions.usertoken;
  }

  if (otherOptions?.showToast !== undefined) {
    headers.showToast = otherOptions?.showToast;
  }

  if (otherOptions?.getCancellationId) {
    headers.getCancellationId = otherOptions?.getCancellationId;
  }

  if (
    otherOptions?.contentType &&
    (method === REQUEST_METHODS.POST || method === REQUEST_METHODS.PUT)
  ) {
    headers["Content-Type"] = otherOptions?.contentType;
  }

  const config: AxiosRequestConfig = {
    headers,
    // Add cancel token to config if available
    cancelToken: otherOptions?.getCancellationId
      ? cancelTokenSources[otherOptions.getCancellationId].token
      : undefined,
    // Add onUploadProgress handler if provided
    onUploadProgress: otherOptions?.onProgress,
  };

  let axiosInstanceResponse: AxiosResponse;

  try {
    if (method === REQUEST_METHODS.GET || method === REQUEST_METHODS.DELETE) {
      axiosInstanceResponse = await axiosInstance[
        method.toLowerCase() as "get" | "delete"
      ](`${baseURL}${apiURL}`, config);
    } else if (
      method === REQUEST_METHODS.POST ||
      method === REQUEST_METHODS.PUT
    ) {
      console.log("%c Request Body:", "color:cyan; font-weight:bold;", body);
      axiosInstanceResponse = await axiosInstance[
        method.toLowerCase() as "post" | "put"
      ](`${baseURL}${apiURL}`, body, config);
    } else {
      throw new Error(
        `${method} is not supported. Check fetcher.ts configuration.`,
      );
    }

    // Clean up cancel token after successful request
    if (otherOptions?.getCancellationId) {
      delete cancelTokenSources[otherOptions.getCancellationId];
    }

    return axiosInstanceResponse;
  } catch (error) {
    // Clean up cancel token on error
    if (otherOptions?.getCancellationId) {
      delete cancelTokenSources[otherOptions.getCancellationId];
    }
    throw error;
  }
};

// Setting up interceptors
let startTime: number;

// Updated logging and cURL generation in response interceptor
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    startTime = Date.now();
    const method = requestConfig?.method?.toUpperCase() ?? "UNKNOWN METHOD";

    console.groupCollapsed(
      `%c [REQUEST] ${method} ${requestConfig.url}`,
      "color:blue; font-weight:bold;",
    );
    console.log("%c Request Details:", "color:blue; font-weight:bold;", {
      Method: method,
      URL: requestConfig.url,
      Headers: requestConfig.headers,
      Data: requestConfig.data,
    });
    console.log(
      "%c Timestamp:",
      "color:gray; font-weight:bold;",
      new Date().toLocaleString(),
    );
    console.groupEnd();

    return requestConfig;
  },
  (error) => {
    console.error("%c [REQUEST ERROR]:", "color:red; font-weight:bold;", error);

    return Promise.reject(error instanceof Error ? error : new Error(error));
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response?.config?.method?.toUpperCase() ?? "UNKNOWN METHOD";
    const curlCommand = generateCurlCommand(response.config);

    const duration = Date.now() - startTime;

    console.groupCollapsed(
      `%c [RESPONSE] ${method} ${response.config.url} - ${duration}ms`,
      "color:green; font-weight:bold;",
    );
    console.log("%c Response Details:", "color:green; font-weight:bold;", {
      Status: response.status,
      Data: response.data,
      Headers: response.headers,
    });
    console.log(
      "%c cURL Command:",
      "color:orange; font-weight:bold;",
      curlCommand,
    );
    console.groupEnd();

    return response;
  },
  async (error: AxiosError) => {
    const method =
      error.response?.config?.method?.toUpperCase() ?? "UNKNOWN METHOD";
    const url = error.response?.config?.url ?? "UNKNOWN URL";
    const curlCommand = generateCurlCommand(error.response?.config || {});

    console.groupCollapsed(
      `%c [ERROR] ${method} ${url}`,
      "color:red; font-weight:bold;",
    );
    console.log(
      "%c cURL Command:",
      "color:orange; font-weight:bold;",
      curlCommand,
    );
    console.log("%c Error Details:", "color:red; font-weight:bold;", {
      Status: error.response?.status,
      Data: error.response?.data || error.message,
    });
    console.groupEnd();
    // Log the URL that caused the error
    console.log("Error occurred for API:", error?.config?.url);

    console.log("Error occurred for API:", error?.response?.status);

    // Handle error cases
    if (error?.response?.status === 401) {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ??
        "Unauthorized";

      // Toaster({
      //   message: errorMessage,
      //   type: "danger",
      // });
      console.log("Error Message:", errorMessage);
      throw error;
    } else if (
      [429, 410, 409, 400, 500, 403].includes(error?.response?.status || 0)
    ) {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ??
        "Unauthorized";

      // Toaster({
      //   message: errorMessage,
      //   type: "danger",
      // });
      console.log("Error Message:", errorMessage);
    } else if (error?.response?.status === 404) {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ??
        "Unauthorized";

      // Toaster({
      //   message: errorMessage,
      //   type: "danger",
      // });
      console.log("Error Message:", errorMessage);
    }

    // Check if a toast should be shown or not
    if (
      typeof error?.config?.headers?.showToast === "boolean" &&
      !error?.config?.headers?.showToast
    ) {
      throw error;
    }

    if (error.message === "Network Error") {
      // Toaster({
      //   message: "Network Error",
      //   type: "danger",
      // });
      console.log("Error Message:", "Network Error");
    } else if (error.response?.status === 429) {
      // Toaster({
      //   message: "Request limit exceeded",
      //   type: "danger",
      // });
      console.log("Error Message:", "Request limit exceeded");
      // Handle errors based on status codes
      if (error?.response?.status >= 400 && error?.config?.method !== "get") {
        //@ts-ignore

        if (typeof error?.response?.data.message === "string") {
          // Toaster({
          //   //@ts-ignore
          //   message: error?.response?.data.message,
          //   type: "danger",
          // });
          console.log("Error Message:", error?.response?.data?.message);
        } else if (typeof error?.response?.data === "string") {
          // Toaster({
          //   message: error?.response?.data,
          //   type: "danger",
          // });
          console.log("Error Message:", error?.response?.data);
          //@ts-ignore
        } else if (typeof error?.response?.data?.response === "string") {
          // Toaster({
          //   //@ts-ignore

          //   message: error?.response?.data?.response,
          //   type: "danger",
          // });
          console.log("Error Message:", error?.response?.data);
        } else if (error?.response?.status === 429) {
          // Toaster({
          //   message: "Request limit is exceeded",
          //   type: "danger",
          // });
          console.log("Error Message:", "Request limit is exceeded");
        } else {
          // Toaster({
          //   message: "Server error",
          //   type: "danger",
          // });
          console.log("Error Message:", "Server error");
        }
      }
    }

    return Promise.reject(error);
  },
);

// Add this utility function to manually cancel requests
export const cancelRequest = (cancellationId: string) => {
  if (cancelTokenSources[cancellationId]) {
    cancelTokenSources[cancellationId].cancel("Request cancelled manually");
    delete cancelTokenSources[cancellationId];
  }
};
