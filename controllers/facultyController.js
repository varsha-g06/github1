const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();

exports.createFaculty = async (req, res) => {
  const {
    name, email, gender, dob, phone,
    qualification, experience_years, faculty_code, photo_url
  } = req.body;

  try {

        const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this username or email already exists' });
    }
    const roleRecord = await prisma.role.findFirst({
      where: { name: 'faculty' },
    });

    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash('faculty@123', 10);
    
    // Create User first
    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword, // In production, hash this!
        role_id: roleRecord.id
      }
    });

    // Create Faculty linked to user
      const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        gender,
       dob: dob ? new Date(dob) : null,
        phone,
        qualification,
        experience_years: experience_years ? parseInt(experience_years) : null,
        faculty_code,
        photo_url,
        user_id: user.id
      }
    });

    res.status(201).json(faculty);
  } catch (error) {
    console.error('Create Faculty Error:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
};
exports.getAllFaculty = async (req, res) => {
  try {
    const faculties = await prisma.faculty.findMany({
      include: {
        user: true,
        department: true
      }
    });
    res.json(faculties);
  } catch (error) {
    console.error('Fetch Faculty Error:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
};
exports.updateFaculty = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, gender, dob, phone,
    qualification, experience_years,
    department_id, faculty_code, photo_url
  } = req.body;

  try {
    const updated = await prisma.faculty.update({
      where: { id },
      data: {
        name,
        email,
        gender,
        dob: dob ? new Date(dob) : null,
        phone,
        qualification,
        experience_years: experience_years ? parseInt(experience_years) : null,
        department_id,
        faculty_code,
        photo_url
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Faculty Error:', error);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
};
exports.deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await prisma.faculty.findUnique({ where: { id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    await prisma.faculty.delete({ where: { id } });
    await prisma.user.delete({ where: { id: faculty.user_id } });

    res.json({ message: 'Faculty and linked user deleted' });
  } catch (error) {
    console.error('Delete Faculty Error:', error);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
};

