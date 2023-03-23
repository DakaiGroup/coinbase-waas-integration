package controllers

import (
	"context"
	"log"
	"net/http"
	"time"
	"waas-example/inter-server/internal/requests"
	"waas-example/inter-server/internal/responses"
	"waas-example/inter-server/internal/services"
	"waas-example/inter-server/internal/utils"

	"github.com/gin-gonic/gin"
)

// POST /create-pool
func CreatePool(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()
	var poolName requests.PoolName

	if err := c.BindJSON(&poolName); err != nil {
		return
	}

	pool, err := services.CreatePool(ctxWT, poolName.DisplayName)
	if err != nil {
		log.Printf("error creating pool: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	log.Printf("Successfully created Pool: %v", pool)

	c.IndentedJSON(http.StatusOK, pool)
}

// POST /create-wallet
func CreateWallet(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mpcOp, err := services.CreateWallet(ctxWT, userId)
	if err != nil {
		log.Printf("error creating wallet: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully created wallet: %v", mpcOp)

	c.IndentedJSON(http.StatusOK, mpcOp)
}

// POST /generate-address
func GenerateAddress(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()
	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	addressResp, err := services.GenerateAddress(ctxWT, userId)
	if err != nil {
		log.Printf("error generating address: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	log.Printf("Successfully generated address/addressResp: %v", addressResp)

	c.IndentedJSON(http.StatusOK, addressResp)
}

// POST /broadcast-transaction
func BroadcastTransaction(c *gin.Context) {
	ctx := c.Request.Context()

	var rawTx requests.RawTx

	if err := c.BindJSON(&rawTx); err != nil {
		return
	}

	hash, err := services.BroadcastTransaction(ctx, rawTx.RawTransaction)
	if err != nil {
		log.Printf("error BroadcastTransaction: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	log.Printf("tx sent: %s", hash)
	c.IndentedJSON(http.StatusOK, gin.H{"txHash": hash})
}

// POST /create-wallet-and-address
// func CreateUserWalletAndAddress(c *gin.Context) {
// 	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 20*time.Second)
// 	defer cancel()

// 	userId, err := utils.ExtractTokenID(c)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	_, err = services.CreateWallet(ctxWT, userId)
// 	if err != nil {
// 		log.Printf("error creating wallet: %v", err)
// 		c.JSON(http.StatusInternalServerError,
// 			responses.Response{
// 				Message: "error",
// 				Data:    map[string]interface{}{"error": err.Error()}})
// 		return
// 	}

// 	addressResp, err := services.GenerateAddress(ctxWT, userId)
// 	if err != nil {
// 		log.Printf("error generating address: %v", err)
// 		c.JSON(http.StatusInternalServerError,
// 			responses.Response{
// 				Message: "error",
// 				Data:    map[string]interface{}{"error": err.Error()}})
// 		return
// 	}

// 	c.IndentedJSON(http.StatusOK, addressResp)
// }
