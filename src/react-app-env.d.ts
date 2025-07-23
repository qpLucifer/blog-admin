/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_BASE_URL: string;
    readonly REACT_APP_IMAGE_BASE_URL: string;
  }
}
