"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { PartialBlock } from "@blocknote/core";
import { useEdgeStore } from "@/lib/edgestore";
import { useCallback } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();

  const hanldleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: hanldleUpload,
  });

  const uploadToDatabase = useCallback(() => {
    if (onChange) {
      setTimeout(() => {
        onChange(JSON.stringify(editor.document));
      }, 1000);
    }
  }, [editor, onChange]);

  return (
    <div>
      <BlockNoteView
        onChange={uploadToDatabase}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
