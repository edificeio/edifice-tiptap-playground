import { RefAttributes, useEffect, useMemo, useState } from "react";

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
} from "@edifice-ui/icons";
import {
  ColorPalette,
  ColorPicker,
  ColorPickerItem,
  DefaultPalette,
  Dropdown,
  Toolbar,
  ToolbarItem,
  IconButtonProps,
} from "@edifice-ui/react";
import {
  FloatingMenu,
  FloatingMenuProps,
  Editor,
  findParentNodeClosestToPos,
} from "@tiptap/react";
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

  /** Options need some computing */
  const tippyOptions: FloatingMenuProps["tippyOptions"] = useMemo(
    () => ({
      placement: "bottom",
      /** Try to get the bounding rect of the table. */
      getReferenceClientRect: () => {
        const parentDiv = editor?.isActive("table")
          ? findParentNodeClosestToPos(
              editor.state.selection.$anchor,
              (node) => node.type.name === "table",
            )
          : null;

        // Retrieve the <div class="tableWrapper"> that wraps the <table>
        if (parentDiv) {
          const parentDomNode = editor?.view.nodeDOM(parentDiv.pos) as
            | HTMLElement
            | undefined;

          const tableDomNode = parentDomNode?.querySelector("table");
          if (tableDomNode) {
            return tableDomNode.getBoundingClientRect();
          }
        }

        // This should never happen... but it keeps the transpiler happy.
        return new DOMRect(0, 0, 100, 100);
      },
    }),
    [editor, editor?.state],
  );

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

  const tableToolbarItems: ToolbarItem[] = useMemo(() => {
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

    return [
      {
        type: "dropdown",
        name: "bkg-col",
        isEnable: typeof editor?.getAttributes("tableCell") !== "undefined",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
            itemRefs,
          ) => (
            <>
              <Dropdown.Trigger
                variant="ghost"
                aria-label={t("Couleur de fond")}
                icon={
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
                }
              />
              <Dropdown.Menu>
                <ColorPicker
                  ref={(el) => (itemRefs.current["color-picker"] = el)}
                  model={backgroundColor}
                  palettes={[cellBackgroundPalette]}
                  onSuccess={(item) => {
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
              </Dropdown.Menu>
            </>
          ),
        },
      },
      {
        type: "icon",
        name: "mergeorsplit",
        isEnable: typeof isSpan !== "undefined",
        props: {
          icon: isSpan ? <SplitCells /> : <MergeCells />,
          "aria-label": isSpan ? t("Fractionner") : t("Fusionner"),
          onClick: () => editor?.chain().focus().mergeOrSplit().run(),
        },
      },
      {
        type: "divider",
        name: "add-d0",
      },
      {
        type: "dropdown",
        name: "add",
        props: {
          children: () => (
            <>
              <Dropdown.Trigger variant="ghost" label={t("Ajouter")} />
              <Dropdown.Menu>
                <Dropdown.Item
                  key="add-above"
                  icon={<ArrowUp />}
                  onClick={() => editor?.chain().focus().addRowBefore().run()}
                >
                  {t("Ligne au dessus")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="add-below"
                  icon={<ArrowDown />}
                  onClick={() => editor?.chain().focus().addRowAfter().run()}
                >
                  {t("Ligne en dessous")}
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  key="add-left"
                  icon={<ArrowLeft />}
                  onClick={() =>
                    editor?.chain().focus().addColumnBefore().run()
                  }
                >
                  {t("Colonne à gauche")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="add-right"
                  icon={<ArrowRight />}
                  onClick={() => editor?.chain().focus().addColumnAfter().run()}
                >
                  {t("Colonne à droite")}
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  key="header-row"
                  icon={<HighlightRow />}
                  onClick={() =>
                    editor?.chain().focus().toggleHeaderRow().run()
                  }
                >
                  {t("Entête première ligne")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="header-col"
                  icon={<HighlightColumn />}
                  onClick={() =>
                    editor?.chain().focus().toggleHeaderColumn().run()
                  }
                >
                  {t("Entête première colonne")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
      {
        type: "divider",
        name: "add-d1",
      },
      {
        type: "dropdown",
        name: "del",
        props: {
          children: () => (
            <>
              <Dropdown.Trigger variant="ghost" label={t("Supprimer")} />
              <Dropdown.Menu>
                <Dropdown.Item
                  key="del-row"
                  icon={<DeleteRow />}
                  onClick={() => editor?.chain().focus().deleteRow().run()}
                >
                  {t("Supprimer la ligne")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="del-col"
                  icon={<DeleteColumn />}
                  onClick={() => editor?.chain().focus().deleteColumn().run()}
                >
                  {t("Supprimer la colonne")}
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  key="del-header-row"
                  icon={<DeleteRowHighlight />}
                  onClick={() =>
                    editor?.chain().focus().toggleHeaderRow().run()
                  }
                >
                  {t("Supprimer en-tête ligne")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="del-header-col"
                  icon={<DeleteColumnHighlight />}
                  onClick={() =>
                    editor?.chain().focus().toggleHeaderColumn().run()
                  }
                >
                  {t("Supprimer en-tête colonne")}
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  key="del-table"
                  icon={<Delete />}
                  onClick={() => editor?.chain().focus().deleteTable().run()}
                >
                  {t("Supprimer tableau")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
    ];
  }, [backgroundColor, editor, isSpan, t]);

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={() => editor.isActive("table")}
        >
          <Toolbar items={tableToolbarItems} />
        </FloatingMenu>
      )}
    </>
  );
};

export default TableToolbar;
