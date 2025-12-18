import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { GeneratedImage } from "@/hooks/useImageGeneration";

interface ImageModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [copied, setCopied] = useState(false);

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
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="glass"
              size="icon"
              onClick={onClose}
              className="absolute -top-12 right-0 z-10"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-auto max-h-[70vh] object-contain bg-card"
              />
            </div>

            {/* Info bar */}
            <div className="mt-4 p-4 rounded-xl bg-card/90 backdrop-blur-lg border border-border/50">
              <p className="text-sm text-foreground mb-3">{image.prompt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="capitalize px-2 py-1 rounded-md bg-secondary">{image.style}</span>
                  <span className="px-2 py-1 rounded-md bg-secondary">{image.aspectRatio}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopyPrompt}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
