// DropzoneContext.js
import { ReactNode, createContext, useContext, useState } from "react";

const DropzoneContext = createContext<{
  files: File[];
  addFile: (file: File) => void;
  deleteFile: (fileId: number) => void;
  setFiles: any;
}>(null!);

export const useDropzone = () => {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzone must be used within a DropzoneProvider");
  }
  return context;
};

export const DropzoneProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);

  const addFile = (file: File) => {
    if (files.includes(file)) return;

    setFiles((prev) => [...prev, file]);
  };

  const deleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <DropzoneContext.Provider value={{ files, addFile, setFiles, deleteFile }}>
      {children}
    </DropzoneContext.Provider>
  );
};
