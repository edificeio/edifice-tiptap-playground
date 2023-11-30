/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from "react";

import { Video } from "@edifice-tiptap-extensions/extension-video";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import { useResizeMedia } from "~/hooks/useResizeMedia";

export const VideoResize = (Component: any) =>
  Video.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export const WrapperResizeVideo = (props: any) => {
  const { node } = props;

  const resizableVideo = useRef(null);

  const {
    startHorizontalResize,
    stopHorizontalResize,
    startVerticalResize,
    stopVerticalResize,
    isHorizontalResizeActive,
    isVerticalResizeActive,
  } = useResizeMedia(props, resizableVideo);

  return (
    <NodeViewWrapper>
      <div
        className="media-node-view"
        style={{ position: "relative", width: "fit-content" }}
      >
        <video
          ref={resizableVideo}
          controls={node.attrs.controls}
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          data-video-resolution={`${node.attrs.width}x${node.attrs.height}`}
          data-document-id={node.attrs.documentId}
          data-document-is-captation={node.attrs.isCaptation}
        >
          <source src={node.attrs.src} />
        </video>

        <div
          className={`horizontal-resize-handle ${
            isHorizontalResizeActive ? "horizontal-resize-active" : ""
          }`}
          title="Resize"
          onMouseDown={(e) => startHorizontalResize(e)}
          onMouseUp={() => stopHorizontalResize}
        />

        <div
          className={`vertical-resize-handle ${
            isVerticalResizeActive ? "vertical-resize-active" : ""
          }`}
          title="Resize"
          onMouseDown={(e) => startVerticalResize(e)}
          onMouseUp={() => stopVerticalResize}
        />
      </div>
    </NodeViewWrapper>
  );
};
