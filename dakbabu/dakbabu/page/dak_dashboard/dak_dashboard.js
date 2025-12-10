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


            </div>
        </div>





            <!-- Dynamic Task Cards Container (Active Task) -->
            <div id="task-cards-container" style="width: 100%; margin-bottom: 20px; padding: 0 10px;">
                <!-- Cards will be injected here via JS -->
                 <div class="text-center p-5" style="color: rgba(0,0,0,0.5);">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>

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

            <!-- Renamed Clean Task Card Section (Moved here) -->
            <!-- Dynamic Task Cards Container -->
 

		<div class="dashboard-content" style="padding: 0;">

			<!-- Stats Row Moved Up -->

			<div class="flex-grid-container" style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
				


			</div>
		</div>







        <div style="margin-top: 15px;">
             ${dakbabu.components.get_performance_card()}
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
        </div>
        
        </div>
	`);



    // Fetch Stats on Load
    frappe.pages['dak_dashboard'].refresh_stats();

    // Event Listeners
    $(wrapper).on('click', '.view-task-btn', function () {
        frappe.pages['dak_dashboard'].toggle_reminder_drawer(true);
    });

    $(wrapper).on('click', '.close-reminder-drawer', function () {
        frappe.pages['dak_dashboard'].toggle_reminder_drawer(false);
    });
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

    // Fetch Latest Tasks for Task Cards Container
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_latest_task",
        callback: function (r) {
            let container = $('#task-cards-container');
            container.empty();

            if (r.message && r.message.length > 0) {
                let tasks = r.message;
                if (!Array.isArray(tasks)) tasks = [tasks];

                // Find Active Task (Working Now) or default to first
                let activeTask = tasks.find(t => t.is_working_now == 1);
                if (!activeTask) activeTask = tasks[0];

                let task = activeTask;

                // Check Timer State
                let is_running = frappe.pages['dak_dashboard'].timer.running && frappe.pages['dak_dashboard'].timer.task_name === task.name;

                // Resume interval if running
                if (is_running && !frappe.pages['dak_dashboard'].timer.interval) {
                    frappe.pages['dak_dashboard'].start_clock_interval();
                }

                let action_btn_html = '';
                if (is_running) {
                    // STOP BUTTON
                    action_btn_html = `
                    <button onclick="frappe.pages['dak_dashboard'].stop_timer_action('${task.name}')" class="ltc-btn ltc-btn-stop" title="Stop Timer">
                        <i class="fa fa-stop" style="font-size: 1.1em;"></i>
                    </button>
                    `;
                } else {
                    // START BUTTON
                    action_btn_html = `
                    <button onclick="frappe.pages['dak_dashboard'].start_timer_action('${task.name}')" class="ltc-btn ltc-btn-start" title="Start Timer">
                        <i class="fa fa-play" style="font-size: 1.1em; margin-left: 2px;"></i>
                    </button>
                    `;
                }

                // Render Active/Latest Task Card (Same Design as Task List)
                let cardHtml = `
                    <div class="latest-task-card">
                        <!-- 3 Decorative Circles -->
                        <div class="ltc-circle ltc-circle-1"></div>
                        <div class="ltc-circle ltc-circle-2"></div>
                        <div class="ltc-circle ltc-circle-3"></div>
                        
                        <div class="ltc-content">
                            <div class="ltc-header">
                                <span class="ltc-badge">Active Task</span>
                                <span class="ltc-status">${task.status}</span>
                                <span class="ltc-date"><i class="fa fa-calendar" style="margin-right: 5px;"></i> ${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : "No Date"}</span>
                            </div>
                            <h2 class="ltc-title" onclick="frappe.set_route('Form', 'Task', '${task.name}')" style="cursor: pointer;">${task.subject}</h2>
                            <p class="ltc-desc">
                                ${task.description || 'No detailed description available for this task.'}
                            </p>
                        </div>

                        <div class="ltc-actions" style="flex-direction: column; align-items: flex-end; gap: 10px;">
                             <div style="display: flex; gap: 15px;">
                                 ${action_btn_html}

                                 <!-- Edit Button -->
                                 <button onclick="frappe.set_route('Form', 'Task', '${task.name}')" class="ltc-btn ltc-btn-view" title="Edit Task">
                                    <i class="fa fa-pencil" style="font-size: 1.1em;"></i>
                                 </button>
                             </div>
                             
                             ${is_running ? `
                             <!-- Timer Display -->
                             <div class="ltc-timer">
                                <div class="ltc-timer-box" style="padding: 2px 10px; font-size: 1.2rem;">
                                     <span id="dashboard-digital-timer">00:00:00</span>
                                </div>
                             </div>` : ''}
                        </div>
                    </div>
                `;
                container.html(cardHtml);
            } else {
                container.html(`
                    <div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5); background: rgba(0,0,0,0.02); border-radius: 16px;">
                        <h4>No Active Tasks</h4>
                        <p>You are all caught up!</p>
                    </div>
                 `);
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




// --- Timer State ---
frappe.pages['dak_dashboard'].timer = {
    running: false,
    task_name: null,
    start_time: null,
    timesheet: null,
    activity: null,
    interval: null
};

// --- Timer Helper Functions ---

frappe.pages['dak_dashboard'].start_clock_interval = function () {
    if (frappe.pages['dak_dashboard'].timer.interval) clearInterval(frappe.pages['dak_dashboard'].timer.interval);

    frappe.pages['dak_dashboard'].timer.interval = setInterval(function () {
        let timer = frappe.pages['dak_dashboard'].timer;
        if (!timer.running || !timer.start_time) return;

        let now = moment();
        let start = moment(timer.start_time);
        let duration = moment.duration(now.diff(start));

        let hours = Math.floor(duration.asHours());
        let mins = duration.minutes();
        let secs = duration.seconds();

        let formatted =
            (hours < 10 ? "0" + hours : hours) + ":" +
            (mins < 10 ? "0" + mins : mins) + ":" +
            (secs < 10 ? "0" + secs : secs);

        $('#dashboard-digital-timer').text(formatted);
    }, 1000);
};

frappe.pages['dak_dashboard'].start_timer_action = function (task_name) {
    // Prompt for Activity Type
    frappe.prompt([
        {
            label: 'Activity Type',
            fieldname: 'activity_type',
            fieldtype: 'Link',
            options: 'Activity Type',
            reqd: 1
        }
    ], (values) => {
        let activity = values.activity_type;
        let start_time = frappe.datetime.now_datetime();

        // Create Timesheet (Draft)
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'Timesheet',
                    note: 'Timer started from Dashboard',
                    time_logs: [
                        {
                            from_time: start_time,
                            activity_type: activity,
                            task: task_name
                            // hours is 0 initially, will be updated on stop
                        }
                    ]
                }
            },
            callback: function (r) {
                if (!r.exc && r.message) {
                    // Update State
                    frappe.pages['dak_dashboard'].timer = {
                        running: true,
                        task_name: task_name,
                        start_time: start_time,
                        timesheet: r.message.name,
                        activity: activity,
                        interval: null
                    };

                    frappe.show_alert({ message: `Timer Started for ${activity}`, indicator: 'green' });
                    frappe.pages['dak_dashboard'].start_clock_interval();

                    // Re-render to show Stop button
                    frappe.pages['dak_dashboard'].refresh_stats();
                }
            }
        });

    }, 'Start Timer', 'Start');
};

frappe.pages['dak_dashboard'].stop_timer_action = function (task_name) {
    let timer = frappe.pages['dak_dashboard'].timer;
    if (!timer.running || timer.task_name !== task_name) return;

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

    frappe.call({
        method: 'frappe.client.get',
        args: { doctype: 'Timesheet', name: timer.timesheet },
        callback: function (r) {
            if (r.message) {
                let ts = r.message;
                if (ts.time_logs && ts.time_logs.length > 0) {
                    // Update the first log (since we created it fresh)
                    ts.time_logs[0].hours = duration_hours;
                    ts.time_logs[0].to_time = end_time;

                    // Save
                    frappe.call({
                        method: 'frappe.client.save',
                        args: { doc: ts },
                        callback: function (save_r) {
                            if (!save_r.exc) {
                                frappe.show_alert({ message: `Timer Stopped. Logged ${duration_hours.toFixed(2)} hrs.`, indicator: 'blue' });

                                // Reset State
                                frappe.pages['dak_dashboard'].timer = {
                                    running: false,
                                    task_name: null,
                                    start_time: null,
                                    timesheet: null,
                                    activity: null,
                                    interval: null
                                };

                                // Re-render
                                frappe.pages['dak_dashboard'].refresh_stats();
                            }
                        }
                    });
                }
            }
        }
    });
};

