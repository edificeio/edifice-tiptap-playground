import { createContext } from "react";

import { App } from "edifice-ts-client";

// TODO à exporter depuis une API backend !
/** Supported languages code */
export type SupportedLanguage = "de" | "en" | "es" | "fr" | "it" | "pt";

export interface AppContextProps {
  /** Current application code. */
  appCode: App;
  /** Current application name (translated for the current language). */
  appLabel: string;
  /** Truthy if this is not the main application. */
  alternativeApp?: boolean;
  /**
   * Current language code, read from index.html file and later from user's session.
   * Defaults to `fr`
   */
  currentLanguage?: string;
  /** CDN-related information. */
  cdnDomain?: string | null;
  /** Deployment-related information. */
  version?: string | null;

  /** Setter of the current language. */
  changeLanguage: (lang: SupportedLanguage) => void;
}

export const AppContext = createContext<AppContextProps | null>(null!);
