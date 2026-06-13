import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Shield, 
  LogOut, 
  ExternalLink,
  MessageSquare,
  Database
} from 'lucide-react';
import ThreeAvatar from './components/ThreeAvatar';
import AdminLogin from './components/AdminLogin';
import AdminEditModal from './components/AdminEditModal';

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LightSwitch = ({ isLightOn, onToggle }) => {
  const [isPulled, setIsPulled] = useState(false);

  const handlePull = () => {
    setIsPulled(true);
    onToggle();
    setTimeout(() => setIsPulled(false), 250);
  };

  return (
    <div className="light-switch-system">
      {/* Hanging Switch Rope */}
      <div 
        className={`switch-rope ${isPulled ? 'pulled' : ''}`} 
        onClick={handlePull}
        title="Pull rope to toggle light"
      >
        <div className="rope-line"></div>
        <div className="rope-handle"></div>
        <div className="rope-tag">Pull Me</div>
      </div>
    </div>
  );
};

export default function App() {
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Authentication & Admin Mode
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  
  // Modals Controller
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editType, setEditType] = useState('skill'); // 'skill'|'experience'|'certification'|'project'
  const [editItem, setEditItem] = useState(null); // null for Add, object for Edit

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

  // Check login token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('portfolio_admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(true);
    }
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setCertifications(data.certifications || []);
        setProjects(data.projects || []);
      } else {
        setError('Failed to fetch portfolio data from server.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Database server not connected. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken(null);
    setIsAdmin(false);
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setIsAdmin(true);
    fetchPortfolio();
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(data.message);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
      alert('Error seeding database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    let path = '';
    if (type === 'skill') path = 'skills';
    else if (type === 'experience') path = 'experience';
    else if (type === 'certification') path = 'certifications';
    else if (type === 'project') path = 'projects';

    try {
      const response = await fetch(`/api/portfolio/${path}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPortfolio();
      } else {
        const data = await response.json();
        alert(data.message || 'Deletion failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting item');
    }
  };

  const openAddModal = (type) => {
    setEditType(type);
    setEditItem(null);
    setIsEditOpen(true);
  };

  const openEditModal = (type, item) => {
    setEditType(type);
    setEditItem(item);
    setIsEditOpen(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    e.target.reset();
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Group skills by category for structural rendering
  const skillsByCategory = skills.reduce((groups, skill) => {
    const cat = skill.category;
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(skill);
    return groups;
  }, {});

  return (
    <div className={`app-container ${isLightOn ? 'light-on' : 'light-off'}`}>
      <LightSwitch isLightOn={isLightOn} onToggle={() => setIsLightOn(!isLightOn)} />
      {/* Scenic Background Floating Triangles */}
      <div className="bg-shapes">
        <svg className="shape tri-1" viewBox="0 0 100 100" width="80" height="80">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="url(#blue-gradient)" strokeWidth="3" />
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="shape tri-2" viewBox="0 0 100 100" width="130" height="130">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="url(#yellow-gradient)" strokeWidth="2.5" />
          <defs>
            <linearGradient id="yellow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="shape tri-3" viewBox="0 0 100 100" width="60" height="60">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="url(#blue-gradient-2)" strokeWidth="3" />
          <defs>
            <linearGradient id="blue-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="shape tri-4" viewBox="0 0 100 100" width="150" height="150">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="url(#yellow-gradient-2)" strokeWidth="2" />
          <defs>
            <linearGradient id="yellow-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="shape tri-5" viewBox="0 0 100 100" width="90" height="90">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="url(#blue-gradient)" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Dynamic Floating Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-logo">Karthik Chandhru</a>
          <div className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#certifications" className="nav-link">Certifications</a>
            <a href="#contact" className="nav-link">Contact</a>
            
            {isAdmin ? (
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={14} style={{ marginRight: '4px' }} /> Logout
              </button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="btn-login">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Admin Control Center status bar */}
      {isAdmin && (
        <div className="admin-status-banner">
          <div className="admin-banner-left">
            <Shield size={16} color="#06b6d4" />
            <span>Admin Workstation Mode</span>
            <span className="admin-badge">Live</span>
          </div>
          <div className="admin-banner-actions">
            <span style={{ color: 'var(--text-secondary)', marginRight: '10px' }}>
              Connected to mangoDB
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header id="hero" className="hero-section">
        <div className="hero-text">
          <div className="hero-greeting">Hi, I'm</div>
          <h1 className="hero-name">Karthik Chandhru M</h1>
          <div className="hero-tagline">
            <span>MERN Stack Developer</span>
            <span>.NET Developer</span>
            <span>AIML Engineer</span>
          </div>
          <p className="hero-desc">
            I build scalable, secure MERN stack and .NET applications while integrating cognitive AI/ML workflows. 
            Experienced in C# (ASP.NET Core/MVC), React.js, Node.js, and relational/NoSQL databases. 
            Expanding research into Large Language Models, Prompt Engineering, and Semantic Search.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn-primary">Connect with Me</a>
            <a href="#projects" className="btn-secondary">View Work</a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/Karthik-Chandhru" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
              <GithubIcon size={20} />
            </a>
            <a href="https://www.linkedin.com/in/karthik-chandhru-m-1077b0347/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
              <LinkedinIcon size={20} />
            </a>
            <a href="mailto:karthikchandhru370@gmail.com" className="social-icon" aria-label="Email">
              <Mail size={20} />
            </a>
            <a href="tel:+918807393370" className="social-icon" aria-label="Phone">
              <Phone size={20} />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <ThreeAvatar isLightOn={isLightOn} />
        </div>
      </header>

      {/* Database Setup Check / Empty Helper Banner */}
      {!loading && skills.length === 0 && (
        <section style={{ padding: '2rem 1rem' }}>
          <div className="seeding-helper-banner">
            <Database size={32} color="var(--secondary)" />
            <h3>Database Empty</h3>
            <p>
              It looks like your local MongoDB database is empty. You can instantly seed it with all your resume details (Mahat.AI work, VIT Hackathon, Edu-Connect Pro project) by clicking below.
            </p>
            <button className="btn-primary" onClick={handleSeedDatabase}>
              Seed Resume Data
            </button>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about">
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-card">
            <h3>Who I Am</h3>
            <p>
              I am a passionate Information Technology graduate who enjoys solving real-world problems through robust software architectures. My experience spans full-stack web development, database management, API design, and modern development practices.
            </p>
            <p>
              I have hands-on experience in building production-grade modules, working within collaborative environments, and designing systems serving hundreds of users. I constantly stay updated with modern AI ecosystems to bring cognitive capabilities to standard web apps.
            </p>
          </div>
          <div className="about-card">
            <h3>Quick Details</h3>
            <ul className="about-details-list">
              <li>
                <span className="label">Location:</span>
                <span className="val">Erode, Tamil Nadu, India</span>
              </li>
              <li>
                <span className="label">Degree:</span>
                <span className="val">B.Tech - Information Technology (2022 - 2026)</span>
              </li>
              <li>
                <span className="label">Colleges:</span>
                <span className="val">Erode Sengunthar Engineering College</span>
              </li>
              <li>
                <span className="label">Email:</span>
                <span className="val">karthikchandhru370@gmail.com</span>
              </li>
              <li>
                <span className="label">Phone:</span>
                <span className="val">+91 8807393370</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="skills-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Expertise & Skills</h2>
            {isAdmin && (
              <button className="btn-primary" onClick={() => openAddModal('skill')} style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                <Plus size={14} style={{ marginRight: '4px' }} /> Add Skill
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.keys(skillsByCategory).length > 0 ? (
              Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category} className="skills-category">
                  <div className="skills-category-header">
                    <h3>{category}</h3>
                  </div>
                  <div className="skills-cloud">
                    {catSkills.map((skill) => (
                      <div key={skill._id} className="skill-tag-container">
                        <span className="skill-tag">{skill.name}</span>
                        {isAdmin && (
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDelete('skill', skill._id)}
                            style={{ width: '22px', height: '22px', padding: 0 }}
                            title="Delete skill"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No skills found. Seed the database above to display skills.</p>
            )}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Work Experience</h2>
          {isAdmin && (
            <button className="btn-primary" onClick={() => openAddModal('experience')} style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Experience
            </button>
          )}
        </div>

        <div className="timeline">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp._id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div className="timeline-title">
                      <h3>{exp.title}</h3>
                      <div className="timeline-company">{exp.company}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="timeline-duration">{exp.duration}</span>
                      {isAdmin && (
                        <div className="admin-edit-actions">
                          <button className="btn-icon edit" onClick={() => openEditModal('experience', exp)} title="Edit Experience">
                            <Edit3 size={12} />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete('experience', exp._id)} title="Delete Experience">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul className="timeline-points">
                    {exp.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No experience details added yet.</p>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Featured Projects</h2>
          {isAdmin && (
            <button className="btn-primary" onClick={() => openAddModal('project')} style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Project
            </button>
          )}
        </div>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div key={proj._id} className="project-card">
                <div className="project-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="project-title">{proj.title}</h3>
                    {isAdmin && (
                      <div className="admin-edit-actions" style={{ marginLeft: '10px' }}>
                        <button className="btn-icon edit" onClick={() => openEditModal('project', proj)} title="Edit Project">
                          <Edit3 size={12} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete('project', proj._id)} title="Delete Project">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="project-tech">{proj.techStack}</span>
                </div>
                
                <p className="project-desc">{proj.overview}</p>
                
                {proj.features && proj.features.length > 0 && (
                  <div className="project-features-list">
                    <h4 className="project-section-subtitle">Key Features</h4>
                    <ul>
                      {proj.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {proj.impact && proj.impact.length > 0 && (
                  <div className="project-impact-list">
                    <h4 className="project-section-subtitle">Project Impact</h4>
                    <ul>
                      {proj.impact.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="project-footer" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {proj.projectLink && (
                    <a href={proj.projectLink} target="_blank" rel="noreferrer" className="project-link-btn">
                      Source Code <ExternalLink size={14} />
                    </a>
                  )}
                  {proj.liveLink && (
                    <a href={proj.liveLink} target="_blank" rel="noreferrer" className="project-link-btn live" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                      Go Live <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No projects added yet.</p>
          )}
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Certifications</h2>
          {isAdmin && (
            <button className="btn-primary" onClick={() => openAddModal('certification')} style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Certification
            </button>
          )}
        </div>

        <div className="certifications-grid">
          {certifications.length > 0 ? (
            certifications.map((cert) => (
              <div key={cert._id} className="cert-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <Award className="cert-icon" size={24} />
                  {isAdmin && (
                    <div className="admin-edit-actions">
                      <button className="btn-icon edit" onClick={() => openEditModal('certification', cert)} title="Edit Certification">
                        <Edit3 size={11} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete('certification', cert._id)} title="Delete Certification">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                {cert.driveLink && (
                  <a href={cert.driveLink} target="_blank" rel="noreferrer" className="cert-link">
                    Verify Certificate <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No certifications listed yet.</p>
          )}
        </div>
      </section>

      {/* Education Section (Aesthetically styled static/integrated card) */}
      <section id="education">
        <h2 className="section-title">Education</h2>
        <div className="education-section">
          <div className="education-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <GraduationCap size={24} color="var(--primary)" />
                <h3 className="edu-degree">Bachelor of Technology (Information Technology)</h3>
              </div>
              <div className="edu-college">Erode Sengunthar Engineering College</div>
              <div className="edu-details">
                Affiliated to Anna University. Specialized in software design patterns, full stack web development, and computing fundamentals.
              </div>
            </div>
            <div className="edu-right">
              <span className="edu-cgpa">CGPA: 8.0/10</span>
              <span className="edu-duration">2022 – 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3 className="contact-heading">Let's collaborate on something great</h3>
            <p className="contact-text">
              Have an opening, a hackathon project, or want to discuss AI pipelines? Drop me a message or connect through my phone or socials!
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-item-text">
                  <h4>Email</h4>
                  <p><a href="mailto:karthikchandhru370@gmail.com">karthikchandhru370@gmail.com</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-item-text">
                  <h4>Phone</h4>
                  <p><a href="tel:+918807393370">+91 8807393370</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <MapPin size={18} />
                </div>
                <div className="contact-item-text">
                  <h4>Location</h4>
                  <p>Erode, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <form onSubmit={handleContactSubmit} className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email Address" required />
              <textarea rows="5" placeholder="Your Message..." required />
              {contactSuccess && (
                <div style={{ color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={16} /> Thank you! Your message has been sent successfully.
                </div>
              )}
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Karthik Chandhru M</div>
          <div className="footer-text">
            © {new Date().getFullYear()} Karthik Chandhru M. Built with React, Three.js & Mongoose.
          </div>
        </div>
      </footer>

      {/* Admin Modals */}
      <AdminLogin 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <AdminEditModal 
        isOpen={isEditOpen} 
        type={editType} 
        item={editItem} 
        onClose={() => setIsEditOpen(false)} 
        onSave={fetchPortfolio} 
        token={token} 
      />
    </div>
  );
}
