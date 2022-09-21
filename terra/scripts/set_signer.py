from asyncio import constants
from bot.Bot import Bot
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64
load_dotenv() 
deployer_key = os.environ.get("MNEMONIC_KEY")

bot = Bot("testnet", deployer_key)
deployer = bot.get_deployer()
print(deployer.key.acc_address)

## Get contract data 
token_data_path = os.path.abspath("scripts/data/deployed.json")
f = open(token_data_path)
data = json.load(f)

contract_addr = None 
try:
    contract_addr = data["address"]
except:
    print("Please check the deployed file")
    sys.exit(1)

signer_public_key = str(base64.b64encode(deployer.key.public_key.key).decode())
# set signer 
bot.execute_contract(
    deployer,
    contract_addr,
    {
        "set_signer": {
            "public_key": "Ar8v+jomhnLnzh7ejDcS5e1q7EVg7avFfV6nOW+SlcAN"
        }
    }
)
