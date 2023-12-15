import { useEffect, useState, Fragment, RefAttributes, RefObject } from "react";

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
  TextHighlight,
  TextItalic,
  TextUnderline,
  SpeechToText,
} from "@edifice-ui/icons";
import {
  Dropdown,
  ColorPicker,
  DefaultPalette,
  ToolbarItem,
  DropdownMenuOptions,
  ColorPaletteItem,
  IconButton,
  IconButtonProps,
  MediaLibraryRef,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import EmojiPicker, { Categories } from "emoji-picker-react";
import { useTranslation } from "react-i18next";

import { EditorToolbarTextColor } from "./EditorToolbar.TextColor";
import { EditorToolbarTextSize } from "./EditorToolbar.TextSize";
import { EditorToolbarTypography } from "./EditorToolbar.Typography";
import { useSpeechRecognition } from "./useSpeechRecognition";

export const useToolbarItems = (
  editor: Editor | null,
  mediaLibraryRef: RefObject<MediaLibraryRef>,
  listOptions: DropdownMenuOptions[],
  alignmentOptions: DropdownMenuOptions[],
  options: DropdownMenuOptions[],
) => {
  const { t } = useTranslation();

  const [highlightColor, setHighlightColor] = useState<string>("");
  const {
    isAvailable: canRecognizeSpeech,
    isActive: speechRecognition,
    toggle: toggleSpeechRecognition,
  } = useSpeechRecognition(editor);

  useEffect(() => {
    // When cursor moves in editor, update the text values.
    setHighlightColor(editor?.getAttributes("highlight").color ?? "");
  }, [editor, editor?.state]);

  const toolbarItems: ToolbarItem[] = [
    //--------------- IMAGE ---------------//
    {
      type: "icon",
      props: {
        icon: <Landscape />,
        className: "bg-green-200",
        "aria-label": t("Insérer une image"),
        onClick: () => mediaLibraryRef.current?.show("image"),
      },
      name: "image",
    },
    //--------------- VIDEO ---------------//
    {
      type: "icon",
      props: {
        icon: <RecordVideo />,
        className: "bg-purple-200",
        "aria-label": t("Insérer une vidéo"),
        onClick: () => mediaLibraryRef.current?.show("video"),
      },
      name: "video",
    },
    //--------------- AUDIO ---------------//
    {
      type: "icon",
      props: {
        icon: <Mic />,
        className: "bg-red-200",
        "aria-label": t("Insérer une piste audio"),
        onClick: () => mediaLibraryRef.current?.show("audio"),
      },
      name: "audio",
    },
    //--------------- ATTACHMENT ---------------//
    {
      type: "icon",
      props: {
        icon: <Paperclip />,
        className: "bg-yellow-200",
        "aria-label": t("Insérer une pièce jointe"),
        onClick: () => mediaLibraryRef.current?.show("attachment"),
      },
      name: "attachment",
    },
    //-------------------------------------//
    {
      type: "divider",
      name: "div-1",
    },
    //--------------- SPEECH TO TEXT ---------------//
    {
      type: "icon",
      props: {
        icon: <SpeechToText />,
        "aria-label": t("Reconnaissance vocale"),
        className: speechRecognition ? "is-selected" : "",
        onClick: () => toggleSpeechRecognition(),
      },
      visibility: canRecognizeSpeech ? "show" : "hide",
      name: "speechtotext",
    },
    //------------------------------------//
    {
      type: "divider",
      name: "div-speech",
      visibility: canRecognizeSpeech ? "show" : "hide",
    },
    //--------------- TYPOGRAPHY ---------------//
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <EditorToolbarTypography
            editor={editor}
            triggerProps={triggerProps}
          />
        ),
      },
      name: "text_typo",
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "fontFamily",
      )
        ? "show"
        : "hide",
    },
    //--------------- TEXT SIZE ---------------//
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <EditorToolbarTextSize editor={editor} triggerProps={triggerProps} />
        ),
      },
      name: "text_size",
      visibility: editor?.extensionManager.extensions.find(
        (item) => item.name === "typoSize",
      )
        ? "show"
        : "hide",
    },
    //--------------- TEXT COLOR ---------------//
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs: any,
        ) => (
          <EditorToolbarTextColor
            editor={editor}
            triggerProps={triggerProps}
            itemRefs={itemRefs}
          />
        ),
      },
      overflow: false,
      name: "color",
      visibility: editor?.extensionManager.extensions.find(
        (item) =>
          item.name === "color" &&
          !!editor?.extensionManager.splittableMarks.includes("textStyle"),
      )
        ? "show"
        : "hide",
    },
    //--------------- TEXT HIGHLIGHTING COLOR ---------------//
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs: any,
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
                ref={(el: any) => (itemRefs.current["color-picker"] = el)}
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
    //-------------------------------------//
    {
      type: "divider",
      name: "div-2",
    },
    //--------------- BOLD ---------------//
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
    //--------------- ITALIC ---------------//
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
    //--------------- UNDERLINE ---------------//
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
    //-------------------------------------//
    {
      type: "divider",
      name: "div-3",
    },
    //--------------- EMOJI ---------------//
    {
      type: "dropdown",
      props: {
        children: (
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
          itemRefs: any,
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
    //--------------- LINKER (internal / external) ---------------//
    {
      type: "icon",
      props: {
        icon: <Link />,
        "aria-label": t("Ajout d'un lien"),
        className: editor?.isActive("linker") ? "is-selected" : "",
        onClick: () => mediaLibraryRef.current?.show("hyperlink"),
      },
      name: "linker",
    },
    //-----------------------------------//
    {
      type: "divider",
      name: "div-4",
    },
    //--------------- UNORDERED LIST ---------------//
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
                      <Dropdown.Item
                        icon={option.icon}
                        onClick={() => option.action(null)}
                      >
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
    //--------------- TEXT ALIGNMENT ---------------//
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
                      <Dropdown.Item
                        icon={option.icon}
                        onClick={() => option.action(null)}
                      >
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
    //-------------------------------------//
    {
      type: "divider",
      name: "div-5",
    },
    //--------------- MORE sub-menu ---------------//
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
                      <Dropdown.Item
                        icon={option.icon}
                        onClick={() => option.action(null)}
                      >
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

  return { toolbarItems };
};
