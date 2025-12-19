frappe.pages["dak_timesheet"].on_page_load = function (wrapper) {
    new DakTimesheets(wrapper);
};

class DakTimesheets {
    constructor(wrapper) {
        this.wrapper = $(wrapper);
        this.page = frappe.ui.make_app_page({
            parent: wrapper,
            title: "Timesheets",
            single_column: true,
        });
        this.filters = {
            status: "All",
            from_date: null,
            to_date: null,
            search_term: ""
        };
        this.make();
    }

    make() {
        this.wrapper.addClass("dak-timesheet-page");
        this.apply_styles();
        this.render_layout();
        this.setup_filters();
        this.render_timesheets();
    }

    apply_styles() {
        $("<style>")
            .prop("type", "text/css")
            .html(`
                .dak-timesheet-page .layout-main-section { max-width: 100% !important; }
                [data-page-route="dak_timesheet"] .layout-main-section-wrapper { max-width: 100% !important; }
                [data-page-route="dak_timesheet"] .page-head { display: none !important; }
                .ts-filter-input {
                    background: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 6px 10px;
                    font-size: 0.85rem;
                    color: #374151;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .ts-filter-input:focus { border-color: #468e88; }
            `)
            .appendTo(this.wrapper);
    }

    render_layout() {
        this.wrapper.css("padding", "0");
        this.wrapper.find(".layout-main").html(`
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
                <!-- Decorative Circles -->
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
                        <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_day_planner')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                            <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                        </div>
                         <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
                            <i class="fa fa-clock-o" style="margin-right: 8px; font-size: 1rem;"></i> Timesheets
                        </div>
                    </div>
                </div>

                <!-- Right Controls -->
                <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                     <!-- Filter Dropdown -->
                     <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="timesheetFilterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="
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
                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="timesheetFilterDropdown" style="margin-top: 10px; border-radius: 8px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden;">
                            <li style="border-bottom: 1px solid #f3f4f6;"><div style="padding: 8px 15px; font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Filter Status</div></li>
                            <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.set_filter('status', 'Draft'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Drafts</a></li>
                            <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.set_filter('status', 'Submitted'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Submitted</a></li>
                             <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.set_filter('status', 'All'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Show All</a></li>
                        </ul>
                    </div>
                
                </div>
            </div>

            <!-- Main Content Container -->
            <div id="timesheet-list-container" style="width: 100%; margin-bottom: 50px; background: #ffffff; border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 20px; margin-top: 0px;">
                
                <!-- Filter Bar (Premium Pill Design) -->
                <div id="ts-filter-wrapper" style="width: 100%; padding: 12px 0px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 10px;">
                    
                    <!-- Search Pill -->
                    <div style="position: relative; flex-grow: 1; max-width: 400px;">
                        <i class="fa fa-search" style="position: absolute; left: 12px; top: 10px; color: #9ca3af; font-size: 0.9rem;"></i>
                        <input type="text" id="ts-search" placeholder="Search Timesheets..." class="ts-filter-input" style="
                            background: #f3f4f6; border: none; padding: 8px 12px 8px 36px; border-radius: 8px; width: 100%; font-size: 0.85rem; color: #374151; height: 36px; font-weight: 500; outline: none;
                        ">
                    </div>

                    <!-- Date Pill (Replaces separate Date Inputs) -->
                    <div style="position: relative;">
                         <select id="ts-date-filter" onchange="frappe.pages['dak_timesheet'].controller.apply_date_preset(this.value)" style="
                            appearance: none; -webkit-appearance: none;
                            background: #f3f4f6; border: none; padding: 8px 32px 8px 16px; border-radius: 8px; font-size: 0.85rem; color: #374151; font-weight: 600; height: 36px; cursor: pointer; outline: none; min-width: 130px;
                        ">
                            <option value="">All Time</option>
                            <option value="Today">Today</option>
                            <option value="This Week">This Week</option>
                            <option value="This Month">This Month</option>
                            <option value="Custom">Custom Range</option>
                        </select>
                        <i class="fa fa-chevron-down" style="position: absolute; right: 12px; top: 12px; color: #9ca3af; font-size: 0.7rem; pointer-events: none;"></i>
                    </div>

                    <!-- Custom Date Range (Visible when Custom is selected) -->
                    <div id="ts-custom-date-wrapper" style="display: none; align-items: center; gap: 5px;">
                        <input type="date" id="ts-from-date" class="ts-filter-input" style="background: #f3f4f6; border: none; padding: 8px 10px; border-radius: 8px; height: 36px; font-size: 0.85rem; color: #374151;">
                        <span style="color: #9ca3af;">-</span>
                        <input type="date" id="ts-to-date" class="ts-filter-input" style="background: #f3f4f6; border: none; padding: 8px 10px; border-radius: 8px; height: 36px; font-size: 0.85rem; color: #374151;">
                    </div>

                    <!-- Reset Button -->
                    <button class="btn btn-default" onclick="frappe.pages['dak_timesheet'].controller.clear_filters()" style="
                        background: #ffffff; border: 1px solid #d1d5db; color: #6b7280; font-weight: 600; padding: 6px 14px; border-radius: 8px; height: 36px; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
                    " onmouseover="this.style.borderColor='#9ca3af'; this.style.color='#374151'" onmouseout="this.style.borderColor='#d1d5db'; this.style.color='#6b7280'">
                        <i class="fa fa-refresh"></i> Reset
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="frappe-list-table" id="timesheet-table" style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th style="width: 20%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">ID & Note</th>
                                <th style="width: 20%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Employee</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Status</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Date Range</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody id="timesheet-table-body">
                             <tr><td colspan="5" style="text-align:center; padding:20px;">Loading timesheets...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `);
        frappe.pages["dak_timesheet"].controller = this;
    }

