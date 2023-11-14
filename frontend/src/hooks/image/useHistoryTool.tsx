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
  const [history, setHistory] = useState<Promise<Blob>[]>([]);
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
  const restore = async () => {
    const imgData = history.pop();
    if (imgData) {
      onRestore(await imgData, imageDetails);
      setHistory(history.filter((current) => current !== imgData));
    }
  };
  const historize = <T extends (...args: any[]) => any>(callback: T) => {
    return function (...args: any[]) {
      const promise = new Promise<Blob>((resolve, reject) => {
        application?.view?.toBlob?.(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("EXTRACT_FAIL");
            }
          },
          "image/png",
          1,
        );
      });
      setHistory([...history, promise]);
      return callback.call(callback, ...args);
    } as T;
  };
  return {
    historyCount: history.length,
    restore,
    historize,
  };
};

export default useHistoryTool;
