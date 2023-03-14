package main

import (
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/routes"
	"github.com/gin-gonic/gin"
)

/**
Author: Gabor Kovacs <gabor.kovacs@dakai.io  (https://www.dakai.io)
**/

func main() {
	router := gin.Default()

	configs.ConnectDB()

	routes.UserRoute(router)

	router.Run("localhost:8080")
}
