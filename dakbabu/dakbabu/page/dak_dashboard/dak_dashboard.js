frappe.pages["dak_dashboard"].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Dak Dashboard",
		single_column: true,
	});

	// Check dependencies
	if (
		!frappe.provide("dakbabu.components") ||
		!dakbabu.components.get_reminder_card ||
		!dakbabu.components.get_performance_card
	) {
		frappe.require("/assets/dakbabu/js/dak_components.js", () => {
			frappe.pages["dak_dashboard"].render_page_content(wrapper);
		});
	} else {
		frappe.pages["dak_dashboard"].render_page_content(wrapper);
	}
};

frappe.pages["dak_dashboard"].on_page_show = function (wrapper) {
	if (frappe.pages["dak_dashboard"].refresh_stats) {
		frappe.pages["dak_dashboard"].refresh_stats();
	}
};

frappe.pages["dak_dashboard"].render_page_content = function (wrapper) {
	if (
		!dakbabu.components ||
		!dakbabu.components.get_reminder_card ||
		!dakbabu.components.get_performance_card
	) {
		console.error("Failed to load Dak Components");
		frappe.msgprint("Failed to load Dashboard Components. Please reload dependencies.");
		return;
	}

	// Add content to the page
	$(wrapper).find(".layout-main").html(`
        <!-- Navigation Bar Card -->
        <div style="
            width: 100%;
            background: linear-gradient(135deg, #2e605c 0%, #468e88 100%);
            padding: 15px 40px;
            margin-bottom: 2px;
            border-radius: 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 100;
        ">
            <!-- Decorative Circles Container (Handles Overflow) -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border-radius: 0; z-index: 0;">
                <div style="position: absolute; top: -30px; left: 10%; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -40px; right: 5%; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            </div>

            <!-- Left Branding + Nav -->
            <div style="display: flex; align-items: center; gap: 40px; position: relative; z-index: 1;">
                 <!-- Brand -->
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        width: 38px;
                        height: 38px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.1rem;
                        backdrop-filter: blur(5px);
                    ">
                        <i class="fa fa-check"></i>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <h1 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: 0.02em;">TaskFlow</h1>
                        <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); font-weight: 500; letter-spacing: 0.5px;">ERPNext Extension</span>
                    </div>
                </div>

                <!-- Nav Links -->
                <div style="display: flex; gap: 30px; align-items: center; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 40px; height: 30px;">
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
                        <i class="fa fa-home" style="margin-right: 8px; font-size: 1.1rem;"></i> Dashboard
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_task_list')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-list" style="margin-right: 8px; font-size: 1rem;"></i> All Tasks
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_projects')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-briefcase" style="margin-right: 8px; font-size: 1rem;"></i> Projects
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_day_planner')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                    </div>
                </div>
            </div>

            <!-- Right Controls -->
            <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                 <!-- Date Filter Dropdown -->
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dashboardFilterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="
                        background: rgba(255,255,255,0.2);
                        color: #ffffff;
                        border: none;
                        width: 38px;
                        height: 38px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(5px);
                        padding: 0;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        <i class="fa fa-filter" style="font-size: 1rem;"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dashboardFilterDropdown" style="margin-top: 10px; border-radius: 8px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden;">
                        <li style="border-bottom: 1px solid #f3f4f6;"><div style="padding: 8px 15px; font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Filter Time</div></li>
                        <li><a href="#" onclick="frappe.pages['dak_dashboard'].refresh_stats('All Time', true); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">All Time</a></li>
                        <li><a href="#" onclick="frappe.pages['dak_dashboard'].refresh_stats('Today', true); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Today</a></li>
                        <li><a href="#" onclick="frappe.pages['dak_dashboard'].refresh_stats('This Week', true); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Week</a></li>
                        <li><a href="#" onclick="frappe.pages['dak_dashboard'].refresh_stats('This Month', true); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Month</a></li>
                        <li style="border-top: 1px solid #f3f4f6; margin-top: 5px; padding-top: 5px;"><a href="#" onclick="frappe.pages['dak_dashboard'].refresh_stats('All Time', true); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #4b5563;"><i class="fa fa-refresh" style="margin-right:8px;"></i> Reset Filter</a></li>
                    </ul>
                </div>

                 <!-- Add Task Button -->
                <button onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(true)" style="
                    background: rgba(255,255,255,0.2);
                    color: #ffffff;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    <i class="fa fa-plus" style="margin-right: 8px;"></i> Add Task
                </button>
            </div>
        </div>





            <!-- Main Content Container with background matching nav but lighter -->
            <div style="width: 100%; box-sizing: border-box; margin: 0; background: #f3f4f6; padding: 0 0 20px 0; border-radius: 0 0 12px 12px;">

                <!-- Dynamic Task Cards Container (Active Task - Sphere Card) -->
                <div id="task-cards-container" style="width: 100%; margin-bottom: 20px; padding: 0;">
                    <!-- Cards will be injected here via JS -->
                    <div class="text-center p-5" style="color: rgba(255,255,255,0.5);">
                        <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Row: Split Layout (Number Cards) -->
                <div class="row" style="margin: 0; width: 100%; margin-top: 0px;">
                    <!-- Left Column (50%) for Number Cards -->
                    <div class="col-md-6" style="padding: 0;">
                        <div class="row" style="margin: 0;">
                            <!-- Total Tasks: Blue/Cyan -->
                            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4" style="padding: 0 5px;">
                                <div class="frappe-card" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list()" style="
                                    padding: 15px;
                                    border-radius: 12px;
                                    background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                                    box-shadow: 0 4px 10px -3px rgba(6, 182, 212, 0.4);
                                    color: #ffffff;
                                    border: none;
                                    position: relative;
                                    overflow: hidden;
                                    height: 100%;
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: -30px; left: -20px; width: 90px; height: 90px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                        <h6 style="font-weight: 600; font-size: 0.8rem; opacity: 1; margin: 0; color: #ffffff; white-space: nowrap;">Total</h6>
                                        <span style="padding: 4px; border-radius: 6px;">
                                            <i class="fa fa-file-text-o" style="color: #ffffff; font-size: 0.8rem;"></i>
                                        </span>
                                    </div>
                                    <h3 id="total-tasks-count" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2px; color: #ffffff;">
                                        <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                    </h3>
                                    <div class="active-filter-label" style="font-size: 0.65rem; opacity: 0.8; font-weight: 500;">All Time</div>
                                </div>
                            </div>

                            <!-- Due Period: Orange/Red -->
                            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4" style="padding: 0 5px;">
                                <div class="frappe-card" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list({'status': 'Overdue'})" style="
                                    padding: 15px;
                                    border-radius: 12px;
                                    background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                                    box-shadow: 0 4px 10px -3px rgba(245, 158, 11, 0.4);
                                    color: #ffffff;
                                    border: none;
                                    position: relative;
                                    overflow: hidden;
                                    height: 100%;
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: -30px; left: -20px; width: 90px; height: 90px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                        <h6 style="font-weight: 600; font-size: 0.8rem; opacity: 1; margin: 0; color: #ffffff; white-space: nowrap;">Overdue</h6>
                                        <span style="padding: 4px; border-radius: 6px;">
                                            <i class="fa fa-calendar" style="color: #ffffff; font-size: 0.8rem;"></i>
                                        </span>
                                    </div>
                                    <h3 id="overdue-tasks-count" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2px; color: #ffffff;">
                                        <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                    </h3>
                                    <div class="active-filter-label" style="font-size: 0.65rem; opacity: 0.8; font-weight: 500;">All Time</div>
                                </div>
                            </div>

                            <!-- High Priority: Pink/Rose -->
                            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4" style="padding: 0 5px;">
                                <div class="frappe-card" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list({'priority': 'High'})" style="
                                    padding: 15px;
                                    border-radius: 12px;
                                    background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                                    box-shadow: 0 4px 10px -3px rgba(236, 72, 153, 0.4);
                                    color: #ffffff;
                                    border: none;
                                    position: relative;
                                    overflow: hidden;
                                    height: 100%;
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: -30px; left: -20px; width: 90px; height: 90px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                        <h6 style="font-weight: 600; font-size: 0.8rem; opacity: 1; margin: 0; color: #ffffff; white-space: nowrap;">High Priority</h6>
                                        <span style="padding: 4px; border-radius: 6px;">
                                            <i class="fa fa-exclamation-circle" style="color: #ffffff; font-size: 0.8rem;"></i>
                                        </span>
                                    </div>
                                    <h3 id="high-priority-count" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2px; color: #ffffff;">
                                        <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                    </h3>
                                    <div class="active-filter-label" style="font-size: 0.65rem; opacity: 0.8; font-weight: 500;">All Time</div>
                                </div>
                            </div>

                            <!-- Pending Review: Violet -->
                            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4" style="padding: 0 5px;">
                                <div class="frappe-card" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list({'status': 'Pending Review'})" style="
                                    padding: 15px;
                                    border-radius: 12px;
                                    background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                                    box-shadow: 0 4px 10px -3px rgba(139, 92, 246, 0.4);
                                    color: #ffffff;
                                    border: none;
                                    position: relative;
                                    overflow: hidden;
                                    height: 100%;
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: -30px; left: -20px; width: 90px; height: 90px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; background: linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0)); border-radius: 50%;"></div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                        <h6 style="font-weight: 600; font-size: 0.8rem; opacity: 1; margin: 0; color: #ffffff; white-space: nowrap;">Review</h6>
                                        <span style="padding: 4px; border-radius: 6px;">
                                            <i class="fa fa-eye" style="color: #ffffff; font-size: 0.8rem;"></i>
                                        </span>
                                    </div>
                                    <h3 id="pending-review-count" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2px; color: #ffffff;">
                                        <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                    </h3>
                                    <div class="active-filter-label" style="font-size: 0.65rem; opacity: 0.8; font-weight: 500;">All Time</div>
                                </div>
                            </div>
                        </div>

                        <!-- Extra Space Container (Recent Activity / Placeholder) -->
                        <div style="padding: 0 5px; margin-top: 0px;"> <!-- Added Wrapper for padding consistency -->
                             <div class="frappe-card" style="
                                width: 100%;
                                background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                                border-radius: 12px;
                                box-shadow: 0 4px 10px -3px rgba(6, 182, 212, 0.4);
                                color: #ffffff;
                                padding: 20px;
                                min-height: 180px; /* Fill some height */
                                position: relative;
                                overflow: hidden;
                            ">
                                <!-- Decorative BG -->
                                <div style="position: absolute; bottom: -50px; right: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                                <h4 style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fa fa-history" style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 50%;"></i>
                                    Recent Activity
                                </h4>

                                <div id="recent-activity-container" style="display: flex; flex-direction: column; gap: 20px;">
                                    <!-- Latest Task Item -->
                                    <div id="recent-activity-task" style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer;" onclick="frappe.set_route('List', 'Task')">
                                        <div style="width: 8px; height: 8px; background: #a7f3d0; border-radius: 50%;"></div>
                                        <div style="display: flex; flex-direction: column; flex: 1;">
                                            <span class="activity-text" style="font-size: 0.9rem; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">Loading task...</span>
                                            <span class="activity-meta" style="font-size: 0.7rem; opacity: 0.6;">Task</span>
                                        </div>
                                        <span class="activity-time" style="margin-left: auto; font-size: 0.75rem; opacity: 0.7;"></span>
                                    </div>

                                    <!-- Latest Project Item -->
                                    <div id="recent-activity-project" style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer;" onclick="frappe.set_route('List', 'Project')">
                                        <div style="width: 8px; height: 8px; background: #fde047; border-radius: 50%;"></div>
                                        <div style="display: flex; flex-direction: column; flex: 1;">
                                             <span class="activity-text" style="font-size: 0.9rem; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">Loading project...</span>
                                             <span class="activity-meta" style="font-size: 0.7rem; opacity: 0.6;">Project</span>
                                        </div>
                                        <span class="activity-time" style="margin-left: auto; font-size: 0.75rem; opacity: 0.7;"></span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                <!-- Right Column (50%) -->
                <div class="col-md-6" style="padding: 0;">
                    <div class="dashboard-matrix-row" style="display: flex; width: 100%; gap: 10px;">

                        <!-- Performance Matrix Card (Left) -->
                        <div class="reminder-section dashboard-matrix-card" style="
                            flex: 1;
                            background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                            padding: 15px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                            border-radius: 12px;
                            position: relative;
                            overflow: hidden;
                            border: none;
                            color: #ffffff;
                            min-width: 0; /* Prevent flex overflow */
                        ">
                            <!-- Decorative Circles -->
                            <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                            <div style="position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
                                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <span style="font-size: 1rem; margin-right: 8px; background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; backdrop-filter: blur(5px);">
                                        <i class="fa fa-line-chart"></i>
                                    </span>
                                    <h3 class="dmc-title" style="font-size: 1rem; font-weight: 700; margin: 0; color: #ffffff; white-space: nowrap;">Performance</h3>
                                </div>

                                <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                                    <!-- Circles Container -->
                                    <div style="display: flex; justify-content: center; gap: 20px; width: 100%;">

                                        <!-- Task Circle -->
                                        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                                            <div id="perf-circle" class="dmc-circle" style="
                                                width: 70px;
                                                height: 70px;
                                                border-radius: 50%;
                                                background: conic-gradient(#425f5f 0% 0%, rgba(255,255,255,0.2) 0% 100%);
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                position: relative;
                                                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                                            ">
                                                <div class="dmc-inner-circle" style="
                                                    width: 56px;
                                                    height: 56px;
                                                    background: rgba(255,255,255,0.1);
                                                    border-radius: 50%;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    backdrop-filter: blur(5px);
                                                ">
                                                    <span id="perf-percent" style="font-size: 0.9rem; font-weight: 800; color: #ffffff;">0%</span>
                                                </div>
                                            </div>
                                            <span style="font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.9);">Tasks</span>
                                            <div id="perf-completed" class="dmc-value" style="font-size: 0.9rem; font-weight: 700; color: #ffffff; margin-top: 2px;">
                                                0 <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">/ 0</span>
                                            </div>
                                        </div>

                                        <!-- Project Circle (Dummy) -->
                                        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                                            <div id="proj-perf-circle" class="dmc-circle" style="
                                                width: 70px;
                                                height: 70px;
                                                border-radius: 50%;
                                                background: conic-gradient(#425f5f 0% 65%, rgba(255,255,255,0.2) 65% 100%);
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                position: relative;
                                                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                                            ">
                                                <div class="dmc-inner-circle" style="
                                                    width: 56px;
                                                    height: 56px;
                                                    background: rgba(255,255,255,0.1);
                                                    border-radius: 50%;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    backdrop-filter: blur(5px);
                                                ">
                                                    <span id="proj-perf-percent" style="font-size: 0.9rem; font-weight: 800; color: #ffffff;">65%</span>
                                                </div>
                                            </div>
                                            <span style="font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.9);">Projects</span>
                                            <div id="proj-perf-completed" class="dmc-value" style="font-size: 0.9rem; font-weight: 700; color: #ffffff; margin-top: 2px;">
                                                13 <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">/ 20</span>
                                            </div>
                                        </div>

                                    </div>


                                </div>

                                <!-- Footer / Badge -->
                                <div style="
                                    background: rgba(255,255,255,0.1);
                                    padding: 8px 10px;
                                    border-radius: 8px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    backdrop-filter: blur(5px);
                                    border: 1px solid rgba(255,255,255,0.1);
                                    margin-top: 15px;
                                ">
                                    <span style="font-size: 0.75rem; color: #ffffff;">Efficiency</span>
                                    <span style="
                                        background: rgba(255,255,255,0.9);
                                        color: #2e605c;
                                        padding: 2px 8px;
                                        border-radius: 8px;
                                        font-size: 0.7rem;
                                        font-weight: 700;
                                    ">Needs Imp.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Calendar Card (Right) -->
                        <div class="reminder-section dashboard-matrix-card" style="
                            flex: 1;
                            background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                            padding: 20px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                            border-radius: 12px;
                            position: relative;
                            overflow: hidden;
                            border: none;
                            color: #ffffff;
                            min-width: 0;
                            display: flex;
                            flex-direction: column;
                        ">
                             <!-- Decorative Circles -->
                            <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                            <!-- Title + Month -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; z-index: 1;">
                                <div style="display: flex; align-items: center;">
                                    <span style="font-size: 1rem; margin-right: 8px; background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; backdrop-filter: blur(5px);">
                                        <i class="fa fa-calendar"></i>
                                    </span>
                                    <h3 id="mini-calendar-title" style="font-size: 1rem; font-weight: 700; margin: 0; color: #ffffff;">Calendar</h3>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <span onclick="frappe.pages['dak_dashboard'].change_calendar_month(-1)" style="cursor: pointer; opacity: 0.7; font-size: 0.8rem; padding: 5px;"><i class="fa fa-chevron-left"></i></span>
                                    <span style="font-size: 0.75rem; font-weight: 600; opacity: 0.9; white-space: nowrap;" id="mini-calendar-month-year">Loading...</span>
                                    <span onclick="frappe.pages['dak_dashboard'].change_calendar_month(1)" style="cursor: pointer; opacity: 0.7; font-size: 0.8rem; padding: 5px;"><i class="fa fa-chevron-right"></i></span>
                                </div>
                            </div>

                            <!-- Calendar Grid -->
                            <div id="mini-calendar-body" style="flex: 1; display: flex; flex-direction: column; gap: 5px; position: relative; z-index: 1;">
                                <!-- Header Row -->
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; opacity: 0.8; font-size: 0.75rem; font-weight: 700;">
                                    <span style="width: 14.28%; text-align: center;">S</span>
                                    <span style="width: 14.28%; text-align: center;">M</span>
                                    <span style="width: 14.28%; text-align: center;">T</span>
                                    <span style="width: 14.28%; text-align: center;">W</span>
                                    <span style="width: 14.28%; text-align: center;">T</span>
                                    <span style="width: 14.28%; text-align: center;">F</span>
                                    <span style="width: 14.28%; text-align: center;">S</span>
                                </div>
                                <!-- Days injected via JS -->
                                <div id="mini-calendar-days" style="display: flex; flex-wrap: wrap; row-gap: 5px;"></div>
                            </div>
                        </div>

                    </div>

                    <!-- Flex Container for Timesheet & Task Summary -->
                    <div style="display: flex; gap: 15px; margin-top: 15px;">
                        
                        <!-- Timesheet Info Card -->
                        <div class="reminder-section dashboard-matrix-card" style="
                            flex: 1;
                            background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                            padding: 10px 20px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                            border-radius: 12px;
                            position: relative;
                            overflow: hidden;
                            border: none;
                            color: #ffffff;
                        ">
                            <!-- Decorative Circles -->
                            <div style="position: absolute; top: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                            <div style="position: relative; z-index: 1;">
                                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <span style="font-size: 1rem; margin-right: 8px; background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; backdrop-filter: blur(5px);">
                                        <i class="fa fa-clock-o"></i>
                                    </span>
                                    <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: #ffffff;">Timesheet Info</h3>
                                </div>
                                
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <div>
                                        <div style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 5px;">Total Logged</div>
                                        <div id="ts-total-hours" style="font-size: 1.8rem; font-weight: 700;">
                                            <div class="skeleton" style="width: 60px; height: 30px; border-radius: 4px; background: rgba(255,255,255,0.2);"></div>
                                        </div>
                                        <div class="active-filter-label" style="font-size: 0.7rem; opacity: 0.6; margin-top: 3px;">All Time</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <button class="btn btn-default btn-sm" onclick="frappe.set_route('dak_timesheet')" style="background: rgba(255,255,255,0.2); color: white; border: none;">
                                            View Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Task Summary Card -->
                        <div class="reminder-section dashboard-matrix-card" style="
                            flex: 1;
                            background: linear-gradient(135deg, #3d807a 0%, #5baaa4 100%);
                            padding: 10px 20px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                            border-radius: 12px;
                            position: relative;
                            overflow: hidden;
                            border: none;
                            color: #ffffff;
                        ">
                            <!-- Decorative Circles -->
                            <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                            <div style="position: relative; z-index: 1;">
                                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <span style="font-size: 1rem; margin-right: 8px; background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; backdrop-filter: blur(5px);">
                                        <i class="fa fa-tasks"></i>
                                    </span>
                                    <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: #ffffff;">Task Summary</h3>
                                </div>
                                <div style="display: flex; justify-content: space-around; text-align: center;">
                                    <div style="cursor: pointer;" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list({'status': 'Open'})" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                                        <div id="summ-open-count" style="font-weight: 700; font-size: 1.5rem;">
                                             <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                        </div>
                                        <div style="opacity: 0.8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">Open</div>
                                    </div>
                                    <div style="border-right: 1px solid rgba(255,255,255,0.2);"></div>
                                    <div style="cursor: pointer;" onclick="frappe.pages['dak_dashboard'].redirect_to_task_list({'status': 'Completed'})" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                                        <div id="summ-completed-count" style="font-weight: 700; font-size: 1.5rem;">
                                            <div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>
                                        </div>
                                        <div style="opacity: 0.8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">Done</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                </div>
            </div>

            <!-- Renamed Clean Task Card Section (Moved here) -->
            <!-- Dynamic Task Cards Container -->


		<div class="dashboard-content" style="padding: 0;">

			<!-- Stats Row Moved Up -->

			<div class="flex-grid-container" style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">



			</div>
		</div>










        <!-- Drawer Markup -->
        <div class="task-drawer-overlay" onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)"></div>
        <div class="task-drawer" id="task-drawer">
            <div class="drawer-header">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <h4 style="color: white; margin: 0; font-weight: 700; font-size: 1.5rem;">Create New Task</h4>
                        <p style="margin: 5px 0 0; opacity: 0.8; font-size: 0.9rem; color: rgba(255,255,255,0.9);">Fill in the details below</p>
                    </div>
                    <span onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)" style="cursor: pointer; opacity: 0.8; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%;">&times;</span>
                </div>
                <!-- Progress Bar Container -->
                <div style="background: rgba(255,255,255,0.15); height: 6px; border-radius: 3px; position: relative; overflow: hidden; margin-bottom: 8px;">
                    <div id="drawer-progress-bar" style="background: #ffffff; height: 100%; width: 25%; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: rgba(255,255,255,0.8); font-weight: 600;">
                    <span id="drawer-progress-label">General Info</span>
                    <span id="drawer-step-indicator">Step 1 of 4</span>
                </div>
            </div>

            <div class="drawer-body">
                <!-- Step 1: Customer & Project -->
                <div id="drawer-step-1">
                    <label class="vibrant-label">Customer</label>
                    <div id="ctrl-customer" class="vibrant-link-field" style="margin-bottom: 20px;"></div>
                    
                    <label class="vibrant-label">Project</label>
                    <div id="ctrl-project" class="vibrant-link-field" style="margin-bottom: 20px;"></div>
                </div>


                <!-- Step 2: Task Details -->
                <div id="drawer-step-2" style="display: none;">
                    <label class="vibrant-label">Subject</label>
                    <input type="text" class="vibrant-input" id="drawer-subject" placeholder="Enter task subject">

                    <div class="row">
                         <div class="col-md-6" style="padding-left: 0; padding-right: 10px;">
                            <label class="vibrant-label">Status</label>
                            <select class="vibrant-input" id="drawer-status">
                                <option value="Open">Open</option>
                                <option value="Working">Working</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div class="col-md-6" style="padding-left: 10px; padding-right: 0;">
                             <label class="vibrant-label">Priority</label>
                            <select class="vibrant-input" id="drawer-priority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                     <div class="row" style="margin-top: 15px;">
                        <div class="col-md-6" style="padding-left: 0; padding-right: 10px;">
                            <label class="vibrant-label">Start Date</label>
                            <input type="date" class="vibrant-input" id="drawer-start-date">
                        </div>
                        <div class="col-md-6" style="padding-left: 10px; padding-right: 0;">
                            <label class="vibrant-label">Due Date</label>
                            <input type="date" class="vibrant-input" id="drawer-date">
                        </div>
                    </div>

                    <div class="row" style="margin-top: 15px;">
                        <div class="col-md-6" style="padding-left: 0; padding-right: 10px;">
                            <label class="vibrant-label">Mode of Source</label>
                            <select class="vibrant-input" id="drawer-source">
                                <option value="">Select Mode</option>
                                <option value="Letter">Letter</option>
                                <option value="Email">Email</option>
                                <option value="DO Letter">DO Letter</option>
                                <option value="Mobile">Mobile</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Verbal">Verbal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6" style="padding-left: 10px; padding-right: 0;">
                            <label class="vibrant-label">Exp. Time (Hrs)</label>
                            <input type="number" step="0.5" class="vibrant-input" id="drawer-expected-time" placeholder="0.0">
                        </div>
                    </div>
                </div>

                <!-- Step 3: Dependencies & Assignment -->
                <div id="drawer-step-3" style="display: none;">
                    <label class="vibrant-label">Dependent Task</label>
                    <div id="ctrl-dependency" class="vibrant-link-field" style="margin-bottom: 20px;"></div>

                    <label class="vibrant-label">Assigned To</label>
                    <div id="ctrl-assigned" class="vibrant-link-field" style="margin-bottom: 20px;"></div>

                    <label class="vibrant-label">Share With</label>
                    <div id="ctrl-share-with" class="vibrant-link-field" style="margin-bottom: 20px;"></div>
                </div>

                <!-- Step 4: Description -->
                <div id="drawer-step-4" style="display: none;">
                    <label class="vibrant-label">Description</label>
                    <textarea class="vibrant-input" id="drawer-description" rows="10" placeholder="Add detailed task notes here..." style="min-height: 200px;"></textarea>
                </div>
            </div>

            <div class="drawer-footer">
                <!-- Footer Step 1 -->
                <div id="drawer-footer-step-1" style="display: flex; justify-content: flex-end;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)" style="margin-right: 10px; border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;">Cancel</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].drawer_next_step(2)" style="background: linear-gradient(135deg, #2e605c 0%, #468e88 100%); border: none; box-shadow: 0 4px 6px -1px rgba(46, 96, 92, 0.3); padding: 8px 20px; font-weight: 600;">Next <i class="fa fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>

                <!-- Footer Step 2 -->
                <div id="drawer-footer-step-2" style="display: none; justify-content: space-between;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].drawer_prev_step(1)" style="border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;"><i class="fa fa-arrow-left" style="margin-right: 5px;"></i> Back</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].drawer_next_step(3)" style="background: linear-gradient(135deg, #2e605c 0%, #468e88 100%); border: none; box-shadow: 0 4px 6px -1px rgba(46, 96, 92, 0.3); padding: 8px 20px; font-weight: 600;">Next <i class="fa fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>

                <!-- Footer Step 3 -->
                <div id="drawer-footer-step-3" style="display: none; justify-content: space-between;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].drawer_prev_step(2)" style="border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;"><i class="fa fa-arrow-left" style="margin-right: 5px;"></i> Back</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].drawer_next_step(4)" style="background: linear-gradient(135deg, #2e605c 0%, #468e88 100%); border: none; box-shadow: 0 4px 6px -1px rgba(46, 96, 92, 0.3); padding: 8px 20px; font-weight: 600;">Next <i class="fa fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>

                <!-- Footer Step 4 -->
                <div id="drawer-footer-step-4" style="display: none; justify-content: space-between;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].drawer_prev_step(3)" style="border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;"><i class="fa fa-arrow-left" style="margin-right: 5px;"></i> Back</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].create_task_from_drawer()" style="background: linear-gradient(135deg, #2e605c 0%, #468e88 100%); border: none; box-shadow: 0 4px 6px -1px rgba(46, 96, 92, 0.3); padding: 8px 20px; font-weight: 600;">Create Task</button>
                </div>
            </div>
        </div>

        <!-- Task Details Drawer -->
        <div class="task-drawer-overlay" id="details-overlay" onclick="frappe.pages['dak_dashboard'].toggle_details_drawer(false)"></div>
        <div class="task-drawer" id="task-details-drawer">
            <div class="drawer-header" style="background: linear-gradient(135deg, #2e605c 0%, #468e88 100%);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="padding-right: 20px;">
                        <span id="detail-project" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; color: rgba(255,255,255,0.8); display: block; margin-bottom: 5px;">Project Name</span>
                        <h4 id="detail-subject" style="color: white; margin: 0; font-weight: 700; font-size: 1.3rem; line-height: 1.4;">Task Subject</h4>
                    </div>
                    <span onclick="frappe.pages['dak_dashboard'].toggle_details_drawer(false)" style="cursor: pointer; opacity: 0.8; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%; flex-shrink: 0;">&times;</span>
                </div>
            </div>

            <div class="drawer-body" style="padding: 25px;">
                <div style="display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap;">
                    <span id="detail-status" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb;">Status</span>
                    <span id="detail-priority" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb;">Priority</span>
                    <span id="detail-date" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb;"><i class="fa fa-calendar"></i> Date</span>
                </div>

                <div style="margin-bottom: 25px;">
                    <label class="vibrant-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Time</label>
                    <div style="font-size: 1.1rem; font-weight: 500; color: #111827;">
                        <span id="detail-exp-time">0</span> Hrs
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label class="vibrant-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Description</label>
                    <div id="detail-description" style="font-size: 1rem; line-height: 1.6; color: #374151; white-space: pre-wrap;">No description provided.</div>
                </div>

                 <div style="margin-bottom: 25px;">
                    <label class="vibrant-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Assigned To</label>
                    <div id="detail-assigned" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
                </div>
            </div>

            <div class="drawer-footer" style="padding: 20px 25px;">
                <button class="btn btn-primary" id="btn-view-full-task" style="width: 100%; background: linear-gradient(135deg, #2e605c 0%, #468e88 100%); border: none; padding: 10px; font-weight: 600;">View Full Task</button>
            </div>
        </div>
        </div>
	`);

	// Initialize Drawer Controls
	frappe.pages["dak_dashboard"].setup_drawer_controls();

	// Fetch Stats on Load
	frappe.pages["dak_dashboard"].refresh_stats();
	frappe.pages["dak_dashboard"].render_mini_calendar();

	// Add input listeners for real-time progress
	$(wrapper).on("input change", ".vibrant-input", function () {
		frappe.pages["dak_dashboard"].update_drawer_progress();
	});

	// Event Listeners
	$(wrapper).on("click", ".view-task-btn", function () {
		frappe.pages["dak_dashboard"].toggle_reminder_drawer(true);
	});

	$(wrapper).on("click", ".close-reminder-drawer", function () {
		frappe.pages["dak_dashboard"].toggle_reminder_drawer(false);
	});
};

