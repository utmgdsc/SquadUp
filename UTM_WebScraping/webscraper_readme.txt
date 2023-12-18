Libraries and Versions:
- Selenium version: 4.15.2 
- BeautifulSoup4 version: 4.12.2
- Firebase-admin: 6.3.0

Limitations:
    1. This web scraper, like any other generic web scraper, is built using a pattern seen on the loxi.io website. Any changes to how loxi.io displays data can lead to changes in the behavior of the web scraper.

    2. The webscraper also does the job of adding in events, however the intended to be ran every monday. Doing it between weeks can lead to duplication of events. 

Other Notes:
    - A service key for a Firebase database is required and, for security reasons, omitted from the repository.

    - Before running the webscraper ensure that Selenium is installed and the chrome webdriver that comes with along with it works. 

How to use:
    1. Add the ServiceAccountKey.json into the directory 
    2. The main.py is intended to run every monday running it between the weeks can lead to duplication of events!
    3. the delete.py script could be ran at anytime, it delete the events that have already happeneded from the firebase. 
    
