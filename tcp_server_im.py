import socket
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2



# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = (320, 240)
camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(320, 240))

# networking interface
TCP_IP = 'raspberrypi'
TCP_PORT = 8008
BUFFER_SIZE = 1024
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((socket.gethostbyname(TCP_IP), TCP_PORT))
s.listen(1)

# allow the camera to warmup
time.sleep(0.1)

conn, addr = s.accept()
print('Connection address: ')
print(addr)

while 1:
    for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
        # grab the raw NumPy array representing the image, then initialize the timestamp
        # and occupied/unoccupied text
        image = frame.array
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 60]
        result, encimage = cv2.imencode('.jpg', image, encode_param)
        # show the frame
        # cv2.imshow("Frame", image)
        # clear the stream in preparation for the next frame
        rawCapture.truncate(0)
        try:
            conn.send(encimage.tobytes())
        except ConnectionResetError:
            print("Connection reset")
        except BrokenPipeError:
            print("Connection lost")
            conn, addr = s.accept()
conn.close()