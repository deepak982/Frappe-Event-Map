frappe.pages['event-map'].on_page_load = async function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Event Map',
		single_column: true
	});
	await frappe.require("leaflet.bundle.css")
	await frappe.require("maps_view.bundle.js")
	console.log(frappe.mapsviewbuilder)
	const mapsview = new frappe.mapsviewbuilder.MapsViewBuilder(page, wrapper)
	console.log("MAPS VIEW BUILDER INSTANCE: ", mapsview)
}