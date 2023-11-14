import * as PIXI from "pixi.js";

const BRUSH_SIZE = 20;
const CURSOR_NAME = "BRUSH_CURSOR";
const useBlurTool = ({
  application,
  scale,
  spriteName,
}: {
  application?: PIXI.Application;
  scale?: { x: number; y: number };
  spriteName: string;
  imageSrc: string;
}) => {
  //TODO limit history in size + debounce mouseevent (aggregate)
  const radius = () => {
    const widthRatio = scale?.x ?? 1;
    const heightRatio = scale?.y ?? 1;
    const ratio = Math.max(widthRatio, heightRatio);
    return BRUSH_SIZE * ratio;
  };
  const drawBrush = (position: PIXI.Point): PIXI.Graphics => {
    const brush = new PIXI.Graphics();
    brush.beginFill(0xffffff, 1);
    brush.drawCircle(position.x, position.y, radius());
    brush.lineStyle(0);
    brush.endFill();
    return brush;
  };
  const drawCircle = (event: PIXI.FederatedPointerEvent) => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(spriteName);
    if (child === undefined || child === null) return;
    const localPosition = application.stage.toLocal(event.global);
    /*
    const widthRatio = scale?.x ?? 1;
    const heightRatio = scale?.y ?? 1;
    const texture = PIXI.Texture.from((child as PIXI.Sprite).texture.baseTexture);
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
    */
    const newSprite = new PIXI.Sprite((child as PIXI.Sprite).texture);
    newSprite.filters = [new PIXI.filters.BlurFilter()];
    newSprite.width = (child as PIXI.Sprite).width;
    newSprite.height = (child as PIXI.Sprite).height;
    // same size as parent
    newSprite.scale = new PIXI.Point(1, 1);
    //newSprite.position = new PIXI.Point(localPosition.x, localPosition.y);
    newSprite.anchor = (child as PIXI.Sprite).anchor;
    newSprite.mask = drawBrush(localPosition);
    //application.stage.addChild(newSprite);
    (child as PIXI.Sprite).addChild(newSprite);
  };
  const enableBrush = () => {
    if (application === undefined) return;
    application.stage.on("pointermove", drawCircle);
  };
  const disableBrush = () => {
    if (application === undefined) return;
    application.stage.off("pointermove", drawCircle);
  };
  const drawCursor = () => {
    if (application === undefined) return;
    // remove cursor before draw
    removeCursor();
    const circle = new PIXI.Graphics();
    circle.lineStyle(1, 0xff0000);
    circle.drawCircle(0, 0, radius());
    circle.endFill();
    circle.name = CURSOR_NAME;
    application.stage.addChild(circle);
  };
  const removeCursor = () => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(CURSOR_NAME);
    if (child) {
      child.removeFromParent();
    }
  };
  const handleCursorMove = (event: PIXI.FederatedPointerEvent) => {
    if (application === undefined) return;
    const child = application.stage.getChildByName(CURSOR_NAME);
    if (child) {
      const localPosition = application.stage.toLocal(event.global);
      child.position.x = localPosition.x;
      child.position.y = localPosition.y;
    }
  };
  const startBlur = () => {
    if (application === undefined) return;

    drawCursor();
    application.stage.interactive = true;
    application.stage.on("pointerdown", enableBrush);
    application.stage.on("pointerup", disableBrush);
    application.stage.on("mousemove", handleCursorMove);
  };
  const stopBlur = () => {
    if (application === undefined) return;
    removeCursor();
    application.stage.off("pointerdown", enableBrush);
    application.stage.off("pointerup", disableBrush);
    application.stage.off("pointermove", drawCircle);
    application.stage.off("mousemove", handleCursorMove);
  };
  return {
    startBlur,
    stopBlur,
  };
};

export default useBlurTool;
