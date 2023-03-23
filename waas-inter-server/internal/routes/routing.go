package routes

import (
	"waas-example/inter-server/internal/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {

	public := router.Group("/api")

	public.POST("/user/register", controllers.Register)
	public.POST("/user/login", controllers.Login)
	public.POST("/waas/create-pool", controllers.CreatePool) // for now its public
	// Auth required
	protected := router.Group("/api/protected")
	protected.Use(JwtAuthMiddleware())

	protected.GET("/user/current", controllers.CurrentUser)
	protected.POST("/waas/create-wallet", controllers.CreateWallet)
	protected.POST("/waas/generate-address", controllers.GenerateAddress)
	protected.POST("/waas/broadcast-transaction", controllers.BroadcastTransaction)
	//protected.POST("/waas/create-wallet-and-address", controllers.CreateUserWalletAndAddress)
}
