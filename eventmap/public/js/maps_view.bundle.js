import L from "leaflet";

class MapsViewBuilder {
    constructor(page, wrapper) {
        if (!page || !wrapper) {
            throw ("page and wrapper object is required to init MapsViewBuilder")
        }
        this.page = page;
        this.wrapper = wrapper;
        this.createMainPage();
    }

    async createMainPage() {
        // add sidebar menu and form
        await this.prepareForm();
        const container = await this.prepareMapsContainer();
        this.page.container.append(container);
        await this.createMap();
    }

    async createMap() {
        this.map = L.map('main-maps-container').setView([28.429411, 77.312271], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        const mapPane = document.querySelector(".leaflet-map-pane");
        mapPane.style["z-index"] = 1;
        try {
            navigator.geolocation.getCurrentPosition((currentLocation) => {
                const currentLatLong = [currentLocation.coords.latitude, currentLocation.coords.longitude];
                this.map.setView(currentLatLong, 13);
            });
        } catch (e) {
            console.error("UNABLE TO GET CURRENT LOCATION: ", e);
        }
    }

    // async loadGeoJSON(url) {
    //     try {
    //         const response = await fetch(url, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Network response was not ok: ${response.statusText}`);
    //         }
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error("Failed to load GeoJSON data:", error);
    //     }
    // }
    

    // async addGeoJSONLayer(url, style) {
    //     const data = await this.loadGeoJSON(url);
    //     if (data) {
    //         const layer = L.geoJSON(data, { style: style }).addTo(this.map);
    //         return layer;
    //     }
    // }

    // async highlightStateOrCity(name, type) {
    //     let url, style, data;
    
    //     if (type === 'state' && name === 'Haryana') {
    //         // Hardcoded GeoJSON data for Haryana
    //         data = {
    //             "type": "FeatureCollection",
    //             "features": [
    //                 {
    //                     "type": "Feature",
    //                     "properties": {
    //                         "NAME_1": "Haryana"
    //                     },
    //                     "geometry": {
    //                         "type": "Polygon",
    //                         "coordinates": [
    //                             [
    //                                 [76.060966, 30.877881],
    //                                 [76.810656, 30.919516],
    //                                 [77.837451, 30.839895],
    //                                 [78.359546, 30.897318],
    //                                 [79.112349, 30.778769],
    //                                 [79.279062, 30.474856],
    //                                 [79.440878, 30.183422],
    //                                 [79.670245, 30.133322],
    //                                 [79.817055, 29.705311],
    //                                 [79.924058, 29.386651],
    //                                 [79.653465, 28.751268],
    //                                 [79.312951, 28.527542],
    //                                 [78.885345, 28.558479],
    //                                 [78.747889, 28.843249],
    //                                 [78.370398, 28.934168],
    //                                 [78.159243, 29.319078],
    //                                 [77.579145, 29.387891],
    //                                 [76.958294, 29.588665],
    //                                 [76.742902, 29.755229],
    //                                 [76.513534, 29.914103],
    //                                 [76.227175, 30.097588],
    //                                 [75.908832, 30.309221],
    //                                 [75.652897, 30.542586],
    //                                 [75.702506, 30.782983],
    //                                 [76.060966, 30.877881]
    //                             ]
    //                         ]
    //                     }
    //                 }
    //             ]
    //         };
    
    //         style = (feature) => {
    //             return {
    //                 fillColor: feature.properties.NAME_1 === name ? 'red' : 'transparent',
    //                 weight: 2,
    //                 opacity: 1,
    //                 color: 'white',
    //                 dashArray: '3',
    //                 fillOpacity: 0.7
    //             };
    //         };
    
    //         // Check if previous layer exists and remove it
    //         if (this.stateLayer) {
    //             this.map.removeLayer(this.stateLayer);
    //         }
    
    //         // Add the new layer
    //         this.stateLayer = L.geoJSON(data, { style: style }).addTo(this.map);
    //         console.log("State Layer added:", this.stateLayer);
    
    //         // Set the map view to Haryana coordinates
    //         this.map.fitBounds(this.stateLayer.getBounds());
    //         console.log("Map view set to Haryana");
    //     } else if (type === 'city') {
    //         url = 'apps/eventmap/eventmap/public/js/district/india_district.geojson';
    //         style = (feature) => {
    //             return {
    //                 fillColor: feature.properties.NAME_2 === name ? 'blue' : 'transparent',
    //                 weight: 2,
    //                 opacity: 1,
    //                 color: 'white',
    //                 dashArray: '3',
    //                 fillOpacity: 0.7
    //             };
    //         };
    
    //         // Check if previous layer exists and remove it
    //         if (this.cityLayer) {
    //             this.map.removeLayer(this.cityLayer);
    //         }
    
    //         // Add the new layer
    //         this.cityLayer = await this.addGeoJSONLayer(url, style);
    //         console.log("City Layer added:", this.cityLayer);
    //     }
    // }
    

    // async highlightStateOrCity(name, type) {
    //     let url, style;
    
    //     if (type === 'state') {
    //         url = 'apps/eventmap/eventmap/public/js/state/india_state.geojson';
    //         style = (feature) => {
    //             return {
    //                 fillColor: feature.properties.NAME_1 === name ? 'red' : 'transparent',
    //                 weight: 2,
    //                 opacity: 1,
    //                 color: 'white',
    //                 dashArray: '3',
    //                 fillOpacity: 0.7
    //             };
    //         };
    //         if (this.stateLayer) this.map.removeLayer(this.stateLayer);
    //         this.stateLayer = await this.addGeoJSONLayer(url, style);
    //     } else if (type === 'city') {
    //         url = 'apps/eventmap/eventmap/public/js/district/india_district.geojson';
    //         style = (feature) => {
    //             return {
    //                 fillColor: feature.properties.NAME_2 === name ? 'blue' : 'transparent',
    //                 weight: 2,
    //                 opacity: 1,
    //                 color: 'white',
    //                 dashArray: '3',
    //                 fillOpacity: 0.7
    //             };
    //         };
    //         if (this.cityLayer) this.map.removeLayer(this.cityLayer);
    //         this.cityLayer = await this.addGeoJSONLayer(url, style);
    //     }
    // }
    
    async addGeoJSONLayer(url, style) {
        const data = await this.loadGeoJSON(url);
        if (data) {
            const layer = L.geoJSON(data, { style: style }).addTo(this.map);
            return layer;
        }
    }
    
    async loadGeoJSON(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to load GeoJSON data:", error);
        }
    }
    
    

