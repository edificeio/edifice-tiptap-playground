import React, { useState } from "react";

import { Button, FormControl, Input, Label, Modal } from "@edifice-ui/react";
import { Stage } from "@pixi/react";
import { t } from "i18next";

import ImageEditorMenu, { ImageEditorAction } from "./ImageEditorMenu";
import usePixiEditor from "~/hooks/image/usePixiEditor";

interface ImageEditorProps {
  image: string;
  isOpen: boolean;
  legend?: string;
  altText?: string;
  onCancel(): void;
  onSave(arg: { blob: Blob; legend: string; altText: string }): void;
  onError?(err: string): void;
}
const ImageEditor: React.FC<ImageEditorProps> = ({
  altText: altTextParam,
  legend: legendParam,
  image: imageSrc,
  isOpen,
  onCancel,
  onError,
  onSave,
}) => {
  const [currentOperation, setCurrentOperation] = useState<
    ImageEditorAction | undefined
  >(undefined);
  const [altText, setAltText] = useState(altTextParam ?? "");
  const [legend, setLegend] = useState(legendParam ?? "");
  const [dirty, setDirty] = useState<boolean>(false);
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
      onSave({ blob, altText, legend });
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
    setDirty(true);
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
    <Modal
      id="image-editor"
      isOpen={isOpen}
      onModalClose={handleCancel}
      size="lg"
    >
      <Modal.Header onModalClose={handleCancel}>
        <span className="h2">{t("Retouche de l'image")}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center gap-12">
          <ImageEditorMenu handle={handleOperation} />
          <Stage
            onMount={(app) => setApplication(app)}
            options={{ preserveDrawingBuffer: true, backgroundAlpha: 0 }}
          ></Stage>
          <div className="d-flex flex-column flex-md-row m-10 gap-12 w-100">
            <FormControl id="alt" className="flex-grow-1">
              <Label>{t("Texte alternatif")}</Label>
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder={t("Affiché pour les non-voyants")}
                size="md"
                type="text"
              />
            </FormControl>
            <FormControl id="legend" className="flex-grow-1">
              <Label>{t("Légende")}</Label>
              <Input
                value={legend}
                onChange={(e) => setLegend(e.target.value)}
                placeholder={t("Légende de l’image")}
                size="md"
                type="text"
              />
            </FormControl>
          </div>
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
          disabled={!dirty}
        >
          {"Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageEditor;
