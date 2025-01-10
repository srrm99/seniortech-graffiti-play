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
import { Input } from "@/components/ui/input";
import OpenAI from 'openai';

type ContentCategory = 'devotional' | 'motivational' | 'stories' | 'wisdom';
type ContentItem = {
  title: string;
  content: string;
  category: ContentCategory;
};

const Companions = () => {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('openai-api-key') || '');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories: { id: ContentCategory; label: string; description: string }[] = [
    { id: 'devotional', label: 'Devotional Readings', description: 'Spiritual and uplifting daily readings' },
    { id: 'motivational', label: 'Motivational Content', description: 'Inspiring messages to brighten your day' },
    { id: 'stories', label: 'Short Stories', description: 'Heartwarming tales from around the world' },
    { id: 'wisdom', label: 'Daily Wisdom', description: 'Practical life lessons and insights' },
  ];

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey);
      toast({
        title: "Success",
        description: "API Key saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  const fetchContent = async (category: ContentCategory) => {
    setIsLoading(true);
    const storedApiKey = localStorage.getItem('openai-api-key');
    
    if (!storedApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const openai = new OpenAI({
        apiKey: storedApiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `Generate 4 short ${category} content pieces for senior citizens. Each should be readable in 1-2 minutes. Each piece should have a title and content. Make the content engaging, uplifting, and easy to understand. Use larger font-friendly formatting.`
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
        description: "Failed to fetch content. Please check your API key and try again.",
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

        {!apiKey && (
          <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Enter Your OpenAI API Key</h2>
            <p className="text-muted-foreground">This is required to generate personalized content for you.</p>
            <div className="flex gap-4">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="flex-1"
              />
              <Button onClick={handleApiKeySubmit}>Save Key</Button>
            </div>
          </div>
        )}

        {apiKey && !selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => fetchContent(category.id)}
                variant="outline"
                className="p-6 h-auto text-lg font-poppins flex flex-col gap-2"
                disabled={isLoading}
              >
                <span className="text-xl">{category.label}</span>
                <span className="text-sm text-muted-foreground">{category.description}</span>
              </Button>
            ))}
          </div>
        ) : (
          apiKey && content.length > 0 && (
            <div className="w-full max-w-md mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {content.map((item, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-2 border-accent">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">{item.content}</p>
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
          )
        )}

        {isLoading && (
          <div className="text-center">
            <p className="text-lg">Loading your content...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companions;