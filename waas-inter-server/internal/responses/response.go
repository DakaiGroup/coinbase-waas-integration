package responses

type Response struct {
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
}
