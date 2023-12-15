import { Fragment, ReactNode, RefAttributes } from "react";

import {
  Dropdown,
  DropdownMenuOptions,
  IconButton,
  IconButtonProps,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
  /**
   * Props for the trigger
   */
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, "ref"> &
    RefAttributes<HTMLButtonElement>;
  /**
   * Menu icon
   */
  icon: ReactNode;
  /**
   * Menu label (for accessibility)
   */
  ariaLabel: string;
  /**
   * Options to display
   */
  options: DropdownMenuOptions[];
}

export const EditorToolbarDropdownMenu = ({
  triggerProps,
  icon,
  ariaLabel,
  options,
}: Props) => {
  return (
    <>
      <IconButton
        {...triggerProps}
        type="button"
        variant="ghost"
        color="tertiary"
        icon={icon}
        aria-label={ariaLabel}
      />
      <Dropdown.Menu>
        {options.map((option, index) => {
          return (
            <Fragment key={index}>
              {option.type === "divider" ? (
                <Dropdown.Separator />
              ) : (
                <Dropdown.Item
                  icon={option.icon}
                  onClick={() => option.action(null)}
                >
                  {option.label}
                </Dropdown.Item>
              )}
            </Fragment>
          );
        })}
      </Dropdown.Menu>
    </>
  );
};
