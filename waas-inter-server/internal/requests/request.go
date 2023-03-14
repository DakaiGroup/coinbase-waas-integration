package requests

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	DeviceId string `json:"deviceId" binding:"required"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Device struct {
	ID string `json:"id"`
}

type RawTx struct {
	RawTransaction string `json:"rawTransaction"`
}

type PoolName struct {
	DisplayName string `json:"displayName"`
}
