import { RefObject } from "react";

import {
  TextVanilla,
  Superscript,
  Subscript,
  SquareRoot,
  Code,
  Table,
  BulletList,
  OrderedList,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "@edifice-ui/icons";
import { DropdownMenuOptions, MediaLibraryRef } from "@edifice-ui/react";
import { Editor } from "@tiptap/react";

export const useActionOptions = (
  editor: Editor | null,
  toggleMathsModal: Function,
  mediaLibraryRef: RefObject<MediaLibraryRef>,
) => {
  const options: DropdownMenuOptions[] = [
    {
      icon: <TextVanilla />,
      label: "Supprimer la mise en forme",
      action: () => editor?.chain().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "divider",
    },
    {
      icon: <Table />,
      label: "Tableau",
      action: () =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      type: "divider",
    },
    {
      icon: <Superscript />,
      label: "Exposant",
      action: () => editor?.chain().focus().toggleSuperscript().run(),
    },
    {
      icon: <Subscript />,
      label: "Indice",
      action: () => editor?.chain().focus().toggleSubscript().run(),
    },
    {
      icon: <SquareRoot />,
      label: "Formule mathématique",
      action: () => {
        toggleMathsModal();
      },
    },
    {
      type: "divider",
    },
    {
      icon: <Code />,
      label: "Élément embed/iframe",
      action: () => mediaLibraryRef.current?.show("embedder"),
    },
  ];
  const listOptions: DropdownMenuOptions[] = [
    {
      icon: <BulletList />,
      label: "Liste à puce",
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <OrderedList />,
      label: "Liste numérotée",
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];
  const alignmentOptions: DropdownMenuOptions[] = [
    {
      icon: <AlignLeft />,
      label: "Aligner à gauche",
      action: () => editor?.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: <AlignCenter />,
      label: "Aligner au centre",
      action: () => editor?.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: <AlignRight />,
      label: "Aligner à droite",
      action: () => editor?.chain().focus().setTextAlign("right").run(),
    },
    {
      icon: <AlignJustify />,
      label: "Justifier",
      action: () => editor?.chain().focus().setTextAlign("justify").run(),
    },
  ];
  return [options, listOptions, alignmentOptions];
};
