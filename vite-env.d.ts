/// <reference types="vite/client" />

type ViteTypeOptions = {};

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITEKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
