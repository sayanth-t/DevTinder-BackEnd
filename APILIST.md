# DEV TINDER APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter 
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password
- DELETE /profile/delete

## feedRouter
- GET /feed

## requestRouter
- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests
- GET /user/connections