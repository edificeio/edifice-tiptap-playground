import React, { useState } from "react";

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
interface ImageEditorState {
  rotation: number;
}
const ImageEditor: React.FC<ImageEditorProps> = ({
  image: imageSrc,
  isOpen,
  onCancel,
  onError,
  onSave,
}) => {
  const { toBlob, setApplication, enableBlur } = usePixiEditor({
    imageSrc,
  });
  const [, setState] = useState<ImageEditorState>({
    rotation: 0,
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
  const handleOperation = (operation: "ROTATE" | "UNDO" | "CROP" | "BLUR") => {
    switch (operation) {
      case "ROTATE": {
        setState((state) => ({
          ...state,
          rotation: state.rotation + Math.PI / 2,
        }));
        break;
      }
      case "UNDO": {
        break;
      }
      case "CROP": {
        break;
      }
      case "BLUR": {
        enableBlur(true);
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
          <Stage onMount={(app) => setApplication(app)}></Stage>
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
