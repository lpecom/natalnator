export interface ThemeSettings {
  colors?: {
    primary: string;
    success: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts?: {
    primary: string;
  };
  logo?: {
    url: string;
  };
}

// This type ensures compatibility with Supabase's Json type
export type ThemeSettingsJson = {
  [K in keyof ThemeSettings]: ThemeSettings[K];
}