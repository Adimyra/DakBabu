frappe.pages['dak_dashboard'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Dak Dashboard',
        single_column: true
    });

    // Check dependencies
    if (!frappe.provide('dakbabu.components') || !dakbabu.components.get_reminder_card || !dakbabu.components.get_performance_card) {
        frappe.require('/assets/dakbabu/js/dak_components.js', () => {
            frappe.pages['dak_dashboard'].render_page_content(wrapper);
        });
    } else {
        frappe.pages['dak_dashboard'].render_page_content(wrapper);
    }
}

frappe.pages['dak_dashboard'].render_page_content = function (wrapper) {
    if (!dakbabu.components || !dakbabu.components.get_reminder_card || !dakbabu.components.get_performance_card) {
        console.error("Failed to load Dak Components");
        frappe.msgprint("Failed to load Dashboard Components. Please reload dependencies.");
        return;
    }


    // Add content to the page
    $(wrapper).find('.layout-main').html(`
        <!-- Navigation Bar Card -->
        <div style="
            width: 100%;
            background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
            padding: 15px 40px;
            margin-bottom: 2px;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 100;
        ">
            <!-- Decorative Circles Container (Handles Overflow) -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border-radius: 12px 12px 0 0; z-index: 0;">
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
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_day_planner')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                    </div>
                </div>
            </div>

            <!-- Right Controls -->
            <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
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

                <!-- Right Filter -->
                <div style="position: relative;">
                    <div id="filter-btn" onclick="frappe.pages['dak_dashboard'].toggle_filter_dropdown()" style="
                        background: rgba(255,255,255,0.1);
                        padding: 8px 16px;
                        border-radius: 8px;
                        color: #ffffff;
                        font-weight: 500;
                        font-size: 0.9rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: background 0.2s;
                        backdrop-filter: blur(5px);
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                        <i class="fa fa-filter" style="margin-right: 8px; color: rgba(255,255,255,0.8);"></i> <span id="current-filter-label">All Time</span> <i class="fa fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem; color: rgba(255,255,255,0.8);"></i>
                    </div>
                    <!-- Filter Dropdown -->
                    <div id="filter-dropdown" style="
                        position: absolute;
                        top: 110%;
                        right: 0;
                        background: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                        width: 150px;
                        display: none;
                        flex-direction: column;
                        z-index: 1000;
                        overflow: hidden;
                    ">
                        <div class="filter-item" onclick="frappe.pages['dak_dashboard'].set_dashboard_filter('All Time')" style="padding: 10px 15px; cursor: pointer; color: #333; font-size: 0.9rem; transition: bg 0.2s;">All Time</div>
                        <div class="filter-item" onclick="frappe.pages['dak_dashboard'].set_dashboard_filter('Today')" style="padding: 10px 15px; cursor: pointer; color: #333; font-size: 0.9rem; transition: bg 0.2s;">Today</div>
                        <div class="filter-item" onclick="frappe.pages['dak_dashboard'].set_dashboard_filter('This Week')" style="padding: 10px 15px; cursor: pointer; color: #333; font-size: 0.9rem; transition: bg 0.2s;">This Week</div>
                        <div class="filter-item" onclick="frappe.pages['dak_dashboard'].set_dashboard_filter('This Month')" style="padding: 10px 15px; cursor: pointer; color: #333; font-size: 0.9rem; transition: bg 0.2s;">This Month</div>
                    </div>
                </div>
            </div>
        </div>



		${dakbabu.components.get_reminder_card('dashboard')}

        <!-- Stats Row -->
        <div class="row" style="margin: 0; width: 100%; margin-top: 0px;">
				<!-- Total Tasks: Blue/Cyan -->
				<div class="col-md-3 col-sm-6 mb-4" style="padding: 0 10px;">
					<div class="frappe-card" onclick="frappe.set_route('dak_task_list')" style="
						padding: 20px; 
						border-radius: 12px; 
						background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
						box-shadow: 0 4px 15px -3px rgba(6, 182, 212, 0.4);
						color: #ffffff;
						border: none;
						position: relative;
						overflow: hidden;
						height: 100%;
                        cursor: pointer;
                        transition: transform 0.2s;
					" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
						<div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<h6 style="font-weight: 500; opacity: 1; margin: 0; color: #ffffff;">Total Tasks</h6>
							<span style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px;">
								<i class="fa fa-file-text-o" style="color: #ffffff;"></i>
							</span>
						</div>
						<h3 id="total-tasks-count" style="font-size: 2rem; font-weight: 700; margin-bottom: 5px; color: #ffffff;">
                            <div class="skeleton" style="width: 40px; height: 32px; border-radius: 6px; display: inline-block;"></div>
                        </h3>
						<p style="font-size: 0.85rem; opacity: 0.9; margin: 0; color: #ffffff;">all</p>
					</div>
				</div>

				<!-- Due Period: Orange/Red -->
				<div class="col-md-3 col-sm-6 mb-4" style="padding: 0 10px;">
					<div class="frappe-card" onclick="frappe.set_route('dak_task_list')" style="
						padding: 20px; 
						border-radius: 12px; 
						background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
						box-shadow: 0 4px 15px -3px rgba(245, 158, 11, 0.4);
						color: #ffffff;
						border: none;
						position: relative;
						overflow: hidden;
						height: 100%;
                        cursor: pointer;
                        transition: transform 0.2s;
					" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
						<div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<h6 style="font-weight: 500; opacity: 1; margin: 0; color: #ffffff;">Overdue</h6>
							<span style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px;">
								<i class="fa fa-calendar" style="color: #ffffff;"></i>
							</span>
						</div>
						<h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 5px; color: #ffffff;">1</h3>
						<p style="font-size: 0.85rem; opacity: 0.9; margin: 0; color: #ffffff;">Needs attention</p>
					</div>
				</div>

				<!-- High Priority: Pink/Rose -->
				<div class="col-md-3 col-sm-6 mb-4" style="padding: 0 10px;">
					<div class="frappe-card" onclick="frappe.set_route('dak_task_list')" style="
						padding: 20px; 
						border-radius: 12px; 
						background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
						box-shadow: 0 4px 15px -3px rgba(236, 72, 153, 0.4);
						color: #ffffff;
						border: none;
						position: relative;
						overflow: hidden;
						height: 100%;
                        cursor: pointer;
                        transition: transform 0.2s;
					" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
						<div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<h6 style="font-weight: 500; opacity: 1; margin: 0; color: #ffffff;">High Priority</h6>
							<span style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px;">
								<i class="fa fa-exclamation-circle" style="color: #ffffff;"></i>
							</span>
						</div>
						<h3 id="high-priority-count" style="font-size: 2rem; font-weight: 700; margin-bottom: 5px; color: #ffffff;">
                            <div class="skeleton" style="width: 40px; height: 32px; border-radius: 6px; display: inline-block;"></div>
                        </h3>
						<p style="font-size: 0.85rem; opacity: 0.9; margin: 0; color: #ffffff;">Urgent</p>
					</div>
				</div>

				<!-- Active Now: Emerald/Green -->
				<div class="col-md-3 col-sm-6 mb-4" style="padding: 0 10px;">
					<div class="frappe-card" onclick="frappe.set_route('dak_task_list')" style="
						padding: 20px; 
						border-radius: 12px; 
						background: linear-gradient(135deg, #10b981 0%, #059669 100%);
						box-shadow: 0 4px 15px -3px rgba(16, 185, 129, 0.4);
						color: #ffffff;
						border: none;
						position: relative;
						overflow: hidden;
						height: 100%;
                        cursor: pointer;
                        transition: transform 0.2s;
					" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
						<div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<h6 style="font-weight: 500; opacity: 1; margin: 0; color: #ffffff;">Active Now</h6>
							<span style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px;">
								<i class="fa fa-clock-o" style="color: #ffffff;"></i>
							</span>
						</div>
						<h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 5px; color: #ffffff;">0</h3>
						<p style="font-size: 0.85rem; opacity: 0.9; margin: 0; color: #ffffff;">Online</p>
					</div>
				</div>
			</div>

		<div class="dashboard-content" style="padding: 0;">

			<!-- Stats Row Moved Up -->

			<div class="flex-grid-container" style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
				
                <!-- Standard Frappe Style Card -->
                <div class="flex-card-item" style="flex: 1 1 300px; max-width: 400px;">
                    <div class="frappe-card" style="
                        height: 100%;
                        padding: 20px;
                        border-radius: 8px;
                        background: #ffffff;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                        border: 1px solid #ebEEF0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                    ">
                        <h6 style="font-size: 13px; font-weight: 600; text-transform: uppercase; color: #8d99a6; margin-bottom: 10px; letter-spacing: 0.5px;">Total Tasks</h6>
                        <div style="display: flex; align-items: baseline;">
                            <h3 id="total-tasks-frappe-card" style="font-size: 28px; font-weight: 700; color: #36414c; margin: 0;">-</h3>
                            <span class="ml-2" style="font-size: 13px; color: #00B368; margin-left: 8px; background: #E8FDF5; padding: 2px 6px; border-radius: 4px;">
                                <i class="fa fa-arrow-up"></i> Live
                            </span>
                        </div>
                        <div style="width: 100%; height: 4px; background: #F4F5F7; border-radius: 2px; margin-top: 15px; overflow: hidden;">
                            <div style="width: 70%; height: 100%; background: #06b6d4; border-radius: 2px;"></div>
                        </div>
                    </div>
                </div>

				<div class="flex-card-item" style="flex: 1 1 500px; max-width: 900px;">
					<div class="frappe-card" style="
						height: 100%;
						padding: 30px; 
						border-radius: 12px; 
						background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
						box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
                        color: #ffffff;
                        border: none;
                        position: relative;
                        overflow: hidden;
					">
                        <!-- Card Decorative BG -->
                        <div style="position: absolute; top: -20%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; z-index: 0;"></div>

						<h4 style="font-weight: 600; margin-bottom: 20px; color: #fff; position: relative; z-index: 1;">System Users</h4>
						
                        <div class="user-list-container" style="position: relative; z-index: 1;">
                             <!-- Skeleton User Items -->
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div class="skeleton" style="width: 45px; height: 45px; border-radius: 50%; margin-right: 15px;"></div>
                                <div style="flex: 1;">
                                    <div class="skeleton" style="width: 60%; height: 14px; margin-bottom: 5px;"></div>
                                    <div class="skeleton" style="width: 40%; height: 12px;"></div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div class="skeleton" style="width: 45px; height: 45px; border-radius: 50%; margin-right: 15px;"></div>
                                <div style="flex: 1;">
                                    <div class="skeleton" style="width: 60%; height: 14px; margin-bottom: 5px;"></div>
                                    <div class="skeleton" style="width: 40%; height: 12px;"></div>
                                </div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		</div>

        <!-- Bottom Cards Wrapper: Side by Side -->
        <div style="display: flex; gap: 30px; margin-top: 30px; margin-bottom: 50px;">
            <!-- Clean Task Card Section (Now 75% Width) -->
            <div class="reminder-section" style="
                flex: 3;
                background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                padding: 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-radius: 16px;
            display: flex;
            flex-wrap: wrap;
            position: relative;
            overflow: hidden;
            border: none;
            color: #ffffff;
        ">
            <!-- Decorative Circles -->
            <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -50px; right: 20%; width: 250px; height: 250px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

            <div style="flex: 1; padding: 30px; min-width: 300px; position: relative; z-index: 1;">
                <!-- Badges Row -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">In Progress</span>
                    <span style="background: #fee2e2; color: #b91c1c; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">High</span>
                    <span style="background: #ffedd5; color: #c2410c; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;"><i class="fa fa-calendar-o" style="margin-right: 5px;"></i> Due Today</span>
                    <span style="background: #f3e8ff; color: #7e22ce; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;"><i class="fa fa-clock-o" style="margin-right: 5px;"></i> 11:00</span>
                </div>

                <!-- Title -->
                <h3 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-bottom: 15px;">Reply to Ministry Audit</h3>

                <!-- Meta Row -->
                <div style="display: flex; align-items: center; gap: 20px; color: rgba(255,255,255,0.8); margin-bottom: 15px; font-size: 0.95rem;">
                    <span style="display: flex; align-items: center;"><i class="fa fa-file-text-o" style="margin-right: 6px;"></i> Do Letter</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: #ffffff;">#DO/2023/889</span>
                    <span><i class="fa fa-paperclip"></i></span>
                    <span><i class="fa fa-comment-o" style="margin-right: 4px;"></i> 1</span>
                    <span><i class="fa fa-check-square-o" style="margin-right: 4px;"></i> 1/2</span>
                </div>

                <!-- Description -->
                <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem; margin: 0; line-height: 1.5;">Draft reply regarding the Q3 audit observations.</p>
            </div>

            <!-- Right Section (Timer) -->
            <div style="
                padding: 30px; 
                min-width: 250px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                border-left: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.05);
                position: relative;
                z-index: 1;
            ">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.05em; margin-bottom: 5px;">TIME LOGGED</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #ffffff; font-variant-numeric: tabular-nums;">01:00:00</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Est: 120m</div>
                </div>

                <button class="btn btn-primary" style="
                    background: #2563eb; 
                    border: none; 
                    padding: 10px 40px; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                " onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                    <i class="fa fa-play" style="margin-right: 8px; font-size: 0.9rem;"></i> Start
                </button>
            </div>
        </div>

            ${dakbabu.components.get_performance_card()}
        </div>
        </div>

        <!-- Drawer Markup -->
        <div class="task-drawer-overlay" onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)"></div>
        <div class="task-drawer" id="task-drawer">
            <div class="drawer-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: white; margin: 0; font-weight: 700; font-size: 1.5rem;">Create New Task</h4>
                        <p style="margin: 5px 0 0; opacity: 0.8; font-size: 0.9rem; color: rgba(255,255,255,0.9);">Fill in the details below</p>
                    </div>
                    <span onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)" style="cursor: pointer; opacity: 0.8; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%;">&times;</span>
                </div>
            </div>
            <div class="drawer-body">
                <!-- Step 1 -->
                <div id="drawer-step-1">
                    <label class="vibrant-label">Subject</label>
                    <input type="text" class="vibrant-input" id="drawer-subject" placeholder="Enter task subject">

                    <label class="vibrant-label">Status</label>
                    <select class="vibrant-input" id="drawer-status">
                        <option value="Open">Open</option>
                        <option value="Working">Working</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <div class="row">
                        <div class="col-md-6" style="padding-left: 0; padding-right: 10px;">
                            <label class="vibrant-label">Priority</label>
                            <select class="vibrant-input" id="drawer-priority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div class="col-md-6" style="padding-left: 10px; padding-right: 0;">
                            <label class="vibrant-label">Due Date</label>
                            <input type="date" class="vibrant-input" id="drawer-date">
                        </div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div id="drawer-step-2" style="display: none;">
                    <label class="vibrant-label">Description</label>
                    <textarea class="vibrant-input" id="drawer-description" rows="10" placeholder="Add task details..."></textarea>
                </div>
            </div>
            <div class="drawer-footer">
                <div id="drawer-footer-step-1" style="display: flex; justify-content: flex-end;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].toggle_task_drawer(false)" style="margin-right: 10px; border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;">Cancel</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].drawer_next_step()" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3); padding: 8px 20px; font-weight: 600;">Next <i class="fa fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>
                <div id="drawer-footer-step-2" style="display: none; justify-content: space-between;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_dashboard'].drawer_prev_step()" style="border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;"><i class="fa fa-arrow-left" style="margin-right: 5px;"></i> Back</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_dashboard'].create_task_from_drawer()" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3); padding: 8px 20px; font-weight: 600;">Create Task</button>
                </div>
            </div>
        </div>
	`);

    // Fetch and display users
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_users",
        callback: function (r) {
            if (r.message) {
                let users_html = '<ul class="list-group list-group-flush" style="margin-top: 10px; background: transparent;">';
                r.message.forEach(user => {
                    users_html += `
                        <li class="list-group-item d-flex align-items-center" style="
                            background: rgba(255, 255, 255, 0.15);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 12px 20px;
                            border-radius: 12px;
                            margin-bottom: 12px;
                            backdrop-filter: blur(10px);
                            transition: all 0.2s ease;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="avatar avatar-md mr-3" style="margin-right: 15px;">
                                <img class="avatar-frame" src="${user.user_image || '/assets/frappe/images/default-avatar.png'}" alt="${user.full_name}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8);">
                            </div>
                            <div>
                                <h6 class="mb-0" style="font-weight: 600; font-size: 1rem; color: #fff;">${user.full_name}</h6>
                                <p class="mb-0" style="font-size: 0.85rem; color: rgba(255,255,255,0.85);">${user.email}</p>
                            </div>
                        </li>
					`;
                });
                users_html += '</ul>';

                $(wrapper).find('.user-list-container').html(users_html);
            }
        }
    });

    // Fetch Stats on Load
    frappe.pages['dak_dashboard'].refresh_stats();
}

