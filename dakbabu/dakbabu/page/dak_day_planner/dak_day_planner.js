frappe.pages["dak_day_planner"].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "",
        single_column: true,
    });

    frappe.pages["dak_day_planner"].wrapper = wrapper;

    // Initial Config
    frappe.pages["dak_day_planner"].config = {
        start_hour: 9,
        end_hour: 18,
        interval: 30, // minutes
        current_date: moment().format('YYYY-MM-DD'),
    };

    // Render Main Layout Shell
    $(wrapper).find(".layout-main-section").html(`
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
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_dashboard')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-home" style="margin-right: 8px; font-size: 1.1rem;"></i> Dashboard
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_task_list')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-list" style="margin-right: 8px; font-size: 1rem;"></i> All Tasks
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_projects')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-briefcase" style="margin-right: 8px; font-size: 1rem;"></i> Projects
                    </div>
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                    </div>
                </div>
            </div>

            <!-- Right Controls (Empty for Day Planner) -->
            <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                 <!-- Filter Dropdown (Placeholder for Day Planner) -->
                 <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dayPlannerFilterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="
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
                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dayPlannerFilterDropdown" style="margin-top: 10px; border-radius: 8px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden;">
                        <li style="border-bottom: 1px solid #f3f4f6;"><div style="padding: 8px 15px; font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Filter Time</div></li>
                        <li><a href="#" onclick="frappe.msgprint('Day Planner focuses on specific days. Use the date picker below for detailed navigation.'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">All Time</a></li>
                        <li><a href="#" onclick="frappe.msgprint('Already showing Today\'s Plan'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Today</a></li>
                         <li><a href="#" onclick="frappe.msgprint('Future planning coming soon!'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Tomorrow</a></li>
                         <li style="border-top: 1px solid #f3f4f6; margin-top: 5px; padding-top: 5px;"><a href="#" onclick="frappe.pages['dak_day_planner'].load_tasks(); frappe.pages['dak_day_planner'].render_grid(); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #4b5563;"><i class="fa fa-refresh" style="margin-right:8px;"></i> Reset / Reload</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Planner Body -->
        <div class="planner-wrapper">
            <!-- Left Column: Tasks -->
            <div class="task-pool-col">
                <div class="pool-header">
                    <h4 style="margin: 0; font-weight: 700; color: #374151;">Unscheduled Tasks</h4>
                    <span style="font-size: 0.8rem; color: #6b7280;">Drag tasks to time slots</span>
                </div>
                <div class="pool-body" id="planner-task-pool">
                    <div style="text-align: center; color: #9ca3af; margin-top: 50px;">
                        <i class="fa fa-spinner fa-spin"></i> Loading...
                    </div>
                </div>
            </div>

            <!-- Right Column: Time Grid -->
            <div class="planner-grid-col">
                <!-- Controls -->
                <div class="planner-controls">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 0.8rem; margin-bottom: 2px;">Start Time</label>
                        <select id="planner-start-time" class="form-control input-sm" style="width: 100px;">
                            ${generate_hour_options(6, 12, 9)}
                        </select>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 0.8rem; margin-bottom: 2px;">End Time</label>
                        <select id="planner-end-time" class="form-control input-sm" style="width: 100px;">
                            ${generate_hour_options(13, 23, 18)}
                        </select>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 0.8rem; margin-bottom: 2px;">Slot Duration</label>
                        <select id="planner-interval" class="form-control input-sm" style="width: 100px;">
                            <option value="15">15 Min</option>
                            <option value="30" selected>30 Min</option>
                            <option value="60">60 Min</option>
                        </select>
                    </div>
                    <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
                        <input type="date" id="planner-date-picker" class="form-control input-sm" style="width: 140px; font-weight: 600; color: #374151;" value="${moment().format('YYYY-MM-DD')}">
                        <span style="font-size: 0.9rem; font-weight: 600; min-width: 100px; text-align: right;" id="planner-date-display">Today</span>
                    </div>
                </div>

                <!-- Scrollable Grid -->
                <div class="planner-scroll-area" id="planner-grid-area">
                    <!-- Slots rendered here -->
                </div>
            </div>
        </div>
    `);

    // Helper to gen options
    function generate_hour_options(start, end, selected) {
        let html = "";
        for (let i = start; i <= end; i++) {
            let label = i < 12 ? i + " AM" : i === 12 ? "12 PM" : i - 12 + " PM";
            html += `<option value="${i}" ${i === selected ? "selected" : ""}>${label}</option>`;
        }
        return html;
    }

    // Event Listeners for Controls
    $("#planner-start-time, #planner-end-time, #planner-interval").on("change", function () {
        frappe.pages["dak_day_planner"].config.start_hour = parseInt(
            $("#planner-start-time").val()
        );
        frappe.pages["dak_day_planner"].config.end_hour = parseInt($("#planner-end-time").val());
        frappe.pages["dak_day_planner"].config.interval = parseInt($("#planner-interval").val());
        frappe.pages["dak_day_planner"].render_grid();
    });

    $("#planner-date-picker").on("change", function () {
        let dateVal = $(this).val();
        if (dateVal) {
            frappe.pages["dak_day_planner"].config.current_date = dateVal;

            // Update Display Label
            let display = moment(dateVal).format("ddd, MMM D");
            if (moment(dateVal).isSame(moment(), 'day')) display = "Today";
            $("#planner-date-display").text(display);

            // Re-render grid and reload tasks for that day
            frappe.pages["dak_day_planner"].load_tasks();
            frappe.pages["dak_day_planner"].render_grid();
            frappe.show_alert({ message: `Planning for ${display}`, indicator: "blue" });
        }
    });

    // Initial Load
    frappe.pages["dak_day_planner"].load_tasks();
    frappe.pages["dak_day_planner"].render_grid();
};

