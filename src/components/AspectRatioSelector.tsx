import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
  disabled?: boolean;
}

const ratios = [
  { id: "1:1", label: "Square", width: 32, height: 32 },
  { id: "16:9", label: "Landscape", width: 40, height: 22 },
  { id: "9:16", label: "Portrait", width: 22, height: 40 },
  { id: "4:3", label: "Standard", width: 36, height: 27 },
];

export function AspectRatioSelector({ selectedRatio, onRatioChange, disabled }: AspectRatioSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-3"
    >
      <label className="text-sm font-medium text-foreground">Aspect Ratio</label>
      <div className="flex flex-wrap gap-3">
        {ratios.map((ratio, index) => {
          const isSelected = selectedRatio === ratio.id;
          
          return (
            <motion.button
              key={ratio.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              onClick={() => onRatioChange(ratio.id)}
              disabled={disabled}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl",
                "border transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                isSelected
                  ? "bg-primary/10 border-primary shadow-lg"
                  : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card"
              )}
            >
              {/* Aspect ratio visual */}
              <div
                className={cn(
                  "border-2 rounded transition-colors flex-shrink-0",
                  isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/30"
                )}
                style={{
                  width: `${ratio.width}px`,
                  height: `${ratio.height}px`,
                }}
              />
              <div className="text-left">
                <span className={cn(
                  "text-sm font-medium block",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {ratio.id}
                </span>
                <span className="text-xs text-muted-foreground">{ratio.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
