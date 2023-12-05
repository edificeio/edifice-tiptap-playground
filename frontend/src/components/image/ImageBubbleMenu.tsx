import { useCallback, useMemo } from "react";

import { ButtonProps, Toolbar, ToolbarItem } from "@edifice-ui/react";
import { Editor, FloatingMenu, FloatingMenuProps } from "@tiptap/react";

import { useImageSelected } from "~/hooks/useImageSelected";

interface ImageBubbleMenuProps {
  editor: Editor;
  onEdit(data: { src: string; alt: string; title: string }): void;
}
const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({
  editor,
  onEdit,
}) => {
  const { getSelection } = useImageSelected(editor);
  const onClick = useCallback(() => {
    const selected = getSelection();
    if (selected.length > 0) {
      onEdit(selected[0]);
    }
  }, [onEdit, getSelection]);
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
