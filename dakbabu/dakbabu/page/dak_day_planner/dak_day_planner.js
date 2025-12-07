frappe.pages['dak_day_planner'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '',
        single_column: false
    });

    // 1. Render Navigation Immediately
    frappe.pages['dak_day_planner'].render_nav_bar(wrapper);

    // 2. Check dependencies for the rest of the content
    if (!frappe.provide('dakbabu.components') || !dakbabu.components.get_reminder_card) {
        frappe.require('/assets/dakbabu/js/dak_components.js', () => {
            frappe.pages['dak_day_planner'].render_page_content_only(wrapper);
        });
    } else {
        frappe.pages['dak_day_planner'].render_page_content_only(wrapper);
    }
}

frappe.pages['dak_day_planner'].render_nav_bar = function (wrapper) {
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
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_task_list')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-list" style="margin-right: 8px; font-size: 1rem;"></i> All Tasks
                    </div>
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;" onclick="frappe.set_route('dak_day_planner')">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                    </div>
                </div>
            </div>

            <!-- Right Controls -->
            <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                 <!-- Add Task Button -->
                <button onclick="frappe.msgprint('Task Drawer not implemented on this page yet')" style="
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
        <div id="planner-body" style="width: 100%; box-sizing: border-box;">

            </div>
            <!-- Removed Second Skeleton Card for new layout -->
        </div>
    `);
}

frappe.pages['dak_day_planner'].render_page_content_only = function (wrapper) {
    if (!dakbabu.components || !dakbabu.components.get_reminder_card) {
        console.error("Failed to load Dak Components");
        frappe.msgprint("Failed to load Planner Components. Please reload dependencies.");
        return;
    }

    $(wrapper).find('#planner-body').html(`
        <!-- Hello Container (Now Parent) -->
        <div style="background: #f3f4f6; padding: 20px; margin-bottom: 5px; border-radius: 12px 12px 0 0; box-shadow: 0 5px 15px rgba(0,0,0,0.03); color: #1f2937; width: 100%; box-sizing: border-box; display: flex; justify-content: space-between; align-items: flex-start;">
            
            <!-- Backlog Container (Nested, 40%) -->
            <div class="backlog-container" style="width: 40%; flex: 0 0 40%; margin-top: 0;">
                <div class="backlog-header">
                        <h3><i class="fa fa-list"></i> Backlog (5)</h3>
                        <span class="header-action">Drag here to unschedule</span>
                </div>
                <div id="backlog-task-list" class="backlog-list">
                    <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.7);">
                        <i class="fa fa-spinner fa-spin"></i> Loading Backlog...
                    </div>
                </div>
            </div>

            <!-- Schedule Container (Nested, 55%) -->
            <div class="schedule-container" style="width: 55%; flex: 0 0 55%; margin-top: 0;">
                <div class="schedule-header">
                        <h3><i class="fa fa-calendar-o"></i> Schedule</h3>
                        <button id="btn-schedule-time" class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: #fff; border: none;">
                            <i class="fa fa-clock-o"></i> Set Time
                        </button>
                </div>
                <div class="schedule-grid">
                        <!-- 9 AM -->
                        <div class="time-slot">
                        <div class="time-label">09:00 AM</div>
                        <div class="slot-content">
                            <!-- Event Card -->
                            <div class="event-card" style="top: 5px; height: 90px; background: #6366f1;">
                                <div class="event-title">Team Standup</div>
                                <div class="event-subtitle">General</div>
                                <div class="event-meta">
                                    <span class="event-tag">15m</span>
                                    <span class="event-tag">NORMAL</span>
                                </div>
                            </div>
                        </div>
                        </div>
                        <!-- 10 AM -->
                        <div class="time-slot">
                        <div class="time-label">10:00 AM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 11 AM -->
                        <div class="time-slot">
                        <div class="time-label">11:00 AM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 12 PM -->
                        <div class="time-slot">
                        <div class="time-label">12:00 PM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 01 PM -->
                        <div class="time-slot">
                        <div class="time-label">01:00 PM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 02 PM -->
                        <div class="time-slot">
                        <div class="time-label">02:00 PM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 03 PM -->
                        <div class="time-slot">
                        <div class="time-label">03:00 PM</div>
                        <div class="slot-content"></div>
                        </div>
                        <!-- 04 PM -->
                        <div class="time-slot">
                        <div class="time-label">04:00 PM</div>
                        <div class="slot-content" style="border-bottom: none;"></div>
                        </div>
                </div>
            </div>

        </div>


        



    `);

    // Fetch Data for Card 1 (Reminder Card)

    frappe.pages['dak_day_planner'].render_backlog_tasks();
    frappe.pages['dak_day_planner'].setup_schedule_time_picker(wrapper);
}

frappe.pages['dak_day_planner'].setup_schedule_time_picker = function (wrapper) {
    $(wrapper).find('#btn-schedule-time').on('click', function () {
        let d = new frappe.ui.Dialog({
            title: 'Set Schedule Time',
            fields: [
                {
                    label: 'Start Time',
                    fieldname: 'start_time',
                    fieldtype: 'Time',
                    reqd: 1,
                    default: '09:00:00'
                },
                {
                    label: 'End Time',
                    fieldname: 'end_time',
                    fieldtype: 'Time',
                    reqd: 1,
                    default: '17:00:00'
                }
            ],
            primary_action_label: 'Update',
            primary_action: (values) => {
                let start = values.start_time.substring(0, 5);
                let end = values.end_time.substring(0, 5);
                $(wrapper).find('#btn-schedule-time').html(`<i class="fa fa-clock-o"></i> ${start} - ${end}`);
                frappe.show_alert({ message: `Schedule updated: ${start} - ${end}`, indicator: 'green' });
                d.hide();
            }
        });
        d.$wrapper.addClass('planner-dialog');
        d.show();
    });
}

frappe.pages['dak_day_planner'].render_backlog_tasks = function () {
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.get_backlog_tasks",
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                let html = '';
                r.message.forEach(task => {
                    let priorityClass = 'priority-normal';
                    if (task.priority === 'High') priorityClass = 'priority-high';
                    if (task.priority === 'Low') priorityClass = 'priority-low';
                    if (task.priority === 'Urgent' || task.priority === 'Critical') priorityClass = 'priority-critical';

                    // Theme Logic
                    let cardThemeClass = 'card-theme-blue'; // Default
                    if (task.exp_end_date) {
                        let today = frappe.datetime.get_today();
                        if (task.exp_end_date < today) {
                            cardThemeClass = 'card-theme-orange'; // Overdue
                        } else if (task.exp_end_date === today) {
                            cardThemeClass = 'card-theme-orange'; // Due Today
                        } else {
                            cardThemeClass = 'card-theme-green'; // Future
                        }
                    }

                    let assigneeHtml = '';
                    // Attempt to parse _assign if it exists and is a string
                    // Note: In some Frappe versions _assign is a JSON string of a list of emails ["santosh@example.com"]
                    if (task._assign) {
                        try {
                            let assignees = JSON.parse(task._assign);
                            if (assignees && assignees.length > 0) {
                                // Just show the first one
                                let initial = assignees[0].substring(0, 2).toUpperCase();
                                assigneeHtml = `<div class="assignee-avatar" title="${assignees[0]}">${initial}</div>`;
                            }
                        } catch (e) {
                            // Ignore parse error
                        }
                    }

                    // Format Date
                    let dateDisplay = 'No Date';
                    if (task.exp_end_date) {
                        dateDisplay = frappe.datetime.str_to_user(task.exp_end_date);
                    }

                    html += `
                        <div class="backlog-card ${cardThemeClass}" data-name="${task.name}" onclick="frappe.set_route('Form', 'Task', '${task.name}')">
                            <div class="card-header-row">
                                <div class="card-tags-left">
                                    <span class="id-tag">${task.name}</span>
                                    <span class="priority-tag ${priorityClass}">${task.priority || 'NORMAL'}</span>
                                </div>
                                <i class="fa fa-ellipsis-v card-menu-icon"></i>
                            </div>
                            <div class="card-title">${task.subject}</div>
                            <div class="card-desc">${task.description || 'No description provided.'}</div>
                            
                            <div class="card-footer-block">
                                <div class="footer-item">
                                    <span class="status-dot ${task.status === 'Open' ? 'status-open' : 'status-other'}"></span>
                                    ${task.status}
                                </div>
                                <div class="footer-item">
                                    <i class="fa fa-calendar-o"></i> ${dateDisplay}
                                </div>
                            </div>
                        </div>
                    `;
                });
                $('#backlog-task-list').html(html);
                $('.backlog-header h3').html(`<i class="fa fa-list"></i> Backlog (${r.message.length})`);
            } else {
                $('#backlog-task-list').html('<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.7);">No tasks in backlog!</div>');
                $('.backlog-header h3').html(`<i class="fa fa-list"></i> Backlog (0)`);
            }
        }
    });
}