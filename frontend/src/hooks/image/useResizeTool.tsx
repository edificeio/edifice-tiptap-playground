import * as PIXI from "pixi.js";
const POINT_RADIUS = 40;
const RESIZE_BACKGROUND_NAME = "RESIZE_BACKGROUND_NAME";
const RESIZE_SPRITE_NAME = "RESIZE_SPRITE_NAME";
type CornerType = "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";
const CORNERS: Array<CornerType> = [
  "TOP_LEFT",
  "TOP_RIGHT",
  "BOTTOM_LEFT",
  "BOTTOM_RIGHT",
];
const RESIZE_CORNER_NAME = (index: CornerType) => "RESIZE_CORNER_" + index;
const useResizeTool = ({
  application,
  spriteName,
}: {
  application?: PIXI.Application;
  spriteName: string;
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
    background.beginFill(0xffffff, 1);
    background.drawRect(0, 0, spriteBounds.width, spriteBounds.height);
    background.endFill();
    background.name = RESIZE_BACKGROUND_NAME;
    background.position = new PIXI.Point(spriteBounds.x, spriteBounds.y);
    sprite.addChild(background);
    // draw image
    const texture = sprite.texture.clone();
    const resizedSprite = new PIXI.Sprite(texture);
    resizedSprite.name = RESIZE_SPRITE_NAME;
    background.addChild(resizedSprite);
  };
  const removeBackground = () => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(
      RESIZE_BACKGROUND_NAME,
      true,
    );
    child?.removeFromParent();
  };
  const computeCornerPosition = (
    position: CornerType,
    bounds: { x: number; y: number; width: number; height: number },
  ) => {
    switch (position) {
      case "TOP_LEFT": {
        return { x: 0, y: 0, start: 0, end: Math.PI / 2 };
      }
      case "TOP_RIGHT": {
        return { x: bounds.width, y: 0, start: Math.PI / 2, end: Math.PI };
      }
      case "BOTTOM_LEFT": {
        return {
          x: 0,
          y: bounds.height,
          start: (3 * Math.PI) / 2,
          end: 2 * Math.PI,
        };
      }
      case "BOTTOM_RIGHT": {
        return {
          x: bounds.width,
          y: bounds.height,
          start: Math.PI,
          end: (3 * Math.PI) / 2,
        };
      }
    }
  };
  const refreshCorners = () => {
    if (application === undefined) return;
    const sprite = application.stage.getChildByName(
      RESIZE_SPRITE_NAME,
      true,
    ) as PIXI.Sprite | null;
    if (sprite === undefined || sprite === null) return;
    CORNERS.forEach((cornerType) => {
      const corner = application.stage.getChildByName(
        RESIZE_CORNER_NAME(cornerType),
        true,
      );
      if (corner === undefined || corner === null) return;
      const position = computeCornerPosition(cornerType, {
        height: sprite.height,
        width: sprite.width,
        x: sprite.x,
        y: sprite.y,
      });
      corner.position = new PIXI.Point(position.x, position.y);
    });
  };
  const resizeSprite = (
    cornerType: CornerType,
    position: { x: number; y: number },
  ) => {
    if (application === undefined) return;
    const sprite = application.stage.getChildByName(
      RESIZE_SPRITE_NAME,
      true,
    ) as PIXI.Sprite | null;
    if (sprite === undefined || sprite === null) return;
    const width = sprite.width;
    const height = sprite.height;
    const left = sprite.position.x;
    const top = sprite.position.y;
    const right = left + width;
    const bottom = top + height;
    switch (cornerType) {
      case "TOP_LEFT": {
        sprite.position.x = position.x;
        sprite.position.y = position.y;
        sprite.width = right - position.x;
        sprite.height = bottom - position.y;
        break;
      }
      case "TOP_RIGHT": {
        sprite.position.y = position.y;
        sprite.width = position.x - sprite.position.x;
        sprite.height = bottom - position.y;
        break;
      }
      case "BOTTOM_LEFT": {
        sprite.position.x = position.x;
        sprite.width = right - position.x;
        sprite.height = position.y - sprite.position.y;
        break;
      }
      case "BOTTOM_RIGHT": {
        sprite.width = position.x - sprite.position.x;
        sprite.height = position.y - sprite.position.y;
        break;
      }
    }
    refreshCorners();
  };
  const removeCorner = (cornerType: CornerType) => {
    if (application === undefined) return;
    const previous = application.stage.getChildByName(
      RESIZE_CORNER_NAME(cornerType),
      true,
    );
    previous?.removeFromParent();
  };
  const drawCorner = (cornerType: CornerType) => {
    if (application === undefined) return;
    // delete before draw
    removeCorner(cornerType);
    // search background
    const background = application.stage.getChildByName(
      RESIZE_BACKGROUND_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (background === null || background === undefined) return;
    // compute position
    const position = computeCornerPosition(cornerType, {
      height: background.height,
      width: background.width,
      x: background.x,
      y: background.y,
    });
    //add corner
    const corner = new PIXI.Graphics();
    corner.beginFill(0x4bafd5, 1);
    corner.arc(0, 0, POINT_RADIUS, position.start, position.end);
    corner.lineTo(0, 0);
    corner.endFill();
    corner.position = new PIXI.Point(position.x, position.y);
    corner.name = RESIZE_CORNER_NAME(cornerType);
    // add mouse listener
    corner.interactive = true;
    const handleCursorMove = (event: PIXI.FederatedPointerEvent) => {
      const localPosition = background.toLocal(event.global);
      corner.position.x = localPosition.x;
      corner.position.y = localPosition.y;
      resizeSprite(cornerType, localPosition);
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
    removeCorner("BOTTOM_LEFT");
    removeCorner("BOTTOM_RIGHT");
    removeCorner("TOP_LEFT");
    removeCorner("TOP_RIGHT");
  };
  const startResize = () => {
    if (application === undefined) return;
    drawControl();
  };
  const stopResize = () => {
    if (application === undefined) return;
    removeControl();
  };
  return {
    startResize,
    stopResize,
  };
};

export default useResizeTool;
