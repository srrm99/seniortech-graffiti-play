import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Book, GamepadIcon, HeartHandshake, HelpCircle } from "lucide-react";

const menuItems = {
  english: [
    {
      icon: GamepadIcon,
      title: "Games",
      description: "Play engaging games designed for seniors",
      path: "/games"
    },
    {
      icon: HeartHandshake,
      title: "Talk to Someone",
      description: "Have a conversation with an AI companion",
      path: "/companions/english"
    },
    {
      icon: Book,
      title: "Daily Readings",
      description: "Enjoy daily readings and stories",
      path: "/daily-readings"
    },
    {
      icon: HelpCircle,
      title: "Help & Information",
      description: "Get help and learn how to use the app",
      path: "/info-assistant"
    }
  ],
  hindi: [
    {
      icon: GamepadIcon,
      title: "खेल",
      description: "वरिष्ठ नागरिकों के लिए डिज़ाइन किए गए खेल खेलें",
      path: "/games"
    },
    {
      icon: HeartHandshake,
      title: "किसी से बात करें",
      description: "एआई साथी से बातचीत करें",
      path: "/companions/hindi"
    },
    {
      icon: Book,
      title: "दैनिक पाठ",
      description: "दैनिक पाठ और कहानियों का आनंद लें",
      path: "/daily-readings"
    },
    {
      icon: HelpCircle,
      title: "सहायता और जानकारी",
      description: "ऐप का उपयोग करने में मदद और जानकारी प्राप्त करें",
      path: "/info-assistant"
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

const Home = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const currentMenuItems = menuItems[preferences.language];
  const messages = welcomeMessages[preferences.language];

  return (
    <div className="min-h-screen bg-pattern p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-rozha text-accent mb-2">
            {messages.greeting}, {preferences.userName}
          </h1>
          <p className="text-xl text-muted-foreground">
            {messages.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentMenuItems.map((item) => (
            <Card
              key={item.path}
              className="p-6 cursor-pointer hover:border-accent transition-colors"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-8 h-8 text-accent" />
                <div>
                  <h2 className="text-2xl font-rozha text-accent mb-2">{item.title}</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;