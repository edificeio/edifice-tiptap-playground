import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { IFrame } from "@edifice-tiptap-extensions/extension-iframe";
import { Linker } from "@edifice-tiptap-extensions/extension-linker";
import { SpeechRecognition } from "@edifice-tiptap-extensions/extension-speechrecognition";
import SpeechSynthesis from "@edifice-tiptap-extensions/extension-speechsynthesis";
import { TableCell } from "@edifice-tiptap-extensions/extension-table-cell";
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import { Video } from "@edifice-tiptap-extensions/extension-video";
import { Edit, TextToSpeech } from "@edifice-ui/icons";
import {
  LoadingScreen,
  MediaLibrary,
  MediaLibraryResult,
  MediaLibraryType,
  TiptapWrapper,
  Toolbar,
  ToolbarItem,
  useOdeClient,
  useToggle,
} from "@edifice-ui/react";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap-pro/extension-mathematics";

import "katex/dist/katex.min.css";
import "~/styles/table.scss";
import { AttachReact, TestAttachment } from "./AttachmentReact";
import ImageExtension from "./ImageExtension";
import TableToolbar from "./TableToolbar";
import { useActionOptions } from "~/hooks/useActionOptions";
import { useImageSelected } from "~/hooks/useImageSelected";
import { useToolbarItems } from "~/hooks/useToolbarItems";
import "katex/dist/katex.min.css";
import "~/styles/table.scss";
import { useWorkspace } from "~/hooks/useWorkspace";

export interface TiptapProps {
  appCode?: string;
}

const MathsModal = lazy(async () => await import("./MathsModal"));
const ImageBubbleMenu = lazy(
  async () => await import("../image/ImageBubbleMenu"),
);
const ImageEditor = lazy(
  async () => await import("~/package/ImageEditor/components/ImageEditor"),
);

