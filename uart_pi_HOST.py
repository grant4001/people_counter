import serial
import cv2
import numpy as np
import time

buffer = []
old_time = 0.0
idx_saved = 0
ser = serial.Serial("/dev/ttyUSB0", 921600)    #Open port with baud rate
while True:
    idx_buffer = []
    buffer += ser.read(ser.inWaiting())
    #for idx in range(idx_saved, len(buffer) - 1):
    for idx in range(0, len(buffer) - 1):
        if buffer[idx] == 0xff and buffer[idx + 1] == 0xd8:
            idx_buffer.append(idx)
    #idx_saved = len(buffer) - 1
    #print(len(idx_buffer))   
    
    if len(idx_buffer) > 1:
        print('full')
        image = buffer[idx_buffer[0]:idx_buffer[1]]
        print(len(bytes(image)))
        # with open('im.jpg', 'wb') as f:
            # f.write(bytes(image)) 
        # with open('im.jpg', 'rb') as f:
            # buf = f.read()
            # x = np.fromstring(buf, dtype='uint8')
        #img = cv2.imdecode(x, cv2.IMREAD_UNCHANGED)

        im = cv2.imdecode(np.frombuffer(bytes(image),dtype='uint8'), cv2.IMREAD_UNCHANGED)

        cv2.imshow('image', im)
        # cv2.waitKey(1) 

        key = cv2.waitKey(1) & 0xFF
        # clear the stream in preparation for the next frame
        # rawCapture.truncate(0)
        # if the `q` key was pressed, break from the loop
        if key == ord("q"):
            break
           
        buffer = buffer[idx_buffer[1]:]
        idx_saved = 0


        print(time.time() - old_time)
        old_time = time.time()

