import {
  useEffect,
  Suspense,
  lazy,
  useState,
  useCallback,
  useRef,
} from "react";

import { Hyperlink } from "@edifice-tiptap-extensions/extension-hyperlink";
import { IFrame } from "@edifice-tiptap-extensions/extension-iframe";
import { LinkerAttributes } from "@edifice-tiptap-extensions/extension-linker";
import { SpeechRecognition } from "@edifice-tiptap-extensions/extension-speechrecognition";
import SpeechSynthesis from "@edifice-tiptap-extensions/extension-speechsynthesis";
import { TableCell } from "@edifice-tiptap-extensions/extension-table-cell";
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import { Video } from "@edifice-tiptap-extensions/extension-video";
import { Edit, TextToSpeech } from "@edifice-ui/icons";
import {
  IExternalLink,
  LoadingScreen,
  MediaLibrary,
  MediaLibraryRef,
  MediaLibraryResult,
  ResourceTabResult,
  TiptapWrapper,
  Toolbar,
  ToolbarItem,
  useOdeClient,
  useToggle,
} from "@edifice-ui/react";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
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
// eslint-disable-next-line import/order
import { Mathematics } from "@tiptap-pro/extension-mathematics";

import "katex/dist/katex.min.css";
import "~/styles/table.scss";
import { WorkspaceElement } from "edifice-ts-client";

import { AttachReact, TestAttachment } from "./AttachmentReact";
import ImageEditMenu from "./ImageEditMenu";
import { LinkerNodeView } from "./LinkerNodeView";
import LinkerToolbar from "./LinkerToolbar";
import TableToolbar from "./TableToolbar";
import { ImageResize, WrapperResizeImage } from "./WrapperResizeImage";
import { useActionOptions } from "~/hooks/useActionOptions";
// eslint-disable-next-line import/order
import { useToolbarItems } from "~/hooks/useToolbarItems";

import "katex/dist/katex.min.css";
import "~/styles/table.scss";
// eslint-disable-next-line import/order
import { VideoResize, WrapperResizeVideo } from "./WrapperResizeVideo";

export interface TiptapProps {
  appCode?: string;
}

const MathsModal = lazy(async () => await import("./MathsModal"));

