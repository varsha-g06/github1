const express = require('express');
const router = express.Router();
const {
  createRole,
  addCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  deleteAdmin,
  updateAdmin,
  createAdmin,
  addDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/adminController');


//Roles
router.post('/role', createRole);


//department
// Create
router.post('/departments', addDepartment);

// Read
router.get('/departments', getAllDepartments);

// Update
router.put('/departments/:id', updateDepartment);

// Delete
router.delete('/departments/:id', deleteDepartment);




// Create a new course
router.post('/courses', addCourse);

// Get course by ID
router.get('/courses/:id', getCourseById);

// Update course by ID
router.put('/courses/:id', updateCourse);

// Delete course by ID
router.delete('/courses/:id', deleteCourse);


// POST /api/admin/create-admin
router.post('/admin/create-admin', createAdmin)

// PUT /api/admin/update/:id
router.put('/admin/update/:id', updateAdmin)

//DELETE/ api/delete/:id
router.delete('/admin/delete/:id', deleteAdmin);


module.exports = router;

