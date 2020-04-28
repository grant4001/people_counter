import socket

TCP_IP = '192.168.1.96'
TCP_PORT = 8008
BUFFER_SIZE = 1024

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((TCP_IP, TCP_PORT))
s.listen(1)


conn, addr = s.accept()
print('Connection address: ')
print(addr)

while 1:
    data = conn.recv(BUFFER_SIZE)
    if not data: break
    print('Received data: ')
    print(data)
    conn.send(data) # echo
conn.close()