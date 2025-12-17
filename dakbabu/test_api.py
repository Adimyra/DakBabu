
import frappe
from dakbabu.dakbabu.page.dak_projects.dak_projects import get_all_tasks

def execute():
    try:
        data = get_all_tasks()
        print(f"Success! Retrieved {len(data)} tasks.")
        if len(data) > 0:
            print("Sample Task:", data[0])
    except Exception as e:
        print("Error:", e)
