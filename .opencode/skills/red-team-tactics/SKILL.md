---
name: red-team-tactics
description: Offensive security, penetration testing, and red team exercise methodologies.
---

# Red Team Tactics

> Offensive security testing and ethical hacking.

---

## 1. Methodology

### Reconnaissance
- Information gathering
- Technology fingerprinting
- Subdomain enumeration

### Vulnerability Scanning
- Automated tools (Nessus, OpenVAS)
- Manual inspection
- Configuration review

### Exploitation
- Verify vulnerabilities
- Determine impact
- Maintain access (if in scope)

### Reporting
- Executive summary
- Technical details
- Proof of concept
- Remediation steps

---

## 2. Common Tests

### SQL Injection
```bash
curl "http://target.com/user?id=1' OR '1'='1"
```

### XSS
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

### Authentication Bypass
- JWT manipulation
- Session fixation
- IDOR testing

---

## 3. Tools

- **Burp Suite** - Web proxy
- **OWASP ZAP** - Web scanner
- **Metasploit** - Exploitation framework
- **Nmap** - Port scanning
- **SQLMap** - SQL injection

---

## 4. Rules of Engagement

- ✅ Written authorization
- ✅ Defined scope
- ✅ Emergency contacts
- ✅ Known testing window
- ✅ Legal compliance

---

> **Remember:** Only test with explicit authorization. Unauthorized testing is illegal.
