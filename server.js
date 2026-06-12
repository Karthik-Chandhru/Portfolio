import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { Skill, Experience, Certification, Project, useMongoDB } from './models.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (useMongoDB) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mangoDB';
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB connection skipped. Falling back to local JSON file database (db.json)');
}

// JWT Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.email === process.env.ADMIN_EMAIL) {
      req.admin = decoded;
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'karthikchandhru370@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Chandhru@19';

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    return res.json({ token, email, message: 'Authentication successful' });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

// --- PORTFOLIO DATA ROUTES ---

// Fetch all portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    const skills = await Skill.find({});
    const experiences = await Experience.find({});
    const certifications = await Certification.find({});
    const projects = await Project.find({});

    res.json({ skills, experiences, certifications, projects });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Seeding core function
const performSeeding = async () => {
  // Seed Skills
  const initialSkills = [
    // Programming Languages
    { name: 'Java', category: 'Programming Languages' },
    { name: 'JavaScript', category: 'Programming Languages' },
    { name: 'C#', category: 'Programming Languages' },
    { name: 'Python', category: 'Programming Languages' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'SQL', category: 'Programming Languages' },
    
    // Frontend Technologies
    { name: 'React.js', category: 'Frontend Technologies' },
    { name: 'HTML5', category: 'Frontend Technologies' },
    { name: 'CSS3', category: 'Frontend Technologies' },
    { name: 'Tailwind CSS', category: 'Frontend Technologies' },
    { name: 'Responsive Web Design', category: 'Frontend Technologies' },

    // Backend Technologies
    { name: 'Node.js', category: 'Backend Technologies' },
    { name: 'Express.js', category: 'Backend Technologies' },
    { name: 'ASP.NET MVC', category: 'Backend Technologies' },
    { name: 'ASP.NET Core', category: 'Backend Technologies' },
    { name: 'REST APIs', category: 'Backend Technologies' },
    { name: 'JWT Authentication', category: 'Backend Technologies' },

    // Databases
    { name: 'MySQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'SQL Server', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },

    // AI & Machine Learning
    { name: 'LLM APIs', category: 'AI & Machine Learning' },
    { name: 'RAG (Retrieval-Augmented Generation)', category: 'AI & Machine Learning' },
    { name: 'Prompt Engineering', category: 'AI & Machine Learning' },
    { name: 'Embeddings', category: 'AI & Machine Learning' },
    { name: 'Semantic Search', category: 'AI & Machine Learning' },

    // Tools & Platforms
    { name: 'Git', category: 'Tools & Platforms' },
    { name: 'GitHub', category: 'Tools & Platforms' },
    { name: 'Docker', category: 'Tools & Platforms' },
    { name: 'Visual Studio', category: 'Tools & Platforms' },
    { name: 'VS Code', category: 'Tools & Platforms' },
    { name: 'Postman', category: 'Tools & Platforms' },
    { name: 'Swagger', category: 'Tools & Platforms' },
    { name: 'Vercel', category: 'Tools & Platforms' },
    { name: 'Render', category: 'Tools & Platforms' },
    { name: 'pgAdmin', category: 'Tools & Platforms' },

    // Core Concepts
    { name: 'Data Structures & Algorithms', category: 'Core Concepts' },
    { name: 'MVC Architecture', category: 'Core Concepts' },
    { name: 'CRUD Operations', category: 'Core Concepts' },
    { name: 'Role-Based Access Control (RBAC)', category: 'Core Concepts' },
    { name: 'Authentication & Authorization', category: 'Core Concepts' },
    { name: 'API Integration', category: 'Core Concepts' },
    { name: 'Agile Development', category: 'Core Concepts' },
    { name: 'Unit Testing', category: 'Core Concepts' }
  ];

  // Seed Experiences
  const initialExperiences = [
    {
      title: 'Full Stack Developer',
      company: 'Mahat.AI | Coimbatore',
      location: 'Coimbatore',
      duration: 'June 2025 – June 2026',
      points: [
        'Developed and deployed multiple web application modules using ASP.NET MVC.',
        'Worked on frontend development using Razor and jQuery.',
        'Built backend services using C#.',
        'Designed CRUD operations and REST APIs integrated with PostgreSQL and SQL Server.',
        'Optimized database queries to improve performance.',
        'Collaborated with senior developers to resolve production issues.',
        'Participated in Git-based development workflows and code reviews.'
      ]
    },
    {
      title: 'Full Stack Development Intern',
      company: 'National Small Industries Corporation (NSIC)',
      location: 'Chennai',
      duration: 'August 2024 – September 2024',
      points: [
        'Developed a responsive e-commerce webpage.',
        'Worked with HTML, CSS, JavaScript, and backend integration concepts.',
        'Gained experience in responsive design, debugging, and software development best practices.'
      ]
    }
  ];

  // Seed Certifications
  const initialCertifications = [
    {
      title: 'Data Structures and Algorithms (DSA)',
      issuer: 'Infosys Springboard',
      driveLink: 'https://drive.google.com/drive/folders/your-cert-dsa'
    },
    {
      title: 'Full Stack Development Internship Certification',
      issuer: 'NSIC, Chennai',
      driveLink: 'https://drive.google.com/drive/folders/your-cert-nsic'
    }
  ];

  // Seed Projects
  const initialProjects = [
    {
      title: 'Edu-Connect Pro – Smart Campus Management Platform',
      techStack: 'React.js, Node.js, Express.js, MySQL, Tailwind CSS',
      overview: 'A centralized smart campus platform designed to automate student management, attendance tracking, and faculty communication.',
      features: [
        'Student Management System',
        'Attendance Tracking',
        'Faculty Communication Portal',
        'SMS Integration',
        'WhatsApp Notification System',
        'JWT Authentication',
        'Role-Based Access Control (RBAC)',
        'Responsive Dashboards'
      ],
      impact: [
        'Served over 500+ users.',
        'Automated campus operations.',
        'Awarded ₹10,000 cash prize.',
        'Successfully adopted for college operations.'
      ],
      projectLink: 'https://github.com/Karthik-Chandhru/Edu-Connect-Pro'
    },
    {
      title: 'AI-Based Healthcare Application',
      techStack: 'React, Node, Express, MongoDB, LLM APIs',
      overview: 'An AI-powered healthcare application developed during a VIT hackathon, building a complete MVP within 24 hours.',
      features: [
        'Built a complete full-stack healthcare solution.',
        'Developed frontend, backend, and database within 24 hours.',
        'Shortlisted among top finalist teams from over 100 participants.',
        'Demonstrated rapid problem-solving and teamwork skills.'
      ],
      impact: [
        'Top Finalist at VIT Hackathon (out of 100+ teams).'
      ],
      projectLink: 'https://github.com/Karthik-Chandhru/AI-Healthcare'
    }
  ];

  await Skill.insertMany(initialSkills);
  await Experience.insertMany(initialExperiences);
  await Certification.insertMany(initialCertifications);
  await Project.insertMany(initialProjects);
};

// Seed Initial Data Route
app.post('/api/portfolio/seed', async (req, res) => {
  try {
    // Check if data already exists to prevent duplication
    const skillCount = await Skill.countDocuments({});
    const expCount = await Experience.countDocuments({});
    const certCount = await Certification.countDocuments({});
    const projCount = await Project.countDocuments({});

    if (skillCount > 0 || expCount > 0 || certCount > 0 || projCount > 0) {
      return res.status(400).json({ message: 'Database is already seeded' });
    }

    await performSeeding();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Internal server error during seeding' });
  }
});

// --- ADMIN API ENDPOINTS (PROTECTED BY JWT) ---

// SKILLS CRUD
app.post('/api/portfolio/skills', authenticateAdmin, async (req, res) => {
  const { name, category } = req.body;
  try {
    const newSkill = new Skill({ name, category });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: 'Error adding skill', error });
  }
});

