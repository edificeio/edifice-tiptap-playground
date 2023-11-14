import { useEffect, useState } from "react";

import { UploadCard } from "@edifice-ui/react";
import { Status } from "@edifice-ui/react/dist/utils/Status";
// import { WorkspaceElement } from "edifice-ts-client";

import { useDropzone } from "./DropContext";

export interface UploadedFile {
  fileIndex: number;
  doc: {
    _id: string;
    name: string;
    info: {
      type: string;
      weight: string;
    };
    src: string;
  };
}

const useUploadFiles = (file: File) => {
  const [status, setStatus] = useState<string>("idle");
  const { files, setFiles } = useDropzone();

  const { deleteFile } = useDropzone();

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const result = await new Promise((resolve) =>
          setTimeout(resolve, 2000),
        );

        setStatus("success");

        const doc = {
          _id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          info: {
            type: file.type,
            weight: String(file.size),
          },
          src: "",
        };

        const uploadedFile = {
          fileIndex: files.findIndex((f) => f === file),
          doc,
        };

        setUploadedFiles((prevFiles: any) => [...prevFiles, uploadedFile]);
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* const uploadFile = async (file: File) => {
    console.log(files.findIndex((f) => f === file));
    setStatus("loading");
    try {
      // Simulating upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`File ${file} uploaded successfully`);
      setStatus("success");

      const doc = {
        _id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        info: {
          type: file.type,
          weight: String(file.size),
        },
        src: "",
      };

      const uploadedFile = {
        fileIndex: files.findIndex((f) => f === file),
        doc,
      };

      console.log({ uploadedFile });

      setUploadedFiles((prev) => {
        console.log({ prev });
        return [...prev, uploadedFile];
      });

      return uploadedFile;
    } catch (error) {
      console.error(`File ${file} upload failed`);
      setStatus("error");
    }
  }; */

  const removeFile = async (index: number) => {
    deleteFile(index);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`File removed`);
  };

  /* const handleDelete = (file: UploadedFile) => {
    const { id, originalFile } = file;
    const tempFiles = [...files].filter((file) => file !== originalFile);
    const tempUploadFiles = [...uploadFiles].filter((file) => file.id !== id);

    console.log(tempFiles, tempUploadFiles);
    setFiles?.(tempFiles);
    setUploadFiles(tempUploadFiles);
  }; */

  useEffect(() => {
    if (uploadedFiles) console.log({ uploadedFiles });
  }, [uploadedFiles]);

  return {
    status,
    // uploadFile,
    removeFile,
  };
};

export const File = ({ file, index }: { file: File; index: number }) => {
  // const { status, removeFile } = useUploadFiles(file);

  // const { files } = useDropzone();

  const item = {
    name: file.name,
    info: {
      type: file.type,
      weight: String(file.size),
    },
    src: "",
  };

  return (
    <UploadCard
      status={status}
      item={item}
      onDelete={() => removeFile(index)}
    />
  );
};
