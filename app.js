const students = [
	{
		name: "Carlos Ernacio",
		id: "2024-00124",
		course: "BSIT 3-2",
		status: "Present",
	},
	{
		name: "Panfilo Cabarrubias",
		id: "2024-00137",
		course: "BSIT 3-2",
		status: "Late",
	},
	{
		name: "Bhea Abril",
		id: "2024-00149",
		course: "BSIT 3-2",
		status: "Present",
	},
	{
		name: "Kirsten Licup",
		id: "2024-00162",
		course: "BSIT 3-2",
		status: "Absent",
	},
	{
		name: "Patricia Garcia",
		id: "2024-00175",
		course: "BSIT 3-1",
		status: "Present",
	},
];
const navByRole = {
	Instructor: [
		["Overview", "⛶"],
		["My Classes", "▤"],
		["Attendance Sessions", "▣"],
		["Attendance Records", "☷"],
		["Class Feedback", "☆"],
		["Reports", "▥"],
	],
	Student: [
		["Overview", "⛶"],
		["Scan Attendance", "▣"],
		["My Attendance", "☷"],
		["Class Feedback", "☆"],
	],
	Administrator: [
		["Overview", "⛶"],
		["User Verification", "✓"],
		["Accounts", "♙"],
		["Classes", "▤"],
		["System Activity", "◷"],
	],
};
let role = "Instructor",
	page = "Overview",
	menuOpen = false,
	sessionActive = false,
	toastTimer;
const $ = (id) => document.getElementById(id);
const esc = (s) =>
	String(s).replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
