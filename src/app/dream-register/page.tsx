'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Brain, ArrowLeft, Save, Sparkles, Heart,
  Tag, Moon, Zap, Smile, Frown, Meh
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BottomNav from '@/components/custom/bottom-nav';

const emotionOptions = [
  { value: 'feliz', label: 'Feliz', icon: Smile, color: 'text-green-400' },
  { value: 'triste', label: 'Triste', icon: Frown, color: 'text-blue-400' },
  { value: 'ansioso', label: 'Ansioso', icon: Zap, color: 'text-yellow-400' },
  { value: 'calmo', label: 'Calmo', icon: Heart, color: 'text-purple-400' },
  { value: 'neutro', label: 'Neutro', icon: Meh, color: 'text-slate-400' },
];

const dreamTypes = [
  'Normal',
  'Lúcido',
  'Pesadelo',
  'Recorrente',
  'Vívido',
];

const commonTags = [
  'Família', 'Trabalho', 'Viagem', 'Natureza', 'Animais',
  'Voar', 'Água', 'Perseguição', 'Queda', 'Escola',
];

export default function DreamRegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dream_date: new Date().toISOString().split('T')[0],
    sleep_quality: 3,
    dream_type: 'Normal',
    lucid: false,
    emotions: [] as string[],
    tags: [] as string[],
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
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const toggleEmotion = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion],
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.description) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('dreams')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          dream_date: formData.dream_date,
          sleep_quality: formData.sleep_quality,
          dream_type: formData.dream_type,
          lucid: formData.lucid,
          emotions: formData.emotions.join(','),
          tags: formData.tags.join(','),
          ai_analysis: 'Análise em processamento...',
        });

      if (!error) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving dream:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <Brain className="w-16 h-16 text-indigo-400 animate-pulse mx-auto mb-4" />
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
                <Brain className="w-6 h-6 text-indigo-400" />
                Registrar Sonho
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Capture seus sonhos enquanto estão frescos na memória
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">Título do Sonho *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Voando sobre montanhas"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">Descrição Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva seu sonho em detalhes... Onde você estava? O que aconteceu? Como se sentiu?"
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Quanto mais detalhes, melhor será a análise da IA
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dream_date" className="text-slate-300">Data do Sonho</Label>
                  <Input
                    id="dream_date"
                    type="date"
                    value={formData.dream_date}
                    onChange={(e) => setFormData({ ...formData, dream_date: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="dream_type" className="text-slate-300">Tipo de Sonho</Label>
                  <select
                    id="dream_type"
                    value={formData.dream_type}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dream_type: e.target.value,
                      lucid: e.target.value === 'Lúcido',
                    })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                  >
                    {dreamTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">
                  Qualidade do Sono: {formData.sleep_quality}/5
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sleep_quality: value })}
                      className="transition-transform hover:scale-110"
                    >
                      <Heart
                        className={`w-8 h-8 ${
                          value <= formData.sleep_quality
                            ? 'text-pink-400 fill-pink-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Emotions */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Emoções</h2>
            <p className="text-sm text-slate-400 mb-4">
              Selecione as emoções que você sentiu durante o sonho
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {emotionOptions.map((emotion) => (
                <button
                  key={emotion.value}
                  type="button"
                  onClick={() => toggleEmotion(emotion.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.emotions.includes(emotion.value)
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <emotion.icon className={`w-8 h-8 mx-auto mb-2 ${emotion.color}`} />
                  <p className="text-sm text-white">{emotion.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Tags
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Adicione tags para categorizar seu sonho
            </p>
            
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </Card>

          {/* AI Analysis Preview */}
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Análise com IA</h3>
                <p className="text-sm text-slate-300">
                  Após salvar, nossa IA analisará seu sonho para identificar padrões, 
                  emoções e possíveis significados. Você receberá insights personalizados 
                  sobre seu estado emocional e qualidade do sono.
                </p>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving || !formData.title || !formData.description}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-6 text-lg"
            >
              {saving ? (
                <>
                  <Moon className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Sonho
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-slate-700 py-6"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
