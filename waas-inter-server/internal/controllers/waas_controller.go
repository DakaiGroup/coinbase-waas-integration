package controllers

import (
	"context"
	"log"
	"net/http"
	"time"
	"waas-example/inter-server/internal/requests"
	"waas-example/inter-server/internal/responses"
	"waas-example/inter-server/internal/services"

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

	var createWalletData requests.CreateWalletData

	//validate the request body
	if err := c.BindJSON(&createWalletData); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	mpcOp, err := services.CreateWallet(ctxWT, createWalletData.PoolName, createWalletData.DeviceId)

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

	var walletResource requests.WalletResource

	//validate the request body
	if err := c.BindJSON(&walletResource); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	addressResp, err := services.GenerateAddress(ctxWT, walletResource.Wallet)
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

	var waitWalletResource requests.WaitWalletResource

	//validate the request body
	if err := c.BindJSON(&waitWalletResource); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	mpcWallet, err := services.WaitWallet(ctxWT, waitWalletResource.WalletOp)
	if err != nil {
		log.Printf("error waiting for wallet: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully waited for wallet")

	c.IndentedJSON(http.StatusOK, mpcWallet)
}

// POST /waas/create-transaction
func CreateTransaction(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	var transaction requests.TransactionWithSigOpNameAndKeyAndDeviceGroup

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

	creatTxResp, err := services.CreateTransaction(ctxWT, transaction)
	if err != nil {
		log.Printf("error with create transaction: %v", err)
		c.JSON(http.StatusInternalServerError,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}
	log.Printf("Successfully created transaction operation")

	c.IndentedJSON(http.StatusOK, creatTxResp)
}

// POST /waas/wait-signature-and-broadcast
func WaitSignatureAndBroadcast(c *gin.Context) {
	ctxWT, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	var transaction requests.TransactionWithSigOpNameAndKey

	//validate the request body
	if err := c.BindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	hash, err := services.WaitSignatureAndBroadcast(ctxWT, transaction)
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

	var mpcOperaion requests.MPCOperation

	//validate the request body
	if err := c.BindJSON(&mpcOperaion); err != nil {
		c.JSON(http.StatusBadRequest,
			responses.Response{
				Message: "error",
				Data:    map[string]interface{}{"error": err.Error()}})
		return
	}

	mpcOp, err := services.PollMpcOperation(ctxWT, mpcOperaion.DeviceGroup)
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