frappe.pages["dak_day_planner"].load_tasks = function () {
    let date = frappe.pages["dak_day_planner"].config.current_date;
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.get_unscheduled_tasks",
        args: {
            date: date
        },
        callback: function (r) {
            if (r.message) {
                frappe.pages["dak_day_planner"].tasks = r.message;
                frappe.pages["dak_day_planner"].render_pool();
            }
        },
    });
};

frappe.pages["dak_day_planner"].render_pool = function () {
    let container = $("#planner-task-pool");
    container.empty();

    if (
        !frappe.pages["dak_day_planner"].tasks ||
        frappe.pages["dak_day_planner"].tasks.length === 0
    ) {
        container.html(
            '<div style="text-align: center; color: #9ca3af; margin-top: 30px;">No unscheduled tasks found.</div>'
        );
        return;
    }

    frappe.pages["dak_day_planner"].tasks.forEach((task) => {
        let priorityColor = "#10b981"; // Low
        if (task.priority === "Medium") priorityColor = "#f59e0b";
        if (task.priority === "High" || task.priority === "Urgent") priorityColor = "#dc2626";

        let html = `
            <div class="planner-task-card" draggable="true" onclick="frappe.pages['dak_day_planner'].show_task_details('${task.name}')" data-task="${encodeURIComponent(
            JSON.stringify(task)
        )}" id="pt-${task.name}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                    <span style="
                        font-size: 0.65rem;
                        text-transform: uppercase;
                        font-weight: 700;
                        color: ${priorityColor};
                        background: ${priorityColor}15;
                        padding: 2px 6px;
                        border-radius: 4px;
                        border: 1px solid ${priorityColor}30;
                    ">${task.priority}</span>
                    <span style="font-size: 0.7rem; color: #6b7280;">${task.project || ""}</span>
                </div>
                <h5 style="margin: 0 0 5px 0; font-size: 0.95rem; line-height: 1.3;">${task.subject
            }</h5>
                <div style="font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; gap: 10px;">
                    <span><i class="fa fa-clock-o"></i> ${task.expected_time || "-"}h</span>
                    <span><i class="fa fa-calendar"></i> ${task.exp_end_date}</span>
                </div>
            </div>
        `;
        container.append(html);
    });

    // Re-bind Drag Events
    $(".planner-task-card").on("dragstart", function (e) {
        e.originalEvent.dataTransfer.setData("text/plain", $(this).attr("data-task"));
        e.originalEvent.dataTransfer.effectAllowed = "copy";
        $(this).addClass("is-dragging");
    });

    $(".planner-task-card").on("dragend", function (e) {
        $(this).removeClass("is-dragging");
    });
};

