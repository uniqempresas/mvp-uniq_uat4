---
name: python-patterns
description: Python best practices, idioms, FastAPI, and Python design patterns for production code.
---

# Python Patterns

> Python best practices for clean, maintainable code.

---

## 1. Pythonic Code

### Idioms
```python
# List comprehension
squares = [x**2 for x in range(10)]

# Dictionary comprehension
square_dict = {x: x**2 for x in range(10)}

# Generator expression
sum_of_squares = sum(x**2 for x in range(10))

# Context managers
with open('file.txt', 'r') as f:
    content = f.read()

# Unpacking
a, b = 1, 2
first, *rest = [1, 2, 3, 4]
```

---

## 2. Type Hints

```python
from typing import List, Dict, Optional, Union

def greet(name: str) -> str:
    return f"Hello, {name}!"

def process_items(items: List[int]) -> Dict[str, int]:
    return {f"item_{i}": item for i, item in enumerate(items)}

def find_user(user_id: int) -> Optional[User]:
    # Returns User or None
    pass
```

---

## 3. FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}")
async def get_user(user_id: int) -> User:
    user = await fetch_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users")
async def create_user(user: User) -> User:
    return await save_user(user)
```

---

## 4. Error Handling

```python
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise
except Exception as e:
    logger.exception("Unexpected error")
    raise CustomError("Operation failed") from e
else:
    # Success case
    process_result(result)
finally:
    # Cleanup
    cleanup()
```

---

## 5. Best Practices

- ✅ Use type hints
- ✅ Follow PEP 8
- ✅ Use virtual environments
- ✅ Write docstrings
- ✅ Handle exceptions
- ✅ Use list/dict comprehensions wisely
- ✅ Prefer generators for large data

---

> **Remember:** Python is about readability. Explicit is better than implicit.
