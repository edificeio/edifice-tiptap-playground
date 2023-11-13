import * as PIXI from "pixi.js";

const useRotateTool = ({
  application,
  spriteName,
  height,
  width,
  onResize,
}: {
  spriteName: string;
  width: number;
  height: number;
  application?: PIXI.Application;
  onResize: (arg: { width: number; height: number }) => void;
}) => {
  const rotate = () => {
    const child = application?.stage.getChildByName(spriteName);
    if (application && child) {
      child.rotation += 90 * (Math.PI / 180);
      const size = Math.max(width, height);
      onResize({ width: size, height: size });
    }
  };
  return {
    rotate,
  };
};

export default useRotateTool;
