package requests

type RegisterInput struct {
	Username         string `json:"username" binding:"required"`
	Password         string `json:"password" binding:"required"`
	RegistrationData string `json:"registrationData" binding:"required"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RawTx struct {
	RawTransaction string `json:"rawTransaction"`
}

type PoolName struct {
	DisplayName string `json:"displayName"`
}

type WalletResource struct {
	Wallet string `json:"wallet,omitempty"`
}

type Transaction struct {
	ChainID              string `json:"ChainID"`
	Nonce                uint64 `json:"Nonce"`
	MaxPriorityFeePerGas string `json:"MaxPriorityFeePerGas"`
	MaxFeePerGas         string `json:"MaxFeePerGas"`
	Gas                  uint64 `json:"Gas"`
	To                   string `json:"To"`
	Value                string `json:"Value"`
	Data                 string `json:"Data"`
}

type SigOpName struct {
	SigOpName string `json:"sigOpname"`
}
