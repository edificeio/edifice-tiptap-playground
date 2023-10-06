import { useCallback, useEffect, useState, Fragment } from "react";

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
  Dropdown,
  ColorPalette,
  ColorPicker,
  DefaultPalette,
  ToolbarItem,
  useHasWorkflow,
  MediaLibraryResult,
  MediaLibraryType,
  DropdownMenuOptions,
  ColorPaletteItem,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { WorkspaceElement } from "edifice-ts-client";
import EmojiPicker, { Categories } from "emoji-picker-react";
import { useTranslation } from "react-i18next";

export const useToolbarItems = (
  editor: Editor | null,
  showMediaLibraryForType: (type: MediaLibraryType | null) => void,
  listOptions: DropdownMenuOptions[],
  alignmentOptions: DropdownMenuOptions[],
  options: DropdownMenuOptions[],
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
  const [value, setValue] = useState<string>("sans-serif");
  const [size, setSize] = useState<TypoSizeLevel>();

  useEffect(() => {
    // When cursor moves in editor, update the text values.
    const textStyle = editor?.getAttributes("textStyle");
    setTextColor(textStyle?.color ?? "#4A4A4A");
    setHighlightColor(editor?.getAttributes("highlight").color ?? "");
    setValue(textStyle?.fontFamily ?? "");
    // TODO setSize( ?? 5);
  }, [editor, editor?.state]);

  const canRecord = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|view",
  );

  const toolbarItems: ToolbarItem[] = [
    {
      type: "icon",
      props: {
        icon: <Landscape />,
        className: "widget-image",
        "aria-label": t("Insérer une image"),
        onClick: () => showMediaLibraryForType("image"),
      },
      name: "image",
    },
    {
      type: "icon",
      props: {
        icon: <RecordVideo />,
        className: "widget-video",
        "aria-label": t("Insérer une vidéo"),
        onClick: () => showMediaLibraryForType("video"),
      },
      name: "video",
      isHidden: !canRecord,
    },
    {
      type: "icon",
      props: {
        icon: <Mic />,
        className: "widget-audio",
        "aria-label": t("Insérer une piste audio"),
        onClick: () => showMediaLibraryForType("audio"),
      },
      name: "audio",
    },
    {
      type: "icon",
      props: {
        icon: <Paperclip />,
        className: "widget-attachment",
        "aria-label": t("Insérer une pièce jointe"),
        onClick: () => showMediaLibraryForType("attachment"),
      },
      name: "attachment",
    },
    {
      type: "divider",
      name: "div-1",
    },
    {
      type: "dropdown",
      props: {
        children: () => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<TextTypo />}
              aria-label={t("Choix de la famille de typographie")}
            />
            <Dropdown.Menu>
              {[
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
              ].map((option) => {
                return (
                  <Fragment key={option.label}>
                    <Dropdown.RadioItem
                      value={option.value}
                      model={value}
                      onChange={(value: string) => {
                        if (typeof value === "string" && value.length > 0) {
                          editor?.chain().focus().setFontFamily(value).run();
                          setValue(value);
                        } else {
                          editor?.chain().focus().unsetFontFamily().run();
                          setValue("");
                        }
                        setValue(value);
                      }}
                    >
                      <span className={option.className}>{option.label}</span>
                    </Dropdown.RadioItem>
                  </Fragment>
                );
              })}
            </Dropdown.Menu>
          </>
        ),
      },
      name: "text_typo",
      isHidden: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "fontFamily",
      ),
    },
    {
      type: "dropdown",
      props: {
        children: () => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<TextSize />}
              aria-label={t("Choix de la taille de typographie")}
            />
            <Dropdown.Menu>
              {[
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
              ].map((option) => {
                return (
                  <Fragment key={option.label}>
                    <Dropdown.RadioItem
                      value={option.value}
                      model={size}
                      onChange={(value: TypoSizeLevel) => {
                        editor
                          ?.chain()
                          .focus()
                          .toggleTypoSize({ level: value as TypoSizeLevel })
                          .run();
                        setSize(value);
                      }}
                    >
                      <span className={option.className}>{option.label}</span>
                    </Dropdown.RadioItem>
                  </Fragment>
                );
              })}
            </Dropdown.Menu>
          </>
        ),
      },
      name: "text_size",
      isHidden: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "typoSize",
      ),
    },
    {
      type: "dropdown",
      props: {
        children: (triggerProps, itemRefs) => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<TextColor />}
              aria-label={t("Couleur de texte")}
              className={
                editor?.isActive("textStyle", {
                  color: /^#([0-9a-f]{3}){1,2}$/i,
                })
                  ? "selected"
                  : ""
              }
            />
            <Dropdown.Menu>
              <ColorPicker
                ref={(el) => (itemRefs.current["color-picker"] = el)}
                model={textColor}
                palettes={[
                  { ...DefaultPalette, label: t("Couleur de texte") },
                  sharedAccessiblePalette,
                ]}
                onSuccess={(color: ColorPaletteItem) => {
                  // If the same color is picked, remove it (=toggle mode).
                  if (color.value === textColor) {
                    setTextColor("");
                    editor?.chain().focus().unsetColor().run();
                  } else {
                    setTextColor(color.value);
                    editor?.chain().focus().setColor(color.value).run();
                  }
                }}
              />
            </Dropdown.Menu>
          </>
        ),
      },
      name: "color",
      isHidden: !!editor?.extensionManager.extensions.find(
        (item) =>
          item.name === "color" &&
          !!editor?.extensionManager.splittableMarks.includes("textStyle"),
      ),
    },
    {
      type: "dropdown",
      props: {
        children: (triggerProps, itemRefs) => (
          <>
            <Dropdown.Trigger
              disabled={editor?.isActive("highlight", {
                color: /^#([0-9a-f]{3}){1,2}$/i,
              })}
              variant="ghost"
              icon={<TextHighlight />}
              aria-label={t("Couleur de fond")}
            />
            <Dropdown.Menu>
              <ColorPicker
                ref={(el) => (itemRefs.current["color-picker"] = el)}
                palettes={[
                  {
                    ...DefaultPalette,
                    reset: { value: "transparent", description: "None" },
                  },
                ]}
                model={highlightColor}
                onSuccess={(color: ColorPaletteItem) => {
                  // If the same color is picked, remove it (=toggle mode).
                  if (color.value === highlightColor || color.value === "") {
                    setHighlightColor("");
                    editor?.chain().focus().unsetHighlight().run();
                  } else {
                    setHighlightColor(color.value);
                    editor
                      ?.chain()
                      .focus()
                      .setHighlight({ color: color.value })
                      .run();
                  }
                }}
              />
            </Dropdown.Menu>
          </>
        ),
      },
      name: "highlight",
      isHidden:
        !!editor?.extensionManager.splittableMarks.includes("highlight"),
    },
    {
      type: "divider",
      name: "div-2",
    },
    {
      type: "icon",
      props: {
        icon: <TextBold />,
        "aria-label": t("Ajout de gras"),
        disabled: !editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      name: "bold",
      isHidden: !!editor?.extensionManager.splittableMarks.includes("bold"),
    },
    {
      type: "icon",
      props: {
        icon: <TextItalic />,
        "aria-label": t("Incliner le text"),
        disabled: !editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      name: "italic",
      isHidden: !!editor?.extensionManager.splittableMarks.includes("italic"),
    },
    {
      type: "icon",
      props: {
        icon: <TextUnderline />,
        "aria-label": t("Souligner le texte"),
        disabled: !editor?.isActive("underline"),
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
      name: "underline",
      isHidden:
        !!editor?.extensionManager.splittableMarks.includes("underline"),
    },
    {
      type: "divider",
      name: "div-3",
    },
    {
      type: "dropdown",
      props: {
        children: (triggerProps, itemRefs) => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<Smiley />}
              aria-label={t("Emojis")}
            />
            <Dropdown.Menu>
              <div ref={(el) => (itemRefs.current["highlight-picker"] = el)}>
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
              </div>
            </Dropdown.Menu>
          </>
        ),
      },
      name: "emoji",
      isHidden:
        !!editor?.extensionManager.splittableMarks.includes("highlight"),
    },
    {
      type: "icon",
      props: {
        icon: <Link />,
        "aria-label": t("Ajout d'un lien"),
        disabled: !editor?.isActive("linker"),
        onClick: () => console.log("click"),
      },
      name: "linker",
    },
    {
      type: "divider",
      name: "div-4",
    },
    {
      type: "dropdown",
      props: {
        children: () => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<BulletList />}
              aria-label={t("Options d'affichage en liste")}
            />
            <Dropdown.Menu>
              {listOptions.map((option, index) => {
                return (
                  <Fragment key={index}>
                    {option.type === "divider" ? (
                      <Dropdown.Separator />
                    ) : (
                      <Dropdown.Item icon={option.icon} onClick={option.action}>
                        {option.label}
                      </Dropdown.Item>
                    )}
                  </Fragment>
                );
              })}
            </Dropdown.Menu>
          </>
        ),
      },
      name: "list",
      isHidden: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      ),
    },
    {
      type: "dropdown",
      props: {
        children: () => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<AlignLeft />}
              aria-label={t("Options d'alignement")}
            />
            <Dropdown.Menu>
              {alignmentOptions.map((option, index) => {
                return (
                  <Fragment key={index}>
                    {option.type === "divider" ? (
                      <Dropdown.Separator />
                    ) : (
                      <Dropdown.Item icon={option.icon} onClick={option.action}>
                        {option.label}
                      </Dropdown.Item>
                    )}
                  </Fragment>
                );
              })}
            </Dropdown.Menu>
          </>
        ),
      },
      name: "alignment",
      isHidden: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      ),
    },
    {
      type: "divider",
      name: "div-5",
    },
    {
      type: "dropdown",
      props: {
        children: () => (
          <>
            <Dropdown.Trigger
              variant="ghost"
              icon={<AlignLeft />}
              label={t("Plus")}
              size="md"
              tabIndex={-1}
            />
            <Dropdown.Menu>
              {options.map((option, index) => {
                return (
                  <Fragment key={index}>
                    {option.type === "divider" ? (
                      <Dropdown.Separator />
                    ) : (
                      <Dropdown.Item icon={option.icon} onClick={option.action}>
                        {option.label}
                      </Dropdown.Item>
                    )}
                  </Fragment>
                );
              })}
            </Dropdown.Menu>
          </>
        ),
      },
      name: "plus",
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
              .setImage({
                src: `/workspace/document/${img._id}`,
                alt: img.alt,
                title: img.title,
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
          const richContent = `[useToolbarItems/toRichContent] TODO support video tags`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
          break;
        }

        case "attachment": {
          const richContent = `[useToolbarItems/toRichContent] TODO support attachments`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
          break;
        }

        case "hyperlink": {
          const richContent = `[useToolbarItems/toRichContent] TODO support hyperlinks`;
          editor?.commands.insertContentAt(
            editor.view.state.selection,
            richContent,
          );
          editor?.commands.enter();
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
  return { toolbarItems, isOpen, setIsOpen, appendAsRichContent };
};
