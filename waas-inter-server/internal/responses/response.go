package responses

type Response struct {
    Message string                 `json:"message"`
    Data    map[string]interface{} `json:"data"`
}

type AddressGenerationResponse struct {
	OpName  string `json:"opName"`
	Done    bool   `json:"done"`
}