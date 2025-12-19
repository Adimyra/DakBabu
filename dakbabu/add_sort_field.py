
import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
    if not frappe.db.has_column("Task", "custom_planner_sort_index"):
        create_custom_field("Task", {
            "fieldname": "custom_planner_sort_index",
            "label": "Planner Sort Index",
            "fieldtype": "Float",
            "default": 0,
            "hidden": 1
        })
        frappe.db.commit()
        print("Field 'custom_planner_sort_index' added to Task DoctType.")
    else:
        print("Field 'custom_planner_sort_index' already exists.")

if __name__ == "__main__":
    frappe.connect()
    execute()
