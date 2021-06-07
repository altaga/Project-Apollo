import http.client
import json

def getSignatures(account):
    conn = http.client.HTTPSConnection("explorer-api.devnet.solana.com")
    payload = json.dumps({
    "method": "getConfirmedSignaturesForAddress2",
    "jsonrpc": "2.0",
    "params": [
        account,
        {
        "limit": 25
        }
    ],
    "id": "7e151f88-7397-4ba2-bdf1-ef6793cb3259"
    })
    headers = {
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/91.0.4472.77',
    'DNT': '1',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Origin': 'https://explorer.solana.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://explorer.solana.com/',
    'Accept-Language': 'en-US,en;q=0.9,es-MX;q=0.8,es;q=0.7,zh-CN;q=0.6,zh;q=0.5'
    }
    conn.request("POST", "/", payload, headers)
    res = conn.getresponse()
    data = res.read()
    data = json.loads(data.decode("utf-8"))
    temp=[]
    for x in range(0,len(data["result"])):
        temp.append(data["result"][x]['signature'])
    return(temp)

def getData(signature):
    conn = http.client.HTTPSConnection("explorer-api.devnet.solana.com")
    payload = json.dumps({
    "method": "getConfirmedTransaction",
    "jsonrpc": "2.0",
    "params": [
        signature,
        {
        "encoding": "jsonParsed"
        }
    ],
    "id": "a3549145-9c9e-425c-99d2-421b55d9a36c"
    })
    headers = {
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/91.0.4472.77',
    'DNT': '1',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Origin': 'https://explorer.solana.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://explorer.solana.com/',
    'Accept-Language': 'en-US,en;q=0.9,es-MX;q=0.8,es;q=0.7,zh-CN;q=0.6,zh;q=0.5'
    }
    conn.request("POST", "/", payload, headers)
    res = conn.getresponse()
    data = res.read()
    data = json.loads(data.decode("utf-8"))
    try:
        return(data["result"]["transaction"]["message"]["instructions"][0]["data"])
    except:
        return(" ")