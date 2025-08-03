import mongoose, {Schema, Types} from "mongoose";

const SkillItemSchema = new Schema({
  title: String,
  description: String,
}, { _id: false });

const ExperienceItemSchema = new Schema({
  jobTitle: String,
  company: String,
  from: String,
  to: String,
  isCurrent: { type: Boolean, default: false },
  description: [String],
}, { _id: false });

const ProjectItemSchema = new Schema({
  title: String,
  from: String,
  to: String,
  isCurrent: { type: Boolean, default: false },
  description: [String],
}, { _id: false });

const EducationItemSchema = new Schema({
  school: String,
  from: String,
  to: String,
  course: String,
  specialisation: String,
  cgpa: String,
  percentage: String,
  inProgress: { type: Boolean, default: false },
}, { _id: false });

const PersonalInfoSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  github: String,
  linkedIn: String,
  leetcode: String,
  portfolio: String,
  summary: String,
}, { _id: false });

const ResumeSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    personalInfo: PersonalInfoSchema,
    experience: [ExperienceItemSchema],
    education: [EducationItemSchema],
    projects: [ProjectItemSchema],
    achievements: [String],
    skills: [SkillItemSchema],
    title: { type: String, default: "Untitled Resume" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);