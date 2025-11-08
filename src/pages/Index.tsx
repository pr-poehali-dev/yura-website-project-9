import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  image_url: string;
  likes_count: number;
  views_count: number;
  created_at: string;
}

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://functions.poehali.dev/1690ff69-adbb-4337-bc08-7bb2db3857fd');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/1690ff69-adbb-4337-bc08-7bb2db3857fd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Оценка добавлена!",
          description: "Спасибо за вашу реакцию",
        });
        
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, likes_count: result.likes_count || article.likes_count + 1 }
            : article
        ));
      } else {
        toast({
          title: "Уже оценено",
          description: "Вы уже оценили эту статью",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error liking article:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить оценку",
        variant: "destructive"
      });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/6f34c3ae-0dba-409f-816d-7d79afcf77ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Подписка оформлена!",
          description: "Вы будете получать новые статьи на почту",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось оформить подписку",
        variant: "destructive"
      });
    }
  };

  const categories = ['Все', 'Технологии', 'Дизайн', 'Продуктивность', 'Наука'];
  const filteredArticles = selectedCategory === 'Все' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const popularArticles = [...articles].sort((a, b) => b.likes_count - a.likes_count).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(155,135,245,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(214,188,250,0.08),transparent_50%)]" />
      
      <div className="relative">
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/30">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              TechBlog
            </h1>
            <nav className="flex gap-6 items-center">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
              <a href="#articles" className="text-sm font-medium hover:text-primary transition-colors">Статьи</a>
              <a href="#subscribe" className="text-sm font-medium hover:text-primary transition-colors">Подписка</a>
            </nav>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              🚀 Новости технологий
            </Badge>
            <h2 className="text-6xl font-black tracking-tight leading-tight">
              Исследуй мир{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                инноваций
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Погружайся в мир технологий, дизайна и науки с экспертными статьями от лучших авторов
            </p>
            <Button size="lg" className="mt-6 text-lg px-8 py-6 hover:scale-105 transition-transform">
              Читать статьи
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">🔥 Популярное</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
            {popularArticles.map((article, index) => (
              <Card 
                key={article.id}
                className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 right-4">{article.category}</Badge>
                </div>
                
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={16} />
                        {article.views_count}
                      </span>
                      <button 
                        onClick={() => handleLike(article.id)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Icon name="Heart" size={16} />
                        {article.likes_count}
                      </button>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      Читать
                      <Icon name="ArrowRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="articles" className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">📚 Все статьи</h3>
          </div>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer px-6 py-2 text-sm hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {filteredArticles.map((article, index) => (
              <Card 
                key={article.id}
                className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 right-4">{article.category}</Badge>
                </div>
                
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Автор: {article.author}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={16} />
                        {article.views_count}
                      </span>
                      <button 
                        onClick={() => handleLike(article.id)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Icon name="Heart" size={16} />
                        {article.likes_count}
                      </button>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      Читать
                      <Icon name="ArrowRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="subscribe" className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-xl border-primary/20 animate-scale-in">
            <Icon name="Mail" size={48} className="mx-auto mb-6 text-primary" />
            <h3 className="text-4xl font-bold mb-4">Подпишись на рассылку</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Получай новые статьи прямо на почту. Никакого спама, только качественный контент.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background/50 border-border/50 focus:border-primary"
                required
              />
              <Button type="submit" size="lg" className="hover:scale-105 transition-transform">
                Подписаться
              </Button>
            </form>
          </Card>
        </section>

        <footer className="border-t border-border/50 backdrop-blur-xl bg-background/30 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TechBlog
                </h4>
                <p className="text-sm text-muted-foreground">
                  Платформа для современных технологий и инноваций
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-4">Навигация</h5>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-primary transition-colors">Главная</a>
                  <a href="#articles" className="block hover:text-primary transition-colors">Статьи</a>
                  <a href="#subscribe" className="block hover:text-primary transition-colors">Подписка</a>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-4">Категории</h5>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-primary transition-colors">Технологии</a>
                  <a href="#" className="block hover:text-primary transition-colors">Дизайн</a>
                  <a href="#" className="block hover:text-primary transition-colors">Наука</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
              © 2024 TechBlog. Сделано с ❤️
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;