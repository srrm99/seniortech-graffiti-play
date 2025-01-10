import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Volume2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Companions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoId, setVideoId] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample devotional music video IDs (in a real app, these would come from YouTube API)
  const popularDevotionals = [
    { id: 'dqXHrWrF9YM', title: 'Om Jai Jagdish Hare' },
    { id: 'SqcY0GlETPk', title: 'Hanuman Chalisa' },
    { id: '3Y5PLJXwMCs', title: 'Gayatri Mantra' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just play one of the sample videos
    const randomVideo = popularDevotionals[Math.floor(Math.random() * popularDevotionals.length)];
    setVideoId(randomVideo.id);
    toast({
      title: "Playing Music",
      description: `Now playing: ${randomVideo.title}`,
    });
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
          <h1 className="text-4xl font-rozha text-accent">Devotional Music</h1>
          <div className="w-10" />
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for devotional songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2" />
              Search
            </Button>
          </form>

          {videoId ? (
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDevotionals.map((video) => (
                <Button
                  key={video.id}
                  variant="outline"
                  className="p-6 h-auto flex gap-3 items-center"
                  onClick={() => {
                    setVideoId(video.id);
                    toast({
                      title: "Playing Music",
                      description: `Now playing: ${video.title}`,
                    });
                  }}
                >
                  <Volume2 className="h-8 w-8" />
                  <span className="text-lg">{video.title}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companions;