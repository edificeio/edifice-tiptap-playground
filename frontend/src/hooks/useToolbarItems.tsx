import {
  useCallback,
  useEffect,
  useState,
  Fragment,
  RefAttributes,
} from "react";

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
  // SpeechToText,
} from "@edifice-ui/icons";
import {
  AccessiblePalette,
  Dropdown,
  ColorPalette,
  ColorPicker,
  DefaultPalette,
  ToolbarItem,
  MediaLibraryResult,
  MediaLibraryType,
  DropdownMenuOptions,
  ColorPaletteItem,
  IconButton,
  IconButtonProps,
} from "@edifice-ui/react";
import { ResourceTabResult } from "@edifice-ui/react";
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

  /* TODO : à migrer dans l'extension TipTap ? */
  /* const canRecognizeSpeech =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      ? true
      : false; */

  const toolbarItems: ToolbarItem[] = [
    {
      type: "icon",
      props: {
        icon: <Landscape />,
        className: "bg-green-200",
        "aria-label": t("Insérer une image"),
        onClick: () => showMediaLibraryForType("image"),
      },
      name: "image",
    },
    {
      type: "icon",
      props: {
        icon: <RecordVideo />,
        className: "bg-purple-200",
        "aria-label": t("Insérer une vidéo"),
        onClick: () => showMediaLibraryForType("video"),
      },
      name: "video",
    },
    {
      type: "icon",
      props: {
        icon: <Mic />,
        className: "bg-red-200",
        "aria-label": t("Insérer une piste audio"),
        onClick: () => showMediaLibraryForType("audio"),
      },
      name: "audio",
    },
    {
      type: "icon",
      props: {
        icon: <Paperclip />,
        className: "bg-yellow-200",
        "aria-label": t("Insérer une pièce jointe"),
        onClick: () => showMediaLibraryForType("attachment"),
      },
      name: "attachment",
    },
    {
      type: "divider",
      name: "div-1",
    },
    /* {
      type: "icon",
      props: {
        icon: <SpeechToText />,
        "aria-label": t("Reconnaissance vocale"),
        className: editor?.commands.isSpeechRecognitionStarted()
          ? "is-selected"
          : "",
        onClick: () => {
          if (editor?.commands.isSpeechRecognitionStarted()) {
            editor?.commands.stopSpeechRecognition();
          } else {
            editor?.commands.startSpeechRecognition();
          }
        },
      },
      visibility: canRecognizeSpeech ? "show" : "hide",
      name: "speechtotext",
    },
    {
      type: "divider",
      name: "div-speech",
      visibility: canRecognizeSpeech ? "show" : "hide",
    }, */
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
              icon={<TextTypo />}
              aria-label={t("Choix de la famille de typographie")}
              className={
                editor?.isActive("textStyle", {
                  color: /^#([0-9a-f]{3}){1,2}$/i,
                })
                  ? "selected"
                  : ""
              }
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
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "fontFamily",
      )
        ? "show"
        : "hide",
    },
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
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
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "typoSize",
      )
        ? "show"
        : "hide",
    },
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
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
      visibility: editor?.extensionManager.extensions.find(
        (item) =>
          item.name === "color" &&
          !!editor?.extensionManager.splittableMarks.includes("textStyle"),
      )
        ? "show"
        : "hide",
    },
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
              icon={<TextHighlight />}
              aria-label={t("Couleur de fond")}
              className={
                editor?.isActive("highlight", {
                  color: /^#([0-9a-f]{3}){1,2}$/i,
                })
                  ? "selected"
                  : ""
              }
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
      visibility: editor?.extensionManager.splittableMarks.includes("highlight")
        ? "show"
        : "hide",
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
        className: editor?.isActive("bold") ? "is-selected" : "",
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      name: "bold",
      visibility: editor?.extensionManager.splittableMarks.includes("bold")
        ? "show"
        : "hide",
    },
    {
      type: "icon",
      props: {
        icon: <TextItalic />,
        "aria-label": t("Incliner le text"),
        className: editor?.isActive("italic") ? "is-selected" : "",
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      name: "italic",
      visibility: editor?.extensionManager.splittableMarks.includes("italic")
        ? "show"
        : "hide",
    },
    {
      type: "icon",
      props: {
        icon: <TextUnderline />,
        "aria-label": t("Souligner le texte"),
        className: editor?.isActive("underline") ? "is-selected" : "",
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
      name: "underline",
      visibility: editor?.extensionManager.splittableMarks.includes("underline")
        ? "show"
        : "hide",
    },
    {
      type: "divider",
      name: "div-3",
    },
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
              icon={<Smiley />}
              aria-label={t("Emojis")}
            />
            <Dropdown.Menu>
              <div ref={(el) => (itemRefs.current["emoji-picker"] = el)}>
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
      visibility: editor?.extensionManager.splittableMarks.includes("highlight")
        ? "show"
        : "hide",
    },
    {
      type: "icon",
      props: {
        icon: <Link />,
        "aria-label": t("Ajout d'un lien"),
        className: editor?.isActive("linker") ? "is-selected" : "",
        onClick: () => showMediaLibraryForType("hyperlink"),
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
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
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
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      )
        ? "show"
        : "hide",
    },
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              variant="ghost"
              color="tertiary"
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
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      )
        ? "show"
        : "hide",
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
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      )
        ? "show"
        : "hide",
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
          if (Array.isArray(resourceTabResult.resources)) {
            // Case of internal link
            resourceTabResult.resources.forEach((link) => {
              // If no text is pre-selected,
              if (editor.state.selection.empty) {
                const from = editor.state.selection.head;
                const to = from + link.name.length;
                // Insert the name of the link and select it.
                editor
                  ?.chain()
                  .insertContent(link.name)
                  .setTextSelection({ from, to })
                  .run();
                // Add a link to it.
                editor?.commands.setLinker({
                  href: link.path,
                  "data-app-prefix": link.application,
                  "data-id": link.assetId,
                  target: resourceTabResult.target ?? null,
                  title: link.name,
                });
                // Cancel selection, so that next links are added afterward.
                const newPosition = editor.state.selection.head;
                editor.commands.setTextSelection({
                  from: newPosition,
                  to: newPosition,
                });
                if (
                  resourceTabResult &&
                  resourceTabResult.resources &&
                  resourceTabResult.resources.length > 1
                ) {
                  editor.commands.enter();
                }
              } else {
                // Add a link to selected text.
                editor.commands.setLinker({
                  href: link.path,
                  "data-app-prefix": link.application,
                  "data-id": link.assetId,
                  target: resourceTabResult.target ?? null,
                  title: link.name,
                });
              }
            });
          } else {
            // TODO Case of external link
            const richContent = "<p>TODO: external link</p>";
            editor?.commands.insertContent(richContent);
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
  return { toolbarItems, isOpen, setIsOpen, appendAsRichContent };
};
