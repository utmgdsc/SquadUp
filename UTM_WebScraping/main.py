from selenium import webdriver
from selenium.common import NoSuchElementException, TimeoutException, \
    WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup

# For Firebase Function:
import firebase_admin
from firebase_admin import credentials

from firebase_admin import firestore

# for conversion function
from datetime import datetime, timedelta


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
    one_week_from_today = today + timedelta(days=6)  # changed from 7 to 6

    # Check if the event date is within a week from today
    within_week = today <= event_datetime <= one_week_from_today

    return within_week


def format_datetime(input_date):
    # Convert input date string to datetime object
    input_datetime = datetime.strptime(input_date, "%Y-%m-%d %H:%M:%S")

    # Format the datetime object to the desired format (Friday, December 20, 2024)
    formatted_date = input_datetime.strftime("%A, %B %d, %Y")

    return formatted_date


def webscrape_logic():
    finished = True

    # Get today's date
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    # Replace 'path_to_webdriver' with the path to your chrome webdriver executable if the webdriver is not in PATH .
    try:
        # driver = webdriver.Chrome(executable_path='C:/path/to/chromedriver.exe')
        driver = webdriver.Chrome()
    except Exception as e:
        print(f"Error initializing WebDriver: {e}")
        return False, {}  # Exit the script

    driver.implicitly_wait(10)

    # offset variable will be used to control what day we are looking at
    stop = False
    offset = 1

    events_dict = {}

    try:
        while not stop:
            
            # Load the webpage
            url = 'https://utmeagles.loxi.io/list/future/' + str(offset)
            driver.get(url)
            try:
                wait = WebDriverWait(driver, 30)
                element = wait.until(
                    EC.presence_of_element_located((By.TAG_NAME, "time")))
                # time.sleep(20)
            except TimeoutException:

                return False, events_dict
            except NoSuchElementException:
                return False, events_dict
            


            # Wait for the specific time element to appear


            # Get the HTML source of the loaded page
            html_code = driver.page_source
            soup = BeautifulSoup(html_code, 'html.parser')

            empty_class_div = soup.find('div', class_='')
            all_days = empty_class_div.find('ul')

            for day in all_days:
                time_tag = day.find("time")
                datetime_value = time_tag.get('datetime')
                # print(datetime_value)
                if is_within_week(today, datetime_value) is True:
                    event_date = format_datetime(datetime_value)
                    # insert function call to change formatting of datetime
                    currEventlist = events_dict.setdefault(event_date, [])
                    events = day.find_all("li")
                    for event in events:
                        try:
                            eventName = event.find("a").text
                            # print(eventName)
                        except Exception as e:
                            continue
                        try:
                            eventTime = event.find("time").text.strip()
                            # print(eventTime)
                        except Exception as e:
                            eventTime = "NA"

                        try:
                            eventLocation = event.find("address").strong.text
                        except Exception as e:
                            eventLocation = "NA"

                        info = (eventName, eventTime, eventLocation)
                        # print(info)
                        currEventlist.append(info)

                    events_dict[event_date] = currEventlist

                else:
                    stop = True
            offset += 1
    except WebDriverException as e:
        # Handle WebDriverException (e.g., if the page fails to load)
        print(f"WebDriverException: {e}")
        finished = False

    except Exception as e:
        # Handle other exceptions
        print(f"An error occurred: {e}")
        finished = False

    finally:
        # Close the browser
        driver.quit()
        return (
            finished, events_dict)  # if no exception was met, it'll return True


def sendevents(events_dict):

    cred = credentials.Certificate("ServiceAccountKey.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    for date, events in events_dict.items():
        for event in events:
            event_name, event_time, event_location = event
            # print(f"Date: {date}, Name: {event_name}, Time: {event_time}, Location: {event_location}")
            db.collection('Drop_In_Events').document(date).collection('Events').add(
                {'Name': event_name, 'Time': event_time,
                 'Location': event_location})


if __name__ == '__main__':
    webscrape, events = webscrape_logic()
    if webscrape == True:
        sendevents(events)
    else:
        exit(1)
