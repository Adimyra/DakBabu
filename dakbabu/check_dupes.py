
import frappe

def execute():
    # Find subjects with count > 1
    duplicates = frappe.db.sql("""
        SELECT subject, COUNT(*) as count 
        FROM `tabTask` 
        GROUP BY subject 
        HAVING count > 1
    """, as_dict=True)
    
    print(f"Found {len(duplicates)} subjects with duplicates:")
    for d in duplicates:
        print(f" - {d.subject}: {d.count} copies")
        
if __name__ == "__main__":
    execute()
