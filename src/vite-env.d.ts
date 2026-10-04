/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the real Mesh-AI service. Leave unset to use the built-in sample data. */
  readonly VITE_API_URL?: string;
}
