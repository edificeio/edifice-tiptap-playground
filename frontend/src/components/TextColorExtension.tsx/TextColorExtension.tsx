import { useState } from "react";

import {
  AccessiblePalette,
  ColorPicker,
  DefaultPalette,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

export interface TextColorExtensionProps {
  /**
   * Tiptap editor instance
   */
  editor: Editor | null;
}

const TextColorExtension = ({ editor }: TextColorExtensionProps) => {
  const { t } = useTranslation();
  const [currentColor, setCurrentColor] = useState(
    editor?.getAttributes("textStyle").color ?? "#4A4A4A",
  );
  return (
    <ColorPicker
      model={currentColor}
      palettes={[
        { ...DefaultPalette, label: t("Couleur de texte") },
        { ...AccessiblePalette, label: t("Accessible palette") },
      ]}
      onChange={(color) => {
        // If the same color is picked, remove it (=toggle mode).
        if (color === editor?.getAttributes("textStyle").color) {
          editor?.chain().focus().unsetColor().run();
          setCurrentColor("#4A4A4A");
        } else {
          editor?.chain().focus().setColor(color).run();
        }
      }}
    />
  );
};

export default TextColorExtension;
