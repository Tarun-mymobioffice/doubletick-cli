import axios, { AxiosInstance, AxiosError } from 'axios';
import chalk from 'chalk';
import { getSecretKey, getBaseUrl } from '../config';

interface ClientOptions {
  key?: string;
  baseUrl?: string;
}

export function createClient(opts: ClientOptions = {}): AxiosInstance {
  const secretKey = opts.key || getSecretKey();
  const baseURL = opts.baseUrl || getBaseUrl();

  if (!secretKey) {
    console.error(chalk.red('Error: No secret key configured. Run `dt auth set` first.'));
    process.exit(1);
  }

  const instance = axios.create({
    baseURL,
    headers: {
      'secret-key': secretKey,
      'Content-Type': 'application/json',
    },
  });

  return instance;
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; Message?: string }>;
    const status = axiosErr.response?.status ?? 'N/A';
    const data = axiosErr.response?.data;
    const message =
      (data && (data.message || data.Message)) ||
      axiosErr.message ||
      'Unknown error';
    console.error(chalk.red(`API Error [${status}]: ${message}`));
  } else if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`));
  } else {
    console.error(chalk.red('An unexpected error occurred.'));
  }
  process.exit(1);
}
