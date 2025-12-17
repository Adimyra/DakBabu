frappe.pages["dak_projects"].on_page_load = function (wrapper) {
    new DakProjects(wrapper);
};

class DakProjects {
    constructor(wrapper) {
        this.wrapper = $(wrapper);
        this.page = frappe.ui.make_app_page({
            parent: wrapper,
            title: "Projects",
            single_column: true,
        });
        this.make();
    }

    make() {
        this.wrapper.addClass("dak-projects-page");

        // Helper to enforce full width
        let forceFullWidth = () => {
            this.wrapper.closest(".container").css({ "max-width": "100%", "padding": "0" });
            this.wrapper.closest(".page-container").css({ "max-width": "100%", "padding": "0" });
            this.wrapper.find(".layout-main-section").css({ "max-width": "100%" });
        };

        // Apply immediately and retries to handle race conditions on refresh
        forceFullWidth();
        setTimeout(forceFullWidth, 100);
        setTimeout(forceFullWidth, 500);

        // Inject scoped styles for visual stability
        $("<style>")
            .prop("type", "text/css")
            .html(`
                .dak-projects-page .layout-main-section { max-width: 100% !important; }
                [data-page-route="dak_projects"] .layout-main-section-wrapper { max-width: 100% !important; }
            `)
            .appendTo(this.wrapper);

        this.wrapper.css("padding", "0");

        this.page.main.html(`
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
                        <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_task_list')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                            <i class="fa fa-list" style="margin-right: 8px; font-size: 1rem;"></i> All Tasks
                        </div>
                        <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
                            <i class="fa fa-briefcase" style="margin-right: 8px; font-size: 1rem;"></i> Projects
                        </div>
                        <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_day_planner')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                            <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                        </div>
                    </div>
                </div>

                <!-- Right Side Controls Container -->
                <div style="display: flex; align-items: center; gap: 15px; position: relative; z-index: 10;">
                    
                    <!-- View toggles group -->
                    <div style="display: flex; gap: 5px; background: rgba(0,0,0,0.1); padding: 4px; border-radius: 8px; margin-right: 5px;">
                        <div id="project-view-list" style="
                            width: 32px; height: 32px;
                            display: none; align-items: center; justify-content: center;
                            border-radius: 6px;
                            cursor: pointer;
                            color: #ffffff;
                            transition: all 0.2s;
                        " title="List View">
                            <i class="fa fa-list"></i>
                        </div>
                        <div id="project-view-gantt" style="
                            width: 32px; height: 32px;
                            display: flex; align-items: center; justify-content: center;
                            border-radius: 6px;
                            cursor: pointer;
                            color: #ffffff;
                            transition: all 0.2s;
                        " title="Gantt View">
                            <i class="fa fa-tasks"></i>
                        </div>
                        <div id="project-view-grid" style="
                            width: 32px; height: 32px;
                            display: flex; align-items: center; justify-content: center;
                            border-radius: 6px;
                            cursor: pointer;
                            color: #ffffff;
                            transition: all 0.2s;
                        " title="Grid View">
                            <i class="fa fa-th-large"></i>
                        </div>
                    </div>

                    <!-- Filter Dropdown -->
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="projectsFilterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="
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
                        ">
                            <i class="fa fa-filter" style="font-size: 1rem;"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="projectsFilterDropdown" style="margin-top: 10px; border-radius: 8px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden;">
                            <li style="border-bottom: 1px solid #f3f4f6;"><div style="padding: 8px 15px; font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Filter Time</div></li>
                            <li><a href="#" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">All Time</a></li>
                            <li><a href="#" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Today</a></li>
                            <li><a href="#" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Week</a></li>
                            <li><a href="#" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">This Month</a></li>
                        </ul>
                    </div>

                    <!-- Add Project Hyperlink/Button -->
                    <a id="btn-add-project" href="javascript:void(0)" title="Add Project" style="
                        width: 38px; height: 38px;
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 10px;
                        cursor: pointer;
                        background: rgba(255,255,255,0.2);
                        color: #ffffff;
                        transition: all 0.2s;
                        text-decoration: none;
                    ">
                        <i class="fa fa-plus" style="font-size: 1.2rem;"></i>
                    </a>
                </div>
            </div>

            <!-- Standard List View -->
            <div id="standard-project-list" style="width: 100%; margin-bottom: 50px; background: #ffffff; border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 20px; margin-top: 0px;">
                <h3 style="margin-bottom: 20px; font-size: 1.5rem; color: #374151;">All Projects</h3>
                <div class="table-responsive">
                    <table class="frappe-list-table" id="project-table" style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th style="width: 50px;"></th>
                                <th style="width: 30%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Project Name</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Status</th>
                                <th style="width: 15%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Priority</th>
                                <th style="width: 35%; padding: 12px 15px; border-bottom: 1px solid #d1d8dd; color: #8d99a6; font-size: 11px;">Tasks (Total / Open / Overdue)</th>
                                <th style="width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody id="project-table-body">
                             <tr><td colspan="4" style="text-align:center; padding:20px;">Loading projects...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Gantt View -->
            <div id="project-gantt-view" style="display: none; width: 100%; height: calc(100vh - 150px); background: #ffffff; border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 20px; margin-top: 0px; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 id="gantt-view-header" style="margin: 0; font-size: 1.5rem; color: #374151;">Projects Timeline</h3>
                    <div class="btn-group">
                        <button class="btn btn-default btn-sm" onclick="frappe.pages['dak_projects'].controller.change_gantt_view('Day')">Day</button>
                        <button class="btn btn-default btn-sm active" onclick="frappe.pages['dak_projects'].controller.change_gantt_view('Week')">Week</button>
                        <button class="btn btn-default btn-sm" onclick="frappe.pages['dak_projects'].controller.change_gantt_view('Month')">Month</button>
                    </div>
                </div>
                <div id="project-gantt-container" style="flex: 1; width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; overflow: auto; background: #ffffff;"></div>
            </div>

            <!-- Grid View -->
            <div id="project-grid-view" style="display: none; width: 100%; padding: 30px 40px;">
                <h3 style="margin-bottom: 25px; font-size: 1.5rem; color: #374151;">Projects Overview</h3>
                <div id="project-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px;">
                    <!-- Cards injected via JS -->
                </div>
            </div>

            <!-- Project Details View (Hidden by Default) -->
            <div id="project-details-view" style="display: none; width: 100%; padding-top: 20px;">
                <div style="padding: 0 40px 15px 40px;">
                    <button id="btn-back-projects" class="btn btn-default btn-sm">
                        <i class="fa fa-arrow-left"></i> Back to Projects
                    </button>
                </div>
                <div id="project-details-card" style="background: white; border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; width: 100%; border-top: 1px solid #f3f4f6;">
                    <!-- Content injected via JS -->
                </div>
            </div>
        `);

        frappe.pages["dak_projects"].controller = this;
        this.current_view = "list";

        // Bind View Toggles (Delegated)
        this.page.main.off("click", "#project-view-list").on("click", "#project-view-list", () => this.toggle_view('list'));
        this.page.main.off("click", "#project-view-gantt").on("click", "#project-view-gantt", () => this.toggle_view('gantt'));
        this.page.main.off("click", "#project-view-grid").on("click", "#project-view-grid", () => this.toggle_view('grid'));

        // Bind Add Project Button (Delegated)
        this.page.main.off("click", "#btn-add-project").on("click", "#btn-add-project", (e) => {
            console.log("Add Project clicked");
            this.open_project_modal();
        });

        // Bind Hover Effects (Delegated)
        this.page.main.on("mouseenter", "#btn-add-project, #projectsFilterDropdown", function () {
            $(this).css('background', 'rgba(255,255,255,0.3)');
        }).on("mouseleave", "#btn-add-project, #projectsFilterDropdown", function () {
            $(this).css('background', 'rgba(255,255,255,0.2)');
        });

        // Bind Dropdown Filters (Delegated)
        this.page.main.off("click", ".dropdown-menu a").on("click", ".dropdown-menu a", (e) => {
            e.preventDefault();
            let filter = $(e.currentTarget).text().trim();
            console.log("Filter selected:", filter);
            this.apply_project_filters(filter);
        });

        this.render_projects();
    }

