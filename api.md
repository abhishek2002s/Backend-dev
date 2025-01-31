# DEVTINDER API


# userAuth Router
- POST /SignUp
- POST /Login
- POST / Logout

# Profile Roter

- GET /profile/view
- PATCH /Profile/edit
- PATCH /Profile/password

# coonectionRequest  RouterD
- POST /request/send/interested/:userI
- POST /requested/send/ignored/:userID
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# UserRouter
- GET /user/connections
- GET /user/request
- GET /user/feed - Gets you the profiles of other users on platform