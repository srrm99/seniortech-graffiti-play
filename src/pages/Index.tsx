import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D3E4FD] to-white font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1EAEDB]">
          Welcome to Senior Connect
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your companion for an active and connected life
        </p>
        <Button
          onClick={() => navigate("/language-selection")}
          className="bg-[#33C3F0] hover:bg-[#1EAEDB] text-white px-8 py-6 text-xl rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;