import { useState } from "react";

import { Attachment as AttachmentExt } from "@edifice-tiptap-extensions/extension-attachment";
import { Delete, Download } from "@edifice-ui/icons";
import { Attachment, Grid, IconButton } from "@edifice-ui/react";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useTranslation } from "react-i18next";

export const AttachReact = (Component: any) =>
  AttachmentExt.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export interface AttachmentProps {
  editor: Editor;
  [x: string]: any;
}

export interface AttachmentAttrsProps {
  name: string;
  href: string;
  documentId: string;
  dataContentType: string;
}

export const TestAttachment = (props: AttachmentProps) => {
  const { t } = useTranslation();

  const { node } = props;
  const [attachmentArrayAttrs, setAttachmentArrayAttrs] = useState<
    AttachmentAttrsProps[]
  >(node.attrs.links);

  const handleDelete = (index: any) => {
    setAttachmentArrayAttrs((oldAttachments) =>
      oldAttachments.filter((_, i) => i !== index),
    );
  };

  return (
    attachmentArrayAttrs.length !== 0 && (
      <NodeViewWrapper>
        <div
          style={{
            backgroundColor: "#F2F2F2",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <p className="m-12">{t("Pièce(s) jointe(s)")}</p>
          <Grid>
            {attachmentArrayAttrs?.map((attachment, index) => (
              <Grid.Col sm="6" key={index}>
                <Attachment
                  name={attachment.name}
                  options={
                    <>
                      <IconButton
                        aria-label={t("download")}
                        color="tertiary"
                        type="button"
                        icon={<Download />}
                        variant="ghost"
                        onClick={() => window.open(attachment.href)}
                      />
                      <IconButton
                        aria-label={t("delete")}
                        color="danger"
                        type="button"
                        icon={<Delete />}
                        variant="ghost"
                        onClick={() => handleDelete(index)}
                      />
                    </>
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </NodeViewWrapper>
    )
  );
};
