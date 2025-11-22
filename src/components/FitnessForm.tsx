import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  fitnessLevel: string;
  location: string;
  diet: string;
  medicalHistory: string;
  stressLevel: string;
}

interface FitnessFormProps {
  onPlanGenerated: (plan: any) => void;
}

export const FitnessForm = ({ onPlanGenerated }: FitnessFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    fitnessLevel: "",
    location: "",
    diet: "",
    medicalHistory: "",
    stressLevel: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.age || !formData.gender || !formData.height || 
        !formData.weight || !formData.goal || !formData.fitnessLevel || 
        !formData.location || !formData.diet) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-fitness-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      onPlanGenerated(data);
      toast.success("Your personalized fitness plan is ready!");
      
      // Save to localStorage
      localStorage.setItem("fitnessData", JSON.stringify(formData));
      localStorage.setItem("fitnessPlan", JSON.stringify(data));
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-8 shadow-primary border-primary/20">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Your Fitness Journey Starts Here
        </h2>
        <p className="text-muted-foreground mt-2">Tell us about yourself to get your personalized plan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="John Doe"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="25"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => updateField("height", e.target.value)}
              placeholder="175"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="70"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Fitness Goal *</Label>
            <Select value={formData.goal} onValueChange={(value) => updateField("goal", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="endurance">Build Endurance</SelectItem>
                <SelectItem value="flexibility">Improve Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Fitness Level *</Label>
            <Select value={formData.fitnessLevel} onValueChange={(value) => updateField("fitnessLevel", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Workout Location *</Label>
            <Select value={formData.location} onValueChange={(value) => updateField("location", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Where will you workout?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet">Dietary Preference *</Label>
            <Select value={formData.diet} onValueChange={(value) => updateField("diet", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select your diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stressLevel">Stress Level</Label>
            <Select value={formData.stressLevel} onValueChange={(value) => updateField("stressLevel", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select stress level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => updateField("medicalHistory", e.target.value)}
            placeholder="Any injuries, conditions, or medications we should know about..."
            className="border-primary/20 focus:border-primary resize-none"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-6 text-lg shadow-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            "Generate My Fitness Plan"
          )}
        </Button>
      </form>
    </Card>
  );
};