const fs = require('fs');
const csv = require('csv-parser');
const util = require('util');


async function main(){
    input_path = "/Users/hayden/PycharmProjects/Indeed Job Posting Scraper/titles_and_ratings-indeed_remote_entry-level_python_bachelors-10_1_23.csv";
    all_data = await read_data_from_csv(input_path);
    print(all_data);
}

function split_training_and_test_data(data){
    pass;
}

async function read_data_from_csv(input_path){
    console.log("Hello World");
    let data = []
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

function print(input){
    console.log(util.inspect(input, { depth: null }))
}


/*
function parseCSV(filePath) {
    let results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            // The "results" array now contains the CSV data as objects
            return results;
            //console.log(util.inspect(results, { depth: null }));
        });
}
*/







main();
