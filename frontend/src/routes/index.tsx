import { createBrowserRouter } from "react-router-dom";

import Root from "~/app/root";
import OldFormat, { loader } from "~/components/Tiptap/OldFormat";
import Tiptap from "~/components/Tiptap/Tiptap";

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Tiptap />,
      },
    ],
  },
  {
    path: "/oldformat/:source",
    element: <OldFormat />,
    loader,
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.PROD ? "/tiptap" : "/",
});
