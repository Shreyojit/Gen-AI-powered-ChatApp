// // src/app/api/translate/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { HfInference } from '@huggingface/inference';

// const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_KEY as string;
// const inference = new HfInference(HF_ACCESS_TOKEN);

// interface TranslationRequestBody {
//   text: string;
//   lang: 'en-es' | 'en-de' | 'en-fr'; // Extend with more language options as needed
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { text, lang }: TranslationRequestBody = await req.json();

//     // Map the languages to the correct models
//     const languageModels: Record<string, string> = {
//       'en-es': 'Helsinki-NLP/opus-mt-en-es',
//       'en-de': 'Helsinki-NLP/opus-mt-en-de',
//       'en-fr': 'Helsinki-NLP/opus-mt-en-fr',
//       // Add more models as needed
//     };

//     const model = languageModels[lang];

//     if (!model) {
//       return NextResponse.json({ message: 'Unsupported language' }, { status: 400 });
//     }

//     const translationResponse = await inference.translation({
//       model: model,
//       inputs: text,
//     });

//     // Log the response structure for debugging
//     console.log('Translation Response:', translationResponse);

//     // Handle different response types
//     const translationText = Array.isArray(translationResponse) 
//       ? translationResponse[0] // Assuming translationResponse is an array of strings
//       : translationResponse;

//     if (!translationText) {
//       return NextResponse.json({ message: 'Translation failed' }, { status: 500 });
//     }

//     return NextResponse.json({
//       translation_text: translationText,
//     });
//   } catch (error) {
//     console.error('Error during translation:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }





// src/app/api/generate-text/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { HfInference } from '@huggingface/inference';

// const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_KEY as string;
// const inference = new HfInference(HF_ACCESS_TOKEN);

// interface TextGenerationRequestBody {
//   prompt: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { prompt }: TextGenerationRequestBody = await req.json();

//     const model = 'microsoft/DialoGPT-large'; // Use a valid model ID

//     const textGenerationResponse = await inference.textGeneration({
//       model: model,
//       inputs: prompt,
//     });

//     // Log the response structure for debugging
//     console.log('Text Generation Response:', textGenerationResponse);

//     const generatedText = Array.isArray(textGenerationResponse) 
//       ? textGenerationResponse[0] // Assuming textGenerationResponse is an array of strings
//       : textGenerationResponse;

//     if (!generatedText) {
//       return NextResponse.json({ message: 'Text generation failed' }, { status: 500 });
//     }

//     return NextResponse.json({
//       generated_text: generatedText,
//     });
//   } catch (error) {
//     console.error('Error during text generation:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_KEY as string;
const hf = new HfInference(HF_ACCESS_TOKEN);

interface ConversationalRequestBody {
  past_user_inputs: string[];
  generated_responses: string[];
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { past_user_inputs, generated_responses, text }: ConversationalRequestBody = await req.json();

    const model = 'microsoft/DialoGPT-large'; // The model you want to use

    const conversationResponse = await hf.textGeneration({
      model: model,
      inputs: {
        past_user_inputs: past_user_inputs,
        generated_responses: generated_responses,
        text: text,
      },
    });

    // Log the response structure for debugging
    console.log('Conversation Response:', conversationResponse);

    if (!conversationResponse) {
      return NextResponse.json({ message: 'Conversation generation failed' }, { status: 500 });
    }

    return NextResponse.json({
      generated_text: conversationResponse.generated_text,
    });
  } catch (error) {
    console.error('Error during conversation generation:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