app.delete('/api/portfolio/skills/:id', authenticateAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting skill', error });
  }
});

// PROJECTS CRUD
app.post('/api/portfolio/projects', authenticateAdmin, async (req, res) => {
  const { title, techStack, overview, features, impact, projectLink } = req.body;
  try {
    const newProj = new Project({ title, techStack, overview, features, impact, projectLink });
    await newProj.save();
    res.status(201).json(newProj);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error });
  }
});

app.put('/api/portfolio/projects/:id', authenticateAdmin, async (req, res) => {
  const { title, techStack, overview, features, impact, projectLink } = req.body;
  try {
    const updatedProj = await Project.findByIdAndUpdate(
      req.params.id,
      { title, techStack, overview, features, impact, projectLink },
      { new: true }
    );
    res.json(updatedProj);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
});

app.delete('/api/portfolio/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting project', error });
  }
});

// EXPERIENCE CRUD
app.post('/api/portfolio/experience', authenticateAdmin, async (req, res) => {
  const { title, company, location, duration, points } = req.body;
  try {
    const newExp = new Experience({ title, company, location, duration, points });
    await newExp.save();
    res.status(201).json(newExp);
  } catch (error) {
    res.status(400).json({ message: 'Error creating experience record', error });
  }
});

app.put('/api/portfolio/experience/:id', authenticateAdmin, async (req, res) => {
  const { title, company, location, duration, points } = req.body;
  try {
    const updatedExp = await Experience.findByIdAndUpdate(
      req.params.id,
      { title, company, location, duration, points },
      { new: true }
    );
    res.json(updatedExp);
  } catch (error) {
    res.status(400).json({ message: 'Error updating experience record', error });
  }
});

app.delete('/api/portfolio/experience/:id', authenticateAdmin, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting experience record', error });
  }
});

// CERTIFICATION CRUD
app.post('/api/portfolio/certifications', authenticateAdmin, async (req, res) => {
  const { title, issuer, driveLink } = req.body;
  try {
    const newCert = new Certification({ title, issuer, driveLink });
    await newCert.save();
    res.status(201).json(newCert);
  } catch (error) {
    res.status(400).json({ message: 'Error adding certification', error });
  }
});

app.put('/api/portfolio/certifications/:id', authenticateAdmin, async (req, res) => {
  const { title, issuer, driveLink } = req.body;
  try {
    const updatedCert = await Certification.findByIdAndUpdate(
      req.params.id,
      { title, issuer, driveLink },
      { new: true }
    );
    res.json(updatedCert);
  } catch (error) {
    res.status(400).json({ message: 'Error updating certification', error });
  }
});

app.delete('/api/portfolio/certifications/:id', authenticateAdmin, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting certification', error });
  }
});

// Serve frontend build static files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Auto-seed database if empty on startup (great for zero-config deploys)
  try {
    const skillCount = await Skill.countDocuments({});
    const expCount = await Experience.countDocuments({});
    if (skillCount === 0 && expCount === 0) {
      console.log('Database empty on startup. Performing auto-seeding...');
      await performSeeding();
      console.log('Auto-seeding completed successfully.');
    }
  } catch (err) {
    console.error('Error auto-seeding database on startup:', err);
  }
});
