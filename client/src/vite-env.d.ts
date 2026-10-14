/// <reference types="vite/client" />

interface ImportMetaEnv {
  // public api url - never put secrets in VITE_ vars, they end up in the bundle
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
