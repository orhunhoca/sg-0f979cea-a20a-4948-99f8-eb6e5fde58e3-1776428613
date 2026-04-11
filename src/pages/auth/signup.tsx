import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { signupWithMembershipNumber } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [membershipNumber, setMembershipNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signupWithMembershipNumber({
        email,
        password,
        membershipNumber,
        fullName,
        phone,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Başarılı!",
          description: "Hesabınız oluşturuldu, yönlendiriliyorsunuz...",
        });
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Kayıt Ol - Mezunlar Derneği" description="Mezunlar ağına katılın" />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-heading font-bold text-center">Kayıt Ol</CardTitle>
            <CardDescription className="text-center">
              Mezunlar ağına katılın ve bağlantılar kurun
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-posta Adresi</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-membership">Üyelik Numarası (8 haneli)</Label>
                <Input
                  id="signup-membership"
                  type="text"
                  placeholder="12345678"
                  maxLength={8}
                  value={membershipNumber}
                  onChange={(e) => setMembershipNumber(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullname">Ad Soyad</Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Ad Soyad"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+90 555 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Şifre</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="En az 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Hesap Oluştur
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-center text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Giriş Yapın
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}