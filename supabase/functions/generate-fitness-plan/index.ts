import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating fitness plan for:', formData.name);

    // Create a comprehensive prompt for Gemini
    const prompt = `You are an expert AI fitness coach. Generate a detailed, personalized fitness plan based on the following information:

Name: ${formData.name}
Age: ${formData.age}
Gender: ${formData.gender}
Height: ${formData.height} cm
Weight: ${formData.weight} kg
Fitness Goal: ${formData.goal}
Current Fitness Level: ${formData.fitnessLevel}
Workout Location: ${formData.location}
Dietary Preference: ${formData.diet}
${formData.medicalHistory ? `Medical History: ${formData.medicalHistory}` : ''}
${formData.stressLevel ? `Stress Level: ${formData.stressLevel}` : ''}

Generate a comprehensive plan that includes:

1. WORKOUT PLAN: A detailed weekly workout schedule with specific exercises, sets, reps, and rest times. Consider their fitness level and location. Include warm-up and cool-down routines.

2. DIET PLAN: A complete daily nutrition plan with breakfast, lunch, dinner, and snacks. Include portion sizes and macro breakdown. Make it suitable for their dietary preference.

3. LIFESTYLE TIPS: Provide 3-5 actionable tips for better posture, stress management, sleep, and overall wellness.

4. MOTIVATION: Include one powerful motivational quote or message to inspire them.

Format your response EXACTLY as follows (use clear sections):

**WORKOUT PLAN:**
[Detailed workout plan here]

**DIET PLAN:**
[Detailed diet plan here]

**LIFESTYLE TIPS:**
[Tips here]

**MOTIVATION:**
[Motivational message here]

Make it personalized, actionable, and encouraging. Be specific with exercise names, meal descriptions, and practical advice.`;

    // Call Lovable AI Gateway
    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 2048,
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated plan successfully');
    console.log('Response length:', generatedText.length);

    // Parse the response into sections with more flexible regex
    const sections = {
      workout: '',
      diet: '',
      tips: '',
      motivation: ''
    };

    // Try to extract sections with flexible matching (case-insensitive, with or without asterisks)
    const workoutMatch = generatedText.match(/\*{0,2}WORKOUT PLAN:?\*{0,2}([\s\S]*?)(?=\*{0,2}DIET PLAN:?\*{0,2}|$)/i);
    const dietMatch = generatedText.match(/\*{0,2}DIET PLAN:?\*{0,2}([\s\S]*?)(?=\*{0,2}LIFESTYLE TIPS:?\*{0,2}|$)/i);
    const tipsMatch = generatedText.match(/\*{0,2}LIFESTYLE TIPS:?\*{0,2}([\s\S]*?)(?=\*{0,2}MOTIVATION:?\*{0,2}|$)/i);
    const motivationMatch = generatedText.match(/\*{0,2}MOTIVATION:?\*{0,2}([\s\S]*?)$/i);

    sections.workout = workoutMatch ? workoutMatch[1].trim() : generatedText;
    sections.diet = dietMatch ? dietMatch[1].trim() : '';
    sections.tips = tipsMatch ? tipsMatch[1].trim() : '';
    sections.motivation = motivationMatch ? motivationMatch[1].trim() : 'Your fitness journey starts today. Every small step counts!';

    console.log('Parsed sections - Workout length:', sections.workout.length);
    console.log('Parsed sections - Diet length:', sections.diet.length);
    console.log('Parsed sections - Tips length:', sections.tips.length);
    
    // If diet is still empty, try to extract it from the full text
    if (!sections.diet && generatedText.toLowerCase().includes('diet')) {
      console.log('Diet section empty, attempting alternative extraction');
      const altDietMatch = generatedText.match(/(?:diet|nutrition)[\s\S]{0,100}?(breakfast|meal|calorie|protein)[\s\S]*?(?=lifestyle|tips|motivation|$)/i);
      if (altDietMatch) {
        sections.diet = altDietMatch[0].trim();
        console.log('Alternative diet extraction successful, length:', sections.diet.length);
      }
    }

    return new Response(
      JSON.stringify(sections),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-fitness-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});