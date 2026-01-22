'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Target, Trophy, Zap, Moon, Brain, Clock, 
  Smartphone, CheckCircle2, XCircle, ArrowLeft,
  Flame, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/custom/bottom-nav';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  icon: string;
  userProgress?: {
    status: string;
    progress: number;
    started_at: string;
  };
}

const iconMap: { [key: string]: any } = {
  Moon,
  Brain,
  Clock,
  Smartphone,
  Target,
  Zap,
};

const difficultyColors = {
  easy: 'from-green-500 to-emerald-500',
  medium: 'from-yellow-500 to-orange-500',
  hard: 'from-red-500 to-pink-500',
};

export default function ChallengesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [stats, setStats] = useState({
    totalPoints: 0,
    completedChallenges: 0,
    activeChallenges: 0,
    streak: 0,
  });

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
      await loadChallenges(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadChallenges = async (userId: string) => {
    try {
      // Carregar todos os desafios
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('active', true);

      // Carregar progresso do usuário
      const { data: userChallengesData } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userId);

      // Combinar dados
      const challengesWithProgress = challengesData?.map(challenge => {
        const userProgress = userChallengesData?.find(
          uc => uc.challenge_id === challenge.id
        );
        return {
          ...challenge,
          userProgress: userProgress ? {
            status: userProgress.status,
            progress: userProgress.progress,
            started_at: userProgress.started_at,
          } : undefined,
        };
      }) || [];

      setChallenges(challengesWithProgress);

      // Calcular estatísticas
      const completed = userChallengesData?.filter(uc => uc.status === 'completed').length || 0;
      const active = userChallengesData?.filter(uc => uc.status === 'active').length || 0;
      const totalPoints = userChallengesData
        ?.filter(uc => uc.status === 'completed')
        .reduce((acc, uc) => {
          const challenge = challengesData?.find(c => c.id === uc.challenge_id);
          return acc + (challenge?.points || 0);
        }, 0) || 0;

      setStats({
        totalPoints,
        completedChallenges: completed,
        activeChallenges: active,
        streak: 0,
      });
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const startChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active',
          progress: 0,
        });

      if (!error) {
        await loadChallenges(user.id);
      }
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const updateProgress = async (challengeId: string, newProgress: number) => {
    if (!user) return;

    try {
      const status = newProgress >= 100 ? 'completed' : 'active';
      const { error } = await supabase
        .from('user_challenges')
        .update({ 
          progress: newProgress,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

      if (!error) {
        await loadChallenges(user.id);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'active') return challenge.userProgress?.status === 'active';
    if (filter === 'completed') return challenge.userProgress?.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <Target className="w-16 h-16 text-pink-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Carregando desafios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-xl border-b border-pink-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Desafios</h1>
              <p className="text-slate-400 text-sm mt-1">
                Complete desafios e ganhe pontos
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.totalPoints}</p>
              <p className="text-xs text-slate-400">Pontos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.completedChallenges}</p>
              <p className="text-xs text-slate-400">Completos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Zap className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.activeChallenges}</p>
              <p className="text-xs text-slate-400">Ativos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.streak}</p>
              <p className="text-xs text-slate-400">Sequência</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'border-slate-700'}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'border-slate-700'}
          >
            Ativos
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'border-slate-700'}
          >
            Completos
          </Button>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge, index) => {
            const Icon = iconMap[challenge.icon] || Target;
            const isActive = challenge.userProgress?.status === 'active';
            const isCompleted = challenge.userProgress?.status === 'completed';
            const progress = challenge.userProgress?.progress || 0;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-slate-900/50 border-slate-700/50 p-6 ${
                  isCompleted ? 'opacity-75' : ''
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
                    } flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
                          <p className="text-sm text-slate-400 mt-1">{challenge.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
                            {challenge.points} pts
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {challenge.difficulty === 'easy' ? 'Fácil' :
                             challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Progresso</span>
                            <span className="text-sm font-semibold text-white">{progress}%</span>
                          </div>
                          <div className="bg-slate-700/50 rounded-full h-2 mb-3">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateProgress(challenge.id, Math.min(progress + 20, 100))}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Atualizar Progresso
                            </Button>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="mt-4 flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-semibold">Desafio Completo!</span>
                        </div>
                      )}

                      {!isActive && !isCompleted && (
                        <div className="mt-4">
                          <Button
                            onClick={() => startChallenge(challenge.id)}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Iniciar Desafio
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhum desafio encontrado</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
