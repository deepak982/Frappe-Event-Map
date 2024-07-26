import frappe
import json
import os

@frappe.whitelist()
def get_data(name, type):
    if type == 'state':
        # file_path = '/home/extension/frappe-bench/apps/eventmap/eventmap/public/js/state/india_state.geojson'
        file_path = '/home/extension/frappe-bench/apps/eventmap/eventmap/public/js/state/india_telengana.geojson'
    elif type == 'city':
        file_path = '/home/extension/frappe-bench/apps/eventmap/eventmap/public/js/district/india_district.geojson'
    else:
        return json.dumps({"error": "Invalid type"})

    if not os.path.exists(file_path):
        return json.dumps({"error": "File not found"})

    with open(file_path, 'r') as file:
        data = json.load(file)
        
        # Filter the data based on the name
        if type == 'state':
            features = [feature for feature in data['features'] if feature['properties']['NAME_1'] == name]
        elif type == 'city':
            features = [feature for feature in data['features'] if feature['properties']['NAME_2'] == name]

        if features:
            return json.dumps({"type": "FeatureCollection", "features": features})
        else:
            return json.dumps({"error": f"{type.capitalize()} not found"})
