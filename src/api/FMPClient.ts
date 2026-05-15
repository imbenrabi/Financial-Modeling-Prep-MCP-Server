import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";

interface FMPErrorResponse {
  message: string;
  [key: string]: unknown;
}

interface RequestOptions {
  signal?: AbortSignal;
  context?: { config?: { FMP_ACCESS_TOKEN?: string } };
}

export class FMPClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string = "https://financialmodelingprep.com/stable";
  private readonly client: AxiosInstance;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
    });
  }

  // Get the API key from the context or the instance
  private getApiKey(context?: RequestOptions["context"]): string {
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

  // Build an axios request config with apikey, signal, and any extra fields merged.
  private buildConfig(
    params: object,
    options: RequestOptions | undefined,
    extra?: Partial<AxiosRequestConfig>
  ): AxiosRequestConfig {
    const apiKey = this.getApiKey(options?.context);
    const config: AxiosRequestConfig = {
      params: {
        ...params,
        apikey: apiKey,
      },
      ...extra,
    };
    if (options?.signal) {
      config.signal = options.signal;
    }
    return config;
  }

  // Normalize axios and unknown errors into a single Error with a stable prefix.
  private toFmpError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<FMPErrorResponse>;
      return new Error(
        `FMP API Error: ${
          axiosError.response?.data?.message || axiosError.message
        }`
      );
    }
    return new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  protected async get<T>(
    endpoint: string,
    params: object = {},
    options?: RequestOptions
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(
        endpoint,
        this.buildConfig(params, options)
      );
      return response.data;
    } catch (error: unknown) {
      throw this.toFmpError(error);
    }
  }

  protected async getCSV(
    endpoint: string,
    params: object = {},
    options?: RequestOptions
  ): Promise<string> {
    try {
      const response = await this.client.get<string>(
        endpoint,
        this.buildConfig(params, options, { responseType: "text" })
      );
      return response.data;
    } catch (error: unknown) {
      throw this.toFmpError(error);
    }
  }

  protected async post<T>(
    endpoint: string,
    data: unknown,
    params: object = {},
    options?: RequestOptions
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(
        endpoint,
        data,
        this.buildConfig(params, options)
      );
      return response.data;
    } catch (error: unknown) {
      throw this.toFmpError(error);
    }
  }
}