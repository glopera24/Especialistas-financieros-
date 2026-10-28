"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Landmark, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createClient();

// NOTA: esta pantalla es solo para el equipo interno (CRM en /admin).
// A propósito NO ofrece autorregistro público — las cuentas del
// equipo se crean manualmente desde el panel de Supabase
// (Authentication → Users → Invite user). Antes, esta página tenía
// un botón "Crear cuenta" abierto al público que, combinado con el
// middleware anterior (roto), habría permitido que cualquiera se
// registrara y accediera al CRM con datos de clientes.
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070D12] text-white px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Especialistas</p>
            <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-none mt-0.5">
              Financieros — Panel interno
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-slate-300">Correo</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
