import L from "leaflet";

class MapsViewBuilder {
    constructor(page, wrapper) {
        if (!page || !wrapper) {
            throw ("page and wrapper object is required to init MapsViewBuilder");
        }
        this.page = page;
        this.wrapper = wrapper;
        this.selectedState = null;
        this.selectedCity = null;
        this.config = null;
        this.createMainPage();
    }

    async createMainPage() {
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

    async highlightStateOrCity(name, type) {
        if (!this.config) return;  // Ensure map config is selected

        if (type === 'state') {
            this.selectedState = name;
        } else if (type === 'city') {
            this.selectedCity = name;
        }

        if (this.selectedState && this.selectedCity) {
            await this.highlightBoth(this.selectedState, this.selectedCity);
        } else if (this.selectedState) {
            await this.highlightSingle(this.selectedState, 'state');
        } else if (this.selectedCity) {
            await this.highlightSingle(this.selectedCity, 'city');
        }
    }

    async highlightSingle(name, type) {
        let style, data;
        try {
            const response = await frappe.call({
                method: 'eventmap.api.get_data',
                args: {
                    name: name,
                    type: type
                }
            });

            if (response.message) {
                data = JSON.parse(response.message);

                if (data.error) {
                    console.error("Error:", data.error);
                    return;
                }

                style = (feature) => {
                    return {
                        fillColor: 'rgba(255, 0, 0, 0.5)',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                };

                if (this.stateLayer) {
                    this.map.removeLayer(this.stateLayer);
                }

                this.stateLayer = L.geoJSON(data, { style: style }).addTo(this.map);
                this.map.fitBounds(this.stateLayer.getBounds());
            } else {
                console.error("Error fetching data:", response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async highlightBoth(state, city) {
        const stateData = await this.fetchGeoJSONData(state, 'state');
        const cityData = await this.fetchGeoJSONData(city, 'city');

        const stateStyle = {
            fillColor: 'rgba(255, 0, 0, 0.5)',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };

        const cityStyle = {
            fillColor: 'rgba(0, 0, 255, 0.5)',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };

        if (this.stateLayer) {
            this.map.removeLayer(this.stateLayer);
        }
        if (this.cityLayer) {
            this.map.removeLayer(this.cityLayer);
        }

        this.stateLayer = L.geoJSON(stateData, { style: stateStyle }).addTo(this.map);
        this.cityLayer = L.geoJSON(cityData, { style: cityStyle }).addTo(this.map);

        const combinedBounds = this.stateLayer.getBounds().extend(this.cityLayer.getBounds());
        this.map.fitBounds(combinedBounds);
    }

    async fetchGeoJSONData(name, type) {
        try {
            const response = await frappe.call({
                method: 'eventmap.api.get_data',
                args: {
                    name: name,
                    type: type
                }
            });

            if (response.message) {
                const data = JSON.parse(response.message);
                if (data.error) {
                    console.error("Error:", data.error);
                    return null;
                }
                return data;
            } else {
                console.error("Error fetching data:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    async addGeoJSONLayer(url, style) {
        const data = await fetch(url).then(response => response.json());
        return L.geoJSON(data, { style: style }).addTo(this.map);
    }

    generateUI(data, displayFields, parentData) {
        const container = document.createElement('div');
        displayFields.forEach(field => {
            if (field.field_name in data || field.field_name in parentData) {
                const label = document.createElement('label');
                label.textContent = field.field_label + ': ';
                label.style.fontWeight = "bold";

                const valueSpan = document.createElement('span');
                valueSpan.textContent = field.source == "Parent" ? parentData[field.field_name] : data[field.field_name];

                const lineBreak = document.createElement('br');

                container.appendChild(label);
                container.appendChild(valueSpan);
                container.appendChild(lineBreak);
            }
        });
        return container;
    }

    async updateChildValues(values) {
        console.log("VALUES: ", values);
        const color_coding_field = this.config.color_coding_field;
        const color_codings = this.config.color_codings;

        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
                this.map.removeLayer(layer);
            }
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
                this.map.setView([lat, long], 13);
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

            L.marker([lat, long], {
                title: child["name"],
                icon: icon,
            })
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
                    me.clearHighlights();
                }
            }
        });

        let parentField = page.add_field({
            label: "Parent",
            fieldtype: 'Link',
            fieldname: 'parent',
            options: "Doctype",
            async change() {
                me.clearHighlights();
                stateField.set_value('');  // Clear state field value
                cityField.set_value('');   // Clear city field value
                await updateChildValuesWithFilters();
            }
        });

        let startDateField = page.add_field({
            label: "Start Date",
            fieldtype: 'Date',
            fieldname: 'start_date',
            async change() {
                me.clearHighlights();
                stateField.set_value('');  // Clear state field value
                cityField.set_value('');
                await updateChildValuesWithFilters();
            }
        });

        let endDateField = page.add_field({
            label: "End Date",
            fieldtype: 'Date',
            fieldname: 'end_date',
            async change() {
                me.clearHighlights();
                stateField.set_value('');  // Clear state field value
                cityField.set_value('');
                await updateChildValuesWithFilters();
            }
        });

        let stateField = page.add_field({
            label: "State",
            fieldtype: 'Link',
            fieldname: 'state',
            options: "State",
            async change() {
                const selectedState = stateField.get_value();
                cityField.set_value(''); // Clear city field value
        
                // Set the query for the cityField to filter based on the selected state
                cityField.get_query = function() {
                    return {
                        filters: {
                            state: selectedState
                        }
                    };
                };
        
                await updateChildValuesWithFilters();
                await me.highlightStateOrCity(selectedState, 'state');
            }
        });
        
        let cityField = page.add_field({
            label: "City",
            fieldtype: 'Link',
            fieldname: 'city',
            options: "State City",
            async change() {
                await updateChildValuesWithFilters();
                await me.highlightStateOrCity(cityField.get_value(), 'city');
            }
        });
        

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
        }
    }

    async prepareMapsContainer() {
        const container = document.createElement("div");
        container.id = "main-maps-container";
        container.className = "mt-3 p-3 border rounded";
        container.style.height = "75vh";
        return container;
    }

    clearHighlights() {
        if (this.stateLayer) {
            this.map.removeLayer(this.stateLayer);
        }
        if (this.cityLayer) {
            this.map.removeLayer(this.cityLayer);
        }
        this.selectedState = null;
        this.selectedCity = null;
    }
}

frappe.provide("frappe.mapsviewbuilder");
frappe.mapsviewbuilder.MapsViewBuilder = MapsViewBuilder;