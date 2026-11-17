const API = "/api";

let students = [];
let subjects = [];
let results = [];


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadAllData();

    setupStudentForm();
    setupSubjectForm();
    setupResultForm();

});


// =====================================================
// LOAD ALL DATA
// =====================================================

async function loadAllData() {

    try {

        await Promise.all([
            loadStudents(),
            loadSubjects(),
            loadResults()
        ]);

        updateDashboard();

    } catch (error) {

        console.error("Initialization error:", error);

        showToast(
            "Connection Error",
            "Unable to connect to the backend."
        );
    }
}


// =====================================================
// STUDENTS
// =====================================================

async function loadStudents() {

    const response = await fetch(`${API}/students`);

    if (!response.ok) {
        throw new Error("Unable to load students");
    }

    students = await response.json();

    renderStudents();

    populateStudentSelects();

    updateDashboard();
}


function renderStudents() {

    const table =
        document.getElementById("studentsTable");

    if (!table) return;

    table.innerHTML = "";

    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    students.forEach(student => {

        const initials =
            getInitials(student.name);

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>

                <div class="student-cell">

                    <div class="student-avatar">
                        ${initials}
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(student.name)}
                        </strong>
                    </div>

                </div>

            </td>

            <td>
                ${escapeHtml(student.rollNo)}
            </td>

            <td>
                ${escapeHtml(student.course)}
            </td>

            <td>
                ${escapeHtml(student.branch)}
            </td>

            <td>
                Semester ${student.semester}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="table-action edit"
                        onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button
                        class="table-action delete"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>

                </div>

            </td>
        `;

        table.appendChild(row);
    });

    const total =
        document.getElementById("studentTotal");

    if (total) {

        total.textContent =
            `${students.length} student${students.length !== 1 ? "s" : ""} registered`;
    }
}


// =====================================================
// ADD STUDENT
// =====================================================

function setupStudentForm() {

    const form =
        document.getElementById("studentForm");

    if (!form) return;

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const student = {

            rollNo:
                document
                    .getElementById("rollNo")
                    .value
                    .trim(),

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            course:
                document
                    .getElementById("course")
                    .value
                    .trim(),

            branch:
                document
                    .getElementById("branch")
                    .value
                    .trim(),

            semester:
                Number(
                    document
                        .getElementById("semester")
                        .value
                )
        };


        if (!student.rollNo ||
            !student.name ||
            !student.course ||
            !student.branch ||
            !student.semester) {

            showToast(
                "Invalid Data",
                "Please fill all student fields."
            );

            return;
        }


        try {

            const response =
                await fetch(`${API}/students`, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)
                });


            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Unable to add student"
                );
            }


            closeModal("studentModal");

            form.reset();

            showToast(
                "Student Added",
                "Student has been added successfully."
            );

            await loadStudents();

            updateDashboard();


        } catch (error) {

            console.error(error);

            showToast(
                "Error",
                error.message
            );
        }

    });
}


// =====================================================
// EDIT STUDENT
// =====================================================

async function editStudent(id) {

    const student =
        students.find(s => s.id === id);

    if (!student) return;


    const name =
        prompt(
            "Student name:",
            student.name
        );

    if (name === null) return;


    const course =
        prompt(
            "Course:",
            student.course
        );

    if (course === null) return;


    const branch =
        prompt(
            "Branch:",
            student.branch
        );

    if (branch === null) return;


    const semester =
        prompt(
            "Semester (1-8):",
            student.semester
        );

    if (semester === null) return;


    const updatedStudent = {

        rollNo: student.rollNo,

        name: name.trim(),

        course: course.trim(),

        branch: branch.trim(),

        semester: Number(semester)

    };


    if (
        !updatedStudent.name ||
        !updatedStudent.course ||
        !updatedStudent.branch ||
        updatedStudent.semester < 1 ||
        updatedStudent.semester > 8
    ) {

        showToast(
            "Invalid Data",
            "Please enter valid student information."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/students/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(updatedStudent)
                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );
        }


        showToast(
            "Student Updated",
            "Student information updated."
        );

        await loadStudents();


    } catch (error) {

        showToast(
            "Error",
            error.message
        );
    }
}


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(id) {

    const student =
        students.find(s => s.id === id);

    if (!student) return;


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API}/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );
        }


        showToast(
            "Student Deleted",
            "Student has been removed."
        );

        await loadStudents();

        await loadResults();

        updateDashboard();


    } catch (error) {

        showToast(
            "Delete Failed",
            error.message
        );
    }
}


// =====================================================
// SUBJECTS
// =====================================================

async function loadSubjects() {

    const response =
        await fetch(`${API}/subjects`);

    if (!response.ok) {

        throw new Error(
            "Unable to load subjects"
        );
    }

    subjects =
        await response.json();

    renderSubjects();

    populateSubjectSelect();

    updateDashboard();
}


function renderSubjects() {

    const container =
        document.getElementById("subjectsGrid");

    if (!container) return;

    container.innerHTML = "";


    if (subjects.length === 0) {

        container.innerHTML = `
            <div class="empty-subjects">
                No subjects added yet.
            </div>
        `;

        return;
    }


    subjects.forEach(subject => {

        const card =
            document.createElement("div");

        card.className =
            "subject-card";


        card.innerHTML = `

            <span class="subject-code">
                ${escapeHtml(subject.subjectCode)}
            </span>

            <h3>
                ${escapeHtml(subject.subjectName)}
            </h3>

            <p>
                Maximum Marks:
                ${subject.maxMarks}
            </p>

        `;


        container.appendChild(card);
    });
}


// =====================================================
// ADD SUBJECT
// =====================================================

function setupSubjectForm() {

    const form =
        document.getElementById("subjectForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const subject = {

                subjectCode:
                    document
                        .getElementById("subjectCode")
                        .value
                        .trim(),

                subjectName:
                    document
                        .getElementById("subjectName")
                        .value
                        .trim(),

                maxMarks: 100

            };


            if (
                !subject.subjectCode ||
                !subject.subjectName
            ) {

                showToast(
                    "Invalid Data",
                    "Please enter subject details."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API}/subjects`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(subject)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }


                closeModal("subjectModal");

                form.reset();


                showToast(
                    "Subject Added",
                    "Subject has been created."
                );


                await loadSubjects();


            } catch (error) {

                showToast(
                    "Error",
                    error.message
                );
            }

        }
    );
}


