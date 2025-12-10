frappe.pages['test'].on_page_load = function (wrapper) {
    const $wrapper = $(wrapper);
    // State
    let state = {
        pageIndex: 0,
        pageSize: 10,
        hasNextPage: false,
        isLoading: false,
        viewMode: 'List',
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
        // --- 1. CSS is now in test.css ---
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
            let timerInterval = null;
            let clockInterval = null;
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
            $('#sphereTaskTitle').text("Connecting...");
            frappe.call({
                method: 'dakbabu.dakbabu.page.test.test.get_latest_task',
                args: {},
                callback: function (r) {
                    console.log("Sphere Card: Server Fetch Result:", r);
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
                        console.warn("Sphere Card: No message in response", r);
                        $('#sphereTaskTitle').text("No Active Tasks");
                        $('#sphereTaskDesc').text("Create a new task to get started.");
                        $('#sphereTaskMeta').empty();
                    }
                },
                error: function (e) {
                    console.error("Sphere Card: Server Fetch Error:", e);
                    // Try client-side fallback if server method fails
                    console.log("Attempting client-side fallback...");
                    frappe.db.get_list('Task', {
                        fields: ['subject', 'status', 'priority', 'exp_end_date'],
                        order_by: 'creation desc',
                        limit: 1
                    }).then(data => {
                        if (data && data.length > 0) {
                            const task = data[0];
                            $('#sphereTaskTitle').text(task.subject);
                            $('#sphereTaskDesc').text(task.exp_end_date ? "Due: " + task.exp_end_date : "Latest Task");
                            // ... simplify rendering for fallback ...
                        } else {
                            $('#sphereTaskTitle').text("No Active Tasks");
                        }
                    });
                }
            });
        }
        startSphereClock();
        fetchLatestTask();
        // --- 3. Renderers ---
        function getStatusClass(status) {
            if (status === 'Working')
                return 'status-working';
            if (status === 'Overdue')
                return 'status-overdue';
            if (status === 'Completed')
                return 'status-completed';
            if ((status || '').includes('Pending'))
                return 'status-pending';
            return 'status-open';
        }
        // Indicator colors for Frappe List
        function getStatusIndicator(status) {
            let color = 'gray';
            if (status === 'Working')
                color = 'blue';
            if (status === 'Overdue')
                color = 'red';
            if (status === 'Completed')
                color = 'green';
            if ((status || '').includes('Pending'))
                color = 'orange';
            return `<span class="indicator ${color}">${status}</span>`;
        }
        function getPriorityClass(p) {
            if (p === 'High')
                return 'priority-high';
            if (p === 'Medium')
                return 'priority-medium';
            return 'priority-low';
        }
        // --- Render: List View ---
        function renderListView(tasks) {
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
            }
            else {
                tasks.forEach(task => {
                    const assignee = task.owner ? task.owner.charAt(0).toUpperCase() : '?';
                    let dateClass = 'due-date';
                    if (task.status === 'Overdue')
                        dateClass += ' overdue';
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
        function renderCardView(tasks) {
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
            if (tasks.length === 0)
                html = '<div style="text-align:center; padding: 30px; color: #9ca3af;">No tasks found</div>';
            $('#viewContainer').html(html);
            $('#mainFooter').show(); // Show pagination
        }
        // --- Render: Kanban View ---
        function renderKanbanView(tasks) {
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
        let currentTasksCache = [];
        function renderDispatch(tasks) {
            if (tasks)
                currentTasksCache = tasks;
            if (state.viewMode === 'List') {
                renderListView(currentTasksCache);
            }
            else if (state.viewMode === 'Card') {
                renderCardView(currentTasksCache);
            }
            else if (state.viewMode === 'Kanban') {
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
            if (state.isLoading)
                return;
            state.isLoading = true;
            $('#viewContainer').css('opacity', '0.5');
            const fetchLimit = parseInt(state.pageSize.toString()) + 1;
            const startStr = (state.pageIndex * state.pageSize).toString();
            const args = {
                fields: ['name', 'subject', 'status', 'priority', 'exp_end_date', 'owner', 'modified'],
                limit_start: parseInt(startStr),
                limit: fetchLimit,
                order_by: 'modified desc'
            };
            if (filterText)
                args.filters = [['Task', 'subject', 'like', `%${filterText}%`]];
            frappe.db.get_list('Task', args).then((data) => {
                state.isLoading = false;
                $('#viewContainer').css('opacity', '1');
                if (data.length > state.pageSize) {
                    state.hasNextPage = true;
                    data.pop();
                }
                else {
                    state.hasNextPage = false;
                }
                updatePaginationUI();
                renderDispatch(data);
            }).catch((err) => {
                state.isLoading = false;
                console.error("Fetch Error:", err);
            });
        }
        // --- Events ---
        loadTasks();
        // 1. View Toggles
        function setActiveView(mode) {
            state.viewMode = mode;
            $wrapper.find('.btn-action').removeClass('active');
            if (mode === 'List')
                $wrapper.find('#btnViewList').addClass('active');
            if (mode === 'Card')
                $wrapper.find('#btnViewCard').addClass('active');
            if (mode === 'Kanban')
                $wrapper.find('#btnViewKanban').addClass('active');
            renderDispatch();
        }
        $wrapper.find('#btnViewList').on('click', () => setActiveView('List'));
        $wrapper.find('#btnViewCard').on('click', () => setActiveView('Card'));
        $wrapper.find('#btnViewKanban').on('click', () => setActiveView('Kanban'));
        // 2. Filter / Column Picker
        const $colPicker = $wrapper.find('#colPicker');
        $wrapper.find('#btnFilter').on('click', (e) => {
            e.stopPropagation();
            $colPicker.toggle();
        });
        $wrapper.on('click', () => $colPicker.hide());
        $colPicker.on('click', (e) => e.stopPropagation());
        $colPicker.find('input[type="checkbox"]').on('change', function () {
            const val = $(this).val();
            if ($(this).is(':checked')) {
                if (!state.visibleColumns.includes(val))
                    state.visibleColumns.push(val);
            }
            else {
                state.visibleColumns = state.visibleColumns.filter(c => c !== val);
            }
            if (state.viewMode === 'List')
                renderDispatch(); // User expects strict update
        });
        // 3. Pagination & Search (Existing)
        $wrapper.find('#btnPrevPage').on('click', function () {
            if (state.pageIndex > 0) {
                state.pageIndex--;
                loadTasks($wrapper.find('#modern-search').val());
            }
        });
        $wrapper.find('#btnNextPage').on('click', function () {
            if (state.hasNextPage) {
                state.pageIndex++;
                loadTasks($wrapper.find('#modern-search').val());
            }
        });
        $wrapper.find('#rowsPerPage').on('change', function () {
            state.pageSize = parseInt($(this).val());
            state.pageIndex = 0;
            loadTasks($wrapper.find('#modern-search').val());
        });
        let searchTimeout;
        $wrapper.find('#modern-search').on('input', function (e) {
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
            }
            else {
                container.removeClass('dark-theme');
                pageContainer.removeClass('dark-theme-active');
                btn.html('🌙');
            }
        });
        $wrapper.find('.btn-new-task').on('click', function () { frappe.new_doc('Task'); });
    }
    catch (e) {
        console.error("Test Page Error", e);
        $wrapper.prepend('<div style="color:red; border:1px solid red; padding:20px;">ERROR: ' + e.message + '</div>');
    }
};
