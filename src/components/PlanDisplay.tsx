import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Download, Sparkles, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface PlanDisplayProps {
  plan: any;
  onRegenerate: () => void;
}

export const PlanDisplay = ({ plan, onRegenerate }: PlanDisplayProps) => {
  const [isPlayingWorkout, setIsPlayingWorkout] = useState(false);
  const [isPlayingDiet, setIsPlayingDiet] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({});

  // Function to remove markdown asterisks for better readability
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '');
  };

  const handleVoicePlayback = (text: string, type: "workout" | "diet") => {
    const setLoading = type === "workout" ? setIsPlayingWorkout : setIsPlayingDiet;
    
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast.error("Your browser doesn't support text-to-speech");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setLoading(true);
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setLoading(false);
      };
      
      utterance.onerror = () => {
        setLoading(false);
        toast.error("Failed to play audio. Please try again.");
      };
      
      window.speechSynthesis.speak(utterance);
      toast.success(`Playing ${type} plan`);
    } catch (error) {
      console.error("Error with voice playback:", error);
      toast.error("Failed to play audio. Please try again.");
      setLoading(false);
    }
  };

  const handleImageGeneration = async (text: string, itemKey: string) => {
    setGeneratingImage(itemKey);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ prompt: `High quality realistic image of ${text} for fitness training` })
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImages(prev => ({ ...prev, [itemKey]: data.imageUrl }));
      toast.success("Image generated!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(null);
    }
  };

  const exportToPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="p-6 shadow-secondary border-secondary/20">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
              Your Personalized Fitness Plan
            </h2>
            <p className="text-muted-foreground mt-1">AI-generated just for you</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportToPDF}
              variant="outline"
              className="border-secondary/30 hover:bg-secondary/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              onClick={onRegenerate}
              className="bg-gradient-secondary hover:opacity-90 text-white shadow-secondary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>
      </Card>

      {/* Motivation Quote */}
      {plan.motivation && (
        <Card className="p-6 bg-gradient-hero border-0 text-white shadow-primary">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Daily Motivation</h3>
              <p className="text-white/90 italic">{cleanText(plan.motivation)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Plan Content */}
      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="workout" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            Workout Plan
          </TabsTrigger>
          <TabsTrigger value="diet" className="data-[state=active]:bg-gradient-success data-[state=active]:text-white">
            Diet Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-6">
          <Card className="p-6 shadow-primary border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-foreground">Your Workout Routine</h3>
              <Button
                onClick={() => handleVoicePlayback(plan.workout, "workout")}
                disabled={isPlayingWorkout}
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                {isPlayingWorkout ? "Playing..." : "Listen to Plan"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click the image icon next to any exercise to generate a visual demonstration.
            </p>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-foreground space-y-4">
                {plan.workout.split('\n').map((line: string, index: number) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  const isExercise = trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || trimmedLine.includes('•') || trimmedLine.match(/^\d+\./);
                  
                  return (
                    <div key={index} className="group">
                      {isExercise && (
                        <div className="flex items-start gap-3">
                          <p className="flex-1">{cleanText(line)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleImageGeneration(trimmedLine, `workout-${index}`)}
                            disabled={generatingImage === `workout-${index}`}
                            className="shrink-0 text-primary hover:text-primary hover:bg-primary/10"
                            title="Generate exercise image"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {!isExercise && <p>{cleanText(line)}</p>}
                      {generatedImages[`workout-${index}`] && (
                        <img
                          src={generatedImages[`workout-${index}`]}
                          alt="Exercise visualization"
                          className="mt-2 rounded-lg max-w-sm shadow-lg"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="diet" className="mt-6">
          <Card className="p-6 shadow-success border-success/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-foreground">Your Nutrition Plan</h3>
              <Button
                onClick={() => handleVoicePlayback(plan.diet, "diet")}
                disabled={isPlayingDiet}
                className="bg-gradient-success hover:opacity-90 text-white"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                {isPlayingDiet ? "Playing..." : "Listen to Plan"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click the image icon next to any meal to generate a visual of your food.
            </p>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-foreground space-y-4">
                {plan.diet.split('\n').map((line: string, index: number) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  const isMeal = trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || trimmedLine.includes(':') || trimmedLine.match(/^\d+\./);
                  
                  return (
                    <div key={index} className="group">
                      {isMeal && (
                        <div className="flex items-start gap-3">
                          <p className="flex-1">{cleanText(line)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleImageGeneration(trimmedLine, `diet-${index}`)}
                            disabled={generatingImage === `diet-${index}`}
                            className="shrink-0 text-success hover:text-success hover:bg-success/10"
                            title="Generate meal image"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {!isMeal && <p>{cleanText(line)}</p>}
                      {generatedImages[`diet-${index}`] && (
                        <img
                          src={generatedImages[`diet-${index}`]}
                          alt="Meal visualization"
                          className="mt-2 rounded-lg max-w-sm shadow-lg"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      {plan.tips && (
        <Card className="p-6 shadow-lg border-accent/20">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Lifestyle Tips</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-line">{cleanText(plan.tips)}</p>
          </div>
        </Card>
      )}
    </div>
  );
};