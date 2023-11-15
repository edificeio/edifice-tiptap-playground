import * as PIXI from "pixi.js";
const POINT_RADIUS = 40;
const PADDING = 50;
const CROP_MASK_NAME = "CROP_MASK_NAME";
const CROP_BACKGROUND_NAME = "CROP_BACKGROUND_NAME";
type CornerType = "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";
const CORNERS: Array<CornerType> = [
  "TOP_LEFT",
  "TOP_RIGHT",
  "BOTTOM_LEFT",
  "BOTTOM_RIGHT",
];
const CROP_CORNER_NAME = (index: CornerType) => "CROP_CORNER_" + index;
const useCropTool = ({
  application,
  spriteName,
  imageSrc,
  onSave,
}: {
  onSave(sprite: PIXI.Sprite): void;
  application?: PIXI.Application;
  spriteName: string;
  imageSrc: string;
}) => {
  const drawBackground = () => {
    removeBackground();
    if (application === undefined) return;
    const child = application.stage.getChildByName(spriteName);
    if (child === null || child === undefined) return;
    const sprite = child as PIXI.Sprite;
    const spriteBounds = sprite.getLocalBounds();
    // draw background
    const background = new PIXI.Graphics();
    background.beginFill(0xffffff, 0.5);
    background.drawRect(0, 0, spriteBounds.width, spriteBounds.height);
    background.endFill();
    background.name = CROP_BACKGROUND_NAME;
    background.position = new PIXI.Point(spriteBounds.x, spriteBounds.y);
    sprite.addChild(background);
    // draw rectangle
    const rectMask = new PIXI.Graphics();
    rectMask.beginFill(0x000000, 1);
    rectMask.drawRect(
      0,
      0,
      spriteBounds.width - 2 * PADDING,
      spriteBounds.height - 2 * PADDING,
    );
    rectMask.endFill();
    rectMask.position = new PIXI.Point(PADDING, PADDING);
    rectMask.name = CROP_MASK_NAME;
    background.addChild(rectMask);
    // draw image
    const texture = sprite.texture.clone();
    const spriteMask = new PIXI.Sprite(texture);
    spriteMask.mask = rectMask;
    background.addChild(spriteMask);
  };
  const removeBackground = () => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(CROP_BACKGROUND_NAME, true);
    child?.removeFromParent();
  };
  const computeCornerPosition = (
    position: CornerType,
    bounds: { x: number; y: number; width: number; height: number },
  ) => {
    switch (position) {
      case "TOP_LEFT": {
        return { x: bounds.x, y: bounds.y, start: 0, end: Math.PI / 2 };
      }
      case "TOP_RIGHT": {
        return {
          x: bounds.x + bounds.width,
          y: bounds.y,
          start: Math.PI / 2,
          end: Math.PI,
        };
      }
      case "BOTTOM_LEFT": {
        return {
          x: bounds.x,
          y: bounds.y + bounds.height,
          start: (3 * Math.PI) / 2,
          end: 2 * Math.PI,
        };
      }
      case "BOTTOM_RIGHT": {
        return {
          x: bounds.x + bounds.width,
          y: bounds.y + bounds.height,
          start: Math.PI,
          end: (3 * Math.PI) / 2,
        };
      }
    }
  };
  const refreshCorners = () => {
    if (application === undefined) return;
    const mask = application.stage.getChildByName(
      CROP_MASK_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (mask === undefined || mask === null) return;
    CORNERS.forEach((cornerType) => {
      const corner = application.stage.getChildByName(
        CROP_CORNER_NAME(cornerType),
        true,
      );
      if (corner === undefined || corner === null) return;
      const position = computeCornerPosition(cornerType, {
        height: mask.height,
        width: mask.width,
        x: mask.x,
        y: mask.y,
      });
      corner.position = new PIXI.Point(position.x, position.y);
    });
  };
  const moveMask = (
    cornerType: CornerType,
    position: { x: number; y: number },
  ) => {
    if (application === undefined) return;
    const mask = application.stage.getChildByName(
      CROP_MASK_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (mask === undefined || mask === null) return;
    const width = mask.width;
    const height = mask.height;
    const left = mask.position.x;
    const top = mask.position.y;
    const right = left + width;
    const bottom = top + height;
    switch (cornerType) {
      case "TOP_LEFT": {
        mask.position.x = position.x;
        mask.position.y = position.y;
        mask.width = right - position.x;
        mask.height = bottom - position.y;
        break;
      }
      case "TOP_RIGHT": {
        mask.position.y = position.y;
        mask.width = position.x - mask.position.x;
        mask.height = bottom - position.y;
        break;
      }
      case "BOTTOM_LEFT": {
        mask.position.x = position.x;
        mask.width = right - position.x;
        mask.height = position.y - mask.position.y;
        break;
      }
      case "BOTTOM_RIGHT": {
        mask.width = position.x - mask.position.x;
        mask.height = position.y - mask.position.y;
        break;
      }
    }
    refreshCorners();
  };
  const drawCorner = (cornerType: CornerType) => {
    if (application === undefined) return;
    // delete before draw
    const previous = application.stage.getChildByName(
      CROP_CORNER_NAME(cornerType),
      true,
    );
    previous?.removeFromParent();
    // search sprite
    const background = application.stage.getChildByName(
      CROP_BACKGROUND_NAME,
      true,
    ) as PIXI.Graphics | null;
    const mask = application.stage.getChildByName(
      CROP_MASK_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (
      background === null ||
      background === undefined ||
      mask === undefined ||
      mask === null
    )
      return;
    // compute position
    console.log("MASK1:", mask.getLocalBounds());
    console.log("MASK2:", mask.x, mask.y, mask.width, mask.height);
    const position = computeCornerPosition(cornerType, {
      height: mask.height,
      width: mask.width,
      x: mask.x,
      y: mask.y,
    });
    //add corner
    const corner = new PIXI.Graphics();
    corner.beginFill(0x4bafd5, 1);
    corner.arc(0, 0, POINT_RADIUS, position.start, position.end);
    corner.lineTo(0, 0);
    corner.endFill();
    corner.position = new PIXI.Point(position.x, position.y);
    corner.name = CROP_CORNER_NAME(cornerType);
    // add mouse listener
    corner.interactive = true;
    const handleCursorMove = (event: PIXI.FederatedPointerEvent) => {
      const localPosition = background.toLocal(event.global);
      corner.position.x = localPosition.x;
      corner.position.y = localPosition.y;
      moveMask(cornerType, localPosition);
    };
    const handlePointerDown = () => {
      corner.on("pointermove", handleCursorMove);
    };
    const handlePointerUp = () => {
      corner.off("pointermove", handleCursorMove);
    };
    corner.once("destroyed", () => {
      // cancel listener
      corner.off("pointerdown", handlePointerDown);
      globalThis.removeEventListener("pointerup", handlePointerUp);
    });
    corner.on("pointerdown", handlePointerDown);
    globalThis.addEventListener("pointerup", handlePointerUp);
    // add to sprite
    background.addChild(corner);
  };
  const drawControl = () => {
    if (application === undefined) return;
    drawBackground();
    drawCorner("BOTTOM_LEFT");
    drawCorner("BOTTOM_RIGHT");
    drawCorner("TOP_LEFT");
    drawCorner("TOP_RIGHT");
  };
  const removeControl = () => {
    if (application === undefined) return;
    removeBackground();
  };
  const startCrop = () => {
    if (application === undefined) return;
    drawControl();
  };
  const stopCrop = () => {
    if (application === undefined) return;
    removeControl();
  };
  const saveCropIfNeeded = () => {
    if (application === undefined) return;
    const mask = application.stage.getChildByName(
      CROP_MASK_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (mask === undefined || mask === null) return;
    const originalSprite = PIXI.Sprite.from(imageSrc);
    const cropped = new PIXI.Texture(
      originalSprite.texture.baseTexture,
      new PIXI.Rectangle(mask.x, mask.y, mask.width, mask.height),
    );
    const sprite = new PIXI.Sprite(cropped);
    onSave(sprite);
    return sprite;
  };
  return {
    saveCropIfNeeded,
    startCrop,
    stopCrop,
  };
};

export default useCropTool;