// =====================================================
// RESULTS
// =====================================================

async function loadResults() {

    const response =
        await fetch(`${API}/results`);

    if (!response.ok) {

        throw new Error(
            "Unable to load results"
        );
    }

    results =
        await response.json();

    updateDashboard();
}


// =====================================================
// RESULT FORM
// =====================================================

function setupResultForm() {

    const form =
        document.getElementById("resultForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const studentId =
                document
                    .getElementById("studentSelect")
                    .value;


            const subjectId =
                document
                    .getElementById("subjectSelect")
                    .value;


            const internal =
                Number(
                    document
                        .getElementById("internalMarks")
                        .value
                );


            const external =
                Number(
                    document
                        .getElementById("externalMarks")
                        .value
                );


            if (!studentId ||
                !subjectId) {

                showToast(
                    "Missing Information",
                    "Select a student and subject."
                );

                return;
            }


            if (
                internal < 0 ||
                internal > 30
            ) {

                showToast(
                    "Invalid Marks",
                    "Internal marks must be 0–30."
                );

                return;
            }


            if (
                external < 0 ||
                external > 70
            ) {

                showToast(
                    "Invalid Marks",
                    "External marks must be 0–70."
                );

                return;
            }


            try {

                const url =
                    `${API}/results` +
                    `?studentId=${studentId}` +
                    `&subjectId=${subjectId}` +
                    `&internalMarks=${internal}` +
                    `&externalMarks=${external}`;


                const response =
                    await fetch(
                        url,
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }


                closeModal("resultModal");

                form.reset();


                showToast(
                    "Result Saved",
                    "Student marks saved successfully."
                );


                await loadResults();

                updateDashboard();


            } catch (error) {

                showToast(
                    "Error",
                    error.message
                );
            }

        }
    );
}


// =====================================================
// VIEW STUDENT RESULT
// =====================================================

