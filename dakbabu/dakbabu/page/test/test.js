frappe.pages['test'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Test Page',
        single_column: true
    });
    // Inject CSS
    $("<style>")
        .prop("type", "text/css")
        .html(`
            @font-face { font-family: 'Roboto'; src: url('/assets/dakbabu/fonts/Roboto-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
            @font-face { font-family: 'Roboto'; src: url('/assets/dakbabu/fonts/Roboto-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
            @font-face { font-family: 'Roboto'; src: url('/assets/dakbabu/fonts/Roboto-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; }
            
            body, .frappe-app, h1, h2, h3, h4, h5, h6, .form-control, .btn { font-family: 'Roboto', sans-serif !important; }
            
            /* Vibrant Test Page Styles */
            .modal-content { border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); border: none; }
            .modal-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-top-left-radius: 12px; border-top-right-radius: 12px; padding: 20px 24px; }
            .modal-title { font-weight: 700; font-size: 1.25rem; color: white; }
            .modal-body { padding: 30px; background-color: #f8f9fc; }
            .modal-footer { background-color: #f8f9fc; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top: 1px solid #e3e6f0; padding: 16px 24px; }
            .form-group label { font-weight: 600; color: #4e73df; margin-bottom: 8px; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
            .form-control { border-radius: 8px; border: 1px solid #d1d3e2; padding: 12px 16px; transition: all 0.3s ease; background-color: white; }
            .form-control:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25); }
            .btn-primary { background: linear-gradient(to right, #667eea, #764ba2); border: none; border-radius: 8px; padding: 10px 24px; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease; }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4); background: linear-gradient(to right, #5a6fd1, #6b4391); }
            .list-group-item { border: none; margin-bottom: 8px; border-radius: 8px !important; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s ease; border-left: 4px solid transparent; }
            .list-group-item:hover { transform: translateX(5px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); background-color: white; }
            h4 { color: #5a5c69; font-weight: 700; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; display: inline-block; }
            .col-md-3:nth-child(1) .list-group-item { border-left-color: #4e73df; } .col-md-3:nth-child(1) h4 { border-bottom-color: #4e73df; color: #4e73df; }
            .col-md-3:nth-child(2) .list-group-item { border-left-color: #1cc88a; } .col-md-3:nth-child(2) h4 { border-bottom-color: #1cc88a; color: #1cc88a; }
            .col-md-3:nth-child(3) .list-group-item { border-left-color: #f6c23e; } .col-md-3:nth-child(3) h4 { border-bottom-color: #f6c23e; color: #f6c23e; }
            .col-md-3:nth-child(4) .list-group-item { border-left-color: #e74a3b; } .col-md-3:nth-child(4) h4 { border-bottom-color: #e74a3b; color: #e74a3b; }
            /* Dashboard Card Decorations */
            .dashboard-stat-box { position: relative; overflow: hidden; }
            .dashboard-stat-box::after { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; pointer-events: none; }
            
            /* Sortable Placeholder & White Text */
            .sortable-placeholder { border: 2px dashed #ccc; border-radius: 8px; height: 100px; margin-bottom: 10px; background: #e9ecef; }
            .kanban-card, .kanban-card a, .kanban-card h6, .kanban-card small, .kanban-card i, .kanban-card span { color: white !important; }
            .kanban-card a:hover { text-decoration: underline; }
            #view-card .card, #view-card .card a, #view-card .card h5, #view-card .card small, #view-card .card i { color: white !important; }
            
            /* Native DnD Styles */
            .kanban-column { transition: background 0.2s, border 0.2s; border: 2px solid transparent; }
            .kanban-column.drag-over { background-color: #e2e6ea !important; border: 2px dashed #667eea; }
            .kanban-card.dragging { opacity: 0.5; transform: scale(0.98); }
        `)
        .appendTo(wrapper);
    page.set_title('Test Page');
    page.set_indicator('Active', 'green');
    // CSS file is injected above or can be required
    // frappe.require('/assets/dakbabu/dakbabu/page/test/test.css');
    page.add_menu_item('Create Customer', function () {
        create_customer_dialog(page);
    });
    page.set_primary_action('Create Task', function () {
        start_task_wizard(page);
    });
    // Define refresh function on the page object so it can be called later
    page.refresh_data = function () {
        console.log("Refreshing page data...");
        frappe.call({
            method: "dakbabu.dakbabu.page.test.test.get_dashboard_data",
            callback: function (r) {
                console.log("Test page data received:", r);
                // Clear current content
                page.main.empty();
                if (r.message) {
                    // Pre-process data for template safety
                    if (r.message.tasks) {
                        var today = frappe.datetime.get_today();
                        r.message.tasks.forEach((t) => {
                            // Calculate Overdue
                            if (t.status === 'Open' && t.exp_end_date && t.exp_end_date < today) {
                                t.status = 'Overdue';
                            }
                            // Map colors and gradients using helper
                            let attrs = get_status_attributes(t.status);
                            t._status_color = attrs.color;
                            t._border_color = attrs.border;
                            t._bg_style = attrs.bg;
                            t._formatted_date = t.exp_end_date ? frappe.datetime.str_to_user(t.exp_end_date) : 'No Date';
                        });
                        // Add Statuses for Kanban
                        r.message.statuses = ['Open', 'Working', 'Pending Review', 'Overdue', 'Completed'];
                        // Prepare Kanban Columns Data
                        r.message.kanban_columns = [];
                        r.message.statuses.forEach((status) => {
                            r.message.kanban_columns.push({
                                title: status,
                                tasks: r.message.tasks.filter((t) => t.status === status)
                            });
                        });
                    }
                    var html = frappe.render_template('test', r.message);
                    console.log("Rendered HTML length:", html.length);
                    page.main.html(html);
                    // Restore Active View
                    if (page.current_view) {
                        page.main.find('.task-view').hide();
                        page.main.find('#' + page.current_view).show();
                        page.main.find('.btn-view-trigger').removeClass('active');
                        page.main.find('.btn-view-trigger[data-target="' + page.current_view + '"]').addClass('active');
                    }
                    if (page.current_view === 'view-kanban') {
                        init_kanban(page);
                    }
                }
                else {
                    console.log("No data received");
                    $(frappe.render_template('test', {})).appendTo(page.main);
                }
            },
            error: function (r) {
                console.log("Error in fetching test page data", r);
                page.main.html('<div class="alert alert-danger">Error fetching data. Check console.</div>');
            }
        });
    };
    // Event delegation for opening task dialog
    page.main.on('click', '.task-edit-trigger', function (e) {
        e.preventDefault();
        var task_name = $(this).attr('data-task-name');
        if (task_name) {
            window.open_task_dialog(task_name);
        }
    });
    // Event delegation for view switching
    page.main.on('click', '.btn-view-trigger', function (e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        // Update Buttons
        page.main.find('.btn-view-trigger').removeClass('active');
        $(this).addClass('active');
        // Update Views
        page.main.find('.task-view').hide();
        page.main.find('#' + target).show();
        // Save state
        page.current_view = target;
        // Init Kanban if needed
        if (target === 'view-kanban') {
            init_kanban(page);
        }
    });
    // Default View
    page.current_view = 'view-list';
    // Initial Load
    if (page.refresh_data)
        page.refresh_data();
};
function get_status_attributes(status) {
    let attrs = { color: 'secondary', border: '#858796', bg: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)' };
    if (status === 'Overdue') {
        attrs = { color: 'danger', border: '#e74a3b', bg: 'linear-gradient(135deg, #FF6B6B 0%, #EE5D5D 100%)' };
    }
    else if (status === 'Open') {
        attrs = { color: 'primary', border: '#4e73df', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
    else if (status === 'Working') {
        attrs = { color: 'warning', border: '#f6c23e', bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' };
    }
    else if (status === 'Pending Review') {
        attrs = { color: 'info', border: '#36b9cc', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' };
    }
    else if (status === 'Completed') {
        attrs = { color: 'success', border: '#1cc88a', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' };
    }
    return attrs;
}
function init_kanban(page) {
    // Native HTML5 Drag and Drop
    // Ensure all cards are draggable
    let cards = page.main.find('.kanban-card');
    cards.attr('draggable', 'true');
    // Drag Start
    page.main.off('dragstart', '.kanban-card').on('dragstart', '.kanban-card', function (e) {
        const dt = e.originalEvent.dataTransfer;
        dt.setData('text/plain', $(this).attr('data-task-name'));
        dt.effectAllowed = 'move';
        $(this).addClass('dragging');
        window.dragged_card = $(this); // Fallback for some browsers
    });
    // Drag End
    page.main.off('dragend', '.kanban-card').on('dragend', '.kanban-card', function (e) {
        $(this).removeClass('dragging');
        page.main.find('.kanban-column').removeClass('drag-over');
    });
    // Drag Over Column
    page.main.off('dragover', '.kanban-column').on('dragover', '.kanban-column', function (e) {
        e.preventDefault(); // Necessary to allow dropping
        e.originalEvent.dataTransfer.dropEffect = 'move';
        $(this).addClass('drag-over');
    });
    // Drag Leave Column
    page.main.off('dragleave', '.kanban-column').on('dragleave', '.kanban-column', function (e) {
        $(this).removeClass('drag-over');
    });
    // Drop on Column
    page.main.off('drop', '.kanban-column').on('drop', '.kanban-column', function (e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
        let task_name = e.originalEvent.dataTransfer.getData('text/plain');
        // Fallback if dataTransfer is empty
        if (!task_name && window.dragged_card) {
            task_name = window.dragged_card.attr('data-task-name');
        }
        var new_status = $(this).attr('data-status');
        var card = page.main.find('.kanban-card[data-task-name="' + task_name + '"]');
        if (task_name && new_status && card.length) {
            // Instant Visual Update
            // 1. Move the card to the new column
            $(this).append(card);
            // 2. Update Color/Background
            let attrs = get_status_attributes(new_status);
            card.css('background', attrs.bg);
            // 3. Send Request
            frappe.call({
                method: 'frappe.client.set_value',
                args: {
                    doctype: 'Task',
                    name: task_name,
                    fieldname: 'status',
                    value: new_status
                },
                callback: function (r) {
                    if (!r.exc) {
                        // frappe.show_alert({
                        //     message: __('Task moved to {0}', [new_status]),
                        //     indicator: 'green'
                        // });
                    }
                    else {
                        frappe.msgprint(__('Failed to update status'));
                        // Optional: Revert visual change on error
                    }
                }
            });
        }
    });
}
function create_customer_dialog(page) {
    let d = new frappe.ui.Dialog({
        title: 'Create New Customer',
        fields: [
            {
                label: 'Customer Name',
                fieldname: 'customer_name',
                fieldtype: 'Data',
                reqd: 1
            },
            {
                label: 'Customer Type',
                fieldname: 'customer_type',
                fieldtype: 'Select',
                options: 'Company\nIndividual',
                default: 'Company',
                reqd: 1
            },
            {
                label: 'Full Name',
                fieldname: 'customer_primary_contact',
                fieldtype: 'Data',
                description: 'Primary Contact Person (Optional)'
            },
            {
                label: 'Mobile No',
                fieldname: 'mobile_no',
                fieldtype: 'Data'
            },
            {
                label: 'Email',
                fieldname: 'email_id',
                fieldtype: 'Data'
            },
            {
                label: 'Add Address Details?',
                fieldname: 'add_address',
                fieldtype: 'Check',
                default: 0,
                description: 'Check to add address in next step',
                onchange: function () {
                    // Dynamic Button Label
                    // 'this' context might be field or dialog depending on call, safe to use d.get_primary_btn()
                    let is_checked = d.get_value('add_address');
                    let btn_label = is_checked ? 'Next' : 'Create';
                    d.get_primary_btn().html(btn_label);
                }
            }
        ],
        primary_action_label: 'Create',
        primary_action: (values) => {
            // Create Customer Field
            frappe.call({
                method: "frappe.client.insert",
                args: {
                    doc: {
                        doctype: 'Customer',
                        customer_name: values.customer_name,
                        customer_type: values.customer_type,
                        customer_group: 'All Customer Groups',
                        territory: 'All Territories',
                        mobile_no: values.mobile_no,
                        email_id: values.email_id
                    }
                },
                callback: function (r) {
                    if (!r.exc) {
                        d.hide();
                        if (values.add_address) {
                            // Proceed to Step 2: Address
                            create_customer_address_step(page, r.message.name);
                        }
                        else {
                            frappe.msgprint({
                                title: __('Success'),
                                indicator: 'green',
                                message: __('Customer {0} created successfully', ['<a href="/app/customer/' + r.message.name + '">' + r.message.customer_name + '</a>'])
                            });
                            if (page.refresh_data)
                                page.refresh_data();
                        }
                    }
                }
            });
        }
    });
    d.show();
}
function create_customer_address_step(page, customer_name) {
    let d2 = new frappe.ui.Dialog({
        title: 'Step 2: Add Address',
        fields: [
            {
                label: 'Address Line 1',
                fieldname: 'address_line1',
                fieldtype: 'Data',
                reqd: 1
            },
            {
                label: 'Address Line 2',
                fieldname: 'address_line2',
                fieldtype: 'Data'
            },
            {
                label: 'City',
                fieldname: 'city',
                fieldtype: 'Data',
                reqd: 1
            },
            {
                label: 'State',
                fieldname: 'state',
                fieldtype: 'Data'
            },
            {
                label: 'Country',
                fieldname: 'country',
                fieldtype: 'Link',
                options: 'Country',
                default: 'India'
            },
            {
                label: 'ZIP / Postal Code',
                fieldname: 'pincode',
                fieldtype: 'Data'
            }
        ],
        primary_action_label: 'Save Address',
        primary_action: (values) => {
            frappe.call({
                method: "frappe.client.insert",
                args: {
                    doc: {
                        doctype: 'Address',
                        address_title: customer_name,
                        address_type: 'Billing', // Default
                        address_line1: values.address_line1,
                        address_line2: values.address_line2,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                        pincode: values.pincode,
                        links: [
                            {
                                link_doctype: 'Customer',
                                link_name: customer_name
                            }
                        ]
                    }
                },
                callback: function (r) {
                    d2.hide();
                    frappe.msgprint({
                        title: __('Success'),
                        indicator: 'green',
                        message: __('Customer and Address created successfully')
                    });
                    if (page.refresh_data)
                        page.refresh_data();
                }
            });
        }
    });
    d2.show();
}
function start_task_wizard(page) {
    // Step 1: Customer
    let d1 = new frappe.ui.Dialog({
        title: 'Step 1: Select Customer',
        fields: [
            {
                label: 'Customer',
                fieldname: 'customer',
                fieldtype: 'Link',
                options: 'Customer',
                reqd: 1,
                description: 'Select existing or create new.'
            }
        ],
        primary_action_label: 'Next',
        primary_action: (values) => {
            d1.hide();
            step_2_project(page, values.customer);
        }
    });
    d1.show();
}
function step_2_project(page, customer) {
    let d2 = new frappe.ui.Dialog({
        title: 'Step 2: Select Project',
        fields: [
            {
                label: 'Project',
                fieldname: 'project',
                fieldtype: 'Link',
                options: 'Project',
                reqd: 0,
                description: 'Select existing or create new (Optional).',
                get_query: () => {
                    return {
                        filters: {
                            customer: customer
                        }
                    };
                }
            }
        ],
        primary_action_label: 'Next',
        primary_action: (values) => {
            d2.hide();
            step_3_task(page, customer, values.project);
        }
    });
    d2.show();
}
function step_3_task(page, customer, project) {
    let d3 = new frappe.ui.Dialog({
        title: 'Step 3: Task Details',
        fields: [
            {
                label: 'Subject',
                fieldname: 'subject',
                fieldtype: 'Data',
                reqd: 1
            },
            {
                label: 'Assigned To',
                fieldname: 'assigned_to',
                fieldtype: 'Link',
                options: 'User',
                description: 'User who will perform the task'
            },
            {
                label: 'Expected Start Date',
                fieldname: 'exp_start_date',
                fieldtype: 'Date'
            },
            {
                label: 'Expected End Date',
                fieldname: 'exp_end_date',
                fieldtype: 'Date'
            }
        ],
        primary_action_label: 'Next',
        primary_action: (values) => {
            d3.hide();
            step_4_description(page, customer, project, values);
        }
    });
    d3.show();
}
function step_4_description(page, customer, project, basic_values) {
    let d4 = new frappe.ui.Dialog({
        title: 'Step 4: Description & Sharing',
        fields: [
            {
                label: 'Description',
                fieldname: 'description',
                fieldtype: 'Text Editor'
            },
            {
                label: 'Share With',
                fieldname: 'shared_with',
                fieldtype: 'Link',
                options: 'User',
                description: 'User to share this task with (Optional)'
            }
        ],
        primary_action_label: 'Create Task',
        primary_action: (values) => {
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Task',
                        subject: basic_values.subject,
                        description: values.description,
                        customer: customer,
                        project: project,
                        exp_start_date: basic_values.exp_start_date,
                        exp_end_date: basic_values.exp_end_date,
                    }
                },
                callback: function (r) {
                    if (r.exc) {
                        frappe.msgprint(__('Failed to create task'));
                        return;
                    }
                    let doc = r.message;
                    let tasks = [];
                    // Handle Assignment
                    if (basic_values.assigned_to) {
                        tasks.push(frappe.call({
                            method: 'frappe.desk.form.assign_to.add',
                            args: {
                                doctype: 'Task',
                                name: doc.name,
                                assign_to: [basic_values.assigned_to]
                            }
                        }));
                    }
                    // Handle Sharing
                    if (values.shared_with) {
                        tasks.push(frappe.call({
                            method: 'frappe.share.add',
                            args: {
                                doctype: 'Task',
                                name: doc.name,
                                user: values.shared_with,
                                read: 1,
                                write: 1,
                                share: 1
                            }
                        }));
                    }
                    Promise.all(tasks).then(() => {
                        d4.hide();
                        frappe.msgprint({
                            title: __('Success'),
                            indicator: 'green',
                            message: __('Task {0} created successfully', ['<a href="/app/task/' + doc.name + '">' + doc.name + '</a>'])
                        });
                        if (page.refresh_data) {
                            page.refresh_data();
                        }
                        else {
                            page.refresh && page.refresh(); // Fallback
                        }
                    });
                },
                error: function (r) {
                    console.log("Error creating task:", r);
                    frappe.msgprint(__('An error occurred while creating the task. Check console for details.'));
                }
            });
        }
    });
    d4.show();
}
// Global function to be accessible from onclick in template
window.open_task_dialog = function (task_name) {
    console.log("Opening task dialog for:", task_name);
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Task',
            name: task_name
        },
        callback: function (r) {
            if (r.message) {
                let doc = r.message;
                let d = new frappe.ui.Dialog({
                    title: 'Edit Task: ' + doc.name,
                    fields: [
                        {
                            label: 'Subject',
                            fieldname: 'subject',
                            fieldtype: 'Data',
                            read_only: 1,
                            default: doc.subject
                        },
                        {
                            label: 'Status',
                            fieldname: 'status',
                            fieldtype: 'Select',
                            options: 'Open\nWorking\nPending Review\nOverdue\nCompleted\nCancelled',
                            default: doc.status
                        },
                        {
                            label: 'Expected Start Date',
                            fieldname: 'exp_start_date',
                            fieldtype: 'Date',
                            default: doc.exp_start_date
                        },
                        {
                            label: 'Expected End Date',
                            fieldname: 'exp_end_date',
                            fieldtype: 'Date',
                            default: doc.exp_end_date
                        },
                        {
                            label: 'Expected Time (Hours)',
                            fieldname: 'expected_time',
                            fieldtype: 'Float',
                            default: doc.expected_time,
                            description: 'Estimated hours to complete'
                        }
                    ],
                    primary_action_label: 'Update',
                    primary_action: (values) => {
                        frappe.call({
                            method: 'frappe.client.set_value',
                            args: {
                                doctype: 'Task',
                                name: doc.name,
                                fieldname: {
                                    status: values.status,
                                    exp_start_date: values.exp_start_date,
                                    exp_end_date: values.exp_end_date,
                                    expected_time: values.expected_time
                                }
                            },
                            callback: function (r) {
                                d.hide();
                                frappe.msgprint(__('Task updated successfully'));
                                // Refresh page
                                if (frappe.pages['test'] && frappe.pages['test'].refresh_data) {
                                    frappe.pages['test'].refresh_data();
                                }
                            }
                        });
                    }
                });
                d.show();
            }
        }
    });
};
//# sourceMappingURL=test.js.map