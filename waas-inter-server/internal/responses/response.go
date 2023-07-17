package responses

import (
	keys "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_keys/v1"
)

type Response struct {
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
}

type CreateTxSignatureResponse struct {
	MpcData         []byte `json:"mpc_data"`
	SignatureOpName string `json:"signatureOp"`
}

type CreateWalletResponse struct {
	MpcOp        *keys.MPCOperation
	WalletOpName string `json:"walletOpName"`
}
