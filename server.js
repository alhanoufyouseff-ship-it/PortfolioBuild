const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const BASE_DIR = __dirname;
const DB_PATH = path.join(BASE_DIR, 'database.db');
const UPLOAD_DIR = path.join(BASE_DIR, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Database Connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Error connecting to SQLite database:', err);
  else console.log('Connected to SQLite database at', DB_PATH);
});

// Initialize Schema
function initDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        photo_path TEXT,
        bio TEXT,
        education TEXT,
        skills TEXT,
        email TEXT,
        phone TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        theme TEXT DEFAULT 'modern',
        color_scheme TEXT DEFAULT 'blue-purple',
        language TEXT DEFAULT 'ar',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Projects (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        tags TEXT,
        project_link TEXT,
        image_path TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Experiences (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        company TEXT,
        duration TEXT,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Certificates (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        issuer TEXT,
        year TEXT,
        image_path TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Volunteering (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        role TEXT NOT NULL,
        organization TEXT NOT NULL,
        duration TEXT,
        description TEXT,
        logo_path TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    seedExampleProfile();
  });
}

function seedExampleProfile() {
  db.get("SELECT id FROM Users WHERE slug = 'saud-alotaibi' OR id = 'example-saud'", (err, row) => {
    if (err || row) return;

    const userId = 'example-saud';
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO Users (
        id, name, slug, photo_path, bio, education, skills, email, phone, linkedin_url, github_url, theme, color_scheme, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      userId,
      'سعود العتيبي',
      'saud-alotaibi',
      '/static/assets/sample/avatar.svg',
      'مهندس برمجيات شغوف بالذكاء الاصطناعي وبناء الأنظمة السحابية المتكاملة وتطوير تطبيقات الويب التفاعلية الحديثة.',
      'بكالوريوس هندسة برمجيات - جامعة الملك فهد للبترول والمعادن (KFUPM)',
      'Python, React, TypeScript, Next.js, Node.js, Fastify, Docker, PyTorch, TailwindCSS, PostgreSQL, SQLite',
      'saud.alotaibi@example.com',
      '+966551234567',
      'https://linkedin.com/in/saud-alotaibi',
      'https://github.com/saud-alotaibi',
      'modern',
      'blue-purple',
      'ar'
    ]);
    stmt.finalize();

    // Projects
    const pStmt = db.prepare(`INSERT OR REPLACE INTO Projects (id, user_id, title, description, tags, project_link, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    pStmt.run(['proj-1', userId, 'منصة VisionAI للرؤية الحاسوبية', 'منصة سحابية متقدمة لمعالجة الصور والكشف عن الأنماط بالذكاء الاصطناعي في الوقت الفعلي بدقة 98.4%.', 'PyTorch, FastAPI, React, Docker', 'https://github.com/saud-alotaibi/vision-ai', '/static/assets/sample/project1.svg']);
    pStmt.run(['proj-2', userId, 'نظام DevHub لإدارة الفرق البرمجية', 'نظام متكامل لإدارة المشاريع ومزامنة مهام المطورين وتحليل مؤشرات الأداء والأكواد البرمجية.', 'Next.js, TypeScript, PostgreSQL, Tailwind', 'https://github.com/saud-alotaibi/devhub', '/static/assets/sample/project2.svg']);
    pStmt.run(['proj-3', userId, 'محرك البحث الدلالي SmartDoc', 'محرك استرجاع وفهرسة ذكي للمستندات التقنية باستخدام نماذج التضمين اللغوي الكبيرة (RAG).', 'Python, LangChain, SQLite, ChromaDB', 'https://github.com/saud-alotaibi/smartdoc', '/static/assets/sample/project3.svg']);
    pStmt.finalize();

    // Experiences
    const eStmt = db.prepare(`INSERT OR REPLACE INTO Experiences (id, user_id, title, company, duration, description) VALUES (?, ?, ?, ?, ?, ?)`);
    eStmt.run(['exp-1', userId, 'مهندس برمجيات متدرب', 'شركة تقنية رائدة - الرياض', 'يونيو 2025 - أغسطس 2025', 'تطوير واجهات برمجة التطبيقات (APIs) وتحسين أداء قواعد البيانات وبناء واجهات مستخدم تفاعلية بنظام التصميم المصغر.']);
    eStmt.run(['exp-2', userId, 'مساعد باحث في الذكاء الاصطناعي', 'مركز أبحاث الذكاء الاصطناعي (KFUPM)', 'سبتمبر 2024 - مايو 2025', 'تدريب نماذج التوليد العميق وتحسين خوارزميات الاستدلال لنماذج اللغة الطبيعية وتوثيق التجارب العلمية.']);
    eStmt.finalize();

    // Certificates
    const cStmt = db.prepare(`INSERT OR REPLACE INTO Certificates (id, user_id, title, issuer, year, image_path) VALUES (?, ?, ?, ?, ?, ?)`);
    cStmt.run(['cert-1', userId, 'شهادة مهندس الحوسبة السحابية المعتمد (AWS Certified Solutions Architect)', 'Amazon Web Services', '2025', '/static/assets/sample/cert1.svg']);
    cStmt.run(['cert-2', userId, 'التعلم العميق التخصصي (Deep Learning Specialization)', 'DeepLearning.AI', '2024', '/static/assets/sample/cert2.svg']);
    cStmt.finalize();

    // Volunteering
    const vStmt = db.prepare(`INSERT OR REPLACE INTO Volunteering (id, user_id, role, organization, duration, description, logo_path) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    vStmt.run(['vol-1', userId, 'رئيس نادي الحاسب الآلي والبرمجيات', 'جامعة الملك فهد للبترول والمعادن', '2024 - 2025', 'تنظيم أكثر من 12 هاكاثون وورشة عمل تقنية استهدفت أكثر من 1500 طالب وطالبة وإدارة فريق تنفيذي مكون من 30 عضواً.', '/static/assets/sample/club1.svg']);
    vStmt.run(['vol-2', userId, 'مرشد تقني في هاكاثون الابتكار الوطني', 'الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)', 'نوفمبر 2024', 'تقديم الإرشاد التقني لأكثر من 15 فريقاً طلابياً في بناء النماذج الأولية وحلول الذكاء الاصطناعي.', '/static/assets/sample/club2.svg']);
    vStmt.finalize();
  });
}

initDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & uploads
app.use('/static', express.static(path.join(BASE_DIR, 'static')));
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer Storage Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomBytes(16).toString('hex')}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

