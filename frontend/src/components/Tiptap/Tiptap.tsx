import { useEffect, Suspense, lazy, useState, useCallback } from "react";

import { Attachment } from "@edifice-tiptap-extensions/extension-attachment";
import { IFrame } from "@edifice-tiptap-extensions/extension-iframe";
import { TableCell } from "@edifice-tiptap-extensions/extension-table-cell";
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import { Video } from "@edifice-tiptap-extensions/extension-video";
import {
  LoadingScreen,
  MediaLibrary,
  MediaLibraryResult,
  MediaLibraryType,
  TiptapWrapper,
  Toolbar,
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap-pro/extension-mathematics";

import TableToolbar from "./TableToolbar";
import { useActionOptions } from "~/hooks/useActionOptions";
import { useToolbarItems } from "~/hooks/useToolbarItems";

import "katex/dist/katex.min.css";
import "~/styles/index.scss";
import "~/styles/table.scss";

const MathsModal = lazy(async () => await import("./MathsModal"));

const Tiptap = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const fileId = queryParameters.get("file");
  const docId = queryParameters.get("doc");
  const source = queryParameters.get("source");
  const editor = useEditor({
    extensions: [
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
      Video,
      IFrame,
      Attachment,
      Image,
      Link,
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
      `,
  });

  const [mediaLibraryType, setMediaLibraryType] =
    useState<MediaLibraryType | null>(null);

  const [isMathsModalOpen, toggleMathsModal] = useToggle(false);

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
  );

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
  }, [fileId, docId, editor]);

  //  console.log(editor?.extensionManager.extensions);

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

  return (
    <>
      <TiptapWrapper>
        <Toolbar
          data={toolbarItems}
          options={options}
          variant="no-shadow"
          isBlock
          align="left"
          ariaControls="editorContent"
        />
        <EditorContent
          editor={editor}
          id="editorContent"
          className="py-12 px-16"
        />
      </TiptapWrapper>

      <TableToolbar editor={editor} />

      <MediaLibrary
        type={mediaLibraryType}
        onCancel={() => setMediaLibraryType(null)}
        onSuccess={onMediaLibrarySuccess}
      />

      <Suspense fallback={<LoadingScreen />}>
        {isMathsModalOpen && (
          <MathsModal
            isOpen={isMathsModalOpen}
            onCancel={onMathsModalCancel}
            onSuccess={onMathsModalSuccess}
          />
        )}
      </Suspense>
    </>
  );
};

export default Tiptap;
