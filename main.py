from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.delete("/api/v1/clear-history")
def clear_history():
    # Placeholder for clean session termination logic
    try:
        # TODO: Implement actual state clearance logic here
        pass
    except Exception as e:
        # Log the error, but return a safe response
        return {"status": "error", "message": "Failed to clear history"}
    return {"status": "success", "message": "Session history cleared"}