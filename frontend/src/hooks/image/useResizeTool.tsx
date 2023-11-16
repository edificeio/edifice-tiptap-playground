import * as PIXI from "pixi.js";
const POINT_RADIUS = 20;
const CONTROL_NAME = "CONTROL_NAME";
type CornerType = "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";

const RESIZE_CORNER_NAME = (index: CornerType) => "RESIZE_CORNER_" + index;
const useResizeTool = ({
  application,
  spriteName,
}: {
  application?: PIXI.Application;
  spriteName: string;
}) => {
  const computeCornerPosition = (
    position: CornerType,
    sprite: PIXI.Graphics,
  ) => {
    const left = sprite.x;
    const top = sprite.y;
    switch (position) {
      case "TOP_LEFT": {
        return { x: left, y: top, start: 0, end: Math.PI / 2 };
      }
      case "TOP_RIGHT": {
        return {
          x: left + sprite.width,
          y: top,
          start: Math.PI / 2,
          end: Math.PI,
        };
      }
      case "BOTTOM_LEFT": {
        return {
          x: left,
          y: top + sprite.height,
          start: (3 * Math.PI) / 2,
          end: 2 * Math.PI,
        };
      }
      case "BOTTOM_RIGHT": {
        return {
          x: left + sprite.width,
          y: top + sprite.height,
          start: Math.PI,
          end: (3 * Math.PI) / 2,
        };
      }
    }
  };
  const resizeSprite = (
    cornerType: CornerType,
    position: { x: number; y: number },
    container: PIXI.Graphics,
  ) => {
    if (application === undefined) return;
    const sprite = application.stage.getChildByName(
      spriteName,
      true,
    ) as PIXI.Sprite | null;
    if (sprite === undefined || sprite === null) return;
    switch (cornerType) {
      case "TOP_LEFT": {
        container.position = new PIXI.Point(position.x, position.y);
        container.width = sprite.width - 2 * position.x;
        container.height = sprite.height - 2 * position.y;
        break;
      }
      case "TOP_RIGHT": {
        const newX = sprite.width - position.x;
        container.position = new PIXI.Point(newX, position.y);
        container.width = sprite.width - 2 * newX;
        container.height = sprite.height - 2 * position.y;
        break;
      }
      case "BOTTOM_LEFT": {
        const newY = sprite.height - position.y;
        container.position = new PIXI.Point(position.x, newY);
        container.width = sprite.width - 2 * position.x;
        container.height = sprite.height - 2 * newY;
        break;
      }
      case "BOTTOM_RIGHT": {
        const newY = sprite.height - position.y;
        const newX = sprite.width - position.x;
        container.position = new PIXI.Point(newX, newY);
        container.width = sprite.width - 2 * newX;
        container.height = sprite.height - 2 * newY;
        break;
      }
    }
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
    // search sprite
    const sprite = application.stage.getChildByName(
      spriteName,
      true,
    ) as PIXI.Sprite | null;
    const container = application.stage.getChildByName(
      CONTROL_NAME,
      true,
    ) as PIXI.Graphics | null;
    if (
      sprite === null ||
      sprite === undefined ||
      container === null ||
      container === undefined
    )
      return;
    // compute position
    const position = computeCornerPosition(cornerType, container);
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
    let enable = false;
    application.stage.on("pointermove", (event: PIXI.FederatedMouseEvent) => {
      if (enable === false) return;
      const localPosition = application.stage.toLocal(event.global);
      resizeSprite(cornerType, localPosition, container);
    });
    const handlePointerDown = () => {
      enable = true;
    };
    const handlePointerUp = () => {
      enable = false;
    };
    corner.once("destroyed", () => {
      // cancel listener
      corner.off("pointerdown");
      globalThis.removeEventListener("pointerup", handlePointerUp);
    });
    corner.on("pointerdown", handlePointerDown);
    globalThis.addEventListener("pointerup", handlePointerUp);
    // add to sprite
    container.addChild(corner);
  };
  const drawContainer = () => {
    removeContainer();
    if (application === undefined) return;
    const sprite = application.stage.getChildByName(
      spriteName,
      true,
    ) as PIXI.Sprite | null;
    if (sprite === null || sprite === undefined) return;
    // clone stage
    const stageTexture = application.renderer.generateTexture(
      application.stage,
    );
    const clonedStage = new PIXI.Sprite(stageTexture);
    // hide all child
    application.stage.children.forEach((child) => {
      child.alpha = 0;
    });
    //  create container
    const container = new PIXI.Graphics();
    container.drawRect(0, 0, sprite.width, sprite.height);
    container.name = CONTROL_NAME;
    container.interactive = true;
    container.interactiveChildren = true;
    application.stage.interactive = true;
    application.stage.interactiveChildren = true;
    application.stage.addChild(container);
    container.addChild(clonedStage);
  };
  const removeContainer = () => {
    if (application === undefined) return;
    const container = application.stage.getChildByName(
      CONTROL_NAME,
      true,
    ) as PIXI.Graphics | null;
    container?.removeFromParent();
    // display all child
    application.stage.children.forEach((child) => {
      child.alpha = 1;
    });
  };
  const drawControl = () => {
    if (application === undefined) return;
    drawContainer();
    drawCorner("BOTTOM_LEFT");
    drawCorner("BOTTOM_RIGHT");
    drawCorner("TOP_LEFT");
    drawCorner("TOP_RIGHT");
  };
  const removeControl = () => {
    if (application === undefined) return;
    removeContainer();
    removeCorner("BOTTOM_LEFT");
    removeCorner("BOTTOM_RIGHT");
    removeCorner("TOP_LEFT");
    removeCorner("TOP_RIGHT");
    application.stage.off("pointermove");
  };
  const startResize = () => {
    if (application === undefined) return;
    drawControl();
  };
  const stopResize = (save: boolean) => {
    if (application === undefined) return;
    if (save) {
      const container = application?.stage?.getChildByName(
        CONTROL_NAME,
        true,
      ) as PIXI.Graphics | null;
      const size = container
        ? { height: container.height, width: container.width }
        : undefined;
      removeControl();
      if (size) {
        saveResize(size);
      }
    } else {
      removeControl();
    }
    application.render();
  };
  const saveResize = ({ height, width }: { width: number; height: number }) => {
    if (application === undefined) return;
    const sprite = application.stage.getChildByName(
      spriteName,
      true,
    ) as PIXI.Sprite | null;
    if (sprite) {
      sprite.width = width;
      sprite.height = height;
      sprite.position = new PIXI.Point(width / 2, height / 2);
      application.renderer.resize(width, height);
    }
  };
  return {
    startResize,
    stopResize,
  };
};

export default useResizeTool;