async function loadStudentResult() {

    const studentId =
        document
            .getElementById("resultStudentSelect")
            .value;


    if (!studentId) {

        showToast(
            "Select Student",
            "Please select a student first."
        );

        return;
    }


    try {

        const student =
            students.find(
                student =>
                    student.id == studentId
            );


        const response =
            await fetch(
                `${API}/students/${studentId}/results`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load result"
            );
        }


        const studentResults =
            await response.json();


        displayStudentResult(
            student,
            studentResults
        );


    } catch (error) {

        showToast(
            "Error",
            error.message
        );
    }
}


// =====================================================
// DISPLAY RESULT
// =====================================================

function displayStudentResult(
    student,
    studentResults
) {

    const preview =
        document.getElementById(
            "resultPreview"
        );


    preview.style.display = "block";


    document.getElementById(
        "resultStudentName"
    ).textContent =
        student.name;


    document.getElementById(
        "resultStudentInfo"
    ).textContent =
        `${student.rollNo} • ${student.course} • ${student.branch} • Semester ${student.semester}`;


    const table =
        document.getElementById(
            "resultTable"
        );


    table.innerHTML = "";


    let total = 0;

    let maximum = 0;

    let failed = false;


    studentResults.forEach(result => {

        total += result.totalMarks;

        maximum += result.subject.maxMarks;


        if (result.status === "FAIL") {

            failed = true;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHtml(
                        result.subject.subjectName
                    )}
                </strong>

                <br>

                <small>
                    ${escapeHtml(
                        result.subject.subjectCode
                    )}
                </small>
            </td>

            <td>
                ${result.internalMarks}
            </td>

            <td>
                ${result.externalMarks}
            </td>

            <td>
                <strong>
                    ${result.totalMarks}
                </strong>
            </td>

            <td>
                <strong>
                    ${result.grade}
                </strong>
            </td>

            <td>

                <span class="status ${
                    result.status === "PASS"
                        ? "pass"
                        : "fail"
                }">

                    ${result.status}

                </span>

            </td>

        `;


        table.appendChild(row);
    });


    const percentage =
        maximum > 0
            ? (total / maximum) * 100
            : 0;


    document.getElementById(
        "totalMarks"
    ).textContent =
        `${total} / ${maximum}`;


    document.getElementById(
        "percentage"
    ).textContent =
        `${percentage.toFixed(2)}%`;


    document.getElementById(
        "resultPercentage"
    ).textContent =
        `${percentage.toFixed(2)}%`;


    const finalResult =
        document.getElementById(
            "overallResult"
        );


    finalResult.textContent =
        failed ? "FAIL" : "PASS";


    finalResult.style.color =
        failed
            ? "#dc2626"
            : "#16a34a";
}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    document.getElementById(
        "studentCount"
    ).textContent =
        students.length;


    document.getElementById(
        "resultCount"
    ).textContent =
        results.length;


    const passed =
        results.filter(
            result =>
                result.status === "PASS"
        ).length;


    const failed =
        results.filter(
            result =>
                result.status === "FAIL"
        ).length;


    document.getElementById(
        "passedCount"
    ).textContent =
        passed;


    document.getElementById(
        "failedCount"
    ).textContent =
        failed;


    renderRecentResults();
}


// =====================================================
// RECENT RESULTS
// =====================================================

function renderRecentResults() {

    const table =
        document.getElementById(
            "recentResults"
        );


    if (!table) return;


    table.innerHTML = "";


    if (results.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#9ca3af;
                    "
                >

                    No result records yet.

                </td>

            </tr>

        `;

        return;
    }


    const grouped =
        {};


    results.forEach(result => {

        const student =
            result.student;


        if (!student) return;


        if (!grouped[student.id]) {

            grouped[student.id] = {

                student,

                total: 0,

                maximum: 0,

                failed: false

            };
        }


        grouped[student.id].total +=
            result.totalMarks;


        grouped[student.id].maximum +=
            result.subject.maxMarks;


        if (result.status === "FAIL") {

            grouped[student.id].failed = true;
        }

    });


    Object.values(grouped)
        .slice(0, 8)
        .forEach(item => {

            const percentage =
                item.maximum > 0
                    ? (
                        item.total /
                        item.maximum
                    ) * 100
                    : 0;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="student-cell">

                        <div class="student-avatar">

                            ${getInitials(
                                item.student.name
                            )}

                        </div>

                        <strong>
                            ${escapeHtml(
                                item.student.name
                            )}
                        </strong>

                    </div>

                </td>


                <td>
                    ${escapeHtml(
                        item.student.rollNo
                    )}
                </td>


                <td>
                    Semester
                    ${item.student.semester}
                </td>


                <td>
                    <strong>
                        ${percentage.toFixed(2)}%
                    </strong>
                </td>


                <td>

                    <span class="status ${
                        item.failed
                            ? "fail"
                            : "pass"
                    }">

                        ${
                            item.failed
                                ? "FAIL"
                                : "PASS"
                        }

                    </span>

                </td>

            `;


            table.appendChild(row);

        });
}


// =====================================================
// SELECT DROPDOWNS
// =====================================================

function populateStudentSelects() {

    const selects = [

        document.getElementById(
            "studentSelect"
        ),

        document.getElementById(
            "resultStudentSelect"
        )

    ];


    selects.forEach(select => {

        if (!select) return;


        const current =
            select.value;


        select.innerHTML = `

            <option value="">
                Select student
            </option>

        `;


        students.forEach(student => {

            const option =
                document.createElement("option");


            option.value =
                student.id;


            option.textContent =
                `${student.rollNo} — ${student.name}`;


            select.appendChild(option);

        });


        if (current) {

            select.value = current;
        }

    });
}


function populateSubjectSelect() {

    const select =
        document.getElementById(
            "subjectSelect"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select subject
        </option>

    `;


    subjects.forEach(subject => {

        const option =
            document.createElement("option");


        option.value =
            subject.id;


        option.textContent =
            `${subject.subjectCode} — ${subject.subjectName}`;


        select.appendChild(option);

    });
}


// =====================================================
// NAVIGATION
// =====================================================

function showPage(pageId, element) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active-page"
        );
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    if (element) {

        element.classList.add(
            "active"
        );
    }


    const title =
        document.getElementById(
            "pageTitle"
        );


    if (title) {

        title.textContent =
            pageId.charAt(0).toUpperCase() +
            pageId.slice(1);
    }


    closeSidebar();
}


