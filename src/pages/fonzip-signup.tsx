import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FonzipSignupPage() {
  const { t } = useLanguage();

  return (
    <>
      <SEO 
        title={t("fonzip.membership.title")}
        description={t("fonzip.membership.description")}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("fonzip.membership.title")}</CardTitle>
                <CardDescription>
                  {t("fonzip.membership.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <iframe
                  src="https://fonzip.com/eymeder/form/uyelik-basvuru-formu"
                  className="w-full h-[800px] border-0 rounded-lg"
                  title="Üyelik Başvuru Formu"
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}