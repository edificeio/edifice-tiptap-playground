import { useEffect, useState } from "react";

import * as PIXI from "pixi.js";

const useBlurTool = ({
  app,
  image,
  renderTexture,
}: {
  app: PIXI.Application;
  image: PIXI.Sprite;
  renderTexture: PIXI.RenderTexture;
}) => {
  const [isBlurEnable, setBlurEnable] = useState(false);
  const [isBrushEnable, setBrushEnable] = useState(false);

  useEffect(() => {
    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 5;
    image.filters = [blurFilter];

    const drawCircle = () => {
      if (isBlurEnable && isBrushEnable) {
        const circle = new PIXI.Graphics();
        circle.beginFill(0xff0000, 0.5);
        circle.drawCircle(
          app.renderer.plugins.interaction.mouse.global.x,
          app.renderer.plugins.interaction.mouse.global.y,
          30,
        );
        circle.endFill();
        app.stage.addChild(circle);
        app.renderer.render(app.stage, { renderTexture });
      }
    };
    const enableBrush = () => setBrushEnable(true);
    const disableBrush = () => setBrushEnable(false);
    if (isBrushEnable) {
      app.stage.on("pointerdown", enableBrush);
      app.stage.on("pointerup", disableBrush);
      app.stage.on("pointermove", drawCircle);
    } else {
      app.stage.off("pointerdown", enableBrush);
      app.stage.off("pointerup", disableBrush);
      app.stage.off("pointermove", drawCircle);
    }
  }, [
    isBrushEnable,
    image,
    isBlurEnable,
    renderTexture,
    app.stage,
    app.renderer,
  ]);
  return {
    isBlurEnable,
    setBlurEnable,
  };
};

export default useBlurTool;
