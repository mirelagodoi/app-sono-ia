'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Moon, Clock, Heart, TrendingUp, Calendar,
  ArrowLeft, Plus, Sun, CloudMoon, Sunrise
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BottomNav from '@/components/custom/bottom-nav';

interface SleepData {
  id: string;
  sleep_date: string;
  bedtime: string;
  wake_time: string;
  sleep_duration: number;
  sleep_quality: number;
  mood_before: string;
  mood_after: string;
  notes: string;
}

export default function SleepTrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sleepRecords, setSleepRecords] = useState<SleepData[]>([]);
  const [stats, setStats] = useState({
    avgDuration: 0,
    avgQuality: 0,
    totalNights: 0,
    bestStreak: 0,
  });

  const [formData, setFormData] = useState({
    sleep_date: new Date().toISOString().split('T')[0],
    bedtime: '22:00',
    wake_time: '06:00',
    sleep_quality: 3,
    mood_before: '',
    mood_after: '',
    notes: '',
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
      await loadSleepData(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadSleepData = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('sleep_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('sleep_date', { ascending: false })
        .limit(30);

      if (data) {
        setSleepRecords(data);

        // Calcular estatísticas
        const totalNights = data.length;
        const avgDuration = data.reduce((acc, r) => acc + (r.sleep_duration || 0), 0) / (totalNights || 1);
        const avgQuality = data.reduce((acc, r) => acc + (r.sleep_quality || 0), 0) / (totalNights || 1);

        setStats({
          avgDuration: Math.round(avgDuration * 10) / 10,
          avgQuality: Math.round(avgQuality * 10) / 10,
          totalNights,
          bestStreak: 0,
        });
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
    }
  };

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let duration = (wakeHour * 60 + wakeMin) - (bedHour * 60 + bedMin);
    if (duration < 0) duration += 24 * 60; // Passou da meia-noite
    
    return duration / 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const duration = calculateDuration(formData.bedtime, formData.wake_time);

      const { error } = await supabase
        .from('sleep_analysis')
        .insert({
          user_id: user.id,
          sleep_date: formData.sleep_date,
          bedtime: formData.bedtime,
          wake_time: formData.wake_time,
          sleep_duration: duration,
          sleep_quality: formData.sleep_quality,
          mood_before: formData.mood_before,
          mood_after: formData.mood_after,
          notes: formData.notes,
        });

      if (!error) {
        setShowForm(false);
        await loadSleepData(user.id);
        // Reset form
        setFormData({
          sleep_date: new Date().toISOString().split('T')[0],
          bedtime: '22:00',
          wake_time: '06:00',
          sleep_quality: 3,
          mood_before: '',
          mood_after: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <Moon className="w-16 h-16 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
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
                <h1 className="text-2xl font-bold text-white">Análise de Sono</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Monitore e melhore seu sono
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.avgDuration}h</p>
              <p className="text-xs text-slate-400">Média</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Heart className="w-5 h-5 text-pink-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.avgQuality}/5</p>
              <p className="text-xs text-slate-400">Qualidade</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <Calendar className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.totalNights}</p>
              <p className="text-xs text-slate-400">Noites</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.bestStreak}</p>
              <p className="text-xs text-slate-400">Sequência</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Registrar Sono</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleep_date" className="text-slate-300">Data</Label>
                    <Input
                      id="sleep_date"
                      type="date"
                      value={formData.sleep_date}
                      onChange={(e) => setFormData({ ...formData, sleep_date: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleep_quality" className="text-slate-300">
                      Qualidade do Sono: {formData.sleep_quality}/5
                    </Label>
                    <input
                      id="sleep_quality"
                      type="range"
                      min="1"
                      max="5"
                      value={formData.sleep_quality}
                      onChange={(e) => setFormData({ ...formData, sleep_quality: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedtime" className="text-slate-300">Hora de Dormir</Label>
                    <Input
                      id="bedtime"
                      type="time"
                      value={formData.bedtime}
                      onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wake_time" className="text-slate-300">Hora de Acordar</Label>
                    <Input
                      id="wake_time"
                      type="time"
                      value={formData.wake_time}
                      onChange={(e) => setFormData({ ...formData, wake_time: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mood_before" className="text-slate-300">Humor Antes</Label>
                    <Input
                      id="mood_before"
                      placeholder="Como estava se sentindo?"
                      value={formData.mood_before}
                      onChange={(e) => setFormData({ ...formData, mood_before: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood_after" className="text-slate-300">Humor Depois</Label>
                    <Input
                      id="mood_after"
                      placeholder="Como acordou?"
                      value={formData.mood_after}
                      onChange={(e) => setFormData({ ...formData, mood_after: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-slate-300">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Algo que afetou seu sono?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    Salvar Registro
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Sleep Chart */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Últimos 7 Dias</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {sleepRecords.slice(0, 7).reverse().map((record, index) => (
              <div key={record.id} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(record.sleep_duration / 12) * 200}px` }}
                    title={`${record.sleep_duration}h - Qualidade: ${record.sleep_quality}/5`}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(record.sleep_date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sleep Records */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Histórico</h2>
          {sleepRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">
                      {new Date(record.sleep_date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <CloudMoon className="w-4 h-4" />
                        {record.bedtime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sunrise className="w-4 h-4" />
                        {record.wake_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {record.sleep_duration}h
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-4 h-4 ${
                          i < record.sleep_quality
                            ? 'text-pink-400 fill-pink-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {record.notes && (
                  <p className="text-sm text-slate-400 mt-2 p-3 bg-slate-800/50 rounded-lg">
                    {record.notes}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {sleepRecords.length === 0 && (
          <div className="text-center py-12">
            <Moon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum registro de sono ainda</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              Fazer Primeiro Registro
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
