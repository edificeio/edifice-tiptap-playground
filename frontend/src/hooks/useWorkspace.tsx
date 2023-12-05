import { odeServices } from "edifice-ts-client";

export function useWorkspace() {
  const createOrUpdate = async ({
    alt,
    uri,
    blob,
    legend,
    parentId,
    application,
  }: {
    blob: Blob;
    uri?: string;
    alt?: string;
    legend?: string;
    application?: string;
    parentId?: string;
  }) => {
    const regex = /\/workspace\/document\/([0-9a-fA-F-]+)/;
    const matches = (uri ?? "").match(regex);
    if (matches && matches.length === 2) {
      const uuid = matches[1];
      await odeServices.workspace().updateFile(uuid, blob, { alt, legend });
      return `/workspace/document/${uuid}`;
    } else {
      const res = await odeServices
        .workspace()
        .saveFile(blob, { application, parentId });
      return `/workspace/document/${res._id}`;
    }
  };
  return { createOrUpdate };
}