frappe.pages["dak_day_planner"].render_grid = function () {
    let container = $("#planner-grid-area");
    container.empty();

    let config = frappe.pages["dak_day_planner"].config;

    // FETCH EXISTING SCHEDULES FIRST
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.get_day_plan",
        args: { date: config.current_date },
        callback: function (r) {
            let scheduledItems = r.message || [];

            // Render basic slots
            let currentMoment = moment().hour(config.start_hour).minute(0).second(0);
            let endMoment = moment().hour(config.end_hour).minute(0).second(0);

            if (config.end_hour <= config.start_hour) endMoment.add(1, "day");

            while (currentMoment.isBefore(endMoment)) {
                let timeLabel = currentMoment.format("h:mm A");
                let slotId = currentMoment.format("HH:mm");

                // Check if any task is scheduled in this slot
                // Simple matching: start_time starts with slotId (matches HH:mm)
                // In production, better time range overlap logic is needed.
                let slotContent = "";
                let occupied = false;

                scheduledItems.forEach(item => {
                    // item.start_time is "HH:mm:ss"
                    if (item.start_time.startsWith(slotId)) {
                        occupied = true;
                        slotContent += `
                            <div class="slot-task" draggable="false" style="cursor: default;">
                                <h5>${item.subject || item.task}</h5>
                                <p><i class="fa fa-clock-o"></i> ${moment(item.start_time, "HH:mm:ss").format("h:mm A")} - ${moment(item.end_time, "HH:mm:ss").format("h:mm A")}</p>
                                <span style="
                                    position: absolute; right: 5px; top: 5px;
                                    cursor: pointer; opacity: 0.7;"
                                    title="Unschedule"
                                    onclick="frappe.pages['dak_day_planner'].unschedule('${item.name}')">
                                    <i class="fa fa-times-circle" style="color: #ef4444;"></i>
                                </span>
                            </div>
                        `;
                    }
                });

                let html = `
                    <div class="time-slot-row">
                        <div class="time-slot-label">${timeLabel}</div>
                        <div class="time-slot-dropzone ${occupied ? 'has-task' : ''}" data-time="${slotId}">
                            ${slotContent}
                        </div>
                    </div>
                `;
                container.append(html);

                currentMoment.add(config.interval, "minutes");
            }

            // Bind Drop Events (moved inside callback to bind to new elements)
            bind_drop_events();
        }
    });
};

frappe.pages["dak_day_planner"].unschedule = function (schedule_name) {
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.unschedule_task_from_slot",
        args: { schedule_id: schedule_name },
        callback: function (r) {
            frappe.pages["dak_day_planner"].load_tasks();
            frappe.pages["dak_day_planner"].render_grid();
            frappe.show_alert({ message: "Task unscheduled", indicator: "orange" });
        }
    });
};


