# Generating JWT Keys:

Private key:
```bash
openssl genrsa -out keys/private_key.pem 2048
```

Public key:
```bash
openssl rsa -in keys/private_key.pem -outform PEM -pubout -out keys/public_key.pem
```