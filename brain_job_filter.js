const fs = require('fs');
const csv = require('csv-parser');
const util = require('util');
const { default: test } = require('node:test');
const brain = require('brain.js');


async function main(){
    var start = Date.now();
    console.log("Rating Jobs");

    input_path = "titles_and_ratings-indeed_remote_entry-level_python_bachelors-10_1_23.csv";
    //output_path = "test_output.csv";
    output_path = "large_title_test_2.csv";
    
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
          "brainjs-rating",
        ],
        ...itemsArray.map(item => [
          item["id"],
          '"' + item["job-title"].toString() + '"',
          item["title-rating"],
          item["brainjs-rating"]
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
        { "id": '5590e192f01ef4a8', 'job-title': "Remote Children's Technology Teacher - Coding", 'title-rating': 7},
        { "id": '24f625c9d9e47413', 'job-title': 'Software Engineer', 'title-rating': 8},
        { "id": '5449dcd71aab9d2b', 'job-title': 'Sports-Focused Accelerometer/IMU Algorithm Developer', 'title-rating': 6 },
        { "id": '2a2d575a699b463e', 'job-title': 'Other Linux Engineering Team Opportunities', 'title-rating': 4},
        { "id": '8f5611b46d25b3a', 'job-title': 'Director of Informatics', 'title-rating': 1 },
        { "id": 'ad354720dc2e13a6', 'job-title': 'Software Engineer', 'title-rating': 8 },
        { "id": '60cbbc1cbbb76376', 'job-title': 'Software Developer', 'title-rating': 8 },
        { "id": 'e53c56120a0f127d', 'job-title': 'Data science Training', 'title-rating': 8 },
        { "id": 'b4f0e295972c4dcb', 'job-title': 'Data Engineer - Python', 'title-rating': 8 },
        { "id": '0d491e219ae37894', "job-title": 'Graduate BIM and Computational Designer, Summer 2024', "title-rating": 7}
    ];
}

