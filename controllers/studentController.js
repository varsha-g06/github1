const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

exports.createStudent = async (req, res) => {
  const {
    name, register_number, course, year, email,
    phone, gender, dob, photo_url
  } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const roleRecord = await prisma.role.findFirst({ where: { name: 'student' } });
    if (!roleRecord) return res.status(400).json({ error: 'Student role not found' });

    const hashedPassword = await bcrypt.hash('student@123', 10);

    const user = await prisma.user.create({
      data: {
        username: register_number,
        email,
        password: hashedPassword,
        role_id: roleRecord.id
      }
    });

    const student = await prisma.student.create({
      data: {
        user_id: user.id,
        name,
        register_number,
        course,
        year: parseInt(year),
        email,
        phone,
        gender,
        dob: dob ? new Date(dob) : null,
        photo_url
      }
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Create Student Error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true
      }
    });
    res.json(students);
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name, register_number, course, year, email,
    phone, gender, dob, photo_url
  } = req.body;

  try {
    const updated = await prisma.student.update({
      where: { id },
      data: {
        name,
        register_number,
        course,
        year: parseInt(year),
        email,
        phone,
        gender,
        dob: dob ? new Date(dob) : null,
        photo_url
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Student Error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({ where: { id} });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await prisma.student.delete({ where: { id } });
    await prisma.user.delete({ where: { id: student.user_id } });

    res.json({ message: 'Student and linked user deleted' });
  } catch (error) {
    console.error('Delete Student Error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
