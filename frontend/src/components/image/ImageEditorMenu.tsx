import React, { useState } from "react";

import { Button } from "@edifice-ui/react";
import { t } from "i18next";

export type ImageEditorAction = "ROTATE" | "UNDO" | "CROP" | "BLUR" | "RESIZE";
interface ImageEditorMenuProps {
  handle(operation: ImageEditorAction): void;
}

const ImageEditorMenu: React.FC<ImageEditorMenuProps> = ({ handle }) => {
  const [action, setAction] = useState<ImageEditorAction | undefined>(
    undefined,
  );
  const handleAndSave = (action: ImageEditorAction) => {
    setAction(action);
    handle(action);
  };
  return (
    <div>
      <Button
        color="tertiary"
        type="button"
        variant={"ghost"}
        onClick={() => handleAndSave("UNDO")}
      >
        {t("Annuler l'action")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        onClick={() => handleAndSave("ROTATE")}
      >
        {t("Pivoter")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant={action === "CROP" ? "filled" : "ghost"}
        onClick={() => handleAndSave("CROP")}
      >
        {t("Rogner")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant={action === "RESIZE" ? "filled" : "ghost"}
        onClick={() => handleAndSave("RESIZE")}
      >
        {t("Redimensionner")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant={action === "BLUR" ? "filled" : "ghost"}
        onClick={() => handleAndSave("BLUR")}
      >
        {t("Flouter")}
      </Button>
    </div>
  );
};
export default ImageEditorMenu;
