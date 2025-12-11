import frappe

@frappe.whitelist()
def get_users():
	return frappe.get_all("User", fields=["full_name", "email", "user_image"], filters={"enabled": 1})

@frappe.whitelist()
@frappe.whitelist()
def get_task_counts(timespan="All Time"):
	filters = {}
	if timespan == "Today":
		filters["creation"] = (">=", frappe.utils.nowdate())
	elif timespan == "This Week":
		filters["creation"] = (">=", frappe.utils.add_days(frappe.utils.nowdate(), -7))
	elif timespan == "This Month":
		filters["creation"] = (">=", frappe.utils.add_days(frappe.utils.nowdate(), -30))
	
	return {
		"total_tasks": frappe.db.count("Task", filters=filters),
		"open_tasks": frappe.db.count("Task", filters={**filters, "status": "Open"}),
		"overdue_tasks": frappe.db.count("Task", filters={**filters, "status": "Overdue"}),
		"high_priority": frappe.db.count("Task", filters={**filters, "priority": "High"}),
		"completed_tasks": frappe.db.count("Task", filters={**filters, "status": "Completed"}),
		"pending_review_tasks": frappe.db.count("Task", filters={**filters, "status": "Pending Review"}),
		"total_projects": frappe.db.count("Project", filters=filters),
		"completed_projects": frappe.db.count("Project", filters={**filters, "status": "Completed"})
	}

@frappe.whitelist()
def get_latest_task():
	try:
		tasks = []
		# 0. Look for "Working Now" Task (Absolute Highest Priority)
		working_task = frappe.get_list("Task",
			filters={"is_working_now": 1},
			fields=["name", "subject", "status", "description", "priority", "exp_end_date", "is_working_now", "expected_time"],
			limit=1
		)
		if working_task:
			tasks = working_task
		else:
			# 0.5. Recently Modified (Within last 1 hour) - Stickiness for just-stopped tasks
			# Since 'stop_working_task' updates the task, it will be the most recently modified.
			recent_task = frappe.get_list("Task",
				filters={
					"status": ["in", ["Open", "Working", "Pending Review"]],
					"modified": (">", frappe.utils.add_to_date(frappe.utils.now_datetime(), hours=-1))
				},
				fields=["name", "subject", "status", "description", "priority", "exp_end_date", "expected_time", "modified"],
				order_by="modified desc",
				limit=1
			)
			
			if recent_task:
				tasks = recent_task
			else:
				# 1. Look for Overdue Tasks (Highest Priority) - Fetch ALL
				overdue_tasks = frappe.get_list("Task", 
					filters={"status": "Overdue"},
					fields=["name", "subject", "status", "description", "priority", "exp_end_date", "expected_time"], 
					order_by="exp_end_date asc, priority desc",
					limit=3
				)
				if overdue_tasks:
					tasks = overdue_tasks
				else:
					# 2. Fallback: Look for Active Tasks (Top 3)
					active_tasks = frappe.get_list("Task", 
						filters={"status": ["in", ["Open", "Working", "Pending Review"]]},
						fields=["name", "subject", "status", "description", "priority", "exp_end_date", "expected_time"], 
						order_by="priority desc, modified desc", 
						limit=3
					)
					if active_tasks:
						tasks = active_tasks

		# Calculate Actual Time for each task
		for task in tasks:
			actual_time = frappe.db.sql("""
				SELECT SUM(hours) FROM `tabTimesheet Detail`
				WHERE task = %s AND docstatus < 2
			""", (task.name))
			
			task["actual_time"] = float(actual_time[0][0]) if actual_time and actual_time[0][0] else 0.0

		return tasks
	except Exception as e:
		frappe.log_error(f"Error in get_latest_task: {str(e)}")
		return []

@frappe.whitelist()
def set_working_task(task_name):
	try:
		# 1. Reset all other tasks
		frappe.db.sql("UPDATE `tabTask` SET is_working_now = 0 WHERE is_working_now = 1")
		
		# 2. Set new task as working
		frappe.db.set_value("Task", task_name, "is_working_now", 1)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error setting working task: {str(e)}")
		return False

@frappe.whitelist()
def get_recent_tasks():
	tasks = frappe.get_all("Task",
		fields=["name", "subject", "status", "description", "priority", "exp_end_date"],
		order_by="creation desc",
		limit=3
	)
	return tasks

@frappe.whitelist()
def get_backlog_tasks():
	tasks = frappe.get_all("Task",
		filters={"status": "Open"},
		fields=["name", "subject", "status", "description", "priority", "exp_end_date", "_assign"],
		order_by="creation desc",
		limit=20
	)
	return tasks

@frappe.whitelist()
def get_all_tasks_list():
	tasks = frappe.get_all("Task",
		fields=["name", "subject", "status", "description", "priority", "exp_end_date", "_assign", "project", "creation", "modified", "is_working_now"],
		order_by="creation desc",
		limit=None
	)
	return tasks

@frappe.whitelist()
def stop_working_task(task_name):
	try:
		frappe.db.set_value("Task", task_name, "is_working_now", 0)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error stopping working task: {str(e)}")
		return False

@frappe.whitelist()
def get_recent_activity():
	latest_task = frappe.get_all("Task",
		fields=["name", "subject", "creation"],
		order_by="creation desc",
		limit=1
	)
	
	try:
		latest_project = frappe.get_all("Project",
			fields=["name", "project_name", "creation"],
			order_by="creation desc",
			limit=1
		)
	except Exception:
		latest_project = []

	return {
		"task": latest_task[0] if latest_task else None,
		"project": latest_project[0] if latest_project else None
	}

@frappe.whitelist()
def get_due_tasks_for_month(month, year):
	start_date = f"{year}-{int(month):02d}-01"
	end_date = frappe.utils.add_days(frappe.utils.add_months(start_date, 1), -1)
	
	tasks = frappe.get_all("Task",
		filters={
			"exp_end_date": ["between", [start_date, end_date]],
			"status": ["!=", "Completed"]
		},
		fields=["name", "subject", "exp_end_date", "priority"]
	)
	return tasks
