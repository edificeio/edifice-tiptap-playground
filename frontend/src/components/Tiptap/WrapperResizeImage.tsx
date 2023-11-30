/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from "react";

import { ImageExtend } from "@edifice-tiptap-extensions/extension-image";
import { Image } from "@edifice-ui/react";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import { useResizeMedia } from "~/hooks/useResizeMedia";

export const ImageResize = (Component: any) =>
  ImageExtend.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export interface ImageResizeProps {
  editor: Editor;
  [x: string]: any;
}

export const WrapperResizeImage = (props: ImageResizeProps) => {
  const { node } = props;

  const resizableImg = useRef(null);

  const {
    startHorizontalResize,
    stopHorizontalResize,
    startVerticalResize,
    stopVerticalResize,
    isHorizontalResizeActive,
    isVerticalResizeActive,
  } = useResizeMedia(props, resizableImg);

  return (
    <NodeViewWrapper>
      <div
        className="media-node-view"
        style={{ position: "relative", width: "fit-content" }}
      >
        <Image {...node.attrs} className={`custum-image`} ref={resizableImg} />

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
