import { useEffect, useState } from "react";

import * as PIXI from "pixi.js";
export interface UseHistoryToolsProps {
  maxSize?: number;
  application?: PIXI.Application;
  spriteName: string;
  rotateCount: number;
  onRestore: (img: Blob, state: HistoryState) => void;
}

export interface HistoryState {
  backup: Promise<Blob>;
  rotateCount: number;
  stageSize: { width: number; height: number };
  spriteSize: { width: number; height: number };
}
const DEFAULT_MAX_SIZE = 20;
const useHistoryTool = ({
  maxSize = DEFAULT_MAX_SIZE,
  application,
  spriteName,
  rotateCount,
  onRestore,
}: UseHistoryToolsProps) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  useEffect(() => {
    setHistory([]);
  }, [application]);
  const restore = async () => {
    const imgData = history.pop();
    if (imgData) {
      onRestore(await imgData.backup, imgData);
      setHistory(history.filter((current) => current !== imgData));
    }
  };
  const listSize = (arr: HistoryState[]) => {
    if (arr.length > maxSize) {
      arr.splice(0, arr.length - maxSize);
    }
    return arr;
  };
  const historize = <T extends (...args: any[]) => any>(callback: T) => {
    return async function (...args: any[]) {
      const sprite = application?.stage.getChildByName(spriteName, true) as
        | PIXI.Sprite
        | null
        | undefined;

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
      const state = {
        backup: promise,
        rotateCount,
        spriteSize:
          rotateCount % 2 === 1
            ? { width: sprite?.height ?? 0, height: sprite?.width ?? 0 }
            : { width: sprite?.width ?? 0, height: sprite?.height ?? 0 },
        stageSize:
          rotateCount % 2 === 1
            ? { width: sprite?.height ?? 0, height: sprite?.width ?? 0 }
            : { width: sprite?.width ?? 0, height: sprite?.height ?? 0 },
      };
      setHistory([...listSize(history), state]);
      await promise;
      return callback.call(callback, ...args);
    };
  };
  return {
    historyCount: history.length,
    restore,
    historize,
  };
};

export default useHistoryTool;
