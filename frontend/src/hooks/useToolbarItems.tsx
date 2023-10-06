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
  ToolbarOptions,
  useHasWorkflow,
  NOOP,
  MediaLibraryResult,
  MediaLibraryType,
  IconButton,
  DropdownMenuOptions,
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

  useEffect(() => {
    // When cursor moves in editor, update the text and background colors.
    setTextColor(editor?.getAttributes("textStyle").color ?? "#4A4A4A");
    setHighlightColor(editor?.getAttributes("highlight").color ?? "");
  }, [editor, editor?.state]);

  const canRecord = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|capture",
  );

  const [value, setValue] = useState<string>("sans-serif");

  const [size, setSize] = useState<TypoSizeLevel>();

  const toolbarItems: ToolbarOptions[] = [
    {
      action: () => showMediaLibraryForType("image"),
      icon: <Landscape />,
      label: "image",
      name: "image",
      className: "widget-image",
    },
    {
      action: () => showMediaLibraryForType("video"),
      icon: <RecordVideo />,
      label: "video",
      name: "video",
      className: "widget-video",
      isDisabled: !canRecord,
    },
    {
      action: () => showMediaLibraryForType("audio"),
      icon: <Mic />,
      label: "audio",
      name: "audio",
      className: "widget-audio",
    },
    {
      action: () => showMediaLibraryForType("attachment"),
      icon: <Paperclip />,
      label: "attachment",
      name: "attachment",
      className: "widget-attachment",
    },
    {
      type: "divider",
    },
    {
      name: "text_typo",
      icon: <TextTypo />,
      label: "Choix de la famille de typographie",
      hasDropdown: true,
      content: (item) => (
        <Dropdown>
          {(triggerProps) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
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
                ].map((option, index) => {
                  return (
                    <Fragment key={option.label}>
                      {index !== 0 ? <Dropdown.Separator /> : null}
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
                        {option.label}
                      </Dropdown.RadioItem>
                    </Fragment>
                  );
                })}
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      action: () => console.log("click"),
      isDisabled: !editor?.extensionManager.extensions.find(
        (item) => item.name === "fontFamily",
      ),
    },
    {
      name: "text_size",
      icon: <TextSize />,
      label: "Choix de la taille de typographie",
      hasDropdown: true,
      content: (item) => (
        <Dropdown>
          {(triggerProps) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
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
                ].map((option, index) => {
                  return (
                    <Fragment key={option.label}>
                      {index !== 0 ? <Dropdown.Separator /> : null}
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
                        {option.label}
                      </Dropdown.RadioItem>
                    </Fragment>
                  );
                })}
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      action: () => console.log("click"),
      isDisabled: !editor?.extensionManager.extensions.find(
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
      content: (item) => (
        <Dropdown>
          {(triggerProps, itemRefs) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
              />
              <Dropdown.Menu>
                <ColorPicker
                  ref={(el) => (itemRefs.current["color-picker"] = el)}
                  model={textColor}
                  palettes={[
                    { ...DefaultPalette, label: t("Couleur de texte") },
                    sharedAccessiblePalette,
                  ]}
                  onSuccess={(color: string) => {
                    console.log({ color });
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
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      isDisabled: !editor?.extensionManager.extensions.find(
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
      content: (item) => (
        <Dropdown>
          {(triggerProps, itemRefs) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
              />
              <Dropdown.Menu>
                <ColorPicker
                  ref={(el) => (itemRefs.current["highlight-picker"] = el)}
                  palettes={[
                    {
                      ...DefaultPalette,
                      reset: { value: "transparent", description: "None" },
                    },
                  ]}
                  model={highlightColor}
                  onSuccess={(color: string) => {
                    // If the same color is picked, remove it (=toggle mode).
                    if (color === highlightColor) {
                      setHighlightColor("");
                      editor?.chain().focus().unsetHighlight().run();
                    } else {
                      setHighlightColor(color);
                      editor
                        ?.chain()
                        .focus()
                        .setHighlight({ color: color })
                        .run();
                    }
                  }}
                />
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      isDisabled:
        !editor?.extensionManager.splittableMarks.includes("highlight"),
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
      isDisabled: !editor?.extensionManager.splittableMarks.includes("bold"),
    },
    {
      name: "italic",
      icon: <TextItalic />,
      label: "Incliner le texte",
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      isDisabled: !editor?.extensionManager.splittableMarks.includes("italic"),
    },
    {
      name: "underline",
      icon: <TextUnderline />,
      label: "Souligner le texte",
      action: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive("underline"),
      isDisabled:
        !editor?.extensionManager.splittableMarks.includes("underline"),
    },
    {
      type: "divider",
    },
    {
      name: "emoji",
      icon: <Smiley />,
      label: "Emojis",
      isActive: false,
      action: NOOP,
      hasDropdown: true,
      content: (item) => (
        <Dropdown overflow={false}>
          {(triggerProps, itemRefs) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
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
          )}
        </Dropdown>
      ),
    },
    {
      name: "linker",
      icon: <Link />,
      label: "Ajout d'un lien",
      isActive: editor?.isActive("linker"),
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
      content: (item) => (
        <Dropdown>
          {(triggerProps) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
              />
              <Dropdown.Menu>
                {listOptions.map((option, index) => {
                  return (
                    <Fragment key={index}>
                      {option.type === "divider" ? (
                        <Dropdown.Separator />
                      ) : (
                        <Dropdown.Item
                          icon={option.icon}
                          onClick={option.action}
                        >
                          {option.label}
                        </Dropdown.Item>
                      )}
                    </Fragment>
                  );
                })}
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      isDisabled: !editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      ),
    },
    {
      action: () => console.log("on click"),
      icon: <AlignLeft />,
      label: "alignment",
      name: "alignment",
      hasDropdown: true,
      content: (item) => (
        <Dropdown>
          {(triggerProps) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                aria-label={item.label}
                color="tertiary"
                variant="ghost"
                icon={item.icon}
              />
              <Dropdown.Menu>
                {alignmentOptions.map((option, index) => {
                  return (
                    <Fragment key={index}>
                      {option.type === "divider" ? (
                        <Dropdown.Separator />
                      ) : (
                        <Dropdown.Item
                          icon={option.icon}
                          onClick={option.action}
                        >
                          {option.label}
                        </Dropdown.Item>
                      )}
                    </Fragment>
                  );
                })}
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      ),
      isDisabled: !editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      ),
    },
    {
      type: "divider",
    },
    {
      action: () => console.log("on click"),
      icon: <AlignLeft />,
      label: "alignment",
      name: "alignment",
      hasDropdown: true,
      content: () => (
        <Dropdown>
          <Dropdown.Trigger
            label={t("Plus")}
            variant="ghost"
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
        </Dropdown>
      ),
      isDisabled: !editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      ),
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
