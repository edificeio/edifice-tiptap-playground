import React, { StrictMode } from "react";

import { ThemeProvider } from "@edifice-ui/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools/build/lib/devtools";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./i18n";
import "edifice-bootstrap/dist/index.css";
import { router } from "./routes";
import { AppProvider } from "./services/provider/AppProvider";
import { OdeClientProvider } from "./services/provider/OdeClientProvider";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  import("@axe-core/react").then((axe) => {
    axe.default(React, root, 1000);
  });
}

/* if (process.env.NODE_ENV !== "production") {
  import("edifice-bootstrap/dist/index.css");
} */

/*
Tous les providers servent à fournir un service dans un contexte donné.
Faire de la DI serait donc l'idéal (=> Inversion of Control).

Par exemple aujourd'hui, on a créé une dépendance forte de OdeClientProvider
sur le cache react-query QueryClientProvider, en typant ainsi :
  confQuery: UseQueryResult<IGetConf>;
Il faudait abstraire cela, car on pourrait vouloir utiliser OdeClientProvider sans React-Query !


// TODO give a try to :
- ditox  https://github.com/mnasyrov/ditox
- awilix https://github.com/jeffijoe/awilix#usage
*/

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error === "0090") window.location.replace("/auth/login");
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

<StrictMode>
  <AppProvider params={{ app: "blog" }}>
    <QueryClientProvider client={queryClient}>
      <OdeClientProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </OdeClientProvider>
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  </AppProvider>
</StrictMode>;
