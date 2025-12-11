frappe.pages['dak_task_list'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '',
        single_column: true
    });

    frappe.pages['dak_task_list'].page_wrapper = wrapper;

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
                <!-- View Toggles -->
                <div style="display: flex; gap: 10px;">
                    <div id="view-toggle-list" onclick="frappe.pages['dak_task_list'].toggle_view('list')" style="
                        width: 32px; height: 32px; 
                        display: flex; align-items: center; justify-content: center; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        background: rgba(255,255,255,0.2); 
                        color: #ffffff;
                        transition: all 0.2s;
                    " title="List View">
                        <i class="fa fa-list"></i>
                    </div>
                    <div id="view-toggle-card" onclick="frappe.pages['dak_task_list'].toggle_view('card')" style="
                        width: 32px; height: 32px; 
                        display: flex; align-items: center; justify-content: center; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        background: transparent; 
                        color: rgba(255,255,255,0.7);
                        transition: all 0.2s;
                    " title="Card View">
                        <i class="fa fa-th-large"></i>
                    </div>
                    <div id="view-toggle-kanban" onclick="frappe.pages['dak_task_list'].toggle_view('kanban')" style="
                        width: 32px; height: 32px; 
                        display: flex; align-items: center; justify-content: center; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        background: transparent; 
                        color: rgba(255,255,255,0.7);
                        transition: all 0.2s;
                    " title="Kanban View">
                        <i class="fa fa-columns"></i>
                    </div>
                </div>

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
                    margin-left: 10px; 
                    border-left: 1px solid rgba(255,255,255,0.2); 
                    padding-left: 20px;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    <i class="fa fa-plus" style="margin-right: 8px;"></i> Add Task
                </button>




            </div>
        </div>

        <!-- Latest Task Featured Card -->
        <div id="latest-task-container" style="width: 100%; margin-bottom: 5px; display: none;">
            <!-- Content rendered via JS -->
        </div>

        <!-- Bottom Cards Wrapper: Task List Container -->
        <div style="width: 100%; margin-bottom: 50px; display: flex; flex-wrap: wrap; row-gap: 15px; column-gap: 30px; margin-top: 5px;" id="task-list-container">
            <div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5); width: 100%;">
                <i class="fa fa-spinner fa-spin" style="font-size: 2rem;"></i><br>Loading Tasks...
            </div>
        </div>

        <div id="kanban-task-list" style="display: none; width: 100%; overflow-x: auto; padding-bottom: 20px; margin-top: 20px; flex-direction: column;">
             <div style="margin-bottom: 10px; display: flex; justify-content: flex-end;">
                 <button class="btn btn-default btn-sm" onclick="frappe.pages['dak_task_list'].prompt_kanban_grouping()" style="background: #fff; border: 1px solid #e5e7eb; color: #374151; font-weight: 600;">
                    <i class="fa fa-sliders" style="margin-right: 5px;"></i> Group By: <span id="current-kanban-group">Status</span>
                 </button>
             </div>
             <div id="kanban-columns-wrapper" style="display: flex; gap: 20px;">
                <!-- Columns rendered here -->
             </div>
        </div>    
        <!-- Standard List Container -->
        <div id="standard-task-list" style="
            width: 100%; 
            margin-bottom: 50px; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.05); 
            padding: 20px;
            display: none; /* Hidden by default until loaded */
        ">

            
            <!-- Filters -->
            <!-- Filters & Grouping -->
            <div class="row" style="margin-bottom: 20px;">
                <div class="col-md-2">
                     <!-- Group By Dropdown -->
                    <div class="dropdown" style="width: 100%;">
                        <button class="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" style="text-align: left; display: flex; justify-content: space-between; align-items: center;">
                            <span><i class="fa fa-list-ul"></i> Group: <span id="group-by-label">None</span></span> <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" style="width: 100%; margin-top: 5px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: none;">
                            <li><a href="#" onclick="frappe.pages['dak_task_list'].set_group_by(null)" style="padding: 8px 15px;">None</a></li>
                            <li><a href="#" onclick="frappe.pages['dak_task_list'].set_group_by('status')" style="padding: 8px 15px;">Status</a></li>
                            <li><a href="#" onclick="frappe.pages['dak_task_list'].set_group_by('priority')" style="padding: 8px 15px;">Priority</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
                    <input type="text" id="filter-subject" class="form-control" placeholder="Filter by Subject..." onkeyup="frappe.pages['dak_task_list'].apply_task_filters()">
                </div>
                <div class="col-md-2">
                    <select id="filter-status" class="form-control" onchange="frappe.pages['dak_task_list'].apply_task_filters()">
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Working">Working</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select id="filter-priority" class="form-control" onchange="frappe.pages['dak_task_list'].apply_task_filters()">
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select id="filter-date" class="form-control" onchange="frappe.pages['dak_task_list'].apply_task_filters()">
                        <option value="">All Dates</option>
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Week">This Week</option>
                        <option value="Next Week">Next Week</option>
                        <option value="This Month">This Month</option>
                        <option value="Next Month">Next Month</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            <div class="table-responsive">
                <table class="frappe-list-table" id="standard-task-table">
                    <thead>
                        <tr id="task-table-header">
                             <!-- Will be populated by JS -->
                        </tr>
                    </thead>
                    <tbody id="standard-task-table-body">
                        <!-- Rows rendered here -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Markup (Centered & Vibrant) -->
        <div class="lucid-modal-overlay" id="task-drawer-overlay" onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)">
            <div class="lucid-drawer" id="task-drawer" onclick="event.stopPropagation()">
                <div class="lucid-header">
                    <div>
                        <h2 class="lucid-title" id="drawer-title">Create New Task</h2>
                        <p class="lucid-subtitle">Fill in the details below to create a new task.</p>
                    </div>
                    <button class="lucid-close-btn" onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)">
                        <i class="fa fa-times" style="font-size: 1.2rem;"></i>
                    </button>
                </div>
                
                <div class="lucid-body">
                    <!-- Step 1: Core Details -->
                    <div id="drawer-step-1">
                        <div class="lucid-form-group">
                            <label class="lucid-label">Subject <span style="color: #ef4444;">*</span></label>
                            <input type="text" class="lucid-input" id="drawer-subject" placeholder="What needs to be done?">
                        </div>

                         <div class="row" style="margin: 0 -10px;">
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Customer Name</label>
                                    <div class="awesomplete">
                                        <input type="text" class="lucid-input" id="drawer-customer" placeholder="Search Customer...">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Project</label>
                                    <div class="awesomplete">
                                        <input type="text" class="lucid-input" id="drawer-project" placeholder="Link to Project...">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row" style="margin: 0 -10px;">
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Status</label>
                                    <select class="lucid-input" id="drawer-status">
                                        <option value="Open">Open</option>
                                        <option value="Working">Working</option>
                                        <option value="Pending Review">Pending Review</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Priority</label>
                                    <select class="lucid-input" id="drawer-priority">
                                        <option value="Low">Low</option>
                                        <option value="Medium" selected>Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Additional Info -->
                    <div id="drawer-step-2" style="display: none;">
                        <div class="row" style="margin: 0 -10px;">
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Due Date</label>
                                    <input type="date" class="lucid-input" id="drawer-date">
                                </div>
                            </div>
                            <div class="col-md-6" style="padding: 0 10px;">
                                <div class="lucid-form-group">
                                    <label class="lucid-label">Estimated Hours</label>
                                    <input type="number" step="0.5" class="lucid-input" id="drawer-hours" placeholder="e.g. 2.5">
                                </div>
                            </div>
                        </div>
                        
                        <div class="lucid-form-group">
                            <label class="lucid-label">Description</label>
                            <textarea class="lucid-input lucid-textarea" id="drawer-description" placeholder="Add detailed instructions, links, or context..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="lucid-footer">
                    <div id="drawer-footer-step-1" style="display: flex; gap: 10px; width: 100%; justify-content: flex-end;">
                         <!-- Log Time Button (Visible only in Edit Mode) -->
                         <button class="lucid-btn lucid-btn-ghost" id="btn-log-time-step-1" style="margin-right: auto; display: none; color: #4f46e5; border-color: #4f46e5;" onclick="frappe.pages['dak_task_list'].open_timesheet_modal()">
                            <i class="fa fa-clock-o" style="margin-right: 5px;"></i> Log Time
                         </button>

                         <button class="lucid-btn lucid-btn-ghost" onclick="frappe.pages['dak_task_list'].toggle_task_drawer(false)">Cancel</button>
                         <button class="lucid-btn lucid-btn-primary" onclick="frappe.pages['dak_task_list'].drawer_next_step()">Next <i class="fa fa-arrow-right" style="margin-left: 8px;"></i></button>
                    </div>
                    <div id="drawer-footer-step-2" style="display: none; width: 100%; justify-content: space-between;">
                         <button class="lucid-btn lucid-btn-ghost" onclick="frappe.pages['dak_task_list'].drawer_prev_step()"><i class="fa fa-arrow-left" style="margin-right: 8px;"></i> Back</button>
                         <button class="lucid-btn lucid-btn-primary" id="drawer-submit-btn" onclick="frappe.pages['dak_task_list'].create_task_from_drawer()">Create Task</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Details Drawer -->
        <div class="lucid-modal-overlay" id="list-details-overlay" onclick="frappe.pages['dak_task_list'].toggle_details_drawer(false)">
            <div class="lucid-drawer task-details-drawer" id="list-task-details-drawer" onclick="event.stopPropagation()">
                <div class="lucid-header" style="background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);">
                    <div style="display: flex; justify-content: space-between; align-items: start; width: 100%;">
                        <div style="padding-right: 20px;">
                            <span id="list-detail-project" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; color: rgba(255,255,255,0.8); display: block; margin-bottom: 5px;">Project Name</span>
                            <h4 id="list-detail-subject" style="color: white; margin: 0; font-weight: 700; font-size: 1.3rem; line-height: 1.4;">Task Subject</h4>
                        </div>
                        <span onclick="frappe.pages['dak_task_list'].toggle_details_drawer(false)" style="cursor: pointer; opacity: 0.8; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%; has-tooltip: 0; color: white;">&times;</span>
                    </div>
                </div>
                
                <div class="lucid-body" style="padding: 25px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap;">
                        <span id="list-detail-status" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; padding: 4px 12px; border-radius: 20px;">Status</span>
                        <span id="list-detail-priority" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; padding: 4px 12px; border-radius: 20px;">Priority</span>
                        <span id="list-detail-date" class="sphere-badge-pill" style="background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; padding: 4px 12px; border-radius: 20px;"><i class="fa fa-calendar"></i> Date</span>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label class="lucid-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Time</label>
                        <div style="font-size: 1.1rem; font-weight: 500; color: #111827;">
                            <span id="list-detail-exp-time">0</span> Hrs
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label class="lucid-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Description</label>
                        <div id="list-detail-description" style="font-size: 1rem; line-height: 1.6; color: #374151; white-space: pre-wrap;">No description provided.</div>
                    </div>

                     <div style="margin-bottom: 25px;">
                        <label class="lucid-label" style="color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Assigned To</label>
                        <div id="list-detail-assigned" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
                    </div>
                </div>

                <div class="lucid-footer" style="padding: 20px 25px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <button class="lucid-btn lucid-btn-ghost" id="btn-edit-task-details" style="flex: 1;"><i class="fa fa-pencil"></i> Edit</button>
                        <button class="lucid-btn lucid-btn-primary" id="btn-view-full-task-list" style="flex: 1; background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);">View Full Form</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Timesheet Entry Modal -->
        <div class="lucid-modal-overlay" id="timesheet-modal-overlay" onclick="frappe.pages['dak_task_list'].toggle_timesheet_modal(false)">
            <div class="lucid-drawer" id="timesheet-modal" onclick="event.stopPropagation()" style="height: auto; max-height: 80vh; width: 500px;">
                <div class="lucid-header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
                    <div>
                        <h2 class="lucid-title" id="timesheet-modal-title">Log Time</h2>
                        <p class="lucid-subtitle">Record hours for this task.</p>
                    </div>
                    <button class="lucid-close-btn" onclick="frappe.pages['dak_task_list'].toggle_timesheet_modal(false)">
                        <i class="fa fa-times" style="font-size: 1.2rem;"></i>
                    </button>
                </div>
                
                <div class="lucid-body">
                    <div class="lucid-form-group">
                        <label class="lucid-label">Task</label>
                        <input type="text" class="lucid-input" id="ts-task-name" disabled style="background: #f3f4f6; color: #6b7280;">
                    </div>

                    <div class="row" style="margin: 0 -10px;">
                        <div class="col-md-6" style="padding: 0 10px;">
                            <div class="lucid-form-group">
                                <label class="lucid-label">Date</label>
                                <input type="date" class="lucid-input" id="ts-date">
                            </div>
                        </div>
                        <div class="col-md-6" style="padding: 0 10px;">
                            <div class="lucid-form-group">
                                <label class="lucid-label">Hours</label>
                                <input type="number" step="0.25" class="lucid-input" id="ts-hours" placeholder="e.g. 1.5">
                            </div>
                        </div>
                    </div>

                    <div class="lucid-form-group">
                        <label class="lucid-label">Activity Type</label>
                        <div class="awesomplete">
                            <input type="text" class="lucid-input" id="ts-activity-type" placeholder="Select Activity...">
                        </div>
                    </div>

                    <div class="lucid-form-group">
                        <label class="lucid-label">Description</label>
                        <textarea class="lucid-input lucid-textarea" id="ts-description" placeholder="What did you work on?" style="min-height: 100px;"></textarea>
                    </div>
                </div>

                <div class="lucid-footer">
                     <button class="lucid-btn lucid-btn-ghost" onclick="frappe.pages['dak_task_list'].toggle_timesheet_modal(false)">Cancel</button>
                     <button class="lucid-btn lucid-btn-primary" onclick="frappe.pages['dak_task_list'].submit_timesheet_entry()" style="background: #059669; border-color: #059669;">Submit Log</button>
                </div>
            </div>
        </div>
    `);

    // Fetch and render tasks initial
    frappe.pages['dak_task_list'].render_task_list(wrapper);

    // Bind refresh event for re-entry
    $(wrapper).on('show', function () {
        frappe.pages['dak_task_list'].render_task_list(wrapper);
    });
}

frappe.pages['dak_task_list'].render_task_list = function (wrapper) {

    // Initialize Default Columns if not set
    if (!frappe.pages['dak_task_list'].visible_columns) {
        frappe.pages['dak_task_list'].visible_columns = [
            { label: 'Working', field: 'is_working_now', width: '10%' },
            { label: 'Subject', field: 'subject', width: '30%' },
            { label: 'Status', field: 'status', width: '15%' },
            { label: 'Priority', field: 'priority', width: '15%' },
            { label: 'Due Date', field: 'exp_end_date', width: '15%' }
        ];
    }

    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_all_tasks_list",
        callback: function (r) {
            if (r.message) {
                // Store all tasks for filtering
                frappe.pages['dak_task_list'].all_tasks = r.message;

                // Set Default View
                if (!frappe.pages['dak_task_list'].current_view) {
                    frappe.pages['dak_task_list'].current_view = 'list';
                }

                // Set Default Kanban Field / Group By
                if (!frappe.pages['dak_task_list'].kanban_field) {
                    frappe.pages['dak_task_list'].kanban_field = 'status';
                }
                if (frappe.pages['dak_task_list'].group_by_field === undefined) {
                    frappe.pages['dak_task_list'].group_by_field = null;
                }

                frappe.pages['dak_task_list'].toggle_view(frappe.pages['dak_task_list'].current_view);

                // Handle Route Options (Filters from Dashboard)
                // If route_options is present (even empty object), it implies a fresh navigation intent
                if (frappe.route_options) {
                    // Reset both filters first
                    $('#filter-status').val('');
                    $('#filter-priority').val('');

                    // Apply specific filters if present
                    if (frappe.route_options.status) {
                        $('#filter-status').val(frappe.route_options.status);
                    }
                    if (frappe.route_options.priority) {
                        $('#filter-priority').val(frappe.route_options.priority);
                    }

                    // Consume options
                    frappe.route_options = null;
                }

                // Initial Render (Filtered)
                frappe.pages['dak_task_list'].apply_task_filters();

                // Render Active Task Card
                if (r.message && r.message.length > 0) {
                    // Find task marked as "Working Now"
                    let activeTask = r.message.find(t => t.is_working_now == 1);

                    // If no task is manually marked, fallback to the latest one (first in list)
                    if (!activeTask) {
                        activeTask = r.message[0];
                    }

                    frappe.pages['dak_task_list'].render_latest_task_card(activeTask);
                }
            } else {
                frappe.pages['dak_task_list'].all_tasks = [];
                frappe.pages['dak_task_list'].render_tasks_visuals(wrapper, []);
            }
        }
    });
}

frappe.pages['dak_task_list'].toggle_view = function (view) {
    frappe.pages['dak_task_list'].current_view = view;

    // Update container visibility
    if (view === 'list') {
        $('#task-list-container').hide();
        $('#kanban-task-list').hide();
        $('#standard-task-list').show();

        // Update Icon Styles
        $('#view-toggle-list').css({ 'background': 'rgba(255,255,255,0.2)', 'color': '#ffffff' });
        $('#view-toggle-card').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
        $('#view-toggle-kanban').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
    } else if (view === 'card') {
        $('#task-list-container').css('display', 'flex'); // Flex needed for grid
        $('#standard-task-list').hide();
        $('#kanban-task-list').hide();

        // Update Icon Styles
        $('#view-toggle-list').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
        $('#view-toggle-card').css({ 'background': 'rgba(255,255,255,0.2)', 'color': '#ffffff' });
        $('#view-toggle-kanban').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
    } else if (view === 'kanban') {
        // Check if field is selected, if not (and we are switching TO kanban explicitly), prompt
        // Note: Initial load handling is done in callback above
        if (!frappe.pages['dak_task_list'].kanban_field) {
            frappe.pages['dak_task_list'].prompt_kanban_grouping();
            return; // Stop toggle until selected
        }

        $('#task-list-container').hide();
        $('#standard-task-list').hide();
        $('#kanban-task-list').css('display', 'flex');

        // Update Icon Styles
        $('#view-toggle-list').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
        $('#view-toggle-card').css({ 'background': 'transparent', 'color': 'rgba(255,255,255,0.7)' });
        $('#view-toggle-kanban').css({ 'background': 'rgba(255,255,255,0.2)', 'color': '#ffffff' });
    }
};

frappe.pages['dak_task_list'].prompt_kanban_grouping = function () {
    let d = new frappe.ui.Dialog({
        title: 'Group Kanban By',
        fields: [
            {
                label: 'Field',
                fieldname: 'group_by',
                fieldtype: 'Select',
                options: [
                    { label: 'Status', value: 'status' },
                    { label: 'Priority', value: 'priority' }
                ],
                default: frappe.pages['dak_task_list'].kanban_field || 'status'
            }
        ],
        primary_action_label: 'View Board',
        primary_action(values) {
            frappe.pages['dak_task_list'].kanban_field = values.group_by;
            $('#current-kanban-group').text(values.group_by === 'status' ? 'Status' : 'Priority');

            // Re-render and Switch
            frappe.pages['dak_task_list'].apply_task_filters();
            frappe.pages['dak_task_list'].toggle_view('kanban');
            d.hide();
        }
    });
    d.show();
};



// --- Kanban Drag and Drop Handlers ---

frappe.pages['dak_task_list'].kanban_drag_start = function (ev, task_name) {
    ev.dataTransfer.setData("text/plain", task_name);
    ev.dataTransfer.effectAllowed = "move";
};

frappe.pages['dak_task_list'].kanban_allow_drop = function (ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
};

frappe.pages['dak_task_list'].kanban_drop = function (ev, new_value) {
    ev.preventDefault();
    let task_name = ev.dataTransfer.getData("text/plain");
    let field = frappe.pages['dak_task_list'].kanban_field || 'status';

    // Find task
    let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);
    if (!task) return;

    // No change check
    if (task[field] === new_value) return;

    // Optimistic Update
    let old_value = task[field];
    task[field] = new_value;

    // Re-render immediately
    frappe.pages['dak_task_list'].apply_task_filters();

    // Backend Update
    frappe.client.set_value({
        doctype: 'Task',
        name: task_name,
        fieldname: field,
        value: new_value
    }).then(r => {
        frappe.show_alert({
            message: `Task ${task.subject} moved to ${new_value}`,
            indicator: 'green'
        });
    }).catch(e => {
        // Revert on failure
        task[field] = old_value;
        frappe.pages['dak_task_list'].apply_task_filters();
        frappe.msgprint('Failed to update task.');
    });
};

frappe.pages['dak_task_list'].apply_task_filters = function () {
    let wrapper = frappe.pages['dak_task_list'].page_wrapper;
    let subject = $('#filter-subject').val().toLowerCase();
    let status = $('#filter-status').val();
    let priority = $('#filter-priority').val();
    let date_filter = $('#filter-date').val();

    let filtered_tasks = frappe.pages['dak_task_list'].all_tasks.filter(task => {
        let matchSubject = !subject || task.subject.toLowerCase().includes(subject);
        let matchStatus = !status || task.status === status;
        let matchPriority = !priority || task.priority === priority;

        let matchDate = true;
        if (date_filter) {
            if (!task.exp_end_date) {
                matchDate = false;
            } else {
                let d = moment(task.exp_end_date);
                let now = moment();

                if (date_filter === 'Today') {
                    matchDate = d.isSame(now, 'day');
                } else if (date_filter === 'Tomorrow') {
                    matchDate = d.isSame(now.clone().add(1, 'days'), 'day');
                } else if (date_filter === 'This Week') {
                    matchDate = d.isSame(now, 'week');
                } else if (date_filter === 'Next Week') {
                    matchDate = d.isSame(now.clone().add(1, 'weeks'), 'week');
                } else if (date_filter === 'This Month') {
                    matchDate = d.isSame(now, 'month');
                } else if (date_filter === 'Next Month') {
                    matchDate = d.isSame(now.clone().add(1, 'months'), 'month');
                } else if (date_filter === 'Overdue') {
                    matchDate = d.isBefore(now, 'day') && task.status !== 'Completed';
                }
            }
        }

        return matchSubject && matchStatus && matchPriority && matchDate;
    });

    frappe.pages['dak_task_list'].render_tasks_visuals(wrapper, filtered_tasks);
};

// --- Group By Logic ---
frappe.pages['dak_task_list'].set_group_by = function (field) {
    frappe.pages['dak_task_list'].group_by_field = field;
    $('#group-by-label').text(field ? (field.charAt(0).toUpperCase() + field.slice(1)) : 'None');

    // Sync with Kanban if applicable
    if (field) {
        frappe.pages['dak_task_list'].kanban_field = field;
        $('#current-kanban-group').text(field === 'status' ? 'Status' : 'Priority');
    }

    frappe.pages['dak_task_list'].apply_task_filters();
};

frappe.pages['dak_task_list'].render_tasks_visuals = function (wrapper, tasks) {
    let container = $('#task-list-container');
    let table_header = $('#task-table-header');
    let table_body = $('#standard-task-table-body');
    let kanban_wrapper = $('#kanban-columns-wrapper');

    // Add function to set working task
    frappe.pages['dak_task_list'].set_working_task = function (task_name) {
        let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);
        if (task && task.status === 'Completed') {
            frappe.msgprint({
                title: __('Cannot Activate Task'),
                message: __('This task is already <b>Completed</b>. Please re-open it before setting it as active.'),
                indicator: 'red'
            });
            return;
        }

        frappe.call({
            method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.set_working_task",
            args: { task_name: task_name },
            callback: function (r) {
                if (r.message) {
                    frappe.show_alert({ message: 'Task set as Working Now', indicator: 'green' });
                    // Refresh
                    frappe.pages['dak_task_list'].render_task_list(frappe.pages['dak_task_list'].page_wrapper);
                }
            }
        });
    };

    let groupBy = frappe.pages['dak_task_list'].group_by_field;

    // Ensure Working columns are present (fix for stale session state)
    if (frappe.pages['dak_task_list'].visible_columns) {
        let hasWorking = frappe.pages['dak_task_list'].visible_columns.find(c => c.field === 'is_working_now');
        if (!hasWorking) {
            frappe.pages['dak_task_list'].visible_columns.unshift({ label: 'Working', field: 'is_working_now', width: '10%' });
        }
    }

    // 0. Render Headers (Using Frappe List Style)
    let header_html = `<th style="width: 50px;"></th> <!-- Working Status Icon Width -->`;

    frappe.pages['dak_task_list'].visible_columns.forEach((col, index) => {
        if (col.field === 'is_working_now') return; // Skip if handled manually
        header_html += `<th class="dynamic-col-header" data-index="${index}" style="
            padding: 12px 15px; 
            font-weight: normal; 
            border-bottom: 1px solid #d1d8dd; 
            text-align: left;
            cursor: pointer;
        ">
            ${col.label} <i class="fa fa-caret-down" style="margin-left: 5px; opacity: 0.3;"></i>
        </th>`;
    });
    header_html += `<th style="width: 50px;"></th>`; // Actions Column
    table_header.html(header_html);

    // Note: The HTML template has <tr id="task-table-header"> inside table. 
    // We should probably replace the CONTENTS of that TR, or ensuring table structure matches standard <thead><tbody>.
    // The current HTML in `dak_task_list.js` (lines 209-217) uses:
    // <table class="table ..."> <tr id="task-table-header"></tr> <tbody id="standard-task-table-body"></tbody> </table>
    // To match clean styling, let's update the table class in JS or assume CSS handles .table class override.
    // We'll proceed with populating the existing structure but applying NEW classes to rows/cells.

    // Bind Context Menu
    $('.dynamic-col-header').off('click').on('click', function (e) {
        e.stopPropagation();
        let index = $(this).data('index');
        frappe.pages['dak_task_list'].show_column_context_menu(e.pageX, e.pageY, index);
    });

    // Initialize Pagination State
    if (!frappe.pages['dak_task_list'].pagination) {
        frappe.pages['dak_task_list'].pagination = { page: 1, limit: 10 };
    }

    // Helper: Render Pagination
    const render_pagination_controls = (totalTasks) => {
        let pagination = frappe.pages['dak_task_list'].pagination;
        let totalPages = Math.ceil(totalTasks / pagination.limit);
        let startRecord = ((pagination.page - 1) * pagination.limit) + 1;
        let endRecord = Math.min(pagination.page * pagination.limit, totalTasks);
        if (totalTasks === 0) { startRecord = 0; endRecord = 0; }

        let controlsHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fff; border-top: 1px solid #e5e7eb; margin-top: 10px; border-radius: 0 0 8px 8px;">
                <div style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #6b7280;">
                    <span>Rows per page:</span>
                    <select id="rows-per-page" style="border: 1px solid #d1d5db; border-radius: 4px; padding: 2px 5px; font-size: 0.9rem; color: #374151; background: #fff;">
                        <option value="10" ${pagination.limit === 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${pagination.limit === 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${pagination.limit === 50 ? 'selected' : ''}>50</option>
                    </select>
                </div>
                <div style="font-size: 0.9rem; color: #6b7280;">${startRecord}-${endRecord} of ${totalTasks}</div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-default btn-xs" id="prev-page" ${pagination.page === 1 ? 'disabled' : ''} style="padding: 4px 8px;"><i class="fa fa-chevron-left"></i></button>
                    <button class="btn btn-default btn-xs" id="next-page" ${pagination.page === totalPages ? 'disabled' : ''} style="padding: 4px 8px;"><i class="fa fa-chevron-right"></i></button>
                </div>
            </div>`;

        if ($('#pagination-controls').length === 0) {
            $('<div id="pagination-controls"></div>').insertAfter('#standard-task-table'); // Note: ID might need check, it was just "table" in HTML
            // Actually, parent div is #standard-task-list. Let's append there if not found.
            if ($('#pagination-controls').length === 0) $('#standard-task-list').append('<div id="pagination-controls"></div>');
        }
        $('#pagination-controls').html(controlsHtml);

        $('#rows-per-page').off('change').on('change', function () {
            frappe.pages['dak_task_list'].pagination.limit = parseInt($(this).val());
            frappe.pages['dak_task_list'].pagination.page = 1;
            frappe.pages['dak_task_list'].render_tasks_visuals(wrapper, tasks);
        });
        $('#prev-page').off('click').on('click', function () {
            if (frappe.pages['dak_task_list'].pagination.page > 1) {
                frappe.pages['dak_task_list'].pagination.page--;
                frappe.pages['dak_task_list'].render_tasks_visuals(wrapper, tasks);
            }
        });
        $('#next-page').off('click').on('click', function () {
            if (frappe.pages['dak_task_list'].pagination.page < totalPages) {
                frappe.pages['dak_task_list'].pagination.page++;
                frappe.pages['dak_task_list'].render_tasks_visuals(wrapper, tasks);
            }
        });
    };

    if (tasks && tasks.length > 0) {
        let paginatedTasks = tasks;
        if (!groupBy) {
            let pagination = frappe.pages['dak_task_list'].pagination;
            let start = (pagination.page - 1) * pagination.limit;
            let end = start + pagination.limit;
            paginatedTasks = tasks.slice(start, end);
            render_pagination_controls(tasks.length);
        } else {
            $('#pagination-controls').empty();
        }

        let html = ''; // For Card View
        let table_html = ''; // For List View

        const render_group = (groupName, groupTasks) => {
            // Card View Group Header
            if (groupBy) {
                html += `<h3 style="width: 100%; font-size: 1.1rem; font-weight: 700; opacity: 0.7; margin: 20px 0 10px 0; border-bottom: 2px solid #eee; padding-bottom: 5px;">${groupName} (${groupTasks.length})</h3>`;
                html += `<div style="display: flex; flex-wrap: wrap; gap: 30px; width: 100%;">`;
            }
            groupTasks.forEach(task => { html += frappe.pages['dak_task_list'].get_task_card_html(task); });
            if (groupBy) html += `</div>`;

            // List View Group Header
            if (groupBy) {
                table_html += `<tr class="group-header" style="background:#f9fafb;"><td colspan="${frappe.pages['dak_task_list'].visible_columns.length + 2}" style="font-weight:700; padding:10px 15px; border-bottom:2px solid #e5e7eb;">${groupName} (${groupTasks.length})</td></tr>`;
            }
            groupTasks.forEach(task => { table_html += frappe.pages['dak_task_list'].get_task_row_html(task); });
        };

        if (groupBy) {
            let groups = {};
            tasks.forEach(task => {
                let key = task[groupBy] || 'Unassigned';
                if (!groups[key]) groups[key] = [];
                groups[key].push(task);
            });
            Object.keys(groups).sort().forEach(key => render_group(key, groups[key]));
        } else {
            // Card View
            html += `<div style="display: flex; flex-wrap: wrap; gap: 30px; width: 100%;">`;
            paginatedTasks.forEach(task => { html += frappe.pages['dak_task_list'].get_task_card_html(task); });
            html += `</div>`;

            // List View
            paginatedTasks.forEach(task => { table_html += frappe.pages['dak_task_list'].get_task_row_html(task); });
        }

        container.html(html);
        table_body.html(table_html);

        // Render Kanban (unchanged structure, just ensured data flow)
        let kanban_html = '';
        let kanban_current_field = frappe.pages['dak_task_list'].kanban_field || 'status';
        let kanban_cols = kanban_current_field === 'status' ? ['Open', 'Working', 'Pending Review', 'Overdue', 'Completed'] : ['Low', 'Medium', 'High', 'Urgent'];
        $('#current-kanban-group').text(kanban_current_field === 'status' ? 'Status' : 'Priority');

        kanban_cols.forEach(groupVal => {
            let statusTasks = tasks.filter(t => t[kanban_current_field] === groupVal);
            kanban_html += `
                <div class="kanban-column" ondrop="frappe.pages['dak_task_list'].kanban_drop(event, '${groupVal}')" ondragover="frappe.pages['dak_task_list'].kanban_allow_drop(event)">
                    <div class="kanban-column-header"><span>${groupVal}</span><span style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:10px; font-size:0.8rem;">${statusTasks.length}</span></div>
                    <div class="kanban-column-body">
             `;
            statusTasks.forEach(task => { kanban_html += frappe.pages['dak_task_list'].get_kanban_card_html(task, kanban_current_field); });
            kanban_html += `</div></div>`;
        });
        kanban_wrapper.html(kanban_html);

        frappe.pages['dak_task_list'].toggle_view(frappe.pages['dak_task_list'].current_view);

    } else {
        container.html('<div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5);">No tasks found matching criteria.</div>');
        table_body.html(`<tr><td colspan="100%" style="text-align: center; padding: 20px; color: #6b7280;">No tasks found matching criteria.</td></tr>`);
        $('#kanban-columns-wrapper').html('<div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5); width: 100%;">No tasks found.</div>');
        frappe.pages['dak_task_list'].toggle_view(frappe.pages['dak_task_list'].current_view);
    }
};

