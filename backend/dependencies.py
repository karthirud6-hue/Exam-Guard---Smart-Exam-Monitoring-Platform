from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from security import verify_access_token

# Extract Bearer token from request headers
security = HTTPBearer(auto_error=False)


# Verify JWT token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing"
        )

    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None or not payload.get("sub") or not payload.get("role"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return payload


# Role-based authorization
def require_role(*allowed_roles):

    def role_checker(current_user=Depends(get_current_user)):

        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this resource"
            )

        return current_user

    return role_checker