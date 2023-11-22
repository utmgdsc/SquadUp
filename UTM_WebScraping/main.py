# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup

from datetime import datetime, timedelta

import time


def is_within_week(today, datetime_value):
    """
        Check if the given datetime_value is within a week from today.

        Args:
            today (datetime): Today's date as a datetime object.
            datetime_value (str): A string representing the event datetime in the format "%Y-%m-%d %H:%M:%S".

        Returns:
            bool: True if the event is within a week from today, False otherwise.

        Examples:
            >>> today = datetime(2023, 11, 10, 0, 0, 0)
            >>> datetime_value = "2023-11-17 00:00:00"
            >>> is_within_week(today, datetime_value)
            True

            >>> today = datetime(2023, 11, 10, 0, 0, 0)
            >>> datetime_value = "2023-11-25 12:30:00"
            >>> is_within_week(today, datetime_value)
            False
        """
    # Convert the datetime string to a datetime object
    event_datetime = datetime.strptime(datetime_value, "%Y-%m-%d %H:%M:%S")

    # Calculate a week from today
    one_week_from_today = today + timedelta(days=7)

    # Check if the event date is within a week from today
    within_week = today <= event_datetime <= one_week_from_today

    return within_week


# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    # Get today's date
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)


    driver = webdriver.Chrome()
    driver.implicitly_wait(10)

    # URL of the webpage has been hard set to list since the webscraper is being codded assuming the format of the website is in list form.
    # offset variable will be used to control what day we are looking at
    stop = False
    offset = 1

    while not stop:

        url = 'https://utmeagles.loxi.io/list/future/' + str(offset)

        # Load the webpage
        driver.get(url)

        # Wait for the time element to appear
        wait = WebDriverWait(driver, 30)
        element = wait.until(
            EC.presence_of_element_located((By.TAG_NAME, "time")))
        # time.sleep(20)

        # Get the HTML source of the loaded page
        html_code = driver.page_source
        soup = BeautifulSoup(html_code, 'html.parser')

        # # Print the HTML code to the console
        # print(soup.prettify())

        empty_class_div = soup.find('div', class_='')
        all_days = empty_class_div.find('ul')

        for day in all_days:
            time_tag = day.find("time")
            datetime_value = time_tag.get('datetime')
            print(datetime_value)
            if is_within_week(today, datetime_value) is True:
                events = day.find_all("li")
                for event in events:
                    eventName = event.find("a").text
                    # print(eventName)

                    eventTime = event.find("time").text.strip()
                    # print(eventTime)

                    eventLocation = event.find("address").strong.text

                    info = (eventName, eventTime, eventLocation)
                    print(info)
            else:
                stop = True

        offset += 1
    # Close the browser
    driver.quit()
