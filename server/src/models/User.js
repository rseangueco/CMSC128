import mongoose from 'mongoose';
const { Schema } = mongoose;

const typeOfUser = {
    USER: 'user',
    ADMIN: 'admin'
};

// User model
const userSchema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/, required: true },
    password: { type: String, required: true },
    contact_number: String,
    address: String,
    user_type: {
        type: String,
        enum: [typeOfUser.USER, typeOfUser.ADMIN],
        default: typeOfUser.USER,
        required: true
    },
});

const alumniSchema = new Schema({
    graduation_year: { type: Number, min: 1940, max: new Date().getFullYear(), required: true },
    degree: { type: String, required: true },
    current_job_title: String,
    company: String,
    industry: String,
    skills: [String],
    profile_visibility: { type: Boolean, default: true },
    donation_history: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    job_postings: [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }],
    events_attended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

const adminSchema = new Schema({
    position: { type: String, required: true },
    permissions: { type: [String], required: true }
});

const User = mongoose.model('User', userSchema);
const Alumni = User.discriminator('Alumni', alumniSchema);
const Admin = User.discriminator('Admin', adminSchema);

export { User, Alumni, Admin };