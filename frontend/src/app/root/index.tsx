import { LoadingScreen, Layout, useOdeClient } from "@edifice-ui/react";

import Tiptap from "~/components/Tiptap";

function Root() {
  const { init } = useOdeClient();

  if (!init) return <LoadingScreen position={false} />;

  return init ? (
    <Layout>
      <Tiptap />
    </Layout>
  ) : null;
}

export default Root;
