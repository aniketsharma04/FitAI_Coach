import { useState, useEffect } from "react";
import { FitnessForm } from "@/components/FitnessForm";
import { PlanDisplay } from "@/components/PlanDisplay";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Dumbbell } from "lucide-react";

const Index = () => {
  const [plan, setPlan] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load saved plan from localStorage
    const savedPlan = localStorage.getItem("fitnessPlan");
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }

    // Check for dark mode preference
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark");
  };

  const handlePlanGenerated = (newPlan: any) => {
    setPlan(newPlan);
  };

  const handleRegenerate = () => {
    setPlan(null);
    localStorage.removeItem("fitnessPlan");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  AI Fitness Coach
                </h1>
                <p className="text-xs text-muted-foreground">Your Personal Training Assistant</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full border-primary/20 hover:bg-primary/10"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!plan ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Transform Your{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Fitness Journey
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get AI-powered personalized workout and nutrition plans tailored to your goals, 
                fitness level, and lifestyle. Start your transformation today!
              </p>
            </div>

            <FitnessForm onPlanGenerated={handlePlanGenerated} />
          </div>
        ) : (
          <PlanDisplay plan={plan} onRegenerate={handleRegenerate} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Powered by AI • Your journey to a healthier you starts here
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;