frappe.pages['dak_dashboard'].refresh_stats = function (timespan) {
    if (!timespan) timespan = "All Time";
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_task_counts",
        args: { timespan: timespan },
        callback: function (r) {
            if (r.message) {
                $('#total-tasks-count').text(r.message.total_tasks);
                $('#total-tasks-frappe-card').text(r.message.total_tasks); // Update standard card
                $('#high-priority-count').text(r.message.high_priority);

                // Update Performance Matrix
                let total = r.message.total_tasks || 0;
                let completed = r.message.completed_tasks || 0;
                let percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                $('#perf-percent').text(percent + '%');
                $('#perf-completed').html(`${completed} <span style="font-size: 0.9rem; font-weight: 400; opacity: 0.7;">/ ${total}</span>`);
                $('#perf-circle').css('background', `conic - gradient(rgba(255, 255, 255, 0.9) 0 % ${percent} %, rgba(255, 255, 255, 0.2) ${percent} % 100 %)`);
                // Also update other cards if IDs are added later:
                // $('#due-period-count').text(r.message.overdue_tasks);
                // $('#active-now-count').text(r.message.open_tasks);
            }
        }
    });

    // Fetch Latest Task for Reminder Card (Updates Subject/Status only, keeps dummy Meta data)
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_latest_task",
        callback: function (r) {
            if (r.message) {
                $('#latest-task-subject-dashboard').text(r.message.subject);
                $('#latest-task-status-dashboard').text('Reminder: ' + r.message.status);
            } else {
                $('#latest-task-subject-dashboard').text("No Upcoming Tasks");
                $('#latest-task-status-dashboard').text("You're all caught up!");
            }
        }
    });
};

