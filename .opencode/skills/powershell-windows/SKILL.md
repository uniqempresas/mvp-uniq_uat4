---
name: powershell-windows
description: PowerShell scripting, Windows automation, and system administration.
---

# PowerShell

> Windows automation and system administration.

---

## 1. Basic Commands

### Navigation
```powershell
Get-Location           # pwd equivalent
Set-Location C:\      # cd equivalent
Get-ChildItem          # ls equivalent
```

### File Operations
```powershell
Copy-Item file1 file2
Move-Item file1 file2
Remove-Item file
New-Item file -Type File
New-Item dir -Type Directory
```

---

## 2. PowerShell Features

### Variables
```powershell
$name = "World"
Write-Output "Hello, $name!"
```

### Objects
```powershell
Get-Process | Where-Object { $_.CPU -gt 100 }
Get-Service | Select-Object Name, Status
```

### Pipelines
```powershell
Get-ChildItem | Where-Object { $_.Length -gt 1MB }
```

---

## 3. Scripting

### Basic Script
```powershell
# Script.ps1
param(
    [string]$Name = "World"
)

Write-Output "Hello, $Name!"

# Conditional
if (Test-Path "file.txt") {
    Write-Output "File exists"
} else {
    Write-Output "File not found"
}

# Loop
for ($i = 1; $i -le 3; $i++) {
    Write-Output "Number: $i"
}

# Function
function Greet {
    param([string]$Name)
    Write-Output "Hello, $Name!"
}

Greet -Name "Alice"
```

---

## 4. Best Practices

- ✅ Use verb-noun naming
- ✅ Handle errors with try-catch
- ✅ Use proper parameters
- ✅ Document with comments

---

> **Remember:** PowerShell is object-oriented. Leverage its power.
