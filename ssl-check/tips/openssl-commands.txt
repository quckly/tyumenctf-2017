openssl ecparam -out ec-secp384r1.pem -name secp384r1
openssl req -x509 -nodes -days 3652 -sha256 -newkey ec:ec-secp384r1.pem -keyout ca.key -out ca.crt -subj '/CN=Hacker_CA/O=TyumenStateUniversity_Hacker_Dep.'
openssl req -nodes -newkey ec:ec-secp384r1.pem -keyout server.key -new -out server.csr -subj '/CN=Web_Master'
openssl ca -policy policy_anything -keyfile ca.key -cert ca.crt -in server.csr -out server.crt -outdir .
openssl req -nodes -newkey ec:ec-secp384r1.pem -keyout client.key -new -out client.csr -subj '/CN=Admin'
openssl ca -policy policy_anything -keyfile ca.key -cert ca.crt -in client.csr -out client.crt -outdir .
openssl pkcs12 -export -out client.pfx -inkey client.key -in client.crt -certfile ca.crt
