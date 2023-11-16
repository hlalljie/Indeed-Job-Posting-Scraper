# My-Indeed-AI
An expirement in using AI to filter job posts. Get job posts from Indeed using a web scraper, rate the postings, then use the rated postings to train an AI to rate posts for you. Curerntly needs some refinement to find outliers.

## Instructions
### Job Scraping
#### 1. Choose root URLs to scrape.
On Indeed, enter custom filters to narrow down which jobs postings you would like to scrape. You can choose as many urls as you would like and the job post scraper will go through every page (up to limits that you set) so no need to include a url for every page.
#### 2. Add the urls to indeed_job_scraper.py
In the main fucntion of indeed_job_scraper.py, list the urls as strings in the url_root_list. You can replace the urls that are already there.
#### 3. Specify an Output File
Chnage the contents of the variable output_path so that it is a string that specifies the path and filename of the file to output to. This file does not need to exist, if it does, ITS CONTENTS WILL BE OVERWRITTEN.
#### 4. Specific the Limit on the Number of Posts to Scrape
Chnage the value for the variable RUN_LIMIT to the max posts you would like to scrape. This limit applies to EACH URL ROOT so if you have 4 roots with a 1000 RUN_LIMIT you can potentially scrape 4000 posts. If there are less posts for a specific root, then it will continue on to the next root after scraping all of the posts in the page.
#### 5. Run the indeed_job_scraper.py
In your favorite development enviroment, run indeed_job_scraper.py. You will need Beautiful Soup, Selenium, and Pandas installed. Note that the Selenium browser window will pop up very often and it will become the main focused window everytime this happens so it is suggested that this process is run on a virtual machine.
