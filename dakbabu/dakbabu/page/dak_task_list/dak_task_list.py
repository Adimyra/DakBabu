import frappe

@frappe.whitelist()
def get_all_tasks_list():
	tasks = frappe.get_all(
		"Task",
		fields=[
			"name",
			"subject",
			"status",
			"description",
			"priority",
			"exp_end_date",
			"_assign",
			"project",
			"creation",
			"modified",
			"custom_working_now",
			"owner",
			"progress",
			"expected_time",
		],
		order_by="creation desc",
		limit=None,
	)

	# Calculate Actual Time for each task
	for task in tasks:
		actual_time = frappe.db.sql(
			"""
			SELECT SUM(hours) FROM `tabTimesheet Detail`
			WHERE task = %s AND docstatus < 2
		""",
			(task.name),
		)
		task["actual_time"] = float(actual_time[0][0]) if actual_time and actual_time[0][0] else 0.0

	return tasks

@frappe.whitelist()
def set_working_task(task_name):
	try:
		# 1. Reset all other tasks
		frappe.db.sql("UPDATE `tabTask` SET custom_working_now = 0 WHERE custom_working_now = 1")

		# 2. Set new task as working
		frappe.db.set_value("Task", task_name, "custom_working_now", 1)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error setting working task: {e!s}")
		return False

@frappe.whitelist()
def complete_task(task_name):
	try:
		# Set task as completed and stop working
		frappe.db.set_value("Task", task_name, {
			"status": "Completed",
			"completed_on": frappe.utils.now_datetime(),
			"custom_working_now": 0
		})
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error completing task: {e!s}")
		return False