function getOldDataSet(){
    return[
        {"id": '1733a1fd7a16e43d', "job-title": 'Metadata Specialist (Flex Hybrid)', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '0d491e219ae37894', "job-title": 'Graduate BIM and Computational Designer, Summer 2024', "title-rating": '7', "brainjs-rating": '6'},
        {"id": 'f4c4953f4e39967d', "job-title": 'Quantum Research Scientist', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '75ca69e37ff91083', "job-title": 'Development Test Engineer (Starlink)', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '21b1d9e25cde4b8', "job-title": 'Staff Research Associate II, Neurosurgery', "title-rating": '1', "brainjs-rating": '7'},
        {"id": '0bffc7bce317208e', "job-title": 'Parasitic Extraction QA Engineer (Remote)', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '8c0fbcaf4d6f15b', "job-title": 'Software Developer', "title-rating": '8', "brainjs-rating": '7'},
        {"id": '95e978ac4a9ac721', "job-title": 'Systems Administrator', "title-rating": '6', "brainjs-rating": '7'},
        {"id": 'e1c0e2bf0c6e69ea', "job-title": 'Prompt engineer', "title-rating": '8', "brainjs-rating": '7'},
        {"id": 'd7b494f7a1fbb2fd', "job-title": 'Actuarial Developer', "title-rating": '4', "brainjs-rating": '7'},
        {"id": '560cbf5def8c5f69',"job-title": 'Jr. Software Development Engineer',  "title-rating": '9', "brainjs-rating": '9'},
        {"id": 'be9b35ec254532e8', "job-title": 'Space Lasers Engineer (Starlink)', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '59f907be08bf5bc1', "job-title": 'iPhone Data Analysis Engineer', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '65004bac7047de3', "job-title": 'Cloud Engineer', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'fd26c3ccbd94157', "job-title": 'Associate Security Software Engineer', "title-rating": '3', "brainjs-rating": '7'},
        {"id": '1d0a296205f403e6', "job-title": 'Terraform Engineer', "title-rating": '1', "brainjs-rating": '7'},
        {"id": 'a50748bf8bce1bae', "job-title": 'Computational Biologist 1', "title-rating": '1', "brainjs-rating": '6'},
        {"id": 'a39aaa1147d05f37', "job-title": 'Geophysicist - Remote', "title-rating": '1', "brainjs-rating": '7'},
        {"id": '090c7b218f833ee', "job-title": 'AI Research Engineer', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '14046a38d5499fd8', "job-title": 'Data Analyst - TikTok Ecommerce Anti Fraud Solutions', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '17e044807620b19f', "job-title": 'Scenario Engineer', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'f3bd1a4133e9040c', "job-title": 'Support Engineer', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'e3850a211192fdac', "job-title": 'Parasitic Extraction QA Engineer (Remote)', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'eb96e976839a8adc', "job-title": 'Data Platform Engineer', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '2294612920d75fc6', "job-title": 'Loss Prevention Engineer 1 (Hybrid - located in Seattle)', "title-rating": '6', "brainjs-rating": ''},
        {"id": '27ade40cc1a3686', "job-title": 'Software Engineer - All Levels', "title-rating": '9', "brainjs-rating": '6'},
        {"id": 'e22eddd95c9af3fa', "job-title": 'Software Engineer Graduate (TikTok Privacy and Security ) - 2024 Start (BS/MS/PhD)', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '08be3a38767dab76', "job-title": 'Software Infrastructure Engineer (Starlink)', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '51db2076d33b06c0', "job-title": 'Data & Analytics Translator', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '5f23f024d43cb51d', "job-title": 'Business Analyst - Scaled Infrastructure', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'ef6f01171984bef5', "job-title": 'Software Quality Assurance Engineer, Internal Tools', "title-rating": '7', "brainjs-rating": '6'},
        {"id": '817521fa648edb7c', "job-title": 'Part-Time Lecturer of Information Technology', "title-rating": '5', "brainjs-rating": '7'},
        {"id": 'd8977cee45286cb', "job-title": 'Coding Tutor (in-person/remote Fremont, CA) at theCoderSchool', "title-rating": '5', "brainjs-rating": 'U Analy Analy Analy Analy Analy Analy Ana…y Analy Analy Analy Analy Analy Analy An'},
        {"id": '1f13522de9c27f51', "job-title": 'Software Infrastructure Engineer (Starlink)', "title-rating": '7', "brainjs-rating": '7'},
        {"id": '3b0970bc8d72932', "job-title": 'Code Coach', "title-rating": '8', "brainjs-rating": '6'},
        {"id": '1b68fef69182fec7', "job-title": 'Data Scientist', "title-rating": '8', "brainjs-rating": '7'},
        {"id": '582bcfcd712fe9e2', "job-title": 'Software Engineer II', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'e72228a074490e99', "job-title": 'Web Developer', "title-rating": '6', "brainjs-rating": '7'},
        {"id": '645438992bc0626b', "job-title": 'Biological Data Scientist', "title-rating": '6', "brainjs-rating": '7'},
        {"id": 'f35ff53bc21e9db3', "job-title": 'Containerization Expert', "title-rating": '3', "brainjs-rating": '7'},
        {"id": '2a99fcbe447b41a', "job-title": 'After School Instructor (Part-time)', "title-rating": '7', "brainjs-rating": '7'},
        {"id": 'c2e277afb3261bc7', "job-title": 'Software Developer', "title-rating": '8', "brainjs-rating": '7'},
        {"id": '34380500ece3f865', "job-title": 'Clinical Research Data Spec I - Smidt Heart Institute (Dr. Chugh Team)', "title-rating": '6', "brainjs-rating": '6'},
        {"id": '2e327279d18d6a67', "job-title": 'Docker Specialist', "title-rating": '3', "brainjs-rating": '7'}
    ]
}

function cleanData(){
    //function off the main loop to control one-off data cleaning operations
    let dataSet = getOldDataSet();
    writeDataToCSV(dataSet, "change-this")

    console.log(dataSet);
}


main();
//cleanData();
