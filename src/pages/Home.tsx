import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Book, GamepadIcon, HeartHandshake, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const menuItems = {
  english: [
    {
      Icon: GamepadIcon,
      title: "Brain Games",
      description: "Fun and simple games to keep your mind active",
      path: "/games",
      gradient: "from-orange-400 to-pink-500",
      tooltip: "Exercise your brain with enjoyable puzzles"
    },
    {
      Icon: HeartHandshake,
      title: "Friendly Chat",
      description: "Have a warm conversation with a caring companion",
      path: "/companions/english",
      gradient: "from-purple-400 to-blue-500",
      tooltip: "Someone is always here to listen and talk with you"
    },
    {
      Icon: Book,
      title: "Daily Stories",
      description: "Short, inspiring readings for your day",
      path: "/readings/english",
      gradient: "from-green-400 to-teal-500",
      tooltip: "Enjoy uplifting stories and wisdom"
    },
    {
      Icon: Search,
      title: "Ask Anything",
      description: "Get information about news, government schemes, or any topic",
      path: "/info-assistant",
      gradient: "from-yellow-400 to-orange-500",
      tooltip: "Learn about latest news, helpful schemes, or ask any question"
    }
  ],
  hindi: [
    {
      Icon: GamepadIcon,
      title: "दिमागी खेल",
      description: "दिमाग को सक्रिय रखने के लिए मज़ेदार और सरल खेल",
      path: "/games",
      gradient: "from-orange-400 to-pink-500",
      tooltip: "मनोरंजक पहेलियों के साथ अपने दिमाग का व्यायाम करें"
    },
    {
      Icon: HeartHandshake,
      title: "दोस्ताना बातचीत",
      description: "एक देखभाल करने वाले साथी के साथ गर्मजोशी भरी बातचीत करें",
      path: "/companions/hindi",
      gradient: "from-purple-400 to-blue-500",
      tooltip: "कोई न कोई हमेशा आपकी बात सुनने के लिए मौजूद है"
    },
    {
      Icon: Book,
      title: "दैनिक कहानियां",
      description: "आपके दिन के लिए छोटी, प्रेरणादायक कहानियां",
      path: "/readings/hindi",
      gradient: "from-green-400 to-teal-500",
      tooltip: "प्रेरणादायक कहानियों और ज्ञान का आनंद लें"
    },
    {
      Icon: Search,
      title: "कुछ भी पूछें",
      description: "समाचार, सरकारी योजनाओं या किसी भी विषय के बारे में जानकारी प्राप्त करें",
      path: "/info-assistant",
      gradient: "from-yellow-400 to-orange-500",
      tooltip: "नवीनतम समाचार, सहायक योजनाओं के बारे में जानें या कोई भी प्रश्न पूछें"
    }
  ]
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Home = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const currentMenuItems = menuItems[preferences.language];

  useEffect(() => {
    // Show a welcome toast with helpful instruction
    const welcomeMessage = preferences.language === 'english' 
      ? {
          title: "Welcome to Senior Connect! 👋",
          description: "Tap any of the colorful cards below to get started. They're all designed to be easy to use."
        }
      : {
          title: "सीनियर कनेक्ट में आपका स्वागत है! 👋",
          description: "शुरू करने के लिए नीचे दिए गए किसी भी रंगीन कार्ड पर टैप करें। ये सभी उपयोग में आसान हैं।"
        };
    
    toast(welcomeMessage);
  }, [preferences.language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/50 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-rozha text-accent mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">
            {preferences.language === 'english' ? 'Welcome' : 'स्वागत है'}, {preferences.userName}
          </h1>
          <p className="text-xl text-muted-foreground">
            {preferences.language === 'english' 
              ? "What would you like to do today?" 
              : "आज आप क्या करना चाहेंगे?"}
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {currentMenuItems.map((menuItem, index) => (
            <motion.div
              key={menuItem.path}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => {
                toast({
                  title: menuItem.tooltip,
                  duration: 2000,
                });
              }}
            >
              <Card
                className={`p-8 cursor-pointer bg-gradient-to-br ${menuItem.gradient} hover:shadow-lg transition-all duration-300 border-none`}
                onClick={() => navigate(menuItem.path)}
              >
                <div className="flex items-center gap-6 text-white">
                  <div className="p-4 bg-white/20 rounded-full">
                    <menuItem.Icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-rozha mb-2">{menuItem.title}</h2>
                    <p className="text-lg opacity-90">{menuItem.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;