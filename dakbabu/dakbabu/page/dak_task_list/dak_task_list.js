frappe.pages["dak_task_list"].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "",
        single_column: true,
    });

    frappe.pages["dak_task_list"].page_wrapper = wrapper;
    $(wrapper).addClass("dak-task-list-page");

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
            <!-- Decorative Circles Container -->
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
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
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
                <!-- Filter Dropdown -->
                 <div class="dropdown" style="margin-right: 15px;">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="taskListFilterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="
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
                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="taskListFilterDropdown" style="margin-top: 10px; border-radius: 8px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden;">
                        <li style="border-bottom: 1px solid #f3f4f6;"><div style="padding: 8px 15px; font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Filter Time</div></li>
                        <li><a href="#" onclick="$('#filter-date').val('').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">All Time</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('Today').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Today</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('Tomorrow').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Tomorrow</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('This Week').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Week</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('Next Week').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Next Week</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('This Month').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Month</a></li>
                        <li><a href="#" onclick="$('#filter-date').val('Overdue').change(); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem; color: #ef4444;">Overdue</a></li>
                    </ul>
                </div>

                <!-- Modernized Toggle Group -->
                <div style="display: flex; gap: 5px; background: rgba(0,0,0,0.1); padding: 4px; border-radius: 8px;">
                    <div id="view-toggle-list" style="
                        width: 32px; height: 32px;
                        display: none; align-items: center; justify-content: center;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #ffffff;
                        transition: all 0.2s;
                    " title="List View">
                        <i class="fa fa-list"></i>
                    </div>
                    <div id="view-toggle-card" style="
                        width: 32px; height: 32px;
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #ffffff;
                        transition: all 0.2s;
                    " title="Grid View">
                        <i class="fa fa-th-large"></i>
                    </div>
                    <div id="view-toggle-kanban" style="
                        width: 32px; height: 32px;
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #ffffff;
                        transition: all 0.2s;
                    " title="Kanban View">
                        <i class="fa fa-columns"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Latest Task Featured Card -->
        <div id="latest-task-container" style="width: 100%; margin-bottom: 5px; display: none;"></div>

        <!-- Bottom Cards Wrapper: Task List Container (Card View) -->
        <div style="width: 100%; margin-bottom: 50px; display: flex; flex-wrap: wrap; row-gap: 15px; column-gap: 30px; margin-top: 5px;" id="task-list-container">
            <div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5); width: 100%;">
                <i class="fa fa-spinner fa-spin" style="font-size: 2rem;"></i><br>Loading Tasks...
            </div>
        </div>

        <!-- Kanban View -->
        <div id="kanban-task-list" style="display: none; width: 100%; overflow-x: auto; padding-bottom: 20px; margin-top: 20px; flex-direction: column;">
             <div style="margin-bottom: 10px; display: flex; justify-content: flex-end;">
                  <button class="btn btn-default btn-sm" onclick="frappe.pages['dak_task_list'].prompt_kanban_grouping()" style="background: #fff; border: 1px solid #e5e7eb; color: #374151; font-weight: 600;">
                    <i class="fa fa-sliders" style="margin-right: 5px;"></i> Group By: <span id="current-kanban-group">Status</span>
                  </button>
             </div>
             <div id="kanban-columns-wrapper" style="display: flex; gap: 20px;"></div>
        </div>


        <!-- Standard List View -->
        <div id="standard-task-list" style="width: 100%; margin-bottom: 50px; background: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 20px; display: none;">
            <!-- Filters -->
            <div class="row" style="margin-bottom: 20px;">
                <div class="col-md-2">
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
                        <tr id="task-table-header"></tr>
                    </thead>
                    <tbody id="standard-task-table-body"></tbody>
                </table>
            </div>
            <div id="pagination-controls"></div>
        </div>

        <div class="lucid-modal-overlay" id="list-details-overlay" onclick="frappe.pages['dak_task_list'].toggle_details_drawer(false)">
        </div>
    `);

    // Initial fetch
    frappe.pages["dak_task_list"].render_task_list(wrapper);

    // Bind View Toggles (Delegated to wrapper for maximum reliability)
    $(wrapper).on("click", "#view-toggle-list", () => frappe.pages["dak_task_list"].toggle_view("list"));
    $(wrapper).on("click", "#view-toggle-card", () => frappe.pages["dak_task_list"].toggle_view("card"));
    $(wrapper).on("click", "#view-toggle-kanban", () => frappe.pages["dak_task_list"].toggle_view("kanban"));

    // Refresh on page show
    $(wrapper).on("show", function () {
        frappe.pages["dak_task_list"].render_task_list(wrapper);
    });
};

frappe.pages["dak_task_list"].render_task_list = function (wrapper) {
    if (!frappe.pages["dak_task_list"].visible_columns) {
        frappe.pages["dak_task_list"].visible_columns = [
            { label: "Working", field: "custom_working_now", width: "10%" },
            { label: "Subject", field: "subject", width: "30%" },
            { label: "Status", field: "status", width: "15%" },
            { label: "Priority", field: "priority", width: "15%" },
            { label: "Due Date", field: "exp_end_date", width: "15%" },
        ];
    }

    frappe.call({
        method: "dakbabu.dakbabu.page.dak_task_list.dak_task_list.get_all_tasks_list",
        callback: function (r) {
            if (r.message) {
                frappe.pages["dak_task_list"].all_tasks = r.message;

                if (!frappe.pages["dak_task_list"].current_view) frappe.pages["dak_task_list"].current_view = "list";
                if (!frappe.pages["dak_task_list"].kanban_field) frappe.pages["dak_task_list"].kanban_field = "status";
                if (frappe.pages["dak_task_list"].group_by_field === undefined) frappe.pages["dak_task_list"].group_by_field = null;

                frappe.pages["dak_task_list"].toggle_view(frappe.pages["dak_task_list"].current_view);

                // Handle route options
                if (frappe.route_options) {
                    $("#filter-status").val(frappe.route_options.status || "");
                    $("#filter-priority").val(frappe.route_options.priority || "");
                    if (frappe.route_options.date) {
                        let date = frappe.route_options.date;
                        // Check if it's one of the standard options (Today, Tomorrow, etc.)
                        // Otherwise add a custom option
                        let exists = false;
                        $("#filter-date option").each(function () {
                            if ($(this).val() === date) exists = true;
                        });

                        // Also check if Today/Tomorrow matches the date
                        let now = moment().format("YYYY-MM-DD");
                        let tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
                        if (date === now) {
                            $("#filter-date").val("Today");
                        } else if (date === tomorrow) {
                            $("#filter-date").val("Tomorrow");
                        } else if (!exists) {
                            $("#filter-date").append(new Option(frappe.datetime.str_to_user(date), date));
                            $("#filter-date").val(date);
                        } else {
                            $("#filter-date").val(date);
                        }
                    }
                    frappe.route_options = null;
                }

                frappe.pages["dak_task_list"].apply_task_filters();

                // Render latest/active task card
                let activeTask = r.message.find(t => t.custom_working_now == 1) || r.message[0];
                if (activeTask) frappe.pages["dak_task_list"].render_latest_task_card(activeTask);
            } else {
                frappe.pages["dak_task_list"].all_tasks = [];
                frappe.pages["dak_task_list"].render_tasks_visuals(wrapper, []);
            }
        },
    });
};

frappe.pages["dak_task_list"].toggle_view = function (view) {
    console.log("Task List switching to view:", view);
    frappe.pages["dak_task_list"].current_view = view;

    // Use a clearer selector for the main wrapper to avoid isolation issues
    let $wrapper = $(frappe.pages["dak_task_list"].page_wrapper);
    $wrapper.find("#view-toggle-list, #view-toggle-card, #view-toggle-kanban").css("display", "flex");

    if (view === "list") {
        $wrapper.find("#task-list-container, #kanban-task-list").hide();
        $wrapper.find("#standard-task-list").fadeIn(200);
        $wrapper.find("#view-toggle-list").hide();
    } else if (view === "card" || view === "grid") {
        $wrapper.find("#standard-task-list, #kanban-task-list").hide();
        $wrapper.find("#task-list-container").css("display", "flex").fadeIn(200);
        $wrapper.find("#view-toggle-card").hide();
    } else if (view === "kanban") {
        if (!frappe.pages["dak_task_list"].kanban_field) {
            frappe.pages["dak_task_list"].prompt_kanban_grouping();
            return;
        }
        $wrapper.find("#task-list-container, #standard-task-list").hide();
        $wrapper.find("#kanban-task-list").css("display", "flex").fadeIn(200);
        $wrapper.find("#view-toggle-kanban").hide();
    }
};


frappe.pages["dak_task_list"].apply_task_filters = function () {
    let wrapper = frappe.pages["dak_task_list"].page_wrapper;
    let subject = $("#filter-subject").val() ? $("#filter-subject").val().toLowerCase() : "";
    let status = $("#filter-status").val();
    let priority = $("#filter-priority").val();
    let date_filter = $("#filter-date").val();

    let filtered_tasks = frappe.pages["dak_task_list"].all_tasks.filter((task) => {
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
                if (date_filter === "Today") matchDate = d.isSame(now, "day");
                else if (date_filter === "Tomorrow") matchDate = d.isSame(now.clone().add(1, "days"), "day");
                else if (date_filter === "This Week") matchDate = d.isSame(now, "week");
                else if (date_filter === "Next Week") matchDate = d.isSame(now.clone().add(1, "weeks"), "week");
                else if (date_filter === "This Month") matchDate = d.isSame(now, "month");
                else if (date_filter === "Next Month") matchDate = d.isSame(now.clone().add(1, "months"), "month");
                else if (date_filter === "Overdue") matchDate = d.isBefore(now, "day") && task.status !== "Completed";
                else {
                    // Try parsing as specific date
                    let filter_m = moment(date_filter, "YYYY-MM-DD", true);
                    if (filter_m.isValid()) {
                        matchDate = d.isSame(filter_m, "day");
                    }
                }
            }
        }

        return matchSubject && matchStatus && matchPriority && matchDate;
    });

    frappe.pages["dak_task_list"].render_tasks_visuals(wrapper, filtered_tasks);
};

frappe.pages["dak_task_list"].set_group_by = function (field) {
    frappe.pages["dak_task_list"].group_by_field = field;
    $("#group-by-label").text(field ? field.charAt(0).toUpperCase() + field.slice(1) : "None");
    if (field) {
        frappe.pages["dak_task_list"].kanban_field = field;
        $("#current-kanban-group").text(field === "status" ? "Status" : "Priority");
    }
    frappe.pages["dak_task_list"].apply_task_filters();
};

frappe.pages["dak_task_list"].render_tasks_visuals = function (wrapper, tasks) {
    let container = $("#task-list-container");
    let table_header = $("#task-table-header");
    let table_body = $("#standard-task-table-body");
    let kanban_wrapper = $("#kanban-columns-wrapper");
    let groupBy = frappe.pages["dak_task_list"].group_by_field;

    // Render Headers
    let header_html = `<th style="width: 50px;"></th>`;
    frappe.pages["dak_task_list"].visible_columns.forEach((col, index) => {
        if (col.field === "custom_working_now") return;
        header_html += `<th class="dynamic-col-header" data-index="${index}" style="padding: 12px 15px; font-weight: normal; border-bottom: 1px solid #d1d8dd; text-align: left; cursor: pointer; color: #8d99a6; font-size: 11px; vertical-align: middle;">
			${col.label} <i class="fa fa-caret-down" style="display: none; margin-left: 5px; color: #ced4da;"></i>
		</th>`;
    });
    header_html += `<th style="width: 50px;"></th>`;
    table_header.html(header_html);

    $(".dynamic-col-header").off("click").on("click", function (e) {
        e.stopPropagation();
        frappe.pages["dak_task_list"].show_column_context_menu(e.pageX, e.pageY, $(this).data("index"));
    });

    if (tasks && tasks.length > 0) {
        let html = "";
        let table_html = "";
        let groups = {};

        if (groupBy) {
            tasks.forEach((task) => {
                let key = task[groupBy] || "Unassigned";
                if (!groups[key]) groups[key] = [];
                groups[key].push(task);
            });
            Object.keys(groups).sort().forEach((key) => {
                let groupTasks = groups[key];
                // Card Views
                html += `<h3 style="width: 100%; font-size: 1.1rem; font-weight: 700; opacity: 0.7; margin: 20px 0 10px 0; border-bottom: 2px solid #eee; padding-bottom: 5px;">${key} (${groupTasks.length})</h3>`;
                html += `<div style="display: flex; flex-wrap: wrap; gap: 30px; width: 100%;">`;
                groupTasks.forEach(task => html += frappe.pages["dak_task_list"].get_task_card_html(task));
                html += `</div>`;

                // Table Views
                table_html += `<tr class="group-header" style="background:#f9fafb;"><td colspan="${frappe.pages["dak_task_list"].visible_columns.length + 2}" style="font-weight: 700; padding: 10px 15px; border-bottom: 2px solid #e5e7eb;">${key} (${groupTasks.length})</td></tr>`;
                groupTasks.forEach(task => table_html += frappe.pages["dak_task_list"].get_task_row_html(task));
            });
        } else {
            html += `<div style="display: flex; flex-wrap: wrap; gap: 30px; width: 100%;">`;
            tasks.forEach(task => html += frappe.pages["dak_task_list"].get_task_card_html(task));
            html += `</div>`;
            tasks.forEach(task => table_html += frappe.pages["dak_task_list"].get_task_row_html(task));
        }

        container.html(html);
        table_body.html(table_html);

        // Render Kanban
        let kanban_html = "";
        let kanban_current_field = frappe.pages["dak_task_list"].kanban_field || "status";
        let kanban_cols = kanban_current_field === "status" ? ["Open", "Working", "Pending Review", "Overdue", "Completed"] : ["Low", "Medium", "High", "Urgent"];

        kanban_cols.forEach((groupVal) => {
            let statusTasks = tasks.filter((t) => t[kanban_current_field] === groupVal);
            kanban_html += `<div class="kanban-column" 
                ondrop="frappe.pages['dak_task_list'].kanban_drop(event, '${groupVal}')" 
                ondragover="frappe.pages['dak_task_list'].kanban_allow_drop(event)"
                ondragenter="this.classList.add('drag-over')"
                ondragleave="this.classList.remove('drag-over')">
				<div class="kanban-column-header"><span>${groupVal}</span><span style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:10px; font-size:0.8rem;">${statusTasks.length}</span></div>
				<div class="kanban-column-body">`;
            statusTasks.forEach(task => kanban_html += frappe.pages["dak_task_list"].get_kanban_card_html(task, kanban_current_field));
            kanban_html += `</div></div>`;
        });
        kanban_wrapper.html(kanban_html);

    } else {
        container.html('<div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5);">No tasks found matching criteria.</div>');
        table_body.html(`<tr><td colspan="100%" style="text-align: center; padding: 20px; color: #6b7280;">No tasks found matching criteria.</td></tr>`);
        kanban_wrapper.html('<div style="text-align: center; padding: 40px; color: rgba(0,0,0,0.5); width: 100%;">No tasks found.</div>');
    }
};

frappe.pages["dak_task_list"].get_task_card_html = function (task) {
    let statusColor = "#3b82f6";
    if (task.status === "Open" || task.status === "Working") statusColor = "#10b981";
    if (task.status === "Overdue") statusColor = "#ef4444";
    if (task.status === "Completed") statusColor = "#6b7280";

    let priorityColor = "#6b7280";
    if (task.priority === "High" || task.priority === "Urgent") priorityColor = "#dc2626";
    else if (task.priority === "Medium") priorityColor = "#f59e0b";

    let isWorking = task.custom_working_now == 1;
    let dueDate = task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : "No Due Date";
    let assigneeInitials = task.owner ? task.owner.split('@')[0].charAt(0).toUpperCase() : "?";

    return `
		<div class="task-grid-card" onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')" style="
			width: calc(50% - 15px);
			background: #ffffff;
			border-radius: 12px;
			padding: 24px;
			box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			cursor: pointer;
			position: relative;
			border: 1px solid #f3f4f6;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-height: 200px;
		" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';">
			
            <!-- Status Badges & Active Indicator -->
			<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
				    <span style="font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; background: ${statusColor}15; color: ${statusColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${task.status}</span>
				    <span style="font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; background: ${priorityColor}15; color: ${priorityColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${task.priority}</span>
                </div>
                <!-- Interactive Active Indicator -->
                <div onclick="event.stopPropagation(); frappe.pages['dak_task_list'].set_working_task('${task.name}')" style="cursor: pointer; padding: 5px; color: ${isWorking ? '#2e605c' : '#d1d5db'}; font-size: 1.2rem; transition: all 0.2s;" title="${isWorking ? 'Currently Working' : 'Set as Working'}" onmouseover="if(!${isWorking}) this.style.color='#2e605c'" onmouseout="if(!${isWorking}) this.style.color='#d1d5db'">
                    <i class="fa ${isWorking ? 'fa-dot-circle-o' : 'fa-circle-o'}"></i>
                </div>
			</div>

            <!-- Content Area -->
            <div style="margin-bottom: auto;">
                <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 4px; font-weight: 600;">${task.name}</div>
			    <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 8px 0; line-height: 1.3;">${task.subject}</h3>
                ${task.project ? `<div style="font-size: 0.85rem; color: #4b5563; display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                    <i class="fa fa-briefcase" style="color: #6b7280;"></i> ${task.project}
                </div>` : ''}
            </div>

            <!-- Progress Bar Section -->
            <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 0.75rem; font-weight: 600; color: #6b7280;">Task Progress</span>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #111827;">${task.progress || 0}%</span>
                </div>
                <div style="width: 100%; height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${task.progress || 0}%; height: 100%; background: ${statusColor}; transition: width 0.5s ease;"></div>
                </div>
            </div>

            <!-- Footer Stats & Info -->
			<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; background: #2e605c; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">${assigneeInitials}</div>
                    <div style="font-size: 0.8rem; color: #6b7280; display: flex; align-items: center; gap: 5px;">
                        <i class="fa fa-clock-o"></i> ${dueDate}
                    </div>
                </div>
                <!-- Interactive Completion Button -->
                <div onclick="event.stopPropagation(); frappe.pages['dak_task_list'].mark_task_complete(event, '${task.name}')" 
                     style="cursor: ${task.status === 'Completed' ? 'default' : 'pointer'}; color: ${task.status === 'Completed' ? '#2e605c' : '#d1d5db'}; transition: all 0.2s; font-size: 1.3rem;" 
                     title="${task.status === 'Completed' ? 'Task Completed' : 'Mark as Completed'}"
                     onmouseover="if('${task.status}' !== 'Completed') this.style.color='#2e605c'" 
                     onmouseout="if('${task.status}' !== 'Completed') this.style.color='#d1d5db'">
                    <i class="fa ${task.status === 'Completed' ? 'fa-check-circle' : 'fa-check-circle-o'}"></i>
                </div>
			</div>
		</div>`;
};

frappe.pages["dak_task_list"].get_task_row_html = function (task) {
    let assignee = task.owner ? task.owner.charAt(0).toUpperCase() : "?";
    let isWorking = task.custom_working_now == 1;
    let workingIcon = isWorking
        ? `<i class="fa fa-dot-circle-o" style="color: #2e605c; font-size: 1.2rem;"></i>`
        : `<i class="fa fa-circle-o" style="color: #d1d5db; font-size: 1.2rem; transition: color 0.2s;"></i>`;

    let tr = `<tr class="frappe-list-row" onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')">`;

    // Working column
    tr += `<td style="text-align: center; vertical-align: middle;" onclick="event.stopPropagation(); frappe.pages['dak_task_list'].set_working_task('${task.name}')">
		<div style="cursor: pointer; padding: 5px;" title="${isWorking ? 'Currently Working' : 'Set as Working'}">${workingIcon}</div>
	</td>`;

    // Dynamic columns
    frappe.pages["dak_task_list"].visible_columns.forEach(col => {
        if (col.field === "custom_working_now") return;

        let cellContent = "";
        if (col.field === "subject") {
            cellContent = `<div class="subject-cell">
				<div class="user-avatar-circle">${assignee}</div>
				<div style="display:flex; flex-direction:column; justify-content:center;">
					<span class="subject-main">${task.subject}</span>
				</div>
			</div>`;
        } else if (col.field === "status") {
            cellContent = frappe.pages["dak_task_list"].getStatusIndicator(task.status);
        } else if (col.field === "priority") {
            cellContent = `<span class="priority-text ${frappe.pages["dak_task_list"].getPriorityClass(task.priority)}">${task.priority}</span>`;
        } else if (col.field === "exp_end_date") {
            let dateClass = task.status === "Overdue" ? "due-date overdue" : "due-date";
            cellContent = `<span class="${dateClass}">${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : "-"}</span>`;
        } else {
            cellContent = task[col.field] || "-";
        }
        tr += `<td>${cellContent}</td>`;
    });

    // Actions column
    let isCompleted = task.status === "Completed";
    let actionIcon = isCompleted ? "fa-check-circle" : "fa-check-circle-o";
    let actionColor = isCompleted ? "#2e605c" : "#d1d5db";
    let onClick = isCompleted ? "" : `onclick="event.stopPropagation(); frappe.pages['dak_task_list'].mark_task_complete(event, '${task.name}')"`;
    let onHover = isCompleted ? "" : `onmouseover="this.style.color='#2e605c'" onmouseout="this.style.color='#d1d5db'"`;

    tr += `<td style="text-align: right; vertical-align: middle; padding-right: 15px;" onclick="event.stopPropagation()">
		<div ${onClick} style="cursor: ${isCompleted ? 'default' : 'pointer'}; color: ${actionColor}; transition: color 0.2s; font-size: 1.1rem; display: inline-block;" ${onHover} title="${isCompleted ? 'Completed' : 'Mark as Completed'}">
			<i class="fa ${actionIcon}"></i>
		</div>
	</td></tr>`;

    return tr;
};

