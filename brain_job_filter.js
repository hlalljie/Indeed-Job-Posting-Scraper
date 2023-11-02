const fs = require('fs');
const csv = require('csv-parser');
const util = require('util');
const { default: test } = require('node:test');
const brain = require('brain.js');




async function main(){
    var start = Date.now();
    console.log("Rating Jobs");

    input_path = "titles_and_ratings-indeed_remote_entry-level_python_bachelors-10_1_23.csv";
    output_path = "rated_test_output.csv";
    
    //printObjList(all_data);
    console.log("\nReading Dataset from CSV...");
    //let all_data = getTestSet();
    let all_data = await read_data_from_csv(input_path);
    console.log("Dataset Read. Dataset size:", all_data.length)
    //console.log("List Before:");
    //printObjList(testSet);

    console.log("\nRandomizing Dataset...");
    let randomized_list = randomizeList([...all_data]);
    console.log("Dataset Randomized");
    //printObjList(randomized_list);

    console.log("\nSpliting Dataset into Training and Test Sets...");
    let split_data = splitTrainingAndTestData(randomized_list, .8);
    console.log("Dataset split.", split_data.training.length, "Training Datapoints.", split_data.test.length, "Test Datapoints.");
    //console.log("Training Data:")
    //printObjList(split_data.training);
    //console.log("Test Data:")
    //printObjList(split_data.test);

    let network = new brain.recurrent.LSTM();   

    
    console.log("Training...");
    trainBrain(network, split_data.training);
    console.log("Training Complete");


    console.log("\nTesting...");
    result = testBrain(network, split_data.test);
    console.log("Testing Complete.");
    
    console.log("Test Results:");
    printObjList(result);
    

    console.log("\nWriting Reslts to CSV...");
    writeDataToCSV(result, output_path);
    console.log("Results Recorded to", output_path);
    
    var end= Date.now();
    let elapsedTime = Math.floor((end-start)/1000);
    
    console.log("\nExecution time:", formatTime(elapsedTime));

}


function formatTime(time){
    let timeStr = "";
    let hours = 0;
    let minutes = 0;
    let second = 0;
    if (time >= 3600){
        timeStr += Math.floor(time / 3600).toString() + " hours, ";
        time = time % 3600;
    }
    if (time >= 60){
        timeStr += Math.floor(time / 60).toString() + " minutes, ";
        time = time % 60;
    }
    timeStr += time.toString() + " seconds";
    
    return timeStr;
}

function writeDataToCSV(itemsArray, output_path){
    let csvString = [
        [
          "id",
          "job-title",
          "title-rating",
          //"brainjs-rating",
        ],
        ...itemsArray.map(item => [
          item["id"],
          item["job-title"],
          item["title-rating"],
          //item["brainjs-rating"]
        ])
    ]
    .map(e => e.join(","))
    .join("\n");

    //console.log(csvString);
    try {
        fs.writeFileSync(output_path, csvString);
        // file written successfully
      } catch (err) {
        console.error(err);
      }

}

function testBrain(network, testData){
    let testedData = [];
    for (let data_point of testData){
        let result = network.run(data_point["job-title"]);
        testedData.push({
            "id": data_point["id"], 
            "job-title": data_point["job-title"], 
            "title-rating": data_point["title-rating"], 
            "brainjs-rating": result
        });
    }
    return testedData;

    
}

function trainBrain(network, training_list){
    let training_data = [];
    for (item of training_list){
        let data_point = { input: item["job-title"], output: [parseInt(item["title-rating"])] };
        training_data.push(data_point);
    }
    //console.log(util.inspect(training_data, { depth: null }));

    network.train(training_data);
    return network;
}

//Training ratio between 0 and 1
function splitTrainingAndTestData(data, training_ratio){
    
    let split_data = {};

    let training_size = Math.floor(data.length * training_ratio)
    let test_size = data.length - training_size;

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
