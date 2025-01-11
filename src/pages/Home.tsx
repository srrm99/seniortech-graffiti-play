import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Book, GamepadIcon, HeartHandshake, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = {
  english: [
    {
      Icon: GamepadIcon,
      title: "Games",
      description: "Play engaging games designed for seniors",
      path: "/games",
    },
    {
      Icon: HeartHandshake,
      title: "Talk to Someone",
      description: "Have a conversation with an AI companion",
      path: "/companions/english",
    },
    {
      Icon: Book,
      title: "Daily Readings",
      description: "Enjoy daily readings and stories",
      path: "/readings/english",
    },
    {
      Icon: MessagesSquare,
      title: "Ask Me Anything",
      description: "Get latest news, schemes info & more with AI assistance",
      path: "/info-assistant/english",
    }
  ],
  hindi: [
    {
      Icon: GamepadIcon,
      title: "खेल",
      description: "वरिष्ठ नागरिकों के लिए डिज़ाइन किए गए खेल खेलें",
      path: "/games",
    },
    {
      Icon: HeartHandshake,
      title: "किसी से बात करें",
      description: "एआई साथी से बातचीत करें",
      path: "/companions/hindi",
    },
    {
      Icon: Book,
      title: "दैनिक पाठ",
      description: "दैनिक पाठ और कहानियों का आनंद लें",
      path: "/readings/hindi",
    },
    {
      Icon: MessagesSquare,
      title: "कुछ भी पूछें",
      description: "एआई सहायता से समाचार, योजनाओं की जानकारी और बहुत कुछ प्राप्त करें",
      path: "/info-assistant/hindi",
    }
  ]
};

const welcomeMessages = {
  english: {
    greeting: "Welcome",
    subtitle: "What would you like to do today?"
  },
  hindi: {
    greeting: "स्वागत है",
    subtitle: "आज आप क्या करना चाहेंगे?"
  }
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
  const messages = welcomeMessages[preferences.language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/50 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-rozha text-accent mb-2">
            {messages.greeting}, {preferences.userName}
          </h1>
          <p className="text-xl text-muted-foreground">
            {messages.subtitle}
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {currentMenuItems.map((menuItem, index) => (
            <motion.div
              key={menuItem.path}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="feature-card"
                onClick={() => navigate(menuItem.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-full">
                    <menuItem.Icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-rozha mb-1 text-accent">{menuItem.title}</h2>
                    <p className="text-sm text-muted-foreground">{menuItem.description}</p>
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