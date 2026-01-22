'use client';

import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Verificar se usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };

    checkUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-800/50 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/50">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DreamWeaver AI
            </h1>
            <p className="text-slate-400 mt-2 text-center">
              Entre para começar sua jornada
            </p>
          </div>

          {/* Auth UI */}
          <div className="auth-container">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#6366f1',
                      brandAccent: '#818cf8',
                      brandButtonText: 'white',
                      defaultButtonBackground: '#1e293b',
                      defaultButtonBackgroundHover: '#334155',
                      defaultButtonBorder: '#475569',
                      defaultButtonText: '#e2e8f0',
                      dividerBackground: '#475569',
                      inputBackground: '#1e293b',
                      inputBorder: '#475569',
                      inputBorderHover: '#6366f1',
                      inputBorderFocus: '#818cf8',
                      inputText: '#e2e8f0',
                      inputLabelText: '#cbd5e1',
                      inputPlaceholder: '#64748b',
                      messageText: '#e2e8f0',
                      messageTextDanger: '#f87171',
                      anchorTextColor: '#818cf8',
                      anchorTextHoverColor: '#a5b4fc',
                    },
                    space: {
                      spaceSmall: '8px',
                      spaceMedium: '16px',
                      spaceLarge: '24px',
                    },
                    fontSizes: {
                      baseBodySize: '14px',
                      baseInputSize: '14px',
                      baseLabelSize: '14px',
                      baseButtonSize: '14px',
                    },
                    radii: {
                      borderRadiusButton: '12px',
                      buttonBorderRadius: '12px',
                      inputBorderRadius: '12px',
                    },
                  },
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button',
                  input: 'auth-input',
                  label: 'auth-label',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    email_input_placeholder: 'seu@email.com',
                    password_input_placeholder: 'Sua senha',
                    button_label: 'Entrar',
                    loading_button_label: 'Entrando...',
                    social_provider_text: 'Entrar com {{provider}}',
                    link_text: 'Já tem uma conta? Entre',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    email_input_placeholder: 'seu@email.com',
                    password_input_placeholder: 'Sua senha',
                    button_label: 'Criar conta',
                    loading_button_label: 'Criando conta...',
                    social_provider_text: 'Entrar com {{provider}}',
                    link_text: 'Não tem uma conta? Cadastre-se',
                    confirmation_text: 'Verifique seu email para confirmar',
                  },
                  forgotten_password: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    email_input_placeholder: 'seu@email.com',
                    button_label: 'Enviar instruções',
                    loading_button_label: 'Enviando...',
                    link_text: 'Esqueceu sua senha?',
                    confirmation_text: 'Verifique seu email para redefinir sua senha',
                  },
                  update_password: {
                    password_label: 'Nova senha',
                    password_input_placeholder: 'Sua nova senha',
                    button_label: 'Atualizar senha',
                    loading_button_label: 'Atualizando...',
                    confirmation_text: 'Sua senha foi atualizada',
                  },
                  verify_otp: {
                    email_input_label: 'Email',
                    email_input_placeholder: 'seu@email.com',
                    phone_input_label: 'Telefone',
                    phone_input_placeholder: 'Seu telefone',
                    token_input_label: 'Código',
                    token_input_placeholder: 'Seu código OTP',
                    button_label: 'Verificar',
                    loading_button_label: 'Verificando...',
                  },
                },
              }}
              providers={[]}
              redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .auth-container {
          width: 100%;
        }
        
        .auth-container button {
          transition: all 0.2s ease;
        }
        
        .auth-container button:hover {
          transform: translateY(-1px);
        }
        
        .auth-container input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
}
