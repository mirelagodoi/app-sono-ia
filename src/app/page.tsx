'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Brain, Sparkles, TrendingUp, Heart, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has completed onboarding
    const user = localStorage.getItem('dreamweaver_user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.onboardingCompleted) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [-50, 50, -50],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-8 shadow-2xl shadow-indigo-500/50"
              >
                <Moon className="w-16 h-16 text-white" />
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DreamWeaver AI
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-slate-300 font-light max-w-3xl mx-auto">
                Use seus sonhos para dormir melhor
              </p>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                Transforme seus sonhos em dados práticos com análise de IA, diagnóstico emocional e coaching personalizado para noites perfeitas
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Button
                  size="lg"
                  onClick={() => router.push('/onboarding')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white text-lg px-8 py-6 rounded-full bg-slate-900/50 backdrop-blur-sm"
                >
                  Ver Demonstração
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Funcionalidades Poderosas
              </h2>
              <p className="text-xl text-slate-400">
                Tudo que você precisa para transformar suas noites
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'Análise de Sonhos com IA',
                  description: 'Registre seus sonhos por texto ou voz. Nossa IA identifica emoções, padrões e temas recorrentes.',
                  color: 'from-indigo-500 to-blue-500',
                },
                {
                  icon: Heart,
                  title: 'Diagnóstico Emocional',
                  description: 'Entenda suas emoções através dos sonhos. Detecte ansiedade, alegria, medo e muito mais.',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  icon: TrendingUp,
                  title: 'Monitoramento de Sono',
                  description: 'Acompanhe a qualidade do seu sono com ou sem relógio inteligente. Dados precisos sempre.',
                  color: 'from-purple-500 to-indigo-500',
                },
                {
                  icon: Sparkles,
                  title: 'Galeria de Sonhos',
                  description: 'Visualize seus sonhos como arte. A IA gera imagens únicas baseadas nas suas descrições.',
                  color: 'from-cyan-500 to-blue-500',
                },
                {
                  icon: Zap,
                  title: 'Desafios Personalizados',
                  description: 'Receba desafios diários adaptados ao seu perfil. Melhore seus hábitos de forma gradual.',
                  color: 'from-orange-500 to-red-500',
                },
                {
                  icon: Moon,
                  title: 'Coach de IA 24/7',
                  description: 'Seu treinador pessoal de sono. Diagnósticos automáticos e recomendações em tempo real.',
                  color: 'from-violet-500 to-purple-500',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl -z-10"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  />
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 hover:border-slate-700 transition-all h-full">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-12 border border-indigo-500/30 backdrop-blur-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para dormir melhor?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Junte-se a milhares de pessoas que já transformaram suas noites
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/onboarding')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg px-10 py-6 rounded-full shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