frappe.pages["dak_dashboard"].toggle_task_drawer = function (show) {
	if (show) {
		// Reset to Step 1
		$("#drawer-step-1").show();
		$("#drawer-step-2").hide();
		$("#drawer-step-3").hide();
		$("#drawer-step-4").hide();

		$("#drawer-footer-step-1").css("display", "flex");
		$("#drawer-footer-step-2").hide();
		$("#drawer-footer-step-3").hide();
		$("#drawer-footer-step-4").hide();

		frappe.pages["dak_dashboard"].current_drawer_step = 1;
		frappe.pages["dak_dashboard"].update_drawer_progress(1);

		$(".task-drawer-overlay").fadeIn(200);
		setTimeout(() => $("#task-drawer").addClass("open"), 10);
	} else {
		$("#task-drawer").removeClass("open");
		setTimeout(() => $(".task-drawer-overlay").fadeOut(200), 200);
	}
};

frappe.pages["dak_dashboard"].update_drawer_progress = function (step) {
	if (step) frappe.pages["dak_dashboard"].current_drawer_step = step;
	let currentStep = frappe.pages["dak_dashboard"].current_drawer_step || 1;

	let basePercent = (currentStep - 1) * 25;
	let additivePercent = 0;

	// Calculate field completion for current step
	if (currentStep === 1) {
		let fields = [
			frappe.pages["dak_dashboard"].controls.customer?.get_value(),
			frappe.pages["dak_dashboard"].controls.project?.get_value()
		];
		let filled = fields.filter(v => v).length;
		additivePercent = (filled / fields.length) * 25;
	} else if (currentStep === 2) {
		let fields = [
			$("#drawer-subject").val(),
			$("#drawer-status").val(),
			$("#drawer-priority").val(),
			$("#drawer-start-date").val(),
			$("#drawer-date").val(),
			$("#drawer-source").val(),
			$("#drawer-expected-time").val()
		];
		let filled = fields.filter(v => v).length;
		additivePercent = (filled / fields.length) * 25;
	} else if (currentStep === 3) {
		let fields = [
			frappe.pages["dak_dashboard"].controls.dependency?.get_value(),
			frappe.pages["dak_dashboard"].controls.assigned_to?.get_value(),
			frappe.pages["dak_dashboard"].controls.share_with?.get_value()
		];
		let filled = fields.filter(v => v).length;
		additivePercent = (filled / fields.length) * 25;
	} else if (currentStep === 4) {
		let hasDesc = $("#drawer-description").val() ? 1 : 0;
		additivePercent = hasDesc * 25;
	}

	let percent = basePercent + additivePercent;
	let labels = {
		1: "General Info",
		2: "Task Details",
		3: "Assignment",
		4: "Description"
	};
	$("#drawer-progress-bar").css("width", percent + "%");
	$("#drawer-progress-label").text(labels[currentStep] || "");
	$("#drawer-step-indicator").text("Step " + currentStep + " of 4");
};

