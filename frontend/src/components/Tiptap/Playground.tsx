import { useEffect, useRef, useState } from "react";

import { Editor, EditorRef } from "@edifice-ui/editor";
import { Edit, TextToSpeech } from "@edifice-ui/icons";
import { Toolbar, ToolbarItem } from "@edifice-ui/react";

const initialContent = `
  <p>
    📣
    <strong>
      <span style="font-size: 18px">
        Bienvenue sur votre interface de beta test du futur éditeur multimédia
      </span>
    </strong>
    📣
  </p>
  <p style="text-align: start">
    Nous avons travaillé dur pour que ce nouvel éditeur réponde à toutes vos
    attentes.
  </p>
  <img
    src="/workspace/document/196e60bf-5fbb-42e0-aaae-263ea1eb63ab"
    class="custom-image"
    textalign="left"
    width="645"
    height="430"
  />
  <p style="text-align: start">
    Vous pouvez tester ce nouvel éditeur en éditant ce contenu. Cliquer sur
    l’icône en haut à droite de ce texte pour passer en mode édition
  </p>
  <img
    src="/workspace/document/53da6cdb-6be9-4b73-afbb-da1d388fa01c"
    class="custom-image"
    textalign="justify"
    width="125"
    height="83.33333333333333"
  />
  <p style="text-align: start">
    Vous pouvez aussi vérifier que vos anciens billets de blogs seront bien
    lisibles et modifiables avec le nouvel éditeur en les sélectionnant dans le
    menu de gauche.
  </p>
  <p style="text-align: start">
    <strong> ⬅️ Sélectionner un billet dans le menu de gauche </strong>
  </p>
  <p style="text-align: start">
    ⚠️ Rassurez-vous les modifications que vous ferez sur les billets seront pas
    enregistrées ! Il s’agit uniquement de voir comment ils seront affichés et
    s’ils sont facilement éditables ⚠️
  </p>
  <p style="text-align: start">
    Et surtout, pour nous permettre de nous améliorer, ou de confirmer que vous
    êtes convaincus, laissez-nous votre avis :
    <a
      target="répondre au questionnaire en ligne (4 questions)"
      rel="noopener noreferrer nofollow"
      class="cc-tgpl01"
      href="https://survey.opendigitaleducation.com/index.php/361124?lang=fr"
      title="https://survey.opendigitaleducation.com/index.php/361124?lang=fr"
      >répondre au questionnaire en ligne (4 questions)</a
    >.
  </p>
`;

const Playground = () => {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"read" | "edit">("read");

  const toolbarDemo: ToolbarItem[] = [
    {
      type: "icon",
      props: {
        icon: <TextToSpeech />,
        className: editorRef.current?.isSpeeching() ? "bg-primary" : "",
        "aria-label": "Synthèse vocale",
        onClick: () => {},
      },
      name: "video",
      visibility: mode === "edit" ? "hide" : "show",
    },
    {
      type: "icon",
      props: {
        icon: <Edit />,
        className: mode === "edit" ? "bg-primary" : "",
        "aria-label": "Changer de mode",
        onClick: () => setMode(mode === "edit" ? "read" : "edit"),
      },
      name: "mode",
    },
  ];

  // Playground data
  const queryParameters = new URLSearchParams(window.location.search);
  const fileId = queryParameters.get("file");
  const docId = queryParameters.get("doc");
  const source = queryParameters.get("source");

  useEffect(() => {
    if (fileId) {
      fetch(`/pocediteur/files/${fileId}`).then((response) => {
        if (response.ok) {
          response.text().then((data) => {
            setContent(data);
          });
        }
      });
    } else if (docId) {
      fetch(`/pocediteur/${source}/docs/${docId}?cleanHtml=true`).then(
        (response) => {
          if (response.ok) {
            response.json().then((data) => {
              setContent(data.content);
            });
          }
        },
      );
    }
  }, [fileId, docId, source]);

  return (
    <>
      <Toolbar
        items={toolbarDemo}
        variant="no-shadow"
        isBlock={true}
        align="right"
      />
      <Editor ref={editorRef} content={content} mode={mode}></Editor>
    </>
  );
};

export default Playground;
