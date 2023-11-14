// Dropzone.js
import React, { ChangeEvent, useCallback } from "react";

import { useDropzone } from "./DropContext";

const Dropzone = () => {
  const { addFile } = useDropzone();

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const acceptedFiles = event.target.files;

      if (acceptedFiles)
        [...acceptedFiles].forEach((file) => {
          addFile(file);
        });
    },
    [addFile],
  );

  return (
    <div>
      <h2>Dropzone</h2>
      <input type="file" multiple accept="image/*" onChange={handleOnChange} />
    </div>
  );
};

export default Dropzone;
