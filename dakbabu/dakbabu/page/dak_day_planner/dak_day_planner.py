import frappe
from frappe.utils import getdate

@frappe.whitelist()
def get_day_plan(date):
    """
    Fetches all tasks scheduled for a specific date from the 'Dak Schedule' DocType.
    Also fetches the associated Task details for display.
    """
    schedule = frappe.get_all(
        "Dak Schedule",
        filters={"schedule_date": date},
        fields=["name", "task", "start_time", "end_time", "task.subject", "task.project", "task.priority", "task.status", "task.expected_time", "task.exp_end_date", "task.custom_working_now"]
    )
    return schedule

@frappe.whitelist()
def schedule_task(task_name, date, start_time, end_time):
    """
    Creates a new 'Dak Schedule' entry.
    """
    try:
        # Check for overlaps (optional but recommended)
        # For MVP, just create
        doc = frappe.get_doc({
            "doctype": "Dak Schedule",
            "task": task_name,
            "schedule_date": date,
            "start_time": start_time,
            "end_time": end_time
        })
        doc.insert()
        return doc.name
    except Exception as e:
        frappe.log_error(f"Error scheduling task: {str(e)}")
        return None

@frappe.whitelist()
def reschedule_task(schedule_id, date, start_time, end_time):
    """
    Updates an existing 'Dak Schedule' entry with new time/date.
    """
    try:
        doc = frappe.get_doc("Dak Schedule", schedule_id)
        doc.schedule_date = date
        doc.start_time = start_time
        doc.end_time = end_time
        doc.save()
        return True
    except Exception as e:
        frappe.log_error(f"Error rescheduling task: {str(e)}")
        return False

@frappe.whitelist()
def unschedule_task_from_slot(schedule_id):
    """
    Removes a 'Dak Schedule' entry.
    """
    try:
        frappe.delete_doc("Dak Schedule", schedule_id)
        return True
    except Exception as e:
        frappe.log_error(f"Error removing schedule: {str(e)}")
        return False

@frappe.whitelist()
def reset_day_schedule(date):
    """
    Clears all 'Dak Schedule' entries for a specific date.
    """
    try:
        frappe.db.delete("Dak Schedule", {"schedule_date": date})
        return True
    except Exception as e:
        frappe.log_error(f"Error clearing schedule: {str(e)}")
        return False

@frappe.whitelist()
def get_unscheduled_tasks(date=None):
    """
    Fetches tasks that are NOT scheduled for the given date (or at all, depending on logic).
    For now, adhering to user request: "remove those task from unscheduled task list on day planner"
    Meaning: If a task has a 'Dak Schedule' entry for the SELECTED DATE, don't show it in the pool.
    """
    
    # 1. Get all incomplete tasks
    # 1. Get all incomplete tasks
    order_by = "custom_planner_sort_index asc, priority desc"
    
    # Ensure field exists (lazy migration for dev)
    if not frappe.db.has_column("Task", "custom_planner_sort_index"):
        create_custom_sort_field()

    all_tasks = frappe.get_all(
        "Task",
        filters=[["status", "!=", "Completed"], ["status", "!=", "Cancelled"]],
        fields=["name", "subject", "status", "priority", "exp_end_date", "project", "expected_time", "custom_planner_sort_index"],
        order_by=order_by
    )


    # 2. Get IDs of tasks scheduled for this date
    scheduled_task_names = []
    if date:
        scheduled_task_names = frappe.get_all(
            "Dak Schedule",
            filters={"schedule_date": date},
            pluck="task"
        )

    # 3. Filter out scheduled tasks
    unscheduled = [t for t in all_tasks if t.name not in scheduled_task_names]
    
    # Optional: Logic to still show tasks if they are scheduled for OTHER days? 
    # Current logic: If it's scheduled for TODAY, hide it. If scheduled for tomorrow, show it in pool (so you can schedule it for today too if needed, or maybe not).
    # User said "remove those task from unscheduled task list", usually implies if it's on the board, take it off the list.
    
    return unscheduled

@frappe.whitelist()
def update_task_order(task_names):
    """
    Updates the custom_planner_sort_index for a list of tasks.
    """
    import json
    if isinstance(task_names, str):
        task_names = json.loads(task_names)
        
    for idx, task_name in enumerate(task_names):
        frappe.db.set_value("Task", task_name, "custom_planner_sort_index", idx)
    
    return True

def create_custom_sort_field():
    """
    Creates the custom field for sorting if it doesn't exist.
    """
    if not frappe.db.has_column("Task", "custom_planner_sort_index"):
        from frappe.custom.doctype.custom_field.custom_field import create_custom_field
        create_custom_field("Task", {
            "fieldname": "custom_planner_sort_index",
            "label": "Planner Sort Index",
            "fieldtype": "Float",
            "default": 0,
            "hidden": 1
        })

