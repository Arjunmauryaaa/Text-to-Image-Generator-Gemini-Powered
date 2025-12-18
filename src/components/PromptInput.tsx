import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
}

const promptSuggestions = [
  "A mystical forest with glowing fireflies at twilight",
  "Futuristic cityscape with flying cars and neon lights",
  "Underwater palace made of coral and pearls",
  "Dragon guarding treasure in a mountain cave",
  "Astronaut exploring alien planet with two suns",
  "Enchanted garden with talking flowers",
];

export function PromptInput({ onGenerate, isGenerating, initialPrompt = "" }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={cn(
            "relative rounded-2xl transition-all duration-300",
            isFocused ? "shadow-lg" : "shadow-card"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
              isFocused && "opacity-100"
            )}
            style={{
              background: "var(--gradient-primary)",
              padding: "2px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your imagination... A surreal landscape, a fantasy creature, or anything you can dream of."
            className={cn(
              "min-h-[140px] resize-none rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm",
              "text-base placeholder:text-muted-foreground/60",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent",
              "transition-all duration-300 p-5"
            )}
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Pro tip: Be specific and descriptive for best results</span>
            <span className="sm:hidden">Be specific for best results</span>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            disabled={!prompt.trim() || isGenerating}
            className="min-w-[160px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <p className="text-sm text-muted-foreground mb-3">Need inspiration? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full",
                "bg-secondary/50 hover:bg-secondary text-secondary-foreground",
                "border border-border/50 hover:border-primary/30",
                "transition-all duration-200 hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isGenerating}
            >
              {suggestion.length > 40 ? suggestion.slice(0, 40) + "..." : suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
