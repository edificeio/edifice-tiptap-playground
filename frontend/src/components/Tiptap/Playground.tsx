import { useEffect, useRef, useState } from "react";

import { Editor, EditorRef } from "@edifice-ui/editor";
import { Edit, TextToSpeech } from "@edifice-ui/icons";
import { Toolbar, ToolbarItem } from "@edifice-ui/react";

const initialContent = `
<h2>
  Hi there,
</h2>
<p class="info">Ceci est une information</p><p class="warning">Ceci est un avertissement</p>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre>
  <code class="language-css">
    body {
      display: none;
    }
  </code>
</pre>
<img width="400" height="150" src="https://images.unsplash.com/photo-1682685796186-1bb4a5655653?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="mon image" />
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>
<blockquote>
  Wow, that's amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
<p>
  And now, an internal link : <a href="/blog" title="A link" target="_blank" data-id="123456" data-app-prefix="blog">See it at this very long long long long long long long long long long long long long long long long long long long long long long long long longlong very longlonglonglonglong truc</a>
</p>
<table>
    <tbody>
      <tr>
        <th>Name</th>
        <th colspan="3">Description</th>
      </tr>
      <tr>
        <td>Cyndi Lauper</td>
        <td>singer</td>
        <td>songwriter</td>
        <td>actress</td>
      </tr>
    </tbody>
</table>
  <div>
    <div class="attachments">
      <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
        <div class="download"></div>
        First
    </a>
      <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
        <div class="download"></div>
        Second
    </a>
    <div class="attachments">
      <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
        <div class="download"></div>
        First
    </a>
      <a href="/workspace/document/23c8ab9e-386a-4d7e-a280-91f77d0da68c">
        <div class="download"></div>
        Second
    </a>
</div>
`;

const Playground = () => {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"read" | "edit">("edit");

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
