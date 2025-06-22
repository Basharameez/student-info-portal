// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
(function() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();

// From index.html
function getStudentDetails() {
  const year = document.getElementById("yearSelect").value;
  const branch = document.getElementById("branchSelect").value;

  if (!year || !branch) {
    alert("Please select both year and branch.");
    return;
  }

  localStorage.setItem("selectedYear", year);
  localStorage.setItem("selectedBranch", branch);
  window.location.href = "details.html";
}

// From details.html
if (window.location.pathname.includes("details.html")) {
  const year = localStorage.getItem("selectedYear");
  const branch = localStorage.getItem("selectedBranch");
  const filePath = `excel_sheets/${year}_batch_${branch}.xlsx`;

  let allStudents = [];

  fetch(filePath)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "array" });
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      allStudents = data;
      renderStudents(allStudents);
    });

  function createImageElement(roll) {
  const img = document.createElement("img");
  img.className = "student-img";
  img.src = `img/${roll}.jpg`;

  img.onerror = function () {
    img.onerror = null;
    img.src = `img/${roll}.jpeg`;

    img.onerror = function () {
      img.onerror = null;
      img.src = `img/${roll}.png`;

      img.onerror = function () {
        img.onerror = null;
        img.src = "img/default.jpg"; // fallback image
      };
    };
  };

  return img;
}

  function renderStudents(students) {
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach(student => {
      const roll = (student["Roll No./Register No."] || student["Roll Number"] || "").toString().trim().replace(/\s+/g, '').toUpperCase();
      const name = `${student["First Name"] || ""} ${student["Last Name"] || ""}`;
      const father = `${student["Father Name"] || ""} ${student["Father Last Name"] || ""}`;
      const mobile = student["Mobile No."] || "";
      const parentMobile = student["Father Address Mobile Number"] || student["Father Address Phone Number"] || "";
      const email = student["Email"] || "";

      const card = document.createElement("div");
      card.className = "student-card";

      const img = createImageElement(roll);
      card.appendChild(img);

      const info = document.createElement("div");
      info.className = "student-info";
      info.innerHTML = `
        <h4>${name}</h4>
        <p><strong>Roll:</strong> ${roll}</p>
        ${father ? `<p><strong>Father:</strong> ${father}</p>` : ""}
        ${mobile ? `<p><strong>Student:</strong> ${mobile}
          <span class="inline-btns">
            <a href="tel:${mobile}">📞</a>
            <a href="sms:${mobile}">💬</a>
          </span></p>` : ""}
        ${parentMobile ? `<p><strong>Parent:</strong> ${parentMobile}
          <span class="inline-btns">
            <a href="tel:${parentMobile}">📞</a>
            <a href="sms:${parentMobile}">💬</a>
          </span></p>` : ""}
        ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ""}
      `;
      card.appendChild(info);
      list.appendChild(card);
    });
  }

  window.filterStudents = function () {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allStudents.filter(student =>
      Object.values(student).some(val =>
        val && val.toString().toLowerCase().includes(query)
      )
    );
    renderStudents(filtered);
  };
}

// Back navigation
function goBack() {
  window.location.href = "index.html";
}