const Tiptap = () => {
  const { appCode, currentLanguage } = useOdeClient();
  const [editable, toggleEditable] = useToggle(true);
  const [speechSynthetisis, setSpeechSynthetisis] = useState<boolean>(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const fileId = queryParameters.get("file");
  const docId = queryParameters.get("doc");
  const source = queryParameters.get("source");
  const editor = useEditor({
    editable,
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
      LinkerNodeView,
      Hyperlink,
      ImageResize(WrapperResizeImage),
      VideoResize(WrapperResizeVideo),
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
      <img width="400" height="150" src="https://images.unsplash.com/photo-1682685796186-1bb4a5655653?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="mon image" />
      <p>
        I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that's amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
      <p>
        And now, an internal link : <a href="/blog" title="A link" target="_blank" data-id="123456" data-app-prefix="blog">See it</a>
      </p>
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

  const mediaLibraryRef = useRef<MediaLibraryRef>(null);

  const [isMathsModalOpen, toggleMathsModal] = useToggle(false);

  /* A bouger ailleurs, à externaliser ? */
  const [options, listOptions, alignmentOptions] = useActionOptions(
    editor,
    toggleMathsModal,
  );

  /* A bouger ailleurs, à externaliser ? */
  const { toolbarItems } = useToolbarItems(
    editor,
    mediaLibraryRef,
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

  /**
   * Convert the result of a successful action in MediaLibrary
   * - to a call to the editor's dedicated command,
   * or
   * - to an HTML fragment of rich content + insert it.
   *
   * The inital result  depends on the MediaLibrary type.
   */
  const appendAsRichContent = useCallback(
    (result: MediaLibraryResult) => {
      const type = mediaLibraryRef.current?.type;
      if (!type || !editor) return;

      switch (mediaLibraryRef.current.type) {
        // Image type => result is of type WorkspaceElement[]
        case "image": {
          const imgs = result as WorkspaceElement[];
          imgs.forEach((img) => {
            editor
              ?.chain()
              .focus()
              .setImage({
                src: `/workspace/document/${img._id}`,
                alt: img.alt,
                title: img.title,
                ["media-type"]: "img",
              })
              .run();
          });
          break;
        }

        // Audio type => result is of type WorkspaceElement[]
        case "audio": {
          const sounds = result as WorkspaceElement[];
          sounds.forEach((snd) => {
            // TODO finaliser, voir WB-1992
            const richContent = `<audio src="/workspace/document/${snd._id}" controls preload="none"/></audio>`;
            editor?.commands.insertContentAt(
              editor.view.state.selection,
              richContent,
            );
            editor?.commands.enter();
          });
          break;
        }

        case "video": {
          const video = result as WorkspaceElement;
          editor
            ?.chain()
            .focus()
            .setVideo(
              video._id || "",
              `/workspace/document/${video._id}`,
              true,
            );
          break;
        }

        case "attachment": {
          let innerHtml = "";
          for (let i = 0; i < result.length; i++) {
            innerHtml += `<a href="/workspace/document/${
              (result as WorkspaceElement[])[i]._id
            }">${(result as WorkspaceElement[])[i].name}
            </a>`;
          }
          const richContent = `<div class="attachments">
            ${innerHtml}
          </div>`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
          break;
        }

        case "hyperlink": {
          const resourceTabResult = result as ResourceTabResult;

          editor?.commands.focus();
          if (
            editor.state.selection.empty &&
            Array.isArray(resourceTabResult.resources)
          ) {
            // One or more internal link(s) are rendered as a LinkerCard.
            resourceTabResult.resources.forEach((link) => {
              editor?.commands.setLinker({
                href: link.path,
                "data-app-prefix": link.application,
                "data-id": link.assetId,
                target: resourceTabResult.target ?? null,
                title: link.name,
              });
              // Add next links afterward.
              if (
                resourceTabResult &&
                resourceTabResult.resources &&
                resourceTabResult.resources.length > 1
              ) {
                editor.commands.enter();
              }
            });
          } else {
            // Links are rendered as Hyperlinks
            // Utility function
            const insertAndSelectText = (name?: string) => {
              if (!name) return;
              const from = editor.state.selection.head;
              const to = from + name.length;
              editor
                ?.chain()
                .insertContent(name)
                .setTextSelection({ from, to })
                .run();
            };

            // *** Case of internal links ***
            if (Array.isArray(resourceTabResult.resources)) {
              if (editor.state.selection.empty) {
                // No text is currently selected.
                // => Insert the name of the first link and select it.
                insertAndSelectText(resourceTabResult.resources[0].name);
              }

              resourceTabResult.resources.forEach((link) => {
                // Add a hyperlink to the selection.
                editor?.commands.setLink({
                  href: link.path,
                  target: resourceTabResult.target ?? null,
                  title: link.name,
                });
                // Cancel selection, so that next links are added afterward.
                const newPosition = editor.state.selection.head;
                editor.commands.setTextSelection({
                  from: newPosition,
                  to: newPosition,
                });
                // Newline needed, unless it is the last link.
                if (
                  resourceTabResult?.resources &&
                  resourceTabResult?.resources?.length > 1
                ) {
                  editor.commands.enter();
                }
              });
            } else {
              // *** Case of external link ***
              const { url, target, text } = result as IExternalLink;
              if (editor.state.selection.empty) {
                // No text is currently selected.
                // => Insert the name of the link and select it.
                insertAndSelectText(text);
              }
              editor?.commands.setLink({
                href: url,
                title: text,
                target,
              });
            }
          }
          break;
        }

        case "embedder": {
          const richContent = `[useToolbarItems/toRichContent] TODO support embedded content`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
          break;
        }

        default:
          return `<div>[useToolbarItems/toRichContent] Le contenu de type "${type}" n'est pas convertissable pour l'instant !</div>`;
      }
    },
    [editor],
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
  }, [fileId, docId, editor, source]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

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
      // Inject the MediaLibrary result into the editor.
      appendAsRichContent(result);

      // Close the MediaLibrary
      mediaLibraryRef.current?.hide();
    }
  };

  const handleLinkerEdit = (attrs: LinkerAttributes) => {
    mediaLibraryRef.current?.editInternalLink({
      target: attrs.target,
      resourceId: attrs["data-id"],
      appPrefix: attrs["data-app-prefix"],
    });
  };

  const handleLinkerOpen = (attrs: LinkerAttributes) => {
    window.open(attrs.href || "about:blank", "_blank");
  };

  const handleLinkerUnlink = (/*attrs: LinkerAttributes*/) => {
    editor?.commands.unsetLinker?.();
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

      <LinkerToolbar
        editor={editor}
        onEdit={handleLinkerEdit}
        onOpen={handleLinkerOpen}
        onUnlink={handleLinkerUnlink}
      />
      {editor && <ImageEditMenu editor={editor} />}

      <TableToolbar editor={editor} />

      <Suspense fallback={<LoadingScreen />}>
        <MediaLibrary
          ref={mediaLibraryRef}
          appCode={appCode}
          onCancel={handleMediaLibraryCancel}
          onSuccess={handleMediaLibrarySuccess}
        />
      </Suspense>

      <Suspense fallback={<LoadingScreen />}>
        {isMathsModalOpen && (
          <MathsModal
            isOpen={isMathsModalOpen}
            onCancel={handleMathsModalCancel}
            onSuccess={handleMathsModalSuccess}
          />
        )}
      </Suspense>
    </>
  );
};

export default Tiptap;