function generateSlug(name) {
  let slug = (name || '').trim().toLowerCase();
  slug = slug.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || `user-${crypto.randomBytes(4).toString('hex')}`;
}

// ----------------- ROUTES ----------------- //

// Main SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(BASE_DIR, 'templates', 'index.html'));
});

// Standalone Published Portfolio View
app.get('/p/:slugOrId', (req, res) => {
  const templatePath = path.join(BASE_DIR, 'templates', 'portfolio.html');
  fs.readFile(templatePath, 'utf8', (err, html) => {
    if (err) return res.status(500).send('Error loading template');
    const rendered = html.replace(/\{\{\s*slug_or_id\s*\}\}/g, req.params.slugOrId);
    res.send(rendered);
  });
});

// Upload API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'لم يتم العثور على ملف في الطلب' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// Publish API
app.post('/api/publish', (req, res) => {
  const data = req.body;
  if (!data || !data.name) {
    return res.status(400).json({ success: false, error: 'الاسم الكامل مطلوب' });
  }

  const userId = data.id || crypto.randomUUID();
  const name = data.name.trim();
  let baseSlug = generateSlug(name);
  let slug = baseSlug;

  db.get("SELECT id FROM Users WHERE slug = ? AND id != ?", [slug, userId], (err, row) => {
    if (row) {
      slug = `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;
    }

    db.run(`
      INSERT OR REPLACE INTO Users (
        id, name, slug, photo_path, bio, education, skills, email, phone, linkedin_url, github_url, theme, color_scheme, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      name,
      slug,
      data.photo_path || '',
      data.bio || '',
      data.education || '',
      data.skills || '',
      data.email || '',
      data.phone || '',
      data.linkedin_url || '',
      data.github_url || '',
      data.theme || 'modern',
      data.color_scheme || 'blue-purple',
      data.language || 'ar'
    ], (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      // Clear child tables
      db.run("DELETE FROM Projects WHERE user_id = ?", [userId]);
      db.run("DELETE FROM Experiences WHERE user_id = ?", [userId]);
      db.run("DELETE FROM Certificates WHERE user_id = ?", [userId]);
      db.run("DELETE FROM Volunteering WHERE user_id = ?", [userId]);

      // Insert Projects
      if (Array.isArray(data.projects)) {
        const pStmt = db.prepare("INSERT INTO Projects (id, user_id, title, description, tags, project_link, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
        data.projects.forEach(p => {
          if (p.title) {
            pStmt.run([p.id || crypto.randomUUID(), userId, p.title, p.description || '', p.tags || '', p.project_link || '', p.image_path || '']);
          }
        });
        pStmt.finalize();
      }

      // Insert Experiences
      if (Array.isArray(data.experiences)) {
        const eStmt = db.prepare("INSERT INTO Experiences (id, user_id, title, company, duration, description) VALUES (?, ?, ?, ?, ?, ?)");
        data.experiences.forEach(e => {
          if (e.title) {
            eStmt.run([e.id || crypto.randomUUID(), userId, e.title, e.company || '', e.duration || '', e.description || '']);
          }
        });
        eStmt.finalize();
      }

      // Insert Certificates
      if (Array.isArray(data.certificates)) {
        const cStmt = db.prepare("INSERT INTO Certificates (id, user_id, title, issuer, year, image_path) VALUES (?, ?, ?, ?, ?, ?)");
        data.certificates.forEach(c => {
          if (c.title) {
            cStmt.run([c.id || crypto.randomUUID(), userId, c.title, c.issuer || '', c.year || '', c.image_path || '']);
          }
        });
        cStmt.finalize();
      }

      // Insert Volunteering
      if (Array.isArray(data.volunteering)) {
        const vStmt = db.prepare("INSERT INTO Volunteering (id, user_id, role, organization, duration, description, logo_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
        data.volunteering.forEach(v => {
          if (v.role) {
            vStmt.run([v.id || crypto.randomUUID(), userId, v.role, v.organization || '', v.duration || '', v.description || '', v.logo_path || '']);
          }
        });
        vStmt.finalize();
      }

      res.json({
        success: true,
        id: userId,
        slug: slug,
        share_url: `/p/${slug}`,
        message: 'تم نشر البورتفوليو بنجاح'
      });
    });
  });
});

// Fetch Single Portfolio Data
app.get('/api/portfolio/:slugOrId', (req, res) => {
  const param = req.params.slugOrId;
  db.get("SELECT * FROM Users WHERE slug = ? OR id = ?", [param, param], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, error: 'لم يتم العثور على البورتفوليو' });
    }

    const userId = user.id;
    db.all("SELECT * FROM Projects WHERE user_id = ?", [userId], (err, projects) => {
      db.all("SELECT * FROM Experiences WHERE user_id = ?", [userId], (err, experiences) => {
        db.all("SELECT * FROM Certificates WHERE user_id = ?", [userId], (err, certificates) => {
          db.all("SELECT * FROM Volunteering WHERE user_id = ?", [userId], (err, volunteering) => {
            res.json({
              success: true,
              user: user,
              projects: projects || [],
              experiences: experiences || [],
              certificates: certificates || [],
              volunteering: volunteering || []
            });
          });
        });
      });
    });
  });
});