frappe.pages["dak_dashboard"].drawer_next_step = function (targetStep) {
	if (!targetStep) targetStep = 2;

	// Current Step Validation
	if (targetStep === 2) {
		// Moving from 1 to 2
		// Optional: Validate Customer/Project if mandatory
	}
	if (targetStep === 3) {
		// Moving from 2 to 3
		let subject = $("#drawer-subject").val();
		if (!subject) {
			frappe.msgprint(__("Subject is required"));
			return;
		}
	}

	// Hide All
	$('[id^="drawer-step-"]').hide();
	$('[id^="drawer-footer-step-"]').hide();

	// Show Target
	$("#drawer-step-" + targetStep).fadeIn(200);
	$("#drawer-footer-step-" + targetStep).css("display", "flex");

	frappe.pages["dak_dashboard"].update_drawer_progress(targetStep);
};

frappe.pages["dak_dashboard"].drawer_prev_step = function (targetStep) {
	if (!targetStep) targetStep = 1;

	// Hide All
	$('[id^="drawer-step-"]').hide();
	$('[id^="drawer-footer-step-"]').hide();

	// Show Target
	$("#drawer-step-" + targetStep).fadeIn(200);
	$("#drawer-footer-step-" + targetStep).css("display", "flex");

	frappe.pages["dak_dashboard"].update_drawer_progress(targetStep);
};

