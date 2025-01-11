import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

type ReadingType = {
  id: string;
  title: string;
  description: string;
  prompt: string;
};

const readingTypes: ReadingType[] = [
  {
    id: 'devotional',
    title: 'धार्मिक पाठ',
    description: 'दैनिक आध्यात्मिक पाठ और चिंतन',
    prompt: 'हिंदी में एक प्रेरणादायक धार्मिक पाठ लिखें जो आस्था, आशा और आध्यात्मिक विकास के बारे में हो। अंत में एक छोटा चिंतन प्रश्न शामिल करें।'
  },
  {
    id: 'motivational',
    title: 'प्रेरणादायक',
    description: 'प्रेरक कहानियां और विचार',
    prompt: 'हिंदी में एक प्रेरक पाठ लिखें जिसमें एक प्रेरणादायक वास्तविक जीवन की कहानी और दृढ़ता और विकास का एक शक्तिशाली संदेश हो।'
  },
  {
    id: 'story',
    title: 'कहानी',
    description: 'सार्थक लघु कथाएं',
    prompt: 'हिंदी में एक हृदयस्पर्शी छोटी कहानी लिखें जिसमें नैतिक मूल्य और जीवन के सबक हों जिनसे वरिष्ठ नागरिक संबंधित हो सकें।'
  },
  {
    id: 'wisdom',
    title: 'दैनिक ज्ञान',
    description: 'दैनिक जीवन के लिए व्यावहारिक ज्ञान',
    prompt: 'हिंदी में व्यावहारिक ज्ञान या जीवन की सलाह साझा करें, जो पारंपरिक ज्ञान और आधुनिक अंतर्दृष्टि से प्रेरित हो।'
  }
];

const HindiReadings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [readings, setReadings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const LOCAL_LLM_URL = "https://johnaic.pplus.ai/openai/chat/completions";
  const LOCAL_LLM_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZGRiNTgzLTEzZTAtNDQyZS1hZTA0LTQ5ZmJjZTFmODhiYSJ9.djeA_RnaSvMyR9qYnz_2GW08jRq9aC5LG5bOEWdvBL4";

  const generateReadings = async (readingType: ReadingType) => {
    setIsLoading(true);
    setSelectedType(readingType);

    try {
      const readingPromises = Array(5).fill(null).map(async () => {
        const response = await fetch(`${LOCAL_LLM_URL}?bypass_filter=false`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${LOCAL_LLM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8",
            messages: [
              {
                role: "system",
                content: readingType.prompt
              }
            ],
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      });

      const generatedReadings = await Promise.all(readingPromises);
      setReadings(generatedReadings);
    } catch (error: any) {
      console.error('Error generating readings:', error);
      toast({
        title: "त्रुटि",
        description: error?.message || "पाठ जनरेट करने में विफल। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-accent hover:text-accent/80"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            वापस
          </button>
          <h1 className="text-4xl font-rozha text-accent">दैनिक पाठ</h1>
          <div className="w-10" />
        </div>

        {!selectedType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:border-accent transition-colors"
                onClick={() => generateReadings(type)}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-rozha text-accent mb-2">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedType && readings.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-rozha text-accent">{selectedType.title}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedType(null);
                  setReadings([]);
                }}
              >
                दूसरा प्रकार चुनें
              </Button>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {readings.map((reading, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-6">
                      <CardContent className="prose prose-lg dark:prose-invert">
                        <ReactMarkdown>{reading}</ReactMarkdown>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {isLoading && (
          <div className="text-center p-12">
            <div className="animate-pulse text-xl font-rozha text-accent">
              पाठ जनरेट किए जा रहे हैं...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HindiReadings;