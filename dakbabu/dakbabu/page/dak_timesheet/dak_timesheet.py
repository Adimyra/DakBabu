import frappe

@frappe.whitelist()
def get_timesheets_summary(status=None):
    filters = {}
    if status and status != 'All':
        filters['status'] = status
    
    timesheets = frappe.get_list('Timesheet', 
        fields=['name', 'status', 'start_date', 'total_hours', 'note', 'employee_name', 'owner'], 
        filters=filters, 
        order_by='modified desc',
        ignore_permissions=True
    )
    
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