function showToast(msg) {
	$("toast").textContent = msg;
	$("toast").classList.remove("hidden");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2800);
}
function go(next) {
	page = next;
	menuOpen = false;
	$("navMenu").classList.add("hidden");
	$("menuToggle").setAttribute("aria-expanded", "false");
	$("profileMenu").classList.add("hidden");
	render();
}
function setRole(next) {
	role = next;
	page = "Overview";
	$("roleSelect").value = role;
	render();
}
function renderNav() {
	const nav = $("navMenu");
	nav.innerHTML = navByRole[role]
		.map(
			([label, icon]) =>
				`<button class="${page === label ? "active" : ""}" data-page="${label}"><span class="nav-icon">${icon}</span>${label}</button>`,
		)
		.join("");
	nav
		.querySelectorAll("[data-page]")
		.forEach((b) => b.addEventListener("click", () => go(b.dataset.page)));
}
function statusChip(s) {
	let c =
		s === "Present"
			? "green"
			: s === "Late"
				? "amber"
				: s === "Absent"
					? "red"
					: "";
	return `<span class="chip ${c}">${esc(s)}</span>`;
}
function attendanceTable(rows) {
	return `<div class="table-wrap"><table><thead><tr><th>Student</th><th>Student ID</th><th>Section</th><th>Status</th></tr></thead><tbody>${rows.map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.id)}</td><td>${esc(s.course)}</td><td>${statusChip(s.status)}</td></tr>`).join("")}</tbody></table></div>`;
}
function stat(label, value, detail) {
	return `<article class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-detail">${detail}</div></article>`;
}
function panel(title, body, action = "") {
	return `<section class="panel"><div class="panel-head"><h2>${title}</h2>${action}</div>${body}</section>`;
}
function instructorOverview() {
	let present = students.filter((s) => s.status === "Present").length,
		late = students.filter((s) => s.status === "Late").length,
		absent = students.filter((s) => s.status === "Absent").length;
	return `<div class="stats-grid">${stat("Active classes", "4", "Across this semester")}${stat("Students enrolled", "128", "Across your classes")}${stat("Present today", present, "BSIT 3-1 sample session")}${stat("Needs attention", late + absent, `${absent} absent · ${late} late`)}</div><div class="layout-grid"><div>${panel("Today's classes", `<div class="class-row"><div class="class-icon">IT</div><div class="class-info"><strong>Web Development</strong><small>BSIT 3-1 · Room 204 · 10:00–11:30 AM</small></div>${statusChip(sessionActive ? "Session active" : "Upcoming")}<button class="secondary-button" data-go="Attendance Sessions">Open</button></div><div class="class-row"><div class="class-icon">DB</div><div class="class-info"><strong>Database Management</strong><small>BSIT 3-1 · Lab 2 · 1:00–2:30 PM</small></div>${statusChip("Upcoming")}<button class="secondary-button" data-go="My Classes">Open</button></div>`, `<button class="link-button" data-go="My Classes">View all ➜</button>`)}${panel("Recent attendance", attendanceTable(students.slice(0, 4)), `<button class="link-button" data-go="Attendance Records">All records ➜</button>`)}</div><div>${panel("Quick actions", `<div class="quick-actions"><button class="quick-action" data-go="Attendance Sessions"><strong>▦ Start attendance</strong><small>Create a class QR session</small></button><button class="quick-action" data-go="Attendance Records"><strong>☷ View records</strong><small>Review student attendance</small></button><button class="quick-action" data-go="Reports"><strong>▥ Attendance reports</strong><small>Review class summaries</small></button><button class="quick-action" data-go="My Classes"><strong>▤ My classes</strong><small>View assigned classes</small></button></div>`)}${panel("Class summary", `<div class="class-row"><div class="class-info"><strong>Web Development</strong><small>BSIT 3-1</small></div><strong>92%</strong></div><div class="class-row"><div class="class-info"><strong>Database Management</strong><small>BSIT 3-1</small></div><strong>88%</strong></div>`)}</div></div>`;
}
function studentOverview() {
	return `<div class="stats-grid">${stat("Classes enrolled", "6", "Current semester")}${stat("Present", "18", "Attendance records")}${stat("Late", "2", "Attendance records")}${stat("Absent", "1", "Attendance records")}</div><div class="layout-grid">${panel("Today's classes", `<div class="class-row"><div class="class-icon">IT</div><div class="class-info"><strong>Web Development</strong><small>BSIT 3-1 · Room 204 · 10:00 AM</small></div>${statusChip("Upcoming")}</div><div class="class-row"><div class="class-icon">DB</div><div class="class-info"><strong>Database Management</strong><small>BSIT 3-1 · Lab 2 · 1:00 PM</small></div>${statusChip("Upcoming")}</div>`, `<button class="link-button" data-go="Scan Attendance">Scan QR ➜</button>`)}${panel("Recent attendance", attendanceTable(students.slice(0, 3)), `<button class="link-button" data-go="My Attendance">View history ➜</button>`)}</div><div class="panel"><h2>Quick access</h2><div class="quick-actions"><button class="quick-action" data-go="Scan Attendance"><strong>▦ Scan attendance QR</strong><small>Record attendance for an active class</small></button><button class="quick-action" data-go="My Attendance"><strong>☷ My attendance</strong><small>Review your attendance history</small></button></div></div>`;
}
function pageBody() {
	if (page === "Overview")
		return role === "Instructor"
			? instructorOverview()
			: role === "Student"
				? studentOverview()
				: `<div class="stats-grid">${stat("Registered users", "342", "Sample campus accounts")}${stat("Students", "320", "Sample records")}${stat("Instructors", "22", "Sample records")}${stat("Pending verification", "3", "Requires review")}</div><div class="layout-grid">${panel("Recent accounts", attendanceTable(students))}${panel("Administration", `<div class="quick-actions"><button class="quick-action" data-go="User Verification"><strong>✓ Verify users</strong><small>Review submitted documents</small></button><button class="quick-action" data-go="Accounts"><strong>♙ Manage accounts</strong><small>Review campus accounts</small></button><button class="quick-action" data-go="Classes"><strong>▤ Manage classes</strong><small>Review class records</small></button></div>`)}</div>`;
	if (page === "My Classes" || page === "Classes")
		return panel(
			"Class list",
			`<div class="class-row"><div class="class-icon">IT</div><div class="class-info"><strong>Web Development</strong><small>BSIT 3-1 · Room 204 · 32 students</small></div>${statusChip("Active")}</div><div class="class-row"><div class="class-icon">DB</div><div class="class-info"><strong>Database Management</strong><small>BSIT 3-1 · Laboratory 2 · 32 students</small></div>${statusChip("Active")}</div><div class="class-row"><div class="class-icon">SA</div><div class="class-info"><strong>Systems Analysis and Design</strong><small>BSIT 3-1 · Room 206 · 32 students</small></div>${statusChip("Active")}</div>`,
		);
	if (page === "Attendance Sessions")
		return `<div class="layout-grid"><div>${panel("Web Development · BSIT 3-1", `<div class="empty-state"><div class="big-icon">⛆</div><h2>${sessionActive ? "Attendance session is active" : "Ready to take attendance?"}</h2><p>${sessionActive ? "Students can scan the session QR shown by the instructor." : "Start a session to display a session QR code for students."}</p><div class="qr-placeholder">⛆</div><p class="muted">Session code: ${sessionActive ? "PUP-3A7X" : "Not started"}</p><button id="sessionToggle" class="primary-button">${sessionActive ? "End session" : "Start attendance session"}</button></div>`)}</div>${panel("Session details", `<p><strong>Subject:</strong> Web Development</p><p><strong>Section:</strong> BSIT 3-1</p><p><strong>Schedule:</strong> 10:00 AM – 11:30 AM</p><p><strong>QR behavior:</strong> Session-based</p>`)}</div>`;
	if (page === "Attendance Records")
		return panel(
			"Attendance records",
			`<div class="filter-row"><input id="studentSearch" class="form-control" placeholder="Search student or ID"><select id="statusFilter" class="form-control"><option>All statuses</option><option>Present</option><option>Late</option><option>Absent</option></select></div><div id="recordsTable">${attendanceTable(students)}</div><p class="muted">Sample records only. Updates are not yet saved to a database.</p>`,
		);
	if (page === "Scan Attendance")
		return `<div class="scan-layout"><div class="panel scan-card"><div class="empty-state"><div class="big-icon">▦</div><h2>Scan class QR code</h2><p>Use your instructor's active attendance QR code to record attendance.</p><div class="qr-placeholder">▦</div><button id="openCamera" class="primary-button">Open camera</button><p class="muted">Camera scanning requires a QR scanner integration.</p></div></div><div class="panel"><h2>Enter session code</h2><p class="muted">For this UI preview, enter the code displayed by your instructor.</p><label for="sessionCode">Session code</label><input id="sessionCode" class="form-control" placeholder="e.g. PUP-3A7X"><button id="checkCode" class="primary-button">Check code</button></div></div>`;
	if (page === "My Attendance")
		return panel(
			"My attendance history",
			attendanceTable([
				{
					name: "Carlos Ernacio",
					id: "2024-00137",
					course: "Web Development",
					status: "Present",
				},
				{
					name: "Carlos Ernacio",
					id: "2024-00137",
					course: "Database Management",
					status: "Late",
				},
				{
					name: "Carlos Ernacio",
					id: "2024-00137",
					course: "Systems Analysis",
					status: "Present",
				},
				{
					name: "Carlos Ernacio",
					id: "2024-00137",
					course: "Web Development",
					status: "Absent",
				},
			]),
		);
	if (page === "Class Feedback")
		return panel(
			role === "Student" ? "Submit class feedback" : "Class feedback summary",
			role === "Student"
				? `<label>Choose class<select class="form-control"><option>Web Development</option><option>Database Management</option></select></label><label>Rating<select id="rating" class="form-control"><option value="">Choose rating</option><option>5 - Excellent</option><option>4 - Good</option><option>3 - Average</option><option>2 - Poor</option><option>1 - Very poor</option></select></label><label>Comment<textarea id="comment" class="form-control" rows="4" placeholder="Share your feedback"></textarea></label><button id="submitFeedback" class="primary-button">Submit feedback</button>`
				: `<p>Average class rating: <strong>4.4 / 5</strong></p>`,
		);
	if (page === "Reports")
		return panel(
			"Attendance reports",
			`<label>Class<select class="form-control"><option>All classes</option><option>Web Development</option><option>Database Management</option></select></label><label>Reporting period<select class="form-control"><option>This month</option><option>This week</option><option>This semester</option></select></label><button id="generateReport" class="primary-button">Generate summary</button>`,
		);
	if (page === "Notifications")
		return panel(
			"Recent notifications",
			`<div class="notice-row"><span class="class-icon">!</span><div class="class-info"><strong>Attendance reminder</strong><small>You were marked late in Database Management on October 26.</small></div>${statusChip("Attendance")}</div><div class="notice-row"><span class="class-icon">◷</span><div class="class-info"><strong>Upcoming class</strong><small>Web Development is scheduled for October 28 at 10:00 AM.</small></div>${statusChip("Class")}</div>`,
		);
	if (page === "User Verification")
		return panel(
			"Pending verifications",
			`<div class="class-row"><div class="class-info"><strong>Andrea Santos</strong><small>Student ID 2024-00124 · School ID</small></div>${statusChip("Pending")}<button class="secondary-button" data-notice="Demo verification approved">Approve</button></div><div class="class-row"><div class="class-info"><strong>Mark Dela Cruz</strong><small>Student ID 2024-00137 · Certificate of Registration</small></div>${statusChip("Pending")}<button class="secondary-button" data-notice="Demo verification approved">Approve</button></div>`,
		);
	if (page === "Accounts")
		return panel(
			"Campus accounts",
			attendanceTable([
				...students,
				{
					name: "Cristian Balatbat",
					id: "INST-0001",
					course: "Instructor",
					status: "Present",
				},
			]),
		);
	if (page === "System Activity")
		return panel(
			"Recent system activity",
			`<div class="notice-row"><div class="class-info"><strong>Attendance session created</strong><small>Web Development · Today, 9:45 AM</small></div>${statusChip("Sample")}</div><div class="notice-row"><div class="class-info"><strong>Student record reviewed</strong><small>Campus administration · Yesterday</small></div>${statusChip("Sample")}</div>`,
		);
	return panel(page, `<p class="muted">No records available.</p>`);
}
function render() {
	renderNav();
	$("dateLine").textContent = new Date().toLocaleDateString("en-PH", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	$("pageTitle").textContent =
		page === "Overview"
			? `Good day, ${role === "Instructor" ? "Instructor" : role === "Student" ? "Student" : "Administrator"}`
			: page;
	$("pageSubtitle").textContent =
		page === "Overview"
			? role === "Instructor"
				? "Here is a summary of your classes and attendance activity."
				: role === "Student"
					? "Check your attendance status and class updates."
					: "Manage campus accounts, classes, and system activity."
			: {
					"Attendance Sessions": "Create and manage class attendance sessions.",
					"Scan Attendance": "Scan your instructor's active session QR code.",
					"Attendance Records": "Review attendance entries for your classes.",
					"My Attendance": "Review your attendance history and status.",
					Notifications: "Stay informed about attendance and class updates.",
				}[page] || "";
	$("createSession").classList.toggle(
		"hidden",
		role !== "Instructor" || page !== "Overview",
	);
	$("qrLabel").textContent = role === "Student" ? "Scan QR" : "Attendance QR";
	$("avatar").textContent =
		role === "Instructor" ? "CB" : role === "Student" ? "CE" : "CA";
	$("profileName").textContent =
		role === "Instructor"
			? "Cristian Balatbat"
			: role === "Student"
				? "Carlos Ernacio"
				: "Campus Admin";
	$("profileRole").textContent = role;
	$("pageContent").innerHTML = pageBody();
	bindPageActions();
}
function bindPageActions() {
	document
		.querySelectorAll("[data-go]")
		.forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
	document
		.querySelectorAll("[data-notice]")
		.forEach((b) =>
			b.addEventListener("click", () => showToast(b.dataset.notice)),
		);
	const st = $("sessionToggle");
	if (st)
		st.onclick = () => {
			sessionActive = !sessionActive;
			render();
			showToast(
				sessionActive
					? "Attendance session started in demo mode."
					: "Attendance session ended.",
			);
		};
	const search = $("studentSearch"),
		filter = $("statusFilter");
	function updateRecords() {
		if (!search || !filter) return;
		let q = search.value.toLowerCase(),
			s = filter.value;
		let rows = students.filter(
			(x) =>
				(x.name.toLowerCase().includes(q) || x.id.toLowerCase().includes(q)) &&
				(s === "All statuses" || x.status === s),
		);
		$("recordsTable").innerHTML = attendanceTable(rows);
	}
	if (search) search.addEventListener("input", updateRecords);
	if (filter) filter.addEventListener("change", updateRecords);
	const camera = $("openCamera");
	if (camera)
		camera.onclick = () =>
			showToast("Camera scanning needs a QR scanner integration.");
	const check = $("checkCode");
	if (check)
		check.onclick = () =>
			showToast(
				$("sessionCode").value.trim() === "PUP-3A7X" && sessionActive
					? "Demo code accepted. No attendance was saved."
					: "No active matching session found.",
			);
	const fb = $("submitFeedback");
	if (fb)
		fb.onclick = () =>
			showToast(
				$("rating").value
					? "Feedback captured in demo mode."
					: "Please choose a rating first.",
			);
	const report = $("generateReport");
	if (report)
		report.onclick = () =>
			showToast("Sample report summary generated for this preview.");
}
$("menuToggle").addEventListener("click", () => {
	menuOpen = !menuOpen;
	$("navMenu").classList.toggle("hidden", !menuOpen);
	$("menuToggle").setAttribute("aria-expanded", String(menuOpen));
	$("profileMenu").classList.add("hidden");
});
$("brandHome").addEventListener("click", () => go("Overview"));
$("roleSelect").addEventListener("change", (e) => setRole(e.target.value));
$("qrButton").addEventListener("click", () =>
	go(role === "Student" ? "Scan Attendance" : "Attendance Sessions"),
);
$("notificationsButton").addEventListener("click", () => go("Notifications"));
$("profileButton").addEventListener("click", () => {
	$("profileMenu").classList.toggle("hidden");
	$("navMenu").classList.add("hidden");
	menuOpen = false;
});
$("switchRole").addEventListener("click", () =>
	setRole(
		role === "Instructor"
			? "Student"
			: role === "Student"
				? "Instructor"
				: "Instructor",
	),
);
$("createSession").addEventListener("click", () => go("Attendance Sessions"));
document.addEventListener("click", (e) => {
	if (
		!e.target.closest(".menu-wrap") &&
		!e.target.closest("#profileMenu") &&
		!e.target.closest("#profileButton")
	) {
		$("navMenu").classList.add("hidden");
		menuOpen = false;
		$("menuToggle").setAttribute("aria-expanded", "false");
	}
});
render();
