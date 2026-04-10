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
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"membership" | "details">("membership");

  // Step 1: Membership validation
  const [membershipNumber, setMembershipNumber] = useState("");
  const [email, setEmail] = useState("");

  // Step 2: Account details
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleMembershipValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate membership number exists and unused
      const response = await fetch(`/api/validate-membership?number=${membershipNumber}&email=${email}`);
      const data = await response.json();

      if (data.valid) {
        setFullName(data.fullName || "");
        setStep("details");
      } else {
        setError(data.message || "Geçersiz üyelik numarası veya e-posta");
      }
    } catch (err: any) {
      setError("Doğrulama sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

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

            {step === "membership" ? (
              <form onSubmit={handleMembershipValidation} className="space-y-4">
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
                  <p className="text-xs text-muted-foreground">
                    Üyelik numaranızı bilmiyorsanız,{" "}
                    <a 
                      href="https://fonzip.com/eymeder/form/uyelik-basvuru-formu" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      başvuru formunu
                    </a>{" "}
                    doldurun
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Doğrula ve Devam Et
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-md mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm">Üyelik numaranız doğrulandı</p>
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

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("membership")}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hesap Oluştur
                  </Button>
                </div>
              </form>
            )}
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