frappe.pages['dak_dashboard'].toggle_task_drawer = function (show) {
    if (show) {
        // Reset to Step 1
        $('#drawer-step-1').show();
        $('#drawer-step-2').hide();
        $('#drawer-footer-step-1').css('display', 'flex');
        $('#drawer-footer-step-2').hide();

        $('.task-drawer-overlay').fadeIn(200);
        setTimeout(() => $('#task-drawer').addClass('open'), 10);
    } else {
        $('#task-drawer').removeClass('open');
        setTimeout(() => $('.task-drawer-overlay').fadeOut(200), 200);
    }
};

frappe.pages['dak_dashboard'].drawer_next_step = function () {
    let subject = $('#drawer-subject').val();
    if (!subject) {
        frappe.msgprint(__('Subject is required'));
        return;
    }
    $('#drawer-step-1').fadeOut(200, function () {
        $('#drawer-step-2').fadeIn(200);
    });
    $('#drawer-footer-step-1').hide();
    $('#drawer-footer-step-2').css('display', 'flex');
};

frappe.pages['dak_dashboard'].drawer_prev_step = function () {
    $('#drawer-step-2').fadeOut(200, function () {
        $('#drawer-step-1').fadeIn(200);
    });
    $('#drawer-footer-step-2').hide();
    $('#drawer-footer-step-1').css('display', 'flex');
};

