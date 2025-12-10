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
		"completed_tasks": frappe.db.count("Task", filters={**filters, "status": "Completed"})
	}

@frappe.whitelist()
def get_latest_task():
	try:
		# 0. Look for "Working Now" Task (Absolute Highest Priority)
		working_task = frappe.get_list("Task",
			filters={"is_working_now": 1},
			fields=["name", "subject", "status", "description", "priority", "exp_end_date", "is_working_now"],
			limit=1
		)
		if working_task:
			return working_task

		# 1. Look for Overdue Tasks (Highest Priority) - Fetch ALL
		overdue_tasks = frappe.get_list("Task", 
			filters={"status": "Overdue"},
			fields=["name", "subject", "status", "description", "priority", "exp_end_date"], 
			order_by="exp_end_date asc, priority desc",
			limit=3
		)
		if overdue_tasks:
			return overdue_tasks

		# 2. Fallback: Look for Active Tasks (Top 3)
		active_tasks = frappe.get_list("Task", 
			filters={"status": ["in", ["Open", "Working", "Pending Review"]]},
			fields=["name", "subject", "status", "description", "priority", "exp_end_date"], 
			order_by="priority desc, modified desc", 
			limit=3
		)
		if active_tasks:
			return active_tasks

		return []
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
