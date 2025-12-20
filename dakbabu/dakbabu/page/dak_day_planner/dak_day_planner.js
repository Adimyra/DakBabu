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
                        <li><a href="#" onclick="$('#planner-date-picker').val(moment().format('YYYY-MM-DD')).trigger('change'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Today</a></li>
                        <li><a href="#" onclick="$('#planner-date-picker').val(moment().add(1, 'days').format('YYYY-MM-DD')).trigger('change'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;">Tomorrow</a></li>
                        <li style="border-top: 1px solid #f3f4f6; margin-top: 5px; padding-top: 5px;">
                            <a href="#" onclick="$('#planner-date-picker').removeAttr('min'); frappe.show_alert('Past dates enabled in picker', 'green'); return false;" style="padding: 10px 15px; font-weight: 500; font-size: 0.9rem;"><i class="fa fa-history" style="margin-right:8px;"></i> Past Dates</a>
                        </li>
                        <li>
                            <a href="#" onclick="frappe.pages['dak_day_planner'].reset_schedule(); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #dc2626;"><i class="fa fa-trash" style="margin-right:8px;"></i> Clear Today</a>
                        </li>
                        <li>
                            <a href="#" onclick="frappe.pages['dak_day_planner'].reset_all_schedules(); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #b91c1c;"><i class="fa fa-bomb" style="margin-right:8px;"></i> Clear ALL Database</a>
                        </li>
                        <li style="border-top: 1px solid #f3f4f6; margin-top: 5px; padding-top: 5px;">
                            <a href="#" onclick="frappe.pages['dak_day_planner'].remove_duplicate_tasks(); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #d97706;"><i class="fa fa-clone" style="margin-right:8px;"></i> Remove Dupes</a>
                        </li>
                        <li>
                            <a href="#" onclick="frappe.pages['dak_day_planner'].load_tasks(); frappe.pages['dak_day_planner'].render_grid(); return false;" style="padding: 10px 15px; font-weight: 600; font-size: 0.9rem; color: #4b5563;"><i class="fa fa-refresh" style="margin-right:8px;"></i> Refresh</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Planner Body -->
        <div class="planner-wrapper">
            <!-- Left Column: Tasks -->
            <!-- Left Column: Tasks -->
            <div class="task-pool-col">
                <div class="pool-header" style="height: auto; min-height: 80px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; font-weight: 700; color: #374151;">Unscheduled</h4>
                        <span style="font-size: 0.75rem; font-weight: 700; color: #6b7280; background: #e5e7eb; padding: 2px 8px; border-radius: 12px;" id="task-count-badge">0</span>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="task-pool-search" class="form-control input-xs" placeholder="Search..." style="height: 28px; font-size: 0.8rem; flex: 1;">
                        <select id="task-pool-sort" class="form-control input-xs" style="height: 28px; width: 85px; font-size: 0.8rem; padding: 0 4px;">
                             <option value="manual">Manual</option>
                             <option value="priority">Priority</option>
                             <option value="date">Due Date</option>
                        </select>
                    </div>
                </div>
                <div class="pool-body" id="planner-task-pool" style="top: 90px;">
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
                        <input type="date" id="planner-date-picker" class="form-control input-sm" style="width: 140px; font-weight: 600; color: #374151;" value="${moment().format('YYYY-MM-DD')}" min="${moment().format('YYYY-MM-DD')}">
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
            let display = "";
            let alertLabel = moment(dateVal).format("MM-DD-YYYY");

            if (moment(dateVal).isSame(moment(), 'day')) {
                display = "Today";
                alertLabel = "Today";
            } else if (moment(dateVal).isSame(moment().add(1, 'day'), 'day')) {
                display = "Tomorrow";
                alertLabel = "Tomorrow";
            }

            if (display) {
                $("#planner-date-display").text(display).show();
            } else {
                $("#planner-date-display").text("").hide();
            }

            // Re-render grid and reload tasks for that day
            frappe.pages["dak_day_planner"].load_tasks();
            frappe.pages["dak_day_planner"].render_grid();
            frappe.show_alert({ message: `Planning for ${alertLabel}`, indicator: "blue" });
        }
    });

    // Event Listeners for Pool (Unschedule Drop)
    $(".task-pool-col").on("dragenter", function (e) {
        e.preventDefault();
        if (frappe.pages["dak_day_planner"].dragging_item) {
            $(this).addClass("drag-over-delete");
        }
    });

    $(".task-pool-col").on("dragover", function (e) {
        e.preventDefault(); // Necessary to allow dropping
        e.originalEvent.dataTransfer.dropEffect = "move";

        if (frappe.pages["dak_day_planner"].dragging_item) {
            let container = document.getElementById("planner-task-pool");
            let ghost = $("#pool-ghost-card");

            // 1. Create Ghost Object (if not exists)
            if (ghost.length === 0) {
                let task = frappe.pages["dak_day_planner"].dragging_item;
                let html = frappe.pages["dak_day_planner"].get_task_card_html(task);
                ghost = $(html).attr("id", "pool-ghost-card").css({
                    "opacity": "0.5",
                    "border": "2px dashed #9ca3af",
                    "pointer-events": "none"
                });
            }

            // 2. Determine Position to Insert
            const draggableElements = [...container.querySelectorAll('.planner-task-card:not(#pool-ghost-card)')];
            const y = e.originalEvent.clientY;

            const afterElement = draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;

            // 3. Insert Ghost
            if (afterElement) {
                $(afterElement).before(ghost);
            } else {
                $(container).append(ghost);
            }
        }
    });

    $(".task-pool-col").on("dragleave", function (e) {
        // Only remove if leaving the main container, not entering a child
        // Simple check: remove class. Ghost removal might be tricky with child elements firing dragleave.
        // Better to remove ghost only on drop or dragend of source.
        // But user wants "hover over there".
        // Let's keep it simple: Remove class. Keep ghost until drop or dragend handles cleanup?
        // Actually, standard behavior is remove on leave.
        // checks if relatedTarget is inside
        if (!this.contains(e.originalEvent.relatedTarget)) {
            $(this).removeClass("drag-over-delete");
            $("#pool-ghost-card").remove();
        }
    });

    $(".task-pool-col").on("drop", function (e) {
        e.preventDefault();
        $(this).removeClass("drag-over-delete");

        let ghost = $("#pool-ghost-card");
        if (ghost.length === 0) return; // Should not happen if dragover worked

        let rawData = e.originalEvent.dataTransfer.getData("text/plain");

        if (rawData && rawData.startsWith("RESCHEDULE:")) {
            // Case 1: Unscheduling (Grid -> Pool)
            let scheduleId = rawData.replace("RESCHEDULE:", "");
            let taskItem = frappe.pages["dak_day_planner"].dragging_item; // Saved during dragstart

            frappe.call({
                method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.unschedule_task_from_slot",
                args: { schedule_id: scheduleId },
                callback: function (r) {
                    if (r.message) {
                        // Create actual card and replace ghost
                        let html = frappe.pages["dak_day_planner"].get_task_card_html(taskItem);
                        let newCard = $(html);
                        ghost.replaceWith(newCard);

                        // Re-bind events to new card
                        frappe.pages["dak_day_planner"].bind_task_card_events(newCard);

                        // Save Order
                        frappe.pages["dak_day_planner"].save_pool_order();

                        // Refresh Grid (to remove slot)
                        frappe.pages["dak_day_planner"].render_grid();
                        frappe.show_alert({ message: "Task unscheduled", indicator: "orange" });
                    }
                }
            });

        } else if (rawData) {
            // Case 2: Reordering (Pool -> Pool)
            try {
                let task = JSON.parse(decodeURIComponent(rawData));
                let originalCard = $(`#pt-${task.name}`);

                if (originalCard.length) {
                    ghost.replaceWith(originalCard);
                    frappe.pages["dak_day_planner"].save_pool_order();
                } else {
                    ghost.remove();
                }
            } catch (e) {
                console.error("Drop error", e);
                ghost.remove();
            }
        } else {
            ghost.remove();
        }
    });

    // Initial Load
    frappe.pages["dak_day_planner"].load_tasks();
    frappe.pages["dak_day_planner"].render_grid();

    // Bind Search & Sort Events
    $("#task-pool-search").on("input", function () {
        let val = $(this).val().toLowerCase();
        $("#planner-task-pool .planner-task-card").each(function () {
            let taskData = $(this).data("task"); // We can use data object or just text
            // Text search covers subject and project displayed
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.indexOf(val) > -1);
        });
    });

    $("#task-pool-sort").on("change", function () {
        let criteria = $(this).val();
        frappe.pages["dak_day_planner"].sort_pool(criteria);
    });

    // Event Delegation for Grid Items (Rescheduling)
    // We bind this once on the container, so we don't need to re-bind on render_grid
    $("#planner-grid-area").on("dragstart", ".slot-task", function (e) {
        let scheduleId = $(this).attr("data-schedule-id"); // Use .attr for safety

        // Store dragging item for Ghost Logic
        let taskObjRaw = $(this).attr("data-task-obj");
        console.log("GRID DRAGSTART: Raw obj available?", !!taskObjRaw);
        let item = JSON.parse(decodeURIComponent(taskObjRaw));

        // Calculate Duration in Minutes
        let start = moment(item.start_time, "HH:mm:ss");
        let end = moment(item.end_time, "HH:mm:ss");
        let durationMinutes = end.diff(start, 'minutes');

        frappe.pages["dak_day_planner"].dragging_item = {
            name: item.task, // The Task ID
            subject: item.subject || item.title,
            project: item.project,
            priority: item.priority || "Low",
            expected_time: item.expected_time,
            exp_end_date: item.exp_end_date,
            current_duration: durationMinutes // Store existing duration
        };

        // Use text/plain with prefix for robust cross-browser support
        if (scheduleId) {
            e.originalEvent.dataTransfer.setData("text/plain", "RESCHEDULE:" + scheduleId);
            e.originalEvent.dataTransfer.effectAllowed = "move";
            $(this).css('opacity', '0.5');
        } else {
            console.error("Missing schedule-id on drag start");
        }
    });

    $("#planner-grid-area").on("dragend", ".slot-task", function (e) {
        $(this).css('opacity', '1');
        frappe.pages["dak_day_planner"].dragging_item = null;
        $("#pool-ghost-card").remove();
    });

    // ------------------------------------------
    // EVENT DELEGATION FOR DROPZONES (Refactored)
    // ------------------------------------------
    $("#planner-grid-area").on("dragover", ".time-slot-dropzone", function (e) {
        e.preventDefault();
        $(this).addClass("drag-over");
        e.originalEvent.dataTransfer.dropEffect = "copy";
    });

    $("#planner-grid-area").on("dragleave", ".time-slot-dropzone", function (e) {
        $(this).removeClass("drag-over");
    });

    $("#planner-grid-area").on("drop", ".time-slot-dropzone", function (e) {
        e.preventDefault();
        $(this).removeClass("drag-over");

        let rawData = e.originalEvent.dataTransfer.getData("text/plain");
        if (!rawData) return;

        let slotTimeStr = $(this).data("time"); // "HH:mm"

        // Validation: Cannot schedule in the past
        let selectedDate = frappe.pages["dak_day_planner"].config.current_date;
        let now = moment();
        let slotDateTime = moment(selectedDate + " " + slotTimeStr, "YYYY-MM-DD HH:mm");

        console.log("DROP EVENT (Delegated):", {
            slotTime: slotTimeStr,
            selectedDate: selectedDate,
            rawData: rawData,
            dragging_item: frappe.pages["dak_day_planner"].dragging_item
        });

        // Calculate End Time (Start + Interval)
        let interval = frappe.pages["dak_day_planner"].config.interval;

        // Determine Duration to use
        let durationToUse = interval; // Default fallback

        // If dragging an existing item (Rescheduling) or New Item
        let draggedItem = frappe.pages["dak_day_planner"].dragging_item;

        if (draggedItem) {
            if (rawData.startsWith("RESCHEDULE:") && draggedItem.current_duration) {
                // CASE 1: Keep existing duration
                durationToUse = draggedItem.current_duration;
            } else if (draggedItem.expected_time && parseFloat(draggedItem.expected_time) > 0) {
                // CASE 2: New Schedule - Use Expected Time (Hrs -> Mins)
                durationToUse = parseFloat(draggedItem.expected_time) * 60;
            }
        }

        let startMoment = moment(slotTimeStr, "HH:mm");

        if (slotDateTime.clone().add(durationToUse, 'minutes').isBefore(now)) {
            frappe.show_alert({ message: "Cannot schedule tasks in the past.", indicator: "red" });
            return;
        }

        let endMoment = startMoment.clone().add(durationToUse, 'minutes');
        let endTimeStr = endMoment.format("HH:mm:ss");
        let startTimeFull = startMoment.format("HH:mm:ss");

        if (rawData.startsWith("RESCHEDULE:")) {
            // RESCHEDULE EXISTING
            let rescheduleId = rawData.replace("RESCHEDULE:", "");

            if (!rescheduleId || rescheduleId === "undefined") {
                frappe.msgprint("Error: Invalid Task ID for rescheduling.");
                return;
            }

            frappe.call({
                method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.reschedule_task",
                args: {
                    schedule_id: rescheduleId,
                    date: selectedDate,
                    start_time: startTimeFull,
                    end_time: endTimeStr
                },
                callback: function (r) {
                    if (r.message) {
                        frappe.show_alert({ message: `Task Rescheduled to ${startTimeFull}`, indicator: "green" });
                        frappe.pages["dak_day_planner"].load_tasks();
                        frappe.pages["dak_day_planner"].render_grid();
                    } else {
                        frappe.msgprint("Failed to reschedule task. Check console/logs.");
                    }
                },
                error: function (r) {
                    console.error(r);
                    frappe.msgprint("Server Error during Reschedule.");
                }
            });
        } else {
            // SCHEDULE NEW
            try {
                let task = JSON.parse(decodeURIComponent(rawData));
                frappe.call({
                    method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.schedule_task",
                    args: {
                        task_name: task.name,
                        date: selectedDate,
                        start_time: startTimeFull,
                        end_time: endTimeStr
                    },
                    callback: function (r) {
                        if (r.message) {
                            frappe.show_alert({ message: `Scheduled ${task.subject}`, indicator: "green" });
                            frappe.pages["dak_day_planner"].load_tasks();
                            frappe.pages["dak_day_planner"].render_grid();
                        }
                    }
                });
            } catch (err) {
                console.error("Invalid Drop Data", err);
            }
        }
    });
};