    generateUI(data, displayFields, parentData) {
        // Create a container div for the UI
        const container = document.createElement('div');

        // Loop through display fields metadata
        displayFields.forEach(field => {
            // Check if the field name exists in the data
            if (field.field_name in data || field.field_name in parentData) {
                // Create a label element
                const label = document.createElement('label');
                label.textContent = field.field_label + ': ';
                label.style.fontWeight = "bold";

                // Create a span element to display the field value
                const valueSpan = document.createElement('span');
                valueSpan.textContent = field.source == "Parent" ? parentData[field.field_name] : data[field.field_name];

                // Create a line break element for better spacing
                const lineBreak = document.createElement('br');

                // Append label, value span, and line break to the container
                container.appendChild(label);
                container.appendChild(valueSpan);
                container.appendChild(lineBreak);
            }
        });

        // Return the generated container node
        return container;
    }

    async updateChildValues(values) {
        console.log("VALUES: ", values);
        const color_coding_field = this.config.color_coding_field;
        const color_codings = this.config.color_codings;

        this.map.eachLayer((layer) => {
            this.map.removeLayer(layer);
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        let mapViewChanged = false;

        values.forEach(child => {
            const generatedUIChild = this.generateUI(child, this.config.display_fields, {});
            console.log("GENERATED UI: ", generatedUIChild);
            let color = color_codings.filter(i => i.value == child[color_coding_field]);
            if (color.length > 0) {
                color = color[0].color;
            } else {
                color = "#000";
            }
            const lat = child[this.config.child_latitude_field];
            const long = child[this.config.child_longitude_field];
            if (!mapViewChanged) {
                this.map.setView(
                    [
                        lat,
                        long,
                    ],
                    13
                );
                mapViewChanged = true;
            }
            const markerHtmlStyles = `
                background-color: ${color};
                width: 1.5rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                display: block;
                left: -1.5rem;
                top: -1.5rem;
                position: relative;
                border-radius: 3rem 3rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF`;

            const icon = L.divIcon({
                className: "my-custom-pin",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span style="${markerHtmlStyles}"><span style="width:0.8rem;height:0.8rem;background-color:white;display:block;border-radius:50%;margin-top:0.3rem;margin-left:0.3rem"></span></span>`,
            });

            L.marker(
                [
                    lat,
                    long,
                ],
                {
                    title: child["name"],
                    icon: icon,
                }
            )
                .addTo(this.map)
                .bindPopup(generatedUIChild);
        });
    }


    async prepareForm() {
        const page = this.page;
        const me = this;

        let mapsConfigField = this.page.add_field({
            label: 'Map Config',
            fieldtype: 'Link',
            fieldname: 'map_config',
            options: "Map View Configuration",
            async change() {
                const mapConfigName = mapsConfigField.get_value();
                if (mapConfigName) {
                    const config = await frappe.db.get_doc("Map View Configuration", mapConfigName);
                    me.config = config;
                    setOtherFields(config, page);
                }
            }
        });

        let parentField = page.add_field({
            label: "Parent",
            fieldtype: 'Link',
            fieldname: 'parent',
            options: "Doctype",
            async change() {
                await updateChildValuesWithFilters();
            }
        });

        let startDateField = page.add_field({
            label: "Start Date",
            fieldtype: 'Date',
            fieldname: 'start_date',
            async change() {
                await updateChildValuesWithFilters();
            }
        });

        let endDateField = page.add_field({
            label: "End Date",
            fieldtype: 'Date',
            fieldname: 'end_date',
            async change() {
                await updateChildValuesWithFilters();
            }
        });

        // let stateField = page.add_field({
        //     label: "State",
        //     fieldtype: 'Select',
        //     fieldname: 'state',
        //     options: ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        //     async change() {
        //         await updateChildValuesWithFilters();
        //         await me.highlightStateOrCity(stateField.get_value(), 'state');
        //         // await me.highlightStateOrCity('Haryana', 'state');
        //     }
        // });

        // let cityField = page.add_field({
        //     label: "City",
        //     fieldtype: 'Select',
        //     fieldname: 'city',
        //     options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat"],  // Add more cities as needed
        //     async change() {
        //         await updateChildValuesWithFilters();
        //         await me.highlightStateOrCity(cityField.get_value(), 'city');
        //     }
        // });

        async function updateChildValuesWithFilters() {
            const parent_reference_field = me.config.parent_reference_field;
            let payload = {};

            if (me.config.search_type == "Link Field") {
                payload[parent_reference_field] = parentField.get_value();
            } else if (me.config.search_type == "Dynamic Link") {
                payload[me.config.parent_reference_type_field] = me.config.parent_doctype;
                payload[parent_reference_field] = parentField.get_value();
            } else if (me.config.search_type == "Child Table") {
                payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()]];
            } else if (me.config.search_type == "Child Table Dynamic Link") {
                payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()], [me.config.child_table_name, me.config.parent_reference_type_field, "=", me.config.parent_doctype]];
            }

            const startDate = startDateField.get_value();
            const endDate = endDateField.get_value();

            if (startDate && endDate) {
                payload["creation"] = ["between", [`${startDate} 00:00:00`, `${endDate} 23:59:59`]];
            }

            const fields = ["name", me.config.child_latitude_field, me.config.child_longitude_field, me.config.color_coding_field].filter(i => i != null);

            me.config.display_fields.forEach(i => {
                if (!fields.includes(i.field_name) && i.source == "Child") {
                    fields.push(i.field_name);
                }
            });

            console.log("FIELDS: ", fields);
            console.log("FILTERS: ", payload);

            const childList = await frappe.db.get_list(me.config.child_doctype, { filters: payload, fields: fields });
            console.log("CHILDLIST: ", childList);
            const parsedChildList = childList.filter(i => (i[me.config.child_latitude_field] && i[me.config.child_longitude_field]));
            await me.updateChildValues(parsedChildList);
        }

        function setOtherFields(config, page) {
            parentField.df.label = config.parent_doctype;
            parentField.df.options = config.parent_doctype;
            // parentField.df.read_only = 0
        }
    }

    async prepareMapsContainer() {
        // create sidebar element
        const container = document.createElement("div");
        container.id = "main-maps-container";
        container.className = "mt-3 p-3 border rounded";
        container.style.height = "75vh";
        return container;
    }
}

frappe.provide("frappe.mapsviewbuilder");
frappe.mapsviewbuilder.MapsViewBuilder = MapsViewBuilder;


// class MapsViewBuilder {
//     constructor(page, wrapper) {
//         if (!page || !wrapper) {
//             throw ("page and wrapper object is required to init MapsViewBuilder")
//         }
//         this.page = page;
//         this.wrapper = wrapper;
//         this.createMainPage()
//     }
//     async createMainPage() {
//         // add sidebar menu and form
//         await this.prepareForm()
//         const container = await this.prepareMapsContainer()
//         this.page.container.append(container)
//         await this.createMap()
//     }

//     async createMap() {
//         this.map = L.map('main-maps-container').setView([28.429411, 77.312271], 13);
//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(this.map);
//         const mapPane = document.querySelector(".leaflet-map-pane")
//         mapPane.style["z-index"] = 1
//         try {
//             navigator.geolocation.getCurrentPosition((currentLocation) => {
//                 const currentLatLong = [currentLocation.coords.latitude, currentLocation.coords.longitude];
//                 this.map.setView(currentLatLong, 13)
//             })
//         } catch (e) {
//             console.error("UNABLE TO GET CURRENT LOCATION: ", e)
//         }
//     }

//     generateUI(data, displayFields, parentData) {
//         // Create a container div for the UI
//         const container = document.createElement('div');

//         // Loop through display fields metadata
//         displayFields.forEach(field => {
//             // Check if the field name exists in the data
//             if (field.field_name in data || field.field_name in parentData) {
//                 // Create a label element
//                 const label = document.createElement('label');
//                 label.textContent = field.field_label + ': ';
//                 label.style.fontWeight = "bold"

//                 // Create a span element to display the field value
//                 const valueSpan = document.createElement('span');
//                 valueSpan.textContent = field.source == "Parent" ? parentData[field.field_name] : data[field.field_name];

//                 // Create a line break element for better spacing
//                 const lineBreak = document.createElement('br');

//                 // Append label, value span, and line break to the container
//                 container.appendChild(label);
//                 container.appendChild(valueSpan);
//                 container.appendChild(lineBreak);
//             }
//         });

//         // Return the generated container node
//         return container;
//     }

//     async updateChildValues(values) {
//         console.log("VALUES: ", values)
//         const color_coding_field = this.config.color_coding_field
//         const color_codings = this.config.color_codings


//         this.map.eachLayer((layer) => {
//             this.map.removeLayer(layer);
//         });

//         L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//             maxZoom: 20,
//             attribution:
//                 '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//         }).addTo(this.map);

//         let mapVIewCHanged = false;

//         values.forEach(child => {
//             const generatedUIChild = this.generateUI(child, this.config.display_fields, {})
//             console.log("GENERATED UI: ", generatedUIChild)
//             let color = color_codings.filter(i => i.value == child[color_coding_field])
//             if (color.length > 0) {
//                 color = color[0].color
//             } else {
//                 color = "#000"
//             }
//             const lat = child[this.config.child_latitude_field];
//             const long = child[this.config.child_longitude_field]
//             if (!mapVIewCHanged) {
//                 this.map.setView(
//                     [
//                         lat,
//                         long,
//                     ],
//                     13
//                 );
//                 mapVIewCHanged = true
//             }
//             const markerHtmlStyles = `
//                 background-color: ${color};
//                 width: 1.5rem;
//                 height: 1.5rem;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 display: block;
//                 left: -1.5rem;
//                 top: -1.5rem;
//                 position: relative;
//                 border-radius: 3rem 3rem 0;
//                 transform: rotate(45deg);
//                 border: 1px solid #FFFFFF`;

//             const icon = L.divIcon({
//                 className: "my-custom-pin",
//                 iconAnchor: [0, 24],
//                 labelAnchor: [-6, 0],
//                 popupAnchor: [0, -36],
//                 html: `<span style="${markerHtmlStyles}"><span style="width:0.8rem;height:0.8rem;background-color:white;display:block;border-radius:50%;margin-top:0.3rem;margin-left:0.3rem"></span></span>`,
//             });

//             L.marker(
//                 [
//                     lat,
//                     long,
//                 ],
//                 {
//                     title: child["name"],
//                     icon: icon,
//                 }
//             )
//                 .addTo(this.map)
//                 .bindPopup(generatedUIChild);
//         })

//     }

//     // async loadGeoJSON(url) {
//     //     const response = await fetch(url);
//     //     if (!response.ok) {
//     //         throw new Error('Network response was not ok' + response.statusText);
//     //     }
//     //     const data = await response.json();
//     //     return data;
//     // }
    
//     // async addGeoJSONLayer(url, style) {
//     //     const data = await this.loadGeoJSON(url);
//     //     const layer = L.geoJSON(data, { style: style }).addTo(this.map);
//     //     return layer;
//     // }
    

//     // async highlightStateOrCity(name, type) {
//     //     let url, style;
        
//     //     if (type === 'state') {
//     //         url = '/home/extension/frappe-bench/apps/eventmap/eventmap/public/js/state/india_state.geojson';
//     //         style = (feature) => {
//     //             return {
//     //                 fillColor: feature.properties.NAME_1 === name ? 'red' : 'transparent',
//     //                 weight: 2,
//     //                 opacity: 1,
//     //                 color: 'white',
//     //                 dashArray: '3',
//     //                 fillOpacity: 0.7
//     //             };
//     //         };
//     //         if (this.stateLayer) this.map.removeLayer(this.stateLayer);
//     //         this.stateLayer = await this.addGeoJSONLayer(url, style);
//     //     } else if (type === 'city') {
//     //         url = '/home/extension/frappe-bench/apps/eventmap/eventmap/public/js/district/india_district.geojson';
//     //         style = (feature) => {
//     //             return {
//     //                 fillColor: feature.properties.NAME_2 === name ? 'blue' : 'transparent',
//     //                 weight: 2,
//     //                 opacity: 1,
//     //                 color: 'white',
//     //                 dashArray: '3',
//     //                 fillOpacity: 0.7
//     //             };
//     //         };
//     //         if (this.cityLayer) this.map.removeLayer(this.cityLayer);
//     //         this.cityLayer = await this.addGeoJSONLayer(url, style);
//     //     }
//     // }

//     async prepareForm() {
//         const page = this.page;
//         const me = this;

//         let mapsConfigField = this.page.add_field({
//             label: 'Map Config',
//             fieldtype: 'Link',
//             fieldname: 'map_config',
//             options: "Map View Configuration",
//             async change() {
//                 const mapConfigName = mapsConfigField.get_value();
//                 if (mapConfigName) {
//                     const config = await frappe.db.get_doc("Map View Configuration", mapConfigName);
//                     me.config = config;
//                     setOtherFields(config, page);
//                 }
//             }
//         });
    
//         let parentField = page.add_field({
//             label: "Parent",
//             fieldtype: 'Link',
//             fieldname: 'parent',
//             options: "Doctype",
//             async change() {
//                 await updateChildValuesWithFilters();
//             }
//         });
    
//         let startDateField = page.add_field({
//             label: "Start Date",
//             fieldtype: 'Date',
//             fieldname: 'start_date',
//             async change() {
//                 await updateChildValuesWithFilters();
//             }
//         });
    
//         let endDateField = page.add_field({
//             label: "End Date",
//             fieldtype: 'Date',
//             fieldname: 'end_date',
//             async change() {
//                 await updateChildValuesWithFilters();
//             }
//         });

//         let stateField = page.add_field({
//             label: "State",
//             fieldtype: 'Select',
//             fieldname: 'state',
//             options: ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
//             async change() {
//                 await updateChildValuesWithFilters();
//                 await me.highlightStateOrCity(stateField.get_value(), 'state');
//             }
//         });
        
//         let cityField = page.add_field({
//             label: "City",
//             fieldtype: 'Select',
//             fieldname: 'city',
//             options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat"],  // Add more cities as needed
//             async change() {
//                 await updateChildValuesWithFilters();
//                 await me.highlightStateOrCity(cityField.get_value(), 'city');
//             }
//         });
               
        

//         async function updateChildValuesWithFilters() {
//             const parent_reference_field = me.config.parent_reference_field;
//             let payload = {};
    
//             if (me.config.search_type == "Link Field") {
//                 payload[parent_reference_field] = parentField.get_value();
//             } else if (me.config.search_type == "Dynamic Link") {
//                 payload[me.config.parent_reference_type_field] = me.config.parent_doctype;
//                 payload[parent_reference_field] = parentField.get_value();
//             } else if (me.config.search_type == "Child Table") {
//                 payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()]];
//             } else if (me.config.search_type == "Child Table Dynamic Link") {
//                 payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()], [me.config.child_table_name, me.config.parent_reference_type_field, "=", me.config.parent_doctype]];
//             }
    
//             const startDate = startDateField.get_value();
//             const endDate = endDateField.get_value();
            
    
//             if (startDate && endDate) {
//                 payload["creation"] = ["between", [`${startDate} 00:00:00`, `${endDate} 23:59:59`]];
//             }

//             const fields = ["name", me.config.child_latitude_field, me.config.child_longitude_field, me.config.color_coding_field].filter(i => i != null);
    
//             me.config.display_fields.forEach(i => {
//                 if (!fields.includes(i.field_name) && i.source == "Child") {
//                     fields.push(i.field_name);
//                 }
//             });
    
//             console.log("FIELDS: ", fields);
//             console.log("FILTERS: ", payload);
    
//             const childList = await frappe.db.get_list(me.config.child_doctype, { filters: payload, fields: fields });
//             console.log("CHILDLIST: ", childList);
//             const parsedChildList = childList.filter(i => (i[me.config.child_latitude_field] && i[me.config.child_longitude_field]));
//             await me.updateChildValues(parsedChildList);
//         }


//         function setOtherFields(config, page) {
//             parentField.df.label = config.parent_doctype
//             parentField.df.options = config.parent_doctype
//             // parentField.df.read_only = 0
//         }
//     }

//     async prepareMapsContainer() {
//         // create sidebar element
//         const container = document.createElement("div")
//         container.id = "main-maps-container"
//         container.className = "mt-3 p-3 border rounded"
//         container.style.height = "75vh"
//         return container
//     }
// }

// frappe.provide("frappe.mapsviewbuilder")
// frappe.mapsviewbuilder.MapsViewBuilder = MapsViewBuilder


// let mapsConfigField = this.page.add_field({
        //     label: 'Map Config',
        //     fieldtype: 'Link',
        //     fieldname: 'map_config',
        //     options: "Map View Configuration",
        //     async change() {
        //         const mapConfigName = mapsConfigField.get_value()
        //         if (mapConfigName) {
        //             const config = await frappe.db.get_doc("Map View Configuration", mapConfigName)
        //             me.config = config;
        //             setOtherFields(config, page);
        //         }
        //     }
        // });

        // let parentField = page.add_field({
        //     label: "Parent",
        //     fieldtype: 'Link',
        //     fieldname: 'map_config',
        //     options: "Doctype",
        //     async change() {
        //         const parent_reference_field = me.config.parent_reference_field
        //         let payload = {}
        //         if (me.config.search_type == "Link Field") {
        //             payload[parent_reference_field] = parentField.get_value()
        //         } else if (me.config.search_type == "Dynamic Link") {
        //             payload[me.config.parent_reference_type_field] = me.config.parent_doctype
        //             payload[parent_reference_field] = parentField.get_value()
        //         } else if (me.config.search_type == "Child Table") {
        //             payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()]]
        //         } else if (me.config.search_type == "Child Table Dynamic Link") {
        //             payload = [[me.config.child_table_name, me.config.parent_reference_field, "=", parentField.get_value()], [me.config.child_table_name, me.config.parent_reference_type_field, "=", me.config.parent_doctype]]
        //         }

        //         const fields = ["name", me.config.child_latitude_field, me.config.child_longitude_field, me.config.color_coding_field].filter(i => i != null);

        //         me.config.display_fields.forEach(i => {
        //             if (!fields.includes(i.field_name) && i.source == "Child") {
        //                 fields.push(i.field_name)
        //             }
        //         })

        //         console.log("FIELDS: ", fields)
        //         console.log("FILTERS: ", payload)

        //         const childList = await frappe.db.get_list(me.config.child_doctype, { filters: payload, fields: fields })
        //         console.log("CHILDLIST: ", childList)
        //         const parsedChildList = childList.filter(i => (i[me.config.child_latitude_field] && i[me.config.child_latitude_field]));
        //         await me.updateChildValues(parsedChildList)
        //     }
        // });