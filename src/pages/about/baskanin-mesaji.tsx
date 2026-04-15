import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function BaskaninMesajiPage() {
  return (
    <>
      <Head>
        <SEO title="Başkanın Mesajı - Eyüboğlu Mezunlar Derneği" />
      </Head>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Quote className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Başkanın Mesajı</h1>
              <p className="text-lg text-muted-foreground">Değerli Eyüboğlu mezunu,</p>
            </div>

            {/* Content */}
            <Card className="border-2">
              <CardContent className="pt-8 pb-8 px-8 md:px-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed mb-6">
                    "Eyüboğlu Eğitim Kurumları Mezunları Derneği'nin yönetim kurulu olarak içimizdeki heyecan ile hepinizi selamlıyoruz. Yaklaşık üç bin kişiyi aşan, gerek ulusal gerek ise uluslararası platformlarda aktif görev alan mezun ağımız ile derneğimizin kuruluş misyonunu en iyi şekilde sürdürmeyi hedefliyoruz.
                  </p>

                  <p className="text-lg leading-relaxed mb-6">
                    Eyüboğlu Eğitim Kurumları Mezunlar Derneği olarak bizler, Eyüboğlu genci olmanın vermiş olduğu donanım ve vizyon ile, Atatürk ilke ve inkılaplarından ödün vermeksizin sahip olduğumuz yenilikçi, uluslar ve kültürler arası bilinç ile yüksek etik ve akademik standartlara sahip bireyler olarak mezun ruhunu en iyi şekilde yaşatıp sahip olduğumuz aidiyet duygusunu tamamen bağımsız bu platformda yaşatmak için elimizden geleni yapıyor olacağız.
                  </p>

                  <p className="text-lg leading-relaxed mb-8">
                    Hepimizin birer üyesi olduğu mezunlar ailesi olarak derneğimizin kurumsal kimliğini en iyi şekilde temsil etmek ve sizlerle her daim etkileşimde kalmak adına birçok yeni proje, etkinlik ve oluşumun öncüsü olacağımızın sözünü veriyoruz.
                  </p>

                  <p className="text-lg leading-relaxed mb-8">
                    Sizleri de bu yolculuğumuzda aramızda görmek, gücümüze güç katacak ve hedeflediğimiz bu yolda ilerlememiz için en büyük motivasyonumuzu oluşturacaktır."
                  </p>

                  <p className="text-lg leading-relaxed mb-4">
                    Sağlıkla kalın.
                  </p>

                  {/* Signature */}
                  <div className="mt-8 pt-8 border-t">
                    <p className="text-xl font-semibold text-primary">
                      Orhun GÜNGÖRDÜ
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yönetim Kurulu Başkanı
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Eyüboğlu Eğitim Kurumları Mezunları Derneği
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote decoration */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground italic">
                "Mezun ruhunu en iyi şekilde yaşatmak için elimizden geleni yapıyoruz."
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}