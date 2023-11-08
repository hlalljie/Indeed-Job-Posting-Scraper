'''
Additional Ideas
1. Maybe use Easy Apply and Urgently Hiring to mark the jobs as more valuable in the future
'''
import string
from datetime import datetime
from datetime import timedelta
import time
from bs4 import BeautifulSoup
from selenium import webdriver
import pandas as pd


def main():
    #Timers
    start_time = datetime.now()
    print("Running Start at", start_time.strftime("%d-%m-%Y %H:%M:%S"))

    # List of the first pages of jobs where the bot will search through, list the urls below as strings
    url_root_list = [
        "https://www.indeed.com/jobs?q=python&l=United+States&sc=0kf%3Aattr%28DSQF7%29attr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29attr%28X62BT%29explvl%28ENTRY_LEVEL%29%3B&vjk=60cbbc1cbbb76376",
        "https://www.indeed.com/jobs?q=python&l=Oregon&sc=0kf%3Aattr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29explvl%28ENTRY_LEVEL%29%3B&vjk=560cbf5def8c5f69",
        "https://www.indeed.com/jobs?q=python&l=San+Francisco+Bay+Area%2C+CA&sc=0kf%3Aattr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29attr%28X62BT%29explvl%28ENTRY_LEVEL%29%3B&vjk=ecd4f2fe53a63fc0",
        "https://www.indeed.com/jobs?q=python&l=Seattle%2C+WA&sc=0kf%3Aattr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29attr%28X62BT%29explvl%28ENTRY_LEVEL%29%3B&vjk=0087ce71a8431337",
        "https://www.indeed.com/jobs?q=python&l=Los+Angeles%2C+CA&sc=0kf%3Aattr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29explvl%28ENTRY_LEVEL%29%3B&rbl=Los+Angeles%2C+CA&jlid=d05a4fe50c5af0a8&vjk=753cc774e407931f"
    ]

    # Specify your output file path, CONTENTS WILL BE OVERWRITTEN or new file will be created
    output_path = "new_props_test.csv"

    # Specify the limit on how many posts to look through FOR EACH URL ROOT (so if you have 4 url roots you can potentially be loking through 4000 postings)
    RUN_LIMIT = 1000
    all_jobs_arr = []
    for url_root in url_root_list:
        find_all_jobs_for_search(url_root, all_jobs_arr, RUN_LIMIT)

    record_jobs_in_file(output_path, all_jobs_arr)

    completion_time = datetime.now()
    print("Running complete at", completion_time.strftime("%d-%m-%Y %H:%M:%S"))
    elapsed_time = timedelta()
    elapsed_time = completion_time-start_time
    print("Total time elapsed", str(elapsed_time))


def record_jobs_in_file(output_path, all_jobs):
    df = pd.DataFrame(all_jobs)
    df = df.drop_duplicates(subset=['id'])
    df.to_csv(output_path, index=False)


def find_all_jobs_for_search(url_root, all_jobs, hard_limit):
    page_start = 0
    run_limit = {"max_job_count": page_start+10, "hard_limit": hard_limit}
    while page_start < run_limit["max_job_count"] and page_start < run_limit["hard_limit"]:
        all_jobs.extend(find_jobs_on_page(url_root, 0, run_limit))
        page_start += 10


def find_jobs_on_page(url_root, start, limit):
    url = url_root + "&start=" + str(start)
    dr = webdriver.Chrome()
    dr.get(url)

    # Attempt to induce page load
    #scroll_down(dr)

    soup = BeautifulSoup(dr.page_source, 'html.parser')

    job_count = int(soup.find(class_="jobsearch-JobCountAndSortPane-jobCount").find("span").text.strip(string.ascii_letters))
    if job_count > limit["max_job_count"]:
        limit["max_job_count"] = job_count

    job_cards = soup.find_all(class_='slider_item')
    page_jobs = []
    for job_card in job_cards:
        page_jobs.append(find_job_info(job_card))
    return page_jobs


def find_job_info(job):
    card_title = job.find("h2").text.strip()
    card_link = job.find("a")["href"]
    card_id = job.find("a")["id"].strip()[4:]
    card_company = job.find("span", attrs={"data-testid": "company-name"}).text.strip()
    card_location = job.find("div", attrs={"data-testid": "text-location"}).text.strip()
    # Attempt to get card pay, load time causing issues
    '''
    try:
        card_pay = job.find(class_="salary-snippet-container").text
    except:
        card_pay = "None Listed"
    '''

    card_data = {
        "id": card_id,
        "company": card_company,
        "job-title": card_title,
        "location": card_location,
        "posting-link": card_link
    }
    return card_data


def scroll_down(self):
    """A method for scrolling the page."""

    # Get scroll height.
    last_height = self.execute_script("return document.body.scrollHeight")

    # Number of sections to divide the page by
    scroll_sections = 4

    # Scroll section by section through the page
    for i in range(1, scroll_sections+1):
        self.execute_script("window.scrollTo(0, document.body.scrollHeight*" + str(i/scroll_sections) + ");")
        # Wait to load the page.
        time.sleep(1)
    self.execute_script("window.scrollTo(0, 0);")
    time.sleep(1)


main()