    toggle_view(view) {
        console.log("Switching project view to:", view);
        this.current_view = view;

        // Reset visibility of toggle buttons
        this.page.main.find("#project-view-list, #project-view-gantt, #project-view-grid").css("display", "flex");

        if (view === 'list') {
            this.page.main.find("#project-gantt-view").hide();
            this.page.main.find("#project-grid-view").hide();
            this.page.main.find("#standard-project-list").fadeIn(200);
            this.page.main.find("#project-view-list").css("display", "none");
        } else if (view === 'gantt') {
            this.page.main.find("#standard-project-list").hide();
            this.page.main.find("#project-grid-view").hide();
            this.page.main.find("#project-details-view").hide();
            this.page.main.find("#project-gantt-view").fadeIn(200);
            this.page.main.find("#project-view-gantt").css("display", "none");

            // Update Header if there is an active project
            let activeProject = this.all_projects ? this.all_projects.find(p => p.custom_working_now == 1) : null;
            if (activeProject) {
                this.page.main.find("#gantt-view-header").text("Timeline: " + activeProject.project_name);
            } else {
                this.page.main.find("#gantt-view-header").text("Projects Timeline");
            }

            this.render_gantt_view();
        } else if (view === 'grid') {
            console.log("Projects: Switching to Grid View. Data available:", (this.all_projects || []).length);
            this.page.main.find("#standard-project-list").hide();
            this.page.main.find("#project-gantt-view").hide();
            this.page.main.find("#project-details-view").hide();
            this.page.main.find("#project-grid-view").fadeIn(200);
            this.page.main.find("#project-view-grid").css("display", "none");
            this.render_grid_view();
        }
    }

