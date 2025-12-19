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
        fields=["name", "task", "start_time", "end_time", "task.subject", "task.project", "task.priority", "task.status"]
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
def get_unscheduled_tasks(date=None):
    """
    Fetches tasks that are NOT scheduled for the given date (or at all, depending on logic).
    For now, adhering to user request: "remove those task from unscheduled task list on day planner"
    Meaning: If a task has a 'Dak Schedule' entry for the SELECTED DATE, don't show it in the pool.
    """
    
    # 1. Get all incomplete tasks
    all_tasks = frappe.get_all(
        "Task",
        filters=[["status", "!=", "Completed"], ["status", "!=", "Cancelled"]],
        fields=["name", "subject", "status", "priority", "exp_end_date", "project", "expected_time"],
        order_by="priority desc"
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