// --- HTML Generators (Helpers) ---

frappe.pages['dak_task_list'].get_task_card_html = function (task) {
    let gradient = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)';
    let statusColor = { bg: '#e0f2fe', text: '#0369a1' };
    let priorityColor = { bg: '#f3e8ff', text: '#7e22ce' };

    if (task.priority === 'High' || task.priority === 'Urgent') {
        gradient = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        priorityColor = { bg: '#fee2e2', text: '#b91c1c' };
    } else if (task.status === 'Open') {
        gradient = 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)';
        statusColor = { bg: '#dcfce7', text: '#166534' };
    } else if (task.status === 'Overdue') {
        gradient = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
        statusColor = { bg: '#ffedd5', text: '#c2410c' };
    }

    let dateDisplay = task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : 'No Date';

    return `
    <div class="task-card-item" style="
        width: calc(50% - 15px);
        background: ${gradient};
        padding: 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border-radius: 16px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        overflow: hidden;
        border: none;
        color: #ffffff;
        margin-bottom: 0px;
        cursor: pointer;
        transition: transform 0.2s;
    " onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')"
        onmouseover="this.style.transform='translateY(-3px)'" 
        onmouseout="this.style.transform='translateY(0)'">
        
        <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -50px; right: 20%; width: 250px; height: 250px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

        <div style="flex: 1; padding: 25px; min-width: 300px; position: relative; z-index: 1;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                <span style="background: rgba(255,255,255,0.2); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${task.name}</span>
                <span style="background: ${statusColor.bg}; color: ${statusColor.text}; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${task.status}</span>
                <span style="background: ${priorityColor.bg}; color: ${priorityColor.text}; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${task.priority}</span>
            </div>

            <h3 style="font-size: 1.4rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">${task.subject}</h3>
            <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${task.description || 'No description provided.'}</p>
        </div>
    </div>
    `;
};