    render_gantt_view() {
        let me = this;
        if (!this.all_projects || this.all_projects.length === 0) return;

        // Find active project
        let activeProject = this.all_projects.find(p => p.custom_working_now == 1);

        if (activeProject) {
            console.log("Gantt: Fetching tasks for active project", activeProject.name);
            this.page.main.find("#gantt-view-header").text("Timeline: " + activeProject.project_name);

            frappe.call({
                method: "dakbabu.dakbabu.page.dak_projects.dak_projects.get_project_tasks",
                args: { project_name: activeProject.name },
                callback: (r) => {
                    if (r.message && r.message.length > 0) {
                        let mapped_tasks = r.message.map(t => {
                            let start = moment(t.exp_start_date || t.creation);
                            let end = moment(t.exp_end_date);

                            if (!start.isValid()) start = moment();
                            if (!end.isValid() || end.isSameOrBefore(start)) end = moment(start).add(1, 'days');

                            return {
                                id: t.name,
                                name: t.subject || t.name,
                                start: start.format('YYYY-MM-DD'),
                                end: end.format('YYYY-MM-DD'),
                                progress: parseFloat(t.progress) || 0,
                                custom_class: `gantt-task-${(t.status || 'open').toLowerCase().replace(' ', '-')}`
                            };
                        });
                        this.draw_gantt(mapped_tasks, true);
                    } else {
                        console.log("Gantt: No tasks found for active project, falling back to projects view");
                        this.render_all_projects_gantt();
                    }
                }
            });
        } else {
            this.render_all_projects_gantt();
        }
    }

    render_all_projects_gantt() {
        this.page.main.find("#gantt-view-header").text("Projects Timeline");
        let project_tasks = this.all_projects
            .filter(p => p.expected_start_date && p.expected_end_date)
            .map(p => {
                let start = moment(p.expected_start_date);
                let end = moment(p.expected_end_date);

                // Fallback for invalid dates
                if (!start.isValid()) start = moment();
                if (!end.isValid()) end = moment(start).add(1, 'days');

                if (end.isSameOrBefore(start)) end = moment(start).add(1, 'days');

                return {
                    id: p.name,
                    name: p.project_name || p.name,
                    start: start.format('YYYY-MM-DD'),
                    end: end.format('YYYY-MM-DD'),
                    progress: parseFloat(p.percent_complete) || 0,
                    custom_class: `gantt-project-${(p.status || 'open').toLowerCase().replace(' ', '-')}`
                };
            });

        if (project_tasks.length === 0) {
            this.page.main.find("#project-gantt-container").html(`
                <div style="text-align:center; padding: 60px 20px; color: #6b7280;">
                    <i class="fa fa-calendar-times-o" style="font-size: 3rem; color: #d1d5db; margin-bottom: 20px; display: block;"></i>
                    <h3 style="margin-bottom: 10px; color: #374151;">Missing Timeline Dates</h3>
                    <p style="font-size: 0.95rem; max-width: 400px; margin: 0 auto;">Some projects are missing <b>Start</b> and <b>Due</b> dates. Please update them in the project list to see the timeline.</p>
                </div>
            `);
            return;
        }

        this.draw_gantt(project_tasks, false);
    }

