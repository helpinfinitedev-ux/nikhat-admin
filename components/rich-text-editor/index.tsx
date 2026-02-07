"use client";

import "@blocknote/core/fonts/inter.css";
import { EmbedTab, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect } from "react";
import { uploadImage } from "@/utils/firebase";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: any;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const handleUpload = async (file: File) => {
    try {
      const res = await uploadImage(file);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
      return { url: "" } as any;
    }
  };

  const editor = useCreateBlockNote({
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (!initialContent) return;
    console.log(editor.document);
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(initialContent);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor]);
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const onEditorChange = async () => {
    const markdown = await editor.blocksToHTMLLossy(editor.document);
    console.log(markdown);
    onChange(markdown);
  };

  console.log("initialContent", initialContent);

  return (
    <div className="my-editor flex justify-center items-center">
      <BlockNoteView className=" overflow-hidden min-w-[1124px]! h-auto" style={{ minWidth: "1024px" }} editable={editable || false} onChange={onEditorChange} editor={editor} theme={"light"} />
    </div>
  );
};

export default Editor;
