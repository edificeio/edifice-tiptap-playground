import React from "react";

import { Button, Modal } from "@edifice-ui/react";
import { Stage } from "@pixi/react";
import { t } from "i18next";

import ImageEditorMenu from "./ImageEditorMenu";
import usePixiEditor from "~/hooks/image/usePixiEditor";

interface ImageEditorProps {
  image: string;
  isOpen: boolean;
  onCancel(): void;
  onSave(blob: Blob): void;
  onError?(err: string): void;
}
const ImageEditor: React.FC<ImageEditorProps> = ({
  image: imageSrc,
  isOpen,
  onCancel,
  onError,
  onSave,
}) => {
  const { toBlob, setApplication, toggleBlur, restore, rotate } = usePixiEditor(
    {
      imageSrc,
    },
  );
  const handleSave = async () => {
    try {
      const blob = await toBlob();
      onSave(blob);
    } catch (e) {
      onError?.(`${e}`);
    }
  };
  const handleCancel = () => {
    onCancel();
  };
  const handleOperation = (operation: "ROTATE" | "UNDO" | "CROP" | "BLUR") => {
    switch (operation) {
      case "ROTATE": {
        rotate();
        break;
      }
      case "UNDO": {
        restore();
        break;
      }
      case "CROP": {
        break;
      }
      case "BLUR": {
        toggleBlur(true);
        break;
      }
    }
  };
  return (
    <Modal id="image-editor" isOpen={isOpen} onModalClose={handleCancel}>
      <Modal.Header onModalClose={handleCancel}>
        <span className="h2">{t("RETOUCHE DE L'IMAGE")}</span>
      </Modal.Header>
      <Modal.Body>
        <div>
          <ImageEditorMenu handle={handleOperation} />
          <Stage
            onMount={(app) => setApplication(app)}
            options={{ preserveDrawingBuffer: true, backgroundAlpha: 0 }}
          ></Stage>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="secondary"
          onClick={handleCancel}
          type="button"
          variant="outline"
        >
          {t("Annuler")}
        </Button>
        <Button
          color="primary"
          onClick={handleSave}
          type="button"
          variant="filled"
        >
          {"Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageEditor;
