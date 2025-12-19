import frappe
from frappe.tests.utils import FrappeTestCase
from dakbabu.dakbabu.page.dak_projects.dak_projects import (
	get_projects_summary,
	get_project_tasks,
	set_working_project,
	complete_project
)

class TestDakProjectsPage(FrappeTestCase):
	def setUp(self):
		# Create a dummy Customer if not exists
		if not frappe.db.exists("Customer", "_Test Customer"):
			frappe.get_doc({"doctype": "Customer", "customer_name": "_Test Customer"}).insert()

		# Create a dummy Project
		if not frappe.db.exists("Project", {"project_name": "_Test Project A"}):
			self.project = frappe.get_doc({
				"doctype": "Project",
				"project_name": "_Test Project A",
				"status": "Open",
				"priority": "Medium",
				"expected_start_date": "2024-01-01",
				"expected_end_date": "2024-01-31",
				"customer": "_Test Customer"
			}).insert()
		else:
			# Fetch the existing one
			name = frappe.db.get_value("Project", {"project_name": "_Test Project A"})
			self.project = frappe.get_doc("Project", name)

	def tearDown(self):
		frappe.db.rollback()

	def test_get_projects_summary(self):
		summary = get_projects_summary()
		self.assertTrue(isinstance(summary, list))
		# Ensure our test project is in the list
		found = any(p['name'] == self.project.name for p in summary)
		self.assertTrue(found)

	def test_set_working_project(self):
		# Set as working
		set_working_project(self.project.name)
		self.project.reload()
		self.assertEqual(int(self.project.custom_working_now), 1)

		# Test toggling (mocking another project)
		if not frappe.db.exists("Project", {"project_name": "_Test Project B"}):
			project_b = frappe.get_doc({
				"doctype": "Project",
				"project_name": "_Test Project B",
				"expected_start_date": "2024-02-01",
				"expected_end_date": "2024-02-28"
			}).insert()
		else:
			name_b = frappe.db.get_value("Project", {"project_name": "_Test Project B"})
			project_b = frappe.get_doc("Project", name_b)
		
		set_working_project(project_b.name)
		self.project.reload()
		project_b.reload()

		self.assertEqual(int(self.project.custom_working_now), 0)
		self.assertEqual(int(project_b.custom_working_now), 1)

	def test_project_tasks(self):
		# Create a test task linked to project
		task = frappe.get_doc({
			"doctype": "Task",
			"subject": "_Test Task for Project",
			"project": self.project.name,
			"status": "Open"
		}).insert()

		tasks = get_project_tasks(self.project.name)
		self.assertTrue(len(tasks) >= 1)
		# Verify the task we created is in there
		self.assertTrue(any(t['name'] == task.name for t in tasks))

	def test_complete_project_blocker(self):
		# Ensure we have an open task
		task = frappe.get_doc({
			"doctype": "Task",
			"subject": "_Test Blocker Task",
			"project": self.project.name,
			"status": "Open"
		}).insert()
		
		# Should raise exception because of open tasks
		with self.assertRaises(Exception):
			complete_project(self.project.name)
		
		# Close task and try again
		task.status = "Completed"
		task.save()
		
		# Should succeed now
		complete_project(self.project.name)
		self.project.reload()
		self.assertEqual(self.project.status, "Completed")
