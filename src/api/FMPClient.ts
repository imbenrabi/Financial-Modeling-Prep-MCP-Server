import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";

interface FMPErrorResponse {
  "Error Message"?: string;
  message?: string;
  [key: string]: unknown;
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

  // Get the API key from the instance or the environment
  private getApiKey(): string {
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
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const apiKey = this.getApiKey();

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

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
    params: Record<string, any> = {}
  ): Promise<string> {
    try {
      const apiKey = this.getApiKey();

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
        responseType: 'text', // Important: get response as text for CSV
      };

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
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const apiKey = this.getApiKey();

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

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
