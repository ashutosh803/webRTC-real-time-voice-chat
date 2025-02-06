const router = require("express").Router();
const activateController = require("./controllers/activate-controller");
const authController = require("./controllers/auth-controllers");
const encryptDecyptControllers = require("./controllers/encryptDecypt-controllers");
const roomsController = require("./controllers/rooms-controller");
const { authMiddleware } = require("./middlewares/auth-middleware");
const cors = require("cors");

const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests from both local and production frontend URLs
      const allowedOrigins = [
        process.env.LOCAL_DEV_CLIENT_URL,  // Local dev URL
        process.env.CLIENT_URL  // Production URL
      ];
  
      if (allowedOrigins.includes(origin) || !origin) {  // Allow requests without origin (like curl or Postman)
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true,  // Allow credentials (cookies, headers, etc.)
    preflightContinue: false, // Express will handle OPTIONS preflight requests
    optionsSuccessStatus: 204,  // For legacy browsers (e.g., IE)
  };

router.post("/api/send-otp", authController.sendOtp)

router.post("/api/verify-otp", authController.verifyOtp);

router.post("/api/activate", authMiddleware, activateController.activate)

router.get("/api/refresh", cors(corsOptions), authController.refresh);


router.get("/api/logout", authMiddleware, authController.logout)

router.post("/api/rooms", authMiddleware, roomsController.create)

router.get("/api/rooms", authMiddleware, roomsController.index)

router.get("/api/rooms/:roomId", authMiddleware, roomsController.show)

router.delete("/api/rooms/:roomId", authMiddleware, roomsController.delete)

router.get("/api/profile", authMiddleware, roomsController.clientRoom)

router.post("/api/encrypt", authMiddleware, encryptDecyptControllers.encryptData)

router.get("/encrypted/:encryptedData", authMiddleware, encryptDecyptControllers.decryptData)

module.exports = router