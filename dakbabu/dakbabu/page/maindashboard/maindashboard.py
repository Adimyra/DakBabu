import frappe

@frappe.whitelist()
def get_latest_task():
    """
    Fetches the most recently created Task.
    Returns a dict with title, description, priority, and status.
    """
    try:
        frappe.log_error("Main Dashboard: Fetching Latest Task", "Debug")
        tasks = frappe.get_all('Task', 
            fields=['name', 'subject', 'priority', 'status', 'exp_end_date', 'description', 'project'],
            order_by='creation desc',
            limit_page_length=1
        )
        
        if not tasks:
            return None

        task = tasks[0]
        
        # Format due date if exists
        due_date = ""
        if task.exp_end_date:
            due_date = frappe.format_date(task.exp_end_date)

        return {
            'name': task.name,
            'title': task.subject,
            'description': task.description, # Real description
            'due_date': due_date,
            'priority': task.priority,
            'status': task.status,
            'project': task.project
        }
    except Exception as e:
        frappe.log_error(f"Error in Main Dashboard Fetch: {str(e)}")
        return None
