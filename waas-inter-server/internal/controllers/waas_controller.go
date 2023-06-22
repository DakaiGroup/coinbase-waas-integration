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
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
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
	log.Printf("Successfully created MPC Operation: %v", mpcOp)

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

// GET /waas/wait-wallet
func WaitWallet(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	success, err := services.WaitWallet(ctxWT, userId)
	if err != nil {
		log.Printf("error waiting for wallet: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully waited for wallet");

	c.IndentedJSON(http.StatusOK, map[string]bool{"success": success})
}

// POST /waas/create-transaction
func CreateTransaction(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	var transaction requests.Transaction

	//validate the request body
	if err := c.BindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Println("incomming TX:")
	log.Println(transaction)

	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	creatTxResp, err := services.CreateTransaction(ctxWT, userId, transaction)
	if err != nil {
		log.Printf("error with create transaction: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully created transaction operation");

	c.IndentedJSON(http.StatusOK, creatTxResp)
}

// POST /waas/wait-signature-and-broadcast
func WaitSignatureAndBroadcast(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	var sigOpAndtx requests.SigOpNameAndTx

	//validate the request body
	if err := c.BindJSON(&sigOpAndtx); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	hash, err := services.WaitSignatureAndBroadcast(ctxWT, sigOpAndtx)
	if err != nil {
		log.Printf("error waiting for signature and broadcast: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"txHash": hash})
}

// GET /poll-mpc-operation
func PollMpcOperation(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	userId, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mpcOp, err := services.PollMpcOperation(ctxWT, userId)
	if err != nil {
		log.Printf("error polling mpc op: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully polled MPC Operation: %v", mpcOp)

	c.IndentedJSON(http.StatusOK, mpcOp)
}
