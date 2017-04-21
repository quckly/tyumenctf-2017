precalc = [None] * 256

def generator():
    precalc[0] = 1
    precalc[1] = 1
    precalc[2] = 1
    
    for i in range(3, 256):
        precalc[i] = precalc[i - 3] + precalc[i - 2] + precalc[i - 1]
    
def stream(ch):
    return precalc[ch % 256] % 256

generator()

#print(precalc)
#for i in range(256):
#    print(crypto_stream(i))

read_data = None
with open('flag.txt.encrypted', 'rb') as f:
    read_data = f.read()
    
result = ""
cipherKey = 577
for c in read_data:
    idx = c ^ stream(cipherKey)
    cipherKey = (cipherKey * cipherKey) % 997
    result = result + chr(idx)

with open('flag.txt.decrypted', 'w') as f:
    f.write(result)
