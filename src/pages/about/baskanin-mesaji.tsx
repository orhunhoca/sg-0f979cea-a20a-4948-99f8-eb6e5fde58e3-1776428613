import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";

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
            <div className="w-full" style={{ minHeight: "600px" }}>
              <iframe
                src="http://eymeder.com/baskanin-mesaji"
                className="w-full border-0 rounded-lg"
                style={{ height: "600px" }}
                title="Başkanın Mesajı"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}