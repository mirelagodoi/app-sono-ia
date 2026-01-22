'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Sparkles, Send, ArrowLeft, Brain, Moon,
  Heart, TrendingUp, Lightbulb, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import BottomNav from '@/components/custom/bottom-nav';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Insight {
  title: string;
  description: string;
  icon: any;
  color: string;
}

export default function AICoachPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      await loadInsights(session.user.id);
      
      // Mensagem de boas-vindas
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Olá! Sou seu coach de sono com IA. Posso te ajudar a entender seus sonhos, melhorar sua qualidade de sono e criar hábitos saudáveis. Como posso te ajudar hoje?',
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async (userId: string) => {
    try {
      // Carregar dados do usuário para gerar insights
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: sleepData } = await supabase
        .from('sleep_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('sleep_date', { ascending: false })
        .limit(7);

      // Gerar insights baseados nos dados
      const generatedInsights: Insight[] = [];

      if (dreams && dreams.length > 0) {
        const avgQuality = dreams.reduce((acc, d) => acc + (d.sleep_quality || 0), 0) / dreams.length;
        
        if (avgQuality < 3) {
          generatedInsights.push({
            title: 'Qualidade do Sono Baixa',
            description: 'Seus sonhos indicam qualidade de sono abaixo da média. Vamos trabalhar nisso juntos!',
            icon: Moon,
            color: 'from-red-500 to-orange-500',
          });
        } else if (avgQuality >= 4) {
          generatedInsights.push({
            title: 'Ótima Qualidade de Sono!',
            description: 'Você está dormindo muito bem! Continue assim.',
            icon: Heart,
            color: 'from-green-500 to-emerald-500',
          });
        }
      }

      if (sleepData && sleepData.length >= 3) {
        const avgDuration = sleepData.reduce((acc, s) => acc + (s.sleep_duration || 0), 0) / sleepData.length;
        
        if (avgDuration < 7) {
          generatedInsights.push({
            title: 'Durma Mais',
            description: `Você está dormindo em média ${avgDuration.toFixed(1)}h. Tente aumentar para 7-9h.`,
            icon: TrendingUp,
            color: 'from-yellow-500 to-orange-500',
          });
        }
      }

      generatedInsights.push({
        title: 'Dica do Dia',
        description: 'Evite cafeína 6 horas antes de dormir para melhorar a qualidade do sono.',
        icon: Lightbulb,
        color: 'from-cyan-500 to-blue-500',
      });

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    // Simular resposta da IA (em produção, chamar API real)
    setTimeout(() => {
      const responses = [
        'Entendo sua preocupação. Vamos analisar seus padrões de sono juntos.',
        'Ótima pergunta! Baseado nos seus dados, recomendo...',
        'Isso é muito comum. Aqui estão algumas dicas personalizadas para você:',
        'Excelente progresso! Continue assim e você verá resultados ainda melhores.',
        'Vejo que você tem interesse nisso. Deixe-me te dar algumas orientações...',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setSending(false);
    }, 1500);
  };

  const quickQuestions = [
    'Como melhorar meu sono?',
    'O que meus sonhos significam?',
    'Dicas para dormir mais rápido',
    'Como criar uma rotina de sono?',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                Coach de IA
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Seu assistente pessoal de sono 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Insights Personalizados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                        <insight.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{insight.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Questions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Perguntas Rápidas</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(question)}
                className="border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 text-xs h-auto py-3"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-slate-800 text-slate-200'
                } rounded-2xl px-4 py-3`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-400">Coach IA</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-sm text-slate-400">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Input */}
        <div className="sticky bottom-20 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Digite sua pergunta ou preocupação..."
              className="bg-slate-800 border-slate-700 text-white resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-auto"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
