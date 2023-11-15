import { useCallback, useState } from "react";

import * as PIXI from "pixi.js";

const useRotateTool = ({
  application,
  spriteName,
}: {
  spriteName: string;
  application?: PIXI.Application;
}) => {
  const [rotateCount, setRotateCount] = useState<number>(0);
  const resize = ({
    count,
    application,
    sprite,
  }: {
    count: number;
    sprite: PIXI.Sprite;
    application: PIXI.Application;
  }) => {
    if (count % 2 === 1) {
      application.renderer.resize(sprite.height, sprite.width);
      sprite.position = new PIXI.Point(sprite.height / 2, sprite.width / 2);
      console.log("ROTATE: ", sprite.height, sprite.width);
    } else {
      application.renderer.resize(sprite.width, sprite.height);
      sprite.position = new PIXI.Point(sprite.width / 2, sprite.height / 2);
    }
  };
  const rotate = useCallback(() => {
    const sprite = application?.stage.getChildByName(
      spriteName,
      true,
    ) as PIXI.Sprite | null;
    if (application && sprite) {
      sprite.rotation += Math.PI / 2;
      const count = rotateCount + 1;
      setRotateCount(count);
      resize({ application, count, sprite });
    }
  }, [rotateCount, setRotateCount, spriteName, application]);
  return {
    setRotateCount,
    rotateCount,
    rotate,
  };
};

export default useRotateTool;
