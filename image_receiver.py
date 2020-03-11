import serial
import cv2
import numpy as np
import time

class ImageReceiver:
    def __init__(self, port="/dev/ttyUSB0",baudrate=921600):
        self.ser = serial.Serial(port,baudrate)

    def next_image(self):
        buffer = []
        while True:
            idx_buffer = []
            buffer += self.ser.read(self.ser.inWaiting())
            for idx in range(0, len(buffer) - 1):
                if buffer[idx] == 0xff and buffer[idx + 1] == 0xd8:
                    idx_buffer.append(idx)   
    
            if len(idx_buffer) > 1:
                image = buffer[idx_buffer[0]:idx_buffer[1]]
                im_bytes = bytes(image)
                print(len(im_bytes))

                im = cv2.imdecode(np.frombuffer(im_bytes,dtype='uint8'),
                                  cv2.IMREAD_UNCHANGED)

                return im

if __name__ == "__main__":
    receiver = ImageReceiver()
    ts = time.time()
    while True:
        im = receiver.next_image()
        cv2.imshow("frame", im)
        key = cv2.waitKey(1) & 0xFF
        next_ts = time.time()
        print(next_ts - ts)
        ts = next_ts