frappe.pages["dak_day_planner"].sort_pool = function (criteria) {
    let tasks = frappe.pages["dak_day_planner"].tasks || [];
    let sorted = [...tasks];

    if (criteria === 'priority') {
        const pMap = { "Urgent": 4, "High": 3, "Medium": 2, "Low": 1 };
        sorted.sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
    } else if (criteria === 'date') {
        sorted.sort((a, b) => {
            if (!a.exp_end_date) return 1;
            if (!b.exp_end_date) return -1;
            return new Date(a.exp_end_date) - new Date(b.exp_end_date);
        });
    } else {
        // Manual: custom_planner_sort_index asc
        sorted.sort((a, b) => (a.custom_planner_sort_index || 0) - (b.custom_planner_sort_index || 0));
    }

    let container = $("#planner-task-pool");
    container.empty();
    sorted.forEach(task => {
        let html = frappe.pages["dak_day_planner"].get_task_card_html(task);
        container.append(html);
    });
    frappe.pages["dak_day_planner"].bind_task_card_events($(".planner-task-card"));

    // Re-apply search filter if any
    $("#task-pool-search").trigger("input");
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
                frappe.pages["dak_day_planner"].tasks = r.message || [];
                $("#task-count-badge").text(frappe.pages["dak_day_planner"].tasks.length);
                frappe.pages["dak_day_planner"].render_pool();
            }
        },
    });
};

