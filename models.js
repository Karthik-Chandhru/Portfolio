/* global process */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Check if we should use MongoDB or local JSON fallback
// Render environment defines process.env.RENDER=true
export const useMongoDB = !!(
  process.env.MONGODB_URI &&
  (process.env.MONGODB_URI.startsWith('mongodb+srv://') ||
    (!process.env.RENDER && process.env.MONGODB_URI.startsWith('mongodb://')))
);

// --- MONGOOSE SCHEMAS ---
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }
});

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  points: { type: [String], default: [] }
});

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  driveLink: { type: String, default: '' }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  techStack: { type: String, required: true },
  overview: { type: String, required: true },
  features: { type: [String], default: [] },
  impact: { type: [String], default: [] },
  projectLink: { type: String, default: '' },
  liveLink: { type: String, default: '' }
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  taglines: { type: [String], default: [] },
  description: { type: String, required: true }
});

// --- MOCK LOCAL JSON DB IMPLEMENTATION ---
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ skills: [], experiences: [], certifications: [], projects: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { skills: [], experiences: [], certifications: [], projects: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

class MockModel {
  constructor(collectionName, data) {
    this._collectionName = collectionName;
    Object.assign(this, data);
  }

  async save() {
    const db = readDB();
    this._id = this._id || Math.random().toString(36).substring(2, 9);
    
    const itemToSave = { ...this };
    delete itemToSave._collectionName;

    const list = db[this._collectionName] || [];
    const index = list.findIndex(item => item._id === this._id);
    if (index !== -1) {
      list[index] = itemToSave;
    } else {
      list.push(itemToSave);
    }
    db[this._collectionName] = list;
    writeDB(db);
    return this;
  }

  static getModel(collectionName) {
    return {
      find: async () => {
        const db = readDB();
        return db[collectionName] || [];
      },
      countDocuments: async () => {
        const db = readDB();
        return (db[collectionName] || []).length;
      },
      insertMany: async (items) => {
        const db = readDB();
        const formatted = items.map(item => ({
          _id: Math.random().toString(36).substring(2, 9),
          ...item
        }));
        db[collectionName] = [...(db[collectionName] || []), ...formatted];
        writeDB(db);
        return formatted;
      },
      findByIdAndDelete: async (id) => {
        const db = readDB();
        const list = db[collectionName] || [];
        const index = list.findIndex(item => item._id === id);
        if (index !== -1) {
          const deleted = list.splice(index, 1)[0];
          writeDB(db);
          return deleted;
        }
        return null;
      },
      findByIdAndUpdate: async (id, updateData) => {
        const db = readDB();
        const list = db[collectionName] || [];
        const index = list.findIndex(item => item._id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updateData };
          writeDB(db);
          return list[index];
        }
        return null;
      }
    };
  }
}

// Define real Mongoose models
const MongoSkill = mongoose.model('Skill', SkillSchema);
const MongoExperience = mongoose.model('Experience', ExperienceSchema);
const MongoCertification = mongoose.model('Certification', CertificationSchema);
const MongoProject = mongoose.model('Project', ProjectSchema);
const MongoProfile = mongoose.model('Profile', ProfileSchema);

// Define wrappers
export let Skill;
export let Experience;
export let Certification;
export let Project;
export let Profile;

if (useMongoDB) {
  Skill = MongoSkill;
  Experience = MongoExperience;
  Certification = MongoCertification;
  Project = MongoProject;
  Profile = MongoProfile;
} else {
  // Use mock JSON models
  class JSONSkill extends MockModel {
    constructor(data) { super('skills', data); }
  }
  Object.assign(JSONSkill, MockModel.getModel('skills'));

  class JSONExperience extends MockModel {
    constructor(data) { super('experiences', data); }
  }
  Object.assign(JSONExperience, MockModel.getModel('experiences'));

  class JSONCertification extends MockModel {
    constructor(data) { super('certifications', data); }
  }
  Object.assign(JSONCertification, MockModel.getModel('certifications'));

  class JSONProject extends MockModel {
    constructor(data) { super('projects', data); }
  }
  Object.assign(JSONProject, MockModel.getModel('projects'));

  class JSONProfile extends MockModel {
    constructor(data) { super('profile', data); }
  }
  Object.assign(JSONProfile, MockModel.getModel('profile'));

  Skill = JSONSkill;
  Experience = JSONExperience;
  Certification = JSONCertification;
  Project = JSONProject;
  Profile = JSONProfile;
}
