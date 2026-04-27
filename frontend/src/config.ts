type HostConfig = {
  apiBaseUrl: string;
};

const hostConfigs: Record<string, HostConfig> = {
  localhost: { apiBaseUrl: 'http://localhost:8000/api' },
  '127.0.0.1': { apiBaseUrl: 'http://127.0.0.1:8000/api' },
  '162.8.9.12': { apiBaseUrl: 'http://162.8.9.12:8000/api' },
};

const currentHost = window.location.hostname;
const defaultApiBaseUrl = `${window.location.protocol}//${currentHost}:8000/api`;

export const appConfig: HostConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || hostConfigs[currentHost]?.apiBaseUrl || defaultApiBaseUrl,
};

export const API_BASE = appConfig.apiBaseUrl;
