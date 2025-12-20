import frappe
from frappe.utils import getdate
from dakbabu.dakbabu.page.dak_day_planner.dak_day_planner import schedule_task, reschedule_task, reset_day_schedule

def verify():
    date = "2025-12-25" # Christmas testing!
    
    # 0. Setup: Create Dummy Tasks if needed (or just use existing strings as task IDs if the code allows, 
    # but the code uses them as FKs usually so we need valid Task docs.
    # Let's try to find or create 2 tasks.
    
    tasks = []
    for subject in ["Test Task A", "Test Task B", "Test Task C"]:
        if not frappe.db.exists("Task", {"subject": subject}):
            t = frappe.get_doc({"doctype": "Task", "subject": subject, "status": "Open"}).insert()
            tasks.append(t.name)
        else:
            tasks.append(frappe.db.get_value("Task", {"subject": subject}, "name"))
            
    task_a = tasks[0]
    task_b = tasks[1]
    task_c = tasks[2]

    # 1. Clean Slate
    print(f"Clearing schedule for {date}")
    reset_day_schedule(date)
    
    # 2. Schedule Task A: 09:00:00 - 10:00:00
    print("Scheduling Task A (09:00 - 10:00)...")
    res = schedule_task(task_a, date, "09:00:00", "10:00:00")
    if res:
        print("PASS: Task A scheduled.")
    else:
        print("FAIL: Task A failed to schedule.")
        return

    # 3. Schedule Task B: 09:30:00 - 10:30:00 (Overlap)
    print("Scheduling Task B (09:30 - 10:30) [Should Fail]...")
    try:
        res = schedule_task(task_b, date, "09:30:00", "10:30:00")
        print(f"FAIL: Task B scheduled unexpectedly: {res}")
    except Exception as e:
        print(f"PASS: Task B rejected: {e}")

    # 4. Schedule Task B: 08:30:00 - 09:30:00 (Overlap)
    print("Scheduling Task B (08:30 - 09:30) [Should Fail]...")
    try:
        res = schedule_task(task_b, date, "08:30:00", "09:30:00")
        print(f"FAIL: Task B scheduled unexpectedly: {res}")
    except Exception as e:
        print(f"PASS: Task B rejected: {e}")

    # 5. Schedule Task B: 10:00:00 - 11:00:00 (No Overlap)
    print("Scheduling Task B (10:00 - 11:00) [Should Pass]...")
    try:
        res = schedule_task(task_b, date, "10:00:00", "11:00:00")
        if res:
            print("PASS: Task B scheduled.")
        else:
            print("FAIL: Task B failed to schedule.")
    except Exception as e:
        print(f"FAIL: Task B rejected unexpectedly: {e}")

    # 6. Reschedule Task A to 10:30:00 - 11:30:00 (Overlap with Task B)
    print("Rescheduling Task A to (10:30 - 11:30) [Should Fail]...")
    # Need schedule ID for Task A
    sched_a = frappe.db.get_value("Dak Schedule", {"task": task_a, "schedule_date": date}, "name")
    
    try:
        res = reschedule_task(sched_a, date, "10:30:00", "11:30:00")
        print(f"FAIL: Task A rescheduled unexpectedly: {res}")
    except Exception as e:
        print(f"PASS: Task A reschedule rejected: {e}")


    # Cleanup
    reset_day_schedule(date)
    print("Cleanup done.")

verify()
