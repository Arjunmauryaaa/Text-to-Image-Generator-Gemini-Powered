import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GenerationOptions {
  prompt: string;
  style: string;
  aspectRatio: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style: string;
  aspectRatio: string;
  createdAt: Date;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
}

const HISTORY_KEY = "gemini-vision-history";
const MAX_HISTORY = 10;

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const newHistory = [item, ...prev.filter(h => h.id !== item.id)].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const generateImage = useCallback(async (options: GenerationOptions) => {
    const { prompt, style, aspectRatio } = options;

    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, style, aspectRatio },
      });

      if (error) {
        console.error("Generation error:", error);
        throw new Error(error.message || "Failed to generate image");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.imageUrl) {
        throw new Error("No image was returned");
      }

      const generatedImage: GeneratedImage = {
        id: crypto.randomUUID(),
        prompt: data.prompt || prompt,
        imageUrl: data.imageUrl,
        style,
        aspectRatio,
        createdAt: new Date(),
      };

      setCurrentImage(generatedImage);

      const historyItem: HistoryItem = {
        ...generatedImage,
        createdAt: generatedImage.createdAt.toISOString(),
      };
      saveToHistory(historyItem);

      toast({
        title: "Image generated!",
        description: "Your AI artwork is ready.",
      });

      return generatedImage;
    } catch (error) {
      console.error("Generation failed:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast, saveToHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast({
      title: "History cleared",
      description: "Your prompt history has been deleted.",
    });
  }, [toast]);

  const selectFromHistory = useCallback((item: HistoryItem) => {
    setCurrentImage({
      ...item,
      createdAt: new Date(item.createdAt),
    });
  }, []);

  return {
    isGenerating,
    currentImage,
    history,
    generateImage,
    clearHistory,
    selectFromHistory,
    setCurrentImage,
  };
}
