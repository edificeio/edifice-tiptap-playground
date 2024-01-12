import { createContext, useMemo, useContext } from "react";

import { useConf, useSession } from "@edifice-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  IUserInfo,
  IUserDescription,
  IWebApp,
  UserProfile,
  IGetConf,
  IGetSession,
} from "edifice-ts-client";

import { useAppContext } from "./AppProvider";

export interface OdeContextProps {
  applications: IWebApp[] | undefined;
  confQuery: UseQueryResult<IGetConf>;
  currentApp: IWebApp | undefined;
  init: boolean;
  sessionQuery: UseQueryResult<IGetSession>;
  user: IUserInfo | any;
  userDescription: IUserDescription | undefined;
  userProfile: UserProfile | undefined;
}

const OdeClientContext = createContext<OdeContextProps | null>(null!);

export function OdeClientProvider({ children }: { children: React.ReactNode }) {
  const { appCode } = useAppContext();

  const sessionQuery = useSession();
  const confQuery = useConf({ appCode });

  const init = confQuery?.isSuccess && sessionQuery?.isSuccess;

  const values = useMemo(
    () => ({
      applications: confQuery?.data?.applications,
      confQuery,
      currentApp: confQuery?.data?.currentApp,
      currentLanguage: sessionQuery?.data?.currentLanguage,
      init,
      sessionQuery,
      user: sessionQuery?.data?.user,
      userDescription: sessionQuery?.data?.userDescription,
      userProfile: sessionQuery?.data?.userProfile,
    }),
    [confQuery, init, sessionQuery],
  );

  return (
    <OdeClientContext.Provider value={values}>
      {children}
    </OdeClientContext.Provider>
  );
}

export function useOdeClient() {
  const context = useContext(OdeClientContext);

  if (!context) {
    throw new Error(`Cannot be used outside of OdeClientProvider`);
  }
  return { context };
}
