import frappe

@frappe.whitelist()
def get_timesheets_summary(status=None, from_date=None, to_date=None, employee=None, search_term=None):
    filters = {}
    
    # Status Filter
    if status and status != 'All':
        filters['status'] = status
    
    # Date Range Filter
    if from_date and to_date:
        filters['start_date'] = ['between', [from_date, to_date]]
    elif from_date:
        filters['start_date'] = ['>=', from_date]
    elif to_date:
        filters['start_date'] = ['<=', to_date]

    # Employee Filter
    if employee:
        filters['employee'] = employee

    # Search Filter
    if search_term:
        # 1. Find directly matching Timesheets
        direct_matches = frappe.db.sql("""
            SELECT name FROM `tabTimesheet`
            WHERE name LIKE %s OR note LIKE %s OR employee_name LIKE %s
        """, (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"), as_dict=True)
        
        match_ids = set([d.name for d in direct_matches])

        # 2. Find Timesheets linked to matching Tasks
        task_matches = frappe.db.sql("""
            SELECT parent FROM `tabTimesheet Detail`
            WHERE task IN (SELECT name FROM `tabTask` WHERE subject LIKE %s)
        """, (f"%{search_term}%",), as_dict=True)
        
        for d in task_matches:
            match_ids.add(d.parent)
        
        if not match_ids:
            return []
            
        filters['name'] = ['in', list(match_ids)]

    timesheets = frappe.get_list('Timesheet', 
        fields=['name', 'status', 'start_date', 'end_date', 'total_hours', 'note', 'employee_name', 'owner', 'employee'], 
        filters=filters, 
        limit_page_length=1000,
        order_by='modified desc'
    )
    
    # Enrich with Task Details
    for ts in timesheets:
        # Get the first task from child table
        details = frappe.get_all('Timesheet Detail', filters={'parent': ts.name}, fields=['task'], limit=1)
        if details and details[0].task:
            ts.task_id = details[0].task
            ts.task_subject = frappe.db.get_value('Task', details[0].task, 'subject')
    
    return timesheets

@frappe.whitelist()
def get_timesheets_for_task(task_name):
    # Fetch timesheets linked to a specific task
    # Note: Timesheets are usually linked via 'Timesheet Detail' child table, 
    # but for simplicity assuming we check parent or custom link. 
    # Standard ERPNext links Task in Timesheet Detail.
    
    timesheets = frappe.get_all('Timesheet Detail',
        filters={'task': task_name},
        fields=['parent', 'from_time', 'hours', 'activity_type', 'description'],
        order_by='from_time desc',
        limit_page_length=20,
        ignore_permissions=True
    )
    return timesheets
