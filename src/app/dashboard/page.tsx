'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Moon, Brain, TrendingUp, Award, Plus, 
  Calendar, Clock, Heart, Sparkles, Target,
  BarChart3, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/custom/bottom-nav';

interface DreamData {
  id: string;
  title: string;
  description: string;
  sleep_quality: number;
  dream_date: string;
  emotions: string;
}

interface SleepData {
  id: string;
  sleep_date: string;
  sleep_quality: number;
  sleep_duration: number;
}

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  progress?: number;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState<DreamData[]>([]);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [stats, setStats] = useState({
    totalDreams: 0,
    avgSleepQuality: 0,
    avgSleepDuration: 0,
    completedChallenges: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verificar se usuário completou onboarding
      const userData = localStorage.getItem('dreamweaver_user');
      
      if (!userData) {
        router.push('/onboarding');
        return;
      }

      const parsedUser = JSON.parse(userData);
      
      if (!parsedUser.onboardingCompleted) {
        router.push('/onboarding');
        return;
      }

      setUser(parsedUser);
      await loadDashboardData(parsedUser.id || 'local-user');
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Carregar dados do localStorage
      const storedDreams = localStorage.getItem('dreamweaver_dreams');
      const storedSleep = localStorage.getItem('dreamweaver_sleep');
      const storedChallenges = localStorage.getItem('dreamweaver_challenges');

      if (storedDreams) {
        const dreamsData = JSON.parse(storedDreams);
        setDreams(dreamsData.slice(0, 5));
      }

      if (storedSleep) {
        const sleepDataResult = JSON.parse(storedSleep);
        setSleepData(sleepDataResult.slice(0, 7));
      }

      if (storedChallenges) {
        const challengesData = JSON.parse(storedChallenges);
        setChallenges(challengesData.filter((c: any) => c.active).slice(0, 3));
      } else {
        // Desafios padrão se não houver nenhum
        const defaultChallenges = [
          {
            id: '1',
            title: 'Registre 3 sonhos esta semana',
            description: 'Mantenha o hábito de registrar seus sonhos regularmente',
            difficulty: 'easy',
            points: 50,
            progress: 0,
            active: true,
          },
          {
            id: '2',
            title: 'Durma 8 horas por 5 dias',
            description: 'Estabeleça uma rotina de sono saudável',
            difficulty: 'medium',
            points: 100,
            progress: 0,
            active: true,
          },
          {
            id: '3',
            title: 'Medite antes de dormir',
            description: 'Pratique meditação por 10 minutos antes de dormir',
            difficulty: 'medium',
            points: 75,
            progress: 0,
            active: true,
          },
        ];
        setChallenges(defaultChallenges);
        localStorage.setItem('dreamweaver_challenges', JSON.stringify(defaultChallenges));
      }

      // Calcular estatísticas
      const storedDreamsData = storedDreams ? JSON.parse(storedDreams) : [];
      const storedSleepData = storedSleep ? JSON.parse(storedSleep) : [];
      
      const totalDreams = storedDreamsData.length;
      const avgQuality = storedDreamsData.reduce((acc: number, d: any) => acc + (d.sleep_quality || 0), 0) / (totalDreams || 1);
      const avgDuration = storedSleepData.reduce((acc: number, s: any) => acc + (s.sleep_duration || 0), 0) / (storedSleepData.length || 1);

      setStats({
        totalDreams,
        avgSleepQuality: Math.round(avgQuality * 10) / 10,
        avgSleepDuration: Math.round(avgDuration * 10) / 10,
        completedChallenges: 0,
        totalPoints: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <Moon className="w-16 h-16 text-indigo-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border-b border-indigo-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">
                Bem-vindo de volta, {user?.name || 'Sonhador'}!
              </p>
            </div>
            <Button
              onClick={() => router.push('/dream-register')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Sonho
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalDreams}</p>
              <p className="text-sm text-slate-400">Sonhos Registrados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.avgSleepQuality || 0}/5</p>
              <p className="text-sm text-slate-400">Qualidade Média</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.avgSleepDuration || 0}h</p>
              <p className="text-sm text-slate-400">Duração Média</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
              <p className="text-sm text-slate-400">Pontos</p>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => router.push('/dream-register')}
            className="h-24 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Brain className="w-6 h-6 text-indigo-400" />
            <span className="text-sm text-slate-300">Registrar Sonho</span>
          </Button>

          <Button
            onClick={() => router.push('/sleep-tracker')}
            className="h-24 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Moon className="w-6 h-6 text-purple-400" />
            <span className="text-sm text-slate-300">Análise de Sono</span>
          </Button>

          <Button
            onClick={() => router.push('/challenges')}
            className="h-24 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Target className="w-6 h-6 text-pink-400" />
            <span className="text-sm text-slate-300">Desafios</span>
          </Button>

          <Button
            onClick={() => router.push('/ai-coach')}
            className="h-24 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-slate-300">Coach IA</span>
          </Button>
        </div>

        {/* Recent Dreams */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              Sonhos Recentes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dreams')}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Ver todos
            </Button>
          </div>

          {dreams.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Nenhum sonho registrado ainda</p>
              <Button
                onClick={() => router.push('/dream-register')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                Registrar Primeiro Sonho
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer"
                  onClick={() => router.push(`/dreams/${dream.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{dream.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{dream.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500">
                          {new Date(dream.dream_date).toLocaleDateString('pt-BR')}
                        </span>
                        {dream.sleep_quality && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Heart
                                key={i}
                                className={`w-3 h-3 ${
                                  i < dream.sleep_quality
                                    ? 'text-pink-400 fill-pink-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Challenges */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-400" />
              Desafios Ativos
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/challenges')}
              className="text-pink-400 hover:text-pink-300"
            >
              Ver todos
            </Button>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{challenge.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-400">
                    {challenge.points} pts
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{challenge.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${challenge.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{challenge.progress || 0}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Sleep Quality Chart Placeholder */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Qualidade do Sono (7 dias)
          </h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {sleepData.length === 0 ? (
              <div className="w-full text-center py-12">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Registre dados de sono para ver gráficos</p>
              </div>
            ) : (
              sleepData.map((data, index) => (
                <div key={data.id} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(data.sleep_quality / 5) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500">
                    {new Date(data.sleep_date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
