import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag,
  Search,
  Sparkles,
  ArrowRight,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/data/products';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  products?: Product[];
  timestamp: Date;
}

const AIShoppingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: "Welcome to our luxury shopping experience! I'm your premium AI assistant, here to curate the perfect selection for you. I can help you discover our finest pieces based on your style, preferences, and needs. What luxury piece are you seeking today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const findProducts = (query: string): Product[] => {
    const searchTerms = query.toLowerCase().split(' ');
    
    return products.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        ...product.colors,
        ...product.sizes
      ].join(' ').toLowerCase();

      return searchTerms.some(term => searchableText.includes(term));
    });
  };

  const generateResponse = (query: string): { content: string; products: Product[] } => {
    const foundProducts = findProducts(query);
    
    if (foundProducts.length === 0) {
      return {
        content: "I couldn't find any products matching your search. Try asking for specific categories like 'shirts', 'hoodies', 'hats', or 'ladies clothing'. You can also mention colors like 'black', 'white', or 'navy'.",
        products: []
      };
    }

    if (foundProducts.length === 1) {
      return {
        content: `Perfect! I found exactly what you're looking for. Here's the ${foundProducts[0].name} - it's a great choice!`,
        products: foundProducts
      };
    }

    if (foundProducts.length <= 3) {
      return {
        content: `I found ${foundProducts.length} products that match your request. These should be perfect for you!`,
        products: foundProducts
      };
    }

    return {
      content: `I found ${foundProducts.length} products matching your search. Here are the best matches for you:`,
      products: foundProducts.slice(0, 4)
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(inputValue);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      products: response.products,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Show me premium black pieces",
    "What luxury hoodies do you have?",
    "I need something elegant for winter",
    "Show me ladies luxury collection",
    "What's your most exclusive item?"
  ];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white">AI Shopping Assistant</h3>
                  <p className="text-xs text-gray-300">Find your perfect style</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 h-[400px] p-4 bg-white">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } rounded-2xl px-4 py-3 shadow-sm`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <div className="flex-shrink-0 mt-1">
                            <Crown className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {/* Product Recommendations */}
                          {message.products && message.products.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {message.products.map((product) => (
                                <Card key={product.id} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h4>
                                        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-sm text-gray-900">{formatPrice(product.price)}</span>
                                          <Link
                                            to={`/shop?product=${product.id}`}
                                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                                          >
                                            View <ArrowRight className="h-3 w-3" />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3 font-medium">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 rounded-full px-3"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about our products..."
                  className="flex-1 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 rounded-lg px-3 py-2 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600 h-9 w-9 p-0 rounded-lg transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIShoppingAssistant;
