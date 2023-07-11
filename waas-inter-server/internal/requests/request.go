package requests

type RegisterInput struct {
	RegistrationData string `json:"registrationData" binding:"required"`
}

type CreateWalletData struct {
	DeviceId string `json:"deviceId"`
	PoolName string `json:"poolName"`
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

type MPCOperation struct {
	DeviceGroup string `json:"deviceGroup"`
}

type WalletResource struct {
	Wallet string `json:"wallet,omitempty"`
}

type WaitWalletResource struct {
	WalletOp string `json:"walletOp"`
}

type TransactionWithSigOpNameAndKey struct {
	SigOpName            string `json:"sigOpName"`
	Key                  string `json:"key"`
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

type TransactionWithSigOpNameAndKeyAndDeviceGroup struct {
	SigOpName            string `json:"sigOpName"`
	Key                  string `json:"key"`
	ChainID              string `json:"chainID"`
	Nonce                uint64 `json:"nonce"`
	MaxPriorityFeePerGas string `json:"maxPriorityFeePerGas"`
	MaxFeePerGas         string `json:"maxFeePerGas"`
	Gas                  uint64 `json:"gas"`
	From                 string `json:"from"`
	To                   string `json:"to"`
	Value                string `json:"value"`
	Data                 string `json:"data"`
	DeviceGroup          string `json:"deviceGroup"`
}