function bind_drop_events() {
    $(".time-slot-dropzone").on("dragover", function (e) {
        e.preventDefault();
        $(this).addClass("drag-over");
        e.originalEvent.dataTransfer.dropEffect = "copy";
    });

    $(".time-slot-dropzone").on("dragleave", function (e) {
        $(this).removeClass("drag-over");
    });

    $(".time-slot-dropzone").on("drop", function (e) {
        e.preventDefault();
        $(this).removeClass("drag-over");
        let taskData = e.originalEvent.dataTransfer.getData("text/plain");
        if (!taskData) return;


        let task = JSON.parse(decodeURIComponent(taskData));
        let slotTimeStr = $(this).data("time"); // "HH:mm"

        // Calculate End Time (Start + Interval)
        let interval = frappe.pages["dak_day_planner"].config.interval;
        let startMoment = moment(slotTimeStr, "HH:mm");
        let endMoment = startMoment.clone().add(interval, 'minutes');
        let endTimeStr = endMoment.format("HH:mm:ss");
        let startTimeFull = startMoment.format("HH:mm:ss");

        frappe.call({
            method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.schedule_task",
            args: {
                task_name: task.name,
                date: frappe.pages["dak_day_planner"].config.current_date,
                start_time: startTimeFull,
                end_time: endTimeStr
            },
            callback: function (r) {
                if (r.message) {
                    frappe.show_alert({ message: `Scheduled ${task.subject}`, indicator: "green" });
                    // Access the correct 'this' from closure or re-select
                    // Since 'this' changes in callback, we should reload grid/tasks
                    frappe.pages["dak_day_planner"].load_tasks();
                    frappe.pages["dak_day_planner"].render_grid(); // This will fetch and render the new slot
                }
            }
        });

    });
}

frappe.pages["dak_day_planner"].show_task_details = function (task_name) {
    if (!task_name) return;

    // 1. Fetch Task Details (Main)
    frappe.call({
        method: 'frappe.client.get',
        args: { doctype: 'Task', name: task_name },
        callback: (r) => {
            if (r.message) {
                try {
                    let task = r.message;
                    // 2. Render Modal Immediately with Basic Info
                    let d = frappe.pages["dak_day_planner"].render_task_modal_skeleton(task);

                    // 3. Async Fetch Timesheets
                    frappe.pages["dak_day_planner"].fetch_timesheets(task_name, d);

                    // 4. Async Fetch Activities
                    frappe.pages["dak_day_planner"].fetch_activities(task_name, d);
                } catch (e) {
                    console.error("Error rendering task modal", e);
                    frappe.msgprint("An error occurred while displaying task details.");
                }
            }
        },
        error: (r) => {
            frappe.msgprint(__("Unable to open task. You might not have permission."));
            return true;
        }
    });
};

frappe.pages["dak_day_planner"].render_task_modal_skeleton = function (task) {
    let d = new frappe.ui.Dialog({
        title: 'Task Details',
        size: 'large'
    });

    let statusColor = task.status === 'Completed' ? 'green' : (task.status === 'Overdue' ? 'red' : 'blue');

    let html = `
            <div style="padding: 20px;">
                <!-- Header Info -->
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <span class="indicator ${statusColor}" style="font-size: 14px; font-weight: 500;">${task.status}</span>
                    <span style="background: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-size: 12px; color: #4b5563; font-weight: 600;">${task.priority}</span>
                    <span style="font-size: 12px; color: #9ca3af; margin-left: auto;">${task.name}</span>
                </div>
                
                <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #111827; line-height: 1.3;">${task.subject}</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                     <!-- Left Col: Description & Activities -->
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

                     <!-- Right Col: Meta Data -->
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
    frappe.pages["dak_day_planner"].apply_modal_theme(d);
    return d;
};

frappe.pages["dak_day_planner"].fetch_timesheets = function (task_name, d) {
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
            return true; // Suppress global error
        }
    });
};

frappe.pages["dak_day_planner"].fetch_activities = function (task_name, d) {
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
            d.$wrapper.find('#modal-activities-container').html(`<div style="padding: 10px; color: #ef4444; font-size: 0.85rem;">Permission denied for comments.</div>`);
            return true;
        }
    });
};

frappe.pages["dak_day_planner"].apply_modal_theme = function (d) {
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
    // Target all SVG elements inside the close button to force white stroke
    d.$wrapper.find('.modal-header .btn-modal-close .icon').css("stroke", "white");
    d.$wrapper.find('.modal-header .btn-modal-close svg').css("stroke", "white");
    d.$wrapper.find('.modal-header .btn-modal-close use').css("stroke", "white");
};