frappe.pages['dak_dashboard'].create_task_from_drawer = function () {
    let subject = $('#drawer-subject').val();
    let status = $('#drawer-status').val();
    let priority = $('#drawer-priority').val();
    let date = $('#drawer-date').val();
    let description = $('#drawer-description').val();

    if (!subject) {
        frappe.msgprint(__('Subject is required'));
        return;
    }

    frappe.call({
        method: 'frappe.client.insert',
        args: {
            doc: {
                doctype: 'Task',
                subject: subject,
                status: status,
                priority: priority,
                exp_end_date: date,
                description: description
            }
        },
        callback: function (r) {
            if (!r.exc) {
                frappe.pages['dak_dashboard'].toggle_task_drawer(false);
                frappe.show_alert({ message: __('Task Created Successfully'), indicator: 'green' });

                // Clear inputs
                $('#drawer-subject').val('');
                $('#drawer-description').val('');
                $('#drawer-date').val('');

                // Refresh stats dynamically without page reload
                frappe.pages['dak_dashboard'].refresh_stats();
            }
        }
    });
};

frappe.pages['dak_dashboard'].toggle_filter_dropdown = function () {
    let dropdown = $('#filter-dropdown');
    if (dropdown.css('display') === 'none') {
        dropdown.css('display', 'flex');
    } else {
        dropdown.hide();
    }
};

frappe.pages['dak_dashboard'].set_dashboard_filter = function (filter) {
    $('#current-filter-label').text(filter);
    $('#filter-dropdown').hide();
    frappe.pages['dak_dashboard'].refresh_stats(filter);
};