frappe.pages['dak_task_list'].get_task_row_html = function (task) {
    let assignee = task.owner ? task.owner.charAt(0).toUpperCase() : '?';
    let isWorking = task.is_working_now == 1;
    let workingIcon = isWorking
        ? `<i class="fa fa-dot-circle-o" style="color: #10b981; font-size: 1.2rem;"></i>`
        : `<i class="fa fa-circle-o" style="color: #d1d5db; font-size: 1.2rem; transition: color 0.2s;" class="working-selector"></i>`;

    let tr = `<tr class="frappe-list-row" onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')">`;

    // 1. Working Action Column
    tr += `
        <td style="text-align: center; vertical-align: middle;" onclick="event.stopPropagation(); frappe.pages['dak_task_list'].set_working_task('${task.name}')">
            <div style="cursor: pointer; padding: 5px;" title="${isWorking ? 'Currently Working' : 'Set as Working'}">
                ${workingIcon}
            </div>
        </td>
    `;

    // 2. Dynamic Columns
    frappe.pages['dak_task_list'].visible_columns.forEach(col => {
        if (col.field === 'is_working_now') return;

        let cellContent = '';

        if (col.field === 'subject') {
            cellContent = `
               <div class="subject-cell">
                    <div class="user-avatar-circle">${assignee}</div>
                    <div style="display:flex; flex-direction:column; justify-content:center;">
                        <span class="subject-main">${task.subject}</span>
                    </div>
               </div>`;
        } else if (col.field === 'status') {
            cellContent = frappe.pages['dak_task_list'].getStatusIndicator(task.status);
        } else if (col.field === 'priority') {
            cellContent = `<span class="priority-text ${frappe.pages['dak_task_list'].getPriorityClass(task.priority)}">${task.priority}</span>`;
        } else if (col.field === 'exp_end_date') {
            let dateClass = 'due-date';
            if (task.status === 'Overdue') dateClass += ' overdue';
            cellContent = `<span class="${dateClass}">${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : '-'}</span>`;
        } else {
            cellContent = task[col.field] || '-';
        }

        tr += `<td>${cellContent}</td>`;
    });

    let isCompleted = task.status === 'Completed';
    let actionIcon = isCompleted ? 'fa-check-circle' : 'fa-check-circle-o';
    let actionColor = isCompleted ? '#10b981' : '#d1d5db';
    let actionCursor = isCompleted ? 'default' : 'pointer';
    let onClick = isCompleted ? '' : `onclick="frappe.pages['dak_task_list'].mark_task_complete(event, '${task.name}')"`;
    // Only add hover effect if not completed
    let onHover = isCompleted ? '' : `onmouseover="this.style.color='#10b981'" onmouseout="this.style.color='#d1d5db'"`;
    let title = isCompleted ? 'Completed' : 'Mark as Completed';

    tr += `
        <td style="text-align: right; vertical-align: middle; padding-right: 15px;" onclick="event.stopPropagation()">
            <div ${onClick} style="cursor: ${actionCursor}; color: ${actionColor}; transition: color 0.2s; font-size: 1.1rem; display: inline-block;" ${onHover} title="${title}">
                <i class="fa ${actionIcon}"></i>
            </div>
        </td></tr>`;
    return tr;
};



