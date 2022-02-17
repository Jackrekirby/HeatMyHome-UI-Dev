console.log('index.js');

let system_order = ["electric-boiler", "air-source-heat-pump", "ground-source-heat-pump", "hydrogen-fuel-cell", "hydrogen-boiler", "biomass-boiler", "gas-boiler"];


let marker_names = ['circle', 'cross', 'diamond', 'downarrow', 'uparrow', 'square', 'star'];

let marker_images = [];
for (let [i, name] of marker_names.entries()) {
    marker_images[i] = new Image(8, 8);
    marker_images[i].src = `./markers/${name}-black.png`
}

console.log(marker_images);

const data = {
    datasets: [{
        label: system_order[0],
        data: [{
            x: -10,
            y: 0
        }, {
            x: 0,
            y: 10
        }, {
            x: 10,
            y: 15
        }, {
            x: 0.5,
            y: 5.5
        }, {
            x: -9.5,
            y: 12.5
        }, {
            x: -5.5,
            y: 0.5
        }, {
            x: 12.5,
            y: 5.9
        }],
        backgroundColor: 'red',
        borderColor: 'red',
        radius: 4,
        pointStyle: ['circle', 'cross', 'crossRot', 'rect', 'rectRot', 'triangle']
    }, {
        label: system_order[1],
        data: [{
            x: -12,
            y: 1
        }, {
            x: 3,
            y: 7
        }, {
            x: 6,
            y: 20
        }, {
            x: 2.5,
            y: 8.5
        }, {
            x: -4.5,
            y: 7.5
        }, {
            x: -7.5,
            y: 5.5
        }, {
            x: 3.5,
            y: 0.9
        }],
        backgroundColor: 'orange',
        borderColor: 'orange',
        radius: 4,
        pointStyle: ['circle', 'cross', 'crossRot', 'rect', 'rectRot', 'triangle']
    }, {
        label: system_order[2],
        data: [{
            x: -10,
            y: 12
        }, {
            x: 3.6,
            y: 4.5
        }, {
            x: 9.8,
            y: 0.2
        }, {
            x: 0.56,
            y: 3.3
        }, {
            x: -6.5,
            y: 9.5
        }, {
            x: -2.5,
            y: 16.5
        }, {
            x: 11.5,
            y: 14.9
        }],
        backgroundColor: 'green',
        borderColor: 'green',
        radius: 4,
        pointStyle: ['circle', 'cross', 'crossRot', 'rect', 'rectRot', 'triangle']
    }, {
        label: system_order[3],
        data: [{
            x: -4.4,
            y: 12
        }, {
            x: 3.6,
            y: 18.5
        }, {
            x: 5.8,
            y: 7.2
        }],
        backgroundColor: 'blue',
        borderColor: 'blue',
        radius: 4,
        pointStyle: ['rect', 'circle', 'triangle']
    }, {
        label: system_order[4],
        data: [{
            x: -7.4,
            y: 18
        }, {
            x: 5.6,
            y: 12.5
        }, {
            x: 9.8,
            y: 2.2
        }],
        backgroundColor: 'indigo',
        borderColor: 'indigo',
        radius: 4,
        pointStyle: ['rect', 'circle', 'triangle']
    }, {
        label: system_order[5],
        data: [{
            x: -1.4,
            y: 19.0
        }],
        backgroundColor: 'violet',
        borderColor: 'violet',
        radius: 4,
        pointStyle: 'circle'
    }, {
        label: system_order[6],
        data: [{
            x: 16.4,
            y: 16.0
        }],
        backgroundColor: 'black',
        borderColor: 'black',
        radius: 4,
        pointStyle: 'circle'
    }],
};


let config = {
    type: 'scatter',
    data: data,
    options: {
        elements: {
            point: {
                pointStyle: 'circle',
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Upfront Cost (£)',
                    font: {
                        size: 14,
                        family: 'Sora'
                    }
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Sora'
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Yearly Emissions (kgCO2eq/yr)',
                    font: {
                        size: 14,
                        family: 'Sora'
                    }
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Sora'
                    }
                }
            }
        },
        aspectRatio: 1,
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 20
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        console.log(context);
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        // return label;
                        console.log(Object.keys(output.systems[context.dataset.label]), context.dataIndex)
                        return `${context.dataset.label}, ${Object.keys(output.systems[context.dataset.label])[context.dataIndex]}`
                    }
                },
                usePointStyle: true
            }
        }
    }
};

