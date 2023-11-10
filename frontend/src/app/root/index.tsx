import {
  LoadingScreen,
  Layout,
  useOdeClient,
  AppHeader,
  Breadcrumb,
  Grid,
  Image,
} from "@edifice-ui/react";
import { Outlet } from "react-router-dom";

import edifice from "../../assets/edifice.png";
import BlogNavigator from "~/components/ent/BlogNavigator";

function Root() {
  const { init } = useOdeClient();

  if (!init) return <LoadingScreen position={false} />;

  return init ? (
    <Layout>
      <AppHeader>
        <Breadcrumb
          app={{
            address: "/blog",
            icon: "",
            name: "",
            scope: [],
            display: false,
            displayName: "Blog",
            isExternal: false,
          }}
        />
      </AppHeader>
      <Grid className="flex-grow-1">
        <Grid.Col
          sm="3"
          lg="2"
          xl="3"
          className="border-end pt-16 pe-16 d-none d-lg-block"
          as="aside"
        >
          <Image ratio="1" alt="mon image" src={edifice} objectFit="contain" />
          <BlogNavigator />
        </Grid.Col>
        <Grid.Col sm="4" md="8" lg="6" xl="9" className="py-16">
          <Outlet />
        </Grid.Col>
      </Grid>
    </Layout>
  ) : null;
}

export default Root;
