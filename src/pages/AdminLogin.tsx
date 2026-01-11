import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error("Erro ao criar conta: " + error.message);
        setLoading(false);
        return;
      }
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      setIsSignUp(false);
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast.error("Erro ao fazer login: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Login realizado com sucesso!");
    
    // Wait a moment for auth state to update
    setTimeout(() => {
      navigate("/admin");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-elevated p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="font-display text-accent-foreground text-lg font-bold">T</span>
              </div>
            </Link>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Área Administrativa
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              {isSignUp ? "Crie sua conta para começar" : "Faça login para gerenciar o conteúdo"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-ui">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="font-ui"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-ui">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="font-ui pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                isSignUp ? "Criando conta..." : "Entrando..."
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-ui text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Criar conta"}
            </button>
          </div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="font-ui text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