config.options.animation = {
    numbers: { duration: 0 },
    colors: {
        type: "color",
        duration: 1000,
        from: "transparent",
    }
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, config);

let data_copy = { ...data };
let last_id = -1;
function set_heat_option(id) {
    if (id == last_id) {
        data.datasets = data_copy.datasets;
    } else {
        data.datasets = [data_copy.datasets[id]];
    }
    myChart.update();
    document.getElementsByClassName('btn')[id].classList.add('active');
    if (last_id >= 0) {
        document.getElementsByClassName('btn')[last_id].classList.remove('active');
    }
    if (id == last_id) {
        last_id = -1;
    } else {
        last_id = id;
    }
}

const output = {
    "demand": {
        "boiler": {
            "hot-water": 1460.07,
            "space": 1515.96,
            "total": 2976.03,
            "peak-hourly": 8.36874
        },
        "heat-pump": {
            "hot-water": 1460.07,
            "space": 1552.12,
            "total": 3012.19,
            "peak-hourly": 1.56076
        }
    },
    "systems": {
        "electric-boiler": {
            "none": {
                "pv-size": 0,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 232.091,
                "capital-expenditure": 678.913,
                "net-present-cost": 4092.94,
                "operational-emissions": 644775
            },
            "photovoltaic": {
                "pv-size": 14,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -35.5481,
                "capital-expenditure": 3758.91,
                "net-present-cost": 3236.01,
                "operational-emissions": 214478
            },
            "flat-plate": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 173.86,
                "capital-expenditure": 3256.41,
                "net-present-cost": 5813.87,
                "operational-emissions": 507729
            },
            "evacuated-tube": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 157.84,
                "capital-expenditure": 3366.41,
                "net-present-cost": 5688.21,
                "operational-emissions": 463252
            },
            "flat-plate-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -39.0105,
                "capital-expenditure": 5896.41,
                "net-present-cost": 5322.57,
                "operational-emissions": 182792
            },
            "evacuated-tube-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -64.4958,
                "capital-expenditure": 6006.41,
                "net-present-cost": 5057.69,
                "operational-emissions": 115537
            },
            "photovoltaic-thermal-hybrid": {
                "pv-size": 4,
                "solar-thermal-size": 4,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 102.037,
                "capital-expenditure": 5323.91,
                "net-present-cost": 6824.87,
                "operational-emissions": 364656
            }
        },
        "air-source-heat-pump": {
            "none": {
                "pv-size": 0,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 79.5922,
                "capital-expenditure": 6237.67,
                "net-present-cost": 7408.46,
                "operational-emissions": 232146
            },
            "photovoltaic": {
                "pv-size": 14,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -197.882,
                "capital-expenditure": 9317.67,
                "net-present-cost": 6406.86,
                "operational-emissions": -182272
            },
            "flat-plate": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 58.3877,
                "capital-expenditure": 8815.17,
                "net-present-cost": 9674.04,
                "operational-emissions": 191942
            },
            "evacuated-tube": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 52.8353,
                "capital-expenditure": 8925.17,
                "net-present-cost": 9702.37,
                "operational-emissions": 178927
            },
            "flat-plate-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -171.235,
                "capital-expenditure": 11455.2,
                "net-present-cost": 8936.33,
                "operational-emissions": -153667
            },
            "evacuated-tube-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -186.652,
                "capital-expenditure": 11565.2,
                "net-present-cost": 8819.54,
                "operational-emissions": -177541
            },
            "photovoltaic-thermal-hybrid": {
                "pv-size": 2,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 37.9702,
                "capital-expenditure": 10245.2,
                "net-present-cost": 10803.7,
                "operational-emissions": 158842
            }
        },
        "ground-source-heat-pump": {
            "none": {
                "pv-size": 0,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 53.459,
                "capital-expenditure": 7937.67,
                "net-present-cost": 8724.04,
                "operational-emissions": 154280
            },
            "photovoltaic": {
                "pv-size": 14,
                "solar-thermal-size": 0,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -247.103,
                "capital-expenditure": 11017.7,
                "net-present-cost": 7382.83,
                "operational-emissions": -260026
            },
            "flat-plate": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 39.7321,
                "capital-expenditure": 10515.2,
                "net-present-cost": 11099.6,
                "operational-emissions": 134456
            },
            "evacuated-tube": {
                "pv-size": 0,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 36.1047,
                "capital-expenditure": 10625.2,
                "net-present-cost": 11156.3,
                "operational-emissions": 128096
            },
            "flat-plate-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -211.235,
                "capital-expenditure": 13155.2,
                "net-present-cost": 10047.9,
                "operational-emissions": -216005
            },
            "evacuated-tube-and-photovoltaic": {
                "pv-size": 12,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": -223.614,
                "capital-expenditure": 13265.2,
                "net-present-cost": 9975.85,
                "operational-emissions": -229065
            },
            "photovoltaic-thermal-hybrid": {
                "pv-size": 2,
                "solar-thermal-size": 2,
                "thermal-energy-storage-volume": 0.1,
                "operational-expenditure": 19.2099,
                "capital-expenditure": 11945.2,
                "net-present-cost": 12227.7,
                "operational-emissions": 101650
            }
        },
        "hydrogen-boiler": {
            "grey": {
                "operational-expenditure": 162.028,
                "capital-expenditure": 2120,
                "net-present-cost": 4503.41,
                "operational-emissions": 1263160
            },
            "blue": {
                "operational-expenditure": 307.523,
                "capital-expenditure": 2120,
                "net-present-cost": 6643.61,
                "operational-emissions": 198402
            },
            "green": {
                "operational-expenditure": 608.432,
                "capital-expenditure": 2120,
                "net-present-cost": 11069.9,
                "operational-emissions": 1314410
            }
        },
        "hydrogen-fuel-cell": {
            "grey": {
                "operational-expenditure": 157.018,
                "capital-expenditure": 25157.8,
                "net-present-cost": 27467.5,
                "operational-emissions": 1224100
            },
            "blue": {
                "operational-expenditure": 298.015,
                "capital-expenditure": 25157.8,
                "net-present-cost": 29541.6,
                "operational-emissions": 192267
            },
            "green": {
                "operational-expenditure": 589.62,
                "capital-expenditure": 25157.8,
                "net-present-cost": 33831,
                "operational-emissions": 1273770
            }
        },
        "gas-boiler": {
            "operational-expenditure": 132.268,
            "capital-expenditure": 1620,
            "net-present-cost": 3565.64,
            "operational-emissions": 605126
        },
        "biomass-boiler": {
            "operational-expenditure": 135.905,
            "capital-expenditure": 9750,
            "net-present-cost": 11749.1,
            "operational-emissions": 297603
        }
    }
}