frappe.pages['dak_task_list'].mark_task_complete = function (e, task_name) {
    if (e) e.stopPropagation();

    frappe.confirm(
        `Are you sure you want to mark task <b>${task_name}</b> as Completed?`,
        () => {
            let now = frappe.datetime.now_datetime();
            frappe.call({
                method: 'frappe.client.set_value',
                args: {
                    doctype: 'Task',
                    name: task_name,
                    fieldname: {
                        status: 'Completed',
                        completed_on: now
                    }
                },
                callback: function (r) {
                    if (!r.exc) {
                        frappe.show_alert({ message: __('Task Marked Completed'), indicator: 'green' });
                        // Optimistic Update
                        let t = frappe.pages['dak_task_list'].all_tasks.find(x => x.name === task_name);
                        if (t) {
                            t.status = 'Completed';
                            t.completed_on = now;
                        }
                        frappe.pages['dak_task_list'].apply_task_filters();
                    }
                }
            });
        }
    );
};

// --- Helpers for UI (New from Test Page) ---
frappe.pages['dak_task_list'].getStatusIndicator = function (status) {
    let color = 'gray';
    if (status === 'Working') color = 'blue';
    if (status === 'Overdue') color = 'red';
    if (status === 'Completed') color = 'green';
    if ((status || '').includes('Pending')) color = 'orange';
    return `<span class="indicator ${color}">${status}</span>`;
};

