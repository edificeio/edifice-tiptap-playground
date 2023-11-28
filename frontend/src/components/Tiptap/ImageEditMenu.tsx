import {
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  Wand,
} from "@edifice-ui/icons";
import { Button, IconButton } from "@edifice-ui/react";
import { BubbleMenu } from "@tiptap/react";
import { useTranslation } from "react-i18next";

const ImageEditMenu = ({ editor }: { editor: any }) => {
  const { t } = useTranslation();

  const buttonSizeList = [
    {
      icon: <ImageSizeSmall />,
      taille: "small",
      size: {
        width: 250,
        height: "auto",
      },
    },
    {
      icon: <ImageSizeMedium />,
      taille: "medium",
      size: {
        width: 350,
        height: "auto",
      },
    },
    {
      icon: <ImageSizeLarge />,
      taille: "large",
      size: {
        width: 500,
        height: "auto",
      },
    },
  ];

  const handleButtonClick = (buttonSize: any) => {
    editor
      .chain()
      .focus()
      .setAttributes({
        width: buttonSize.width,
        height: buttonSize.height,
        size: buttonSize.taille,
      })
      .run();
  };

  return (
    <BubbleMenu
      shouldShow={({ editor }) => editor.isActive("custom-image")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <div className="buble-menu">
        <Button
          size="lg"
          variant="ghost"
          leftIcon={<Wand />}
          //onClick={() => } Afficher la modal d'edit modal
        >
          {t("edit.image")}
        </Button>
        <div className="vr"></div>
        {buttonSizeList.map((button, index) => (
          <IconButton
            key={index}
            icon={button.icon}
            variant={
              editor.view.state.selection.node?.attrs?.size === button.taille
                ? "filled"
                : "ghost"
            }
            onClick={() => handleButtonClick(button.size)}
          />
        ))}
      </div>
    </BubbleMenu>
  );
};

export default ImageEditMenu;
