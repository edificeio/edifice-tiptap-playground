import {
  type ReactNode,
  useMemo,
  useContext,
  useEffect,
  useState,
} from "react";

import { App } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { AppContext, SupportedLanguage } from "../context/AppContext";

export interface AppProviderParams {
  /** Current application code, hard-coded in index.html file. */
  app: App;
  /** Truthy when the application manages resources from other applications. */
  alternativeApp?: boolean;
  /** CDN-related information. */
  cdnDomain?: string | null;
  /** Deployment-related information. */
  version?: string | null;
}

export interface AppProviderProps {
  /** React children of this provider. */
  children: ReactNode;
  /** Provider parameters, required by AppProvider. */
  params: AppProviderParams;
}

export function AppProvider({ children, params }: AppProviderProps) {
  const [currentLanguage, changeLanguage] = useState<SupportedLanguage>(
    (document
      .querySelector("html")
      ?.getAttribute("lang") as SupportedLanguage) ?? "fr",
  );
  const { t } = useTranslation();

  const values = useMemo(
    () => ({
      appCode: params.app,
      appLabel: t(params.app),
      alternativeApp: params.alternativeApp,
      currentLanguage,
      cdnDomain: params.cdnDomain,
      version: params.version,
      changeLanguage,
    }),
    [params, t, currentLanguage, changeLanguage],
  );

  useEffect(() => {
    document.querySelector("html")?.setAttribute("lang", currentLanguage);
    document.title = `${values.appLabel}`;
  }, [currentLanguage, values.appLabel]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(`Cannot be used outside of AppProvider`);
  }
  return context;
}
