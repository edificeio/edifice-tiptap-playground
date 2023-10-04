import { useEffect, useMemo, useState } from "react";

import {
  HighlightRow,
  HighlightColumn,
  MergeCells,
  SplitCells,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  DeleteRow,
  DeleteColumn,
  DeleteRowHighlight,
  DeleteColumnHighlight,
  Delete,
  RafterDown,
} from "@edifice-ui/icons";
import {
  ActionMenu,
  ActionMenuOptions,
  ColorPalette,
  ColorPicker,
  ColorPickerItem,
  DefaultPalette,
  Toolbar,
  ToolbarOptions,
  NOOP,
  DropdownTrigger,
} from "@edifice-ui/react";
import { FloatingMenu, Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

interface TableToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
}

const TableToolbar = ({ editor }: TableToolbarProps) => {
  const { t } = useTranslation();

  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");

  useEffect(() => {
    // When cursor moves in table, update the current background color.
    setBackgroundColor(
      editor?.getAttributes("tableCell").backgroundColor ?? "transparent",
    );
  }, [editor, editor?.state]);

  const isActive = editor?.isActive("tableCell", {
    backgroundColor: /^#([0-9a-f]{3}){1,2}$/i,
  });

  const [isSpan, setSpan] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const cellAttr = editor?.getAttributes("tableCell");
    const headAttr = editor?.getAttributes("tableHeader");
    if (typeof cellAttr !== "undefined" || typeof headAttr !== "undefined") {
      const newSpan =
        cellAttr?.["colspan"] > 1 ||
        cellAttr?.["rowspan"] > 1 ||
        headAttr?.["colspan"] > 1 ||
        headAttr?.["rowspan"] > 1;
      newSpan !== isSpan && setSpan(newSpan);
    } else {
      isSpan && setSpan(undefined);
    }
  }, [editor, editor?.state, isSpan]);

  const tableToolbarItems: ToolbarOptions[] = useMemo(() => {
    // Manage background colors.
    const cellBackgroundPalette: ColorPalette = {
      ...DefaultPalette,
      label: t("Couleur de cellule"),
      reset: {
        value: "transparent",
        description: t("Aucune"),
        isReset: true,
      },
    };
    const addOptions: ActionMenuOptions[] = [
      {
        action: () => editor?.chain().focus().addRowBefore().run(),
        icon: <ArrowUp />,
        label: t("Ligne au dessus"),
      },
      {
        action: () => editor?.chain().focus().addRowAfter().run(),
        icon: <ArrowDown />,
        label: t("Ligne en dessous"),
      },
      {
        type: "divider",
      },
      {
        action: () => editor?.chain().focus().addColumnBefore().run(),
        icon: <ArrowLeft />,
        label: t("Colonne à gauche"),
      },
      {
        action: () => editor?.chain().focus().addColumnAfter().run(),
        icon: <ArrowRight />,
        label: t("Colonne à droite"),
      },
      {
        type: "divider",
      },
      {
        action: () => editor?.chain().focus().toggleHeaderRow().run(),
        icon: <HighlightRow />,
        label: t("Entête première ligne"),
      },
      {
        action: () => editor?.chain().focus().toggleHeaderColumn().run(),
        icon: <HighlightColumn />,
        label: t("Entête première colonne"),
      },
    ];
    const delOptions: ActionMenuOptions[] = [
      {
        action: () => editor?.chain().focus().deleteRow().run(),
        icon: <DeleteRow />,
        label: t("Supprimer la ligne"),
      },
      {
        action: () => editor?.chain().focus().deleteColumn().run(),
        icon: <DeleteColumn />,
        label: t("Supprimer la colonne"),
      },
      {
        type: "divider",
      },
      {
        action: () => editor?.chain().focus().toggleHeaderRow().run(),
        icon: <DeleteRowHighlight />,
        label: t("Supprimer en-tête ligne"),
      },
      {
        action: () => editor?.chain().focus().toggleHeaderColumn().run(),
        icon: <DeleteColumnHighlight />,
        label: t("Supprimer en-tête colonne"),
      },
      {
        type: "divider",
      },
      {
        action: () => editor?.chain().focus().deleteTable().run(),
        icon: <Delete />,
        label: t("Supprimer tableau"),
      },
    ];

    return [
      {
        action: NOOP,
        name: "backgroundColor",
        icon: (
          <ColorPickerItem
            model={{
              value: backgroundColor,
              description: "",
              isReset:
                !backgroundColor ||
                backgroundColor.length === 0 ||
                backgroundColor === "transparent",
            }}
          />
        ),
        label: t("Couleur de fond"),
        isActive: isActive,
        hasDropdown: true,
        content: () => (
          <ColorPicker
            model={backgroundColor}
            palettes={[cellBackgroundPalette]}
            onChange={(item) => {
              editor
                ?.chain()
                .focus()
                .setCellAttribute(
                  "backgroundColor",
                  // reset color is transparent here => remove bkg color
                  item.value === "transparent" ? "" : item.value,
                )
                .run();
              setBackgroundColor(item.value);
            }}
          />
        ),
        isEnable: typeof editor?.getAttributes("tableCell") !== "undefined",
      },
      {
        name: "mergeorsplit",
        icon: isSpan ? <SplitCells /> : <MergeCells />,
        label: "",
        action: () => editor?.chain().focus().mergeOrSplit().run(),
        isEnable: typeof isSpan !== "undefined",
      },
      {
        type: "divider",
      },
      {
        action: NOOP,
        icon: <DropdownTrigger title={t("Supprimer")}></DropdownTrigger>,
        label: t("Ajouter"),
        name: "add",
        hasDropdown: true,
        content: () => (
          <ActionMenu id="action-menu-list" options={addOptions} />
        ),
        isEnable: true,
      },
      {
        type: "divider",
      },
      {
        action: NOOP,
        icon: <RafterDown />,
        label: t("Supprimer"),
        name: "delete",
        hasDropdown: true,
        content: () => (
          <ActionMenu id="action-menu-list" options={delOptions} />
        ),
        isEnable: true,
      },
    ];
  }, [backgroundColor, editor, isActive, isSpan, t]);

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{
            placement: "bottom",
          }}
          shouldShow={() => editor.isActive("table")}
        >
          <Toolbar data={tableToolbarItems} />
        </FloatingMenu>
      )}
    </>
  );
};

export default TableToolbar;
