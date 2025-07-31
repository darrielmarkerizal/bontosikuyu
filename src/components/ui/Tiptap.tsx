"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Code,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Monitor,
} from "lucide-react";
import { useState } from "react";

// define your extension array
const extensions = [
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: "mb-4",
      },
    },
    hardBreak: {
      HTMLAttributes: {
        class: "mb-2",
      },
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 hover:underline cursor-pointer",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: "bg-yellow-200 px-1 rounded",
    },
  }),
];

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const Tiptap = ({
  content = "<p>Hello World!</p>",
  onChange,
  readOnly = false,
}: TiptapProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showRenderPreview, setShowRenderPreview] = useState(false);
  const [previewData, setPreviewData] = useState("");

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON();

      if (onChange) {
        onChange(htmlContent);
      }

      // Update preview data
      setPreviewData(JSON.stringify(jsonContent, null, 2));
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Handle Enter key for line breaks
        if (event.key === "Enter" && !event.shiftKey) {
          // Insert a line break
          editor?.chain().focus().setHardBreak().run();
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="space-y-4">
      <div className="border border-input rounded-md bg-background">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
          {/* Headings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
            }
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
            }
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""
            }
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-accent" : ""}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-accent" : ""}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-accent" : ""}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "bg-accent" : ""}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Alignment */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""
            }
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""
            }
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""
            }
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={
              editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""
            }
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-accent" : ""}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-accent" : ""}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Quote and Code */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-accent" : ""}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "bg-accent" : ""}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={editor.isActive("link") ? removeLink : addLink}
            className={editor.isActive("link") ? "bg-accent" : ""}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Preview Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className={showPreview ? "bg-accent" : ""}
            title="Preview Data"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Render Preview Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRenderPreview(!showRenderPreview)}
            className={showRenderPreview ? "bg-accent" : ""}
            title="Preview Render"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="p-4">
          <EditorContent
            editor={editor}
            className="min-h-[200px] focus:outline-none prose prose-sm max-w-none"
          />
        </div>

        {/* Floating Menu for quick formatting */}
        <FloatingMenu
          editor={editor}
          className="bg-background border border-input rounded-md shadow-lg p-2"
        >
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
              }
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
              }
            >
              H2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-accent" : ""}
            >
              •
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-accent" : ""}
            >
              1.
            </Button>
          </div>
        </FloatingMenu>
      </div>

      {/* Render Preview - How it will look when published */}
      {showRenderPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Preview Render - Bagaimana tampilan saat dipublikasikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  lineHeight: "1.6",
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Data */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview Data yang akan disimpan ke Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* HTML Preview */}
              <div>
                <h4 className="font-medium mb-2">HTML Content:</h4>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  {editor.getHTML()}
                </div>
              </div>

              {/* JSON Preview */}
              <div>
                <h4 className="font-medium mb-2">JSON Structure:</h4>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {previewData}
                </pre>
              </div>

              {/* Plain Text Preview */}
              <div>
                <h4 className="font-medium mb-2">Plain Text:</h4>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {editor.getText()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tiptap;
