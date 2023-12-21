import {
  Suspense,
  lazy,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";

import { HyperlinkAttributes } from "@edifice-tiptap-extensions/extension-hyperlink";
import { LinkerAttributes } from "@edifice-tiptap-extensions/extension-linker";
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
      toogleSpeechSynthetisis: () => {
        if (speechSynthetisis) {
          editor?.commands.stopSpeechSynthesis();
          setSpeechSynthetisis(false);
          return false;
        } else {
          const speech = editor?.commands.startSpeechSynthesis() || false;
          setSpeechSynthetisis(speech);
          return speech;
        }
      },
      isSpeeching: () => speechSynthetisis,
    }));

    //----- Editor implementation
    const [speechSynthetisis, setSpeechSynthetisis] = useState<boolean>(false);

    const { appCode } = useOdeClient();
    const { editor, editable } = useTipTapEditor(mode === "edit", content);
    const mathsModal = useMathsModal();
    const imageModal = useImageModal();
    const mediaLibrary = useMediaLibraryModal();

    const handleLinkEdit = (attrs: LinkerAttributes | HyperlinkAttributes) => {
      // If a link is active, select it.
      if (editor?.isActive("linker")) editor.commands.selectParentNode();
      if (editor?.isActive("hyperlink"))
        editor.commands.extendMarkRange("hyperlink");

      const attrsLinker = attrs as LinkerAttributes;
      if (attrsLinker["data-id"] || attrsLinker["data-app-prefix"]) {
        mediaLibrary.ref.current?.editLink({
          target: attrs.target,
          resourceId: attrsLinker["data-id"],
          appPrefix: attrsLinker["data-app-prefix"],
        });
      } else {
        const { href, target, title } = attrs as HyperlinkAttributes;
        mediaLibrary.ref.current?.editLink({
          url: href || "",
          target: target || undefined,
          text: title || undefined,
        });
      }
    };

    const handleLinkOpen = (attrs: LinkerAttributes) => {
      window.open(attrs.href || "about:blank", "_blank");
    };

    const handleLinkUnlink = (/*attrs: LinkerAttributes*/) => {
      editor?.commands.unsetLinker?.();
      editor?.commands.unsetLink?.();
    };
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
                mediaLibraryRef: mediaLibrary.ref,
                toggleMathsModal: mathsModal.toggle,
              }}
            />
          )}
          <EditorContent
            editor={editor}
            id="editorContent"
            className="py-12 px-16"
          />
        </TiptapWrapper>

        <LinkToolbar
          editor={editor}
          onEdit={handleLinkEdit}
          onOpen={handleLinkOpen}
          onUnlink={handleLinkUnlink}
        />

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
              ref={mediaLibrary.ref}
              appCode={appCode}
              onCancel={mediaLibrary.handleCancel}
              onSuccess={mediaLibrary.handleSuccess}
            />
          )}
        </Suspense>

        <Suspense fallback={<LoadingScreen />}>
          {editable && mathsModal.isOpen && (
            <MathsModal
              isOpen={mathsModal.isOpen}
              onCancel={mathsModal.handleCancel}
              onSuccess={mathsModal.handleSuccess}
            />
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
