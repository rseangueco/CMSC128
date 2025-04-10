import { Router } from 'express';
const router = Router();
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { getAllAlumni } from '../controllers/modelControllers/alumniController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

// fetch all alumni profiles
router.get('/read', alumniController.read);

// create a new alumni profile (Admin only)
// router.post('/alumni', authenticateToken, authorizeRoles(['Admin']), createAlumni);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', authenticateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

// create a new alumni profile
// router.post('/alumni', createAlumni);

// // fetch all alumni profiles
// router.get('/get', getAllAlumni);

export default router;