// Example Data API
app.get('/api/example', (req, res) => {
  const lang = req.query.lang || 'ar';
  if (lang === 'en') {
    return res.json({
      success: true,
      user: {
        id: 'example-saud',
        name: 'Saud Al-Otaibi',
        slug: 'saud-alotaibi',
        photo_path: '/static/assets/sample/avatar.svg',
        bio: 'Software Engineer passionate about Artificial Intelligence, scalable cloud infrastructure, and modern interactive web ecosystems.',
        education: 'B.S. in Software Engineering - King Fahd University of Petroleum & Minerals (KFUPM)',
        skills: 'Python, React, TypeScript, Next.js, Node.js, Fastify, Docker, PyTorch, TailwindCSS, PostgreSQL, SQLite',
        email: 'saud.alotaibi@example.com',
        phone: '+966551234567',
        linkedin_url: 'https://linkedin.com/in/saud-alotaibi',
        github_url: 'https://github.com/saud-alotaibi',
        theme: 'modern',
        color_scheme: 'blue-purple',
        language: 'en'
      },
      projects: [
        {
          id: 'proj-1',
          title: 'VisionAI Computer Vision Platform',
          description: 'Advanced cloud platform for real-time image processing and deep learning object detection with 98.4% accuracy.',
          tags: 'PyTorch, FastAPI, React, Docker',
          project_link: 'https://github.com/saud-alotaibi/vision-ai',
          image_path: '/static/assets/sample/project1.svg'
        },
        {
          id: 'proj-2',
          title: 'DevHub Engineering Collaboration Engine',
          description: 'Full-stack platform for synchronizing engineering sprints, code metrics, and intelligent team insights.',
          tags: 'Next.js, TypeScript, PostgreSQL, Tailwind',
          project_link: 'https://github.com/saud-alotaibi/devhub',
          image_path: '/static/assets/sample/project2.svg'
        },
        {
          id: 'proj-3',
          title: 'SmartDoc Semantic Search & RAG System',
          description: 'High-performance document indexing and neural search engine powered by Large Language Embeddings.',
          tags: 'Python, LangChain, SQLite, ChromaDB',
          project_link: 'https://github.com/saud-alotaibi/smartdoc',
          image_path: '/static/assets/sample/project3.svg'
        }
      ],
      experiences: [
        {
          id: 'exp-1',
          title: 'Software Engineering Intern',
          company: 'Leading Tech Solutions - Riyadh',
          duration: 'Jun 2025 - Aug 2025',
          description: 'Engineered high-throughput REST APIs, optimized relational database query plans, and built reactive micro-frontends.'
        },
        {
          id: 'exp-2',
          title: 'AI Undergraduate Researcher',
          company: 'AI Research Center (KFUPM)',
          duration: 'Sep 2024 - May 2025',
          description: 'Trained generative deep models, optimized model quantization, and authored benchmark documentation.'
        }
      ],
      certificates: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect - Associate',
          issuer: 'Amazon Web Services',
          year: '2025',
          image_path: '/static/assets/sample/cert1.svg'
        },
        {
          id: 'cert-2',
          title: 'Deep Learning Specialization',
          issuer: 'DeepLearning.AI',
          year: '2024',
          image_path: '/static/assets/sample/cert2.svg'
        }
      ],
      volunteering: [
        {
          id: 'vol-1',
          role: 'President of Computer Science & Software Club',
          organization: 'KFUPM Student Clubs',
          duration: '2024 - 2025',
          description: 'Organized 12+ hackathons and technical bootcamps for 1,500+ participants and led an executive student board of 30 members.',
          logo_path: '/static/assets/sample/club1.svg'
        },
        {
          id: 'vol-2',
          role: 'Technical Mentor & Judge',
          organization: 'SDAIA National Innovation Hackathon',
          duration: 'Nov 2024',
          description: 'Mentored 15+ student teams in rapid AI prototyping and full-stack software architecture.',
          logo_path: '/static/assets/sample/club2.svg'
        }
      ]
    });
  } else {
    // Return example from DB
    req.params.slugOrId = 'example-saud';
    app._router.handle({ ...req, url: '/api/portfolio/example-saud', method: 'GET' }, res);
  }
});

// Start Node Express Server
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`PortfolioBuild Node.js (Express) Server running on http://127.0.0.1:${PORT}`);
    console.log(`Accessible on local network at http://${HOST}:${PORT}`);
  });
}

module.exports = app;
