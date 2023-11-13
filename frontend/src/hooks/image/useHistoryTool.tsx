import { useEffect, useState } from "react";

import * as PIXI from "pixi.js";
export interface ImageDetails {
  scale?: { x: number; y: number };
  dimension?: { width: number; height: number };
}
export interface UseHistoryToolsProps extends ImageDetails {
  application?: PIXI.Application;
  onRestore: (img: Blob, details: ImageDetails) => void;
}

const useHistoryTool = ({
  application,
  scale,
  dimension,
  onRestore,
}: UseHistoryToolsProps) => {
  const [history, setHistory] = useState<Blob[]>([]);
  const [imageDetails, setImageDetails] = useState<ImageDetails>({});
  useEffect(() => {
    setHistory([]);
  }, [application]);
  useEffect(() => {
    setImageDetails({
      dimension,
      scale,
    });
  }, [scale, dimension]);
  const restore = () => {
    const imgData = history.pop();
    if (imgData) {
      onRestore(imgData, imageDetails);
      setHistory(history.filter((current) => current !== imgData));
    }
  };
  const wrap = <T extends (...args: any[]) => any>(callback: T) => {
    return function (...args: any[]) {
      application?.view?.toBlob?.(
        (blob) => {
          if (blob) {
            setHistory([...history, blob]);
          }
        },
        "image/png",
        1,
      );
      return callback.call(callback, ...args);
    } as T;
  };
  return {
    historyCount: history.length,
    restore,
    wrap,
  };
};

export default useHistoryTool;
