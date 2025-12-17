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
        this.make();
    }

    make() {
        this.wrapper.addClass("dak-timesheet-page");
        this.apply_styles();
        this.render_layout();
        this.render_timesheets();
    }

    apply_styles() {
        $("<style>")
            .prop("type", "text/css")
            .html(`
                .dak-timesheet-page .layout-main-section { max-width: 100% !important; }
                [data-page-route="dak_timesheet"] .layout-main-section-wrapper { max-width: 100% !important; }
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
                            <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.filter_timesheets('Draft'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Drafts</a></li>
                            <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.filter_timesheets('Submitted'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Submitted</a></li>
                             <li><a href="#" onclick="frappe.pages['dak_timesheet'].controller.filter_timesheets('All'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Show All</a></li>
                        </ul>
                    </div>
                
                    <div title="New Timesheet" onclick="frappe.new_doc('Timesheet')" style="
                        width: 38px; height: 38px;
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 10px;
                        cursor: pointer;
                        background: rgba(255,255,255,0.2);
                        color: #ffffff;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        <i class="fa fa-plus" style="font-size: 1.2rem;"></i>
                    </div>
                </div>
            </div>

            <!-- Timesheet List -->
            <div id="timesheet-list-container" style="width: 100%; margin-bottom: 50px; background: #ffffff; border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 20px; margin-top: 0px;">
                <h3 style="margin-bottom: 20px; font-size: 1.5rem; color: #374151;">My Timesheets</h3>
                <div class="table-responsive">
                    <table class="frappe-list-table" id="timesheet-table" style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th style="width: 20%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">ID & Note</th>
                                <th style="width: 20%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Employee</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Status</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Start Date</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Total Hours</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Actions</th>
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

    render_timesheets(status = 'All') {
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_timesheet.dak_timesheet.get_timesheets_summary",
            args: {
                status: status
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

                        html += `
                            <tr class="frappe-list-row" style="cursor: default;">
                                <td style="padding: 12px 15px;">
                                    <div style="font-weight: 600; color: #1f2937; cursor: pointer;" onclick="frappe.set_route('Form', 'Timesheet', '${ts.name
                            }')">${ts.name}</div>
                                    <div style="font-size: 0.8rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ts.note || "-"
                            }</div>
                                </td>
                                <td style="padding: 12px 15px;">
                                    <div style="font-size: 0.9rem; color: #374151;">${ts.employee_name || '-'}</div>
                                </td>
                                <td style="padding: 12px 15px;">
                                    <span class="badge" style="background: ${badgeBg}; color: ${statusColor}; font-weight: 500;">${ts.status
                            }</span>
                                </td>
                                <td style="padding: 12px 15px;">
                                    ${ts.start_date
                                ? frappe.datetime.str_to_user(ts.start_date)
                                : "-"
                            }
                                </td>
                                <td style="padding: 12px 15px; font-weight: 600;">
                                    ${parseFloat(ts.total_hours || 0).toFixed(2)} Hrs
                                </td>
                                <td style="padding: 12px 15px;">
                                    <button class="btn btn-default btn-xs" onclick="frappe.set_route('Form', 'Timesheet', '${ts.name
                            }')">
                                        Open
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    this.wrapper.find("#timesheet-table-body").html(html);
                } else {
                    this.wrapper
                        .find("#timesheet-table-body")
                        .html(
                            '<tr><td colspan="5" style="text-align:center; padding:20px;">No timesheets found.</td></tr>'
                        );
                }
            },
        });
    }

    filter_timesheets(status) {
        this.render_timesheets(status);
        frappe.show_alert({ message: `Filtering by ${status || "All"}`, indicator: "blue" });
    }
}
