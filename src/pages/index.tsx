import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { authService } from "@/services/authService";
import { gamificationService } from "@/services/gamificationService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Users, 
  Calendar, 
  Briefcase, 
  Trophy, 
  TrendingUp,
  Heart,
  MessageCircle,
  Send,
  PlusCircle
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      await Promise.all([
        loadStats(currentUser.id),
        loadPosts(),
      ]);
      setLoading(false);
    }
  };

  const loadStats = async (userId: string) => {
    const data = await gamificationService.getUserStats(userId);
    setStats(data);
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_user_id_fkey(id, full_name, avatar_url, profession),
        post_likes(id, user_id),
        post_comments(id, content, user_id, created_at, author:profiles!post_comments_user_id_fkey(full_name))
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setPosts(data);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setPosting(true);

    const { error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content: newPost,
        post_type: "update",
      });

    if (error) {
      toast({
        title: "Hata",
        description: "Gönderi oluşturulamadı",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarılı",
        description: "Gönderi paylaşıldı",
      });
      setNewPost("");
      await loadPosts();
    }

    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const hasLiked = post?.post_likes?.some((like: any) => like.user_id === user.id);

    if (hasLiked) {
      const likeToDelete = post.post_likes.find((like: any) => like.user_id === user.id);
      await supabase
        .from("post_likes")
        .delete()
        .eq("id", likeToDelete.id);
    } else {
      await supabase
        .from("post_likes")
        .insert({
          post_id: postId,
          user_id: user.id,
        });
    }

    await loadPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Ana Sayfa - Mezunlar Derneği"
        description="Mezunlar ağınıza hoş geldiniz"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-bold">
                Hoş Geldiniz, {user?.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Mezunlar ağınızda neler oluyor?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Toplam Üye
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12 bu ay</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    Yaklaşan Etkinlik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">30 gün içinde</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-500" />
                    Aktif İş İlanı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Bu hafta 5 yeni</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Toplam Puanınız
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_points || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Seviye {stats?.level || 1}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* News Feed */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Haber Akışı
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Create Post */}
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Ne düşünüyorsunuz?"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          rows={3}
                        />
                        <Button
                          onClick={handleCreatePost}
                          disabled={!newPost.trim() || posting}
                          size="sm"
                          className="gap-2"
                        >
                          {posting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Paylaş
                        </Button>
                      </div>
                    </div>

                    <div className="border-t" />

                    {/* Posts List */}
                    <div className="space-y-4">
                      {posts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Henüz gönderi yok. İlk gönderiyi siz paylaşın!
                        </p>
                      ) : (
                        posts.map((post) => (
                          <div key={post.id} className="space-y-3 pb-4 border-b last:border-0">
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={post.author?.avatar_url} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {post.author?.full_name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {post.author?.full_name || "Anonim"}
                                  </span>
                                  {post.author?.profession && (
                                    <span className="text-sm text-muted-foreground">
                                      · {post.author.profession}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(post.created_at).toLocaleString("tr-TR", {
                                    day: "numeric",
                                    month: "long",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`gap-2 ${
                                  post.post_likes?.some((like: any) => like.user_id === user.id)
                                    ? "text-red-500"
                                    : ""
                                }`}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className="h-4 w-4" />
                                {post.post_likes?.length || 0}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                {post.post_comments?.length || 0}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Hızlı Erişim</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                      <Link href="/events/create">
                        <PlusCircle className="h-4 w-4" />
                        Etkinlik Oluştur
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                      <Link href="/jobs/create">
                        <PlusCircle className="h-4 w-4" />
                        İş İlanı Ver
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                      <Link href="/directory">
                        <Users className="h-4 w-4" />
                        Üye Ara
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Badges */}
                {stats?.badges && stats.badges.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Rozetleriniz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {stats.badges.map((badge: any) => (
                          <Badge key={badge.id} variant="secondary" className="gap-1">
                            <Trophy className="h-3 w-3" />
                            {badge.title}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}