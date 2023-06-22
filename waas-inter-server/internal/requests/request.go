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
	ChainID              string `json:"chainID"`
	Nonce                uint64 `json:"nonce"`
	MaxPriorityFeePerGas string `json:"maxPriorityFeePerGas"`
	MaxFeePerGas         string `json:"maxFeePerGas"`
	Gas                  uint64 `json:"gas"`
	From                 string `json:"from"`
	To                   string `json:"to"`
	Value                string `json:"value"`
	Data                 string `json:"data"`
}

type SigOpNameAndTx struct {
	SigOpName            string `json:"sigOpname"`
	ChainID              string `json:"chainID"`
	Nonce                uint64 `json:"nonce"`
	MaxPriorityFeePerGas string `json:"maxPriorityFeePerGas"`
	MaxFeePerGas         string `json:"maxFeePerGas"`
	Gas                  uint64 `json:"gas"`
	From                 string `json:"from"`
	To                   string `json:"to"`
	Value                string `json:"value"`
	Data                 string `json:"data"`
}
