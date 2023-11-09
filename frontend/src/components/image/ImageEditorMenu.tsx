import React from "react";

import { Button } from "@edifice-ui/react";
import { t } from "i18next";

interface ImageEditorMenuProps {
  handle(operation: "ROTATE" | "UNDO" | "CROP" | "BLUR"): void;
}

const ImageEditorMenu: React.FC<ImageEditorMenuProps> = ({ handle }) => {
  return (
    <div>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        onClick={() => handle("UNDO")}
      >
        {t("Annuler l'action")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        onClick={() => handle("ROTATE")}
      >
        {t("Pivoter")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        onClick={() => handle("CROP")}
      >
        {t("Rogner")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        onClick={() => handle("BLUR")}
      >
        {t("Flouter")}
      </Button>
    </div>
  );
};
export default ImageEditorMenu;