frappe.pages["dak_dashboard"].setup_drawer_controls = function () {
	let page = frappe.pages["dak_dashboard"];
	page.controls = {};

	// Customer
	page.controls.customer = frappe.ui.form.make_control({
		parent: $("#ctrl-customer"),
		df: {
			fieldtype: "Link",
			options: "Customer",
			fieldname: "customer",
			placeholder: "Select Customer",
			only_select: true,
			change: () => page.update_drawer_progress()
		},
		render_input: true,
	});

	// Project
	page.controls.project = frappe.ui.form.make_control({
		parent: $("#ctrl-project"),
		df: {
			fieldtype: "Link",
			options: "Project",
			fieldname: "project",
			placeholder: "Select Project",
			only_select: true,
			change: () => page.update_drawer_progress()
		},
		render_input: true,
	});

	// Dependent Task
	page.controls.dependency = frappe.ui.form.make_control({
		parent: $("#ctrl-dependency"),
		df: {
			fieldtype: "Link",
			options: "Task",
			fieldname: "depends_on",
			placeholder: "Select Dependent Task",
			only_select: true,
			change: () => page.update_drawer_progress()
		},
		render_input: true,
	});

	// Assigned To
	page.controls.assigned_to = frappe.ui.form.make_control({
		parent: $("#ctrl-assigned"),
		df: {
			fieldtype: "Link",
			options: "User",
			fieldname: "assigned_to",
			placeholder: "Assign to User",
			only_select: true,
			change: () => page.update_drawer_progress()
		},
		render_input: true,
	});

	// Share With
	page.controls.share_with = frappe.ui.form.make_control({
		parent: $("#ctrl-share-with"),
		df: {
			fieldtype: "Link",
			options: "User",
			fieldname: "share_with",
			placeholder: "Share with User",
			only_select: true,
			change: () => page.update_drawer_progress()
		},
		render_input: true,
	});
};