// --- RESTORED HELPER FUNCTIONS ---

frappe.pages["dak_task_list"].apply_modal_theme = function (d) {
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

frappe.pages["dak_task_list"].show_task_details = function (task_name) {
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
                    let d = render_task_modal_skeleton(task);

                    // 3. Async Fetch Timesheets
                    fetch_timesheets(task_name, d);

                    // 4. Async Fetch Activities
                    fetch_activities(task_name, d);
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

    function render_task_modal_skeleton(task) {
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
        frappe.pages["dak_task_list"].apply_modal_theme(d);
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
                return true; // Suppress global error
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

frappe.pages["dak_task_list"].toggle_details_drawer = function (show) {
    if (!show) $("#list-details-overlay").hide();
};

frappe.pages["dak_task_list"].prompt_kanban_grouping = function () {
    let d = new frappe.ui.Dialog({
        title: "Group Kanban By",
        fields: [
            {
                label: "Field",
                fieldname: "group_by",
                fieldtype: "Select",
                options: [
                    { label: "Status", value: "status" },
                    { label: "Priority", value: "priority" },
                ],
                default: frappe.pages["dak_task_list"].kanban_field || "status",
            },
        ],
        primary_action_label: "View Board",
        primary_action(values) {
            frappe.pages["dak_task_list"].kanban_field = values.group_by;
            $("#current-kanban-group").text(values.group_by === "status" ? "Status" : "Priority");
            frappe.pages["dak_task_list"].apply_task_filters();
            frappe.pages["dak_task_list"].toggle_view("kanban");
            d.hide();
        },
    });
    d.show();
};

frappe.pages["dak_task_list"].kanban_drag_start = function (ev, task_name) {
    ev.dataTransfer.setData("text/plain", task_name);
    ev.dataTransfer.effectAllowed = "move";
    // Add a class for visual feedback on the card being dragged
    $(ev.currentTarget).css("opacity", "0.4");
};

frappe.pages["dak_task_list"].kanban_drag_end = function (ev) {
    $(ev.currentTarget).css("opacity", "1");
};

frappe.pages["dak_task_list"].kanban_allow_drop = function (ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
};

frappe.pages["dak_task_list"].kanban_drop = function (ev, new_value) {
    ev.preventDefault();
    $(ev.currentTarget).removeClass("drag-over");

    let task_name = ev.dataTransfer.getData("text/plain");
    let field = frappe.pages["dak_task_list"].kanban_field || "status";
    let task = frappe.pages["dak_task_list"].all_tasks.find((t) => t.name === task_name);

    if (!task || task[field] === new_value) return;

    let old_value = task[field];

    // Update locally for immediate feedback
    task[field] = new_value;
    frappe.pages["dak_task_list"].apply_task_filters();

    // Update on server
    frappe.call({
        method: "frappe.client.set_value",
        args: {
            doctype: "Task",
            name: task_name,
            fieldname: field,
            value: new_value
        },
        callback: function (r) {
            if (r.message) {
                frappe.show_alert({
                    message: `Task ${task.subject} moved to ${new_value}`,
                    indicator: "green"
                });
            }
        },
        error: function () {
            // Revert on error
            task[field] = old_value;
            frappe.pages["dak_task_list"].apply_task_filters();
            frappe.msgprint("Failed to update task on server.");
        }
    });
};

frappe.pages["dak_task_list"].getStatusIndicator = function (status) {
    let color = "gray";
    if (status === "Working") color = "blue";
    if (status === "Overdue") color = "red";
    if (status === "Completed") color = "green";
    if ((status || "").includes("Pending")) color = "orange";
    return `<span class="indicator ${color}">${status}</span>`;
};

frappe.pages["dak_task_list"].getPriorityClass = function (p) {
    if (p === "High") return "priority-high";
    if (p === "Medium") return "priority-medium";
    return "priority-low";
};

frappe.pages["dak_task_list"].get_kanban_card_html = function (task, group_field) {
    let borderColor = "#2563eb";
    if (group_field === "status") {
        if (task.priority === "High" || task.priority === "Urgent") borderColor = "#dc2626";
        else if (task.priority === "Medium") borderColor = "#f59e0b";
    } else {
        if (task.priority === "High" || task.priority === "Urgent") borderColor = "#dc2626";
        else if (task.priority === "Medium") borderColor = "#f59e0b";
        else if (task.priority === "Low") borderColor = "#10b981";
    }

    return `
		<div class="kanban-card"
	draggable="true"
	ondragstart="frappe.pages['dak_task_list'].kanban_drag_start(event, '${task.name}')"
	ondragend="frappe.pages['dak_task_list'].kanban_drag_end(event)"
	onclick="frappe.pages['dak_task_list'].show_task_details('${task.name}')"
	style="border-left-color: ${borderColor};">
        <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 5px; color: #1f2937;">${task.subject}</div>
        <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">
            ${task.description || ""}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #9ca3af;">
            <span>${task.name}</span>
            <span>${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : ""}</span>
        </div>
    </div>
		`;
};

frappe.pages["dak_task_list"].show_column_context_menu = function (x, y, colIndex) {
    $(".custom-context-menu").remove();
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
		<div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('left', ${colIndex})" style="padding: 8px 15px; cursor: pointer;" onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='white'">Insert Left</div>
            <div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('right', ${colIndex})" style="padding: 8px 15px; cursor: pointer;" onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='white'">Insert Right</div>
            <div class="menu-item" onclick="frappe.pages['dak_task_list'].handle_column_action('remove', ${colIndex})" style="padding: 8px 15px; cursor: pointer; color: #ef4444; border-top: 1px solid #f3f4f6;" onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='white'">Remove Column</div>
        </div>
		`).appendTo("body");
    $(document).one("click", function () {
        menu.remove();
    });
};

frappe.pages["dak_task_list"].handle_column_action = function (action, index) {
    if (action === "remove") {
        if (frappe.pages["dak_task_list"].visible_columns.length <= 1) {
            frappe.msgprint("Cannot remove the last column.");
            return;
        }
        frappe.pages["dak_task_list"].visible_columns.splice(index, 1);
        frappe.pages["dak_task_list"].apply_task_filters();
    } else {
        let d = new frappe.ui.Dialog({
            title: "Select Column to Add",
            fields: [
                {
                    label: "Field",
                    fieldname: "field_select",
                    fieldtype: "Select",
                    options: [
                        { label: "Task ID", value: "name" },
                        { label: "Subject", value: "subject" },
                        { label: "Status", value: "status" },
                        { label: "Priority", value: "priority" },
                        { label: "Due Date", value: "exp_end_date" },
                        { label: "Project", value: "project" },
                        { label: "Created On", value: "creation" },
                        { label: "Last Modified", value: "modified" },
                    ],
                },
            ],
            primary_action_label: "Add",
            primary_action(values) {
                let field_def = {
                    label: d.fields_dict.field_select.df.options.find(
                        (o) => o.value === values.field_select
                    ).label,
                    field: values.field_select,
                    width: "15%",
                };

                if (action === "left") {
                    frappe.pages["dak_task_list"].visible_columns.splice(index, 0, field_def);
                } else {
                    frappe.pages["dak_task_list"].visible_columns.splice(index + 1, 0, field_def);
                }

                frappe.pages["dak_task_list"].apply_task_filters(); // Re-render
                d.hide();
            },
        });
        d.show();
    }
};

frappe.pages["dak_task_list"].render_latest_task_card = function (task) {
    let container = $("#latest-task-container");
    if (!task) {
        container.hide();
        return;
    }

    let html = `
		<div class="latest-task-card" style="margin-bottom: 0;">
        <div class="ltc-circle ltc-circle-1"></div>
        <div class="ltc-circle ltc-circle-2"></div>
        <div class="ltc-circle ltc-circle-3"></div>

        <div class="ltc-content">
            <div class="ltc-header">
                <span class="ltc-badge">Active Task</span>
                <span class="ltc-status">${task.status}</span>
                <span class="ltc-date"><i class="fa fa-calendar" style="margin-right: 5px;"></i> ${frappe.datetime.str_to_user(task.creation).split(" ")[0]}</span>
            </div>
            <h2 class="ltc-title">${task.subject}</h2>
            <p class="ltc-desc">
                ${task.description || "No detailed description available for this task."}
            </p>
        </div>

        <div class="ltc-actions" style="flex-direction: column; align-items: flex-end; gap: 10px;">
        </div>
    </div>
		<style>
			@keyframes ping {
				75%, 100% { transform: scale(2); opacity: 0; }
			}
		</style>
	`;
    container.html(html).show();
};

frappe.pages["dak_task_list"].mark_task_complete = function (e, task_name) {
    if (e) e.stopPropagation();

    frappe.confirm(`Are you sure you want to mark task <b>${task_name}</b> as Completed?`, () => {
        let now = frappe.datetime.now_datetime();
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_task_list.dak_task_list.complete_task",
            args: { task_name: task_name },
            callback: function (r) {
                if (r.message) {
                    frappe.show_alert({ message: __("Task Marked Completed"), indicator: "green" });
                    let t = frappe.pages["dak_task_list"].all_tasks.find((x) => x.name === task_name);
                    if (t) {
                        t.status = "Completed";
                        t.completed_on = now;
                        t.custom_working_now = 0;
                    }
                    frappe.pages["dak_task_list"].apply_task_filters();
                }
            },
        });
    });
};

frappe.pages["dak_task_list"].set_working_task = function (task_name) {
    // This was previously defined inside render_tasks_visuals, moving strictly to global scope
    let task = frappe.pages["dak_task_list"].all_tasks.find((t) => t.name === task_name);
    if (task && task.status === "Completed") {
        frappe.msgprint({
            title: __("Cannot Activate Task"),
            message: __("This task is already <b>Completed</b>. Please re-open it before setting it as active."),
            indicator: "red",
        });
        return;
    }

    frappe.call({
        method: "dakbabu.dakbabu.page.dak_task_list.dak_task_list.set_working_task",
        args: { task_name: task_name },
        callback: function (r) {
            if (r.message) {
                frappe.show_alert({ message: "Task set as Working Now", indicator: "green" });
                frappe.pages["dak_task_list"].render_task_list(frappe.pages["dak_task_list"].page_wrapper);
            }
        },
    });
};