import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";

interface FMPErrorResponse {
  "Error Message"?: string;
  message?: string;
  [key: string]: any;
}

export class FMPClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string = "https://financialmodelingprep.com/stable";
  private readonly client: AxiosInstance;

  private static getErrorMessage(axiosError: AxiosError<FMPErrorResponse>): string {
    return (
      axiosError.response?.data?.["Error Message"] ??
      axiosError.response?.data?.message ??
      axiosError.message
    );
  }

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
    });
  }

  // Get the API key from the context or the instance
  private getApiKey(context?: {
    config?: { FMP_ACCESS_TOKEN?: string };
  }): string {
    const configApiKey = context?.config?.FMP_ACCESS_TOKEN;

    if (configApiKey) {
      return configApiKey;
    }

    // Fall back to constructor parameter or environment variable
    const apiKey = this.apiKey || process.env.FMP_ACCESS_TOKEN;

    if (!apiKey) {
      throw new Error(
        "FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration."
      );
    }

    return apiKey;
  }

  protected async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    try {
      // Try to get API key from context first, fall back to instance API key
      const apiKey = this.getApiKey(options?.context);

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

      if (options?.signal) {
        config.signal = options.signal;
      }

      const response = await this.client.get<T>(endpoint, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FMPErrorResponse>;
        throw new Error(
          `FMP API Error: ${FMPClient.getErrorMessage(axiosError)}`, { cause: error }
        );
      }
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`, { cause: error }
      );
    }
  }

  protected async getCSV(
    endpoint: string,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<string> {
    try {
      // Try to get API key from context first, fall back to instance API key
      const apiKey = this.getApiKey(options?.context);

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
        responseType: 'text', // Important: get response as text for CSV
      };

      if (options?.signal) {
        config.signal = options.signal;
      }

      const response = await this.client.get<string>(endpoint, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FMPErrorResponse>;
        throw new Error(
          `FMP API Error: ${FMPClient.getErrorMessage(axiosError)}`, { cause: error }
        );
      }
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`, { cause: error }
      );
    }
  }

  protected async post<T>(
    endpoint: string,
    data: any,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    try {
      // Try to get API key from context first, fall back to instance API key
      const apiKey = this.getApiKey(options?.context);

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

      if (options?.signal) {
        config.signal = options.signal;
      }

      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FMPErrorResponse>;
        throw new Error(
          `FMP API Error: ${FMPClient.getErrorMessage(axiosError)}`, { cause: error }
        );
      }
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`, { cause: error }
      );
    }
  }
}
