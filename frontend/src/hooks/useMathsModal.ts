import { useToggle } from "@edifice-ui/react";
import { Editor } from "@tiptap/react";

/**
 * Custom hook to manage MathsModal success and cancelation in the current editor context.
 * @returns {
 * `isOpen`: truthy boolean when MathsModal sholud be visible,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * `handleCancel`: Cancel event handler,
 * `handleSuccess`: Success event handler (adds a formula to the editor content),
 * }
 */
export const useMathsModal = (editor: Editor | null) => {
  const [isOpen, toggle] = useToggle(false);

  const handleCancel = () => {
    toggle();
  };

  const handleSuccess = (formulaEditor: string) => {
    editor?.commands.insertContentAt(
      editor.view.state.selection,
      formulaEditor,
    );
    editor?.commands.enter();
    toggle();
  };

  return {
    isOpen,
    toggle,
    handleCancel,
    handleSuccess,
  };
};
