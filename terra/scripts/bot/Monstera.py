from bot.Bot import Bot


class Monstera(Bot):
    ## for simplicity, decimal = 6
    def __init__(self, network_type, deployer_key, contract_addr =None) -> None:
        super().__init__(network_type, deployer_key)

        if contract_addr ==None:
            print("Deloying contract")
            self.token_code_id = self.store_contract("monstera_terra")

            self.contract_addr = self.instantiate_contract(self.token_code_id, {
            })
        else:
            self.contract_addr = contract_addr
            
        self.phrase = "Monstera"

    def migrate(self, admin):
        new_code_id = self.store_contract("monstera_terra")

        self.migrate_contract(
            admin,
            self.contract_addr,
            new_code_id,
            {}
        )

    def set_admin(self, sender, user, status):
        self.execute_contract(
            sender,
            self.contract_addr,
            {
                "set_admin":{
                    "user": user,
                    "status": status
                }
            }
        )
    
    def set_accepted_token(self, sender, token, status):
        self.execute_contract(
            sender, 
            self.contract_addr,
            {
                "set_accepted_token": {
                    "token": token,
                    "status": status
                }
            }
        )
    

    def set_accepted_des_token(self, sender, token, status):
        self.execute_contract(
            sender, 
            self.contract_addr,
            {
                "set_accepted_des_token": {
                    "token": token,
                    "status": status
                }
            }
        )
    
    def is_accepted_token(self, token):
        return self.query_contract(
            self.contract_addr,
            {
                "is_accepted_token": {
                    "token": token
                }
            }
        )
    
    def is_accepted_des_token(self, token):
        return self.query_contract(
            self.contract_addr,
            {
                "is_accepted_des_token": {
                    "token": token
                }
            }
        )
    

    def set_signer(self, sender, public_key):
        self.execute_contract(
            sender, 
            self.contract_addr,
            {
                "set_signer": {
                    "public_key": public_key
                }
            }
        )
    

    def get_signer(self):
        return self.query_contract(
            self.contract_addr,
            {
                "get_signer": {}
            }
        )

    
    def mint(self, sender, swap_msg, signature):
        print( {
            "mint": {
                "swap_message": swap_msg,
                "signature": signature
            }
        })
        self.execute_contract(
            sender, 
            self.contract_addr,
            {
                "mint": {
                    "swap_message": swap_msg,
                    "signature": signature
                }
            }
           
        )
        


    def burn(self, sender, swap_msg):
        self.execute_contract(
            sender,
            self.contract_addr,
            {
                "burn": {
                    "swap_message": swap_msg
                }
            }
        )
    

    
    ### EXECUTE #### 
    def __repr__(self) -> str:
        return self.contract_addr   
    

