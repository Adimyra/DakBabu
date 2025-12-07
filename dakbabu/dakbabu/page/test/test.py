from __future__ import unicode_literals
import frappe

@frappe.whitelist()
def get_dashboard_data():
	return {
		"customers": frappe.get_all("Customer", fields=["name", "customer_name"], limit=5),
		"projects": frappe.get_all("Project", fields=["name", "project_name"], limit=5),
		"addresses": frappe.get_all("Address", fields=["name", "address_line1"], limit=5),
		"tasks": frappe.get_all("Task", fields=["name", "subject", "priority", "status", "exp_end_date"], limit=50, order_by="modified desc"),
        "open_task_count": frappe.db.count("Task", filters={"status": "Open"}),

        "overdue_task_count": frappe.db.count("Task", filters={"status": "Overdue"})
	}


