import frappe


def delete_duplicate():
	try:
		if frappe.db.exists("Page", "test"):
			frappe.delete_doc("Page", "test")
			print("Successfully deleted Page: test")
		else:
			print("Page dak-task-list not found in database")

		frappe.db.commit()
	except Exception as e:
		print(f"Error deleting page: {e}")