frappe.pages["dak_dashboard"].create_task_from_drawer = function () {
	let page = frappe.pages["dak_dashboard"];

	// Step 1 Data
	let customer = page.controls.customer.get_value();
	let project = page.controls.project.get_value();

	// Step 2 Data
	let subject = $("#drawer-subject").val();
	let status = $("#drawer-status").val();
	let priority = $("#drawer-priority").val();
	let start_date = $("#drawer-start-date").val();
	let date = $("#drawer-date").val();
	let source = $("#drawer-source").val();
	let expected_time = $("#drawer-expected-time").val();

	// Step 3 Data
	let depends_on = page.controls.dependency.get_value();
	let assigned_to = page.controls.assigned_to.get_value();
	let share_with = page.controls.share_with.get_value();
	let description = $("#drawer-description").val(); // Moved to step 3

	if (!subject) {
		frappe.msgprint(__("Subject is required"));
		return;
	}

	// Construct Doc Object safely
	let task_doc = {
		doctype: "Task",
		subject: subject,
		status: status,
		priority: priority,
		exp_start_date: start_date,
		exp_end_date: date,
		custom_source_of_task: source,
		description: description,
		expected_time: expected_time ? parseFloat(expected_time) : 0,
	};

	// Add Link fields only if present to handle potential validation issues or strict schemas
	if (project) task_doc.project = project;
	if (customer) task_doc.customer = customer;
	if (depends_on) task_doc.depends_on = depends_on; // Assuming Link type, not Table

	// Auto-assign to session user if not selected
	if (!assigned_to) assigned_to = frappe.session.user;
	task_doc._assign = JSON.stringify([assigned_to]);

	frappe.call({
		method: "frappe.client.insert",
		args: {
			doc: task_doc,
		},
		callback: function (r) {
			if (!r.exc && r.message) {
				let task = r.message;

				// Handle Sharing if Share With is provided
				if (share_with) {
					frappe.call({
						method: "frappe.share.add",
						args: {
							doctype: "Task",
							name: task.name,
							user: share_with,
							read: 1,
							write: 1,
							share: 1,
						},
						callback: function (res) {
							frappe.show_alert({
								message: `Task Created & Shared with ${share_with}`,
								indicator: "green",
							});
						},
					});
				} else {
					frappe.show_alert({
						message: "Task Created successfully",
						indicator: "green",
					});
				}

				frappe.pages["dak_dashboard"].toggle_task_drawer(false);

				// Clear Fields
				$("#drawer-subject").val("");
				$("#drawer-description").val("");
				$("#drawer-date").val("");
				$("#drawer-expected-time").val("");

				// Reset Controls (safe check)
				if (page.controls && page.controls.customer) page.controls.customer.set_value("");
				if (page.controls && page.controls.project) page.controls.project.set_value("");
				if (page.controls && page.controls.dependency)
					page.controls.dependency.set_value("");
				if (page.controls && page.controls.assigned_to)
					page.controls.assigned_to.set_value("");
				if (page.controls && page.controls.share_with)
					page.controls.share_with.set_value("");

				// Refresh Dashboard
				frappe.pages["dak_dashboard"].refresh_stats();

				// Reset Drawer to Step 1
				$('[id^="drawer-step-"]').hide();
				$('[id^="drawer-footer-step-"]').hide();
				$("#drawer-step-1").show();
				$("#drawer-footer-step-1").css("display", "flex");
			}
		},
	});
};

frappe.pages["dak_dashboard"].toggle_skeletons = function (show) {
	if (show) {
		// Stats
		$("#total-tasks-count").html(
			'<div class="skeleton" style="height: 2.5rem; width: 40px; border-radius: 4px; display:inline-block;"></div>'
		);
		$("#total-tasks-frappe-card").html(
			'<div class="skeleton" style="height: 2.5rem; width: 40px; border-radius: 4px; display:inline-block;"></div>'
		);
		$("#high-priority-count").html(
			'<div class="skeleton" style="height: 2rem; width: 30px; border-radius: 4px; display:inline-block;"></div>'
		);
		$("#overdue-tasks-count").html(
			'<div class="skeleton" style="height: 2rem; width: 30px; border-radius: 4px; display:inline-block;"></div>'
		);
		$("#pending-review-count").html(
			'<div class="skeleton" style="height: 2rem; width: 30px; border-radius: 4px; display:inline-block;"></div>'
		);

		// Matrix (Tasks)
		$("#perf-percent").html(
			'<div class="skeleton" style="height: 1rem; width: 30px; border-radius: 4px;"></div>'
		);
		$("#perf-completed").html(
			'<div class="skeleton" style="height: 0.8rem; width: 50px; border-radius: 4px; margin-top: 2px;"></div>'
		);

		// Matrix (Projects)
		$("#proj-perf-percent").html(
			'<div class="skeleton" style="height: 1rem; width: 30px; border-radius: 4px;"></div>'
		);
		$("#proj-perf-completed").html(
			'<div class="skeleton" style="height: 0.8rem; width: 50px; border-radius: 4px; margin-top: 2px;"></div>'
		);

		// Timesheet Info
		$("#ts-total-hours").html(
			'<div class="skeleton" style="width: 60px; height: 30px; border-radius: 4px; background: rgba(255,255,255,0.2);"></div>'
		);

		// Task Summary Card
		$("#summ-open-count").html(
			'<div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>'
		);
		$("#summ-completed-count").html(
			'<div class="skeleton" style="width: 30px; height: 24px; border-radius: 4px; display: inline-block;"></div>'
		);

		// Active Task Card
		let cardSkeleton = `
        <div class="decorative-sphere-card" style="opacity: 0.9; cursor: default;">
            <div class="card-content" style="flex: 2; padding-right: 20px; border-right: 1px solid rgba(255,255,255,0.1);">
                <div class="skeleton" style="height: 24px; width: 60%; margin-bottom: 15px; background: rgba(255,255,255,0.2);"></div>
                <div class="skeleton" style="height: 14px; width: 80%; margin-bottom: 8px; background: rgba(255,255,255,0.1);"></div>
                <div class="skeleton" style="height: 14px; width: 40%; background: rgba(255,255,255,0.1);"></div>
                <div class="sphere-meta" style="margin-top: 20px;">
                        <div class="skeleton" style="height: 20px; width: 50px; border-radius: 12px; background: rgba(255,255,255,0.15);"></div>
                        <div class="skeleton" style="height: 20px; width: 50px; border-radius: 12px; background: rgba(255,255,255,0.15);"></div>
                </div>
            </div>
            <div style="flex: 1; padding: 0 25px;">
                 <div class="skeleton" style="height: 40px; width: 100%; border-radius: 4px; background: rgba(255,255,255,0.1);"></div>
            </div>
            <div class="sphere-wrapper" style="flex: 1; border-left: 1px solid rgba(255,255,255,0.1);">
                    <div class="skeleton" style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
            </div>
        </div>
        `;
		$("#task-cards-container").html(cardSkeleton);

		// Recent Activity
		let activitySkeleton = "";
		for (let i = 0; i < 3; i++) {
			activitySkeleton += `
				<div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px;">
					<div class="skeleton skeleton-dark" style="width: 8px; height: 8px; border-radius: 50%;"></div>
					<div style="display: flex; flex-direction: column; flex: 1;">
						<div class="skeleton skeleton-dark" style="height: 14px; width: 120px; margin-bottom: 4px;"></div>
						<div class="skeleton skeleton-dark" style="height: 10px; width: 40px;"></div>
					</div>
					<div class="skeleton skeleton-dark" style="height: 10px; width: 60px;"></div>
				</div>
			`;
		}
		$("#recent-activity-container").html(activitySkeleton);
	}
};

