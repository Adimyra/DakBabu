frappe.provide("dakbabu.components");

dakbabu.components.get_reminder_card = function (id_suffix = "") {
	let suffix = id_suffix ? `-${id_suffix}` : "";
	return `
		<!-- Reminder Section(Full Width) -->
		<div class="reminder-section" style="
			width: 100%;
			margin-bottom: 30px;
			background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
			padding: 40px 40px;
			box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
			color: #ffffff;
			display: flex;
			flex-wrap: wrap;
			gap: 20px;
			justify-content: space-between;
			align-items: center;
			position: relative;
			overflow: hidden;
            border-radius: 0 0 16px 16px;
		">
			<!-- Decorative BG -->
			<div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
			<div style="position: absolute; bottom: -50px; right: 20%; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

			<div style="position: relative; z-index: 1; flex: 1 1 400px;">
				<div style="display: flex; align-items: center; margin-bottom: 10px; opacity: 0.9;">
					<span style="font-size: 1.1rem; margin-right: 8px;">🔔</span>
					<span id="latest-task-status${suffix}" style="font-weight: 500; font-size: 0.95rem; letter-spacing: 0.02em;">Loading reminder...</span>
				</div>

				<h2 id="latest-task-subject${suffix}" style="font-size: 2rem; font-weight: 700; margin-bottom: 15px; color: #fff;">
                    <div class="skeleton" style="width: 60%; height: 32px; border-radius: 8px;"></div>
                </h2>

				<div style="display: flex; align-items: center; gap: 20px; font-size: 0.95rem;">
					<span style="
						background: rgba(255,255,255,0.2);
						padding: 5px 12px;
						border-radius: 6px;
						backdrop-filter: blur(5px);
						display: flex; align-items: center;
					">
						<i class="fa fa-clock-o" style="margin-right: 6px;"></i> 11:00
					</span>
					<span style="display: flex; align-items: center; opacity: 0.9;">
						<i class="fa fa-building-o" style="margin-right: 6px;"></i> Headquarters
					</span>
					<span style="display: flex; align-items: center; opacity: 0.9;">
						<i class="fa fa-hourglass-half" style="margin-right: 6px;"></i> Est: 120m
					</span>
				</div>
			</div>

			<div style="position: relative; z-index: 1; flex: 0 0 auto;">
				<button class="btn" onclick="window.toggle_reminder_drawer(true)" style="
					background: #ffffff;
					color: #7c3aed;
					padding: 10px 24px;
					border-radius: 8px;
					font-weight: 600;
					border: none;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
					transition: all 0.2s;
					font-size: 0.95rem;
				" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
					View Task
				</button>
			</div>
		</div>
    `;
};

dakbabu.components.get_performance_card = function () {
	return `

        <div class="reminder-section" style="
                flex: 1;
                background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
                padding: 25px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            border: none;
            color: #ffffff;
        ">
            <!-- Decorative Circles (Adjusted) -->
            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

            <div style="position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <span style="font-size: 1.1rem; margin-right: 10px; background: rgba(255,255,255,0.2); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; backdrop-filter: blur(5px);">
                        <i class="fa fa-line-chart"></i>
                    </span>
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0; color: #ffffff;">Performance</h3>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <!-- Circular Progress (Smaller) -->
                    <div id="perf-circle" style="
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        background: conic-gradient(rgba(255,255,255,0.9) 0% 0%, rgba(255,255,255,0.2) 0% 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    ">
                        <div style="
                            width: 82px;
                            height: 82px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            backdrop-filter: blur(5px);
                        ">
                            <span id="perf-percent" style="font-size: 1.4rem; font-weight: 800; color: #ffffff;">0%</span>
                        </div>
                    </div>

                    <!-- Stats (Stacked) -->
                    <div style="width: 100%; display: flex; justify-content: space-around;">
                        <div style="text-align: center;">
                            <div style="font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.05em; margin-bottom: 3px;">AVG. TIME</div>
                            <div style="font-size: 1.25rem; font-weight: 700; color: #ffffff;">0h 0m</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.05em; margin-bottom: 3px;">COMPLETED</div>
                            <div id="perf-completed" style="font-size: 1.25rem; font-weight: 700; color: #ffffff;">0 <span style="font-size: 0.9rem; font-weight: 400; opacity: 0.7;">/ 2</span></div>
                        </div>
                    </div>
                </div>

                <!-- Footer / Badge -->
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 10px 15px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255,255,255,0.1);
                    margin-top: 20px;
                ">
                    <span style="font-size: 0.85rem; color: #ffffff;">Efficiency</span>
                    <span style="
                        background: rgba(255,255,255,0.9);
                        color: #d946ef;
                        padding: 4px 10px;
                        border-radius: 12px;
                        font-size: 0.75rem;
                        font-weight: 700;
                    ">Needs Imp.</span>
                </div>
            </div>
            `;
};

dakbabu.components.get_task_card = function (task) {
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

    // Note: onclick handlers presume availability of frappe.pages['dak_task_list'] in the global scope
    // or properly bound. If used outside dak_task_list, these might need refactoring to separate events from markup.
    
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
