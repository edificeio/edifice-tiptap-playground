import { useState, useEffect } from "react";

import { Status } from "@edifice-ui/react/dist/utils/Status";
import { odeServices } from "edifice-ts-client";

import { useDropzoneContext } from "~/components/Dropzone/DropzoneContext";
import { UploadedFile } from "~/components/WorkspaceFiles";

export default function useHandleFile() {
  const { files, setFiles } = useDropzoneContext();
  const [status, setStatus] = useState<Status>("idle");
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    (async () => {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const uploadedFileObject: Partial<UploadedFile> = {
            originalFile: file,
            status: "loading",
          };

          try {
            const result = await odeServices.workspace().saveFile(file);

            if (result) {
              uploadedFileObject.uploadedFile = result;
              uploadedFileObject.id = result._id;
              uploadedFileObject.status = "success";
              setStatus("success");
            }
          } catch (error) {
            uploadedFileObject.status = "error";
            setStatus("error");
            console.error(error);
          }

          setUploadFiles((prev) => [...prev, uploadedFileObject]);
        }
      }
    })();
  }, [files, setUploadFiles]);

  const handleDelete = (file: UploadedFile) => {
    const { id, originalFile } = file;
    const tempFiles = [...files].filter((file) => file !== originalFile);
    const tempUploadFiles = [...uploadFiles].filter((file) => file.id !== id);

    console.log(tempFiles, tempUploadFiles);
    setFiles?.(tempFiles);
    setUploadFiles(tempUploadFiles);
  };

  return {
    status,
    uploadFiles,
    setUploadFiles,
    // handleSave,
    handleDelete,
  };
}
