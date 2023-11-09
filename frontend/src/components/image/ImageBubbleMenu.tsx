import { useCallback, useMemo } from "react";

import { ButtonProps, Toolbar, ToolbarItem } from "@edifice-ui/react";
import { Editor, FloatingMenu, FloatingMenuProps } from "@tiptap/react";

interface ImageBubbleMenuProps {
  editor: Editor;
  onEdit(src: string): void;
}
const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({
  editor,
  onEdit,
}) => {
  const onClick = useCallback(() => {
    const { $from, $to } = editor.state.selection;
    let imageURL = "";
    editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (node.isAtom && node.type.name === "image") {
        imageURL = node.attrs.src;
      }
    });
    if (imageURL) {
      onEdit(imageURL);
    }
  }, [editor, onEdit]);
  const imageToolbarItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: "button",
        name: "edit",
        props: { onClick, children: <>RETOUCHER</> } as ButtonProps,
      },
    ];
  }, [onClick]);
  const tippyOptions: FloatingMenuProps["tippyOptions"] = useMemo(
    () => ({
      placement: "top",
      offset: [0, 10],
      zIndex: 999,
    }),
    [],
  );
  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={tippyOptions}
      shouldShow={() => editor.isActive("image")}
    >
      <Toolbar className="p-4" items={imageToolbarItems} />
    </FloatingMenu>
  );
};
export default ImageBubbleMenu;