const Tiptap = () => {
  const { appCode, currentLanguage } = useOdeClient();
  const [editable, toggleEditable] = useToggle(true);
  const { createOrUpdate } = useWorkspace();
  const [speechSynthetisis, setSpeechSynthetisis] = useState<boolean>(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const fileId = queryParameters.get("file");
  const docId = queryParameters.get("doc");
  const source = queryParameters.get("source");
  const editor = useEditor({
    editable,
    extensions: [
      ImageExtension,
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      TypoSize,
      SpeechRecognition,
      SpeechSynthesis.configure({
        lang:
          currentLanguage?.length === 2
            ? `${currentLanguage}-${currentLanguage.toUpperCase()}`
            : "fr-FR",
      }),
      Video,
      IFrame,
      AttachReact(TestAttachment),
      Image,
      Link,
      Linker,
      FontFamily,
      Mathematics,
    ],
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That's a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
      </p>
      <pre>
        <code class="language-css">
          body {
            display: none;
          }
        </code>
      </pre>
      <p>
        I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that's amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
      <p>
        And now, an internal link : <a href="/blog/" title="A link" target="_blank" data-id="123456" data-app-prefix="magic">See it</a>
      </p>
      <img alt="mon image" style="width:400px" src="https://images.unsplash.com/photo-1668539445692-cd5d790c8352?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=1740&amp;q=80" class="">
      <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>singer</td>
              <td>songwriter</td>
              <td>actress</td>
            </tr>
          </tbody>
      </table>
        <div>
          <div class="attachments">
            <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
              <div class="download"></div>
              First
          </a>
            <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
              <div class="download"></div>
              Second
          </a>
          <div class="attachments">
            <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
              <div class="download"></div>
              First
          </a>
            <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
              <div class="download"></div>
              Second
          </a>
      </div>
      `,
  });

  const [mediaLibraryType, setMediaLibraryType] =
    useState<MediaLibraryType | null>(null);

  const [isMathsModalOpen, toggleMathsModal] = useToggle(false);
  const [isImageModalOpen, toggleImageModal] = useToggle(false);
  const [currentImage, setCurrentImage] = useState<
    { src: string; alt?: string; title?: string } | undefined
  >(undefined);

  /* A bouger ailleurs, à externaliser ? */
  const [options, listOptions, alignmentOptions] = useActionOptions(
    editor,
    toggleMathsModal,
  );

  /* A bouger ailleurs, à externaliser ? */
  const { toolbarItems, appendAsRichContent } = useToolbarItems(
    editor,
    (type: MediaLibraryType | null) => setMediaLibraryType(type),
    listOptions,
    alignmentOptions,
    options,
  );

  const toolbarDemo: ToolbarItem[] = [
    {
      type: "icon",
      props: {
        icon: <TextToSpeech />,
        className: speechSynthetisis ? "bg-primary" : "",
        "aria-label": "Synthèse vocale",
        onClick: () => {
          if (speechSynthetisis) {
            editor?.commands.stopSpeechSynthesis();
            setSpeechSynthetisis(false);
          } else {
            const speech = editor?.commands.startSpeechSynthesis() || false;
            setSpeechSynthetisis(speech);
          }
        },
      },
      name: "video",
      visibility: editable ? "hide" : "show",
    },
    {
      type: "icon",
      props: {
        icon: <Edit />,
        className: editable ? "bg-primary" : "",
        "aria-label": "Changer de mode",
        onClick: () => toggleEditable(),
      },
      name: "mode",
    },
  ];

  useEffect(() => {
    if (editor) {
      if (fileId) {
        fetch(`/pocediteur/files/${fileId}`).then((response) => {
          if (response.ok) {
            response.text().then((data) => {
              editor.commands.setContent(data);
            });
          }
        });
      } else if (docId) {
        fetch(`/pocediteur/${source}/docs/${docId}?cleanHtml=true`).then(
          (response) => {
            if (response.ok) {
              response.json().then((data) => {
                editor.commands.setContent(data.content);
              });
            }
          },
        );
      }
    }
  }, [fileId, docId, editor, source]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  const onMediaLibrarySuccess = useCallback(
    (result: MediaLibraryResult) => {
      if (mediaLibraryType) {
        // Inject the MediaLibrary result into the editor.
        appendAsRichContent(mediaLibraryType, result);

        // Close the MediaLibrary
        setMediaLibraryType(null);
      }
    },
    [appendAsRichContent, mediaLibraryType],
  );

  const onMathsModalCancel = () => {
    toggleMathsModal();
  };

  const onMathsModalSuccess = (formulaEditor: string) => {
    editor?.commands.insertContentAt(
      editor.view.state.selection,
      formulaEditor,
    );
    editor?.commands.enter();
    toggleMathsModal();
  };
  const { setAttributes } = useImageSelected(editor);
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
    <>
      <Toolbar
        items={toolbarDemo}
        variant="no-shadow"
        isBlock={true}
        align="right"
      />
      <TiptapWrapper>
        {editable && (
          <Toolbar
            items={toolbarItems}
            variant="no-shadow"
            className="rounded-top"
            isBlock
            align="left"
            ariaControls="editorContent"
          />
        )}
        <EditorContent
          editor={editor}
          id="editorContent"
          className="py-12 px-16"
        />
      </TiptapWrapper>

      <TableToolbar editor={editor} />

      <Suspense fallback={<LoadingScreen />}>
        <MediaLibrary
          appCode={appCode}
          type={mediaLibraryType}
          onCancel={() => setMediaLibraryType(null)}
          onSuccess={onMediaLibrarySuccess}
        />
      </Suspense>

      <Suspense fallback={<LoadingScreen />}>
        {isMathsModalOpen && (
          <MathsModal
            isOpen={isMathsModalOpen}
            onCancel={onMathsModalCancel}
            onSuccess={onMathsModalSuccess}
          />
        )}
      </Suspense>
      {editor && (
        <Suspense fallback={<LoadingScreen />}>
          <ImageBubbleMenu
            editor={editor}
            onEdit={(src) => {
              setCurrentImage(src);
              toggleImageModal();
            }}
          />
        </Suspense>
      )}
      <Suspense fallback={<LoadingScreen />}>
        {isImageModalOpen && currentImage && (
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
    </>
  );
};

export default Tiptap;
