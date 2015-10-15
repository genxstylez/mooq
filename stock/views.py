import requests
import json
from django.shortcuts import render, JsonResponse

# Create your views here.


def get_stock_price(stock_id):
    req = requests.session()
    req.get('http://mis.twse.com.tw/stock/index.jsp', headers={'Accept-Language': 'zh-TW'})
    response = req.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp',
        params={'ex_ch': stock_id + '.tw', 'json': True, 'delay': False})

    if response.ok:
        return JsonResponse(json.loads(response.text))

