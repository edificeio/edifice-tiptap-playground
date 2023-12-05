import { Editor } from "@tiptap/react";

export function useImageSelected(editor?: Editor | null) {
  const getSelection = () => {
    const datas: Array<{ src: string; title: string; alt: string }> = [];
    if (!editor) {
      return datas;
    }
    const { $from, $to } = editor.state.selection;
    editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (node.isAtom && node.type.name === "image") {
        const { src, title, alt } = node.attrs;
        datas.push({
          src,
          title,
          alt,
        });
      }
    });
    return datas;
  };
  const setAttributes = ({
    url,
    alt,
    title,
  }: {
    url: string;
    alt?: string;
    title?: string;
  }) => {
    function addTimestampToImageUrl(imageUrl: string) {
      const timestamp = new Date().getTime();
      const separator = imageUrl.includes("?") ? "&" : "?";
      return `${imageUrl}${separator}timestamp=${timestamp}`;
    }
    editor
      ?.chain()
      .updateAttributes("image", {
        src: addTimestampToImageUrl(url),
        alt,
        title,
      })
      .run();
  };
  return { setAttributes, getSelection };
}
