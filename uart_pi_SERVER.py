# import the necessary package
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import serial
# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = (320, 240)
camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(320, 240))

# PI STUFF
ser = serial.Serial(port='/dev/ttyS0', baudrate=921600)
print(ser)

# allow the camera to warmup
time.sleep(0.1)
# capture frames from the camera
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
    # if the `q` key was pressed, break from the loop
    ser.write(encimage.tobytes())