frappe.pages['dak_task_list'].getPriorityClass = function (p) {
    if (p === 'High') return 'priority-high';
    if (p === 'Medium') return 'priority-medium';
    return 'priority-low';
}

frappe.pages['dak_task_list'].get_kanban_card_html = function (task, group_field) {
    let borderColor = '#2563eb';
    if (group_field === 'status') {
        if (task.priority === 'High' || task.priority === 'Urgent') borderColor = '#dc2626';
        else if (task.priority === 'Medium') borderColor = '#f59e0b';
    } else {
        if (task.priority === 'High' || task.priority === 'Urgent') borderColor = '#dc2626';
        else if (task.priority === 'Medium') borderColor = '#f59e0b';
        else if (task.priority === 'Low') borderColor = '#10b981';
    }

    return `
        <div class="kanban-card"
    draggable="true"
    ondragstart="frappe.pages['dak_task_list'].kanban_drag_start(event, '${task.name}')"
    onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')"
    style="border-left-color: ${borderColor};">
        <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 5px; color: #1f2937;">${task.subject}</div>
        <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">
            ${task.description || ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #9ca3af;">
            <span>${task.name}</span>
            <span>${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : ''}</span>
        </div>
    </div>
        `;
};

// --- Column Management Functions ---

frappe.pages['dak_task_list'].show_column_context_menu = function (x, y, colIndex) {
    // Remove existing
    $('.custom-context-menu').remove();

    let menu = $(`
        <div class="custom-context-menu" style="
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    z-index: 9999;
    width: 180px;
    padding: 5px 0;
    ">
        <div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('left', ${colIndex})" style="padding: 8px 15px; cursor: pointer; hover:background: #f3f4f6;">Insert Left</div>
            <div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('right', ${colIndex})" style="padding: 8px 15px; cursor: pointer;">Insert Right</div>
            <div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('remove', ${colIndex})" style="padding: 8px 15px; cursor: pointer; color: #ef4444; border-top: 1px solid #f3f4f6;">Remove Column</div>
        </div>
        `).appendTo('body');

    // Close on click outside
    $(document).one('click', function () {
        menu.remove();
    });
};

