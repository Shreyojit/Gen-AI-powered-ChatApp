import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_KEY as string;
const inference = new HfInference(HF_ACCESS_TOKEN);

interface TextGenerationRequestBody {
  prompt: string;
  max_length?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, max_length }: TextGenerationRequestBody = await req.json();

    const model = 'gpt2'; // Update this if needed

    const generationResponse = await inference.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_length: max_length ?? 100,
        num_beams: 4,
        early_stopping: true,
      },
    });

    console.log('Text Generation Response:', generationResponse);

    if (!generationResponse || !generationResponse.generated_text) {
      return NextResponse.json({ message: 'Generation failed' }, { status: 500 });
    }

    return NextResponse.json({
      generated_text: generationResponse.generated_text,
    });
  } catch (error) {
    console.error('Error during text generation:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
