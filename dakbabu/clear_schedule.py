import frappe

def execute():
    frappe.db.delete("Dak Schedule")
    print("All scheduled tasks have been deleted.")
    frappe.db.commit()

if __name__ == "__main__":
    execute()