    setup_filters() {
        let me = this;
        let searchTimeout;
        $('#ts-search').on('input', function () {
            clearTimeout(searchTimeout);
            let val = $(this).val();
            searchTimeout = setTimeout(() => {
                me.filters.search_term = val;
                me.render_timesheets();
            }, 300);
        });

        // Custom Date Inputs Listeners
        $('#ts-from-date').on('change', function () {
            me.filters.from_date = $(this).val();
            // User requested: filter only after end date is selected.
        });
        $('#ts-to-date').on('change', function () {
            me.filters.to_date = $(this).val();
            if (me.filters.from_date) {
                me.render_timesheets();
            }
        });
    }

    apply_date_preset(preset) {
        if (preset === 'Custom') {
            $('#ts-custom-date-wrapper').css('display', 'flex');
            // Do not update internal filters or render - wait for user to change date inputs manually
            return;
        } else {
            $('#ts-custom-date-wrapper').hide();
        }

        if (!preset) {
            this.filters.from_date = null;
            this.filters.to_date = null;
        } else if (preset === 'Today') {
            this.filters.from_date = frappe.datetime.get_today();
            this.filters.to_date = frappe.datetime.get_today();
        } else if (preset === 'This Week') {
            this.filters.from_date = moment().startOf('week').format('YYYY-MM-DD');
            this.filters.to_date = moment().endOf('week').format('YYYY-MM-DD');
        } else if (preset === 'This Month') {
            this.filters.from_date = moment().startOf('month').format('YYYY-MM-DD');
            this.filters.to_date = moment().endOf('month').format('YYYY-MM-DD');
        }

        // Update the visual inputs so user sees the date range calculated from preset
        $('#ts-from-date').val(this.filters.from_date);
        $('#ts-to-date').val(this.filters.to_date);

        this.render_timesheets();
    }

