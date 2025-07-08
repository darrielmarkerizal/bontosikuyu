"use client";

import { useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $createParagraphNode,
} from "lexical";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import {
  $isListNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils"; // Import from utils instead
import { mergeRegister } from "@lexical/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Code,
  Undo,
  Redo,
  Indent,
  Outdent,
  Link,
  ImageIcon, // Rename to avoid conflict
  Minus,
} from "lucide-react";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update block type
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList
          ? parentList.getListType()
          : element.getListType();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
      }
    }
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: string) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () =>
            $createHeadingNode(
              headingSize as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
            )
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-background/50 flex-wrap">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Block Type */}
      <Select
        value={blockType}
        onValueChange={(value) => {
          if (value === "paragraph") formatParagraph();
          else if (value.startsWith("h")) formatHeading(value);
          else if (value === "bullet") formatBulletList();
          else if (value === "number") formatNumberedList();
          else if (value === "quote") formatQuote();
        }}
      >
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
          <SelectItem value="bullet">Bullet List</SelectItem>
          <SelectItem value="number">Number List</SelectItem>
          <SelectItem value="quote">Quote</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={isStrikethrough ? "default" : "ghost"}
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={isCode ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          variant={blockType === "bullet" ? "default" : "ghost"}
          size="sm"
          onClick={formatBulletList}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={blockType === "number" ? "default" : "ghost"}
          size="sm"
          onClick={formatNumberedList}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Indent/Outdent */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }
        >
          <Outdent className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }
        >
          <Indent className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Insert */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Implement link insertion
            console.log("Insert link");
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Implement image insertion
            console.log("Insert image");
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Implement horizontal rule insertion
            console.log("Insert horizontal rule");
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
