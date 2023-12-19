import {
  Suspense,
  lazy,
  useState,
  useRef,
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
  MediaLibraryRef,
  MediaLibraryResult,
  useOdeClient,
  useToggle,
  BubbleMenuEditImage,
  useImageSelection,
  useWorkspaceFile,
  TableToolbar,
  LinkToolbar,
  TiptapWrapper,
} from "@edifice-ui/react";
import { BubbleMenu, EditorContent, Content, JSONContent } from "@tiptap/react";

import "katex/dist/katex.min.css";
import "~/styles/table.scss";
import { EditorContext } from "./EditorContext";
import { useTipTapEditor } from "./useTipTapEditor";
import { EditorToolbar } from "~/hooks/EditorToolbar";

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
    const { appCode } = useOdeClient();
    const [speechSynthetisis, setSpeechSynthetisis] = useState<boolean>(false);

    const { editor, editable, appendMediaLibraryResult } = useTipTapEditor(
      mode === "edit",
      content,
    );

    // Media library reference
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);

    // Maths modal state
    const [isMathsModalOpen, toggleMathsModal] = useToggle(false);

    // Image modal state
    const [isImageModalOpen, toggleImageModal] = useToggle(false);
    const [currentImage, setCurrentImage] = useState<
      { src: string; alt?: string; title?: string } | undefined
    >(undefined);
    // Use hook to createOrUpdate image
    const { createOrUpdate } = useWorkspaceFile();
    // Use hook to get selected images
    const { setAttributes, getSelection } = useImageSelection(editor);

    //----- Handlers
    const handleMathsModalCancel = () => {
      toggleMathsModal();
    };
    const handleMathsModalSuccess = (formulaEditor: string) => {
      editor?.commands.insertContentAt(
        editor.view.state.selection,
        formulaEditor,
      );
      editor?.commands.enter();
      toggleMathsModal();
    };

    const handleMediaLibraryCancel = () => {
      mediaLibraryRef.current?.hide();
    };
    const handleMediaLibrarySuccess = (result: MediaLibraryResult) => {
      if (mediaLibraryRef.current?.type) {
        // Inject the MediaLibrary result into the editor, and close the modal.
        appendMediaLibraryResult(mediaLibraryRef.current.type, result);
        mediaLibraryRef.current?.hide();
      }
    };

    const handleLinkEdit = (attrs: LinkerAttributes | HyperlinkAttributes) => {
      // If a link is active, select it.
      if (editor?.isActive("linker")) editor.commands.selectParentNode();
      if (editor?.isActive("hyperlink"))
        editor.commands.extendMarkRange("hyperlink");

      const attrsLinker = attrs as LinkerAttributes;
      if (attrsLinker["data-id"] || attrsLinker["data-app-prefix"]) {
        mediaLibraryRef.current?.editLink({
          target: attrs.target,
          resourceId: attrsLinker["data-id"],
          appPrefix: attrsLinker["data-app-prefix"],
        });
      } else {
        const { href, target, title } = attrs as HyperlinkAttributes;
        mediaLibraryRef.current?.editLink({
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
    // Callback when image has been edited
    const onImageModalSuccess = async ({
      blob,
      legend,
      altText: alt,
    }: {
      blob: Blob;
      legend: string;
      altText: string;
    }) => {
      const url = await createOrUpdate({
        blob,
        legend,
        alt,
        uri: currentImage?.src,
      });
      toggleImageModal();
      setAttributes({
        url,
        alt,
        title: legend,
      });
    };

    const onImageModalCancel = () => {
      toggleImageModal();
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
                mediaLibraryRef,
                toggleMathsModal,
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
            className={isImageModalOpen ? "d-none" : ""}
            shouldShow={({ editor }) => {
              return editor.isActive("custom-image") && !isImageModalOpen;
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
              onEditImage={() => {
                const selected = getSelection()[0];
                if (selected) {
                  setCurrentImage(selected);
                  toggleImageModal();
                }
              }}
            />
          </BubbleMenu>
        )}

        <Suspense fallback={<LoadingScreen />}>
          {editable && (
            <MediaLibrary
              ref={mediaLibraryRef}
              appCode={appCode}
              onCancel={handleMediaLibraryCancel}
              onSuccess={handleMediaLibrarySuccess}
            />
          )}
        </Suspense>

        <Suspense fallback={<LoadingScreen />}>
          {editable && isMathsModalOpen && (
            <MathsModal
              isOpen={isMathsModalOpen}
              onCancel={handleMathsModalCancel}
              onSuccess={handleMathsModalSuccess}
            />
          )}
        </Suspense>

        <Suspense fallback={<LoadingScreen />}>
          {editable && isImageModalOpen && currentImage && (
            <ImageEditor
              altText={currentImage.alt}
              legend={currentImage.title}
              image={currentImage.src}
              isOpen={isImageModalOpen}
              onCancel={onImageModalCancel}
              onSave={onImageModalSuccess}
              onError={console.error}
            />
          )}
        </Suspense>
      </EditorContext.Provider>
    );
  },
);

export default Editor;
