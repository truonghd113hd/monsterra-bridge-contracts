from bot.Bot import Bot
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64
load_dotenv() 
deployer_key = os.environ.get("MNEMONIC_KEY")

bot = Bot("testnet", deployer_key)

deployer = bot.get_deployer()

print(deployer.key.acc_address)

contract_addr = os.environ.get("CONTRACT_ADDR")
new_code_id = bot.store_contract("monstera_terra")
bot.migrate_contract(deployer, contract_addr,new_code_id, {})