    draw_gantt(tasks, is_task_level) {
        let me = this;

        console.log("Gantt: Initializing draw for tasks:", tasks.length);

        // Use CDN for maximum reliability if local paths are uncertain in this environment
        const GANTT_JS = "https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.6.1/frappe-gantt.min.js";
        const GANTT_CSS = "https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.6.1/frappe-gantt.css";

        frappe.require([GANTT_JS, GANTT_CSS], function () {
            // Check if Gantt is available in global scope
            let GanttConstructor = window.Gantt;

            if (!GanttConstructor) {
                console.error("Gantt: Constructor still missing after require.");
                me.page.main.find("#project-gantt-container").html('<div style="color:red; padding:20px; text-align:center;"><b>Library Load Error</b><br>Gantt library loaded but not initialized.</div>');
                return;
            }

            // Ensure container is empty
            me.page.main.find("#project-gantt-container").empty().css({
                "background": "#ffffff",
                "min-height": "400px",
                "border-radius": "12px",
                "overflow": "auto"
            });

            let svgElement = $('<svg id="project-gantt-svg" width="100%"></svg>').appendTo(me.page.main.find("#project-gantt-container"));

            // Small delay to ensure display:none is gone and layout is stable
            setTimeout(() => {
                try {
                    // Final data check: filter out any invalid mapped items
                    let final_tasks = tasks.filter(t => t.start && t.end && t.start !== "Invalid date" && t.end !== "Invalid date");

                    if (final_tasks.length === 0) {
                        me.page.main.find("#project-gantt-container").html('<div style="padding:40px; text-align:center; color: #6b7280;">No valid tasks with dates to display.</div>');
                        return;
                    }

                    console.log("Gantt: Drawing SVG with", final_tasks.length, "rows");

                    me.gantt = new GanttConstructor("#project-gantt-svg", final_tasks, {
                        on_click: function (task) {
                            if (is_task_level) {
                                me.open_task_details_modal(task.id);
                            } else {
                                me.open_project_details(task.id);
                            }
                        },
                        view_mode: me.gantt_view_mode || 'Week',
                        language: 'en',
                        bar_height: 30,
                        padding: 18
                    });

                    // Auto-fit height based on rows
                    let calculatedHeight = final_tasks.length * 45 + 100;
                    svgElement.attr("height", calculatedHeight);
                    svgElement.css("min-height", calculatedHeight + "px");

                } catch (e) {
                    console.error("Gantt Runtime Error:", e);
                    me.page.main.find("#project-gantt-container").html('<div style="color:red; padding:20px; text-align:center;"><b>Timeline Render Failed</b><br>' + e.message + '</div>');
                }
            }, 300);
        });
    }

    change_gantt_view(mode) {
        if (this.gantt) {
            this.gantt.change_view_mode(mode);
            this.page.main.find("#project-gantt-view .btn-group .btn").removeClass("active");
            this.page.main.find(`#project-gantt-view .btn-group .btn:contains('${mode}')`).addClass("active");
        }
    }

