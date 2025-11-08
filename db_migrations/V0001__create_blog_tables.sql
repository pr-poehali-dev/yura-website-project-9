-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    author VARCHAR(200),
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create article_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS article_likes (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id),
    user_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_ip)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample articles
INSERT INTO articles (title, excerpt, content, category, author, image_url, likes_count, views_count) VALUES
('Будущее искусственного интеллекта', 'Как ИИ меняет нашу повседневную жизнь и что нас ждет в будущем', 'Полный текст статьи о развитии искусственного интеллекта...', 'Технологии', 'Алексей Иванов', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 127, 1543),
('10 советов по продуктивности', 'Эффективные методы повышения личной продуктивности', 'Детальные советы по продуктивности...', 'Продуктивность', 'Мария Петрова', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800', 89, 892),
('Минимализм в дизайне', 'Принципы создания чистых и элегантных интерфейсов', 'Гайд по минималистичному дизайну...', 'Дизайн', 'Дмитрий Сидоров', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 156, 2103),
('Квантовые компьютеры', 'Прорыв в вычислительных технологиях будущего', 'Разбор квантовых вычислений...', 'Наука', 'Елена Смирнова', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', 203, 3214),
('Психология цвета в UX', 'Как цвета влияют на поведение пользователей', 'Исследование влияния цвета...', 'Дизайн', 'Анна Козлова', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', 94, 1234);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_likes ON articles(likes_count DESC);
CREATE INDEX idx_article_likes_article_id ON article_likes(article_id);