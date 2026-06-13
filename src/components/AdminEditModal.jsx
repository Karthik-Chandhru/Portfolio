import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend Technologies',
  'Databases',
  'AI & Machine Learning',
  'Tools & Platforms',
  'Core Concepts'
];

export default function AdminEditModal({ isOpen, type, item, onClose, onSave, token }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Skill state
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState(CATEGORIES[0]);

  // Experience state
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expPoints, setExpPoints] = useState('');

  // Certification state
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDriveLink, setCertDriveLink] = useState('');

  // Project state
  const [projTitle, setProjTitle] = useState('');
  const [projTechStack, setProjTechStack] = useState('');
  const [projOverview, setProjOverview] = useState('');
  const [projFeatures, setProjFeatures] = useState('');
  const [projImpact, setProjImpact] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projLiveLink, setProjLiveLink] = useState('');

  // Reset/populate form fields when item changes
  useEffect(() => {
    setError('');
    if (isOpen) {
      if (type === 'skill') {
        setSkillName(item ? item.name : '');
        setSkillCategory(item ? item.category : CATEGORIES[0]);
      } else if (type === 'experience') {
        setExpTitle(item ? item.title : '');
        setExpCompany(item ? item.company : '');
        setExpLocation(item ? item.location : '');
        setExpDuration(item ? item.duration : '');
        setExpPoints(item ? item.points.join('\n') : '');
      } else if (type === 'certification') {
        setCertTitle(item ? item.title : '');
        setCertIssuer(item ? item.issuer : '');
        setCertDriveLink(item ? item.driveLink : '');
      } else if (type === 'project') {
        setProjTitle(item ? item.title : '');
        setProjTechStack(item ? item.techStack : '');
        setProjOverview(item ? item.overview : '');
        setProjFeatures(item ? item.features.join('\n') : '');
        setProjImpact(item ? (item.impact ? item.impact.join('\n') : '') : '');
        setProjLink(item ? item.projectLink : '');
        setProjLiveLink(item ? (item.liveLink || '') : '');
      }
    }
  }, [isOpen, type, item]);

  if (!isOpen) return null;

  const getApiEndpoint = () => {
    let path = '';
    if (type === 'skill') path = 'skills';
    else if (type === 'experience') path = 'experience';
    else if (type === 'certification') path = 'certifications';
    else if (type === 'project') path = 'projects';

    const base = `/api/portfolio/${path}`;
    return item ? `${base}/${item._id}` : base;
  };

  const getRequestBody = () => {
    if (type === 'skill') {
      return { name: skillName, category: skillCategory };
    }
    if (type === 'experience') {
      const pointsArray = expPoints
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      return {
        title: expTitle,
        company: expCompany,
        location: expLocation,
        duration: expDuration,
        points: pointsArray
      };
    }
    if (type === 'certification') {
      return { title: certTitle, issuer: certIssuer, driveLink: certDriveLink };
    }
    if (type === 'project') {
      const featuresArray = projFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const impactArray = projImpact
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      return {
        title: projTitle,
        techStack: projTechStack,
        overview: projOverview,
        features: featuresArray,
        impact: impactArray,
        projectLink: projLink,
        liveLink: projLiveLink
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const method = item ? 'PUT' : 'POST';
    const url = getApiEndpoint();
    const body = getRequestBody();

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving:', err);
      setError('Network error, please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content admin-edit-card">
        <div className="modal-header">
          <h3>
            {item ? 'Modify' : 'Add New'}{' '}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {type === 'skill' && (
            <>
              <div className="form-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Next.js"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === 'experience' && (
            <>
              <div className="row-group">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company / Organization</label>
                  <input
                    type="text"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. Mahat.AI"
                    required
                  />
                </div>
              </div>

              <div className="row-group">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="e.g. Coimbatore"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    placeholder="e.g. June 2025 – June 2026"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description Bullet Points (One per line)</label>
                <textarea
                  rows="5"
                  value={expPoints}
                  onChange={(e) => setExpPoints(e.target.value)}
                  placeholder="Developed modules using ASP.NET MVC&#10;Optimized queries to improve performance"
                  required
                />
              </div>
            </>
          )}

          {type === 'certification' && (
            <>
              <div className="form-group">
                <label>Certification Title</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. Data Structures and Algorithms (DSA)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Issuer / Institution</label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Infosys Springboard"
                  required
                />
              </div>
              <div className="form-group">
                <label>Google Drive / Verification Link</label>
                <input
                  type="url"
                  value={certDriveLink}
                  onChange={(e) => setCertDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </>
          )}

          {type === 'project' && (
            <>
              <div className="row-group">
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Edu-Connect Pro"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input
                    type="text"
                    value={projTechStack}
                    onChange={(e) => setProjTechStack(e.target.value)}
                    placeholder="e.g. React.js, Node.js, MySQL"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Overview / Description</label>
                <textarea
                  rows="3"
                  value={projOverview}
                  onChange={(e) => setProjOverview(e.target.value)}
                  placeholder="Provide a brief summary of the project..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Key Features (One per line)</label>
                <textarea
                  rows="4"
                  value={projFeatures}
                  onChange={(e) => setProjFeatures(e.target.value)}
                  placeholder="Student Management System&#10;Role-Based Access Control (RBAC)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Impact / Award Achievements (One per line)</label>
                <textarea
                  rows="3"
                  value={projImpact}
                  onChange={(e) => setProjImpact(e.target.value)}
                  placeholder="Served over 500+ users.&#10;Awarded ₹10,000 cash prize."
                />
              </div>

              <div className="row-group">
                <div className="form-group">
                  <label>Project Repository URL (GitHub)</label>
                  <input
                    type="url"
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Live Website URL</label>
                  <input
                    type="url"
                    value={projLiveLink}
                    onChange={(e) => setProjLiveLink(e.target.value)}
                    placeholder="https://your-project.onrender.com"
                  />
                </div>
              </div>
            </>
          )}

          {error && <div className="form-error-tag">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