frappe.pages["dak_dashboard"].refresh_stats = function (timespan, show_message = false) {
	if (!timespan) timespan = frappe.pages["dak_dashboard"].current_filter || "All Time";
	frappe.pages["dak_dashboard"].current_filter = timespan;

	if (show_message) {
		frappe.show_alert(
			{
				message: __("Time Filter: ") + timespan,
				indicator: "blue",
			},
			3
		);
	}

	// Update UI Labels for filters
	$(".active-filter-label").text(timespan);

	// Show Skeletons
	frappe.pages["dak_dashboard"].toggle_skeletons(true);

	// Refresh Recent Activity
	if (frappe.pages["dak_dashboard"].update_recent_activity) {
		frappe.pages["dak_dashboard"].update_recent_activity();
	}

	frappe.call({
		method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_task_counts",
		args: { timespan: timespan },
		callback: function (r) {
			if (r.message) {
				$("#total-tasks-count").text(r.message.total_tasks);

				// Show High Priority count specifically
				$("#high-priority-count").text(r.message.high_priority);

				$("#overdue-tasks-count").text(r.message.overdue_tasks);
				$("#pending-review-count").text(r.message.pending_review_tasks);

				// Update Performance Matrix (Tasks)
				let total = r.message.total_tasks || 0;
				let completed = r.message.completed_tasks || 0;
				let percent = total > 0 ? Math.round((completed / total) * 100) : 0;

				$("#perf-percent").text(percent + "%");
				$("#perf-completed").html(
					`${completed} <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">/ ${total}</span>`
				);
				$("#perf-circle").css(
					"background",
					`conic-gradient(#425f5f 0% ${percent}%, rgba(255, 255, 255, 0.2) ${percent}% 100%)`
				);

				// Update Performance Matrix (Projects)
				let total_proj = r.message.total_projects || 0;
				let completed_proj = r.message.completed_projects || 0;
				// Update Timesheet Hours
				$("#ts-total-hours").text(r.message.total_hours || "0.0");

				// Update Task Summary Card
				$("#summ-open-count").text(r.message.open_tasks || 0);
				$("#summ-completed-count").text(r.message.completed_tasks || 0);
				let percent_proj =
					total_proj > 0 ? Math.round((completed_proj / total_proj) * 100) : 0;

				$("#proj-perf-percent").text(percent_proj + "%");
				$("#proj-perf-completed").html(
					`${completed_proj} <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">/ ${total_proj}</span>`
				);
				$("#proj-perf-circle").css(
					"background",
					`conic-gradient(#425f5f 0% ${percent_proj}%, rgba(255, 255, 255, 0.2) ${percent_proj}% 100%)`
				);
			}
		},
	});

	// Fetch Latest Tasks for Task Cards Container
	frappe.call({
		method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_latest_task",
		callback: function (r) {
			let container = $("#task-cards-container");
			container.empty();

			if (r.message && r.message.length > 0) {
				let tasks = r.message;
				if (!Array.isArray(tasks)) tasks = [tasks];

				// Find Active Task (Working Now) or default to first
				let activeTask = tasks.find((t) => t.custom_working_now == 1);
				if (!activeTask) activeTask = tasks[0];

				let task = activeTask;

				// SYNCHRONIZE TIMER STATE
				// 1. If local timer is running for a DIFFERENT task, stop it locally (backend has handled the switch)
				if (frappe.pages["dak_dashboard"].timer.running && frappe.pages["dak_dashboard"].timer.task_name !== task.name) {
					console.log("Stopping stale local timer for:", frappe.pages["dak_dashboard"].timer.task_name);
					if (frappe.pages["dak_dashboard"].timer.interval) {
						clearInterval(frappe.pages["dak_dashboard"].timer.interval);
					}
					frappe.pages["dak_dashboard"].timer = {
						running: false,
						task_name: null,
						start_time: null,
						timesheet: null,
						activity: null,
						interval: null
					};
				}

				// 2. RESTORE TIMER STATE FROM BACKEND IF NEEDED (for current task)
				if (task.custom_working_now == 1 && task.running_timer_info) {
					// Update regardless of local running state to ensure sync
					console.log("Syncing timer from backend state", task.running_timer_info);
					frappe.pages["dak_dashboard"].timer = {
						running: true,
						task_name: task.name,
						start_time: task.running_timer_info.start_time,
						timesheet: task.running_timer_info.timesheet,
						activity: task.running_timer_info.activity,
						interval: null // Will be started below
					};
				}

				// Check Timer State
				let is_running =
					frappe.pages["dak_dashboard"].timer.running &&
					frappe.pages["dak_dashboard"].timer.task_name === task.name;

				// Resume interval if running
				if (is_running && !frappe.pages["dak_dashboard"].timer.interval) {
					frappe.pages["dak_dashboard"].start_clock_interval();
				}

				let action_btn_html = "";
				if (is_running) {
					action_btn_html = `
                        <button class="sphere-icon-btn btn-stop-icon" onclick="frappe.pages['dak_dashboard'].stop_timer_action('${task.name}')" title="Stop Timer">
                            <i class="fa fa-stop"></i>
                        </button>
                    `;
				} else {
					action_btn_html = `
                        <button class="sphere-icon-btn btn-play-icon" onclick="frappe.pages['dak_dashboard'].start_timer_action('${task.name}')" title="Start Timer">
                            <i class="fa fa-play"></i>
                        </button>
                    `;
				}

				// Prepare Badges
				let priority_badge = `<span class="sphere-badge-pill" style="border-color: ${task.priority === "High" ? "#ef5350" : "#ffa726"
					}">${task.priority}</span>`;
				let status_badge = `<span class="sphere-badge-pill">${task.status}</span>`;

				// Prepare Time Data
				let exp_time = parseFloat(task.expected_time || 0).toFixed(1);
				let act_time = parseFloat(task.actual_time || 0).toFixed(1);
				let max_time = Math.max(parseFloat(exp_time), parseFloat(act_time));
				if (max_time === 0) max_time = 1; // Prevent division by zero

				let exp_width = (parseFloat(exp_time) / max_time) * 100;
				let act_width = (parseFloat(act_time) / max_time) * 100;

				let cardHtml = `
                <div class="decorative-sphere-card" style="cursor: pointer; padding: 25px 30px; gap: 0;" onclick="frappe.pages['dak_dashboard'].show_task_details('${task.name
					}')">

                    <!-- Part 1: Details (Flex 2) -->
                    <div class="card-content" style="flex: 2; padding-right: 20px; border-right: 1px solid rgba(255,255,255,0.1);">
                        <h3 onclick="event.stopPropagation(); frappe.pages['dak_dashboard'].show_task_details('${task.name
					}')" style="margin-top: 0;">${task.subject}</h3>
                        <p style="margin-bottom: 15px; opacity: 0.8;">${task.description ||
					task.name +
					" - " +
					(task.exp_end_date
						? frappe.datetime.str_to_user(task.exp_end_date)
						: "No Due Date")
					}</p>
                        <div class="sphere-meta">
                            ${priority_badge}
                            ${status_badge}
                            <span class="sphere-badge-pill" style="border:none; opacity:0.8;">
                                <i class="fa fa-calendar" style="margin-right:5px;"></i> ${task.exp_end_date
						? frappe.datetime.str_to_user(task.exp_end_date)
						: "No Date"
					}
                            </span>
                        </div>
                    </div>

                    <!-- Part 2: Mock Graph (Flex 1) -->
                    <div style="flex: 1; padding: 0 25px; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: rgba(255,255,255,0.8); margin-bottom: 5px;">
                                <span>Expected</span>
                                <span>${exp_time}h</span>
                            </div>
                            <div style="height: 6px; background: rgba(0,0,0,0.2); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${exp_width}%; background: rgba(255,255,255,0.9); height: 100%; border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: rgba(255,255,255,0.8); margin-bottom: 5px;">
                                <span>Actual</span>
                                <span>${act_time}h</span>
                            </div>
                            <div style="height: 6px; background: rgba(0,0,0,0.2); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${act_width}%; background: #a7f3d0; height: 100%; border-radius: 3px;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Part 3: Sphere Clock (Flex 1) -->
                    <div class="sphere-wrapper" onclick="event.stopPropagation()" style="flex: 1; border-left: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                        <div class="sphere-3d">
                            <div class="ring ring-1"></div>
                            <div class="ring ring-2"></div>
                            <div class="ring ring-3"></div>
                            <div class="sphere-core">
                                <span class="time-display" id="sphere-time-display">00:00:00</span>
                            </div>
                        </div>
                         <div class="sphere-internal-controls" style="position: absolute; transform: translate(10px, 20px);">
                            ${action_btn_html}
                        </div>
                    </div>
                </div>
                `;
				container.html(cardHtml);
			} else {
				container.html(
					'<div class="alert alert-info">No active tasks found. <a href="#" onclick="frappe.pages[\'dak_dashboard\'].toggle_task_drawer(true)">Create one now</a>.</div>'
				);
			}
		},
	});
};


// --- Timer State ---
frappe.pages["dak_dashboard"].timer = {
	running: false,
	task_name: null,
	start_time: null,
	timesheet: null,
	activity: null,
	interval: null,
};

// --- Timer Helper Functions ---

frappe.pages["dak_dashboard"].start_clock_interval = function () {
	if (frappe.pages["dak_dashboard"].timer.interval)
		clearInterval(frappe.pages["dak_dashboard"].timer.interval);

	frappe.pages["dak_dashboard"].timer.interval = setInterval(function () {
		let timer = frappe.pages["dak_dashboard"].timer;
		if (!timer.running || !timer.start_time) return;

		let now = moment();
		let start = moment(timer.start_time);
		let duration = moment.duration(now.diff(start));

		let hours = Math.floor(duration.asHours());
		let mins = duration.minutes();
		let secs = duration.seconds();

		let formatted =
			(hours < 10 ? "0" + hours : hours) +
			":" +
			(mins < 10 ? "0" + mins : mins) +
			":" +
			(secs < 10 ? "0" + secs : secs);

		$("#sphere-time-display").text(formatted);

		let totalMins = Math.floor(duration.asMinutes());
		$("#minuteBadge")
			.text(totalMins + "m")
			.css("display", "flex");
	}, 1000);
};

