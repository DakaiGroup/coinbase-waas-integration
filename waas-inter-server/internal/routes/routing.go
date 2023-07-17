package routes

import (
	"waas-example/inter-server/internal/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {

	// Auth required
	// protected := router.Group("/api/protected")
	// protected.Use(JwtAuthMiddleware())

	public := router.Group("/api")

	public.POST("/device/register", controllers.Register)
	public.POST("/waas/create-pool", controllers.CreatePool)

	public.POST("/waas/create-wallet", controllers.CreateWallet)
	public.POST("/waas/generate-address", controllers.GenerateAddress)
	public.POST("/waas/wait-wallet", controllers.WaitWallet)
	public.POST("/waas/poll-mpc-operation", controllers.PollMpcOperation)
	public.POST("/waas/create-transaction", controllers.CreateTransaction)
	public.POST("/waas/wait-signature-and-broadcast", controllers.WaitSignatureAndBroadcast)
}
