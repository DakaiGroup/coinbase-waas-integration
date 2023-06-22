package responses

type Response struct {
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
}

type CreateTxSignatureResponse struct {
	MpcData         []byte `json:"mpc_data"`
	SignatureOpName string `json:"signatureOp"`
}