frappe.pages["dak_dashboard"].stop_timer_internal = function (task_name, callback) {
	let timer = frappe.pages["dak_dashboard"].timer;
	if (!timer.running || timer.task_name !== task_name) {
		if (callback) callback();
		return;
	}

	let end_time = frappe.datetime.now_datetime();
	let start_moment = moment(timer.start_time);
	let end_moment = moment(end_time);
	let duration_hours = moment.duration(end_moment.diff(start_moment)).asHours();

	// Clear Interval
	if (timer.interval) {
		clearInterval(timer.interval);
		timer.interval = null;
	}

	// Ensure at least some time is logged (e.g. 0.01)
	if (duration_hours < 0.01) duration_hours = 0.01;

	// First stop the task status on backend
	frappe.call({
		method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.stop_working_task",
		args: { task_name: task_name },
		callback: function () {
			frappe.call({
				method: "frappe.client.get",
				args: { doctype: "Timesheet", name: timer.timesheet },
				callback: function (r) {
					if (r.message) {
						let ts = r.message;
						if (ts.time_logs && ts.time_logs.length > 0) {
							// Update the first log (since we created it fresh)
							ts.time_logs[0].hours = duration_hours;
							ts.time_logs[0].to_time = end_time;

							// Save
							frappe.call({
								method: "frappe.client.save",
								args: { doc: ts },
								callback: function (save_r) {
									if (!save_r.exc) {
										frappe.show_alert({
											message: `Timer Stopped. Logged ${duration_hours.toFixed(2)} hrs.`,
											indicator: "blue",
										});

										// Reset State
										frappe.pages["dak_dashboard"].timer = {
											running: false,
											task_name: null,
											start_time: null,
											timesheet: null,
											activity: null,
											interval: null,
										};

										if (callback) callback();
									}
								},
							});
						}
					}
				},
			});
		},
	});
};

frappe.pages["dak_dashboard"].start_timer_action = function (task_name) {
	let timer = frappe.pages["dak_dashboard"].timer;

	let proceed_start = function () {
		// Prompt for Activity Type
		frappe.prompt(
			[
				{
					label: "Activity Type",
					fieldname: "activity_type",
					fieldtype: "Link",
					options: "Activity Type",
					reqd: 1,
				},
			],
			(values) => {
				let activity = values.activity_type;
				let start_time = frappe.datetime.now_datetime();

				// Create Timesheet (Draft)
				frappe.call({
					method: "frappe.client.insert",
					args: {
						doc: {
							doctype: "Timesheet",
							note: "Timer started from Dashboard",
							time_logs: [
								{
									from_time: start_time,
									activity_type: activity,
									task: task_name,
									// hours is 0 initially, will be updated on stop
								},
							],
						},
					},
					callback: function (r) {
						if (!r.exc && r.message) {
							// Update State
							frappe.pages["dak_dashboard"].timer = {
								running: true,
								task_name: task_name,
								start_time: start_time,
								timesheet: r.message.name,
								activity: activity,
								interval: null,
							};

							frappe.show_alert({
								message: `Timer Started for ${activity}`,
								indicator: "green",
							});
							frappe.pages["dak_dashboard"].start_clock_interval();

							// Update Task 'Working Now' Status on Backend
							frappe.call({
								method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.set_working_task",
								args: { task_name: task_name },
								callback: function () {
									// Re-render to show Stop button and update Active Task Card
									frappe.pages["dak_dashboard"].refresh_stats();
								},
							});
						}
					},
				});
			},
			"Start Timer",
			"Start"
		);
	};

	if (timer.running) {
		if (timer.task_name === task_name) return; // Already running for this task

		// Stop currently running timer first
		frappe.pages["dak_dashboard"].stop_timer_internal(timer.task_name, function () {
			proceed_start(); // Start new timer after stopping old one
		});
	} else {
		proceed_start();
	}
};

frappe.pages["dak_dashboard"].stop_timer_action = function (task_name) {
	frappe.pages["dak_dashboard"].stop_timer_internal(task_name, function () {
		// Re-render
		frappe.pages["dak_dashboard"].refresh_stats();
	});
};

frappe.pages["dak_dashboard"].update_recent_activity = function () {
	frappe.call({
		method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_recent_activity",
		callback: function (r) {
			let container = $("#recent-activity-container");
			let html = "";

			if (r.message && r.message.length > 0) {
				r.message.forEach(item => {
					let iconColor = item.type === 'Task' ? '#a7f3d0' : '#fde047';
					// Use specific detail view functions or fallback to route
					let clickAction = "";

					if (item.type === 'Task') {
						clickAction = `frappe.pages['dak_dashboard'].show_task_details('${item.name}')`;
					} else {
						clickAction = `frappe.pages['dak_dashboard'].show_project_details('${item.name}')`;
					}

					html += `
					<div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s;" onclick="${clickAction}" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
						<div style="width: 8px; height: 8px; background: ${iconColor}; border-radius: 50%;"></div>
						<div style="display: flex; flex-direction: column; flex: 1;">
							<span style="font-size: 0.9rem; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; font-weight: 500;">${item.title}</span>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<span style="font-size: 0.7rem; opacity: 0.6; text-transform: uppercase;">${item.name}</span>
							</div>
						</div>
						<span style="margin-left: auto; font-size: 0.75rem; opacity: 0.7;">${frappe.datetime.comment_when(item.time)}</span>
					</div>
					`;
				});
			} else {
				html = `<div style="text-align: center; font-size: 0.8rem; opacity: 0.7; padding: 10px; font-style: italic;">No recent activity</div>`;
			}

			container.html(html);
		},
	});
};



frappe.pages["dak_dashboard"].toggle_details_drawer = function (show) {
	if (show) {
		$("#details-overlay").fadeIn(200);
		setTimeout(() => $("#task-details-drawer").addClass("open"), 10);
	} else {
		$("#task-details-drawer").removeClass("open");
		setTimeout(() => $("#details-overlay").fadeOut(200), 200);
	}
};

frappe.pages["dak_dashboard"].apply_modal_theme = function (d) {
	d.$wrapper.find('.modal-header').css({
		"background-color": "#2e605c",
		"color": "white",
		"border-bottom": "1px solid #234b48"
	});
	d.$wrapper.find('.modal-title').css({
		"color": "white",
		"font-weight": "600"
	});
	d.$wrapper.find('.modal-header .btn-modal-close').css({
		"color": "white",
		"box-shadow": "none",
		"background": "transparent"
	});
	d.$wrapper.find('.modal-header .btn-modal-close .icon').css("stroke", "white");
	d.$wrapper.find('.modal-header .btn-modal-close svg').css("stroke", "white");
	d.$wrapper.find('.modal-header .btn-modal-close use').css("stroke", "white");

	let $btn = d.get_primary_btn();
	if ($btn) {
		$btn.css({
			"background-color": "#2e605c",
			"border-color": "#2e605c",
			"color": "white",
			"font-weight": "500"
		});
		$btn.hover(
			function () { $(this).css("background-color", "#39736e").css("border-color", "#39736e"); },
			function () { $(this).css("background-color", "#2e605c").css("border-color", "#2e605c"); }
		);
	}
};

