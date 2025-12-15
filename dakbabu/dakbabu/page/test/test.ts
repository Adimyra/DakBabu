// Type Definitions for Frappe & jQuery
declare var frappe: any;

interface Task {
    name: string;
    subject: string;
    status: string;
    priority: string;
    exp_end_date: string;
    owner: string;
}

type ViewMode = 'List' | 'Card' | 'Kanban';

frappe.pages['test'].on_page_load = function (wrapper: HTMLElement) {
    const $wrapper = $(wrapper);

    // State
    let state = {
        pageIndex: 0,
        pageSize: 10,
        hasNextPage: false,
        isLoading: false,
        viewMode: 'List' as ViewMode,
        visibleColumns: ['Subject', 'Status', 'Priority', 'Due Date', 'Actions'] // For Column Picker
    };

    try {
        console.log("Test Page: Starting execution (TypeScript -> Multi-View Mode)...");

        // Suppress default page elements
        const page = frappe.ui.make_app_page({
            parent: wrapper,
            title: '',
            single_column: true
        });
        page.set_title('');

        // --- 1. CSS Injection (Teal Palette & Dark Mode) ---
        const page_css = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

            /* Palette
               #031716 (Black Green)
               #032F30 (Dark Teal)
               #0A7075 (Teal)
               #0C969C (Bright Teal)
               #6BA3BE (Muted Blue)
               #274D60 (Slate Teal)
            */

             /* Page Background */
            .page-container {
                background-color: #f4f8f9 !important; /* Very light teal tint */
                transition: background-color 0.3s ease;
            }
            .page-container.dark-theme-active {
                background-color: #010d0c !important; /* Deep Dark Background */
            }

            /* Container */
            .modern-task-container {
                font-family: 'Roboto', sans-serif;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0 10px 30px rgba(3, 23, 22, 0.08);
                padding: 30px;
                margin: 20px 0;
                min-height: 600px;
                color: #031716;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            /* --- DARK THEME OVERRIDES --- */
            .modern-task-container.dark-theme {
                background: #021a19;
                color: #e0f2f1;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                border: 1px solid #0a3d3d;
            }

            /* Header */
            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }
            .page-title {
                font-size: 28px;
                font-weight: 700;
                color: #032F30; /* Dark Teal */
                margin: 0;
                transition: color 0.3s;
            }
            .dark-theme .page-title { color: #80cbc4; }

            .header-actions {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .btn-action {
                background: transparent;
                border: 1px solid #6BA3BE;
                color: #274D60;
                padding: 9px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            .btn-action:hover { background: #e0f2f1; }
            .btn-action.active {
                background: #0A7075;
                color: #fff;
                border-color: #0A7075;
            }

            .btn-play-text {
                background: #4caf50 !important; /* Solid Green */
                border-color: #4caf50 !important;
                box-shadow: 0 4px 6px rgba(76, 175, 80, 0.4);
            }
            .btn-play-text:hover {
                background: #43a047 !important;
                box-shadow: 0 6px 8px rgba(76, 175, 80, 0.6);
            }

            .btn-stop-text {
                background: #f44336 !important; /* Solid Red */
                border-color: #f44336 !important;
                box-shadow: 0 4px 6px rgba(244, 67, 54, 0.4);
            }
            .btn-stop-text:hover {
                background: #e53935 !important;
                box-shadow: 0 6px 8px rgba(244, 67, 54, 0.6);
            }
            .dark-theme .btn-action {
                border-color: #4db6ac;
                color: #80cbc4;
            }
            .dark-theme .btn-action:hover { background: #032F30; }
            .dark-theme .btn-action.active {
                background: #004d40;
                color: #fff;
                border-color: #004d40;
            }

            .btn-new-task {
                background: #0A7075; /* Teal Primary */
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.2s;
                box-shadow: 0 4px 6px -1px rgba(10, 112, 117, 0.3);
            }
            .btn-new-task:hover { background: #0C969C; }


            /* Toolbar */
            .task-toolbar {
                display: flex;
                gap: 15px;
                align-items: center;
                margin-bottom: 30px;
            }
            .search-wrapper { position: relative; width: 300px; }
            .modern-search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid #6BA3BE;
                border-radius: 8px;
                font-size: 14px;
                color: #031716;
                background: #ffffff;
                transition: all 0.3s;
            }
            .modern-search-input:focus {
                outline: none;
                border-color: #0A7075;
                box-shadow: 0 0 0 2px rgba(10, 112, 117, 0.1);
            }
            .dark-theme .modern-search-input {
                background: #032F30;
                border-color: #274D60;
                color: #e0f2f1;
            }
            .dark-theme .modern-search-input::placeholder { color: #80cbc4; opacity: 0.5; }

            /* --- Decorative Sphere Card --- */
            .decorative-sphere-card {
                margin: 20px 0;
                padding: 40px;
                border-radius: 24px;
                background: linear-gradient(45deg, #2F4F4F 0%, #7DAFC2 100%);
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(47, 79, 79, 0.3);
                min-height: 250px; /* Increased height for buttons */
            }
            .sphere-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                z-index: 2;
            }
            .sphere-3d {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #7DAFC2 0%, #3e6b72 50%, #2F4F4F 100%);
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .small-circle-badge {
                position: absolute;
                bottom: -20px; /* Swapped to Bottom Center */
                left: 50%;
                transform: translateX(-50%);
                min-width: 36px;
                height: 36px;
                padding: 0 6px;
                border-radius: 18px;
                border: 2px solid #ffffff;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(2px);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 600;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                z-index: 10;
                white-space: nowrap;
            }
            .sphere-inner-col {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 12px;
                z-index: 5;
            }
            .sphere-clock {
                font-family: 'Courier New', Courier, monospace;
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                letter-spacing: 1px;
                line-height: 1;
                z-index: 5;
            }
            .sphere-internal-controls {
                position: absolute;
                bottom: 10px;
                right: 0px; /* Moved right 20px */
                left: auto;
                transform: none;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 6;
            }
            .sphere-icon-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: none;
                padding: 0;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
                color: #fff;
                transition: all 0.2s;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }
            .sphere-icon-btn:hover { transform: scale(1.1); box-shadow: 0 6px 10px rgba(0,0,0,0.4); }
            .sphere-icon-btn:active { transform: scale(0.95); }

            .sphere-icon-btn svg { width: 16px; height: 16px; fill: currentColor; }

            .btn-play-icon {
                background: #4caf50 !important; /* Solid Green */
            }
            .btn-play-icon:hover { background: #43a047 !important; }

            .btn-stop-icon {
                background: #f44336 !important; /* Solid Red */
            }
            .btn-stop-icon:hover { background: #e53935 !important; }
            .btn-sphere {
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                transition: transform 0.1s, box-shadow 0.1s;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }
            .btn-sphere:active { transform: translateY(1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .btn-start { background: #4caf50; color: white; }
            .btn-end { background: #f44336; color: white; }

            .card-content {
                margin-left: 60px;
                color: #ffffff;
                z-index: 2;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .card-content h3 { font-size: 24px; font-weight: 700; margin: 0 0 5px 0; color: #fff; }
            .card-content p { font-size: 14px; opacity: 0.9; margin: 0; }

            /* --- VIEWS --- */
            .view-container { flex: 1; overflow-y: auto; overflow-x: hidden; }

            /* --- FRA-PPE (Standard) LIST VIEW MIMIC --- */
            .frappe-list-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .frappe-list-table thead th {
                background-color: #f7fafc;
                color: #8d99a6;
                font-size: 11px;
                font-weight: normal;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 12px 15px;
                border-bottom: 1px solid #d1d8dd;
                text-align: left;
            }
            .dark-theme .frappe-list-table thead th {
                background-color: #0e1e25;
                color: #5c6975;
                border-bottom-color: #23313a;
            }

            .frappe-list-row {
                transition: background-color 0.2s;
                cursor: pointer;
            }
            .frappe-list-row:hover td {
                background-color: #f7fafc;
            }
            .dark-theme .frappe-list-row:hover td {
                background-color: #1a272e;
            }

            .frappe-list-table td {
                padding: 12px 15px;
                border-bottom: 1px solid #d1d8dd;
                vertical-align: top;
                background-color: #ffffff;
                color: #000;
                font-size: 13px;
            }
            .dark-theme .frappe-list-table td {
                border-bottom-color: #23313a;
                background-color: #131b20;
                color: #d1d8dd;
            }

            /* Frappe Columns */
            .subject-main {
                font-weight: 600;
                color: #1f272e;
                font-size: 14px;
                margin-bottom: 4px;
                display: block;
                text-decoration: none;
            }
            .subject-meta {
                color: #8d99a6;
                font-size: 11px;
            }
            .dark-theme .subject-main { color: #d1d8dd; }
            .dark-theme .subject-meta { color: #5c6975; }

            /* Status Indicator (Dot) */
            .indicator {
                display: inline-flex;
                align-items: center;
                font-size: 12px;
                color: #1f272e;
            }
            .indicator::before {
                content: '';
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
            }
            .dark-theme .indicator { color: #d1d8dd; }

            /* Status Colors */
            .indicator.green::before { background: #28a745; }
            .indicator.red::before { background: #ff5858; }
            .indicator.orange::before { background: #ffa00a; }
            .indicator.blue::before { background: #5e64ff; }
            .indicator.gray::before { background: #8d99a6; }

            /* Card View */
            .card-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                padding: 10px;
            }

            .task-card {
                /* Multi-layer Background: Noise -> Main Circles -> Shadow Circles -> Base Gradient */
                background-color: #ffffff;
                background-image:
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"),

                    /* Circle 1 & Shadow */
                    radial-gradient(circle at 90% 10%, rgba(14, 51, 42, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 92% 12%, rgba(0,0,0,0.1) 0%, transparent 45%), /* Shadow 1 */

                    /* Circle 2 & Shadow */
                    radial-gradient(circle at 10% 90%, rgba(10, 112, 117, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 12% 92%, rgba(0,0,0,0.1) 0%, transparent 45%), /* Shadow 2 */

                    linear-gradient(145deg, #f0f4f4 0%, #ffffff 100%);

                border: 1px solid rgba(255,255,255,0.5);
                border-radius: 16px;
                padding: 20px;
                transition: all 0.2s;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }

            .task-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(14, 51, 42, 0.1);
            }
            .dark-theme .task-card {
                background-color: #021a19;
                background-image:
                     url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"),
                    radial-gradient(circle at 90% 10%, rgba(128, 203, 196, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 10% 90%, rgba(10, 112, 117, 0.1) 0%, transparent 40%),
                    linear-gradient(145deg, #021a19 0%, #032F30 100%);
                border: 1px solid #0a3d3d;
            }
            /* Remove old pseudo-element since we use background-image now */
            .task-card::before { display: none; }
            .task-card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .task-card-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; color: #031716; }
            .dark-theme .task-card-title { color: #e0f2f1; }
            .task-card-date { font-size: 12px; color: #6BA3BE; }

            /* Kanban View */
            .kanban-board {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 20px;
                height: 100%;
            }
            .kanban-column {
                min-width: 280px;
                width: 320px;
                background: #f4f8f9;
                border-radius: 12px;
                padding: 15px;
                display: flex;
                flex-direction: column;
            }
            .dark-theme .kanban-column { background: #010d0c; border: 1px solid #0a3d3d;}
            .kanban-header {
                font-weight: 700;
                color: #274D60;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .dark-theme .kanban-header { color: #80cbc4; }
            .kanban-tasks { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .kanban-card {
                background: #fff;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                cursor: pointer;
            }
            .dark-theme .kanban-card { background: #021a19; color: #e0f2f1; border: 1px solid #0a3d3d;}


            /* Column Picker Popover */
            .col-picker-popover {
                position: absolute;
                top: 130px;
                left: 170px;
                background: #fff;
                border: 1px solid #f0f7fa;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border-radius: 12px;
                padding: 15px;
                z-index: 100;
                display: none;
                width: 200px;
            }
            .dark-theme .col-picker-popover { background: #021a19; border-color: #0a3d3d; }
            .col-option { display: block; margin-bottom: 8px; cursor: pointer; color: #031716; }
            .dark-theme .col-option { color: #e0f2f1; }


            /* Footer / Pagination */
            .table-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 20px;
                margin-top: auto;
                border-top: 1px solid #d1d8dd; /* Frappe Style */
                font-size: 13px;
                color: #274D60;
            }
            .dark-theme .table-footer { border-top-color: #23313a; color: #80cbc4; }
            .footer-actions { display: flex; align-items: center; gap: 20px; }
            .rows-per-page-select {
                padding: 5px 10px;
                border: 1px solid #d1d8dd;
                border-radius: 4px;
                background: transparent;
                color: inherit;
                font-size: inherit;
                cursor: pointer;
            }
            .dark-theme .rows-per-page-select option { background: #021a19; }
            .pagination-controls { display: flex; gap: 10px; align-items: center; }
            .btn-page {
                background: transparent;
                border: 1px solid #d1d8dd;
                border-radius: 4px;
                padding: 5px 10px;
                color: inherit;
                cursor: pointer;
            }
            .btn-page:disabled { opacity: 0.5; cursor: not-allowed; border-color: #ccc; }
            .btn-page:not(:disabled):hover { background: #f7fafc; color: #032F30; }

            /* Components */
            .subject-cell { display: flex; align-items: flex-start; gap: 12px; }
            .user-avatar-circle {
                width: 32px; height: 32px;
                background: #032F30; /* Dark Teal */
                color: #ffffff;
                font-weight: 600; font-size: 12px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 5px; /* Frappe is usually squircle or circle, let's go soft square */
            }
            .dark-theme .user-avatar-circle { background: #80cbc4; color: #004d40; }

            /* Re-defining Status Pill only for cards/kanban, List uses Indicators */
            .status-pill { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block; }
            /* Adapted Status Colors */
            .status-working { background: #e0f2f1; color: #0A7075; }
            .status-open { background: #f4f8f9; color: #274D60; }
            .status-overdue { background: #fef2f2; color: #ef4444; }
            .status-completed { background: #ecfdf5; color: #10b981; }
            .status-pending { background: #f1f5f9; color: #6BA3BE; }

            /* Dark Mode Status Overrides */
            .dark-theme .status-working { background: #004d40; color: #80cbc4; }
            .dark-theme .status-open { background: #032F30; color: #b2dfdb; }
            .dark-theme .status-overdue { background: #371c1c; color: #ef9a9a; }
            .dark-theme .status-completed { background: #1b5e20; color: #a5d6a7; }
            .dark-theme .status-pending { background: #263238; color: #b0bec5; }

            .priority-text { font-weight: 500; font-size: 12px; }
            .priority-high { color: #d32f2f; }
            .priority-medium { color: #f57c00; }
            .priority-low { color: #6BA3BE; }
            .dark-theme .priority-high { color: #ef9a9a; }
            .dark-theme .priority-medium { color: #ffcc80; }
            .dark-theme .priority-low { color: #90a4ae; }

            .due-date { font-size: 12px; color: #8d99a6; }
            .due-date.overdue { color: #d32f2f; font-weight: 500; }
            .dark-theme .due-date { color: #80cbc4; }
            .dark-theme .due-date.overdue { color: #ef9a9a; }
        `;

        if (!$('#dynamic-test-style').length) {
            $("<style>").prop("id", "dynamic-test-style").prop("type", "text/css").html(page_css).appendTo("head");
        }

        // --- 2. HTML Structure ---
        const page_html = `
        <div class="modern-task-container" id="mainTaskContainer">
            <div class="header-top">
                <h2 class="page-title">Task List</h2>
                <div class="header-actions">
                     <div class="view-toggles">
                        <button class="btn-action active" id="btnViewList" title="List View">☰</button>
                        <button class="btn-action" id="btnViewCard" title="Card View">▦</button>
                        <button class="btn-action" id="btnViewKanban" title="Kanban View">☷</button>
                    </div>
                    <button class="btn-action" id="btnFilter" title="Filter / Columns">
                      ⚙️ Filter
                    </button>
                    <button class="btn-theme-toggle" id="btnThemeToggle" title="Toggle Dark Mode">🌙</button>
                    <button class="btn-new-task">+ New Task</button>
                </div>
            </div>

            <!-- Column Picker Dropdown -->
            <div class="col-picker-popover" id="colPicker">
                <strong>Select Columns</strong>
                <label class="col-option"><input type="checkbox" checked value="Subject"> Subject</label>
                <label class="col-option"><input type="checkbox" checked value="Status"> Status</label>
                <label class="col-option"><input type="checkbox" checked value="Priority"> Priority</label>
                <label class="col-option"><input type="checkbox" checked value="Due Date"> Due Date</label>
            </div>

            <div class="task-toolbar">
                <div class="search-wrapper">
                    <input type="text" id="modern-search" class="modern-search-input" placeholder="Search tasks...">
                </div>
            </div>

            <div id="viewContainer" class="view-container">
               <!-- Views will be injected here -->
            </div>

            <!-- Decorative Sphere Card with Stopwatch -->
            <div class="decorative-sphere-card">
                <!-- Left Side: Task Details (Dynamic) -->
                <div class="card-content">
                    <h3 id="sphereTaskTitle">Loading Task...</h3>
                    <p id="sphereTaskDesc">Fetching latest activity...</p>
                    <div class="sphere-meta" id="sphereTaskMeta">
                        <!-- Dynamic Badges -->
                        <span class="sphere-badge-pill">Loading</span>
                    </div>
                </div>

                <!-- Right Side: Sphere Control -->
                <div class="sphere-wrapper">
                    <div class="sphere-3d">
                        <div class="sphere-inner-col">
                            <div class="sphere-clock" id="sphereClock">00:00:00</div>
                            <div class="sphere-internal-controls">
                                <button class="sphere-icon-btn btn-play-icon" id="btnSphereStart" title="Start Timer">
                                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </button>
                                <button class="sphere-icon-btn btn-stop-icon" id="btnSphereEnd" style="display:none;" title="Stop Timer">
                                    <svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="small-circle-badge" id="minuteBadge">0m</div>
                    </div>
                </div>
            </div>

            <div class="table-footer" id="mainFooter">
                <div class="footer-actions">
                    <span>Rows per page:</span>
                    <select id="rowsPerPage" class="rows-per-page-select">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div class="pagination-controls">
                    <span id="pageInfo">Page 1</span>
                    <button id="btnPrevPage" class="btn-page" disabled>Previous</button>
                    <button id="btnNextPage" class="btn-page" disabled>Next</button>
                </div>
            </div>
        </div>
        `;

        page.main.html(page_html);

        // --- Clock / Stopwatch Logic ---
        function startSphereClock() {
            let mode = 'CLOCK'; // CLOCK or TIMER
            let timerInterval: any = null;
            let clockInterval: any = null;
            let titleOriginal = "Time Focus";
            let startTime = 0;

            const $clockDisplay = $('#sphereClock');
            const $minuteBadge = $('#minuteBadge');
            const $cardTitle = $('.card-content h3');
            const $cardDesc = $('.card-content p');

            function updateWallClock() {
                const now = new Date();
                $clockDisplay.text(now.toLocaleTimeString('en-US', { hour12: false }));
            }

            function updateTimer() {
                const now = Date.now();
                const diff = now - startTime;
                // Format HH:mm:ss
                const totalSeconds = Math.floor(diff / 1000);
                const hrs = Math.floor((totalSeconds % 86400) / 3600).toString().padStart(2, '0');
                const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
                const secs = (totalSeconds % 60).toString().padStart(2, '0');

                // Update Badge with Total Minutes
                const totalMinutes = Math.floor(totalSeconds / 60);
                $minuteBadge.text(totalMinutes + "m");

                $clockDisplay.text(`${hrs}:${mins}:${secs}`);
            }

            // Start in Clock Mode
            updateWallClock();
            clockInterval = setInterval(updateWallClock, 1000);
            $('#btnSphereEnd').hide();

            // Button Handlers
            $('#btnSphereStart').on('click', function () {
                // Switch to Timer
                clearInterval(clockInterval);
                startTime = Date.now();
                mode = 'TIMER';
                timerInterval = setInterval(updateTimer, 1000);
                updateTimer();

                $cardTitle.text("Focusing...");
                $cardDesc.text("Recording time.");
                // Reset Badge on new start? Or keep accumulating?
                // Using simple stopwatch logic: start from 0.
                $minuteBadge.text("0m");

                $(this).hide();
                $('#btnSphereEnd').show();
            });

            $('#btnSphereEnd').on('click', function () {
                if (mode === 'TIMER') {
                    clearInterval(timerInterval);
                    mode = 'STOPPED';
                    $cardTitle.text("Done");
                    $cardDesc.text("Good job!");

                    $(this).hide();
                    $('#btnSphereStart').show();

                    // Revert to clock after 5s
                    setTimeout(() => {
                        if (mode === 'STOPPED') {
                            mode = 'CLOCK';
                            updateWallClock();
                            clockInterval = setInterval(updateWallClock, 1000);
                            $cardTitle.text(titleOriginal);
                            $cardDesc.text("Track your task duration.");
                            // Badge resets to 0m when back to clock mode usually?
                            // Or keeps last time? Let's reset to 0m for cleanliness or keep last?
                            // "show total time" usually implies ongoing or result.
                            // I'll leave result for 5s then reset.
                            $minuteBadge.text("0m");
                        }
                    }, 5000);
                }
            });
        }

        // --- Dynamic Data Population ---
        function fetchLatestTask() {
            // console.log("Fetching latest Task from Server...");
            frappe.call({
                method: 'dakbabu.dakbabu.page.test.test.get_latest_task',
                args: {},
                callback: function (r) {
                    // console.log("Server Fetch Result:", r);
                    if (r.message) {
                        const task = r.message;
                        $('#sphereTaskTitle').text(task.title || "Untitled Task");
                        $('#sphereTaskDesc').text(task.description || "Latest Task");

                        let metaHtml = '';
                        if (task.priority) {
                            let pColor = 'orange';
                            if (task.priority === 'High') pColor = '#ef5350';
                            if (task.priority === 'Low') pColor = '#4db6ac';
                            metaHtml += `<span class="sphere-badge-pill" style="background:rgba(255,255,255,0.1); border-color:${pColor}; color:${pColor};">${task.priority}</span>`;
                        }
                        if (task.status) {
                            let color = '#fff';
                            if (task.status === 'Open') color = '#29b6f6';
                            if (task.status === 'Completed') color = '#66bb6a';
                            if (task.status === 'Overdue') color = '#ef5350';
                            metaHtml += `<span class="sphere-badge-pill" style="color:${color}">${task.status}</span>`;
                        }
                        $('#sphereTaskMeta').html(metaHtml);
                    } else {
                        // console.log("No task returned from server");
                        $('#sphereTaskTitle').text("No Active Tasks");
                        $('#sphereTaskDesc').text("Create a new task to get started.");
                        $('#sphereTaskMeta').empty();
                    }
                },
                error: function (e) {
                    // console.error("Server Fetch Error:", e);
                    $('#sphereTaskTitle').text("Error Fetching Data");
                    $('#sphereTaskDesc').text("Check server logs.");
                }
            });
        }
        startSphereClock();

        // --- 3. Renderers ---

        function getStatusClass(status: string) {
            if (status === 'Working') return 'status-working';
            if (status === 'Overdue') return 'status-overdue';
            if (status === 'Completed') return 'status-completed';
            if ((status || '').includes('Pending')) return 'status-pending';
            return 'status-open';
        }

        // Indicator colors for Frappe List
        function getStatusIndicator(status: string) {
            let color = 'gray';
            if (status === 'Working') color = 'blue';
            if (status === 'Overdue') color = 'red';
            if (status === 'Completed') color = 'green';
            if ((status || '').includes('Pending')) color = 'orange';
            return `<span class="indicator ${color}">${status}</span>`;
        }


        function getPriorityClass(p: string) {
            if (p === 'High') return 'priority-high';
            if (p === 'Medium') return 'priority-medium';
            return 'priority-low';
        }

        // --- Render: List View ---
        function renderListView(tasks: Task[]) {
            // Using Updated Frappe-Like CSS classes
            let html = `
            <div class="table-responsive">
                <table class="frappe-list-table">
                    <thead>
                        <tr>
                            ${state.visibleColumns.includes('Subject') ? '<th style="width: 45%">Subject</th>' : ''}
                            ${state.visibleColumns.includes('Status') ? '<th style="width: 15%">Status</th>' : ''}
                            ${state.visibleColumns.includes('Priority') ? '<th style="width: 15%">Priority</th>' : ''}
                            ${state.visibleColumns.includes('Due Date') ? '<th style="width: 15%">Due Date</th>' : ''}
                            <th style="width: 10%"></th>
                        </tr>
                    </thead>
                    <tbody>`;

            if (tasks.length === 0) {
                html += '<tr><td colspan="5" style="text-align:center; padding: 30px; color: #9ca3af;">No tasks found</td></tr>';
            } else {
                tasks.forEach(task => {
                    const assignee = task.owner ? task.owner.charAt(0).toUpperCase() : '?';
                    let dateClass = 'due-date';
                    if (task.status === 'Overdue') dateClass += ' overdue';

                    html += `<tr data-name="${task.name}" class="frappe-list-row">`;

                    // Subject + Avatar + Name (Simulating List)
                    if (state.visibleColumns.includes('Subject')) {
                        html += `<td>
                           <div class="subject-cell">
                                <div class="user-avatar-circle">${assignee}</div>
                                <div>
                                    <span class="subject-main">${task.subject}</span>
                                    <span class="subject-meta">${task.name}</span>
                                </div>
                           </div>
                       </td>`;
                    }
                    if (state.visibleColumns.includes('Status')) {
                        // Use Indicator Dot instead of Pill
                        html += `<td>${getStatusIndicator(task.status)}</td>`;
                    }
                    if (state.visibleColumns.includes('Priority')) {
                        html += `<td><span class="priority-text ${getPriorityClass(task.priority)}">${task.priority}</span></td>`;
                    }
                    if (state.visibleColumns.includes('Due Date')) {
                        html += `<td><span class="${dateClass}">${task.exp_end_date || '-'}</span></td>`;
                    }

                    html += `<td style="text-align: right; color: #d1d8dd; font-size:16px;">♥</td></tr>`;
                });
            }
            html += `</tbody></table></div>`;

            $('#viewContainer').html(html);
            $('#mainFooter').show();
        }

        // --- Render: Card View ---
        function renderCardView(tasks: Task[]) {
            let html = `<div class="card-grid">`;
            tasks.forEach(task => {
                const assignee = task.owner ? task.owner.charAt(0).toUpperCase() : '?';
                html += `
                  <div class="task-card" data-name="${task.name}">
                      <div class="task-card-header">
                          <span class="priority-text ${getPriorityClass(task.priority)}">${task.priority}</span>
                          <span class="user-avatar-circle" style="width:24px;height:24px;font-size:10px;">${assignee}</span>
                      </div>
                      <div class="task-card-title">${task.subject}</div>
                      <div style="margin-bottom:10px;">
                          <span class="status-pill ${getStatusClass(task.status)}">${task.status}</span>
                      </div>
                      <div class="task-card-date">Due: ${task.exp_end_date || 'None'}</div>
                  </div>`;
            });
            html += `</div>`;
            if (tasks.length === 0) html = '<div style="text-align:center; padding: 30px; color: #9ca3af;">No tasks found</div>';

            $('#viewContainer').html(html);
            $('#mainFooter').show(); // Show pagination
        }

        // --- Render: Kanban View ---
        function renderKanbanView(tasks: Task[]) {
            const columns = ['Open', 'Working', 'Pending Review', 'Overdue', 'Completed'];
            let html = `<div class="kanban-board">`;

            columns.forEach(col => {
                // Simple text match grouping
                const colTasks = tasks.filter(t => (t.status || 'Open') === col || (col === 'Pending Review' && (t.status || '').includes('Pending')));

                html += `
                 <div class="kanban-column">
                     <div class="kanban-header">
                         <span>${col}</span>
                         <span style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:10px; font-size:11px;">${colTasks.length}</span>
                     </div>
                     <div class="kanban-tasks">`;

                colTasks.forEach(task => {
                    html += `
                     <div class="kanban-card" data-name="${task.name}">
                         <div style="font-size:13px; font-weight:500; margin-bottom:5px;">${task.subject}</div>
                         <div style="display:flex; justify-content:space-between; align-items:center;">
                             <span class="priority-text ${getPriorityClass(task.priority)}" style="font-size:11px;">${task.priority}</span>
                             <span style="font-size:11px; color:#6BA3BE;">${task.exp_end_date ? task.exp_end_date.slice(5) : ''}</span>
                         </div>
                     </div>`;
                });

                html += `</div></div>`;
            });

            html += `</div>`;
            $('#viewContainer').html(html);
            $('#mainFooter').hide(); // Kanban usually horizontal scroll, pagination tricky or disabled
        }


        // --- Main Render Dispatcher ---
        let currentTasksCache: Task[] = [];
        function renderDispatch(tasks?: Task[]) {
            if (tasks) currentTasksCache = tasks;

            if (state.viewMode === 'List') {
                renderListView(currentTasksCache);
            } else if (state.viewMode === 'Card') {
                renderCardView(currentTasksCache);
            } else if (state.viewMode === 'Kanban') {
                renderKanbanView(currentTasksCache);
            }

            // Bind Clicks (Generic)
            $wrapper.find('.task-item-row, .task-card, .kanban-card').off('click').on('click', function () {
                const name = $(this).data('name');
                frappe.set_route('Form', 'Task', name);
            });
        }

        // --- Fetch Logic (Reused) ---
        function updatePaginationUI() {
            $wrapper.find('#pageInfo').text(`Page ${state.pageIndex + 1}`);
            $wrapper.find('#btnPrevPage').prop('disabled', state.pageIndex === 0);
            $wrapper.find('#btnNextPage').prop('disabled', !state.hasNextPage);
        }

        function loadTasks(filterText = '') {
            if (state.isLoading) return;
            state.isLoading = true;
            $('#viewContainer').css('opacity', '0.5');

            const fetchLimit = parseInt(state.pageSize.toString()) + 1;
            const startStr = (state.pageIndex * state.pageSize).toString();
            const args: any = {
                fields: ['name', 'subject', 'status', 'priority', 'exp_end_date', 'owner', 'modified'],
                limit_start: parseInt(startStr),
                limit: fetchLimit,
                order_by: 'modified desc'
            };
            if (filterText) args.filters = [['Task', 'subject', 'like', `%${filterText}%`]];

            frappe.db.get_list('Task', args).then((data: Task[]) => {
                state.isLoading = false;
                $('#viewContainer').css('opacity', '1');

                if (data.length > state.pageSize) {
                    state.hasNextPage = true;
                    data.pop();
                } else {
                    state.hasNextPage = false;
                }

                updatePaginationUI();
                renderDispatch(data);

            }).catch((err: any) => {
                state.isLoading = false;
                console.error("Fetch Error:", err);
            });
        }


        // --- Events ---
        loadTasks();

        // 1. View Toggles
        function setActiveView(mode: ViewMode) {
            state.viewMode = mode;
            $wrapper.find('.btn-action').removeClass('active');
            if (mode === 'List') $wrapper.find('#btnViewList').addClass('active');
            if (mode === 'Card') $wrapper.find('#btnViewCard').addClass('active');
            if (mode === 'Kanban') $wrapper.find('#btnViewKanban').addClass('active');
            renderDispatch();
        }

        $wrapper.find('#btnViewList').on('click', () => setActiveView('List'));
        $wrapper.find('#btnViewCard').on('click', () => setActiveView('Card'));
        $wrapper.find('#btnViewKanban').on('click', () => setActiveView('Kanban'));

        // 2. Filter / Column Picker
        const $colPicker = $wrapper.find('#colPicker');
        $wrapper.find('#btnFilter').on('click', (e: any) => {
            e.stopPropagation();
            $colPicker.toggle();
        });

        $wrapper.on('click', () => $colPicker.hide());
        $colPicker.on('click', (e: any) => e.stopPropagation());

        $colPicker.find('input[type="checkbox"]').on('change', function () {
            const val = $(this).val() as string;
            if ($(this).is(':checked')) {
                if (!state.visibleColumns.includes(val)) state.visibleColumns.push(val);
            } else {
                state.visibleColumns = state.visibleColumns.filter(c => c !== val);
            }
            if (state.viewMode === 'List') renderDispatch(); // User expects strict update
        });

        // 3. Pagination & Search (Existing)
        $wrapper.find('#btnPrevPage').on('click', function () {
            if (state.pageIndex > 0) { state.pageIndex--; loadTasks($wrapper.find('#modern-search').val() as string); }
        });
        $wrapper.find('#btnNextPage').on('click', function () {
            if (state.hasNextPage) { state.pageIndex++; loadTasks($wrapper.find('#modern-search').val() as string); }
        });
        $wrapper.find('#rowsPerPage').on('change', function () {
            state.pageSize = parseInt($(this).val() as string);
            state.pageIndex = 0;
            loadTasks($wrapper.find('#modern-search').val() as string);
        });
        let searchTimeout: any;
        $wrapper.find('#modern-search').on('input', function (e: any) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.pageIndex = 0;
                loadTasks(e.target.value);
            }, 300);
        });

        // 4. Global Actions
        let isDarkMode = false;
        $wrapper.find('#btnThemeToggle').on('click', function () {
            isDarkMode = !isDarkMode;
            const container = $wrapper.find('#mainTaskContainer');
            const pageContainer = $wrapper.closest('.page-container');
            const btn = $(this);
            if (isDarkMode) {
                container.addClass('dark-theme');
                pageContainer.addClass('dark-theme-active');
                btn.html('☀️');
            } else {
                container.removeClass('dark-theme');
                pageContainer.removeClass('dark-theme-active');
                btn.html('🌙');
            }
        });

        $wrapper.find('.btn-new-task').on('click', function () { frappe.new_doc('Task'); });

    } catch (e: any) {
        console.error("Test Page Error", e);
        $wrapper.prepend('<div style="color:red; border:1px solid red; padding:20px;">ERROR: ' + e.message + '</div>');
    }
};
