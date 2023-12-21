import { useEffect } from "react";

import { Audio } from "@edifice-tiptap-extensions/extension-audio";
import { Hyperlink } from "@edifice-tiptap-extensions/extension-hyperlink";
import { IFrame } from "@edifice-tiptap-extensions/extension-iframe";
import { ImageExtend } from "@edifice-tiptap-extensions/extension-image";
import { SpeechRecognition } from "@edifice-tiptap-extensions/extension-speechrecognition";
import SpeechSynthesis from "@edifice-tiptap-extensions/extension-speechsynthesis";
import { TableCell } from "@edifice-tiptap-extensions/extension-table-cell";
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import { Video } from "@edifice-tiptap-extensions/extension-video";
import {
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

/**
 * Hook that creates a tiptap editor instance,
 * and a function to add rich content from the MediaLibrary.
 *
 * @param isEditable truthy if the editor content should be editable
 * @param content default rich content
 */
export const useTipTapEditor = (editable: boolean, content: Content) => {
  const { currentLanguage } = useOdeClient();

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
      ImageExtend,
    ],
    content,
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  return { editor, editable };
};
