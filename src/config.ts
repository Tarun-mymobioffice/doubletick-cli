import Conf from 'conf';

interface ConfigSchema {
  secretKey: string;
  baseUrl: string;
}

const DEFAULT_BASE_URL = 'https://prod-api.task-management.mobioffice.io';

export const config = new Conf<ConfigSchema>({
  projectName: 'dt-cli',
  schema: {
    secretKey: { type: 'string', default: '' },
    baseUrl: { type: 'string', default: DEFAULT_BASE_URL },
  },
});

export function getSecretKey(): string {
  return config.get('secretKey');
}

export function setSecretKey(key: string): void {
  config.set('secretKey', key);
}

export function getBaseUrl(): string {
  return config.get('baseUrl') || DEFAULT_BASE_URL;
}

export function setBaseUrl(url: string): void {
  config.set('baseUrl', url);
}

export { DEFAULT_BASE_URL };