    render_projects() {
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_projects.dak_projects.get_projects_summary",
            callback: (r) => {
                if (r.message) {
                    this.all_projects = r.message;
                    this.render_projects_list(this.all_projects);
                } else {
                    this.page.main.find("#project-table-body").html('<tr><td colspan="4" style="text-align:center; padding:20px;">No projects found.</td></tr>');
                }
            }
        });
    }

    apply_project_filters(time_filter) {
        if (!this.all_projects) return;

        let filtered_projects = this.all_projects;
        if (time_filter && time_filter !== 'All Time') {
            let now = moment();
            filtered_projects = this.all_projects.filter(p => {
                if (!p.expected_end_date) return false;
                let d = moment(p.expected_end_date);
                if (time_filter === 'Today') return d.isSame(now, 'day');
                if (time_filter === 'This Week') return d.isSame(now, 'week');
                if (time_filter === 'This Month') return d.isSame(now, 'month');
                return true;
            });
        }

        // Show alert for feedback
        if (time_filter) {
            frappe.show_alert({
                message: `Showing ${time_filter}`,
                indicator: 'blue'
            });
        }

        this.render_projects_list(filtered_projects);
    }

    set_working_project(project_name) {
        let project = this.all_projects.find(p => p.name === project_name);
        if (project && project.status === "Completed") {
            frappe.msgprint({
                title: __("Cannot Activate Project"),
                message: __("This project is already <b>Completed</b>. Please re-open it before setting it as active."),
                indicator: "red",
            });
            return;
        }

        frappe.call({
            method: "dakbabu.dakbabu.page.dak_projects.dak_projects.set_working_project",
            args: { project_name: project_name },
            callback: (r) => {
                if (r.message) {
                    frappe.show_alert({ message: "Project set as Active", indicator: "green" });
                    this.render_projects();
                }
            }
        });
    }

    render_grid_view() {
        if (!this.all_projects) return;
        let html = "";
        this.all_projects.forEach(p => {
            let progress = p.percent_complete || 0;
            let statusColor = p.status === 'Completed' ? '#10b981' : '#3b82f6';
            if (p.status === 'Open') statusColor = '#10b981';

            let isWorking = p.custom_working_now == 1;

            html += `
                <div class="project-card" onclick="frappe.pages['dak_projects'].controller.open_project_details('${p.name}')" style="
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    border: 1px solid #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 220px;
                " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';">
                    
                    <!-- Interactive Active Indicator -->
                    <div onclick="event.stopPropagation(); frappe.pages['dak_projects'].controller.set_working_project('${p.name}')" 
                         style="position: absolute; top: 15px; right: 15px; cursor: pointer; color: ${isWorking ? '#2e605c' : '#d1d5db'}; font-size: 1.2rem; transition: all 0.2s; z-index: 2;" 
                         title="${isWorking ? 'Active Project' : 'Set as Active'}"
                         onmouseover="if(!${isWorking}) this.style.color='#2e605c'" 
                         onmouseout="if(!${isWorking}) this.style.color='#d1d5db'">
                        <i class="fa ${isWorking ? 'fa-dot-circle-o' : 'fa-circle-o'}"></i>
                    </div>

                    <div>
                        <div style="font-weight: 700; font-size: 1.1rem; color: #111827; margin-bottom: 5px; padding-right: 25px;">${p.project_name}</div>
                        <div style="font-size: 0.8rem; color: #6b7280; margin-bottom: 15px;">${p.name}</div>
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                            <span style="font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; background: ${statusColor}15; color: ${statusColor}; font-weight: 600;">${p.status}</span>
                            <span style="font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; background: #f3f4f6; color: #4b5563; font-weight: 600;">${p.priority || 'Medium'}</span>
                        </div>
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: #374151;">Progress</span>
                            <span style="font-size: 0.8rem; font-weight: 700; color: #111827;">${progress}%</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, #2e605c, #468e88); transition: width 0.5s ease;"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px; padding-top: 15px; border-top: 1px solid #f3f4f6;">
                            <div style="display: flex; gap: 20px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 0.9rem; font-weight: 700; color: #111827;">${p.total || 0}</div>
                                    <div style="font-size: 0.7rem; color: #6b7280; text-transform: uppercase;">Tasks</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 0.9rem; font-weight: 700; color: #0369a1;">${p.open || 0}</div>
                                    <div style="font-size: 0.7rem; color: #6b7280; text-transform: uppercase;">Open</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 0.9rem; font-weight: 700; color: #b91c1c;">${p.overdue || 0}</div>
                                    <div style="font-size: 0.7rem; color: #6b7280; text-transform: uppercase;">Overdue</div>
                                </div>
                            </div>

                            <!-- Project Completion Button -->
                            <div onclick="event.stopPropagation(); frappe.pages['dak_projects'].controller.complete_project('${p.name}')" 
                                 style="cursor: ${p.status === 'Completed' ? 'default' : 'pointer'}; color: ${p.status === 'Completed' ? '#2e605c' : '#d1d5db'}; transition: all 0.2s; font-size: 1.3rem; margin-bottom: 2px;" 
                                 title="${p.status === 'Completed' ? 'Project Completed' : 'Mark as Completed'}"
                                 onmouseover="if('${p.status}' !== 'Completed') this.style.color='#2e605c'" 
                                 onmouseout="if('${p.status}' !== 'Completed') this.style.color='#d1d5db'">
                                <i class="fa ${p.status === 'Completed' ? 'fa-check-circle' : 'fa-check-circle-o'}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        this.page.main.find("#project-grid-container").html(html);
    }

    complete_project(project_name) {
        frappe.confirm(`Are you sure you want to mark project <b>${project_name}</b> as Completed?`, () => {
            frappe.call({
                method: "dakbabu.dakbabu.page.dak_projects.dak_projects.complete_project",
                args: { project_name: project_name },
                callback: (r) => {
                    if (r.message) {
                        frappe.show_alert({ message: "Project Marked Completed", indicator: "green" });
                        this.render_projects();
                    }
                }
            });
        });
    }

    render_projects_list(projects) {
        if (projects && projects.length > 0) {
            let html = "";
            projects.forEach(p => {
                let statusColor = p.status === 'Completed' ? '#10b981' : '#3b82f6';
                if (p.status === 'Open') statusColor = '#10b981';

                let isWorking = p.custom_working_now == 1;
                let workingIcon = isWorking
                    ? `<i class="fa fa-dot-circle-o" style="color: #2e605c; font-size: 1.2rem;"></i>`
                    : `<i class="fa fa-circle-o" style="color: #d1d5db; font-size: 1.2rem; transition: color 0.2s;"></i>`;

                html += `
                    <tr class="frappe-list-row" onclick="frappe.pages['dak_projects'].controller.open_project_details('${p.name}')" style="cursor: pointer;">
                        <td style="text-align: center; vertical-align: middle;" onclick="event.stopPropagation(); frappe.pages['dak_projects'].controller.set_working_project('${p.name}')">
                            <div style="cursor: pointer; padding: 5px;" title="${isWorking ? 'Currently Active' : 'Set as Active'}">${workingIcon}</div>
                        </td>
                        <td style="padding: 12px 15px;">
                            <div style="font-weight: 600; color: #1f2937;">${p.project_name}</div>
                            <div style="font-size: 0.8rem; color: #6b7280;">${p.name}</div>
                        </td>
                        <td style="padding: 12px 15px;">
                            <span style="color: ${statusColor}; font-weight: 500;">${p.status}</span>
                        </td>
                        <td style="padding: 12px 15px;">
                            ${p.priority || '-'}
                        </td>
                        <td style="padding: 12px 15px;">
                            <div style="display: flex; gap: 10px;">
                                <span class="badge" style="background: #f3f4f6; color: #374151;">${p.total || 0} Total</span>
                                <span class="badge" style="background: #e0f2fe; color: #0369a1;">${p.open || 0} Open</span>
                                ${p.overdue > 0 ? `<span class="badge" style="background: #fee2e2; color: #b91c1c;">${p.overdue} Overdue</span>` : ''}
                            </div>
                        </td>
                        <td style="padding: 12px 15px; text-align: center;" onclick="event.stopPropagation(); ${p.status !== 'Completed' ? `frappe.pages['dak_projects'].controller.complete_project('${p.name}')` : ''}">
                             ${p.status === 'Completed' ?
                        `<i class="fa fa-check-circle" title="Completed" style="color: #1e6058; font-size: 1.5rem;"></i>` :
                        `<i class="fa fa-check-circle" title="Mark as Completed" style="color: #d1d5db; font-size: 1.5rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#1e6058'" onmouseout="this.style.color='#d1d5db'"></i>`
                    }
                        </td>
                    </tr>
                `;
            });
            this.page.main.find("#project-table-body").html(html);
        } else {
            this.page.main.find("#project-table-body").html('<tr><td colspan="6" style="text-align:center; padding:20px;">No projects found for this filter.</td></tr>');
        }
    }

    open_project_details(project_name) {
        let me = this;
        // Fetch project details and tasks
        frappe.call({
            method: "frappe.client.get",
            args: { doctype: "Project", name: project_name },
            callback: function (r) {
                if (r.message) {
                    let project = r.message;
                    me.render_project_details_view(project);
                }
            }
        });
    }

    render_project_details_view(project) {
        let me = this;
        let detailsHtml = `
            <div style="padding: 30px;">
                <!-- Header Section -->
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
                    <div>
                        <h1 style="margin: 0; font-size: 2rem; color: #111827; font-weight: 700;">${project.project_name}</h1>
                        <div style="color: #6b7280; font-size: 1rem; margin-top: 5px;">${project.name}</div>
                        <div style="color: #6b7280; font-size: 0.9rem; margin-top: 2px;">
                            <i class="fa fa-calendar" style="margin-right: 5px;"></i> ${project.expected_start_date ? frappe.datetime.str_to_user(project.expected_start_date) : 'No Start Date'}
                        </div>
                    </div>
                    <div>
                        <span class="badge" style="font-size: 1rem; padding: 8px 16px; background: ${project.status === 'Completed' ? '#dcfce7' : '#dbeafe'}; color: ${project.status === 'Completed' ? '#166534' : '#1e40af'};">
                            ${project.status}
                        </span>
                    </div>
                </div>
                
                <!-- Main Content Split -->
                <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                    
                    <!-- Left Column: Project Stats -->
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px; color: #374151;">Project Details</h3>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                                <label style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Priority</label>
                                <div style="font-size: 1.1rem; font-weight: 600; color: #111827;">${project.priority || '-'}</div>
                            </div>
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                                <label style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Expected End Date</label>
                                <div style="font-size: 1.1rem; font-weight: 600; color: #111827;">${project.expected_end_date ? frappe.datetime.str_to_user(project.expected_end_date) : '-'}</div>
                            </div>
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                                <label style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Created On</label>
                                <div style="font-size: 1.1rem; font-weight: 600; color: #111827;">${frappe.datetime.str_to_user(project.creation)}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Tasks & Timeline -->
                    <div style="flex: 2; min-width: 400px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="font-size: 1.1rem; font-weight: 600; margin: 0; color: #374151;">Project Tasks</h3>
                            <div class="btn-group">
                                <button class="btn btn-default btn-xs active" id="btn-tasks-list">List</button>
                                <button class="btn btn-default btn-xs" id="btn-tasks-gantt">Timeline</button>
                            </div>
                        </div>

                        <!-- Task List Container -->
                        <div id="project-tasks-list-container" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <div style="text-align:center; padding: 40px; color: #9ca3af;">Loading tasks...</div>
                        </div>

                        <!-- Task Gantt Container -->
                        <div id="project-tasks-gantt-container" style="display: none; height: 400px; width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; background: white; padding: 10px;">
                             <div id="project-task-gantt-svg"></div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.page.main.find("#project-details-card").html(detailsHtml);
        this.page.main.find("#standard-project-list").hide();
        this.page.main.find("#project-details-view").fadeIn();

        // Bind Back Button
        this.page.main.find("#btn-back-projects").off("click").on("click", function () {
            me.page.main.find("#project-details-view").hide();
            me.page.main.find("#standard-project-list").fadeIn();
        });

        // Load Tasks
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_projects.dak_projects.get_project_tasks",
            args: { project_name: project.name },
            callback: function (r) {
                if (r.message && r.message.length > 0) {
                    let tasksHtml = '<table class="frappe-list-table" style="width: 100%; table-layout: fixed;"><thead><tr><th style="width: 40%; padding: 12px 15px;">Subject</th><th style="width: 20%; padding: 12px 15px;">Status</th><th style="width: 20%; padding: 12px 15px;">Priority</th><th style="width: 20%; padding: 12px 15px;">Due Date</th></tr></thead><tbody>';
                    r.message.forEach(t => {
                        tasksHtml += `
                            <tr onclick="frappe.pages['dak_projects'].controller.open_task_details_modal('${t.name}')" style="cursor: pointer; transition: background 0.1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                                <td style="padding: 12px 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    <div style="font-weight: 500; color: #1f2937;">${t.subject}</div>
                                </td>
                                <td style="padding: 12px 15px;"><span class="indicator ${t.status === 'Completed' ? 'green' : (t.status === 'Overdue' ? 'red' : 'blue')}">${t.status}</span></td>
                                <td style="padding: 12px 15px;">${t.priority}</td>
                                <td style="padding: 12px 15px;">${t.exp_end_date ? frappe.datetime.str_to_user(t.exp_end_date) : '-'}</td>
                            </tr>
                         `;
                    });
                    tasksHtml += '</tbody></table>';
                    me.page.main.find("#project-tasks-list-container").html(tasksHtml);

                    // Setup Toggles
                    me.page.main.find("#btn-tasks-list").on("click", function () {
                        $(this).addClass("active");
                        me.page.main.find("#btn-tasks-gantt").removeClass("active");
                        me.page.main.find("#project-tasks-gantt-container").hide();
                        me.page.main.find("#project-tasks-list-container").fadeIn();
                    });

                    me.page.main.find("#btn-tasks-gantt").on("click", function () {
                        $(this).addClass("active");
                        me.page.main.find("#btn-tasks-list").removeClass("active");
                        me.page.main.find("#project-tasks-list-container").hide();
                        me.page.main.find("#project-tasks-gantt-container").fadeIn();
                        me.render_task_gantt(r.message);
                    });
                } else {
                    me.page.main.find("#project-tasks-list-container").html('<div style="text-align:center; padding: 20px; color: #6b7280;">No tasks found for this project.</div>');
                }
            }
        });
    }

    render_task_gantt(tasks) {
        let me = this;
        frappe.require("frappe-gantt.min.js", function () {
            let gantt_tasks = tasks.map(t => {
                let start = t.exp_start_date || t.creation;
                let end = t.exp_end_date || moment(start).add(1, 'days').format('YYYY-MM-DD');
                if (moment(end).isBefore(start)) end = moment(start).add(1, 'days').format('YYYY-MM-DD');

                return {
                    id: t.name,
                    name: t.subject,
                    start: start,
                    end: end,
                    progress: t.progress || 0,
                    custom_class: `gantt-task-${t.status.toLowerCase().replace(' ', '-')}`
                };
            });

            if (gantt_tasks.length === 0) {
                me.page.main.find("#project-task-gantt-svg").html('<div style="text-align:center; padding: 20px; color: #9ca3af;">No tasks with dates to show on timeline.</div>');
                return;
            }

            me.page.main.find("#project-task-gantt-svg").empty();
            new Gantt("#project-task-gantt-svg", gantt_tasks, {
                on_click: function (task) {
                    me.open_task_details_modal(task.id);
                },
                view_mode: 'Week',
                language: 'en'
            });
        });
    }

    open_project_modal() {
        console.log("Opening project modal...");
        let me = this;
        let d = new frappe.ui.Dialog({
            title: 'Create Project (Step 1/2)',
            fields: [
                // STEP 1 FIELDS
                {
                    label: 'Project Details',
                    fieldname: 'sec_step_1',
                    fieldtype: 'Section Break'
                },
                {
                    label: 'Project Name',
                    fieldname: 'project_name',
                    fieldtype: 'Data',
                    reqd: 1
                },
                {
                    label: 'Start Date',
                    fieldname: 'expected_start_date',
                    fieldtype: 'Date',
                    reqd: 1
                },
                {
                    label: 'Due Date',
                    fieldname: 'expected_end_date',
                    fieldtype: 'Date',
                    reqd: 1
                },
                {
                    label: 'Priority',
                    fieldname: 'priority',
                    fieldtype: 'Select',
                    options: ['Medium', 'High', 'Low'],
                    default: 'Medium'
                },
                {
                    label: 'Status',
                    fieldname: 'status',
                    fieldtype: 'Select',
                    options: ['Open', 'Completed', 'Cancelled'],
                    default: 'Open'
                },

                // STEP 2 FIELDS (Initially Hidden)
                {
                    label: 'Billing & Customer',
                    fieldname: 'sec_step_2',
                    fieldtype: 'Section Break',
                    hidden: 1
                },
                {
                    label: 'Customer',
                    fieldname: 'customer',
                    fieldtype: 'Link',
                    options: 'Customer',
                    hidden: 1
                },
                {
                    label: 'Billing Required',
                    fieldname: 'billing_required',
                    fieldtype: 'Check',
                    default: 0,
                    hidden: 1
                }
            ],
            primary_action_label: 'Next',
            primary_action(values) {
                if (d.current_step === 1) {
                    // Validate Step 1
                    if (!values.project_name || !values.expected_start_date || !values.expected_end_date) {
                        frappe.msgprint(__("Project Name, Start Date, and Due Date are mandatory."));
                        return;
                    }

                    if (moment(values.expected_end_date).isBefore(values.expected_start_date)) {
                        frappe.msgprint(__("Due Date cannot be before Start Date."));
                        return;
                    }

                    // Move to Step 2
                    d.current_step = 2;
                    d.set_title('Create Project (Step 2/2)');

                    // Hide Step 1
                    d.set_df_property('sec_step_1', 'hidden', 1);
                    d.set_df_property('project_name', 'hidden', 1);
                    d.set_df_property('expected_start_date', 'hidden', 1);
                    d.set_df_property('expected_end_date', 'hidden', 1);
                    d.set_df_property('priority', 'hidden', 1);
                    d.set_df_property('status', 'hidden', 1);

                    // Show Step 2
                    d.set_df_property('sec_step_2', 'hidden', 0);
                    d.set_df_property('customer', 'hidden', 0);
                    d.set_df_property('billing_required', 'hidden', 0);

                    d.set_primary_action('Create', () => {
                        let final_values = d.get_values();
                        me.create_project(d, final_values);
                    });
                }
            }
        });

        d.current_step = 1;
        d.show();

        // Apply Custom Theme Styles
        this.apply_modal_theme(d);
    }

    create_project(d, values) {
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'Project',
                    project_name: values.project_name,
                    expected_start_date: values.expected_start_date,
                    expected_end_date: values.expected_end_date,
                    priority: values.priority,
                    status: values.status,
                    customer: values.customer,
                    is_billing_disabled: !values.billing_required
                }
            },
            callback: function (r) {
                if (!r.exc) {
                    frappe.show_alert({ message: 'Project Created', indicator: 'green' });
                    d.hide();
                    frappe.pages["dak_projects"].controller.render_projects();
                }
            }
        });
    }

    apply_modal_theme(d) {
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

        // Styling primary button if it exists
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
    }

    open_task_details_modal(task_name) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Task',
                name: task_name
            },
            callback: (r) => {
                if (r.message) {
                    let task = r.message;
                    let d = new frappe.ui.Dialog({
                        title: 'Task Details',
                        size: 'large'
                    });

                    let statusColor = task.status === 'Completed' ? 'green' : (task.status === 'Overdue' ? 'red' : 'blue');
                    // Removing 'Open Full Task Form' button by default, just showing 'Close' as secondary if needed, 
                    // or we can add a custom action.

                    let html = `
                        <div style="padding: 20px;">
                            <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                                <span class="indicator ${statusColor}" style="font-size: 14px; font-weight: 500;">${task.status}</span>
                                <span style="background: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-size: 12px; color: #4b5563; font-weight: 600;">${task.priority}</span>
                                <span style="font-size: 12px; color: #9ca3af; margin-left: auto;">${task.name}</span>
                            </div>
                            
                            <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #111827; line-height: 1.3;">${task.subject}</h3>
                            
                            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
                                <div style="font-size: 0.95rem; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${task.description || '<span style="color: #9ca3af; font-style: italic;">No description provided.</span>'}</div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                                <div style="padding: 10px; border-radius: 8px; border: 1px solid #f3f4f6;">
                                    <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Start Date</div>
                                    <div style="font-weight: 600; color: #374151;">${task.exp_start_date ? frappe.datetime.str_to_user(task.exp_start_date) : '-'}</div>
                                </div>
                                <div style="padding: 10px; border-radius: 8px; border: 1px solid #f3f4f6;">
                                    <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Due Date</div>
                                    <div style="font-weight: 600; color: #374151;">${task.exp_end_date ? frappe.datetime.str_to_user(task.exp_end_date) : '-'}</div>
                                </div>
                                 <div style="padding: 10px; border-radius: 8px; border: 1px solid #f3f4f6;">
                                    <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Assigned To</div>
                                    <div style="font-weight: 600; color: #374151;">${task.allocated_to || '-'}</div> <!-- Assuming allocated_to field exists, or _assign -->
                                </div>
                            </div>

                            <div style="text-align: right; margin-top: 10px;">
                                <button class="btn btn-default btn-xs" onclick="frappe.set_route('Form', 'Task', '${task.name}')">
                                    Open Full Form <i class="fa fa-external-link" style="margin-left: 5px;"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    d.$body.html(html);
                    d.show();

                    // Apply theme
                    this.apply_modal_theme(d);
                }
            }
        });
    }
}
