import { useCallback, useEffect, useState } from "react";

import * as PIXI from "pixi.js";

import useBlurTool from "./useBlurTool";
import useCropTool from "./useCropTool";
import useHistoryTool from "./useHistoryTool";
import useRotateTool from "./useRotateTool";
const DEFAULT_WIDTH = 680;
const MIN_WIDTH = 400;
const DEFAULT_HEIGHT = 400;
const SPRITE_NAME = "image";
type Dimension = { width: number; height: number };
const usePixiEditor = ({ imageSrc }: { imageSrc: string }) => {
  const [application, setApplication] = useState<PIXI.Application | undefined>(
    undefined,
  );
  const [scale, setScale] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );
  const [dimension, setDimension] = useState<Dimension | undefined>(undefined);
  const setImageSize = useCallback(
    ({ height, width }: Dimension) => {
      const child = application?.stage.getChildByName(SPRITE_NAME);
      if (application && child) {
        (child as PIXI.Sprite).anchor.x = 0.5;
        (child as PIXI.Sprite).anchor.y = 0.5;
        child.position = {
          x: width / 2,
          y: height / 2,
        } as PIXI.Point;
        application.renderer.resize(width, height);
        setDimension({ height, width });
      }
    },
    [application],
  );
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
      const scaleX = parentWidth / sprite.width;
      const scaleY = scaleX * (sprite.height / sprite.width);
      const size = Math.max(sprite.width * scaleX, sprite.height * scaleY);
      sprite.scale = new PIXI.Point(scaleX, scaleY);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.position = new PIXI.Point(size / 2, size / 2);
      application.renderer.resize(size, size);
      //sprite.pivot.set(newWith / 2, newHeight / 2);
      // update state
      setScale({ x: scaleX, y: scaleY });
      setDimension({ width: size, height: size });
    },
    [],
  );
  const setBlob = ({
    imageSrc,
    dimension,
  }: {
    imageSrc: Blob;
    dimension?: Dimension;
  }) => {
    const imageUrl = URL.createObjectURL(imageSrc);
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setImage({ imageSrc: image, dimension });
    };
  };
  const setImage = useCallback(
    async ({
      imageSrc,
    }: {
      imageSrc: string | HTMLImageElement;
      dimension?: Dimension;
    }) => {
      if (application === undefined || application.stage === null) {
        return;
      }
      // remove previous sprite
      application.stage.getChildByName(SPRITE_NAME)?.removeFromParent();
      // add new sprite
      const texture =
        imageSrc instanceof HTMLImageElement
          ? PIXI.Texture.from(imageSrc)
          : await PIXI.Texture.fromURL(imageSrc);
      const sprite = PIXI.Sprite.from(texture, {});
      sprite.interactive = true;
      sprite.name = SPRITE_NAME;
      application.stage.addChild(sprite);
      resize({ application, sprite });
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
  const { startBlur, stopBlur } = useBlurTool({
    spriteName: SPRITE_NAME,
    imageSrc,
    application,
    scale,
  });
  const { startCrop, stopCrop } = useCropTool({
    spriteName: SPRITE_NAME,
    application,
    imageSrc,
  });
  const { rotate } = useRotateTool({
    height: dimension?.height ?? DEFAULT_HEIGHT,
    width: dimension?.width ?? DEFAULT_WIDTH,
    spriteName: SPRITE_NAME,
    application,
    onResize({ height, width }) {
      setImageSize({ height, width });
    },
  });
  const { restore, historize, historyCount } = useHistoryTool({
    application,
    onRestore(imageSrc) {
      setBlob({ imageSrc, dimension });
    },
  });
  return {
    historyCount,
    setApplication,
    restore,
    stopCrop,
    stopBlur,
    startCrop: historize(startCrop),
    startBlur: historize(startBlur),
    rotate: historize(rotate),
    toBlob,
    toDataURL,
  };
};

export default usePixiEditor;
