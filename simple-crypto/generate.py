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

read_data = None
with open('flag.txt', 'r') as f:
    read_data = f.read()
    
write_data = []
i = 577
for c in read_data:
    idx = ord(c)
    idx = idx ^ stream(i)
    i = (i * i) % 997
    write_data.append(idx)
    
with open('flag.txt.encrypted', 'wb') as f:
    f.write(bytes(write_data))

