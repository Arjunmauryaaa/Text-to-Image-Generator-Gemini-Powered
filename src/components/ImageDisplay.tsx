import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ZoomIn, Copy, Check, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/ImageModal";
import { cn } from "@/lib/utils";
import type { GeneratedImage } from "@/hooks/useImageGeneration";

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
}

export function ImageDisplay({ image, isGenerating }: ImageDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    if (!image?.imageUrl) return;

    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gemini-vision-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleCopyPrompt = async () => {
    if (!image?.prompt) return;

    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full"
      >
        <div
          className={cn(
            "relative aspect-square w-full max-w-xl mx-auto rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-muted/50 to-muted",
            "border border-border/50 shadow-card"
          )}
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Creating your masterpiece...</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
                </div>
                <div className="absolute inset-0 shimmer" />
              </motion.div>
            ) : image?.imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full group"
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                )}
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={handleCopyPrompt}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="glass"
                      size="icon"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="glass"
                      size="icon"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Your creation will appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">Enter a prompt and click Generate</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image info */}
        {image && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 rounded-xl bg-card/50 border border-border/50"
          >
            <p className="text-sm text-muted-foreground line-clamp-2">{image.prompt}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="capitalize">{image.style}</span>
              <span>•</span>
              <span>{image.aspectRatio}</span>
              <span>•</span>
              <span>{image.createdAt.toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <ImageModal
        image={image}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
