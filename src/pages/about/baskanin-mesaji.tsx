import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BaskaninMesajiPage() {
  return (
    <>
      <Head>
        <SEO title="Başkanın Mesajı - Eyüboğlu Mezunlar Derneği" />
      </Head>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Başkanın Mesajı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full" style={{ minHeight: "600px" }}>
                  <iframe
                    src="http://eymeder.com/baskanin-mesaji"
                    className="w-full border-0 rounded-lg"
                    style={{ height: "600px" }}
                    title="Başkanın Mesajı"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}