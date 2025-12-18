import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HistoryItem } from "@/hooks/useImageGeneration";
import { useState } from "react";

interface PromptHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function PromptHistory({ history, onSelect, onClear, disabled }: PromptHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="glass"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 gap-2"
      >
        <History className="h-4 w-4" />
        <span>History ({history.length})</span>
      </Button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  History
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                <HistoryList
                  history={history}
                  onSelect={(item) => {
                    onSelect(item);
                    setIsExpanded(false);
                  }}
                  onClear={onClear}
                  disabled={disabled}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="hidden lg:block w-80 flex-shrink-0"
      >
        <div className="sticky top-8 glass-card-strong p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              History
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <HistoryList history={history} onSelect={onSelect} onClear={onClear} disabled={disabled} />
        </div>
      </motion.div>
    </>
  );
}

function HistoryList({
  history,
  onSelect,
  disabled,
}: {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(item)}
          disabled={disabled}
          className={cn(
            "w-full text-left p-3 rounded-xl",
            "bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20",
            "transition-all duration-200 group",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2 leading-tight">
                {item.prompt}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="capitalize">{item.style}</span>
                <span>•</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
