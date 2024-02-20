/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
