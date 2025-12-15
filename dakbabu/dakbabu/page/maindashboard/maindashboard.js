frappe.pages["maindashboard"].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Dashboard",
		single_column: true,
	});
	const $wrapper = $(wrapper);

	// Inject CSS
	const page_css = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

            /* Page Background */
            .page-container {
                background-color: #f4f8f9 !important;
                transition: background-color 0.3s ease;
            }
            .page-head {
                display: none !important;
            }
            .page-container.dark-theme-active {
                background-color: #010d0c !important;
            }

            /* Main Card */
            .dashboard-main-card {
                font-family: 'Roboto', sans-serif;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0 10px 30px rgba(3, 23, 22, 0.08);
                padding: 0;
                margin: 20px 0;
                min-height: 65vh; /* Responsive height fill */
                color: #031716;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .dashboard-main-card.dark-theme {
                background: #021a19;
                color: #e0f2f1;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                border: 1px solid #0a3d3d;
            }

            /* Header - Removed */

            /* Layout */
            .split-layout-container {
                display: flex;
                flex: 1;
                gap: 0;
                margin-top: 0;
            }

            .dash-col-1 {
                flex: 2 1 0; /* Strict 2/4 width */
                background: rgba(0,0,0,0.02);
                padding: 0;
            }

            .dash-col-2, .dash-col-3 {
                flex: 1 1 0; /* Strict 1/4 width */
                background: rgba(0,0,0,0.02);
                padding: 0;
            }

            .dark-theme .dash-col-1,
            .dark-theme .dash-col-2,
            .dark-theme .dash-col-3 {
                background: rgba(255,255,255,0.05);
            }

            /* Icon Header */
            .col-header {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 0;
                padding: 12px;
                background-color: #032F30;
                border-radius: 0;
            }
            .header-icon {
                width: 24px;
                height: 24px;
                color: #ffffff;
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .dark-theme .col-header {
                background-color: #274D60;
            }
            .dark-theme .header-icon {
                color: #ffffff;
            }
            /* h2 removed */

            /* Content Padding Wrapper */
            .dash-content {
                padding: 20px;
            }

            .placeholder-text {
                color: #6BA3BE;
                text-align: center;
                margin-top: 50px;
                font-size: 16px;
            }

            .dark-theme .placeholder-text {
                color: #4db6ac;
            }

            /* Task Styling */
            #dashTaskTitle {
                font-size: 22px;
                margin: 0 0 8px 0;
                font-weight: 600;
                color: #0A7075;
            }

            .dark-theme #dashTaskTitle {
                color: #80cbc4;
            }

            .priority-text, .status-pill {
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
            }

            .status-pill {
                background: #6BA3BE20;
                color: #6BA3BE;
            }
            /* Skeleton Loader */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 4px;
                opacity: 0.7;
            }

            .dark-theme .skeleton {
                background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .sk-title { height: 24px; width: 60%; margin-bottom: 12px; }
            .sk-meta { height: 20px; width: 40%; margin-bottom: 16px; }
            .sk-desc { height: 16px; width: 90%; margin-bottom: 8px; }
            .sk-desc-2 { height: 16px; width: 80%; }

            /* Responsive Layout */
            @media (max-width: 992px) {
                .split-layout-container {
                    flex-direction: column;
                    height: auto;
                }
                .dashboard-main-card {
                    height: auto;
                    min-height: auto;
                    overflow: visible; /* specialized overflow for scrolling */
                }
                .dash-col-1, .dash-col-2, .dash-col-3 {
                    flex: none;
                    width: 100%;
                    border-bottom: 1px dashed #e0e0e0; /* Add spacer border */
                }
                .dash-col-3 { border-bottom: none; }

                .dark-theme .dash-col-1,
                .dark-theme .dash-col-2 {
                    border-color: #274D60;
                }
            }
        </style>
    `;

	// Set page content
	page.main.html(`
        ${page_css}
        <div class="dashboard-main-card" id="dashboardMain">
            <div class="split-layout-container">
                <!-- Column 1: Latest Task (50%) -->
                <div class="dash-col-1">
                    <div class="col-header">
                        <svg class="header-icon" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                    <div id="dashTaskContent" class="dash-content">
                         <!-- Skeleton State -->
                        <div id="dashTaskSkeleton">
                            <div class="skeleton sk-title"></div>
                            <div class="skeleton sk-meta"></div>
                            <div class="skeleton sk-desc"></div>
                            <div class="skeleton sk-desc-2"></div>
                        </div>
                        <!-- Real Content (Hidden Initially) -->
                        <div id="dashTaskReal" style="display:none;">
                            <div>
                                <h3 id="dashTaskTitle"></h3>
                                <div id="dashTaskMeta" style="display:flex; align-items:center; gap:10px; margin: 8px 0;"></div>
                                <div id="dashTaskDesc" style="margin-top: 12px; color: #555; line-height: 1.5;"></div>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top: 20px; font-size: 14px;">
                                <div>
                                    <div style="color:#6BA3BE; font-weight:500; margin-bottom: 4px;">Due Date</div>
                                    <div id="dashTaskDue">-</div>
                                </div>
                                <div>
                                    <div style="color:#6BA3BE; font-weight:500; margin-bottom: 4px;">Project</div>
                                    <div id="dashTaskProject">-</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column 2: Stats (Graph) -->
                <div class="dash-col-2">
                    <div class="col-header">
                        <svg class="header-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div id="time-chart" class="dash-content"></div>
                </div>

                <!-- Column 3: Activity -->
                <div class="dash-col-3">
                    <div class="col-header">
                        <svg class="header-icon" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <div class="placeholder-text dash-content">Recent Activity Feed</div>
                </div>
            </div>
        </div>
    `);

	// --- Theme Sync Logic ---
	function applyTheme() {
		const currentTheme = document.body.getAttribute("data-theme") || "light";
		const isDark = currentTheme === "dark";

		if (isDark) {
			$wrapper.find("#dashboardMain").addClass("dark-theme");
			$wrapper.closest(".page-container").addClass("dark-theme-active");
		} else {
			$wrapper.find("#dashboardMain").removeClass("dark-theme");
			$wrapper.closest(".page-container").removeClass("dark-theme-active");
		}
	}

	// Apply on load
	applyTheme();

	// Listen for theme changes
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
				applyTheme();
			}
		});
	});

	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});

	// Fetch latest task
	function fetchLatestTask() {
		// Ensure skeleton is shown before fetch
		$("#dashTaskSkeleton").show();
		$("#dashTaskReal").hide();

		frappe.db
			.get_list("Task", {
				fields: [
					"name",
					"subject",
					"status",
					"priority",
					"exp_end_date",
					"description",
					"project",
				],
				filters: [["status", "!=", "Completed"]],
				order_by: "modified desc",
				limit: 1,
			})
			.then((r) => {
				if (r.length > 0) {
					const task = r[0];

					const projectId = task.project || "Personal";
					$("#dashTaskTitle").text(task.subject || "Untitled Task");

					// Fetch Project Name if projectId is not 'Personal'
					if (projectId !== "Personal") {
						frappe.db.get_value("Project", projectId, "project_name").then((r) => {
							if (r && r.message && r.message.project_name) {
								$("#dashTaskProject").text(r.message.project_name);
							} else {
								$("#dashTaskProject").text(projectId);
							}
						});
					} else {
						$("#dashTaskProject").text("Personal");
					}

					$("#dashTaskDue").text(
						task.exp_end_date
							? frappe.datetime.str_to_user(task.exp_end_date)
							: "No Due Date"
					);

					// Description
					const desc = task.description || "No description provided.";
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = desc;
					$("#dashTaskDesc").text(tempDiv.textContent || tempDiv.innerText || desc);

					// Priority & Status Badges
					let metaHtml = "";

					if (task.priority) {
						const colors = {
							High: "#ef5350",
							Medium: "#ffb74d",
							Low: "#4db6ac",
						};
						const color = colors[task.priority] || "#6BA3BE";
						metaHtml += `<span class="priority-text" style="background:${color}20; color:${color};">${task.priority}</span>`;
					}

					if (task.status) {
						const statusColors = {
							Open: "#29b6f6",
							Working: "#ffb74d",
							"Pending Review": "#9575cd",
							Overdue: "#ef5350",
							Completed: "#66bb6a",
						};
						const color = statusColors[task.status] || "#6BA3BE";
						metaHtml += `<span class="status-pill" style="margin-left:8px; background:${color}20; color:${color};">${task.status}</span>`;
					}

					$("#dashTaskMeta").html(metaHtml);

					// Switch to Real Content
					setTimeout(() => {
						// Small delay to prevent flicker if fast
						$("#dashTaskSkeleton").hide();
						$("#dashTaskReal").fadeIn(200);
					}, 300);
				} else {
					$("#dashTaskTitle").text("No Open Tasks");
					$("#dashTaskDesc").text("All tasks completed or none created yet.");
					$("#dashTaskDue, #dashTaskProject").text("-");
					$("#dashTaskMeta").empty();

					// Switch to Real Content (Empty State)
					$("#dashTaskSkeleton").hide();
					$("#dashTaskReal").show();
				}
			})
			.catch((err) => {
				console.error("Failed to fetch task:", err);
				$("#dashTaskTitle").text("Error Loading Task");
				$("#dashTaskDesc").text("Please try again later.");

				// Show error state
				$("#dashTaskSkeleton").hide();
				$("#dashTaskReal").show();
			});
	}

	// Initial data load
	fetchLatestTask();

	// --- Chart Logic ---
	function renderChart() {
		if (!frappe.Chart) return;

		const data = {
			labels: ["Current Task"],
			datasets: [
				{
					name: "Expected",
					type: "bar",
					values: [8],
				},
				{
					name: "Actual",
					type: "bar",
					values: [12],
				},
			],
		};

		const chart = new frappe.Chart("#time-chart", {
			title: "Time Comparison (Hrs)",
			data: data,
			type: "bar",
			height: 180,
			colors: ["#6BA3BE", "#ef5350"],
			axisOptions: {
				xAxisMode: "tick",
				xIsSeries: true,
				clean: true,
			},
			barOptions: {
				spaceRatio: 0.2, // Reduced space for fatter bars
				radius: 4, // Rounded top bars
			},
		});

		// Handle Theme Sync for Chart
		const updateChartTheme = () => {
			// Re-render or update colors if needed based on theme
		};
	}

	// Render Chart
	setTimeout(renderChart, 500);

	console.log("Main Dashboard Loaded Successfully");
};