    render_timesheets() {
        // Show Loading
        this.wrapper.find("#timesheet-table-body").html('<tr><td colspan="5" style="text-align:center; padding:20px; color:#9ca3af;"><i class="fa fa-spinner fa-spin"></i> Loading...</td></tr>');

        frappe.call({
            method: "dakbabu.dakbabu.page.dak_timesheet.dak_timesheet.get_timesheets_summary",
            args: {
                status: this.filters.status,
                from_date: this.filters.from_date,
                to_date: this.filters.to_date,
                search_term: this.filters.search_term
            },
            callback: (r) => {
                if (r.message && r.message.length > 0) {
                    let html = "";
                    r.message.forEach((ts) => {
                        let statusColor =
                            ts.status === "Submitted"
                                ? "#10b981"
                                : ts.status === "Draft"
                                    ? "#f59e0b"
                                    : "#6b7280";
                        let badgeBg =
                            ts.status === "Submitted"
                                ? "#d1fae5"
                                : ts.status === "Draft"
                                    ? "#fef3c7"
                                    : "#f3f4f6";

                        let dateRangeStr = "";
                        if (ts.start_date) {
                            dateRangeStr = `<div>${frappe.datetime.str_to_user(ts.start_date)}</div>`;
                            if (ts.end_date && ts.end_date !== ts.start_date) {
                                dateRangeStr += `<div style="font-size: 0.8em; color: #6b7280; margin-top: 2px;">to ${frappe.datetime.str_to_user(ts.end_date)}</div>`;
                            }
                        } else {
                            dateRangeStr = "-";
                        }


                        let noteDisplay = ts.note || "-";
                        if (ts.note === "Timer started from Dashboard") {
                            noteDisplay = `<i class="fa fa-clock-o" title="Timer started from Dashboard" style="color: #f59e0b; font-size: 1rem;"></i> <span style="font-size: 0.75rem; color: #9ca3af;">Timer Log</span>`;
                        }

                        let taskDisplay = "";
                        if (ts.task_subject) {
                            taskDisplay = `<div style="font-size: 0.9rem; font-weight: 600; color: #1f2937; margin-bottom: 2px;">${ts.task_subject}</div>`;
                        } else {
                            // Fallback if no task subject but has name (shouldn't happen often)
                            taskDisplay = `<div style="font-weight: 600; color: #1f2937;">${ts.name}</div>`;
                        }

                        html += `
                            <tr class="frappe-list-row" style="cursor: pointer;" onclick="frappe.pages['dak_timesheet'].show_timesheet_details('${ts.name}')">
                                <td style="padding: 12px 15px;">
                                    ${taskDisplay}
                                    <div style="font-size: 0.8rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px;">
                                        ${noteDisplay}
                                    </div>
                                    ${ts.task_subject ? `<div style="font-size: 0.7rem; color: #9ca3af;">${ts.name}</div>` : ''} 
                                </td>
                                <td style="padding: 12px 15px;">
                                    <div style="font-size: 0.9rem; color: #374151;">${ts.employee_name || '-'}</div>
                                </td>
                                <td style="padding: 12px 15px;">
                                    <span class="badge" style="background: ${badgeBg}; color: ${statusColor}; font-weight: 500;">${ts.status
                            }</span>
                                </td>
                                <td style="padding: 12px 15px; font-size: 0.85rem; color: #4b5563;">
                                    ${dateRangeStr}
                                </td>
                                <td style="padding: 12px 15px; font-weight: 600;">
                                    ${parseFloat(ts.total_hours || 0).toFixed(2)} Hrs
                                </td>
                            </tr >
                            `;
                    });
                    this.wrapper.find("#timesheet-table-body").html(html);
                } else {
                    this.wrapper
                        .find("#timesheet-table-body")
                        .html(
                            '<tr><td colspan="6" style="text-align:center; padding:20px; font-style: italic; color: #6b7280;">No timesheets found matching criteria.</td></tr>'
                        );
                }
            },
        });
    }

    set_filter(key, value) {
        this.filters[key] = value;
        this.render_timesheets();
        frappe.show_alert({ message: `Filtering by ${value} `, indicator: "blue" });
    }

    clear_filters() {
        this.filters = {
            status: '',
            from_date: null,
            to_date: null,
            search_term: ''
        };
        // Reset UI
        $('#ts-search').val('');
        $('#ts-date-filter').val('');
        $('#ts-custom-date-wrapper').hide();
        $('#ts-from-date').val('');
        $('#ts-to-date').val('');

        this.render_timesheets();
        frappe.show_alert({ message: "Filters Reset", indicator: "blue" });
    }
}

