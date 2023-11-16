import React, { useState } from "react";

import { Button, Modal } from "@edifice-ui/react";
import { Stage } from "@pixi/react";
import { t } from "i18next";

import ImageEditorMenu, { ImageEditorAction } from "./ImageEditorMenu";
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
  const [currentOperation, setCurrentOperation] = useState<
    ImageEditorAction | undefined
  >(undefined);
  const {
    toBlob,
    setApplication,
    startBlur,
    stopBlur,
    restore,
    rotate,
    startCrop,
    stopCrop,
    startResize,
    stopResize,
  } = usePixiEditor({
    imageSrc,
  });
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
  const handleOperation = async (operation: ImageEditorAction) => {
    //disable
    stopBlur();
    stopCrop(currentOperation === "CROP");
    stopResize(currentOperation === "RESIZE");
    // save
    setCurrentOperation(operation);
    //enable
    switch (operation) {
      case "ROTATE": {
        await rotate();
        break;
      }
      case "UNDO": {
        await restore();
        break;
      }
      case "CROP": {
        startCrop();
        break;
      }
      case "RESIZE": {
        await startResize();
        break;
      }
      case "BLUR": {
        await startBlur();
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
        <div className="d-flex flex-column align-items-center gap-32">
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
