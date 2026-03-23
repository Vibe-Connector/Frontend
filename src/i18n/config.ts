import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

export const LANGUAGE_MAP: Record<number, string> = {
  1: 'ko',
  2: 'en',
  3: 'ja',
  4: 'zh',
};

export const LOCALE_MAP: Record<string, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

// localStorage에서 저장된 언어 설정 복원 (Zustand persist 구조 호환)
function getInitialLanguage(): string {
  try {
    const stored = localStorage.getItem('vibelink-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Zustand v5 persist: { state: { user: { preferredLanguageId } } }
      const langId = parsed?.state?.user?.preferredLanguageId;
      if (langId && LANGUAGE_MAP[langId]) return LANGUAGE_MAP[langId];
      // Zustand v4 호환: { user: { preferredLanguageId } }
      const langId2 = parsed?.user?.preferredLanguageId;
      if (langId2 && LANGUAGE_MAP[langId2]) return LANGUAGE_MAP[langId2];
    }
  } catch { /* 파싱 실패 시 기본값 */ }
  return 'ko';
}

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    zh: { translation: zh },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
