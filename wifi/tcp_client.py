import socket

TCP_IP = '192.168.1.96'
TCP_PORT = 8008
BUFFER_SIZE = 1024
MESSAGE = 'Hi there.'

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((TCP_IP, TCP_PORT))
s.send(MESSAGE.encode())

# Blocking call to recv
data = s.recv(BUFFER_SIZE)
s.close()

print("Received data: ")
print(data)