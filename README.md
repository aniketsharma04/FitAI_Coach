# 💪 AI Fitness Coach

An AI-powered fitness assistant that generates personalized workout and diet plans using Large Language Models (LLMs). Built with modern web technologies and featuring voice and image generation capabilities for an immersive fitness experience.

![AI Fitness Coach](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.3.1-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC)

## 🚀 Features

### 📋 User Input Collection
Users can provide comprehensive details about themselves:

- **Personal Information**: Name, Age, Gender
- **Physical Metrics**: Height & Weight
- **Fitness Goals**: Weight Loss, Muscle Gain, Maintenance, Endurance, Flexibility
- **Fitness Level**: Beginner / Intermediate / Advanced
- **Workout Location**: Home / Gym / Outdoor / Mixed
- **Dietary Preferences**: Vegetarian / Non-Vegetarian / Vegan / Keto / Paleo
- **Optional Fields**: Medical history, stress level, and more

### 🧠 AI-Powered Plan Generation

The app uses advanced LLM APIs to generate personalized content:

#### 🏋️ Workout Plan
- Daily exercise routines with specific exercises
- Sets, reps, and rest time recommendations
- Warm-up and cool-down routines
- Tailored to fitness level and workout location

#### 🥗 Diet Plan
- Complete daily nutrition breakdown
- Breakfast, lunch, dinner, and snacks
- Portion sizes and macro breakdown
- Aligned with dietary preferences

#### 💬 AI Tips & Motivation
- Lifestyle and posture tips
- Stress management advice
- Sleep and wellness recommendations
- Daily motivational quotes

### ⚡ Prompt Engineering

- **Dynamic Generation**: Each response is generated dynamically based on user input
- **No Hardcoded Plans**: All content is AI-generated and personalized
- **Context-Aware**: Considers all user inputs including medical history and stress levels

### 🔊 Voice Features

- **Read My Plan**: Uses browser Speech Synthesis API to speak out Workout and Diet Plans
- **Selective Playback**: Option to choose which section to listen to — Workout or Diet
- **Natural Voice**: Configurable rate, pitch, and volume for optimal listening experience

### 🖼️ Image Generation

When users click on an exercise or meal item, the app generates visual representations:

- **Exercise Images**: Realistic gym/home exercise demonstrations
  - Example: "Barbell Squat" → realistic gym exercise image
- **Food Images**: Appetizing food-style images
  - Example: "Grilled Chicken Salad" → food-style image
- **On-Demand**: Click-to-generate for any exercise or meal item

### 🧾 Additional Features

- **📄 PDF Export**: Export generated plan as PDF (coming soon)
- **🌗 Dark / Light Mode**: Toggle between themes with persistent preference
- **💾 Local Storage**: Save plans in browser local storage
- **🧩 Regenerate Plan**: Generate a new plan with updated parameters
- **⚡ Smooth UI**: Beautiful animations and transitions
- **💬 Daily Motivation**: AI-powered motivational quotes section

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack React Query 5.83.0
- **Form Handling**: React Hook Form 7.61.1 with Zod validation

### Styling
- **CSS Framework**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate
- **Theme**: next-themes for dark mode support

### Backend & APIs
- **Backend**: Supabase Edge Functions (Deno)
- **AI Models**: 
  - Google Gemini 2.5 Flash (via Lovable AI Gateway)
  - Gemini 2.5 Flash Image Preview (for image generation)
- **Voice API**: ElevenLabs (via Supabase Edge Function)
- **Database**: Supabase (for data persistence)

### Development Tools
- **Build Tool**: Vite with React SWC plugin
- **Linting**: ESLint 9.32.0
- **Type Checking**: TypeScript
- **Package Manager**: npm / bun

## 📦 Installation

### Prerequisites

- Node.js 18+ (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm, yarn, or bun
- Supabase account (for backend functions)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd FitAI-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Edge Functions**
   
   Configure the following environment variables in your Supabase project:
   - `LOVABLE_API_KEY`: Your Lovable AI Gateway API key
   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key (for voice features)

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

   The app will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
FitAI-coach/
├── src/
│   ├── components/
│   │   ├── FitnessForm.tsx      # User input form
│   │   ├── PlanDisplay.tsx      # Plan display with voice & image features
│   │   └── ui/                  # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx            # Main page
│   │   └── NotFound.tsx         # 404 page
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/
│   │   └── supabase/            # Supabase client configuration
│   └── lib/                     # Utility functions
├── supabase/
│   └── functions/
│       ├── generate-fitness-plan/  # AI plan generation
│       ├── generate-image/         # AI image generation
│       └── text-to-speech/         # Voice synthesis
├── public/                      # Static assets
└── package.json
```

## 🎯 Usage

1. **Fill in Your Details**: Complete the fitness form with your personal information, goals, and preferences.

2. **Generate Plan**: Click "Generate My Fitness Plan" to create your personalized workout and diet plan.

3. **Explore Your Plan**: 
   - View your workout and diet plans in separate tabs
   - Click the image icon next to exercises/meals to generate visuals
   - Use the "Listen to Plan" button to hear your plan read aloud

4. **Save & Export**: 
   - Your plan is automatically saved to local storage
   - Use the "Export PDF" button to download (coming soon)
   - Click "Regenerate" to create a new plan

5. **Toggle Theme**: Use the moon/sun icon in the header to switch between dark and light modes.

## 🔧 Configuration

### AI Model Configuration

The app uses Google Gemini 2.5 Flash by default. To change the model, edit the Supabase Edge Function in `supabase/functions/generate-fitness-plan/index.ts`:

```typescript
model: 'google/gemini-2.5-flash',  // Change to your preferred model
```

Supported models via Lovable AI Gateway:
- `google/gemini-2.5-flash`
- `openai/gpt-4`
- `anthropic/claude-3-opus`
- And more...

### Voice Configuration

Voice settings can be adjusted in `supabase/functions/text-to-speech/index.ts`:

```typescript
voice_id: 'JBFqnCBsd6RMkjVDRZzb',  // Change to your preferred voice
model_id: 'eleven_multilingual_v2',
```

### Image Generation

Image generation uses Gemini's image preview model. To use a different service, modify `supabase/functions/generate-image/index.ts`.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel/Netlify

1. Connect your repository to Vercel or Netlify
2. Set environment variables in the platform dashboard
3. Deploy automatically on push to main branch

### Deploy Supabase Functions

```bash
supabase functions deploy generate-fitness-plan
supabase functions deploy generate-image
supabase functions deploy text-to-speech
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Supabase](https://supabase.com/) for backend infrastructure
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [ElevenLabs](https://elevenlabs.io/) for voice synthesis

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

