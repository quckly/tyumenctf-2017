def crypto_stream(ch):
    if ch < 3:
        return 1
    
    return crypto_stream(ch - 3) + crypto_stream(ch - 2) + crypto_stream(ch - 1)

read_data = None
with open('flag.txt.encrypted', 'rb') as f:
    read_data = f.read()
    
result = ""
cipherKey = i_dont_know
for c in read_data:
    idx = c ^ (crypto_stream(cipherKey % 256) % 256)
    cipherKey = (cipherKey * cipherKey) % 997
    result = result + chr(idx)

with open('flag.txt.decrypted', 'w') as f:
    f.write(result)
