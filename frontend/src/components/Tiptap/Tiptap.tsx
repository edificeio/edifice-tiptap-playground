import { TiptapWrapper, Toolbar } from "@edifice-ui/react";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useActionOptions } from "~/hooks/useActionOptions";
import { useToolbarItems } from "~/hooks/useToolbarItems";

import "~/styles/index.scss";
import "~/styles/table.scss";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      TextStyle,
      Color,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: `
      <h2>
        Hi there,
      </h2>
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
      <p>
        I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that's amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
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
      `,
  });

  /* A bouger ailleurs, à externaliser ? */
  const [options, listOptions, alignmentOptions] = useActionOptions(editor);

  /* A bouger ailleurs, à externaliser ? */
  const { toolbarItems } = useToolbarItems(
    editor,
    listOptions,
    alignmentOptions,
  );

  console.log(editor?.extensionManager.extensions);

  return (
    <TiptapWrapper>
      <Toolbar
        data={toolbarItems}
        options={options}
        variant="no-shadow"
        isBlock
        align="left"
      />
      <EditorContent editor={editor} className="py-12 px-16" />
    </TiptapWrapper>
  );
};

export default Tiptap;
