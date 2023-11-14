import { useTranslation } from "react-i18next";

const DropzoneDrag = () => {
  const { t } = useTranslation();

  return (
    <div className="drop-wrapper">
      <div className="drop-content">
        <p className="drop-text">{t("medialibrary.drop.help")}</p>
      </div>
    </div>
  );
};

DropzoneDrag.displayName = "Dropzone.Drag";

export default DropzoneDrag;
