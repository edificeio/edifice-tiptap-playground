import { useCallback, useEffect } from "react";

import { Audio } from "@edifice-tiptap-extensions/extension-audio";
import { Hyperlink } from "@edifice-tiptap-extensions/extension-hyperlink";
import { IFrame } from "@edifice-tiptap-extensions/extension-iframe";
import { SpeechRecognition } from "@edifice-tiptap-extensions/extension-speechrecognition";
import SpeechSynthesis from "@edifice-tiptap-extensions/extension-speechsynthesis";
import { TableCell } from "@edifice-tiptap-extensions/extension-table-cell";
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import { Video } from "@edifice-tiptap-extensions/extension-video";
import {
  IExternalLink,
  MediaLibraryResult,
  InternalLinkTabResult,
  useOdeClient,
  MediaRenderer,
  AttachmentRenderer,
  AttachmentNodeView,
  ImageNodeView,
  VideoNodeView,
  AudioNodeView,
  AudioRenderer,
  LinkerNodeView,
  LinkerRenderer,
  MediaLibraryType,
  useToggle,
} from "@edifice-ui/react";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { useEditor, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// eslint-disable-next-line import/order
import { Mathematics } from "@tiptap-pro/extension-mathematics";

import { WorkspaceElement } from "edifice-ts-client";

/**
 * Hook that creates a tiptap editor instance,
 * and a function to add rich content from the MediaLibrary.
 *
 * @param isEditable truthy if the editor content should be editable
 * @param content default rich content
 */
export const useTipTapEditor = (isEditable: boolean, content: Content) => {
  const { currentLanguage } = useOdeClient();

  const [editable, toggleEditable] = useToggle(isEditable);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit as any,
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
            ? `${currentLanguage}-${currentLanguage.toUpperCase()}` // FIXME very dirty hack for demo
            : "fr-FR",
      }),
      IFrame,
      Video,
      AttachmentNodeView(AttachmentRenderer),
      LinkerNodeView(LinkerRenderer),
      Hyperlink,
      ImageNodeView(MediaRenderer),
      VideoNodeView(MediaRenderer),
      FontFamily,
      Mathematics,
      Audio,
      AudioNodeView(AudioRenderer),
    ],
    content,
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  /**
   * Convert the result of a successful action in MediaLibrary
   * - to a call to the editor's dedicated command,
   * or
   * - to an HTML fragment of rich content + insert it.
   *
   * The inital result  depends on the MediaLibrary type.
   */
  const appendMediaLibraryResult = useCallback(
    (type: MediaLibraryType, result: MediaLibraryResult) => {
      if (!type || !editor) return;

      switch (type) {
        // Image type => result is of type WorkspaceElement[]
        case "image": {
          const imgs = result as WorkspaceElement[];
          imgs.forEach((img) => {
            editor
              ?.chain()
              .focus()
              .setNewImage({
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
            editor
              ?.chain()
              .focus()
              .setAudio(snd._id || "", `/workspace/document/${snd._id}`);
          });
          break;
        }

        // Video type => result is of type WorkspaceElement[] or string
        case "video": {
          if (typeof result === "string") {
            editor?.commands.insertContentAt(
              editor.view.state.selection,
              result,
            );
          } else {
            const videos = result as WorkspaceElement[];
            videos.forEach((video) => {
              editor
                ?.chain()
                .focus()
                .setVideo(
                  video._id || "",
                  `/workspace/document/${video._id}`,
                  true,
                );
            });
          }
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
          const resourceTabResult = result as InternalLinkTabResult;
          // Cancel any pre-selected link, see handleLinkEdit()
          if (editor?.isActive("linker")) editor.commands.unsetLinker();
          if (editor?.isActive("hyperlink"))
            editor.commands.toggleMark("hyperlink");

          // Manage new links
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
          const richContent = `[TipTap/toRichContent] TODO support embedded content`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
          break;
        }

        default:
          return `<div>[TipTap/toRichContent] Le contenu de type "${type}" n'est pas convertissable pour l'instant !</div>`;
      }
    },
    [editor],
  );

  return { editor, editable, toggleEditable, appendMediaLibraryResult };
};
