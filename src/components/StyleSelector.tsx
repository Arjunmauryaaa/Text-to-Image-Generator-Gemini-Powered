import { motion } from "framer-motion";
import { Palette, Camera, Gamepad2, Pencil, Brush, Wand2, Box, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

const styles = [
  { id: "realistic", label: "Realistic", icon: Camera, description: "Photorealistic quality" },
  { id: "anime", label: "Anime", icon: Palette, description: "Japanese art style" },
  { id: "cyberpunk", label: "Cyberpunk", icon: Gamepad2, description: "Neon futuristic" },
  { id: "sketch", label: "Sketch", icon: Pencil, description: "Hand-drawn look" },
  { id: "oil-painting", label: "Oil Paint", icon: Brush, description: "Classical art" },
  { id: "fantasy", label: "Fantasy", icon: Wand2, description: "Magical & ethereal" },
  { id: "3d-render", label: "3D Render", icon: Box, description: "CGI quality" },
  { id: "minimalist", label: "Minimal", icon: Minimize2, description: "Clean & simple" },
];

export function StyleSelector({ selectedStyle, onStyleChange, disabled }: StyleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-3"
    >
      <label className="text-sm font-medium text-foreground">Art Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {styles.map((style, index) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;
          
          return (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.03 }}
              onClick={() => onStyleChange(style.id)}
              disabled={disabled}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl",
                "border transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-lg"
                  : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-card"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="style-indicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5 transition-colors", isSelected && "text-primary")} />
              <span className="text-sm font-medium">{style.label}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {style.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
