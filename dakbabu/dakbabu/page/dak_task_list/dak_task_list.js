frappe.pages['dak_task_list'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '',
        single_column: true
    });

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
            overflow: hidden;
        ">
            <!-- Decorative Circles -->
            <div style="position: absolute; top: -30px; left: 10%; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -40px; right: 5%; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            
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
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_dashboard')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-home" style="margin-right: 8px; font-size: 1.1rem;"></i> Dashboard
                    </div>
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;" onclick="frappe.set_route('dak_task_list')">
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
                <button onclick="frappe.pages['dak_task_list'].toggle_task_drawer(true)" style="
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
                <div style="
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
                    <i class="fa fa-filter" style="margin-right: 8px; color: rgba(255,255,255,0.8);"></i> All Time <i class="fa fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem; color: rgba(255,255,255,0.8);"></i>
                </div>
            </div>
        </div>



        <!-- Bottom Cards Wrapper: Only Task Card -->
        <div style="width: 100%; margin-bottom: 50px;">
            <!-- Clean Task Card Section -->
            <div class="reminder-section" style="
                width: 100%;
                background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                padding: 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                border-radius: 0 0 16px 16px;
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
        </div>

        <!-- Drawer Markup -->
        <div class="task-drawer-overlay" onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)"></div>
        <div class="task-drawer" id="task-drawer">
            <div class="drawer-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: white; margin: 0; font-weight: 700; font-size: 1.5rem;">Create New Task</h4>
                        <p style="margin: 5px 0 0; opacity: 0.8; font-size: 0.9rem; color: rgba(255,255,255,0.9);">Fill in the details below</p>
                    </div>
                    <span onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)" style="cursor: pointer; opacity: 0.8; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%;">&times;</span>
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
                     <button class="btn btn-default" onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)" style="margin-right: 10px; border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;">Cancel</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_task_list'].drawer_next_step()" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3); padding: 8px 20px; font-weight: 600;">Next <i class="fa fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>
                <div id="drawer-footer-step-2" style="display: none; justify-content: space-between;">
                     <button class="btn btn-default" onclick="frappe.pages['dak_task_list'].drawer_prev_step()" style="border: 1px solid #e5e7eb; background: white; color: #374151; font-weight: 600;"><i class="fa fa-arrow-left" style="margin-right: 5px;"></i> Back</button>
                     <button class="btn btn-primary" onclick="frappe.pages['dak_task_list'].create_task_from_drawer()" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3); padding: 8px 20px; font-weight: 600;">Create Task</button>
                </div>
            </div>
        </div>
	`);
}

frappe.pages['dak_task_list'].toggle_task_drawer = function (show) {
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

frappe.pages['dak_task_list'].drawer_next_step = function () {
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

frappe.pages['dak_task_list'].drawer_prev_step = function () {
    $('#drawer-step-2').fadeOut(200, function () {
        $('#drawer-step-1').fadeIn(200);
    });
    $('#drawer-footer-step-2').hide();
    $('#drawer-footer-step-1').css('display', 'flex');
};

frappe.pages['dak_task_list'].create_task_from_drawer = function () {
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
                frappe.pages['dak_task_list'].toggle_task_drawer(false);
                frappe.show_alert({ message: __('Task Created Successfully'), indicator: 'green' });

                // Clear inputs
                $('#drawer-subject').val('');
                $('#drawer-description').val('');
                $('#drawer-date').val('');

                // Note: No refresh_stats here as we removed stats.
                // If we want to refresh the TASK CARD, we'd need that logic.
                // For now, I'm focusing on layout cleanup as requested.
            }
        }
    });
};
