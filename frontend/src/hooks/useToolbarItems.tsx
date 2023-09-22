import { useEffect, useState } from "react";

import { TypoSizeLevel } from "@edifice-tiptap-extensions/extension-typosize";
import {
  AlignLeft,
  Paperclip,
  BulletList,
  Landscape,
  Link,
  Mic,
  RecordVideo,
  Smiley,
  TextBold,
  TextColor,
  TextHighlight,
  TextItalic,
  TextSize,
  TextTypo,
  TextUnderline,
} from "@edifice-ui/icons";
import {
  AccessiblePalette,
  ActionMenu,
  ActionMenuOptions,
  ColorPalette,
  ColorPicker,
  DefaultPalette,
  SelectList,
  ToolbarOptions,
  useHasWorkflow,
  NOOP,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import EmojiPicker, { Categories } from "emoji-picker-react";
import { useTranslation } from "react-i18next";

export const useToolbarItems = (
  editor: Editor | null,
  listOptions: ActionMenuOptions[],
  alignmentOptions: ActionMenuOptions[],
) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Manage text and background colors.
  const sharedAccessiblePalette: ColorPalette = {
    ...AccessiblePalette,
    label: t("Accessible palette"),
    tooltip: {
      message: t(
        "Cette palette assure un contraste qui permet aux personnes atteintes de daltonisme de distinguer les différentes nuances de couleurs.",
      ),
      placement: "right",
    },
  };
  const [textColor, setTextColor] = useState<string>("#4A4A4A");
  const [highlightColor, setHighlightColor] = useState<string>("");

  useEffect(() => {
    // When cursor moves in editor, update the text and background colors.
    setTextColor(editor?.getAttributes("textStyle").color ?? "#4A4A4A");
    setHighlightColor(editor?.getAttributes("highlight").color ?? "");
  }, [editor, editor?.state]);

  const canRecord = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|view",
  );

  const toolbarItems: ToolbarOptions[] = [
    {
      action: () => console.log("on click"),
      icon: <Landscape />,
      label: "image",
      name: "image",
      className: "widget-image",
      isEnable: true,
    },
    {
      action: () => console.log("on click"),
      icon: <RecordVideo />,
      label: "video",
      name: "video",
      className: "widget-video",
      isEnable: !!canRecord,
    },
    {
      action: () => console.log("on click"),
      icon: <Mic />,
      label: "audio",
      name: "audio",
      className: "widget-audio",
      isEnable: true,
    },
    {
      action: () => console.log("on click"),
      icon: <Paperclip />,
      label: "attachment",
      name: "attachment",
      className: "widget-attachment",
      isEnable: true,
    },
    {
      type: "divider",
    },
    {
      name: "text_typo",
      icon: <TextTypo />,
      label: "Choix de la famille de typographie",
      hasDropdown: true,
      content: () => (
        <SelectList
          onChange={([fontFamily]) => {
            if (typeof fontFamily === "string" && fontFamily.length > 0) {
              editor?.chain().focus().setFontFamily(fontFamily).run();
            } else {
              editor?.chain().focus().unsetFontFamily().run();
            }
          }}
          isMonoSelection
          hideCheckbox
          options={[
            {
              value: "",
              label: t("Sans-serif"),
            },
            {
              value: "Lora",
              label: t("Serif"),
              className: "ff-serif",
            },
            {
              value: "IBM Plex Mono",
              label: t("Monoscript"),
              className: "ff-script",
            },
            {
              value: "Ecriture A",
              label: t("Cursive"),
              className: "ff-cursive",
            },
            {
              value: "OpenDyslexic",
              label: t("OpenDyslexic"),
              className: "ff-dyslexic",
            },
          ]}
        />
      ),
      action: () => console.log("click"),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "fontFamily",
      ),
    },
    {
      name: "text_size",
      icon: <TextSize />,
      label: "Choix de la taille de typographie",
      hasDropdown: true,
      content: () => (
        <SelectList
          onChange={([value]) => {
            editor
              ?.chain()
              .focus()
              .toggleTypoSize({ level: value as TypoSizeLevel })
              .run();
          }}
          isMonoSelection
          hideCheckbox
          options={[
            {
              value: 2,
              label: t("Titre 1"),
              className: "fs-2 fw-bold",
            },
            {
              value: 3,
              label: t("Titre 2"),
              className: "fs-3 fw-bold",
            },
            {
              value: 4,
              label: t("Texte grand"),
              className: "fs-4",
            },
            {
              value: 5,
              label: t("Texte normal"),
            },
            {
              value: 6,
              label: t("Texte petit"),
              className: "fs-6",
            },
          ]}
        />
      ),
      action: () => console.log("click"),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "typoSize",
      ),
    },
    {
      action: () => console.log("on click"),
      name: "color",
      icon: <TextColor />,
      label: "Couleur de texte",
      isActive: editor?.isActive("textStyle", {
        color: /^#([0-9a-f]{3}){1,2}$/i,
      }),
      hasDropdown: true,
      content: () => (
        <ColorPicker
          model={textColor}
          palettes={[
            { ...DefaultPalette, label: t("Couleur de texte") },
            sharedAccessiblePalette,
          ]}
          onChange={(color) => {
            // If the same color is picked, remove it (=toggle mode).
            if (color === textColor) {
              setTextColor("");
              editor?.chain().focus().unsetColor().run();
            } else {
              setTextColor(color);
              editor?.chain().focus().setColor(color).run();
            }
          }}
        />
      ),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) =>
          item.name === "color" &&
          !!editor?.extensionManager.splittableMarks.includes("textStyle"),
      ),
    },
    {
      action: () => console.log("on click"),
      name: "highlight",
      icon: <TextHighlight />,
      label: "Couleur de fond",
      isActive: editor?.isActive("highlight", {
        color: /^#([0-9a-f]{3}){1,2}$/i,
      }),
      hasDropdown: true,
      content: () => (
        <ColorPicker
          model={highlightColor}
          palettes={[
            { ...DefaultPalette, label: t("Couleur de fond") },
            sharedAccessiblePalette,
          ]}
          onChange={(color) => {
            // If the same color is picked, remove it (=toggle mode).
            if (color === highlightColor) {
              setHighlightColor("");
              editor?.chain().focus().unsetHighlight().run();
            } else {
              setHighlightColor(color);
              editor?.chain().focus().setHighlight({ color: color }).run();
            }
          }}
        />
      ),
      isEnable:
        !!editor?.extensionManager.splittableMarks.includes("highlight"),
    },
    {
      type: "divider",
    },
    {
      name: "bold",
      icon: <TextBold />,
      label: "Ajout de gras",
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      isEnable: !!editor?.extensionManager.splittableMarks.includes("bold"),
    },
    {
      name: "italic",
      icon: <TextItalic />,
      label: "Incliner le texte",
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      isEnable: !!editor?.extensionManager.splittableMarks.includes("italic"),
    },
    {
      name: "underline",
      icon: <TextUnderline />,
      label: "Souligner le texte",
      action: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive("underline"),
      isEnable:
        !!editor?.extensionManager.splittableMarks.includes("underline"),
    },
    {
      type: "divider",
    },
    {
      name: "emoji",
      icon: <Smiley />,
      label: "Emojis",
      isActive: false,
      isEnable: true,
      action: NOOP,
      hasDropdown: true,
      content: () => (
        <EmojiPicker
          height={400}
          width={316}
          onEmojiClick={(emoji) =>
            editor?.commands.insertContentAt(
              editor.view.state.selection,
              emoji.emoji,
            )
          }
          previewConfig={{ showPreview: false }}
          searchPlaceHolder={t("Recherche")}
          categories={[
            {
              category: Categories.SUGGESTED,
              name: `${t("Utilisés récemment")}`,
            },
            {
              category: Categories.SMILEYS_PEOPLE,
              name: `${t("Personnes")}`,
            },
            {
              category: Categories.ANIMALS_NATURE,
              name: `${t("Animaux et nature")}`,
            },
            {
              category: Categories.FOOD_DRINK,
              name: `${t("Aliments et boissons")}`,
            },
            {
              category: Categories.TRAVEL_PLACES,
              name: `${t("Voyages et lieux")}`,
            },
            {
              category: Categories.ACTIVITIES,
              name: `${t("Activités")}`,
            },
            {
              category: Categories.OBJECTS,
              name: `${t("Objets")}`,
            },
            {
              category: Categories.SYMBOLS,
              name: `${t("Symbôles")}`,
            },
            {
              category: Categories.FLAGS,
              name: `${t("Drapeaux")}`,
            },
          ]}
        />
      ),
    },
    {
      name: "linker",
      icon: <Link />,
      label: "Ajout d'un lien",
      isActive: editor?.isActive("linker"),
      isEnable: true,
      action: () => console.log("click"),
    },
    {
      type: "divider",
    },
    {
      action: () => console.log("on click"),
      icon: <BulletList />,
      label: "list",
      name: "list",
      hasDropdown: true,
      content: () => <ActionMenu id="action-menu-list" options={listOptions} />,
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      ),
    },
    {
      action: () => console.log("on click"),
      icon: <AlignLeft />,
      label: "alignment",
      name: "alignment",
      hasDropdown: true,
      content: () => (
        <ActionMenu id="action-menu-list" options={alignmentOptions} />
      ),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      ),
    },
    {
      type: "divider",
    },
  ];
  return { toolbarItems, isOpen, setIsOpen };
};
