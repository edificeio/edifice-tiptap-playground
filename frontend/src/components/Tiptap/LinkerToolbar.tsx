import { useEffect, useMemo, useState } from "react";

import { Edit, ExternalLink, Unlink } from "@edifice-ui/icons";
import { Toolbar, ToolbarItem } from "@edifice-ui/react";
import { FloatingMenu, FloatingMenuProps, Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

interface LinkerToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
  /** Handle Edit event */
  onEdit: (attrs: any) => void;
  /** Handle Open event */
  onOpen: (attrs: any) => void;
  /** Handle Unlink event */
  onUnlink: (attrs: any) => void;
}

const LinkerToolbar = ({
  editor,
  onEdit,
  onOpen,
  onUnlink,
}: LinkerToolbarProps) => {
  const { t } = useTranslation();

  // Current Linker node attributes
  const [linkerAttrs, setLinkerAttrs] = useState<
    Record<string, any> | undefined
  >();

  const LinkerToolbarItems: ToolbarItem[] = useMemo(() => {
    return [
      /* FIXME KISS or die
      {
        type: "dropdown",
        name: "display",
        props: {
          children: (
            <>
              <Dropdown.Trigger
                size="sm"
                variant="ghost"
                label={t("Affichage")}
              />
              <Dropdown.Menu>
                <Dropdown.Item
                  key="simple"
                  onClick={() => handleDisplayChange("simple")}
                >
                  {t("Simplifié")}
                </Dropdown.Item>
                <Dropdown.Item
                  key="url"
                  onClick={() => handleDisplayChange("url")}
                >
                  {t("URL")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
      {
        type: "divider",
        name: "d0",
      },
      */
      {
        type: "icon",
        name: "edit",
        props: {
          icon: <Edit />,
          "aria-label": t("Modifier"),
          onClick: () => onEdit?.(linkerAttrs),
        },
      },
      {
        type: "icon",
        name: "open",
        props: {
          icon: <ExternalLink />,
          "aria-label": t("Ouvrir dans un nouvel onglet"),
          onClick: () => onOpen?.(linkerAttrs),
        },
      },
      {
        type: "icon",
        name: "unlink",
        props: {
          icon: <Unlink className="text-danger" />,
          "aria-label": t("Ouvrir dans un nouvel onglet"),
          onClick: () => onUnlink?.(linkerAttrs),
        },
      },
    ];
  }, [onEdit, onOpen, onUnlink, t, linkerAttrs]);

  // Retrieve any selected linker node ONLY WHEN EDITOR STRATE CHANGES
  useEffect(() => {
    setLinkerAttrs(
      editor?.isActive("linker") ? editor.getAttributes("linker") : undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state]);

  // Position options
  const tippyOptions: FloatingMenuProps["tippyOptions"] = {
    placement: "bottom",
    offset: [0, 10],
    zIndex: 999,
  };

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={() => editor.isActive("linker")}
        >
          <Toolbar className="p-4" items={LinkerToolbarItems} />
        </FloatingMenu>
      )}
    </>
  );
};

export default LinkerToolbar;
