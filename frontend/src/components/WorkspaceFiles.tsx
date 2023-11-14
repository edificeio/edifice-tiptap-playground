import { UploadCard } from "@edifice-ui/react";
import { Status } from "@edifice-ui/react/dist/utils/Status";
import { WorkspaceElement } from "edifice-ts-client/dist/services";

import { useDropzoneContext } from "./Dropzone/DropzoneContext";
import { customSize } from "./WorkspaceFiles/WorkspaceFile";

export interface UploadedFile {
  originalFile: File;
  uploadedFile: WorkspaceElement;
  id: string;
  status: Status;
}

export const WorkspacesFiles = () => {
  const { files } = useDropzoneContext();

  return files.map((file) => {
    const item = {
      name: file.name,
      info: {
        type: file.type,
        weight: customSize(file.size || 0, 1),
      },
      // src: `/workspace/document/${file._id}`,
      src: "",
    };

    console.log({ item });

    return <UploadCard key={file.name} item={item} />;
  });
};