// data.datasets[0].data[0].x
// output.systems["electric-boiler"].none["net-present-cost"]
document.getElementById("y-param").selectedIndex = 1;
function plot_data() {
    let x_select = document.getElementById("x-param");
    let x_param = x_select.options[x_select.selectedIndex].value;
    console.log("x-param: ", x_param);

    let y_select = document.getElementById("y-param");
    let y_param = y_select.options[y_select.selectedIndex].value;
    console.log("y-param: ", y_param);

    const axes_label_map = {
        'capital-expenditure': "Upfront Cost (£1000's)",
        'operational-expenditure': "Yearly Cost (£'s)",
        'net-present-cost': "Lifetime Cost (£1000's)",
        'operational-emissions': "Yearly Emissions (tonnesCO2eq)",
    }

    const divisor_map = {
        'capital-expenditure': 1000,
        'operational-expenditure': 1,
        'net-present-cost': 1000,
        'operational-emissions': 1000000,
    }

    let x_divisor = divisor_map[x_param];
    let y_divisor = divisor_map[y_param];

    myChart.options.scales.x.title.text = axes_label_map[x_param];
    myChart.options.scales.y.title.text = axes_label_map[y_param];
    let j = 0;
    for (const key1 of system_order) {
        let value1 = output.systems[key1];
        let i = 0;
        if (key1 == "biomass-boiler" || key1 == "gas-boiler") {
            data_copy.datasets[j].data[i].x = value1[x_param] / x_divisor;
            data_copy.datasets[j].data[i].y = value1[y_param] / y_divisor;
        } else {
            for (const [key, value] of Object.entries(value1)) {
                // console.log(`${key}: ${value}`);
                data_copy.datasets[j].data[i].x = value[x_param] / x_divisor;
                data_copy.datasets[j].data[i].y = value[y_param] / y_divisor;
                i = i + 1;
            }
        }
        j = j + 1;
    }

    if (last_id == -1) {
        data.datasets = data_copy.datasets;
    } else {
        data.datasets = [data_copy.datasets[last_id]];
    }

    myChart.update();

}

plot_data();