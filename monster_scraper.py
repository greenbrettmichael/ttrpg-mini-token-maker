#!/usr/bin/python
import random
import requests
import os
import io
import shutil
from time import sleep
from bs4 import BeautifulSoup
from bs4.element import Comment

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
    print("Error Requesting " + page.url + " ,HTTP code: " + str(page.status_code))

def generate_user_agent_header():
    headers = requests.utils.default_headers()
    return headers

def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def aiedd_monster_crawl(output_folder):
    try:
        monster_table_page = requests.get("https://www.aidedd.org/dnd-filters/monsters.php", headers=generate_user_agent_header(), timeout=5)
        if monster_table_page.status_code != requests.codes.ok:
            print_request_error(monster_table_page)
            return
        monster_table_parser = BeautifulSoup(monster_table_page.content, 'html.parser')
        monster_table_page_links = monster_table_parser.select("td a")
        random.shuffle(monster_table_page_links)
        for link_tag in monster_table_page_links:
            monster_link_href = link_tag.get("href")
            monster_name_param_split = monster_link_href.rsplit('vo=', 1)
            if len(monster_name_param_split) != 2:
                continue
            monster_name = monster_name_param_split[-1]
            monster_folder = output_folder + "/" + monster_name
            if os.path.exists(monster_folder):
                continue
            try:
                sleep(random.uniform(10, 60)) # be nice and don't CDoS
                monster_page = requests.get(monster_link_href, headers=generate_user_agent_header(), timeout=5)
                if monster_page.status_code != requests.codes.ok:
                    print_request_error(monster_page)
                    return
                os.makedirs(monster_folder)
                monster_page_parser = BeautifulSoup(monster_page.content, 'html.parser')
                with io.open(monster_folder + "/description.html", "w", encoding="utf-8") as monster_html_file:
                    monster_html_file.write(monster_page_parser.prettify(formatter="html"))
                monster_image_list = monster_page_parser.select("div.picture img, div.picture amp-img")
                if len(monster_image_list) > 1:
                    print("too many images, saving first")
                elif not monster_image_list:
                    print(monster_name + " has no images")
                    continue
                monster_image_src = monster_image_list[0].get("src")
                try:
                    monster_image_page = requests.get(monster_image_src, stream=True, timeout=5)
                    if monster_image_page.status_code != requests.codes.ok:
                        print_request_error(monster_image_page)
                        continue
                    with open(monster_folder + "/image.png", 'wb') as out_file:
                        shutil.copyfileobj(monster_image_page.raw, out_file)
                except requests.Timeout as e:
                    print(monster_image_src + "timed out")
            except requests.Timeout as e:
                print(monster_link_href + " timed out")
    except requests.Timeout as e:
        print("https://www.aidedd.org/dnd-filters/monsters.php timed out")
        
        

        


aiedd_monster_crawl("../monsters")

