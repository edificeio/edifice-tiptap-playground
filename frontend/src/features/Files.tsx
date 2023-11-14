// Files.js
import { useDropzone } from "./DropContext";
import { File } from "./File";

const Files = () => {
  const { files } = useDropzone();

  return (
    <div>
      <h2>Files</h2>
      {files.map((file, index) => (
        <File key={index} file={file} index={index} />
      ))}
    </div>
  );
};

export default Files;
