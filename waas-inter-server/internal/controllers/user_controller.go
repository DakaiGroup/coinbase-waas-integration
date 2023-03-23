package controllers

import (
	"context"
	"net/http"
	"time"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/db"
	"waas-example/inter-server/internal/models"
	"waas-example/inter-server/internal/requests"
	"waas-example/inter-server/internal/responses"
	"waas-example/inter-server/internal/utils"

	"github.com/gin-gonic/gin"

	"golang.org/x/crypto/bcrypt"
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerInput.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	// Find the only pool we have
	ctxWT, cancel = context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()
	poolModel, err := db.GetPoolByDisplayName(ctxWT, configs.PoolName())
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	result, err := db.CreateUser(ctxWT, registerInput, hashedPassword, poolModel)

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
			Data:    map[string]interface{}{"data": result}})
}

// POST /api/user/login
func Login(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input requests.LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := db.GetUserByUserName(ctxWT, input.Username)

	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	token, err := loginCheck(*user, input.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username or password is incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// GET /api/user/current
func CurrentUser(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := db.GetUserById(ctxWT, userId)

	if err != nil {
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	// do not return the password hash
	user.Password = ""

	c.JSON(http.StatusOK,
		responses.Response{
			Message: "success",
			Data:    map[string]interface{}{"user": user}})
}

// HELPERS
func verifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func loginCheck(user models.User, password string) (string, error) {
	var err error

	err = verifyPassword(password, user.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	token, err := utils.GenerateToken(user.Id.Hex())

	if err != nil {
		return "", err
	}

	return token, nil
}
