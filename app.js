const carData = [
    { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
    { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
    { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
    { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
    { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
    { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
    { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

class App {
    constructor() {
        this.makeList = null;
        this.modelList = null;
        this.priceList = null;
        this.yearList = null;
        this.setCarOptionLists();
        this.populateFilterOptions();
        this.displayCars();
        this.bindEvents();
    }

    displayCars(cars = carData) {
        $(document).ready(() => {
            $("#cars").empty();
            let carTemplate = Handlebars.compile($("#car-template").html());
            cars.forEach(car => {
                let carInfo = carTemplate(car);
                $("#cars").append(carInfo);
            });
        });
    }

    bindEvents() {
        $(document).ready(() => {
            $("form").on("submit", this.handleFilterSubmit.bind(this));
            $("#make").on("click", this.filterModelOptions.bind(this));
        });
    }

    filterModelOptions(event) {
        let make = $("#make :checked").val();
        let $modelSelect = $("#model");

        this.resetModelSelect($modelSelect);
        if (make === "all") {
            this.modelList.forEach(model => this.setFilterOptions(model, $modelSelect));
        } else if (this.makeList.includes(make)) {
            let filteredCars = carData.filter(car => car.make === make);
            let filteredModels = filteredCars
                .map(car => car.model)
                .filter((model, index, thisArr) => thisArr.indexOf(model) === index);

            filteredModels.forEach(model => this.setFilterOptions(model, $modelSelect));
        }
    }

    handleFilterSubmit(event) {
        event.preventDefault();
        let options = Array.prototype.slice.call($("option:checked"));
        let filters = options
            .map(option => option.innerHTML)
            .filter(option => {
                if (option !== "All" && option !== "Any") {
                    return option;
                }
            });

        let filteredCars = this.filteredCars(filters);
        this.displayCars(filteredCars);
    }

    resetModelSelect($modelSelect) {
        $modelSelect.empty();

        let allOption = $(document.createElement("option"));
        allOption.attr("value", "all");
        allOption.html("All");

        $modelSelect.append(allOption);
    }

    filteredCars(filters) {
        let filteredCars = this.deepCopy(carData);

        filters.forEach(filter => {
            filteredCars = filteredCars.filter(car => {
                if (Object.values(car).includes(filter) || Object.values(car).includes(+filter)) {
                    return car;
                }
            });
        });
        return filteredCars;
    }

    populateFilterOptions() {
        $(document).ready(() => {
            let $selects = $("select");

            for (let i = 0; i < $selects.length; i++) {
                let $currentSelect = $($selects[i]);

                switch ($currentSelect.attr("id")) {
                    case "make":
                        this.makeList.forEach(make => this.setFilterOptions(make, $currentSelect));
                        break;
                    case "model":
                        this.modelList.forEach(model => this.setFilterOptions(model, $currentSelect));
                        break;
                    case "price":
                        this.priceList.forEach(price => this.setFilterOptions(price, $currentSelect));
                        break;
                    case "year":
                        this.yearList.forEach(year => this.setFilterOptions(year, $currentSelect));
                        break;
                }
            }
        });
    }

    setFilterOptions(value, $currentSelect) {
        let newOption = $(document.createElement("option"));
        newOption.html(value);
        $currentSelect.append(newOption);
    }

    setCarOptionLists() {
        this.makeList = carData
            .map(car => car.make)
            .filter((make, index, thisArr) => thisArr.indexOf(make) === index);
        this.modelList = carData
            .map(car => car.model)
            .filter((model, index, thisArr) => thisArr.indexOf(model) === index);
        this.priceList = carData.map(car => car.price).sort((a, b) => a - b);
        this.yearList = carData.map(car => car.year).sort((a, b) => a - b);
    }

    deepCopy(inObject) {
        let outObject, value, key;

        if (typeof inObject !== "object" || inObject === null) {
            return inObject; // Return the value if inObject is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {};

        for (key in inObject) {
            value = inObject[key];

            // Recursively (deep) copy for nested objects, including arrays
            outObject[key] = this.deepCopy(value);
        }

        return outObject;
    };

}

let app = new App();