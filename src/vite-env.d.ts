/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
}

declare module 'virtual:site-qr' {
  /** QR code (SVG data URI) pointing at the site URL, generated at build time. */
  export const qrSvgDataUri: string;
  export const qrUrl: string;
}
