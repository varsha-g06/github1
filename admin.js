// -- Data 
let students = [
  {roll: "23UCS121", name: "J. Hannah Jero Pauline", email: "hannah.jero@xaviers.edu", class: "II CS"},
  {roll: "23UCS502", name: "S. Priya", email: "priya@xaviers.edu", class: "II CS"}
];
let faculty = [
  {id: "F01", name: "Dr. J.Rexy", email: "rexy@cscollege.edu"},
  {id: "F02", name: "Dr. M.Preethi", email: "preethi@cscollege.edu"}
];
let assignments = []; // {facultyId, course}
const courses = [
  "Data Structures", "DBMS", "Software Engineering",
  "Data Science", "Lab-RDBMS"
];

// -- Section Switcher
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  updateDashboard();
  if(sectionId === "courses") updateFacultyDropdown();
}

// -- Dashboard Cards
function updateDashboard() {
  document.getElementById("studentCount").textContent = students.length;
  document.getElementById("facultyCount").textContent = faculty.length;
  document.getElementById("courseCount").textContent = courses.length;
}

// -- Students
function addStudent(e) {
  e.preventDefault();
  const roll = document.getElementById('studentRoll').value.trim();
  const name = document.getElementById('studentName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const cls = document.getElementById('studentClass').value.trim();
  if(roll && name && email && cls) {
    students.push({roll, name, email, class: cls});
    e.target.reset();
    renderStudents();
    updateDashboard();
  }
}
function renderStudents() {
  const tb = document.getElementById('studentTable');
  tb.innerHTML = "";
  students.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.roll}</td><td>${s.name}</td><td>${s.email}</td><td>${s.class}</td>
      <td><button onclick="removeStudent(${idx})">Remove</button></td>`;
    tb.appendChild(tr);
  });
}
function removeStudent(idx) {
  students.splice(idx, 1);
  renderStudents();
  updateDashboard();
}

// -- Faculty
function addFaculty(e) {
  e.preventDefault();
  const id = document.getElementById('facultyId').value.trim();
  const name = document.getElementById('facultyName').value.trim();
  const email = document.getElementById('facultyEmail').value.trim();
  if(id && name && email) {
    faculty.push({id, name, email});
    e.target.reset();
    renderFaculty();
    updateDashboard();
  }
}
function renderFaculty() {
  const tb = document.getElementById('facultyTable');
  tb.innerHTML = "";
  faculty.forEach((f, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${f.id}</td><td>${f.name}</td><td>${f.email}</td>
      <td><button onclick="removeFaculty(${idx})">Remove</button></td>`;
    tb.appendChild(tr);
  });
}
function removeFaculty(idx) {
  faculty.splice(idx, 1);
  renderFaculty();
  updateDashboard();
}

// -- Assign Courses
function updateFacultyDropdown() {
  const sel = document.getElementById('facultySelect');
  sel.innerHTML = faculty.map(f => `<option value="${f.id}">${f.name} (${f.id})</option>`).join("");
}
function assignCourse(e) {
  e.preventDefault();
  const facultyId = document.getElementById('facultySelect').value;
  const course = document.getElementById('courseSelect').value;
  if(facultyId && course) {
    assignments.push({facultyId, course});
    renderAssignments();
    e.target.reset();
  }
}
function renderAssignments() {
  const ul = document.getElementById('assignmentList');
  ul.innerHTML = "";
  assignments.forEach((a, idx) => {
    const fac = faculty.find(f => f.id === a.facultyId);
    const text = fac ? `${fac.name} (${fac.id}) - ${a.course}` : `${a.facultyId} - ${a.course}`;
    const li = document.createElement('li');
    li.textContent = text;
    const btn = document.createElement('button');
    btn.textContent = "Remove";
    btn.onclick = () => { assignments.splice(idx, 1); renderAssignments(); };
    btn.style.marginLeft = "14px";
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

// -- Reports
function generateAttendanceReport() {
  const out = document.getElementById('reportOutput');
  out.innerHTML = `
    <h3>Attendance Report</h3>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Roll Number</th>
          <th>Name</th>
          <th>Attendance (%)</th>
        </tr>
      </thead>
      <tbody>
        ${students.map(s => `
          <tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>95%</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
}

function generateMarksReport() {
  const out = document.getElementById('reportOutput');
  out.innerHTML = `
    <h3>Marks Report</h3>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Roll Number</th>
          <th>Name</th>
          <th>Marks</th>
        </tr>
      </thead>
      <tbody>
        ${students.map(s => `
          <tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>80</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
}


// -- Logout
function logout() {
  alert("Logging out...");
  // Redirect or implement actual logout as needed
}

// -- Initial Render on Load
document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  renderFaculty();
  renderAssignments();
  updateDashboard();
  updateFacultyDropdown();
});