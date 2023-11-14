import { ChangeEvent, ReactNode, useMemo, useRef, useState } from "react";

import { Plus } from "@edifice-ui/icons";
import { Button, useDropzone } from "@edifice-ui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { DropzoneContext } from "./DropzoneContext";
import DropzoneDrag from "./DropzoneDrag";
import DropzoneImport from "./DropzoneImport";

export interface AttachmentType {
  type: string;
  size: number;
  name: string;
  src: string;
}

interface DropzoneProps {
  className?: string;
  accept?: string[];
  multiple?: boolean;
  handle?: boolean;
  importMessage?: string;
  children?: ReactNode;
}

const Dropzone = ({
  className,
  accept,
  multiple,
  handle = false,
  children,
  importMessage,
}: DropzoneProps) => {
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setFiles((prevFiles) => {
        const newArray = [...prevFiles];
        for (let i = 0; i < files?.length; i++) {
          newArray.push(files[i]);
        }
        return newArray;
      });
    }
  };

  const { dragging, handleDragLeave, handleDragging, handleDrop } = useDropzone(
    inputRef,
    handleOnChange,
  );

  const classes = clsx(
    "dropzone position-relative",
    {
      "is-dragging": dragging,
      "is-drop-files": files.length !== 0 && !handle ? false : true,
    },
    className,
  );

  const value = useMemo(
    () => ({
      files,
      inputRef,
      importMessage,
      setFiles,
    }),
    [inputRef, importMessage, files, setFiles],
  );

  return (
    <DropzoneContext.Provider value={value}>
      <div
        className={classes}
        onDragEnter={handleDragging}
        onDragOver={handleDragging}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="align-center">
          {handle ? (
            <Dropzone.Drag />
          ) : (
            <>
              {files.length !== 0 ? (
                <div className="drop-file-wrapper">
                  <div className="drop-file-content">
                    <div className="add-button m-4">
                      <Button
                        variant="ghost"
                        leftIcon={<Plus></Plus>}
                        onClick={() => inputRef?.current?.click()}
                      >
                        {t("add")}
                      </Button>
                    </div>
                  </div>
                  {children}
                </div>
              ) : (
                <Dropzone.Import />
              )}
              <Dropzone.Drag />
            </>
          )}
        </div>
        <input
          ref={inputRef}
          accept={accept?.join(",")}
          multiple={multiple}
          type="file"
          name="attachment-input"
          id="attachment-input"
          onChange={handleOnChange}
          className="position-absolute"
          style={{ inset: 0 }}
          hidden
        />
      </div>
    </DropzoneContext.Provider>
  );
};

Dropzone.Import = DropzoneImport;
Dropzone.Drag = DropzoneDrag;

Dropzone.displayName = "Dropzone";

export default Dropzone;
