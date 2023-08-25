import { useState } from "react";

import {
  AccessiblePalette,
  ColorPicker,
  DefaultPalette,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

export interface TextHighlightExtensionProps {
  /**
   * Tiptap editor instance
   */
  editor: Editor | null;
}

const TextHighlightExtension = ({ editor }: TextHighlightExtensionProps) => {
  const { t } = useTranslation();
  const [currentColor, setCurrentColor] = useState(
    editor?.getAttributes("highlight").color ?? "",
  );
  return (
    <ColorPicker
      model={currentColor}
      palettes={[
        { ...DefaultPalette, label: t("Couleur de fond") },
        { ...AccessiblePalette, label: t("Accessible palette") },
      ]}
      onChange={(color) => {
        // Then check if color was applied for real. It isn't allowed in <code> blocks for example.
        if (color === editor?.getAttributes("highlight").color)
          setCurrentColor("");

        editor?.chain().focus().toggleHighlight({ color: color }).run();
      }}
    />
  );
};

export default TextHighlightExtension;