frappe.pages["dak_dashboard"].show_task_details = function (task_name) {
	if (!task_name) return;

	frappe.call({
		method: 'frappe.client.get',
		args: { doctype: 'Task', name: task_name },
		callback: (r) => {
			if (r.message) {
				try {
					let task = r.message;
					let d = render_task_modal_skeleton(task);
					fetch_timesheets(task_name, d);
					fetch_activities(task_name, d);
				} catch (e) {
					console.error("Task Modal Render Error:", e);
					frappe.msgprint("An error occurred while displaying task details.");
				}
			}
		},
		error: (r) => {
			frappe.msgprint(__("Unable to access Task details. Please check permissions."));
			return true;
		}
	});

	function render_task_modal_skeleton(task) {
		let d = new frappe.ui.Dialog({
			title: 'Task Details',
			size: 'large'
		});

		let statusColor = task.status === 'Completed' ? 'green' : (task.status === 'Overdue' ? 'red' : 'blue');

		let html = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <span class="indicator ${statusColor}" style="font-size: 14px; font-weight: 500;">${task.status}</span>
                    <span style="background: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-size: 12px; color: #4b5563; font-weight: 600;">${task.priority}</span>
                    <span style="font-size: 12px; color: #9ca3af; margin-left: auto;">${task.name}</span>
                </div>
                
                <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #111827; line-height: 1.3;">${task.subject}</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                     <div style="flex: 3;">
                        <h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase;">Description</h4>
                        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
                            <div style="font-size: 0.95rem; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${task.description || '<span style="color: #9ca3af; font-style: italic;">No description provided.</span>'}</div>
                        </div>

                        <h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase;">Timesheets</h4>
                        <div id="modal-timesheets-container" style="margin-bottom: 25px;">
                            <div style="padding: 10px; color: #9ca3af; font-style: italic;"><i class="fa fa-spinner fa-spin"></i> Loading timesheets...</div>
                        </div>

                        <h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase;">Activity Log</h4>
                        <div id="modal-activities-container">
                             <div style="padding: 10px; color: #9ca3af; font-style: italic;"><i class="fa fa-spinner fa-spin"></i> Loading activities...</div>
                        </div>
                     </div>

                     <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 15px;">
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Start Date</div>
                            <div style="font-weight: 600; color: #374151;">${task.exp_start_date ? frappe.datetime.str_to_user(task.exp_start_date) : '-'}</div>
                        </div>
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Due Date</div>
                            <div style="font-weight: 600; color: #374151;">${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : '-'}</div>
                        </div>
                         <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Assigned To</div>
                            <div style="font-weight: 600; color: #374151;">${task.allocated_to || '-'}</div>
                        </div>
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Mode of Source</div>
                            <div style="font-weight: 600; color: #374151;">${task.custom_source_of_task || '-'}</div>
                        </div>
                        <div style="margin-top: auto; text-align: center;">
                             <button class="btn btn-default btn-sm btn-block" onclick="frappe.set_route('Form', 'Task', '${task.name}')">
                                Open Full Details
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        `;

		d.$body.html(html);
		d.show();
		frappe.pages["dak_dashboard"].apply_modal_theme(d);
		return d;
	}

	function fetch_timesheets(task_name, d) {
		frappe.call({
			method: 'dakbabu.dakbabu.page.dak_timesheet.dak_timesheet.get_timesheets_for_task',
			args: {
				task_name: task_name
			},
			callback: (r) => {
				let timesheets = r.message || [];
				let html = '';
				if (timesheets.length > 0) {
					html = `<table class="table table-bordered table-condensed" style="font-size: 0.9rem; margin-top: 10px;">
                        <thead><tr style="background: #f9fafb;"><th>Date</th><th>Activity</th><th>Hrs</th></tr></thead>
                        <tbody>`;
					timesheets.forEach(ts => {
						let date_val = ts.from_time ? frappe.datetime.str_to_user(ts.from_time).split(' ')[0] : '-';
						html += `<tr>
                            <td>${date_val}</td>
                            <td>${ts.activity_type || '-'}</td>
                            <td style="font-weight: 600;">${ts.hours}</td>
                        </tr>`;
					});
					html += `</tbody></table>`;
				} else {
					html = `<div style="padding: 15px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; border-radius: 8px;">No timesheets recorded.</div>`;
				}
				d.$wrapper.find('#modal-timesheets-container').html(html);
			},
			error: (r) => {
				d.$wrapper.find('#modal-timesheets-container').html(`<div style="padding: 10px; color: #ef4444; font-size: 0.85rem;">Permission denied for Timesheets.</div>`);
				return true;
			}
		});
	}

	function fetch_activities(task_name, d) {
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Comment',
				filters: {
					reference_doctype: 'Task',
					reference_name: task_name,
					comment_type: 'Comment'
				},
				fields: ['content', 'creation', 'owner'],
				order_by: 'creation desc',
				limit_page_length: 5
			},
			callback: (r) => {
				let activities = r.message || [];
				let html = '';
				if (activities.length > 0) {
					activities.forEach(c => {
						html += `<div style="margin-bottom: 15px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">
                            <div style="font-size: 0.8rem; color: #6b7280; display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <strong>${frappe.user.full_name(c.owner)}</strong>
                                <span>${frappe.datetime.comment_when(c.creation)}</span>
                            </div>
                            <div style="font-size: 0.9rem; color: #374151;">${c.content}</div>
                         </div>`;
					});
				} else {
					html = `<div style="padding: 15px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; border-radius: 8px;">No recent comments.</div>`;
				}
				d.$wrapper.find('#modal-activities-container').html(html);
			},
			error: (r) => {
				d.$wrapper.find('#modal-activities-container').html(`<div style="padding: 10px; color: #ef4444; font-size: 0.85rem;">Unable to load activities.</div>`);
				return true;
			}
		});
	}
};

frappe.pages["dak_dashboard"].calendar_date = new Date(); // Initialize state

frappe.pages["dak_dashboard"].change_calendar_month = function (offset) {
	let current = frappe.pages["dak_dashboard"].calendar_date;
	frappe.pages["dak_dashboard"].calendar_date = new Date(
		current.getFullYear(),
		current.getMonth() + offset,
		1
	);
	frappe.pages["dak_dashboard"].render_mini_calendar();
};

frappe.pages["dak_dashboard"].render_mini_calendar = function () {
	let now = frappe.pages["dak_dashboard"].calendar_date || new Date();
	// Ensure state is set if first run
	if (!frappe.pages["dak_dashboard"].calendar_date)
		frappe.pages["dak_dashboard"].calendar_date = now;

	let month = now.toLocaleString("default", { month: "long" });
	let year = now.getFullYear();
	let monthIdx = now.getMonth() + 1; // 1-indexed for backend

	$("#mini-calendar-month-year").text(`${month} ${year}`);

	// Fetch Due Tasks
	frappe.call({
		method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_due_tasks_for_month",
		args: { month: monthIdx, year: year },
		callback: function (r) {
			let tasksByDate = {};
			if (r.message) {
				// Group by date
				r.message.forEach((t) => {
					if (t.exp_end_date) {
						let d = new Date(t.exp_end_date).getDate();
						if (!tasksByDate[d]) tasksByDate[d] = [];
						tasksByDate[d].push(t);
					}
				});
			}

			let firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
			let daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
			let today = now.getDate();

			// Apply Grid Layout for gaps
			$("#mini-calendar-days").css({
				display: "grid",
				"grid-template-columns": "repeat(7, 1fr)",
				gap: "4px",
			});
			$("#mini-calendar-days")
				.prev()
				.css({ display: "grid", "grid-template-columns": "repeat(7, 1fr)", gap: "4px" })
				.children()
				.css("width", "auto");

			let calendarHtml = "";

			// Empty slots for previous month
			for (let i = 0; i < firstDay; i++) {
				calendarHtml += `<span style="height: 25px;"></span>`;
			}

			// Days
			for (let i = 1; i <= daysInMonth; i++) {
				let isToday = i === today;
				let dayTasks = tasksByDate[i] || [];
				let hasTasks = dayTasks.length > 0;

				// Determine Color based on Priority
				let dayColor = "#ffffff";
				let fontWeight = "400";

				if (isToday) {
					dayColor = "#2e605c"; // Text color for white bg
					fontWeight = "700";
				}

				let bgColor = "transparent";
				if (hasTasks) {
					// Check Priorities
					let priorities = dayTasks.map((t) => t.priority);
					if (priorities.includes("Urgent") || priorities.includes("High")) {
						bgColor = "rgba(239, 83, 80, 0.4)"; // Reddish
					} else if (priorities.includes("Medium")) {
						bgColor = "rgba(255, 167, 38, 0.4)"; // Orangeish
					} else {
						bgColor = "rgba(102, 187, 106, 0.4)"; // Greenish
					}
				}
				if (isToday) bgColor = "#ffffff";

				let style = `
                    width: 100%;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    border-radius: 5px;
                    cursor: pointer;
                    color: ${dayColor};
                    font-weight: ${fontWeight};
                    background: ${bgColor};
                    position: relative;
                `;

				if (isToday) {
					style += `box-shadow: 0 2px 5px rgba(0,0,0,0.1);`;
				}

				// Click Handler & Tooltip
				let clickAction = "";
				let titleAttr = "";
				if (hasTasks) {
					let dateStr = `${year}-${String(monthIdx).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
					clickAction = `onclick="frappe.set_route('dak_task_list', { date: '${dateStr}' })"`;
					titleAttr = `title="${dayTasks.length} Task${dayTasks.length > 1 ? "s" : ""}"`;
				}

				// Dot indicator for tasks on 'Today' to separate from bg
				let dotHtml = "";
				if (isToday && hasTasks) {
					dotHtml = `<div style="position: absolute; bottom: 2px; width: 4px; height: 4px; background: #ef5350; border-radius: 50%;"></div>`;
				}

				calendarHtml += `<span ${titleAttr} style="${style}" ${clickAction} onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${i}${dotHtml}</span>`;
			}

			$("#mini-calendar-days").html(calendarHtml);
		},
	});
};

frappe.pages["dak_dashboard"].show_project_details = function (project_name) {
	frappe.db.get_doc("Project", project_name).then((doc) => {
		// Reuse the Task Details Drawer
		$("#detail-subject").text(doc.project_name || doc.name);
		$("#detail-project").text("PROJECT");

		// Status & Priority
		$("#detail-status").text(doc.status);
		$("#detail-priority").text(doc.priority || "Medium");

		// Colors
		let prioColor = "#10b981";
		if (doc.priority === "Medium") prioColor = "#f59e0b";
		if (doc.priority === "High" || doc.priority === "Urgent") prioColor = "#dc2626";
		$("#detail-priority").css({ color: prioColor, "border-color": prioColor });

		// Date
		$("#detail-date").html(
			`<i class="fa fa-calendar"></i> ${doc.expected_end_date
				? frappe.datetime.str_to_user(doc.expected_end_date)
				: "No Date"
			}`
		);

		$("#detail-exp-time").text(doc.estimated_costing || 0);

		// Description
		let desc = doc.notes || doc.description || "No description provided.";
		$("#detail-description").html(desc);

		// Assigned
		$("#detail-assigned").empty().text("No specific assignment");

		// Actions
		$("#btn-view-full-task")
			.text("View Full Project")
			.off("click")
			.on("click", function () {
				frappe.pages["dak_dashboard"].toggle_details_drawer(false);
				frappe.set_route("dak_projects", "detail", doc.name);
			});

		frappe.pages["dak_dashboard"].toggle_details_drawer(true);
	});
};

frappe.pages["dak_dashboard"].redirect_to_task_list = function (extra_filters = {}) {
	let filter = frappe.pages["dak_dashboard"].current_filter || "All Time";
	let route_options = extra_filters || {};

	if (filter && filter !== "All Time") {
		route_options.date = filter;
	}

	frappe.route_options = route_options;
	frappe.set_route("dak_task_list");
};
