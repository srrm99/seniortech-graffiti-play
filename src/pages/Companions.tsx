import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import OpenAI from 'openai';

type ContentCategory = 'devotional' | 'motivational' | 'stories' | 'wisdom';
type ContentItem = {
  title: string;
  content: string;
  category: ContentCategory;
};

const Companions = () => {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories: { id: ContentCategory; label: string }[] = [
    { id: 'devotional', label: 'Devotional Readings' },
    { id: 'motivational', label: 'Motivational Content' },
    { id: 'stories', label: 'Inspiring Stories' },
    { id: 'wisdom', label: 'Daily Wisdom' },
  ];

  const fetchContent = async (category: ContentCategory) => {
    setIsLoading(true);
    const apiKey = localStorage.getItem('openai-api-key');
    
    if (!apiKey) {
      const key = prompt('Please enter your OpenAI API key:');
      if (key) {
        localStorage.setItem('openai-api-key', key);
      } else {
        toast({
          title: "API Key Required",
          description: "Please provide an OpenAI API key to continue",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const openai = new OpenAI({
        apiKey: apiKey || '',
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `Generate 4 short ${category} content pieces. Each should have a title and content. Keep content under 200 words.`
        }],
      });

      const generatedContent = response.choices[0].message.content;
      const parsedContent = generatedContent?.split('\n\n')
        .filter(item => item.trim())
        .map(item => {
          const [title, ...contentArr] = item.split('\n');
          return {
            title: title.replace(/^\d+\.\s*/, ''),
            content: contentArr.join('\n'),
            category
          };
        }) || [];

      setContent(parsedContent);
      setSelectedCategory(category);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content. Please try again.",
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
            Back
          </button>
          <h1 className="text-4xl font-rozha text-accent">Daily Readings</h1>
          <div className="w-10" />
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => fetchContent(category.id)}
                variant="outline"
                className="p-6 h-auto text-lg font-poppins"
                disabled={isLoading}
              >
                {category.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {content.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2 border-accent">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                        <p className="text-muted-foreground">{item.content}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <Button 
              onClick={() => setSelectedCategory(null)} 
              className="mt-4 w-full"
              variant="outline"
            >
              Choose Different Category
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companions;