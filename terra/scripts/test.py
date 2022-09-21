from bot.Bot import Bot
from bot.Monstera import Monstera
from bot.Token import Token
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64
load_dotenv() 
deployer_key = os.environ.get("MNEMONIC_KEY")

network = "localterra"
bot = Bot(network, deployer_key)
deployer = bot.get_deployer()
user2 = bot.get_lt_wallet("test2")
signer = bot.get_lt_wallet("test3")

def create_swap_signature(swap_message):
    str_swap_msg = json.dumps(swap_message).strip().replace(' ', '').encode()
    sig_buffer = signer.key.sign(str_swap_msg)
    decode_signature = base64.b64encode(sig_buffer).decode()
    return ''.join(decode_signature)

monstera = Monstera(network, deployer_key)
token = Token(network, deployer_key, "MAG", [], repr(monstera))
accepted_token = repr(token)
des_token = "0xFCb11BFdcaF37ed09Ffb58347eA44a7E76300c90"
des_user = "0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da"

monstera.set_accepted_token(deployer, accepted_token, True)
monstera.set_accepted_des_token(deployer, des_token, True)

signer_public_key = str(base64.b64encode(signer.key.public_key.key).decode())
monstera.set_signer(deployer, signer_public_key)

mint_swap_message = {
    "transaction_id": "62b3dd9c73859895cc61c871",
    "cur_token": accepted_token,
    "des_token": des_token,
    "cur_user": user2.key.acc_address,
    "des_user": des_user,
    "amount": "100000000"
}

sig = create_swap_signature(mint_swap_message)
monstera.mint(user2, mint_swap_message, sig)

"""Failed"""
# monstera.mint(user2, swap_message, sig)
# swap_message["transaction_id"] = "test2"
# monstera.mint(user2, swap_message, sig)


burn_swap_message = {
    "transaction_id": "burn1",
    "cur_token": accepted_token,
    "des_token": des_token,
    "cur_user": user2.key.acc_address,
    "des_user": des_user,
    "amount": "100000000"
}

token.increase_allowance(user2, repr(monstera), "100000000")
monstera.burn(user2, burn_swap_message)