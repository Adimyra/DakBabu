import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
    if not frappe.db.has_column("Task", "is_working_now"):
        create_custom_field("Task", {
            "fieldname": "is_working_now",
            "label": "Is Working Now",
            "fieldtype": "Check",
            "insert_after": "status",
            "default": 0
        })
        frappe.db.commit()
        print("Custom Check Field 'is_working_now' created successfully.")
    else:
        print("Field 'is_working_now' already exists.")
