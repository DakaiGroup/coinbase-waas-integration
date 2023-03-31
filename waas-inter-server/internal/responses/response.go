package responses

type Response struct {
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
}

type WalletGenerationResponse struct {
	WalletOpName  string `json:"walletOpName"`
	MpcData []byte `json:"mpcData"`
	DeviceGroup  string `json:"deviceGroup"`
}
