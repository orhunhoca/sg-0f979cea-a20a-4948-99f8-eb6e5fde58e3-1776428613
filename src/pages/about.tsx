import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Head>
        <SEO title="Hakkımızda - Eyüboğlu Mezunlar Derneği" />
      </Head>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Hakkımızda</h1>
          
          <Tabs defaultValue="president" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="president" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Başkanın Mesajı
              </TabsTrigger>
              <TabsTrigger value="board" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Yönetim Kurulu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="president">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-6 w-6" />
                    Başkanın Mesajı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <iframe
                      src="http://eymeder.com/baskanin-mesaji"
                      className="w-full h-[600px] md:h-[800px] border-0"
                      title="Başkanın Mesajı"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="board">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Yönetim Kurulu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <iframe
                      src="http://eymeder.com/yonetim-kurulu"
                      className="w-full h-[600px] md:h-[800px] border-0"
                      title="Yönetim Kurulu"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}