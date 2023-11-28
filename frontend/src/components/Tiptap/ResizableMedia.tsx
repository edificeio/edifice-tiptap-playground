/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef } from "react";

import { ImageExtend } from "@edifice-tiptap-extensions/extension-image";
import { Image } from "@edifice-ui/react";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

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

interface WidthAndHeight {
  width: number;
  height: number;
}

export const ResizableMedia = (props: ImageResizeProps) => {
  const { node } = props;

  const mediaType = node.attrs["media-type"];

  const resizableImg = useRef(null);

  const currentResizableImg =
    resizableImg.current as unknown as HTMLImageElement;

  const aspectRatio = useRef(0);

  const lastCursorX = useRef(-1);

  const isHorizontalResizeActive = useRef(false);

  const isVerticalResizeActive = useRef(false);

  const proseMirrorContainerWidth = useRef(0);

  const limitWidthOrHeightToFiftyPixels = ({ width, height }: WidthAndHeight) =>
    width < 250 || height < 180;

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector(".ProseMirror");

    if (proseMirrorContainerDiv)
      proseMirrorContainerWidth.current = proseMirrorContainerDiv?.clientWidth;

    if (!resizableImg.current) return;

    if (mediaType === "img") {
      (resizableImg.current as HTMLImageElement).onload = () => {
        // Aspect Ratio from its original size
        aspectRatio.current =
          currentResizableImg.naturalWidth / currentResizableImg.naturalHeight;

        onVerticalResize("left", 0);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adaptSize = (size: string) => {
    let width = 0;
    switch (size) {
      case "small":
        width = 250;
        return width;
      case "medium":
        width = 350;
        return width;
      case "large":
        width = 500;
        return width;
      default:
        break;
    }
  };

  useEffect(() => {
    const width = adaptSize(node.attrs.size);
    const height = node.attrs.height;
    props.updateAttributes({ width, height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.attrs.size]);

  const onVerticalResize = (
    directionOfMouseMove: "right" | "left",
    diff: number,
  ) => {
    if (!resizableImg.current) {
      console.error("Media ref is undefined|null", {
        resizableImg: resizableImg.current,
      });
      return;
    }

    const currentMediaDimensions = {
      width: currentResizableImg?.width,
      height: currentResizableImg?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (directionOfMouseMove === "left") {
      newMediaDimensions.width = currentMediaDimensions.width - Math.abs(diff);
    } else {
      newMediaDimensions.width = currentMediaDimensions.width + Math.abs(diff);
    }

    if (newMediaDimensions.width > proseMirrorContainerWidth.current)
      newMediaDimensions.width = proseMirrorContainerWidth.current;

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio.current;

    if (limitWidthOrHeightToFiftyPixels(newMediaDimensions)) return;

    props.updateAttributes(newMediaDimensions);
  };

  const onVerticalMouseMove = (e: MouseEvent) => {
    if (!isVerticalResizeActive.current) return;

    const { clientX } = e;

    const diff = lastCursorX.current - clientX;

    lastCursorX.current = clientX;

    if (diff === 0) return;

    const directionOfMouseMove: "left" | "right" = diff > 0 ? "left" : "right";

    onVerticalResize(directionOfMouseMove, Math.abs(diff));
  };

  const startVerticalResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    isVerticalResizeActive.current = true;
    lastCursorX.current = e.clientX;

    document.addEventListener("mousemove", onVerticalMouseMove);
    document.addEventListener("mouseup", stopVerticalResize);
  };

  const stopVerticalResize = () => {
    isVerticalResizeActive.current = false;
    lastCursorX.current = -1;

    document.removeEventListener("mousemove", onVerticalMouseMove);
    document.removeEventListener("mouseup", stopVerticalResize);
  };

  /* SEPERATORRRRRRRRRRRRRRRRRRRRRRRRR */

  const onHorizontalMouseMove = (e: MouseEvent) => {
    if (!isHorizontalResizeActive.current) return;

    const { clientY } = e;

    const diff = lastCursorY.current - clientY;

    lastCursorY.current = clientY;

    if (diff === 0) return;

    const directionOfMouseMove: "up" | "down" = diff > 0 ? "up" : "down";

    if (!resizableImg.current) {
      console.error("Media ref is undefined|null", {
        resizableImg: resizableImg.current,
      });
      return;
    }

    const currentMediaDimensions = {
      width: currentResizableImg?.width,
      height: currentResizableImg?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (directionOfMouseMove === "up") {
      newMediaDimensions.height =
        currentMediaDimensions.height - Math.abs(diff);
    } else {
      newMediaDimensions.height =
        currentMediaDimensions.height + Math.abs(diff);
    }

    newMediaDimensions.width = newMediaDimensions.height * aspectRatio.current;

    if (newMediaDimensions.width > proseMirrorContainerWidth.current) {
      newMediaDimensions.width = proseMirrorContainerWidth.current;

      newMediaDimensions.height =
        newMediaDimensions.width / aspectRatio.current;
    }

    if (limitWidthOrHeightToFiftyPixels(newMediaDimensions)) return;

    props.updateAttributes(newMediaDimensions);
  };

  const lastCursorY = useRef(-1);

  const startHorizontalResize = (e: any) => {
    isHorizontalResizeActive.current = true;
    lastCursorY.current = e.clientY;

    document.addEventListener("mousemove", onHorizontalMouseMove);
    document.addEventListener("mouseup", stopHorizontalResize);
  };

  const stopHorizontalResize = () => {
    isHorizontalResizeActive.current = false;
    lastCursorY.current = -1;

    document.removeEventListener("mousemove", onHorizontalMouseMove);
    document.removeEventListener("mouseup", stopHorizontalResize);
  };

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
          onMouseUp={() => stopVerticalResize()}
        />
      </div>
    </NodeViewWrapper>
  );
};
