package requests

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
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
