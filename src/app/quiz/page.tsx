'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { EMOTIONS } from '@/lib/constants';
import type { Emotion } from '@/lib/types';

interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'scale' | 'multi-select' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  category: 'emotion' | 'sleep-quality' | 'dream-details' | 'lifestyle';
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quais emoções você sentiu durante o sonho?',
    type: 'multi-select',
    options: Object.keys(EMOTIONS),
    category: 'emotion',
  },
  {
    id: 2,
    question: 'Como você avalia a qualidade do seu sono na última noite?',
    type: 'scale',
    min: 1,
    max: 10,
    category: 'sleep-quality',
  },
  {
    id: 3,
    question: 'Você acordou durante a noite?',
    type: 'multiple-choice',
    options: ['Não acordei', '1-2 vezes', '3-4 vezes', 'Mais de 4 vezes'],
    category: 'sleep-quality',
  },
  {
    id: 4,
    question: 'Havia pessoas conhecidas no seu sonho?',
    type: 'multiple-choice',
    options: ['Sim, muitas', 'Sim, algumas', 'Apenas uma', 'Não havia pessoas', 'Não me lembro'],
    category: 'dream-details',
  },
  {
    id: 5,
    question: 'Que cores predominaram no seu sonho?',
    type: 'multi-select',
    options: ['Azul', 'Verde', 'Vermelho', 'Amarelo', 'Roxo', 'Preto/Branco', 'Não me lembro'],
    category: 'dream-details',
  },
  {
    id: 6,
    question: 'Como você se sentiu ao acordar?',
    type: 'multiple-choice',
    options: ['Descansado e energizado', 'Bem, mas ainda com sono', 'Cansado', 'Muito cansado', 'Confuso ou desorientado'],
    category: 'sleep-quality',
  },
  {
    id: 7,
    question: 'Quanto tempo você usou telas (celular, TV, computador) antes de dormir?',
    type: 'multiple-choice',
    options: ['Não usei', 'Menos de 30 min', '30 min - 1 hora', '1-2 horas', 'Mais de 2 horas'],
    category: 'lifestyle',
  },
  {
    id: 8,
    question: 'Qual foi o nível de estresse/ansiedade ontem?',
    type: 'scale',
    min: 1,
    max: 10,
    category: 'lifestyle',
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check authentication
    const userData = localStorage.getItem('dreamweaver_user');
    if (!userData) {
      router.push('/onboarding');
    }
  }, [router]);

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Finish quiz and analyze
      analyzeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const analyzeQuiz = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const getEmotionLabel = (emotion: string) => {
    return EMOTIONS[emotion as Emotion]?.label || emotion;
  };

  const getEmotionIcon = (emotion: string) => {
    return EMOTIONS[emotion as Emotion]?.icon || '✨';
  };

  if (!mounted) return null;

  const question = quizQuestions[currentQuestion];
  const currentAnswer = answers[question.id];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Analisando suas respostas...</h2>
          <p className="text-slate-400 text-lg">A IA está processando seus dados para gerar insights personalizados</p>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Análise Completa! 🎉</h2>
                <p className="text-slate-400">Aqui estão seus insights personalizados</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">📊 Diagnóstico do Sono</h3>
                  <p className="text-slate-300 mb-4">
                    Sua qualidade de sono está em <span className="text-indigo-400 font-bold">nível moderado</span>. 
                    Detectamos que o uso de telas antes de dormir pode estar afetando seu descanso.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-white font-semibold">65%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">💭 Estado Emocional</h3>
                  <p className="text-slate-300 mb-4">
                    Suas emoções predominantes indicam um período de <span className="text-pink-400 font-bold">reflexão e ansiedade leve</span>. 
                    Recomendamos práticas de relaxamento antes de dormir.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(EMOTIONS).slice(0, 4).map((emotion) => (
                      <span key={emotion} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                        {getEmotionIcon(emotion)} {getEmotionLabel(emotion)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">🎯 Recomendações Personalizadas</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Evite telas 1 hora antes de dormir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Pratique 5 minutos de meditação guiada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Mantenha horários regulares de sono</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Experimente exercícios de respiração profunda</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Voltar ao Dashboard
                </Button>
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                  variant="outline"
                  className="border-slate-700 hover:border-indigo-500"
                >
                  Refazer Quiz
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Quiz Inteligente</h1>
              <p className="text-slate-400 text-sm">Análise profunda do seu sono e emoções</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>

              {/* Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        currentAnswer === option
                          ? 'border-pink-500 bg-pink-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-white">{option}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Multi Select */}
              {question.type === 'multi-select' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {question.options?.map((option, index) => {
                    const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                          if (isSelected) {
                            handleAnswer(current.filter((item: string) => item !== option));
                          } else {
                            handleAnswer([...current, option]);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-center">
                          {question.category === 'emotion' && (
                            <div className="text-3xl mb-2">{getEmotionIcon(option)}</div>
                          )}
                          <span className="text-white text-sm">
                            {question.category === 'emotion' ? getEmotionLabel(option) : option}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Scale */}
              {question.type === 'scale' && (
                <div className="space-y-6">
                  <div className="flex justify-between text-slate-400 text-sm mb-2">
                    <span>{question.min}</span>
                    <span>{question.max}</span>
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={currentAnswer || question.min}
                    onChange={(e) => handleAnswer(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 [&::-webkit-slider-thumb]:to-rose-500"
                  />
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">{currentAnswer || question.min}</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="border-slate-700 hover:border-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