frappe.pages["dak_day_planner"].render_pool = function () {
    // Determine current sort
    let criteria = $("#task-pool-sort").val() || "manual";
    frappe.pages["dak_day_planner"].sort_pool(criteria);
};

frappe.pages["dak_day_planner"].bind_task_card_events = function (elements) {
    elements.on("dragstart", function (e) {
        e.originalEvent.dataTransfer.setData("text/plain", $(this).attr("data-task"));
        e.originalEvent.dataTransfer.effectAllowed = "copy"; // or move
        $(this).addClass("is-dragging");
        // Store for ghost logic
        let taskData = $(this).attr("data-task");
        if (taskData) {
            frappe.pages["dak_day_planner"].dragging_item = JSON.parse(decodeURIComponent(taskData));
        }
    });

    elements.on("dragend", function (e) {
        $(this).removeClass("is-dragging");
        frappe.pages["dak_day_planner"].dragging_item = null;
        $("#pool-ghost-card").remove();
    });
};

frappe.pages["dak_day_planner"].save_pool_order = function () {
    // Only save order if we are in Manual mode
    if ($("#task-pool-sort").val() !== "manual") {
        frappe.msgprint("Switch to 'Manual' sort to save custom order.");
        return;
    }

    let taskNames = [];
    $("#planner-task-pool .planner-task-card").each(function () {
        // ID is "pt-TASKNAME"
        let idStr = $(this).attr("id");
        if (idStr && idStr.startsWith("pt-")) {
            taskNames.push(idStr.replace("pt-", ""));
        }
    });

    frappe.call({
        method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.update_task_order",
        args: { task_names: taskNames },
        callback: function (r) {
            // Silent success
        }
    });
};

