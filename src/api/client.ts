import axios from 'axios';
import { setupInterceptors } from './interceptors';

// ── 일반 API 인스턴스 (timeout: 10s) ──
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors(client);

export default client;
