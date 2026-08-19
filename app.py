import os
import json
import sqlite3
import uuid
import re
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}
//test
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
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
    ''')

    # Projects Table
    cursor.execute('''
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
    ''')

    # Experiences Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Experiences (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        company TEXT,
        duration TEXT,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    ''')

    # Certificates Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Certificates (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        issuer TEXT,
        year TEXT,
        image_path TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    ''')

    # Volunteering Table
    cursor.execute('''
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
    ''')

    conn.commit()
    conn.close()

def generate_slug(name):
    # Convert Arabic/English name to clean URL slug
    slug = name.strip().lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug).strip('-')
    if not slug:
        slug = f"user-{uuid.uuid4().hex[:8]}"
    return slug

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Seed rich default example profile if not already present
def seed_example_profile():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM Users WHERE slug = 'saud-alotaibi' OR id = 'example-saud'")
    exists = cursor.fetchone()
    
    if not exists:
        user_id = 'example-saud'
        cursor.execute('''
        INSERT OR REPLACE INTO Users (
            id, name, slug, photo_path, bio, education, skills, email, phone, linkedin_url, github_url, theme, color_scheme, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
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
        ))

        # Projects
        projects = [
            ('proj-1', user_id, 'منصة VisionAI للرؤية الحاسوبية', 'منصة سحابية متقدمة لمعالجة الصور والكشف عن الأنماط بالذكاء الاصطناعي في الوقت الفعلي بدقة 98.4%.', 'PyTorch, FastAPI, React, Docker', 'https://github.com/saud-alotaibi/vision-ai', '/static/assets/sample/project1.svg'),
            ('proj-2', user_id, 'نظام DevHub لإدارة الفرق البرمجية', 'نظام متكامل لإدارة المشاريع ومزامنة مهام المطورين وتحليل مؤشرات الأداء والأكواد البرمجية.', 'Next.js, TypeScript, PostgreSQL, Tailwind', 'https://github.com/saud-alotaibi/devhub', '/static/assets/sample/project2.svg'),
            ('proj-3', user_id, 'محرك البحث الدلالي SmartDoc', 'محرك استرجاع وفهرسة ذكي للمستندات التقنية باستخدام نماذج التضمين اللغوي الكبيرة (RAG).', 'Python, LangChain, SQLite, ChromaDB', 'https://github.com/saud-alotaibi/smartdoc', '/static/assets/sample/project3.svg')
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO Projects (id, user_id, title, description, tags, project_link, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', projects)

        # Experiences
        experiences = [
            ('exp-1', user_id, 'مهندس برمجيات متدرب', 'شركة تقنية رائدة - الرياض', 'يونيو 2025 - أغسطس 2025', 'تطوير واجهات برمجة التطبيقات (APIs) وتحسين أداء قواعد البيانات وبناء واجهات مستخدم تفاعلية بنظام التصميم المصغر.'),
            ('exp-2', user_id, 'مساعد باحث في الذكاء الاصطناعي', 'مركز أبحاث الذكاء الاصطناعي (KFUPM)', 'سبتمبر 2024 - مايو 2025', 'تدريب نماذج التوليد العميق وتحسين خوارزميات الاستدلال لنماذج اللغة الطبيعية وتوثيق التجارب العلمية.')
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO Experiences (id, user_id, title, company, duration, description)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', experiences)

        # Certificates
        certs = [
            ('cert-1', user_id, 'شهادة مهندس الحوسبة السحابية المعتمد (AWS Certified Solutions Architect)', 'Amazon Web Services', '2025', '/static/assets/sample/cert1.svg'),
            ('cert-2', user_id, 'التعلم العميق التخصصي (Deep Learning Specialization)', 'DeepLearning.AI', '2024', '/static/assets/sample/cert2.svg')
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO Certificates (id, user_id, title, issuer, year, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', certs)

        # Volunteering
        volunteers = [
            ('vol-1', user_id, 'رئيس نادي الحاسب الآلي والبرمجيات', 'جامعة الملك فهد للبترول والمعادن', '2024 - 2025', 'تنظيم أكثر من 12 هاكاثون وورشة عمل تقنية استهدفت أكثر من 1500 طالب وطالبة وإدارة فريق تنفيذي مكون من 30 عضواً.', '/static/assets/sample/club1.svg'),
            ('vol-2', user_id, 'مرشد تقني في هاكاثون الابتكار الوطني', 'الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)', 'نوفمبر 2024', 'تقديم الإرشاد التقني لأكثر من 15 فريقاً طلابياً في بناء النماذج الأولية وحلول الذكاء الاصطناعي.', '/static/assets/sample/club2.svg')
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO Volunteering (id, user_id, role, organization, duration, description, logo_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', volunteers)

        conn.commit()
    conn.close()

# Initialize DB on startup
init_db()
seed_example_profile()

# ----------------- ROUTES ----------------- #

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'لم يتم العثور على ملف في الطلب'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'اسم الملف فارغ'}), 400

    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        file_url = f"/uploads/{unique_filename}"
        return jsonify({'success': True, 'url': file_url, 'filename': unique_filename})
    
    return jsonify({'success': False, 'error': 'نوع الملف غير مدعوم'}), 400

@app.route('/api/publish', methods=['POST'])
def publish_portfolio():
    try:
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'success': False, 'error': 'الاسم الكامل مطلوب'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        user_id = data.get('id') or str(uuid.uuid4())
        name = data.get('name', '').strip()
        
        # Base slug
        base_slug = generate_slug(name)
        slug = base_slug
        
        # Check slug uniqueness if new
        cursor.execute("SELECT id FROM Users WHERE slug = ? AND id != ?", (slug, user_id))
        if cursor.fetchone():
            slug = f"{base_slug}-{uuid.uuid4().hex[:4]}"

        # Insert or update User
        cursor.execute('''
        INSERT OR REPLACE INTO Users (
            id, name, slug, photo_path, bio, education, skills, email, phone, linkedin_url, github_url, theme, color_scheme, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            name,
            slug,
            data.get('photo_path', ''),
            data.get('bio', ''),
            data.get('education', ''),
            data.get('skills', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('linkedin_url', ''),
            data.get('github_url', ''),
            data.get('theme', 'modern'),
            data.get('color_scheme', 'blue-purple'),
            data.get('language', 'ar')
        ))

        # Clear old children for user
        cursor.execute("DELETE FROM Projects WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM Experiences WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM Certificates WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM Volunteering WHERE user_id = ?", (user_id,))

        # Projects
        for proj in data.get('projects', []):
            if proj.get('title'):
                proj_id = proj.get('id') or str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO Projects (id, user_id, title, description, tags, project_link, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    proj_id,
                    user_id,
                    proj.get('title', ''),
                    proj.get('description', ''),
                    proj.get('tags', ''),
                    proj.get('project_link', ''),
                    proj.get('image_path', '')
                ))

        # Experiences
        for exp in data.get('experiences', []):
            if exp.get('title'):
                exp_id = exp.get('id') or str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO Experiences (id, user_id, title, company, duration, description)
                VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    exp_id,
                    user_id,
                    exp.get('title', ''),
                    exp.get('company', ''),
                    exp.get('duration', ''),
                    exp.get('description', '')
                ))

        # Certificates
        for cert in data.get('certificates', []):
            if cert.get('title'):
                cert_id = cert.get('id') or str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO Certificates (id, user_id, title, issuer, year, image_path)
                VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    cert_id,
                    user_id,
                    cert.get('title', ''),
                    cert.get('issuer', ''),
                    cert.get('year', ''),
                    cert.get('image_path', '')
                ))

        # Volunteering (Placed at the end of portfolio)
        for vol in data.get('volunteering', []):
            if vol.get('role'):
                vol_id = vol.get('id') or str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO Volunteering (id, user_id, role, organization, duration, description, logo_path)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    vol_id,
                    user_id,
                    vol.get('role', ''),
                    vol.get('organization', ''),
                    vol.get('duration', ''),
                    vol.get('description', ''),
                    vol.get('logo_path', '')
                ))

        conn.commit()
        conn.close()

        share_url = f"/p/{slug}"
        return jsonify({
            'success': True,
            'id': user_id,
            'slug': slug,
            'share_url': share_url,
            'message': 'تم نشر البورتفوليو بنجاح'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/portfolio/<slug_or_id>')
def get_portfolio_data(slug_or_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT * FROM Users WHERE slug = ? OR id = ?
    ''', (slug_or_id, slug_or_id))
    user_row = cursor.fetchone()

    if not user_row:
        conn.close()
        return jsonify({'success': False, 'error': 'لم يتم العثور على البورتفوليو'}), 404

    user = dict(user_row)
    user_id = user['id']

    # Projects
    cursor.execute('SELECT * FROM Projects WHERE user_id = ?', (user_id,))
    projects = [dict(row) for row in cursor.fetchall()]

    # Experiences
    cursor.execute('SELECT * FROM Experiences WHERE user_id = ?', (user_id,))
    experiences = [dict(row) for row in cursor.fetchall()]

    # Certificates
    cursor.execute('SELECT * FROM Certificates WHERE user_id = ?', (user_id,))
    certificates = [dict(row) for row in cursor.fetchall()]

    # Volunteering
    cursor.execute('SELECT * FROM Volunteering WHERE user_id = ?', (user_id,))
    volunteering = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify({
        'success': True,
        'user': user,
        'projects': projects,
        'experiences': experiences,
        'certificates': certificates,
        'volunteering': volunteering
    })

@app.route('/api/example')
def get_example_data():
    lang = request.args.get('lang', 'ar')
    if lang == 'en':
        return jsonify({
            'success': True,
            'user': {
                'id': 'example-saud',
                'name': 'Saud Al-Otaibi',
                'slug': 'saud-alotaibi',
                'photo_path': '/static/assets/sample/avatar.svg',
                'bio': 'Software Engineer passionate about Artificial Intelligence, scalable cloud infrastructure, and modern interactive web ecosystems.',
                'education': 'B.S. in Software Engineering - King Fahd University of Petroleum & Minerals (KFUPM)',
                'skills': 'Python, React, TypeScript, Next.js, Node.js, Fastify, Docker, PyTorch, TailwindCSS, PostgreSQL, SQLite',
                'email': 'saud.alotaibi@example.com',
                'phone': '+966551234567',
                'linkedin_url': 'https://linkedin.com/in/saud-alotaibi',
                'github_url': 'https://github.com/saud-alotaibi',
                'theme': 'modern',
                'color_scheme': 'blue-purple',
                'language': 'en'
            },
            'projects': [
                {
                    'id': 'proj-1',
                    'title': 'VisionAI Computer Vision Platform',
                    'description': 'Advanced cloud platform for real-time image processing and deep learning object detection with 98.4% accuracy.',
                    'tags': 'PyTorch, FastAPI, React, Docker',
                    'project_link': 'https://github.com/saud-alotaibi/vision-ai',
                    'image_path': '/static/assets/sample/project1.svg'
                },
                {
                    'id': 'proj-2',
                    'title': 'DevHub Engineering Collaboration Engine',
                    'description': 'Full-stack platform for synchronizing engineering sprints, code metrics, and intelligent team insights.',
                    'tags': 'Next.js, TypeScript, PostgreSQL, Tailwind',
                    'project_link': 'https://github.com/saud-alotaibi/devhub',
                    'image_path': '/static/assets/sample/project2.svg'
                },
                {
                    'id': 'proj-3',
                    'title': 'SmartDoc Semantic Search & RAG System',
                    'description': 'High-performance document indexing and neural search engine powered by Large Language Embeddings.',
                    'tags': 'Python, LangChain, SQLite, ChromaDB',
                    'project_link': 'https://github.com/saud-alotaibi/smartdoc',
                    'image_path': '/static/assets/sample/project3.svg'
                }
            ],
            'experiences': [
                {
                    'id': 'exp-1',
                    'title': 'Software Engineering Intern',
                    'company': 'Leading Tech Solutions - Riyadh',
                    'duration': 'Jun 2025 - Aug 2025',
                    'description': 'Engineered high-throughput REST APIs, optimized relational database query plans, and built reactive micro-frontends.'
                },
                {
                    'id': 'exp-2',
                    'title': 'AI Undergraduate Researcher',
                    'company': 'AI Research Center (KFUPM)',
                    'duration': 'Sep 2024 - May 2025',
                    'description': 'Trained generative deep models, optimized model quantization, and authored benchmark documentation.'
                }
            ],
            'certificates': [
                {
                    'id': 'cert-1',
                    'title': 'AWS Certified Solutions Architect - Associate',
                    'issuer': 'Amazon Web Services',
                    'year': '2025',
                    'image_path': '/static/assets/sample/cert1.svg'
                },
                {
                    'id': 'cert-2',
                    'title': 'Deep Learning Specialization',
                    'issuer': 'DeepLearning.AI',
                    'year': '2024',
                    'image_path': '/static/assets/sample/cert2.svg'
                }
            ],
            'volunteering': [
                {
                    'id': 'vol-1',
                    'role': 'President of Computer Science & Software Club',
                    'organization': 'KFUPM Student Clubs',
                    'duration': '2024 - 2025',
                    'description': 'Organized 12+ hackathons and technical bootcamps for 1,500+ participants and led an executive student board of 30 members.',
                    'logo_path': '/static/assets/sample/club1.svg'
                },
                {
                    'id': 'vol-2',
                    'role': 'Technical Mentor & Judge',
                    'organization': 'SDAIA National Innovation Hackathon',
                    'duration': 'Nov 2024',
                    'description': 'Mentored 15+ student teams in rapid AI prototyping and full-stack software architecture.',
                    'logo_path': '/static/assets/sample/club2.svg'
                }
            ]
        })
    else:
        return get_portfolio_data('example-saud')

@app.route('/p/<slug_or_id>')
def view_portfolio(slug_or_id):
    return render_template('portfolio.html', slug_or_id=slug_or_id)

if __name__ == '__main__':
    print("PortfolioBuild server starting on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