frappe.pages['dak_task_list'].handle_column_action = function (action, index) {
    if (action === 'remove') {
        if (frappe.pages['dak_task_list'].visible_columns.length <= 1) {
            frappe.msgprint('Cannot remove the last column.');
            return;
        }
        frappe.pages['dak_task_list'].visible_columns.splice(index, 1);
        frappe.pages['dak_task_list'].apply_task_filters(); // Re-render
    } else {
        // Show Field Selector Dialog
        let d = new frappe.ui.Dialog({
            title: 'Select Column to Add',
            fields: [
                {
                    label: 'Field',
                    fieldname: 'field_select',
                    fieldtype: 'Select',
                    options: [
                        { label: 'Task ID', value: 'name' },
                        { label: 'Subject', value: 'subject' },
                        { label: 'Status', value: 'status' },
                        { label: 'Priority', value: 'priority' },
                        { label: 'Due Date', value: 'exp_end_date' },
                        { label: 'Project', value: 'project' },
                        { label: 'Created On', value: 'creation' },
                        { label: 'Last Modified', value: 'modified' }
                    ]
                }
            ],
            primary_action_label: 'Add',
            primary_action(values) {
                let field_def = {
                    label: d.fields_dict.field_select.df.options.find(o => o.value === values.field_select).label,
                    field: values.field_select,
                    width: '15%'
                };

                if (action === 'left') {
                    frappe.pages['dak_task_list'].visible_columns.splice(index, 0, field_def);
                } else {
                    frappe.pages['dak_task_list'].visible_columns.splice(index + 1, 0, field_def);
                }

                frappe.pages['dak_task_list'].apply_task_filters(); // Re-render
                d.hide();
            }
        });
        d.show();
    }
};

frappe.pages['dak_task_list'].refresh_tasks = function (wrapper) {
    frappe.pages['dak_task_list'].render_task_list(wrapper);
}


frappe.pages['dak_task_list'].toggle_details_drawer = function (show) {
    let overlay = $('#list-details-overlay');
    let drawer = $('#list-task-details-drawer');

    if (show) {
        overlay.css('display', 'flex');
        setTimeout(() => { overlay.addClass('open'); drawer.addClass('open'); }, 10);
    } else {
        overlay.removeClass('open');
        drawer.removeClass('open');
        setTimeout(() => { overlay.hide(); }, 300);
    }
};

frappe.pages['dak_task_list'].show_task_details = function (task_name) {
    if (!task_name) return;

    // Use local data if available to avoid delay
    let task = frappe.pages['dak_task_list'].all_tasks ? frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name) : null;

    // Fallback to fetch if not found
    if (!task) {
        frappe.db.get_doc('Task', task_name).then(doc => {
            if (doc) {
                // Populate and Show
                populate_details_drawer(doc);
            }
        });
    } else {
        // Populate and Show
        populate_details_drawer(task);
    }

    function populate_details_drawer(t) {
        $('#list-detail-subject').text(t.subject);
        $('#list-detail-project').text(t.project || 'No Project');
        $('#list-detail-status').text(t.status);
        $('#list-detail-priority').text(t.priority);
        let prioColor = '#10b981'; // Low
        if (t.priority === 'Medium') prioColor = '#f59e0b';
        if (t.priority === 'High' || t.priority === 'Urgent') prioColor = '#dc2626';
        $('#list-detail-priority').css({ 'color': prioColor, 'border-color': prioColor });

        $('#list-detail-date').html(`<i class="fa fa-calendar"></i> ${t.exp_end_date ? frappe.datetime.str_to_user(t.exp_end_date) : 'No Date'}`);
        $('#list-detail-exp-time').text(t.expected_time || 0);
        $('#list-detail-description').text(t.description || 'No description provided.');

        // Assigned To
        let assigned_div = $('#list-detail-assigned');
        assigned_div.empty();
        // Check if _assign is present
        if (t._assign) {
            let assigned_users = [];
            try {
                assigned_users = typeof t._assign === 'string' ? JSON.parse(t._assign) : t._assign;
            } catch (e) { }

            if (Array.isArray(assigned_users)) {
                assigned_users.forEach(user => {
                    let avatar = frappe.avatar(user, 'avatar-small');
                    assigned_div.append(avatar);
                });
            }
        } else {
            assigned_div.text('No one assigned');
        }

        // Actions
        $('#btn-edit-task-details').off('click').on('click', function () {
            frappe.pages['dak_task_list'].toggle_details_drawer(false);
            setTimeout(() => {
                frappe.pages['dak_task_list'].toggle_task_drawer(true, t.name);
            }, 300);
        });

        $('#btn-view-full-task-list').off('click').on('click', function () {
            frappe.set_route('Form', 'Task', t.name);
        });

        frappe.pages['dak_task_list'].toggle_details_drawer(true);
    }
};

