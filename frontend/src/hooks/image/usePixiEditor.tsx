import { useEffect, useState } from "react";

import * as PIXI from "pixi.js";

const usePixiEditor = ({
  imageSrc,
  width = 680,
  height = 400,
}: {
  imageSrc: string;
  height?: number;
  width?: number;
}) => {
  const [application, setApplication] = useState<PIXI.Application | undefined>(
    undefined,
  );
  const [scale, setScale] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );
  useEffect(() => {
    if (application === undefined || application.stage === null) {
      return;
    }
    const parent = application.view.parentNode as HTMLElement | undefined;
    const sprite = PIXI.Sprite.from(imageSrc, {});
    sprite.interactive = true;
    if (parent) {
      // minWidth = 400px
      const parentWidth = Math.max(parent.offsetWidth, 400);
      const scaleX = parentWidth / sprite.width;
      const scaleY = scaleX * (sprite.height / sprite.width);
      const newWith = sprite.width * scaleX;
      const newHeight = sprite.height * scaleY;
      sprite.scale = new PIXI.Point(scaleX, scaleY);
      const blurFilter = new PIXI.filters.BlurFilter();
      sprite.filters?.push(blurFilter);
      application.renderer.resize(newWith, newHeight);
      setScale({ x: scaleX, y: scaleY });
    }
    application.stage.addChild(sprite);
  }, [imageSrc, width, height, application]);
  const toBlob = () => {
    return new Promise<Blob>((resolve, reject) => {
      application?.view?.toBlob?.((blob) => {
        blob ? resolve(blob) : reject("EXTRACT_FAILED");
      });
    });
  };
  const brushSize = 20;
  const drawBrush = (): PIXI.Graphics => {
    const widthRatio = scale?.x ?? 1;
    const heightRatio = scale?.y ?? 1;
    const brush = new PIXI.Graphics();
    brush.beginFill(0xffffff, 1);
    brush.drawCircle(
      brushSize * widthRatio,
      brushSize * heightRatio,
      brushSize * heightRatio,
    );
    brush.lineStyle(0);
    brush.endFill();
    return brush;
  };
  const drawCircle = (event: PIXI.FederatedPointerEvent) => {
    if (application === undefined) return;
    const widthRatio = scale?.x ?? 1;
    const heightRatio = scale?.y ?? 1;
    const localPosition = application.stage.toLocal(event.global);
    const texture = PIXI.Texture.from(imageSrc);
    const rect = new PIXI.Rectangle(
      localPosition.x - brushSize * widthRatio,
      localPosition.y - brushSize * heightRatio,
      brushSize * widthRatio * 2,
      brushSize * heightRatio * 2,
    );
    if (rect.x < 0) {
      rect.x = 0;
    }
    if (rect.y < 0) {
      rect.y = 0;
    }
    if (rect.x + rect.width > texture.width) {
      rect.width -= rect.x + rect.width - (texture.width - 10);
    }
    if (rect.y + rect.height > texture.height) {
      rect.height -= rect.y + rect.height - (texture.height - 10);
    }

    const toBlur = new PIXI.Texture(texture.baseTexture, rect);
    const newSprite = new PIXI.Sprite(toBlur);
    newSprite.filters = [new PIXI.filters.BlurFilter(3 * widthRatio)];
    newSprite.width = brushSize * widthRatio * 2;
    newSprite.height = brushSize * heightRatio * 2;
    newSprite.position = {
      x: localPosition.x - brushSize * widthRatio,
      y: localPosition.y - brushSize * heightRatio,
    } as PIXI.Point;
    newSprite.mask = drawBrush();
    application.stage.addChild(newSprite);
    newSprite.addChild(newSprite.mask);
  };
  const enableBrush = () => {
    if (application === undefined) return;
    application.stage.on("pointermove", drawCircle);
  };
  const disableBrush = () => {
    if (application === undefined) return;
    application.stage.off("pointermove", drawCircle);
  };
  const enableBlur = (enable: boolean) => {
    if (application === undefined) return;
    console.log("BLUR", enable);
    if (enable) {
      console.log("BIND");
      application.stage.interactive = true;
      application.stage.on("pointerdown", enableBrush);
      application.stage.on("pointerup", disableBrush);
    } else {
      application.stage.off("pointerdown", enableBrush);
      application.stage.off("pointerup", disableBrush);
      application.stage.off("pointermove", drawCircle);
    }
  };
  return {
    toBlob,
    setApplication,
    enableBlur,
  };
};

export default usePixiEditor;
