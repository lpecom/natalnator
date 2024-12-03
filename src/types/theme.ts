export interface ThemeSettings {
  colors: {
    primary: string;
    success: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    primary: string;
  };
  logo?: {
    url: string;
  };
}