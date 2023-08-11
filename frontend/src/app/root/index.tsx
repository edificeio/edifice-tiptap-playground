import {
  LoadingScreen,
  Layout,
  useOdeClient,
  AppHeader,
  Breadcrumb,
  Grid,
  Image,
} from "@edifice-ui/react";

import Tiptap from "~/components/Tiptap/Tiptap";

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
          <Image
            ratio="1"
            alt="mon image"
            src="https://images.unsplash.com/photo-1668539445692-cd5d790c8352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          />
        </Grid.Col>
        <Grid.Col sm="4" md="8" lg="6" xl="9" className="py-16">
          <Tiptap />
        </Grid.Col>
      </Grid>
    </Layout>
  ) : null;
}

export default Root;
