import * as PIXI from "pixi.js";
const POINT_RADIUS = 20;
const CROP_MASK_NAME = "CROP_MASK";
const CROP_CORNER_NAME = (index: 1 | 2 | 3 | 4) => "CROP_CORNER_" + index;
const useCropTool = ({
  application,
  spriteName,
}: {
  application?: PIXI.Application;
  spriteName: string;
  imageSrc: string;
}) => {
  const computePositionRelativeTo = (
    sprite: PIXI.Sprite,
    options: {
      useScale: boolean;
      mode: "ratio" | "pixel";
      x: number;
      y: number;
    },
  ) => {
    const fixedWidth = options.useScale ? sprite.width / sprite.scale.x : 0;
    const fixedHeight = options.useScale ? sprite.height / sprite.scale.y : 0;
    const originX = -fixedWidth / 2;
    const originY = -fixedHeight / 2;
    if (options.mode === "pixel") {
      const x = originX + options.x;
      const y = originY + options.y;
      return { x, y };
    } else {
      const x = originX * options.x;
      const y = originY * options.y;
      return { x, y };
    }
  };
  const computeDimensionRelativeTo = (
    sprite: PIXI.Sprite,
    options: {
      useScale: boolean;
      mode: "ratio" | "pixel";
      height: number;
      width: number;
    },
  ) => {
    const fixedWidth = options.useScale
      ? sprite.width / sprite.scale.x
      : sprite.width;
    const fixedHeight = options.useScale
      ? sprite.height / sprite.scale.y
      : sprite.height;
    if (options.mode === "pixel") {
      const width = fixedWidth + options.width;
      const height = fixedHeight + options.height;
      return { width, height };
    } else {
      const width = fixedWidth * options.width;
      const height = fixedHeight * options.height;
      return { width, height };
    }
  };
  const drawMask = () => {
    removeMask();
    if (application === undefined) return;
    const child = application.stage.getChildByName(spriteName);
    if (child === null || child === undefined) return;
    const sprite = child as PIXI.Sprite;
    // draw background
    const dimensionBack = computeDimensionRelativeTo(sprite, {
      height: 1,
      width: 1,
      mode: "ratio",
      useScale: true,
    });
    const positionBack = computePositionRelativeTo(sprite, {
      x: 0,
      y: 0,
      mode: "pixel",
      useScale: true,
    });
    const background = new PIXI.Graphics();
    background.beginFill(0xffffff, 0.5);
    background.drawRect(
      positionBack.x,
      positionBack.y,
      dimensionBack.width,
      dimensionBack.height,
    );
    background.endFill();
    background.name = CROP_MASK_NAME;
    sprite.addChild(background);
    // draw rectangle
    const dimensionRect = computeDimensionRelativeTo(sprite, {
      height: -100,
      width: -100,
      mode: "pixel",
      useScale: true,
    });
    const positionRect = computePositionRelativeTo(sprite, {
      x: 50,
      y: 50,
      mode: "pixel",
      useScale: true,
    });
    const rectMask = new PIXI.Graphics();
    rectMask.beginFill(0x000000, 1);
    rectMask.drawRect(
      positionRect.x,
      positionRect.y,
      dimensionRect.width,
      dimensionRect.height,
    );
    rectMask.endFill();
    rectMask.scale = new PIXI.Point(1, 1);
    background.addChild(rectMask);
    // draw image
    const texture = sprite.texture.clone();
    const spriteMask = new PIXI.Sprite(texture);
    spriteMask.scale = new PIXI.Point(1, 1);
    spriteMask.anchor = sprite.anchor;
    spriteMask.mask = rectMask;
    background.addChild(spriteMask);
    // add cropped
    return { ...positionRect, ...dimensionRect };
  };
  const removeMask = () => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(CROP_MASK_NAME, true);
    child?.removeFromParent();
  };
  const drawControl = () => {
    if (application === undefined) return;
    removeControl();
    const rect = drawMask();
    const child = application.stage.getChildByName(spriteName);
    if (
      child === null ||
      child === undefined ||
      rect === undefined ||
      rect === null
    )
      return;
    const sprite = child as PIXI.Sprite;
    //corner 1 (left / top)
    const corner1 = new PIXI.Graphics();
    corner1.beginFill(0x000000, 1);
    corner1.drawCircle(rect.x, rect.y, POINT_RADIUS);
    corner1.endFill();
    corner1.name = CROP_CORNER_NAME(1);
    sprite.addChild(corner1);
    //corner 2 (right / top)
    const corner2 = new PIXI.Graphics();
    corner2.beginFill(0x000000, 1);
    corner2.drawCircle(rect.x + rect.width, rect.y, POINT_RADIUS);
    corner2.endFill();
    corner2.name = CROP_CORNER_NAME(2);
    sprite.addChild(corner2);
    //corner 3 (right / bottom)
    const corner3 = new PIXI.Graphics();
    corner3.beginFill(0x000000, 1);
    corner3.drawCircle(rect.x + rect.width, rect.y + rect.height, POINT_RADIUS);
    corner3.endFill();
    corner3.name = CROP_CORNER_NAME(3);
    sprite.addChild(corner3);
    //corner 4 (right / bottom)
    const corner4 = new PIXI.Graphics();
    corner4.beginFill(0x000000, 1);
    corner4.drawCircle(rect.x, rect.y + rect.height, POINT_RADIUS);
    corner4.endFill();
    corner4.name = CROP_CORNER_NAME(4);
    sprite.addChild(corner4);
  };
  const removeControl = () => {
    if (application === undefined) return;
    removeMask();
    [1, 2, 3, 4].forEach((value) => {
      const child = application.stage.getChildByName(
        CROP_CORNER_NAME(value as any),
        true,
      );
      child?.removeFromParent();
    });
  };
  const startCrop = () => {
    if (application === undefined) return;
    drawControl();
    application.stage.interactive = true;
  };
  const stopCrop = () => {
    if (application === undefined) return;
    removeControl();
  };
  return {
    startCrop,
    stopCrop,
  };
};

export default useCropTool;
