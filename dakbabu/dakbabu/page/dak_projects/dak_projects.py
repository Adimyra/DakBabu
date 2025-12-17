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
		"completed_projects": frappe.db.count("Project", filters={**filters, "status": "Completed"}),
	}


@frappe.whitelist()
def get_latest_task():
	try:
		tasks = []
		# 0. Look for "Working Now" Task (Absolute Highest Priority)
		working_task = frappe.get_list(
			"Task",
			filters={"custom_working_now": 1},
			fields=[
				"name",
				"subject",
				"status",
				"description",
				"priority",
				"exp_end_date",
				"custom_working_now",
				"expected_time",
			],
			limit=1,
		)
		if working_task:
			tasks = working_task
		else:
			# 0.5. Recently Modified (Within last 1 hour) - Stickiness for just-stopped tasks
			# Since 'stop_working_task' updates the task, it will be the most recently modified.
			recent_task = frappe.get_list(
				"Task",
				filters={
					"status": ["in", ["Open", "Working", "Pending Review"]],
					"modified": (">", frappe.utils.add_to_date(frappe.utils.now_datetime(), hours=-1)),
				},
				fields=[
					"name",
					"subject",
					"status",
					"description",
					"priority",
					"exp_end_date",
					"expected_time",
					"modified",
				],
				order_by="modified desc",
				limit=1,
			)

			if recent_task:
				tasks = recent_task
			else:
				# 1. Look for Overdue Tasks (Highest Priority) - Fetch ALL
				overdue_tasks = frappe.get_list(
					"Task",
					filters={"status": "Overdue"},
					fields=[
						"name",
						"subject",
						"status",
						"description",
						"priority",
						"exp_end_date",
						"expected_time",
					],
					order_by="exp_end_date asc, priority desc",
					limit=3,
				)
				if overdue_tasks:
					tasks = overdue_tasks
				else:
					# 2. Fallback: Look for Active Tasks (Top 3)
					active_tasks = frappe.get_list(
						"Task",
						filters={"status": ["in", ["Open", "Working", "Pending Review"]]},
						fields=[
							"name",
							"subject",
							"status",
							"description",
							"priority",
							"exp_end_date",
							"expected_time",
						],
						order_by="priority desc, modified desc",
						limit=3,
					)
					if active_tasks:
						tasks = active_tasks

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
	except Exception as e:
		frappe.log_error(f"Error in get_latest_task: {e!s}")
		return []


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
def get_recent_tasks():
	tasks = frappe.get_all(
		"Task",
		fields=["name", "subject", "status", "description", "priority", "exp_end_date"],
		order_by="creation desc",
		limit=3,
	)
	return tasks


@frappe.whitelist()
def get_backlog_tasks():
	tasks = frappe.get_all(
		"Task",
		filters={"status": "Open"},
		fields=["name", "subject", "status", "description", "priority", "exp_end_date", "_assign"],
		order_by="creation desc",
		limit=20,
	)
	return tasks


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
		],
		order_by="creation desc",
		limit=None,
	)
	return tasks


@frappe.whitelist()
def stop_working_task(task_name):
	try:
		frappe.db.set_value("Task", task_name, "custom_working_now", 0)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error stopping working task: {e!s}")
		return False


@frappe.whitelist()
def get_recent_activity():
	latest_task = frappe.get_all(
		"Task", fields=["name", "subject", "creation"], order_by="creation desc", limit=1
	)

	try:
		latest_project = frappe.get_all(
			"Project", fields=["name", "project_name", "creation"], order_by="creation desc", limit=1
		)
	except Exception:
		latest_project = []

	return {
		"task": latest_task[0] if latest_task else None,
		"project": latest_project[0] if latest_project else None,
	}


@frappe.whitelist()
def get_due_tasks_for_month(month, year):
	start_date = f"{year}-{int(month):02d}-01"
	end_date = frappe.utils.add_days(frappe.utils.add_months(start_date, 1), -1)

	tasks = frappe.get_all(
		"Task",
		filters={"exp_end_date": ["between", [start_date, end_date]], "status": ["!=", "Completed"]},
		fields=["name", "subject", "exp_end_date", "priority"],
	)
	return tasks


@frappe.whitelist()
def get_projects_summary():
	projects = frappe.get_all(
		"Project", fields=["name", "project_name", "status", "priority", "expected_start_date", "expected_end_date", "percent_complete", "custom_working_now"]
	)

	for project in projects:
		# Count tasks per project
		task_counts = frappe.db.sql(
			"""
			SELECT
				COUNT(name) as total,
				SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
				SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue,
				SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
			FROM `tabTask`
			WHERE project = %s
		""",
			(project.name),
			as_dict=True,
		)

		if task_counts:
			project.update(task_counts[0])

		# User aggregation for avatars (simplified)
		project.users = []  # Ideally fetch from Team or Assignments

	return projects


@frappe.whitelist()
def get_project_tasks(project_name):
	tasks = frappe.get_all(
		"Task",
		filters={"project": project_name},
		fields=[
			"name",
			"subject",
			"status",
			"priority",
			"description",
			"exp_start_date",
			"exp_end_date",
			"creation",
			"_assign",
			"custom_working_now",
		],
		order_by="priority desc",
	)

	# Enhance with User Images if needed
	for task in tasks:
		if task._assign:
			import json

			assignees = json.loads(task._assign)
			task.assignees = []
			for user_email in assignees:
				user = frappe.db.get_value("User", user_email, ["user_image", "full_name"], as_dict=True)
				if user:
					task.assignees.append(user)

	return tasks


@frappe.whitelist()
def update_task_status(task_name, status):
	frappe.db.set_value("Task", task_name, "status", status)
	return True


@frappe.whitelist()
def get_task_templates():
    return frappe.get_all("Task Template", fields=["name", "subject", "project", "expected_time"], order_by="modified desc")

@frappe.whitelist()
def set_working_project(project_name):
	try:
		# 1. Reset all other projects
		frappe.db.sql("UPDATE `tabProject` SET custom_working_now = 0 WHERE custom_working_now = 1")

		# 2. Set new project as working
		frappe.db.set_value("Project", project_name, "custom_working_now", 1)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error setting working project: {e!s}")
		return False

@frappe.whitelist()
def complete_project(project_name):
	try:
		# Check for incomplete tasks
		incomplete_count = frappe.db.count("Task", filters={"project": project_name, "status": ["!=", "Completed"]})

		if incomplete_count > 0:
			frappe.throw(
				f"Cannot complete project. There are {incomplete_count} incomplete tasks linked to this project.",
				title="Active Tasks Remaining",
			)

		frappe.db.set_value(
			"Project",
			project_name,
			{
				"status": "Completed",
				"percent_complete": 100,
				"actual_end_date": frappe.utils.nowdate(),
				"custom_working_now": 0,
			},
		)
		frappe.db.commit()
		return True
	except Exception as e:
		frappe.log_error(f"Error completing project: {e!s}")
		raise e
