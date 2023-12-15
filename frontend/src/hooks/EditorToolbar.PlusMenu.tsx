import { Fragment } from "react";

import { Dropdown, DropdownMenuOptions } from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
  /**
   * Options to display
   */
  options: DropdownMenuOptions[];
}

export const EditorToolbarPlusMenu = ({ options }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Dropdown.Trigger
        variant="ghost"
        label={t("Plus")}
        size="md"
        tabIndex={-1}
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
