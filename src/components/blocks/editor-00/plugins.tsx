import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Toolbar } from "@/components/editor/editor-ui/toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Plugins() {
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <>
      {/* Toolbar */}
      <Toolbar />

      {/* Editor Content with ScrollArea */}
      <ScrollArea className="flex-1">
        <div className="relative h-full">
          <RichTextPlugin
            contentEditable={
              <div className="h-full">
                <div className="h-full" ref={onRef}>
                  <ContentEditable placeholder="Mulai menulis artikel Anda di sini..." />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          {/* Editor Plugins */}
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <TabIndentationPlugin />
        </div>
      </ScrollArea>
    </>
  );
}