frappe.pages["dak_day_planner"].get_task_card_html = function (task) {
    let priorityColor = "#10b981"; // Low
    if (task.priority === "Medium") priorityColor = "#f59e0b";
    if (task.priority === "High" || task.priority === "Urgent") priorityColor = "#dc2626";

    return `
        <div class="planner-task-card" draggable="true" onclick="frappe.pages['dak_day_planner'].show_task_details('${task.name}')" data-task="${encodeURIComponent(JSON.stringify(task))}" id="pt-${task.name}">
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
            <h5 style="margin: 0 0 5px 0; font-size: 0.95rem; line-height: 1.3;">${task.subject}</h5>
            <div style="font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; gap: 10px;">
                <span><i class="fa fa-clock-o"></i> ${task.expected_time || "-"}h</span>
                <span><i class="fa fa-calendar"></i> ${task.exp_end_date || "-"}</span>
            </div>
        </div>
    `;
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

            let isToday = moment(config.current_date).isSame(moment(), 'day');
            let isPastDate = moment(config.current_date).isBefore(moment(), 'day');
            let now = moment();

            while (currentMoment.isBefore(endMoment)) {
                // Rule 1: For TODAY, hide slots that have already passed (Focus Mode)
                if (isToday && currentMoment.isBefore(now)) {
                    currentMoment.add(config.interval, "minutes");
                    continue;
                }

                let timeLabel = currentMoment.format("h:mm A");
                let slotId = currentMoment.format("HH:mm");

                // Rule 2: If viewing a PAST date, everything is Read-Only
                let isReadOnly = isPastDate;

                // Check if any task is scheduled in this slot
                let slotContent = "";
                let occupied = false;

                scheduledItems.forEach(item => {
                    // item.start_time is "HH:mm:ss"
                    if (item.start_time.startsWith(slotId)) {
                        occupied = true;

                        let deleteBtn = "";
                        let dragAttr = 'draggable="true" style="cursor: grab;"';

                        if (isReadOnly) {
                            dragAttr = 'draggable="false" style="cursor: default; opacity: 0.85; filter: grayscale(0.5);"';
                        } else {
                            deleteBtn = `
                                <span style="
                                    position: absolute; right: 5px; top: 5px;
                                    cursor: pointer; opacity: 0.7;"
                                    title="Unschedule"
                                    onclick="frappe.pages['dak_day_planner'].unschedule('${item.name}')">
                                    <i class="fa fa-times-circle" style="color: #ef4444;"></i>
                                </span>
                            `;
                        }

                        slotContent += `
                                <div class="slot-task" ${dragAttr} data-schedule-id="${item.name}" data-task-obj="${encodeURIComponent(JSON.stringify(item))}">
                                    ${deleteBtn}
                                    <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 3px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa fa-briefcase"></i> ${item.project || 'No Project'}
                                    </div>
                                    <h5 style="font-size: 0.95rem; margin-bottom: 5px; font-weight: 700; line-height: 1.2;">${item.subject || item.task}</h5>
                                    
                                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; opacity: 0.9; margin-bottom: 6px;">
                                        <span><i class="fa fa-clock-o"></i> ${moment(item.start_time, "HH:mm:ss").format("h:mm A")} - ${moment(item.end_time, "HH:mm:ss").format("h:mm A")}</span>
                                    </div>

                                    <div style="display: flex; gap: 6px; align-items: center;">
                                         <span class="sphere-badge-pill" style="font-size: 0.65rem; padding: 2px 8px; background: rgba(0,0,0,0.06); border-radius: 10px; font-weight: 600; color: inherit; border: none;">${item.priority}</span>
                                         <span class="sphere-badge-pill" style="font-size: 0.65rem; padding: 2px 8px; background: rgba(0,0,0,0.06); border-radius: 10px; font-weight: 600; color: inherit; border: none;">${item.status}</span>
                                    </div>
                                </div>
                            `;
                    }
                });

                let html = `
                    <div class="time-slot-row ${isReadOnly ? 'time-slot-past' : ''}" style="${isReadOnly ? 'background-color: #f9fafb;' : ''}">
                        <div class="time-slot-label" style="${isReadOnly ? 'opacity: 0.6;' : ''}">${timeLabel}</div>
                        <div class="time-slot-dropzone ${occupied ? 'has-task' : ''}" data-time="${slotId}">
                            ${slotContent}
                        </div>
                    </div>
                `;
                container.append(html);

                currentMoment.add(config.interval, "minutes");
            }


        }
    });
};

