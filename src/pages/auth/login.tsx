import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { loginWithEmail, loginWithMembershipNumber } from "@/services/authService";
import { Mail, Key, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "membership">("membership");

  // Membership login
  const [membershipNumber, setMembershipNumber] = useState("");
  const [membershipEmail, setMembershipEmail] = useState("");

  // Email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleMembershipLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await loginWithMembershipNumber(membershipEmail, membershipNumber);
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Giriş başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await loginWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Giriş başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Giriş Yap - Mezunlar Derneği" description="Mezunlar ağına giriş yapın" />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-heading font-bold text-center">Hoş Geldiniz</CardTitle>
            <CardDescription className="text-center">Mezunlar ağına giriş yapın</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Login method toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={loginMethod === "membership" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setLoginMethod("membership")}
              >
                <Key className="mr-2 h-4 w-4" />
                Üyelik Numarası
              </Button>
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setLoginMethod("email")}
              >
                <Mail className="mr-2 h-4 w-4" />
                E-posta
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginMethod === "membership" ? (
              <form onSubmit={handleMembershipLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="membership-email">E-posta Adresi</Label>
                  <Input
                    id="membership-email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={membershipEmail}
                    onChange={(e) => setMembershipEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="membership-number">Üyelik Numarası (8 haneli)</Label>
                  <Input
                    id="membership-number"
                    type="text"
                    placeholder="12345678"
                    maxLength={8}
                    value={membershipNumber}
                    onChange={(e) => setMembershipNumber(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Giriş Yap
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Giriş Yap
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Hesabınız yok mu?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Kayıt Olun
              </Link>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Üyelik numaranız yok mu?{" "}
              <a 
                href="https://fonzip.com/eymeder/form/uyelik-basvuru-formu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                Başvuru Formu
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}