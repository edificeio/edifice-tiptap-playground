import { useCallback } from "react";

import * as PIXI from "pixi.js";

import { debounceAggregate } from "./debounceAggregate";

const BRUSH_SIZE = 20;
const DEBOUNCE = 50;
const CURSOR_NAME = "BRUSH_CURSOR";
const useBlurTool = ({
  application,
  spriteName,
}: {
  application?: PIXI.Application;
  spriteName: string;
  imageSrc: string;
}) => {
  const radius = () => {
    return BRUSH_SIZE;
  };
  const drawBrush = (points: Array<PIXI.Point | undefined>): PIXI.Graphics => {
    const container = new PIXI.Graphics();
    for (const point of points) {
      if (point) {
        container.beginFill(0xffffff, 1);
        container.drawCircle(point.x, point.y, radius());
        container.lineStyle(0);
        container.endFill();
      }
    }
    return container;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawCircle = useCallback(
    debounceAggregate(
      DEBOUNCE,
      (event: PIXI.FederatedMouseEvent) => {
        if (application === undefined) return undefined;
        return application.stage.toLocal(event.global);
      },
      (points: Array<PIXI.Point | undefined>) => {
        if (application === undefined) return;
        const child = application.stage.getChildByName(spriteName);
        if (child === undefined || child === null) return;
        const newSprite = new PIXI.Sprite((child as PIXI.Sprite).texture);
        newSprite.filters = [new PIXI.filters.BlurFilter()];
        newSprite.width = (child as PIXI.Sprite).width;
        newSprite.height = (child as PIXI.Sprite).height;
        // same size as parent
        newSprite.scale = new PIXI.Point(1, 1);
        newSprite.anchor = (child as PIXI.Sprite).anchor;
        newSprite.mask = drawBrush(points);
        (child as PIXI.Sprite).addChild(newSprite);
      },
    ),
    [application],
  );
  const enableBrush = useCallback(() => {
    if (application === undefined) return;
    application.stage.on("pointermove", drawCircle);
  }, [application, drawCircle]);
  const disableBrush = useCallback(() => {
    if (application === undefined) return;
    application.stage.off("pointermove", drawCircle);
  }, [application, drawCircle]);
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
  const handleCursorMove = useCallback(
    (event: PIXI.FederatedMouseEvent) => {
      if (application === undefined) return;
      const point = application.stage.toLocal(event.global);
      const child = application.stage.getChildByName(CURSOR_NAME);
      if (child) {
        child.position.x = point.x;
        child.position.y = point.y;
      }
    },
    [application],
  );
  const startBlur = () => {
    if (application === undefined) return;
    drawCursor();
    application.stage.interactive = true;
    application.stage.on("pointerdown", enableBrush);
    application.stage.on("pointermove", handleCursorMove);
    globalThis.addEventListener("pointerup", disableBrush);
  };
  const stopBlur = () => {
    if (application === undefined) return;
    removeCursor();
    disableBrush();
    application.stage.off("pointerdown", enableBrush);
    application.stage.off("pointermove", drawCircle);
    application.stage.off("pointermove", handleCursorMove);
    globalThis.removeEventListener("pointerup", disableBrush);
  };
  return {
    startBlur,
    stopBlur,
  };
};

export default useBlurTool;
