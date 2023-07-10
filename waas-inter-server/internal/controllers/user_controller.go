package controllers

import (
	"context"
	"net/http"
	"time"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/db"
	"waas-example/inter-server/internal/requests"
	"waas-example/inter-server/internal/responses"
	"waas-example/inter-server/internal/services"

	"github.com/gin-gonic/gin"
)

// POST /api/user/register
func Register(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()
	var registerInput requests.RegisterInput

	//validate the request body
	if err := c.BindJSON(&registerInput); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	// Find the only pool we have
	ctxWT, cancel = context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()
	_, err := db.GetPoolByDisplayName(ctxWT, configs.PoolName())
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	deviceName, err := services.RegisterDevice(ctxWT, registerInput.RegistrationData)

	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	c.JSON(http.StatusCreated,
		responses.Response{
			Message: "success",
			Data:    map[string]interface{}{"deviceName": deviceName}})
}
