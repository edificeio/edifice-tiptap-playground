import { useCallback, useEffect, useState } from "react";

import * as PIXI from "pixi.js";

import useBlurTool from "./useBlurTool";
import useCropTool from "./useCropTool";
import useHistoryTool, { HistoryState } from "./useHistoryTool";
import useResizeTool from "./useResizeTool";
import useRotateTool from "./useRotateTool";
const MIN_WIDTH = 400;
const SPRITE_NAME = "image";
const usePixiEditor = ({ imageSrc }: { imageSrc: string }) => {
  const [application, setApplication] = useState<PIXI.Application | undefined>(
    undefined,
  );

  const { startBlur, stopBlur } = useBlurTool({
    spriteName: SPRITE_NAME,
    imageSrc,
    application,
  });
  const { startCrop, stopCrop, saveCrop } = useCropTool({
    spriteName: SPRITE_NAME,
    application,
    imageSrc,
    onSave(sprite) {
      setImage({ imageSrc: sprite });
    },
  });
  const { rotate, rotateCount } = useRotateTool({
    spriteName: SPRITE_NAME,
    application,
  });
  const { startResize, stopResize } = useResizeTool({
    spriteName: SPRITE_NAME,
    application,
  });
  const { restore, historize, historyCount } = useHistoryTool({
    application,
    rotateCount,
    spriteName: SPRITE_NAME,
    onRestore(imageSrc, state) {
      setBlob({ imageSrc, state });
    },
  });
  const resize = useCallback(
    ({
      sprite,
      application,
    }: {
      sprite: PIXI.Sprite;
      application: PIXI.Application;
    }) => {
      const parent = application.view.parentNode as HTMLElement | undefined;
      const parentWidth = Math.max(parent?.offsetWidth ?? 0, MIN_WIDTH);
      const imageRatio = sprite.width / sprite.height;
      const newWidth = parentWidth;
      const newHeight = newWidth / imageRatio;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.position = new PIXI.Point(newWidth / 2, newHeight / 2);
      sprite.width = newWidth;
      sprite.height = newHeight;
      application.renderer.resize(newWidth, newHeight);
    },
    [],
  );
  const setBlob = ({
    imageSrc,
    state,
  }: {
    imageSrc: Blob;
    state: HistoryState;
  }) => {
    const imageUrl = URL.createObjectURL(imageSrc);
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setImage({ imageSrc: image, state });
    };
  };
  const setImage = useCallback(
    async ({
      imageSrc,
      state,
    }: {
      imageSrc: string | HTMLImageElement | PIXI.Sprite;
      state?: HistoryState;
    }) => {
      if (application === undefined || application.stage === null) {
        return;
      }
      // remove previous sprite
      const previous = application.stage.getChildByName(SPRITE_NAME, true);
      previous?.removeFromParent();
      // add new sprite
      const texture =
        imageSrc instanceof HTMLImageElement
          ? PIXI.Texture.from(imageSrc)
          : imageSrc instanceof PIXI.Sprite
          ? imageSrc
          : await PIXI.Texture.fromURL(imageSrc);
      const sprite =
        texture instanceof PIXI.Sprite
          ? texture
          : PIXI.Sprite.from(texture, {});
      sprite.interactive = true;
      sprite.name = SPRITE_NAME;
      application.stage.addChild(sprite);
      if (state) {
        const { stageSize, spriteSize } = state;
        sprite.width = spriteSize.width;
        sprite.height = spriteSize.height;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position = new PIXI.Point(
          stageSize.width / 2,
          stageSize.height / 2,
        );
        application.renderer.resize(stageSize.width, stageSize.height);
      } else {
        resize({ application, sprite });
      }
    },
    [application, resize],
  );
  useEffect(() => {
    setImage({ imageSrc });
  }, [imageSrc, setImage]);
  const toBlob = () => {
    return new Promise<Blob>((resolve, reject) => {
      application?.view?.toBlob?.((blob) => {
        blob ? resolve(blob) : reject("EXTRACT_FAILED");
      });
    });
  };
  const toDataURL = () => {
    return application?.view?.toDataURL?.();
  };
  return {
    historyCount,
    setApplication,
    restore,
    stopCrop,
    stopBlur,
    stopResize,
    startResize: historize(startResize),
    startCrop: historize(startCrop),
    startBlur: historize(startBlur),
    rotate: historize(rotate),
    toBlob,
    toDataURL,
    saveCrop,
  };
};

export default usePixiEditor;
