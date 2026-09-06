"""Development launcher: loads .env and starts the FastAPI app with uvicorn."""

import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    # Auto-reload only makes sense in development
    reload = os.getenv("ENVIRONMENT", "development") == "development"
    
    print("=" * 55)
    print("Danie Design FastAPI Backend & CRM Engine")
    print(f"Server URL     : http://localhost:{port}")
    print(f"Swagger Docs   : http://localhost:{port}/docs")
    print(f"Admin Login    : admin@daniedesign.com / admin123456")
    print("=" * 55)
    
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