function showPageById(pageId) {

    const nav =
        document.querySelector(
            `.nav-item[onclick*="'${pageId}'"]`
        );


    showPage(
        pageId,
        nav
    );
}


// =====================================================
// MODALS
// =====================================================

function openStudentModal() {

    document
        .getElementById(
            "studentModal"
        )
        .classList.add("show");
}


function openSubjectModal() {

    document
        .getElementById(
            "subjectModal"
        )
        .classList.add("show");
}


function openResultModal() {

    populateStudentSelects();

    populateSubjectSelect();

    document
        .getElementById(
            "resultModal"
        )
        .classList.add("show");
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");
}


// Close modal when clicking outside

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            event.target.classList.remove(
                "show"
            );
        }

    }
);


// =====================================================
// SIDEBAR
// =====================================================

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.toggle("open");
}


function closeSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.remove("open");
}


// =====================================================
// SEARCH
// =====================================================

function filterStudentTable() {

    const search =
        document
            .getElementById(
                "studentSearch"
            )
            .value
            .toLowerCase();


    document
        .querySelectorAll(
            "#studentsTable tr"
        )
        .forEach(row => {

            row.style.display =
                row.textContent
                    .toLowerCase()
                    .includes(search)
                    ? ""
                    : "none";

        });
}


function searchStudents() {

    const search =
        document
            .getElementById(
                "globalSearch"
            )
            .value
            .trim()
            .toLowerCase();


    if (!search) return;


    const match =
        students.find(student =>

            student.name
                .toLowerCase()
                .includes(search)

            ||

            student.rollNo
                .toLowerCase()
                .includes(search)

        );


    if (match) {

        showPageById("students");

    }
}


// =====================================================
// TOAST
// =====================================================

function showToast(
    title,
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    document.getElementById(
        "toastTitle"
    ).textContent =
        title;


    document.getElementById(
        "toastMessage"
    ).textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3500);
}


// =====================================================
// UTILITIES
// =====================================================

function getInitials(name) {

    if (!name) return "?";


    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}