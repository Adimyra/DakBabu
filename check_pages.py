import frappe

def check_pages():
    pages = frappe.get_all("Page", fields=["name", "module", "modified"])
    print("Existing Pages:")
    found_dashboard = False
    found_projects = False
    for p in pages:
        print(f" - {p.name} ({p.module})")
        if p.name == "dak_dashboard":
            found_dashboard = True
        if p.name == "dak_projects":
            found_projects = True
    
    if found_dashboard:
        print("\nWARNING: dak_dashboard page still exists in DB!")
        # Try to delete it again
        # frappe.delete_doc("Page", "dak_dashboard", force=1)
        # print("Attempted to delete dak_dashboard")
    
    if not found_projects:
        print("\nWARNING: dak_projects page NOT found in DB!")
    else:
        print("\nSUCCESS: dak_projects page found.")

check_pages()