frappe.pages["dak_day_planner"].reset_schedule = function () {
    frappe.confirm("Are you sure you want to clear the schedule for THIS DATE?", () => {
        let date = frappe.pages["dak_day_planner"].config.current_date;
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.reset_day_schedule",
            args: { date: date },
            callback: function (r) {
                frappe.pages["dak_day_planner"].load_tasks();
                frappe.pages["dak_day_planner"].render_grid();
                frappe.show_alert({ message: "Day schedule cleared", indicator: "orange" });
            }
        });
    });
};

frappe.pages["dak_day_planner"].reset_all_schedules = function () {
    frappe.confirm("WARNING: This will delete ALL scheduled tasks from the database forever. Are you sure?", () => {
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.reset_all_schedules",
            callback: function (r) {
                frappe.pages["dak_day_planner"].load_tasks();
                frappe.pages["dak_day_planner"].render_grid();
                frappe.show_alert({ message: "ALL SCHEDULES DELETED", indicator: "red" });
            }
        });
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


frappe.pages["dak_day_planner"].set_active_task = function (task_name) {
    frappe.call({
        method: "dakbabu.dakbabu.page.dak_dashboard.dak_dashboard.set_working_task",
        args: { task_name: task_name },
        callback: function (r) {
            if (r.message) {
                frappe.show_alert({ message: "Active Task Updated", indicator: "green" });
                frappe.pages["dak_day_planner"].render_grid(); // Refresh to update UI
            }
        }
    });
};




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
            </div >
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

frappe.pages["dak_day_planner"].reset_schedule = function () {
    let date = frappe.pages["dak_day_planner"].config.current_date;
    frappe.confirm(
        `Are you sure you want to clear the entire schedule for <b>${date}</b> ? <br>This will move all tasks back to the unscheduled pool.`,
        () => {
            frappe.call({
                method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.reset_day_schedule",
                args: { date: date },
                callback: function (r) {
                    if (r.message) {
                        frappe.show_alert({ message: "Schedule cleared successfully", indicator: "green" });
                        frappe.pages["dak_day_planner"].load_tasks();
                        frappe.pages["dak_day_planner"].render_grid();
                    } else {
                        frappe.msgprint("Failed to clear schedule.");
                    }
                }
            });
        }
    );
};

frappe.pages["dak_day_planner"].remove_duplicate_tasks = function () {
    frappe.confirm("This will delete all duplicate tasks (same subject), keeping only the oldest one. Continue?", () => {
        frappe.call({
            method: "dakbabu.dakbabu.page.dak_day_planner.dak_day_planner.remove_duplicate_tasks",
            callback: function (r) {
                if (r.message) {
                    frappe.msgprint(r.message);
                    frappe.pages["dak_day_planner"].load_tasks();
                }
            }
        });
    });
};
