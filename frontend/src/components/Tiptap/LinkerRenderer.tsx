/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { AppIcon, Badge } from "@edifice-ui/react";
import { Editor } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import clsx from "clsx";

export interface LinkerProps {
  editor: Editor;
  selected: boolean;
  [x: string]: any;
}

export interface LinkerAttrsProps {}

export const LinkerRenderer = ({ editor, selected, ...props }: LinkerProps) => {
  const {
    class: className,
    href,
    title,
    "data-id": id,
    "data-app-prefix": appCode,
  } = props.node.attrs;

  const classes = clsx(
    "align-middle",
    className,
    selected && "bg-secondary-200",
  );

  return (
    <NodeViewWrapper as={"span"}>
      <Badge variant={{ type: "link" }} className={classes} data-drag-handle>
        <AppIcon size="24" app={appCode} />
        <NodeViewContent className="ms-8" contentEditable={false} as={"span"} />
      </Badge>
    </NodeViewWrapper>
  );
};
