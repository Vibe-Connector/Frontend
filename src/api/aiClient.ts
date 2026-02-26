import axios from 'axios';
import { setupInterceptors } from './interceptors';

// ── AI 전용 인스턴스 (timeout: 35s) ──
// 백엔드 OpenAiConfig의 Read Timeout(30s) + 네트워크 여유 5s
const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 35_000,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors(aiClient);

export default aiClient;
