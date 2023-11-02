const fs = require('fs');
const csv = require('csv-parser');
const util = require('util');
const { default: test } = require('node:test');


async function main(){
    input_path = "/Users/hayden/PycharmProjects/Indeed Job Posting Scraper/titles_and_ratings-indeed_remote_entry-level_python_bachelors-10_1_23.csv";
    let all_data = await read_data_from_csv(input_path);
    //printObjList(all_data);

    //testSet= getTestSet();  
    //console.log("List Before:");
    //printObjList(test_list);
    let randomized_list = randomizeList([...all_data]);
    //console.log("\nList Randomized:");
    //printObjList(randomized_list);

    let split_data = splitTrainingAndTestData(randomized_list, .8);
    console.log("Training Data:")
    printObjList(split_data.training);
    console.log("Test Data:")
    printObjList(split_data.test);
}

//Training ratio between 0 and 1
function splitTrainingAndTestData(data, training_ratio){
    
    let split_data = {};
    console.log(data.length);

    let training_size = Math.floor(data.length * training_ratio)
    let test_size = data.length - training_size;

    console.log("Training size:", training_size, "Test size:", test_size);
    split_data["training"] = data.slice(0, training_size);
    split_data["test"] = data.slice(training_size);

    return split_data;
}

function randomizeList(list){
    let rand_list = [];
    for (let i = list.length -1; i >= 0; i--){
        let rand_index = Math.floor(Math.random() * (i+1));
        rand_list.push(list[rand_index]);
        list.splice(rand_index, 1);
    }
    return rand_list;
}

async function read_data_from_csv(input_path){
    let data = [];
    try {
        data = await parseCSV(input_path);
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return data;
}

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        const readStream = fs.createReadStream(filePath);

        readStream
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function printObjList(list){
    for (let obj of list){
        console.log(obj);
    }
    //console.log(util.inspect(input, { depth: null }))
}

function getTestSet(){
    return [
        { id: '5590e192f01ef4a8', 'job-title': "Remote Children's Technology Teacher - Coding", 'title-rating': '7'},
        { id: '24f625c9d9e47413', 'job-title': 'Software Engineer', 'title-rating': '8'},
        { id: '5449dcd71aab9d2b', 'job-title': 'Sports-Focused Accelerometer/IMU Algorithm Developer', 'title-rating': '6' },
        { id: '2a2d575a699b463e', 'job-title': 'Other Linux Engineering Team Opportunities', 'title-rating': '4'},
        { id: '8f5611b46d25b3a', 'job-title': 'Director of Informatics', 'title-rating': '1' },
        { id: 'ad354720dc2e13a6', 'job-title': 'Software Engineer', 'title-rating': '8' },
        { id: '60cbbc1cbbb76376', 'job-title': 'Software Developer', 'title-rating': '8' },
        { id: 'e53c56120a0f127d', 'job-title': 'Data science Training', 'title-rating': '8' },
        { id: 'b4f0e295972c4dcb', 'job-title': 'Data Engineer - Python', 'title-rating': '8' }
    ];
}







main();