frappe.pages['dak_task_list'].setup_autocomplete = function () {
    // Customer Autocomplete
    let customer_input = document.getElementById('drawer-customer');
    if (customer_input) {
        frappe.pages['dak_task_list'].awesomplete_customer = new Awesomplete(customer_input, {
            minChars: 0,
            autoFirst: true
        });
        $(customer_input).on('focus', function () {
            // Fetch Customers
            frappe.call({
                method: 'frappe.desk.search.search_link',
                args: { doctype: 'Customer', txt: '', options: { page_length: 50 } },
                callback: function (r) {
                    if (r.message) {
                        frappe.pages['dak_task_list'].awesomplete_customer.list = r.message.map(d => d.value);
                        frappe.pages['dak_task_list'].awesomplete_customer.evaluate();
                    }
                }
            });
        });
    }

    // Project Autocomplete
    let project_input = document.getElementById('drawer-project');
    if (project_input) {
        frappe.pages['dak_task_list'].awesomplete_project = new Awesomplete(project_input, {
            minChars: 0,
            autoFirst: true
        });
        $(project_input).on('focus', function () {
            // Fetch Projects
            frappe.call({
                method: 'frappe.desk.search.search_link',
                args: { doctype: 'Project', txt: '', options: { page_length: 50 } },
                callback: function (r) {
                    if (r.message) {
                        frappe.pages['dak_task_list'].awesomplete_project.list = r.message.map(d => d.value);
                        frappe.pages['dak_task_list'].awesomplete_project.evaluate();
                    }
                }
            });
        });
    }

    // Activity Type Autocomplete (Timesheet)
    let activity_input = document.getElementById('ts-activity-type');
    if (activity_input) {
        frappe.pages['dak_task_list'].awesomplete_activity = new Awesomplete(activity_input, {
            minChars: 0,
            autoFirst: true
        });
        $(activity_input).on('focus', function () {
            frappe.call({
                method: 'frappe.desk.search.search_link',
                args: { doctype: 'Activity Type', txt: '', options: { page_length: 50 } },
                callback: function (r) {
                    if (r.message) {
                        frappe.pages['dak_task_list'].awesomplete_activity.list = r.message.map(d => d.value);
                        frappe.pages['dak_task_list'].awesomplete_activity.evaluate();
                    }
                }
            });
        });
    }
}


frappe.pages['dak_task_list'].editing_task = null;

frappe.pages['dak_task_list'].toggle_task_drawer = function (show, task_name = null) {
    let overlay = $('#task-drawer-overlay');

    if (show) {
        // Setup Autocomplete if not already
        if (!frappe.pages['dak_task_list'].awesomplete_customer) {
            frappe.pages['dak_task_list'].setup_autocomplete();
        }

        // Reset Steps
        $('#drawer-step-1').show();
        $('#drawer-step-2').hide();
        $('#drawer-footer-step-1').css('display', 'flex');
        $('#drawer-footer-step-2').hide();

        // Show Overlay (Transition handled by CSS on .open)
        overlay.css('display', 'flex');
        // Small delay to allow display:flex to apply before adding opacity class for transition
        setTimeout(() => {
            overlay.addClass('open');
        }, 10);

        // Handle Edit Mode
        if (task_name) {
            frappe.pages['dak_task_list'].editing_task = task_name;
            let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);
            if (task) {
                $('#drawer-subject').val(task.subject);
                $('#drawer-description').val(task.description);
                $('#drawer-status').val(task.status);
                $('#drawer-priority').val(task.priority);
                $('#drawer-date').val(task.exp_end_date);

                // New Fields
                $('#drawer-customer').val(task.customer || '');
                $('#drawer-project').val(task.project || '');
                $('#drawer-hours').val(task.expected_time || '');

                $('#drawer-title').text('Edit Task');
                $('#drawer-submit-btn').text('Update Task');

                // Show Log Time Button
                $('#btn-log-time-step-1').show();
            }
        } else {
            // Create Mode
            frappe.pages['dak_task_list'].editing_task = null;
            $('#drawer-subject').val('');
            $('#drawer-description').val('');
            $('#drawer-date').val('');
            $('#drawer-status').val('Open');
            $('#drawer-priority').val('Medium');

            // Clear New Fields
            $('#drawer-customer').val('');
            $('#drawer-project').val('');
            $('#drawer-hours').val('');

            $('#drawer-title').text('Create New Task');
            $('#drawer-submit-btn').text('Create Task');

            // Hide Log Time Button
            $('#btn-log-time-step-1').hide();
        }

    } else {
        // Hide
        overlay.removeClass('open');
        // Wait for transition
        setTimeout(() => {
            overlay.hide();
        }, 300);
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

    // New Fields
    let customer = $('#drawer-customer').val();
    let project = $('#drawer-project').val();
    let hours = $('#drawer-hours').val();

    let editing_task = frappe.pages['dak_task_list'].editing_task;

    if (!subject) {
        frappe.msgprint(__('Subject is required'));
        return;
    }

    let values = {
        subject: subject,
        status: status,
        priority: priority,
        exp_end_date: date,
        description: description,
        customer: customer,
        project: project,
        expected_time: hours
    };

    if (editing_task) {
        // Update Existing Task
        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                doctype: 'Task',
                name: editing_task,
                fieldname: values
            },
            callback: function (r) {
                if (!r.exc) {
                    frappe.pages['dak_task_list'].toggle_task_drawer(false);
                    frappe.show_alert({ message: __('Task Updated Successfully'), indicator: 'green' });

                    // Optimistic Local Update
                    let t = frappe.pages['dak_task_list'].all_tasks.find(x => x.name === editing_task);
                    if (t) {
                        Object.assign(t, values);
                        frappe.pages['dak_task_list'].apply_task_filters();
                    }
                }
            }
        });
    } else {
        // Create New Task
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: Object.assign({ doctype: 'Task' }, values)
            },
            callback: function (r) {
                if (!r.exc) {
                    frappe.pages['dak_task_list'].toggle_task_drawer(false);
                    frappe.show_alert({ message: __('Task Created Successfully'), indicator: 'green' });
                    frappe.pages['dak_task_list'].refresh_tasks(frappe.pages['dak_task_list'].page_wrapper);
                }
            }
        });
    }
};

// --- Timesheet Functions ---

frappe.pages['dak_task_list'].toggle_timesheet_modal = function (show) {
    let overlay = $('#timesheet-modal-overlay');
    if (show) {
        overlay.css('display', 'flex');
        setTimeout(() => { overlay.addClass('open'); }, 10);
    } else {
        overlay.removeClass('open');
        setTimeout(() => { overlay.hide(); }, 300);
    }
};

frappe.pages['dak_task_list'].open_timesheet_modal = function () {
    let task_name = frappe.pages['dak_task_list'].editing_task;
    if (!task_name) return;

    let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);

    // Reset Fields
    $('#ts-task-name').val(task.subject + ' (' + task_name + ')');
    $('#ts-date').val(frappe.datetime.get_today());
    $('#ts-hours').val('');
    $('#ts-activity-type').val('');
    $('#ts-description').val('');

    frappe.pages['dak_task_list'].toggle_timesheet_modal(true);
};

