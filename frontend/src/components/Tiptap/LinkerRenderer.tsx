/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { AppIcon, Badge, useOdeIcons } from "@edifice-ui/react";
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
  const { getIconCode } = useOdeIcons();
  const {
    class: className,
    href,
    title,
    "data-id": id,
    "data-app-prefix": appPrefix,
  } = props.node.attrs;

  const classes = clsx(
    "align-middle badge-linker",
    className,
    selected && "bg-secondary-200",
  );

  const appCode = getIconCode(appPrefix);

  return (
    <NodeViewWrapper as={"span"}>
      <Badge variant={{ type: "link" }} className={classes} data-drag-handle>
        <AppIcon size="24" app={appCode} />
        <span className="ms-8 text-truncate">{title}</span>
      </Badge>
    </NodeViewWrapper>
  );
};
