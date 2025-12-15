import frappe


@frappe.whitelist()
def get_latest_task():
	"""
	Fetches the most recently created Task.
	Returns a dict with title, description, priority, and status.
	"""
	try:
		frappe.log_error("Test Page: Fetching Latest Task", "Debug")
		tasks = frappe.get_all(
			"Task",
			fields=["subject", "priority", "status", "exp_end_date"],
			order_by="creation desc",
			limit_page_length=1,
		)

		if not tasks:
			return None

		task = tasks[0]

		# Format due date if exists
		description = "Latest Task"
		if task.exp_end_date:
			description = f"Due: {frappe.format_date(task.exp_end_date)}"

		return {
			"title": task.subject,
			"description": description,
			"priority": task.priority,
			"status": task.status,
		}
	except Exception as e:
		frappe.log_error(f"Error in Test Page Fetch: {e!s}")
		return None