frappe.pages['dak_task_list'].submit_timesheet_entry = function () {
    let task_name = frappe.pages['dak_task_list'].editing_task;
    let date = $('#ts-date').val();
    let hours = $('#ts-hours').val();
    let activity = $('#ts-activity-type').val();
    let description = $('#ts-description').val();

    if (!hours || parseFloat(hours) <= 0) {
        frappe.msgprint('Please enter valid hours.');
        return;
    }

    // Prepare Timesheet Doc (Simplified)
    // Assuming standard ERPNext Timesheet structure
    // We usually need 'company', 'employee' etc. 
    // We'll rely on server default for Employee if possible, or fetch it.
    // For now, let's try basic insert and see if it works or user needs to map employee manually.

    frappe.call({
        method: 'frappe.client.insert',
        args: {
            doc: {
                doctype: 'Timesheet',
                company: frappe.defaults.get_default('company'), // Might fail if no default
                note: description,
                time_logs: [
                    {
                        from_time: date + ' 09:00:00', // Dummy start (standard timesheet needs time ranges usually, or just hours if configured)
                        hours: parseFloat(hours),
                        activity_type: activity,
                        task: task_name,
                        project: $('#drawer-project').val(), // Link project if available from drawer
                        description: description
                    }
                ]
            }
        },
        callback: function (r) {
            if (!r.exc) {
                frappe.pages['dak_task_list'].toggle_timesheet_modal(false);
                frappe.show_alert({ message: 'Time Logged Successfully', indicator: 'green' });
            }
        }
    });
};

// --- Timer State ---
frappe.pages['dak_task_list'].timer = {
    running: false,
    task_name: null,
    start_time: null,
    timesheet: null,
    activity: null,
    interval: null
};

// --- Latest Task Card Renderer ---
frappe.pages['dak_task_list'].render_latest_task_card = function (task) {
    let container = $('#latest-task-container');
    if (!task) {
        container.hide();
        return;
    }

    // Check Timer State
    let is_running = frappe.pages['dak_task_list'].timer.running && frappe.pages['dak_task_list'].timer.task_name === task.name;

    let action_btn_html = '';
    if (is_running) {
        // Start Interval if not running
        if (!frappe.pages['dak_task_list'].timer.interval) {
            frappe.pages['dak_task_list'].start_clock_interval();
        }

        // STOP BUTTON (Icon Only)
        action_btn_html = `
        <button onclick="frappe.pages['dak_task_list'].stop_timer_action('${task.name}')" class="ltc-btn ltc-btn-stop" title="Stop Timer">
            <i class="fa fa-stop" style="font-size: 1.1em;"></i>
        </button>
        `;
    } else {
        // START BUTTON (Icon Only)
        action_btn_html = `
        <button onclick="frappe.pages['dak_task_list'].start_timer_action('${task.name}')" class="ltc-btn ltc-btn-start" title="Start Timer">
            <i class="fa fa-play" style="font-size: 1.1em; margin-left: 2px;"></i>
        </button>
        `;
    }

    let html = `
    <div class="latest-task-card" style="margin-bottom: 0;">
        <!-- 3 Decorative Circles -->
        <div class="ltc-circle ltc-circle-1"></div>
        <div class="ltc-circle ltc-circle-2"></div>
        <div class="ltc-circle ltc-circle-3"></div>
        
        <div class="ltc-content">
            <div class="ltc-header">
                <span class="ltc-badge">Active Task</span>
                <span class="ltc-status">${task.status}</span>
                <span class="ltc-date"><i class="fa fa-calendar" style="margin-right: 5px;"></i> ${frappe.datetime.str_to_user(task.creation).split(' ')[0]}</span>
            </div>
            <h2 class="ltc-title">${task.subject}</h2>
            <p class="ltc-desc">
                ${task.description || 'No detailed description available for this task.'}
            </p>
        </div>

        <div class="ltc-actions" style="flex-direction: column; align-items: flex-end; gap: 10px;">
             <div style="display: flex; gap: 15px;">
                 ${action_btn_html}

                 <button onclick="frappe.pages['dak_task_list'].toggle_task_drawer(true, '${task.name}')" class="ltc-btn ltc-btn-view" title="Edit Task">
                    <i class="fa fa-pencil" style="font-size: 1.1em;"></i>
                 </button>
             </div>
             
             ${is_running ? `
             <div class="ltc-timer">
                <div class="ltc-timer-box" style="padding: 2px 10px; font-size: 1.2rem;">
                     <span id="digital-timer-display">00:00:00</span>
                </div>
             </div>` : ''}
        </div>
    </div>
            <style>
                @keyframes ping {
                    75 %, 100 % { transform: scale(2); opacity: 0; }
                }
            </style>
        `;

    container.html(html).show();
};

// --- Timer Helper Functions ---

frappe.pages['dak_task_list'].start_clock_interval = function () {
    if (frappe.pages['dak_task_list'].timer.interval) clearInterval(frappe.pages['dak_task_list'].timer.interval);

    frappe.pages['dak_task_list'].timer.interval = setInterval(function () {
        let timer = frappe.pages['dak_task_list'].timer;
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

        $('#digital-timer-display').text(formatted);
    }, 1000);
};

frappe.pages['dak_task_list'].start_timer_action = function (task_name) {
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
                    note: 'Timer started from Task List',
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
                    frappe.pages['dak_task_list'].timer = {
                        running: true,
                        task_name: task_name,
                        start_time: start_time,
                        timesheet: r.message.name,
                        activity: activity,
                        interval: null
                    };

                    frappe.show_alert({ message: `Timer Started for ${activity}`, indicator: 'green' });

                    // Re-render to show Stop button
                    // Need to find the task object again
                    let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);
                    frappe.pages['dak_task_list'].render_latest_task_card(task);
                }
            }
        });

    }, 'Start Timer', 'Start');
};

frappe.pages['dak_task_list'].stop_timer_action = function (task_name) {
    let timer = frappe.pages['dak_task_list'].timer;
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

    // Update Timesheet
    // We need to fetch the timesheet first to get the row name (name of child table entry)
    // Actually, for simple update we can just overwrite the whole doc or use child table update if we knew the row name.
    // Client.insert gives us the doc, let's assume row is index 0. 
    // Safer: Just update the parent doc with the same time_logs array but with hours filled? 
    // Or better: Let's re-fetch the timesheet to be safe about the row name.

    frappe.call({
        method: 'frappe.client.get',
        args: { doctype: 'Timesheet', name: timer.timesheet },
        callback: function (r) {
            if (r.message) {
                let ts = r.message;
                if (ts.time_logs && ts.time_logs.length > 0) {
                    // Update the first log (since we created it fresh)
                    ts.time_logs[0].hours = duration_hours;
                    ts.time_logs[0].to_time = end_time; // Optional, strict timesheets might need this or just hours

                    // Save
                    frappe.call({
                        method: 'frappe.client.save',
                        args: { doc: ts },
                        callback: function (save_r) {
                            if (!save_r.exc) {
                                // Submit? Or leave as draft? Let's leave as Draft so user can edit.
                                frappe.show_alert({ message: `Timer Stopped.Logged ${duration_hours.toFixed(2)} hrs.`, indicator: 'blue' });

                                // Reset State
                                frappe.pages['dak_task_list'].timer = {
                                    running: false,
                                    task_name: null,
                                    start_time: null,
                                    timesheet: null,
                                    activity: null,
                                    interval: null
                                };

                                // Re-render
                                let task = frappe.pages['dak_task_list'].all_tasks.find(t => t.name === task_name);
                                frappe.pages['dak_task_list'].render_latest_task_card(task);
                            }
                        }
                    });
                }
            }
        }
    });
};
