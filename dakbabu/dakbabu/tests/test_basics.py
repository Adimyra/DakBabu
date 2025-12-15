import frappe
from frappe.tests.utils import FrappeTestCase


class TestDakBabu(FrappeTestCase):
	def test_app_installed(self):
		self.assertIn("dakbabu", frappe.get_installed_apps())

	def test_module_import(self):
		try:
			import dakbabu
		except ImportError:
			self.fail("Could not import dakbabu module")

	def test_project_doctype_exists(self):
		self.assertTrue(frappe.db.exists("DocType", "Project"), "Project DocType should exist")

	def test_task_doctype_exists(self):
		self.assertTrue(frappe.db.exists("DocType", "Task"), "Task DocType should exist")
