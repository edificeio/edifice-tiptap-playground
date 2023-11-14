import {
  LoadingScreen,
  Layout,
  useOdeClient,
  AppHeader,
  Breadcrumb,
  Grid,
  Image,
} from "@edifice-ui/react";
// import { Outlet } from "react-router-dom";

import edifice from "../../assets/edifice.png";
import BlogNavigator from "~/components/BlogNavigator";
import Dropzone from "~/features/Drop";
import { DropzoneProvider } from "~/features/DropContext";
import Files from "~/features/Files";
import FileUploader from "~/features/FileUploader";
// import FileUploader from "~/features/FileUploader";

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
          {/* <Outlet /> */}
          <FileUploader />
          {/* <DropzoneProvider>
            <div>
              <Dropzone />
              <Files />
            </div>
          </DropzoneProvider> */}
        </Grid.Col>
      </Grid>
    </Layout>
  ) : null;
}

export default Root;