frappe.pages["dak_timesheet"].show_timesheet_details = function (ts_name) {
    if (!ts_name) return;

    frappe.call({
        method: 'frappe.client.get',
        args: { doctype: 'Timesheet', name: ts_name },
        callback: (r) => {
            if (r.message) {
                let ts = r.message;
                render_timesheet_modal(ts);
            }
        },
        error: (r) => {
            frappe.msgprint(__("Unable to fetch timesheet details."));
        }
    });

    function render_timesheet_modal(ts) {
        let d = new frappe.ui.Dialog({
            title: 'Timesheet Details',
            size: 'large'
        });

        let statusColor = ts.status === 'Submitted' ? 'green' : (ts.status === 'Draft' ? 'orange' : 'grey');
        let note = ts.note || 'No description provided.';
        let logs = ts.time_logs || [];

        let logs_html = '';
        if (logs.length > 0) {
            logs_html = `<table class="table table-bordered table-condensed" style="font-size: 0.9rem; margin-top: 10px;">
                <thead><tr style="background: #f9fafb;">
                    <th>Project / Task</th>
                    <th>Activity</th>
                    <th>Hrs</th>
                    <th>Description</th>
                </tr></thead>
                <tbody>`;
            logs.forEach(log => {
                let project_task = log.project ? log.project : (log.task ? log.task : '-');
                // Improve display: if both exist, show both? Standard is often Project -> Task
                if (log.project && log.task) project_task = `${log.project}<br><small class="text-muted">${log.task}</small>`;

                logs_html += `<tr>
                    <td>${project_task}</td>
                    <td>${log.activity_type || '-'}</td>
                    <td style="font-weight: 600;">${log.hours}</td>
                    <td style="font-size: 0.85rem; color: #6b7280;">${log.description || '-'}</td>
                </tr>`;
            });
            logs_html += `</tbody></table>`;
        } else {
            logs_html = `<div style="padding: 15px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; border-radius: 8px;">No time logs found.</div>`;
        }

        let html = `
                            <div style="padding: 20px;">
                <!--Header Info-->
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <span class="indicator ${statusColor}" style="font-size: 14px; font-weight: 500;">${ts.status}</span>
                    <span style="font-size: 12px; color: #9ca3af; margin-left: auto;">${ts.name}</span>
                </div>
                
                <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: #111827; line-height: 1.3;">${ts.employee_name || 'Timesheet'}</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                     <!-- Left Col: Logs & Note -->
                     <div style="flex: 3;">
                        <h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase;">Note</h4>
                        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e5e7eb; color: #4b5563; font-style: ${ts.note ? 'normal' : 'italic'};">
                            ${note}
                        </div>

                        <h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase;">Time Logs</h4>
                        <div style="margin-bottom: 25px;">
                            ${logs_html}
                        </div>
                     </div>

                     <!-- Right Col: Meta Data -->
                     <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 15px;">
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Period</div>
                            <div style="font-weight: 600; color: #374151;">
                                ${ts.start_date ? frappe.datetime.str_to_user(ts.start_date) : '-'} <br>to<br> 
                                ${ts.end_date ? frappe.datetime.str_to_user(ts.end_date) : '-'}
                            </div>
                        </div>
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff;">
                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Total Hours</div>
                            <div style="font-weight: 700; color: #374151; font-size: 1.2rem;">${parseFloat(ts.total_hours).toFixed(2)} Hrs</div>
                        </div>
                        
                        <div style="margin-top: auto; text-align: center;">
                             <button class="btn btn-default btn-sm btn-block" onclick="frappe.set_route('Form', 'Timesheet', '${ts.name}')">
                                Open Full Details
                            </button>
                        </div>
                     </div>
                </div>
            </div>
                        `;

        d.$body.html(html);
        d.show();
        frappe.pages["dak_timesheet"].apply_modal_theme(d);
    }
};

frappe.pages["dak_timesheet"].apply_modal_theme = function (d) {
    if (!d || !d.$wrapper) return;
    d.$wrapper.find('.modal-dialog').css("width", "900px").css("max-width", "90%");
    d.$wrapper.find('.modal-content').css({
        "border-radius": "16px",
        "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "border": "none",
        "overflow": "hidden"
    });
    d.$wrapper.find('.modal-header').css({
        "background": "linear-gradient(135deg, #2e605c 0%, #468e88 100%)",
        "color": "white",
        "border-bottom": "none",
        "padding": "20px 25px"
    });
    d.$wrapper.find('.modal-title').css({
        "font-weight": "600",
        "color": "white",
        "font-size": "1.25rem"
    });
    d.$wrapper.find('.modal-header .btn-modal-close').css({
        "color": "white",
        "background": "transparent",
        "box-shadow": "none"
    });
    // Fix close icon style logic to target SVG elements if needed, but simple CSS helps
    d.$wrapper.find('.modal-header .btn-modal-close .icon use').css("stroke", "white");
};
