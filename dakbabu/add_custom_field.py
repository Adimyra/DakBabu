
import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
    field_name = "customer"
    doctype = "Task"
    
    # Check if field exists
    if frappe.db.exists("DocField", {"parent": doctype, "fieldname": field_name}) or \
       frappe.db.exists("Custom Field", {"dt": doctype, "fieldname": field_name}):
        print(f"Field '{field_name}' already exists in {doctype}.")
        return

    print(f"Creating Custom Field '{field_name}' in {doctype}...")
    
    create_custom_field(doctype, {
        "fieldname": field_name,
        "label": "Source of Task",
        "fieldtype": "Link",
        "options": "Customer",
        "insert_after": "project" 
    })
    
    frappe.clear_cache(doctype=doctype)
    print("Success. Field created.")
