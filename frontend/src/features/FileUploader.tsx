import { useEffect, useState } from "react";

import { UploadCard } from "@edifice-ui/react";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileStatus, setFileStatus] = useState({});

  const handleFileChange = (e) => {
    const newFiles = [...e.target.files];
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Set initial status for each file
    /* const newFileStatus = {};
    newFiles.forEach((_, index) => {
      newFileStatus[index] = "loading";
    });
    setFileStatus((prevStatus) => ({ ...prevStatus, ...newFileStatus })); */
  };

  const uploadFile = async (file: File, index) => {
    console.log("upload", { file });
    const newFileStatus = {};
    files.forEach((_, index) => {
      newFileStatus[index] = "loading";
    });
    setFileStatus((prevStatus) => ({ ...prevStatus, ...newFileStatus }));

    try {
      const random = Math.random() < 0.5;

      if (random) throw new Error("test");

      // Make HTTP POST request to upload the file
      const res = await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log({ res });

      // Update status to 'success' for the uploaded file
      setFileStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "success",
      }));
    } catch (error) {
      // Update status to 'error' for the file in case of failure
      setFileStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "error",
      }));
    }
  };

  const uploadAllFiles = async () => {
    // Use Promise.all to wait for all file uploads to complete
    await Promise.all(files.map(uploadFile));
  };

  const removeFile = (fileName) => {
    // Remove the file from the files array
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);

    // Remove the status of the file
    const { [fileName]: removedStatus, ...restStatus } = fileStatus;
    setFileStatus(restStatus);
  };

  useEffect(() => {
    (async () => {
      await Promise.all(files.map(uploadFile));
    })();
  }, [files]);

  useEffect(() => {
    if (fileStatus) console.log({ fileStatus });
  }, [fileStatus]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      {/* <button onClick={uploadAllFiles}>Upload Files</button> */}

      {/* {files.map((file) => (
        <div key={file.name}>
          <p>{file.name}</p>
          <p>Status: {fileStatus[file.name]}</p>
          <button onClick={() => removeFile(file.name)}>Remove</button>
        </div>
      ))} */}
      {files.map((file, index) => {
        const item = {
          name: file.name,
          info: {
            type: file.type,
            weight: String(file.size),
          },
          src: "",
        };
        return (
          <UploadCard key={file.name} item={item} status={fileStatus[index]} />
        );
      })}
    </div>
  );
};

export default FileUploader;
