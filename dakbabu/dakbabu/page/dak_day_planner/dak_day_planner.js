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
	};

	// Render Main Layout Shell
	$(wrapper).find(".layout-main-section").html(`
        <!-- Navigation Bar (Shared Style) -->
        <div style="
            width: 100%;
            background: linear-gradient(135deg, #2e605c 0%, #468e88 100%);
            padding: 15px 40px;
            margin-bottom: 0;
            border-radius: 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 100;
        ">
            <!-- Decorative Circles -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0;">
                <div style="position: absolute; top: -30px; left: 10%; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -40px; right: 5%; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            </div>

            <div style="display: flex; align-items: center; gap: 40px; position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 38px; height: 38px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; backdrop-filter: blur(5px);">
                        <i class="fa fa-check"></i>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <h1 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #ffffff; line-height: 1.2;">TaskFlow</h1>
                        <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); font-weight: 500;">Day Planner</span>
                    </div>
                </div>

                <div style="display: flex; gap: 30px; align-items: center; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 40px; height: 30px;">
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer;" onclick="frappe.set_route('dak_dashboard')">
                        <i class="fa fa-home" style="margin-right: 8px;"></i> Dashboard
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer;" onclick="frappe.set_route('dak_task_list')">
                        <i class="fa fa-list" style="margin-right: 8px;"></i> All Tasks
                    </div>
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; border-bottom: 2px solid #ffffff; padding-bottom: 5px;">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px;"></i> Day Planner
                    </div>
                </div>
            </div>
        </div>

        <!-- Planner Body -->
        <div class="planner-wrapper">
            <!-- Left Column: Tasks -->
            <div class="task-pool-col">
                <div class="pool-header">
                    <h4 style="margin: 0; font-weight: 700; color: #374151;">To Do List</h4>
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
                    <div style="margin-left: auto;">
                        <span style="font-size: 0.9rem; font-weight: 600;" id="planner-date-display">Today</span>
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

	// Initial Load
	frappe.pages["dak_day_planner"].load_tasks();
	frappe.pages["dak_day_planner"].render_grid();
};

frappe.pages["dak_day_planner"].load_tasks = function () {
	frappe.call({
		method: "frappe.client.get_list",
		args: {
			doctype: "Task",
			fields: [
				"name",
				"subject",
				"status",
				"priority",
				"exp_end_date",
				"project",
				"expected_time",
			],
			filters: [
				["status", "!=", "Completed"],
				["status", "!=", "Cancelled"],
			],
			limit_page_length: 100,
			order_by: "priority desc", // Urgent first
		},
		callback: function (r) {
			if (r.message) {
				// Client-side filter for "Due Today or Overdue" (or just show all open?)
				// User requirement: "due for the day or overdue"
				let today = moment().startOf("day");
				let poolTasks = r.message.filter((t) => {
					if (!t.exp_end_date) return false; // Or true if we want backlog? User said "due for day"
					let due = moment(t.exp_end_date);
					// Include if due date is same or before today (overdue)
					return due.isSameOrBefore(today, "day");
				});

				frappe.pages["dak_day_planner"].tasks = poolTasks;
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
			'<div style="text-align: center; color: #9ca3af; margin-top: 30px;">No tasks due for today.</div>'
		);
		return;
	}

	frappe.pages["dak_day_planner"].tasks.forEach((task) => {
		let priorityColor = "#10b981"; // Low
		if (task.priority === "Medium") priorityColor = "#f59e0b";
		if (task.priority === "High" || task.priority === "Urgent") priorityColor = "#dc2626";

		let html = `
            <div class="planner-task-card" draggable="true" data-task="${encodeURIComponent(
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
                <h5 style="margin: 0 0 5px 0; font-size: 0.95rem; line-height: 1.3;">${
					task.subject
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
	let currentMoment = moment().hour(config.start_hour).minute(0).second(0);
	let endMoment = moment().hour(config.end_hour).minute(0).second(0);

	// If start > end (overnight?), handle gracefully, but simple assumption for day planner
	if (config.end_hour <= config.start_hour) endMoment.add(1, "day"); // Next day

	while (currentMoment.isBefore(endMoment)) {
		let timeLabel = currentMoment.format("h:mm A");
		let slotId = currentMoment.format("HH:mm");

		let html = `
            <div class="time-slot-row">
                <div class="time-slot-label">${timeLabel}</div>
                <div class="time-slot-dropzone" data-time="${slotId}">
                    <!-- Dropped tasks go here -->
                </div>
            </div>
        `;
		container.append(html);

		currentMoment.add(config.interval, "minutes");
	}

	// Bind Drop Events
	$(".time-slot-dropzone").on("dragover", function (e) {
		e.preventDefault(); // Allow drop
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

		try {
			let task = JSON.parse(decodeURIComponent(taskData));
			let slotTime = $(this).data("time");

			// Render Task in Slot
			// Note: For now, we clone visual. In real app, we might want to "move" it or create a sub-event.
			// User requirement: "placeholder".
			let slotHtml = `
                <div class="slot-task" draggable="true">
                    <h5>${task.subject}</h5>
                    <p><i class="fa fa-clock-o"></i> ${slotTime}</p>
                    <span style="
                        position: absolute; right: 5px; top: 5px;
                        cursor: pointer; opacity: 0.5;"
                        onclick="$(this).parent().remove()">
                        <i class="fa fa-times"></i>
                    </span>
                </div>
            `;
			$(this).append(slotHtml);

			frappe.show_alert(
				{ message: `Scheduled ${task.subject} at ${slotTime}`, indicator: "blue" },
				2
			);
		} catch (err) {
			console.error(err);
		}
	});
};
