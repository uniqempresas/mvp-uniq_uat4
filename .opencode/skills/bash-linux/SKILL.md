---
name: bash-linux
description: Linux commands, shell scripting, and system administration for development environments.
---

# Bash/Linux

> Command line proficiency for Linux systems.

---

## 1. Basic Commands

### Navigation
```bash
pwd              # Print working directory
cd /path         # Change directory
ls -la           # List all files
cd ~             # Home directory
cd -             # Previous directory
```

### File Operations
```bash
cp file1 file2   # Copy
mv file1 file2   # Move/rename
rm file          # Remove
rm -rf dir       # Remove directory
mkdir dir        # Create directory
touch file       # Create empty file
```

### Viewing Files
```bash
cat file         # Display file
less file        # View with pagination
head -n 20 file  # First 20 lines
tail -n 20 file  # Last 20 lines
tail -f file     # Follow file changes
```

---

## 2. Intermediate Commands

### Search
```bash
grep "pattern" file       # Search in file
grep -r "pattern" dir     # Recursive search
find . -name "*.ts"       # Find files
locate filename          # Find in database
```

### Process Management
```bash
ps aux                    # List processes
kill PID                  # Kill process
kill -9 PID              # Force kill
top                      # System monitor
htop                     # Better top (if installed)
```

### Permissions
```bash
chmod 755 file           # Change permissions
chown user:group file    # Change owner
sudo command             # Run as superuser
```

---

## 3. Shell Scripting

### Basic Script
```bash
#!/bin/bash

# Variables
NAME="World"
echo "Hello, $NAME!"

# Conditional
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File not found"
fi

# Loop
for i in 1 2 3; do
    echo "Number: $i"
done

# Function
greet() {
    echo "Hello, $1!"
}

greet "Alice"
```

---

## 4. Best Practices

- ✅ Quote variables: "$var"
- ✅ Check exit codes: $?
- ✅ Use set -e for error handling
- ✅ Comment complex logic
- ✅ Test scripts thoroughly

---

> **Remember:** The command line is powerful. Use it wisely.
