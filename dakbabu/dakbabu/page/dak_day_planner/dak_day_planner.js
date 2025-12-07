frappe.pages['dak_day_planner'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '',
        single_column: true
    });

    $(wrapper).find('.layout-main').html(`
        <!-- Navigation Bar Card -->
        <div style="
            width: 100%;
            background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
            padding: 15px 40px;
            margin-bottom: 2px;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
        ">
            <!-- Decorative Circles -->
            <div style="position: absolute; top: -30px; left: 10%; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -40px; right: 5%; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            
            <!-- Left Branding + Nav -->
            <div style="display: flex; align-items: center; gap: 40px; position: relative; z-index: 1;">
                 <!-- Brand -->
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        width: 38px; 
                        height: 38px; 
                        background: rgba(255,255,255,0.2); 
                        border-radius: 10px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: white; 
                        font-size: 1.1rem;
                        backdrop-filter: blur(5px);
                    ">
                        <i class="fa fa-check"></i>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <h1 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: 0.02em;">TaskFlow</h1>
                        <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); font-weight: 500; letter-spacing: 0.5px;">ERPNext Extension</span>
                    </div>
                </div>

                <!-- Nav Links -->
                <div style="display: flex; gap: 30px; align-items: center; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 40px; height: 30px;">
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_dashboard')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-home" style="margin-right: 8px; font-size: 1.1rem;"></i> Dashboard
                    </div>
                    <div style="display: flex; align-items: center; color: rgba(255,255,255,0.7); font-weight: 500; cursor: pointer; transition: color 0.2s;" onclick="frappe.set_route('dak_task_list')" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        <i class="fa fa-list" style="margin-right: 8px; font-size: 1rem;"></i> All Tasks
                    </div>
                    <div style="display: flex; align-items: center; color: #ffffff; font-weight: 600; cursor: pointer; border-bottom: 2px solid #ffffff; padding-bottom: 5px;" onclick="frappe.set_route('dak_day_planner')">
                        <i class="fa fa-calendar-check-o" style="margin-right: 8px; font-size: 1rem;"></i> Day Planner
                    </div>
                </div>
            </div>

            <!-- Right Controls -->
            <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                 <!-- Add Task Button -->
                <button onclick="frappe.msgprint('Task Drawer not implemented on this page yet')" style="
                    background: rgba(255,255,255,0.2); 
                    color: #ffffff; 
                    border: none; 
                    padding: 8px 16px; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 0.9rem; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    <i class="fa fa-plus" style="margin-right: 8px;"></i> Add Task
                </button>
            </div>
        </div>



        <div style="padding: 40px; text-align: center; color: #6b7280;">
            <i class="fa fa-calendar" style="font-size: 4rem; opacity: 0.2; margin-bottom: 20px;"></i>
            <h3>Day Planner</h3>
            <p>Your daily schedule will appear here.</p>
        </div>
    `);
}