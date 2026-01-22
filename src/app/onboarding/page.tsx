'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, ArrowRight, Check, Clock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hasSmartwatch: false,
    sleepGoal: 8,
    bedtime: '22:00',
    wakeTime: '06:00',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    const user: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      hasSmartwatch: formData.hasSmartwatch,
      sleepGoal: formData.sleepGoal,
      bedtime: formData.bedtime,
      wakeTime: formData.wakeTime,
      onboardingCompleted: true,
      createdAt: new Date(),
    };

    localStorage.setItem('dreamweaver_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  const isStepValid = () => {
    if (step === 1) return true;
    if (step === 2) return formData.name.trim() !== '' && formData.email.trim() !== '';
    if (step === 3) return true;
    return false;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 rounded-full transition-all ${
                  num === step
                    ? 'w-12 bg-gradient-to-r from-indigo-500 to-purple-500'
                    : num < step
                    ? 'w-8 bg-indigo-500/50'
                    : 'w-8 bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm">
            Passo {step} de 3
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-800/50"
          >
            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl shadow-indigo-500/50"
                >
                  <Moon className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Bem-vindo ao DreamWeaver AI
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Transforme seus sonhos em dados práticos para dormir melhor. 
                  Vamos configurar sua experiência personalizada em apenas 3 passos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Moon, label: 'Análise de Sonhos' },
                    { icon: Clock, label: 'Monitoramento' },
                    { icon: Smartphone, label: 'Coach de IA' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-slate-800/50 rounded-xl p-4"
                    >
                      <feature.icon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">{feature.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Profile Setup */}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Configure seu Perfil</h2>
                <p className="text-slate-400 mb-8">Conte-nos sobre você e seus hábitos de sono</p>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Você tem um relógio inteligente?</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, hasSmartwatch: true })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.hasSmartwatch
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <Smartphone className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white font-semibold">Sim</p>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, hasSmartwatch: false })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          !formData.hasSmartwatch
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <Moon className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white font-semibold">Não</p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedtime" className="text-white mb-2 block">Horário de Dormir</Label>
                      <Input
                        id="bedtime"
                        type="time"
                        value={formData.bedtime}
                        onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wakeTime" className="text-white mb-2 block">Horário de Acordar</Label>
                      <Input
                        id="wakeTime"
                        type="time"
                        value={formData.wakeTime}
                        onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Meta de Sono (horas por noite)</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="6"
                        max="10"
                        value={formData.sleepGoal}
                        onChange={(e) => setFormData({ ...formData, sleepGoal: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-500"
                      />
                      <span className="text-2xl font-bold text-white w-16 text-center">
                        {formData.sleepGoal}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ready */}
            {step === 3 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl shadow-green-500/50"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Pronto para Começar! 🎉
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Tudo configurado, {formData.name}! Agora você pode começar a registrar seus sonhos 
                  e receber análises personalizadas da nossa IA.
                </p>
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">O que vem a seguir:</h3>
                  <div className="space-y-3 text-left">
                    {[
                      'Registre seu primeiro sonho ao acordar',
                      'Responda o quiz inteligente para análise profunda',
                      'Receba desafios personalizados para melhorar seu sono',
                      'Acompanhe sua evolução com gráficos e insights',
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-slate-300">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-slate-700 hover:border-slate-600 text-white"
                >
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg py-6"
              >
                {step === 3 ? 'Começar Agora' : 'Continuar'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
