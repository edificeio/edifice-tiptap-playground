import { Suspense, lazy, forwardRef, useImperativeHandle, Ref } from "react";

import "@edifice-tiptap-extensions/extension-image";
import {
  LoadingScreen,
  MediaLibrary,
  useOdeClient,
  BubbleMenuEditImage,
  TableToolbar,
  LinkToolbar,
  TiptapWrapper,
} from "@edifice-ui/react";
import { BubbleMenu, EditorContent, Content, JSONContent } from "@tiptap/react";

import "katex/dist/katex.min.css";
import "~/styles/table.scss";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContext } from "../../hooks/useEditorContext";
import { useImageModal } from "../../hooks/useImageModal";
import { useMathsModal } from "../../hooks/useMathsModal";
import { useMediaLibraryModal } from "../../hooks/useMediaLibraryModal";
import { useTipTapEditor } from "../../hooks/useTipTapEditor";
import { useLinkToolbar } from "~/hooks/useLinkToolbar";
import { useSpeechSynthetisis } from "~/hooks/useSpeechSynthetisis";

//-------- LAZY IMPORTS --------//
const MathsModal = lazy(async () => {
  const module = await import("@edifice-ui/react");
  return { default: module.MathsModal };
});
const ImageEditor = lazy(async () => {
  const module = await import("@edifice-ui/react");
  return { default: module.ImageEditor };
});

export interface EditorRef {
  /** Get the current content. */
  getContent: (
    as: "html" | "json" | "plain",
  ) => undefined | string | JSONContent;

  /** Get speech synthetisis current state */
  isSpeeching: () => boolean;
  /** [De]activate speech synthetisis */
  toogleSpeechSynthetisis: () => boolean;
}

/**
 * Editor component properties
 */
export interface EditorProps {
  /** Rich content to render. */
  content: Content;
  /**
   * Rendering mode : `edit` to allow content modifications, or `read` (default)
   * Switching to `edit` mode will also render the toolbar
   * (unless `toolbar` property is `none`).
   */
  mode?: "edit" | "read" /* | "preview" */;
  /** Toolbar to display in `edit` mode. */
  toolbar?: "full" | "none";
}

const Editor = forwardRef(
  (
    { content, mode = "read", toolbar = "full" }: EditorProps,
    ref: Ref<EditorRef>,
  ) => {
    const { appCode } = useOdeClient();
    const { editor, editable } = useTipTapEditor(mode === "edit", content);
    const { ref: mediaLibraryModalRef, ...mediaLibraryModalHandlers } =
      useMediaLibraryModal(editor);
    const { toggle: toggleMathsModal, ...mathsModalHandlers } =
      useMathsModal(editor);
    const imageModal = useImageModal(editor);
    const linkToolbarHandlers = useLinkToolbar(editor, mediaLibraryModalRef);
    const speechSynthetisis = useSpeechSynthetisis(editor);

    //----- Editor API
    useImperativeHandle(ref, () => ({
      getContent: (as: "html" | "json" | "plain") => {
        switch (as) {
          case "html":
            return editor?.getHTML();
          case "json":
            return editor?.getJSON();
          case "plain":
            return editor?.getText();
          default:
            throw `[Editor] Unknown content format ${as}`;
        }
      },
      toogleSpeechSynthetisis: speechSynthetisis.toggle,
      isSpeeching: () => speechSynthetisis.isActivated,
    }));

    return (
      <EditorContext.Provider
        value={{
          appCode,
          editor,
        }}
      >
        <TiptapWrapper>
          {toolbar !== "none" && editable && (
            <EditorToolbar
              {...{
                editor,
                mediaLibraryRef: mediaLibraryModalRef,
                toggleMathsModal: toggleMathsModal,
              }}
            />
          )}
          <EditorContent
            editor={editor}
            id="editorContent"
            className="py-12 px-16"
          />
        </TiptapWrapper>

        <LinkToolbar editor={editor} {...linkToolbarHandlers} />

        <TableToolbar editor={editor} />

        {editor && (
          <BubbleMenu
            className={imageModal.isOpen ? "d-none" : ""}
            shouldShow={({ editor }) => {
              return editor.isActive("custom-image") && !imageModal.isOpen;
            }}
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: "bottom-start",
              zIndex: 999,
            }}
          >
            <BubbleMenuEditImage
              editor={editor}
              onEditImage={imageModal.handleEdit}
            />
          </BubbleMenu>
        )}

        <Suspense fallback={<LoadingScreen />}>
          {editable && (
            <MediaLibrary
              appCode={appCode}
              ref={mediaLibraryModalRef}
              {...mediaLibraryModalHandlers}
            />
          )}
        </Suspense>

        <Suspense fallback={<LoadingScreen />}>
          {editable && mathsModalHandlers.isOpen && (
            <MathsModal {...mathsModalHandlers} />
          )}
        </Suspense>

        <Suspense fallback={<LoadingScreen />}>
          {editable && imageModal?.isOpen && imageModal?.currentImage && (
            <ImageEditor
              altText={imageModal?.currentImage.alt}
              legend={imageModal?.currentImage.title}
              image={imageModal?.currentImage.src}
              isOpen={imageModal.isOpen}
              onCancel={imageModal.handleCancel}
              onSave={imageModal.handleSave}
              onError={console.error}
            />
          )}
        </Suspense>
      </EditorContext.Provider>
    );
  },
);

export default Editor;
