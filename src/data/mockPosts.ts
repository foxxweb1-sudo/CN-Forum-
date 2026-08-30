import { ForumPost } from '../types';

export const FALLBACK_TECH_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    name: 'م. أحمد السعيد',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    message: 'مرحباً بالجميع في منتدى CybeNode التقني! 🚀\nيسعدنا مشاركة هذا الدليل المختصر حول كيفية حماية تطبيقات الويب من ثغرات الحقن (SQL Injection) باستخدام Prepared Statements والتأكد من إغلاق المنافذ غير المستخدمة على خوادم الإنتاج.',
    codeSnippet: {
      language: 'python',
      code: `import psycopg2
from psycopg2 import sql

# طريقة آمنة لتنفيذ الاستعلامات باستخدام المعاملات المجهزة (Prepared Statements)
def get_user_secure(user_id: int):
    conn = psycopg2.connect("dbname=cybenode user=admin sslmode=require")
    cursor = conn.cursor()
    
    # منع هجمات SQL Injection بنسبة 100%
    query = sql.SQL("SELECT id, username, email FROM users WHERE id = %s AND is_active = true")
    cursor.execute(query, (user_id,))
    
    return cursor.fetchone()`
    },
    tags: ['cybersecurity', 'python', 'sql_injection', 'appsec'],
    createdAt: new Date(Date.now() - 3600000 * 4),
    likes: 18,
    isPinned: true,
    replies: [
      {
        userType: 'admin',
        adminName: 'فريق دعم CybeNode',
        text: 'أهلاً بك يا باشمهندس أحمد، إضافة ممتازة جداً لمكتبة الحماية البرمجية.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        userType: 'user',
        userName: 'طارق العمري',
        text: 'شكراً جزيلاً! هل تنصح باستخدام ORM مثل SQLAlchemy بدلاً من الاستعلامات المباشرة؟',
        replyTo: 'م. أحمد السعيد',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'post-2',
    name: 'سارة خالد',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    message: 'سؤال لخبراء DevOps و Docker: ما هي أفضل ممارسة لتقليل حجم صور الـ Docker الخاصة بتطبيقات Node.js في بيئة Production؟ هل استخدام Multi-Stage Build و Alpine Linux كافٍ؟',
    codeSnippet: {
      language: 'bash',
      code: `# Multi-stage Build Example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]`
    },
    tags: ['docker', 'devops', 'nodejs', 'containers'],
    createdAt: new Date(Date.now() - 3600000 * 8),
    likes: 12,
    replies: [
      {
        userType: 'user',
        userName: 'عمر التميمي',
        text: 'نعم بالتأكيد! أيضاً تأكدي من إضافة .dockerignore لتجاهل node_modules وملفات الـ git.',
        replyTo: 'سارة خالد',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ]
  }
];
