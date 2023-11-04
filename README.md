# My-Indeed-AI
An expirement in using AI to filter job posts. 

## The current processes consists of:
### 1. Retrieve job posting data from Indeed
Through use of Selenium and Beautiful Soup, data is fetched from Indeed based on urls. Currently the data retrieved includes Job ID, Job Title, Company Name, Location, and Job Link. The inputs needed are a link to a search from Indeed and a file location for the output data. It outputs all of the data for every page of the search to a csv. This takes about a second. Note that other info sunch as Job pay will need to be retrieved from the Job link in a later iteration
### 2. Cleaning and formating job data into a usable format for an LLM
### 3. Annototate Data for the LLM
### 4. Train and Test the LLM using the Data
### 5. Analyze the Data
