import requests
from bs4 import BeautifulSoup
from stock.models import Stock


def crawl_TWSE(url):
     response = requests.get(url)

     soup = BeautifulSoup(response.text)

     for td in soup.findAll('td'):
        contents = td.text.split()
        if len(contents) == 2 and len(contents[0]) == 4:
            Stock.objects.create(name = ' '.join(contents), market_name='TWSE', code='tse_' + contents[0] + '.tw')
            # this is the stock I want to grab
            # in the form of [1101, '台泥']



if __name__ == '__main__':
    url = input('Please enter url for twse crawling')
    crawl_TWSE(url)

