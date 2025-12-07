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
	tasks = frappe.get_all("Task", 
		fields=["subject", "status", "description", "priority", "exp_end_date"], 
		order_by="creation desc", 
		limit=1
	)
	return tasks[0] if tasks else None

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
		fields=["name", "subject", "status", "description", "priority", "exp_end_date", "_assign", "project", "creation", "modified"],
		order_by="creation desc",
		limit=100
	)
	return tasks
