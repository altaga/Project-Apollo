import solanaApollo
import json

def lambda_handler(event, context):
    temp = []
    for x in solanaApollo.getSignatures(event["headers"]["hash"]):
        resp = solanaApollo.getData(x)
        if(resp !=" " and resp !="" ):
            temp.append(resp)
    return{
        'statusCode': 200,
        'body': json.dumps(temp)
    }