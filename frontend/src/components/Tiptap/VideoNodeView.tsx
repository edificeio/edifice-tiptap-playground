import { Video } from "@edifice-tiptap-extensions/extension-video";
import { ReactNodeViewRenderer } from "@tiptap/react";

const VideoResize = (Component: any) =>
  Video.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default VideoResize;
export { VideoResize };
