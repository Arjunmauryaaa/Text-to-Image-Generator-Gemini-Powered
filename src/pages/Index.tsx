import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PromptInput } from "@/components/PromptInput";
import { StyleSelector } from "@/components/StyleSelector";
import { AspectRatioSelector } from "@/components/AspectRatioSelector";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptHistory } from "@/components/PromptHistory";
import { useImageGeneration } from "@/hooks/useImageGeneration";

export default function Index() {
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  
  const {
    isGenerating,
    currentImage,
    history,
    generateImage,
    clearHistory,
    selectFromHistory,
  } = useImageGeneration();

  const handleGenerate = async (prompt: string) => {
    await generateImage({ prompt, style, aspectRatio });
  };

  const handleSelectFromHistory = (item: typeof history[0]) => {
    selectFromHistory(item);
    setStyle(item.style);
    setAspectRatio(item.aspectRatio);
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <Header />

      <main className="relative container mx-auto px-4 py-8 lg:py-12">
        <HeroSection />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main content */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card-strong p-6 lg:p-8 space-y-8"
            >
              <PromptInput
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                initialPrompt={currentImage?.prompt}
              />
              
              <div className="grid gap-6">
                <StyleSelector
                  selectedStyle={style}
                  onStyleChange={setStyle}
                  disabled={isGenerating}
                />
                
                <AspectRatioSelector
                  selectedRatio={aspectRatio}
                  onRatioChange={setAspectRatio}
                  disabled={isGenerating}
                />
              </div>
            </motion.div>

            <ImageDisplay
              image={currentImage}
              isGenerating={isGenerating}
            />
          </div>

          {/* History sidebar */}
          <PromptHistory
            history={history}
            onSelect={handleSelectFromHistory}
            onClear={clearHistory}
            disabled={isGenerating}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Create amazing images from your imagination
          </p>
        </div>
      </footer>
    </div>
  );
}
