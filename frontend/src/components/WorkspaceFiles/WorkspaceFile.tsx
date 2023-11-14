import { UploadCard } from "@edifice-ui/react";

import { UploadedFile } from "../WorkspaceFiles";
import useHandleFile from "~/hooks/useHandleFile";

export const customSize = (bytes: number, decimalPoint: number) => {
  if (bytes == 0) return "0 octets";
  const k = 1000,
    dm = decimalPoint || 2,
    sizes = ["octets", "Ko", "Mo", "Go"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const WorkspaceFile = ({ file }: { file: UploadedFile }) => {
  const { status, handleDelete } = useHandleFile();
  const { uploadedFile, originalFile } = file;

  const item = {
    name: uploadedFile.name,
    info: {
      type: originalFile.type,
      weight: customSize(originalFile.size || 0, 1),
    },
    src: `/workspace/document/${uploadedFile._id}`,
  };

  return (
    <UploadCard
      key={uploadedFile._id}
      status={status}
      onEdit={() => console.log("edit")}
      // onRetry={handleSave}
      onDelete={() => handleDelete(file)}
      item={item}
    />
  );
};

export default WorkspaceFile;
