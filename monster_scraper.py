#!/usr/bin/python
import random
import requests
from time import sleep
from bs4 import BeautifulSoup

class UserAgent:
    ua_source_url='https://deviceatlas.com/blog/list-of-user-agent-strings#desktop'

    def __init__(self):
        self.new_ua = random.choice(self.get_ua_list())
    
    def get_ua_list(self, source=ua_source_url):
        r = requests.get(source)
        soup = BeautifulSoup(r.content, "html.parser")
        tables = soup.find_all('table')
        return [table.find('td').text for table in tables]

def print_request_error(page):
    print("Error Requesting " + page.url + " ,HTTP code: " + page.status_code)

def generate_user_agent_header():
    headers = requests.utils.default_headers()
    headers.update(
    {
        'User-Agent': UserAgent().new_ua,
    }
    )
    return headers

def aiedd_monster_crawl():
    try:
        monster_table_page = requests.get("https://www.aidedd.org/dnd-filters/monsters.php", headers=generate_user_agent_header(), timeout=5)
        if monster_table_page.status_code != requests.codes.ok:
            print_request_error(monster_table_page)
        monster_table_parser = BeautifulSoup(monster_table_page.content, 'html.parser')
        monster_table_page_links = monster_table_parser.select("td a")
        for link_tag in monster_table_page_links:
            sleep(0.2) # be nice and don't CDoS
            monster_link_href = link_tag.get("href")
            try:
                monster_page = requests.get(monster_link_href, headers=generate_user_agent_header(), timeout=5)
                if monster_table_page.status_code != requests.codes.ok:
                    print_request_error(monster_table_page)
                    continue
                monster_page_parser = BeautifulSoup(monster_page.content, 'html.parser')
                print(monster_page_parser.prettify())
            except requests.Timeout as e:
                print(monster_link_href + " timed out")
    except requests.Timeout as e:
        print("https://www.aidedd.org/dnd-filters/monsters.php timed out")
        
        

        


aiedd_monster_crawl()

